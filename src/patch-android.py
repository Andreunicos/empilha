# Aplica as configurações do Big Stack no projeto Android gerado pelo Capacitor.
import re
p='android/app/build.gradle';s=open(p).read()
if 'VERSION_CODE' not in s:
    s=s.replace('''        versionCode 1
        versionName "1.0"''','''        // Número da versão vem do GitHub Actions (cada build = +1)
        versionCode ((System.getenv("VERSION_CODE") ?: "1") as Integer)
        versionName "1.1." + (System.getenv("VERSION_CODE") ?: "1")
        // ID do app no AdMob (vem do workflow). Vazio = ID de teste do Google.
        manifestPlaceholders = [admobAppId: (System.getenv("ADMOB_APP_ID") ?: "ca-app-pub-3940256099942544~3347511713")]''')
    s=s.replace('''    buildTypes {
        release {''','''    signingConfigs {
        release {
            if (System.getenv("KEYSTORE_PATH")) {
                storeFile file(System.getenv("KEYSTORE_PATH"))
                storePassword System.getenv("KEYSTORE_PASSWORD")
                keyAlias System.getenv("KEY_ALIAS")
                keyPassword System.getenv("KEY_PASSWORD")
            }
        }
    }
    buildTypes {
        release {
            if (System.getenv("KEYSTORE_PATH")) signingConfig signingConfigs.release''')
    open(p,'w').write(s)
p='android/app/src/main/AndroidManifest.xml';s=open(p).read()
if 'APPLICATION_ID' not in s:
    s=s.replace('''        android:theme="@style/AppTheme">
''','''        android:theme="@style/AppTheme">

        <meta-data
            android:name="com.google.android.gms.ads.APPLICATION_ID"
            android:value="${admobAppId}"/>
''',1)
    s=s.replace('android:launchMode="singleTask"','android:launchMode="singleTask"\n            android:screenOrientation="portrait"')
    s=s.replace('<uses-permission android:name="android.permission.INTERNET" />','<uses-permission android:name="android.permission.INTERNET" />\n    <uses-permission android:name="android.permission.VIBRATE" />')
    open(p,'w').write(s)
print('ok')
