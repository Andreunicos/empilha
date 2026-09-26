package com.bighouse.bigstack;

import com.getcapacitor.JSObject;
import com.getcapacitor.Plugin;
import com.getcapacitor.PluginCall;
import com.getcapacitor.PluginMethod;
import com.getcapacitor.annotation.CapacitorPlugin;
import com.google.android.gms.games.GamesSignInClient;
import com.google.android.gms.games.PlayGames;
import com.google.android.gms.games.SnapshotsClient;
import com.google.android.gms.games.snapshot.Snapshot;
import com.google.android.gms.games.snapshot.SnapshotMetadataChange;
import java.nio.charset.StandardCharsets;

/**
 * Save na nuvem do Google Play Games (Jogos salvos / Snapshots).
 * O jogo manda o save (texto já selado) e lê de volta em qualquer celular com a mesma conta Play Games.
 */
@CapacitorPlugin(name = "PlayGamesSave")
public class PlayGamesSavePlugin extends Plugin {

    private static final String DEFAULT_SLOT = "bigstack_save";

    @PluginMethod
    public void signIn(PluginCall call) {
        final boolean interactive = Boolean.TRUE.equals(call.getBoolean("interactive", false));
        final GamesSignInClient client = PlayGames.getGamesSignInClient(getActivity());
        client.isAuthenticated().addOnCompleteListener(task -> {
            boolean ok = task.isSuccessful() && task.getResult() != null && task.getResult().isAuthenticated();
            if (ok) {
                resolvePlayer(call);
            } else if (interactive) {
                client.signIn().addOnCompleteListener(t2 -> {
                    boolean ok2 = t2.isSuccessful() && t2.getResult() != null && t2.getResult().isAuthenticated();
                    if (ok2) {
                        resolvePlayer(call);
                    } else {
                        JSObject r = new JSObject();
                        r.put("signedIn", false);
                        call.resolve(r);
                    }
                });
            } else {
                JSObject r = new JSObject();
                r.put("signedIn", false);
                call.resolve(r);
            }
        });
    }

    private void resolvePlayer(final PluginCall call) {
        PlayGames.getPlayersClient(getActivity()).getCurrentPlayer().addOnCompleteListener(task -> {
            JSObject r = new JSObject();
            r.put("signedIn", true);
            if (task.isSuccessful() && task.getResult() != null) {
                r.put("playerId", task.getResult().getPlayerId());
                r.put("name", task.getResult().getDisplayName());
            }
            call.resolve(r);
        });
    }

    @PluginMethod
    public void save(PluginCall call) {
        final String name = call.getString("name", DEFAULT_SLOT);
        final String data = call.getString("data");
        final String desc = call.getString("description", "");
        if (data == null) {
            call.reject("missing data");
            return;
        }
        final SnapshotsClient sc = PlayGames.getSnapshotsClient(getActivity());
        sc.open(name, true, SnapshotsClient.RESOLUTION_POLICY_MOST_RECENTLY_MODIFIED).addOnCompleteListener(task -> {
            if (!task.isSuccessful() || task.getResult() == null || task.getResult().getData() == null) {
                call.reject("open failed", task.getException());
                return;
            }
            final Snapshot snap = task.getResult().getData();
            try {
                snap.getSnapshotContents().writeBytes(data.getBytes(StandardCharsets.UTF_8));
                SnapshotMetadataChange change = new SnapshotMetadataChange.Builder().setDescription(desc).build();
                sc.commitAndClose(snap, change).addOnCompleteListener(t2 -> {
                    if (t2.isSuccessful()) {
                        JSObject r = new JSObject();
                        r.put("ok", true);
                        call.resolve(r);
                    } else {
                        call.reject("commit failed", t2.getException());
                    }
                });
            } catch (Exception e) {
                sc.discardAndClose(snap);
                call.reject("write failed", e);
            }
        });
    }

    @PluginMethod
    public void load(PluginCall call) {
        final String name = call.getString("name", DEFAULT_SLOT);
        final SnapshotsClient sc = PlayGames.getSnapshotsClient(getActivity());
        sc.open(name, true, SnapshotsClient.RESOLUTION_POLICY_MOST_RECENTLY_MODIFIED).addOnCompleteListener(task -> {
            if (!task.isSuccessful() || task.getResult() == null || task.getResult().getData() == null) {
                call.reject("open failed", task.getException());
                return;
            }
            final Snapshot snap = task.getResult().getData();
            try {
                byte[] bytes = snap.getSnapshotContents().readFully();
                JSObject r = new JSObject();
                r.put("data", bytes == null ? "" : new String(bytes, StandardCharsets.UTF_8));
                r.put("modifiedAt", snap.getMetadata().getLastModifiedTimestamp());
                sc.discardAndClose(snap);
                call.resolve(r);
            } catch (Exception e) {
                sc.discardAndClose(snap);
                call.reject("read failed", e);
            }
        });
    }
}
