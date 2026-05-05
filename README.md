# ShiftMate

Preprost mobile app za sledenje študentskim uram (ure + zaslužek).

Narejeno kot vadni projekt v React Native (Expo). Vse teče lokalno, brez backenda.

## Setup

```bash
npm install
npx expo start
```

... in skeniraj QR kodo z Expo Go na telefonu.

## Kaj sploh dela?

- Dashboard: ure ta mesec, približen zaslužek, število šihtov, naslednji šiht
- Seznam šihtov (po datumu)
- Dodaj / uredi / izbriši šiht
- Osnovna validacija (ure, rate, itd.)
- Statistika (mesečni zaslužek, ure po podjetju, povprečen rate)
- Nastavitve (valuta + reset podatkov)
- Light / dark mode
- Demo podatki ob prvem zagonu

## Uporabljene tehnologije

- Expo
- React Native
- TypeScript
- Expo Router
- SQLite (expo-sqlite)

## Screenshoti

<p>
  <img src="./assets/screenshots/homepage.jpeg" alt="Dashboard" width="230" />
  <img src="./assets/screenshots/addshift.jpeg" alt="Dodaj smeno" width="230" />
  <img src="./assets/screenshots/shifts.jpeg" alt="Vse smene" width="230" />
</p>

<p>
  <img src="./assets/screenshots/stats.jpeg" alt="Statistika" width="230" />
  <img src="./assets/screenshots/settings.jpeg" alt="Nastavitve" width="230" />
</p>
