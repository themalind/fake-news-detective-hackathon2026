# CLAUDE.md — Fake News Detective

Regler som alltid gäller i det här projektet.

## Språk
- All UI-text och allt synligt innehåll på **svenska**.
- Variabel- och funktionsnamn på engelska (standard JS/TS-konvention).
- Kod-kommentarer på svenska eller engelska — välj vad som är tydligast.

## Ton i texter
- **Lekfullt journalistisk.** Inspireras av kvällstidnings-rubriker och deckar-känsla, men håll det vänligt och inkluderande — aldrig elakt eller cyniskt.
- Konkret och rapp framför formell. Korta meningar > långa.
- Ok med dramatik, ordvitsar och lite glimten i ögat ("Fallet är ditt, detektiv.").
- Undvik tråkigt teknik-språk i UI ("Ett fel inträffade" → "Hoppsan, något gick snett.").

## Responsivitet
- Allt ska funka från **mobil (320px)** upp till desktop. Mobile-first tänk.
- Använd `clamp()`, flex/grid, relativa enheter. Undvik fasta px-bredder för layout.
- Tryckytor ska vara minst 44×44px på mobil.

## Stack
- React 19 + TypeScript + Vite
- SCSS med **BEM-namngivning** (`block__element--modifier`), variabler i `src/styles/_variables.scss`
- **Inga UI-bibliotek** — ingen Bootstrap, MUI, Tailwind, Chakra etc. Vi bygger från scratch.
- npm som pakethanterare.

## Kodstil
- **Inget onödigt tjafs.** Minsta möjliga lösning som löser uppgiften — inga abstraktioner "ifall vi behöver det sen".
- Inga kommentarer som beskriver VAD koden gör — namnge variabler/funktioner tydligt istället. Skriv kommentarer bara när VARFÖR är icke-uppenbart.
- Fråga innan större refaktoreringar eller innan nya beroenden läggs till.
- Hellre en lång, läsbar komponent än tre prematur-utbrutna halvgenerella.

## Storage
- Mockdata ligger i separata filer under `src/data/`.
- Spelstatistik och persistent state lagras via wrappern i `src/utils/storage.js` (localStorage med prefix `fnd:`).
