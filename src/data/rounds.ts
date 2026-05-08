export interface Round {
  id: string;
  number: number;
  title: string;
  focus: string;
  description: string;
  tips: string[];
  caseIds: string[];
}

export const ROUNDS: Round[] = [
  {
    id: "round-1",
    number: 1,
    title: "Domän & Källa",
    focus: "URL-granskning",
    description:
      "Vet du vem som äger sajten du läser? Bluffnyheter gömmer sig bakom adresser som nästan ser äkta ut. I den här rundan lär du dig granska domännamn, döda källhänvisningar och sponsored content.",
    tips: [
      "Kolla domänändelsen",
      "En artikel utan fungerande källänkar har inget underlag.",
      "Sponsrat innehåll måste märkas — letar du noga hittar du det.",
    ],
    caseIds: ["case-6", "case-2", "case-3"],
  },
  {
    id: "round-2",
    number: 2,
    title: "Bild & Länkgranskning",
    focus: "Bildanalys & klickbara källor",
    description:
      "En bild säger mer än tusen ord — men ofta fel ord. Bilder kan vara AI-genererade, tagna ur sitt sammanhang eller stulna från helt andra händelser. I den här rundan granskar du bilder och klickbara källhänvisningar.",
    tips: [
      "Omvänd bildsökning avslöjar om bilden dykt upp förut — och var.",
      "Zooma in — AI-genererade bilder har ofta konstiga händer och suddig text.",
      "En länk till en studie bevisar ingenting om studien är finansierad av den som säljer produkten.",
    ],
    caseIds: ["case-5", "case-9", "case-10"],
  },
  {
    id: "round-3",
    number: 3,
    title: "Känslostyrning & Rubriker",
    focus: "Emotionellt språk",
    description:
      "Rädsla, ilska, hopp — starka känslor gör oss sämre på att tänka kritiskt. Bluffnyheter vet det och utnyttjar det. I den här rundan lär du dig se när en rubrik eller artikel försöker manipulera dig med känslor snarare än fakta.",
    tips: [
      "Skrämmer rubriken dig? Läs artikeln — stämmer detaljerna?",
      "Ord som 'alla', 'alltid', 'ingen vet' och 'chock' är varningssignaler.",
      "Statistik kan vara sann men ändå vilseledande — vem valde vilka siffror?",
    ],
    caseIds: ["case-1", "case-4", "case-7"],
  },
];
