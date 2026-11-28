# PharmAssist – Client

React Native + Expo client (web, Android, iOS) for the PharmAssist application.

PharmAssist: AI-supported personalized medication information system. Checks drug interactions, contraindications and equivalent medication candidates based on a user's health profile. YU Senior Project 2026-2027.

## Environment

- **Expo SDK:** 58 (`~58.0.26`)
- **React Native:** `0.88.1`
- **React:** `19.3.0`
- **TypeScript:** `~6.0.3`
- **Node.js:** 24 LTS, version 24.3.0 or newer within the 24.x release line
- **npm:** Use the version bundled with Node.js.
- **Expo Go:** Install the version that supports Expo SDK 58 on your Android device or iPhone.

## Local setup

Clone the repository and install the locked dependencies:

```bash
git clone https://github.com/pharmassist-yu/pharmassist-client.git
cd pharmassist-client
npm ci
```

Start the backend following the [backend setup guide](https://github.com/pharmassist-yu/pharmassist-backend#local-setup), then copy the API configuration template:

```bash
cp .env.example .env
```

On Windows PowerShell, use `Copy-Item .env.example .env`.

- **Web on the same computer:** Keep `EXPO_PUBLIC_API_URL=http://localhost:8080`.
- **Android or iPhone on the same Wi-Fi:** Replace `localhost` with the backend computer's local IP address. For example, use `EXPO_PUBLIC_API_URL=http://192.168.1.42:8080` if that is its address.

Use the base URL without an `/api` suffix. Restart Expo after changing `.env`. Keep secrets out of `EXPO_PUBLIC_*` variables because Expo includes their values in the client bundle. You can open the screens and try mock registration before the backend is available.

## Run the client

### Web

Run `npm run web` and open the local address printed by Expo in your browser.

### Android and iPhone

1. Connect your computer and phone to the same Wi-Fi and run `npm start -- --go`.
2. On Android, open Expo Go and scan the terminal QR code. On iPhone, scan it with the Camera app and tap the prompt to open Expo Go.
3. If iOS asks whether Expo Go can access the local network, allow it for this test. Keep the Expo server running.

If your phone and computer are on different networks, stop Expo with `Ctrl+C` and use `npm start -- --go --tunnel`. If Expo asks you to sign in, run `npx expo login` and use the same Expo account on your phone. Scan the new QR code. The Expo tunnel serves the client only. To test the backend connection, the phone also needs a route to the backend URL.

### Verify the backend connection

Open Home (**Ana Sayfa**) and check the **Sunucu Bağlantısı** card. A successful connection shows HTTP 200 and `ok`. If the card shows an error, open `/api/ping` at the configured backend URL in the browser on the same device. Once the endpoint responds, tap **Tekrar Dene** in the app.

## Project Structure

- `src/app/` — Expo Router screens and layouts
- `src/components/` — Reusable UI components
- `src/constants/` — Design tokens (colors, typography)
- `src/services/` — API client and backend service calls

## Checks

- `npm run lint` — Run ESLint
- `npm run format:check` — Check Prettier formatting
- `npx tsc --noEmit` — Check TypeScript types

After a fresh clone, start Expo once before running the TypeScript check so Expo Router can generate the route types.

