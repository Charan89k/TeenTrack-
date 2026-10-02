# TeenTrack

A minimal money tracker for teens, built with React + Vite + Tailwind. All data stays on-device (Capacitor Preferences / localStorage).

## 📲 Download for Android

<a href="https://github.com/PavanSai-25/TeenTrack-/releases/latest/download/TeenTrack.apk">
  <img src="https://img.shields.io/badge/Download-APK-E50914?style=for-the-badge&logo=android&logoColor=white" alt="Download APK" height="48">
</a>

**[⬇️ Download TeenTrack.apk](https://github.com/PavanSai-25/TeenTrack-/releases/latest/download/TeenTrack.apk)**

How to install:
1. Tap the button above on your Android phone. The APK downloads straight away.
2. Open the downloaded file. If Android asks, allow **"Install unknown apps"** for your browser or file manager.
3. Tap **Install** and open TeenTrack.

Requires Android 7.0 or newer. All releases are listed under [Releases](https://github.com/PavanSai-25/TeenTrack-/releases).

## Web

```bash
npm install
npm run dev        # http://localhost:9002
npm run build
```

## Android app

The Android app is a [Capacitor](https://capacitorjs.com) wrapper around the same web build (`android/` folder, app id `com.teentrack.app`).

Requirements: Node 20+, Android Studio (or the Android SDK + JDK 21+).

```bash
npm install
npm run android:sync   # build the web app and copy it into android/
npm run android:open   # open in Android Studio, then hit Run ▶
# or, without Android Studio:
npm run android:apk    # -> android/app/build/outputs/apk/debug/app-debug.apk
```

After changing anything in `src/`, run `npm run android:sync` again before rebuilding the app.

App icon and splash screen are generated from `assets/` with `npx @capacitor/assets generate --android`.
