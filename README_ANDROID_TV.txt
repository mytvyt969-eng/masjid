JAMA MASJID KODWATAND — ANDROID TV APP

Version 1.0

This project is a native Android TV/large-screen wrapper around the dynamic dashboard.
It is designed for a 16:9 TV in landscape and launches fullscreen.

Included:
- Fixed approved dashboard layout
- Live analog/digital clock
- Prayer countdown
- Fajr/Dhuhr/Asr/Maghrib/Isha visual themes
- Jummah Adhan/Jamaat
- Fajr Start/End on one line
- Sunrise/Sunset
- TV launcher/Leanback support

Important:
This source project still uses demo prayer times in assets/app.js. For the final mosque installation,
replace them with the real daily prayer-time source/settings.

BUILD:
1. Open this folder in Android Studio.
2. Let Android Studio install the required Android SDK/Gradle components.
3. Build > Build APK(s).
4. Install the generated APK on the Android TV.

For a production iteration, add:
- Admin/settings screen for prayer times
- Automatic daily prayer-time calculation/API
- Hijri date calculation
- Dedicated wallpaper assets for each prayer period
- Remote/phone configuration
- Optional Adhan audio and scheduled announcements
