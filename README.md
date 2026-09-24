# Empilha!

Jogo mobile de empilhar blocos (Android), feito com HTML + Capacitor.

- `www/` — o jogo (index.html) e a ponte nativa gerada (`native.js`)
- `src/native.js` — AdMob (vídeo premiado) e Google Play Billing (cristais)
- `android/` — projeto Android
- `store/` — ícone, arte, prints e textos da Play Store
- `docs/` — site com a Política de Privacidade (GitHub Pages)

## Como sai uma versão nova
Todo envio para a branch `main` roda o GitHub Actions ("Montar app Android") e cria um **Release** com:
- `empilha-1.0.N.aab` → enviar para o Google Play Console
- `empilha-1.0.N.apk` → instalar direto no celular para testar

## Configuração (Settings > Secrets and variables > Actions)
Segredos: `KEYSTORE_BASE64`, `KEYSTORE_PASSWORD`, `KEY_ALIAS`, `KEY_PASSWORD`
Variáveis (opcionais até ter AdMob):
- `ADMOB_APP_ID` — padrão: `ca-app-pub-4670538085926791~2800591524`
- `ADMOB_REWARDED_ID` — padrão: `ca-app-pub-4670538085926791/6171940457` (bloco "Reviver")
Sem essas variáveis, o app usa os IDs padrão acima (anúncios reais).

## Produtos no app (Play Console)
`cristais_50`, `cristais_150`, `cristais_400`, `cristais_1000` (consumíveis).
