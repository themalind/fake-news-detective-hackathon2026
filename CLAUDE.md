# Fake News Detective — Projektregler

Denna fil definierar konventionerna för projektet. Följ dem strikt i alla framtida sessioner.

## Stack
- React 19 + TypeScript + Vite
- SCSS (`sass`-paketet) för all styling
- Inga UI-bibliotek (ingen Bootstrap, MUI, Tailwind, Chakra etc.) — allt byggs från scratch
- npm som pakethanterare
- Inga libraries för state management
- Ingen react-router — använd state-baserad screen-switching tills routing verkligen behövs

## Mappstruktur
```
src/
  main.tsx          React-rot, importerar global SCSS
  App.tsx           root-komponent med screen-state
  pages/            en .tsx + matchande .scss per vy
  components/       delade komponenter, varje med egen .scss
  context/          React Context + useReducer för global state
  data/             mockdata i .ts
  types/            TypeScript-typer
  utils/            hjälpfunktioner
  styles/
    _variables.scss design tokens (färger, radius, max-width, spacing)
    global.scss     reset + body-styling
  vite-env.d.ts     vite/client + module declarations för *.scss
```

## SCSS-konventioner
- BEM-namngivning: `block__element--modifier`
- `@use 'styles/variables' as *;` i topp av varje SCSS-fil
- En `.scss` per komponent/page, importeras i komponentens `.tsx`
- Vite är konfigurerad med `loadPaths: ['src']` så imports kan vara från projektroten utan `../../`

## State & persistens
- `src/utils/storage.ts` är en localStorage-wrapper med prefix `fnd:` och get/set/remove som hanterar JSON-serialisering
- Persistent state lever i `useReducer` via `GameContext` och syncar till localStorage genom wrappern
- Lägg inte till nya state-management-bibliotek

## Responsivitet
- Mobile-first
- Stöd från 320px upp till desktop
- Använd `clamp()`, flex, grid, relativa enheter
- Tryckytor minst 44×44px på mobil (variabel `$tap-target-min`)
- Inga fasta px-bredder för layout

## Kodstil
- Inget tjafs — minsta möjliga lösning, inga "ifall vi behöver det sen"-abstraktioner
- Inga features, refactors eller abstraktioner utöver vad uppgiften kräver
- Inga kommentarer som beskriver VAD koden gör — namnge variabler/funktioner tydligt istället
- Skriv kommentarer bara för icke-uppenbara VARFÖR (dolda constraints, subtila invarianter, workarounds)
- Hellre en lång läsbar komponent än flera prematur-utbrutna halvgenerella
- Validera bara vid systemgränser (user input, externa API:er) — lita på intern kod

## Språk
- UI: svenska
- Kommentarer: svenska eller engelska — välj det som är tydligast i sammanhanget
- Kodidentifierare: engelska

## Skript
- `npm run dev` — Vite dev server
- `npm run build` — TypeScript check + production build
- `npm run preview` — preview av build
