# PharmAssist – Client

React Native + Expo client (web, Android, iOS) for the PharmAssist application.

PharmAssist: AI-supported personalized medication information system. Checks drug interactions, contraindications and equivalent medication candidates based on a user's health profile. YU Senior Project 2026-2027.

## Environment

- **Expo SDK:** 58 (`~58.0.26`)
- **React Native:** `0.88.1`
- **React:** `19.3.0`
- **TypeScript:** `~6.0.3`
- **Node.js:** `>= 20` (tested on `v24.15.0`)

## Project Structure

- `src/app/` — Expo Router screens and layouts
- `src/components/` — Reusable UI components
- `src/constants/` — Design tokens (colors, typography)
- `src/services/` — API client and backend service calls

## Basic Commands

- `npm install` — Install dependencies
- `npx expo start` — Start development server (web, Android, iOS)
- `npm run lint` — Run ESLint
- `npm run format:check` — Check Prettier formatting

