package com.bighouse.bigstack;

import android.os.Bundle;
import com.getcapacitor.BridgeActivity;
import com.google.android.gms.games.PlayGamesSdk;

public class MainActivity extends BridgeActivity {
    @Override
    public void onCreate(Bundle savedInstanceState) {
        registerPlugin(PlayGamesSavePlugin.class);
        super.onCreate(savedInstanceState);
        // Play Games: login automático e save na nuvem
        PlayGamesSdk.initialize(this);
    }
}
