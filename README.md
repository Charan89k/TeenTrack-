# TeenTrack

A minimal money tracker for teens, built with React + Vite + Tailwind. All data stays on-device (Capacitor Preferences / localStorage).

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
