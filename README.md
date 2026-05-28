# ShiftMate

Simple mobile app for tracking work hours and earnings.

Built for personal use as a wage and work hours management app. Everything runs locally, without a real backend.

## Setup

```bash
npm install
npx expo start
```

Scan the QR code with Expo Go on your phone.

## Features

- dashboard with monthly hours, estimated earnings, number of shifts, and next shift
- shift list by date
- add / edit / delete shifts
- basic validation for hours, rate, etc.
- statistics for monthly earnings, hours by company, and average rate
- settings for currency and data reset
- light / dark mode
- demo data on first start

## Tech

- Expo
- React Native
- TypeScript
- Expo Router
- SQLite `expo-sqlite`

## Screenshots

<p>
  <img src="./assets/screenshots/homepage.jpeg" alt="Dashboard" width="230" />
  <img src="./assets/screenshots/addshift.jpeg" alt="Add shift" width="230" />
  <img src="./assets/screenshots/shifts.jpeg" alt="All shifts" width="230" />
</p>

<p>
  <img src="./assets/screenshots/stats.jpeg" alt="Statistics" width="230" />
  <img src="./assets/screenshots/settings.jpeg" alt="Settings" width="230" />
</p>
