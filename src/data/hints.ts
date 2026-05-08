// Källkritiska hintar som visas i höger kolumn innan användaren klassificerat ett case.
// Tonen följer projektets riktlinje: lekfullt journalistisk, deckar-känsla.

export type Hint = {
  title: string;
  body: string;
};

export const SOURCE_CRITIC_HINTS: Hint[] = [
  {
    title: 'Vem står bakom?',
    body: 'Är källan en etablerad redaktion, en blogg eller ett anonymt konto? Saknas redaktionell information eller ansvarig utgivare är det en varningsflagga.',
  },
  {
    title: 'Stora ord, lite bevis?',
    body: 'Ord som "bevisar", "chock" och "för alltid" är dramatiska. Kolla om texten faktiskt backar upp rubriken — eller om dramatiken bara finns i headlinen.',
  },
  {
    title: 'Var är studien?',
    body: 'Påstås det att en studie visar något? Då ska studien gå att hitta — namn, institution, antal deltagare och tidskrift. Saknas det, var skeptisk.',
  },
  {
    title: 'Bekräftar någon annan?',
    body: 'Om händelsen är stor brukar flera oberoende medier rapportera. Hittar du bara en (okänd) källa — ta ett varv till.',
  },
  {
    title: 'Vem tjänar pengar på det?',
    body: 'Sponsrade artiklar, annonsbilagor och experter med koppling till produkten är inte oberoende. Leta efter "annons" eller intressekonflikter.',
  },
  {
    title: 'Bilden — är den från i dag?',
    body: 'En verklig bild kan användas i fel sammanhang. Omvänd bildsökning visar var bilden först dök upp och om datumet stämmer.',
  },
  {
    title: 'Brådskebudskap = bromsa',
    body: '"Dela innan det tas bort" och tickande klockor är klassiska tricks för att stänga av ditt kritiska tänkande. Stanna upp en gång extra.',
  },
  {
    title: 'Datum, tack',
    body: 'En odaterad artikel eller ett återupplivat gammalt inlägg kan se aktuellt ut. Kolla publiceringsdatum och om händelsen fortfarande är relevant.',
  },
  {
    title: 'Citat utan källa',
    body: '"Experter säger..." och "anonyma källor nära beslutet..." är ofta varningssignaler. Trovärdiga artiklar nämner namn, titel och sammanhang.',
  },
  {
    title: 'Rubrik vs innehåll',
    body: 'Ibland är texten korrekt — men rubriken är pumpad. Läs hela artikeln innan du dömer av, och jämför vad som faktiskt står med vad rubriken lovar.',
  },
  {
    title: 'Tre-källor-regeln',
    body: 'Trovärdig fakta bekräftas oftast av flera oberoende källor. Hittar du bara en — och den är okänd — vänta med att dela.',
  },
  {
    title: 'Åsikt eller nyhet?',
    body: 'Skiljer artikeln på saklig rapport och författarens åsikt? "Enligt SCB" är en nyhet. "Det här är skandalöst" är en åsikt.',
  },
  {
    title: 'Anatomi i AI-bilder',
    body: 'AI-bilder fastnar ofta på fingrar, ögon, tänder och text i bakgrunden. Räkna fingrar, kolla ögonens spegelbild och leta efter mjuka övergångar.',
  },
  {
    title: 'Filterbubblan',
    body: 'Om alla i ditt flöde säger samma sak — kolla om det är ett eko av algoritmen snarare än en bred bekräftelse i verkligheten.',
  },
  {
    title: 'Klickbete-rubrik?',
    body: 'Extrema rubriker som "Det här CHOCKAR experterna" är klassiska klickbeten (eng: "Clickbait") — rubriker designade för att kittla nyfikenheten utan att leverera substans. Hela poängen är att du klickar och i många fall utsatt för marknadsföring; sanningshalten är sekundär.',
  },
  {
    title: 'Produkt i fokus = vinklat',
    body: 'Pekar artikeln på en specifik produkt eller ett varumärke som "lösningen"? Riktig nyhetsrapportering är opartisk. Vinklade texter kallas ofta annonsbilagor, native ads eller sponsrat innehåll — leta efter den lilla märkningen.',
  },
  {
    title: 'Algoritmen jagar dina känslor',
    body: 'Plattformar samlar data om vad som får dig att stanna kvar. Innehåll som triggar ilska, rädsla eller chock prioriteras eftersom det engagerar — inte för att det stämmer. Förutsätt att info från okända källor är vinklad tills du kan bekräfta den någon annanstans.',
  },
];

export const URL_INSPECT_TIPS: Hint[] = [
  {
    title: 'Stämmer domänen med tidningen?',
    body: 'En artikel som påstår sig komma från SVT ska ligga på svt.se — inte svt-nyheter.se.co eller svt-blogg.com.',
  },
  {
    title: 'Look-alike-tecken',
    body: 'Bedragare byter ut tecken som ser likadana ut: 0 (noll) som O, rn som m, kyrilliska bokstäver i latinska ord. Läs domänen tecken för tecken.',
  },
  {
    title: 'Konstiga ändelser och subdomäner',
    body: 'Slutar URL:en på .co, .info eller har extra subdomäner som news.svt-blogg.com? Etablerade medier i Sverige använder oftast .se.',
  },
  {
    title: 'Hovra innan du klickar',
    body: 'Håll muspekaren över en länk utan att klicka — riktiga destinationen visas i nedre vänstra hörnet av webbläsaren. På mobil: håll fingret nedtryckt.',
  },
  {
    title: 'Hänglås i adressfältet',
    body: 'Saknas hänglåset (HTTPS) är trafiken inte krypterad. Det betyder inte automatiskt fejk, men för en seriös nyhetssajt 2025 är HTTPS ett minimum.',
  },
  {
    title: 'Slumpmässiga teckensträngar',
    body: 'En path full av siffror och bokstäver (typ /xQ7Hf2/article-id-9912) kan vara automatgenererat klickbete snarare än redaktionell journalistik.',
  },
  {
    title: 'Hur gammal är domänen?',
    body: 'Många desinfo-sajter är registrerade nyligen. En whois-koll kan visa registreringsdatum — bara dagar/veckor gammalt är en varningsflagga.',
  },
];

// Kombinerad lista som rullas i HintCard:n. URL-tipsen gör sig bra som
// allmänna detektivtips också, även om de fortfarande visas separat i
// URL-inspect-modalen för fokuserad URL-granskning.
export const DETECTIVE_HINTS: Hint[] = [
  ...SOURCE_CRITIC_HINTS,
  ...URL_INSPECT_TIPS,
];
