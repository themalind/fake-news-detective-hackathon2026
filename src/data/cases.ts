import type { Case } from '../types/game'

export const CASES: Case[] = [
  {
    id: 'case-1',
    caseNumber: 1,
    type: 'headline',
    source: 'HealthBuzz.net',
    author: 'Redaktionen',
    date: 'I dag',
    headline: 'Forskare bekräftar: choklad botar cancer',
    content:
      'En artikel påstår att dagligt intag av mörk choklad kan bota de flesta former av cancer och snart ersätta cellgifter. Texten nämner forskare och ett genombrott, men anger ingen studie, tidskrift, institution eller ansvarig forskare.',
    correctClassification: 'false',
    clues: [
      { id: 'c1-1', text: 'Publicerad på en okänd sajt utan tydlig redaktionell information', isRelevant: true },
      { id: 'c1-2', text: 'Rubriken använder "bekräftar" för ett extremt starkt medicinskt påstående', isRelevant: true },
      { id: 'c1-3', text: 'Ingen vetenskaplig tidskrift eller studie länkas', isRelevant: true },
      { id: 'c1-4', text: 'Texten använder dramatiska ord som "genombrott" och "ersätta cellgifter"', isRelevant: true },
      { id: 'c1-5', text: 'Inga trovärdiga medicinska källor rapporterar samma sak', isRelevant: true },
      { id: 'c1-6', text: 'Artikeln publicerades den här veckan', isRelevant: false },
      { id: 'c1-7', text: 'Artikeln nämner att forskare står bakom upptäckten', isRelevant: false },
    ],
    feedback:
      'Det här är ett falskt hälsopåstående. Artikeln gör ett mycket stort medicinskt löfte utan spårbara källor, metod eller trovärdig bekräftelse.',
    consequence:
      'Om den delas kan människor skjuta upp eller avstå från riktig vård.',
    image: 'choclate-cancer.png',
    imageAnalysis: {
      matchFound: false
    },
  },
  {
    id: 'case-2',
    caseNumber: 2,
    type: 'image-post',
    source: '@news_alerts_247 (anonymt konto, skapat för 2 veckor sedan)',
    date: 'Publicerad i dag',
    headline: 'Chockbilder: Göteborg under vatten - boende evakueras nu',
    content:
      'Ett anonymt konto påstår att en dramatisk översvämningsbild visar Göteborg i dag och att boende evakueras. Bilden är verklig, men omvänd bildsökning visar att den kommer från Tyskland 2021.',
    correctClassification: 'misleading',
    clues: [
      { id: 'c2-1', text: 'Omvänd bildsökning visar att bilden är från Tyskland 2021', isRelevant: true },
      { id: 'c2-2', text: 'Inlägget påstår att bilden är från i dag, men bilden är gammal och från ett annat land', isRelevant: true },
      { id: 'c2-3', text: 'Kontot är anonymt och nyligen skapat', isRelevant: true },
      { id: 'c2-4', text: 'Inga svenska nyhetsmedier rapporterar om en sådan evakuering i Göteborg', isRelevant: true },
      { id: 'c2-5', text: '"Dela innan det tas bort" är ett manipulerande brådskebudskap', isRelevant: true },
      { id: 'c2-6', text: 'Bilden visar verkliga översvämningsskador', isRelevant: false },
      { id: 'c2-7', text: 'Inlägget sprids snabbt på sociala medier', isRelevant: false },
    ],
    feedback:
      'Bilden verkar vara äkta, men sammanhanget är fel. Att använda en riktig bild från en annan plats och tid är en vanlig desinformationsteknik.',
    consequence:
      'Om den delas kan den skapa onödig oro och försvaga förtroendet för riktiga krisvarningar.',
    image: 'flooding-germany.png',
    imageAnalysis: {
      matchFound: true,
      originalLocation: 'Tyskland',
      originalDate: '2021',
      subject: 'Översvämmad gata efter kraftigt regn',
    
    },
  },
  {
    id: 'case-3',
    caseNumber: 3,
    type: 'article',
    source: 'EnergyBoost.com',
    author: 'Dr. Marcus Webb',
    date: 'För 3 dagar sedan',
    headline: 'Ny studie bevisar att energidryck förbättrar minnet hos unga',
    content:
      'Artikeln påstår att en studie bevisar att daglig energidryck förbättrar minnet hos unga vuxna. Längre ned framgår att studien bara hade 12 deltagare och finansierades av ett energidrycksbolag.',
    correctClassification: 'misleading',
    clues: [
      { id: 'c3-1', text: 'Studien hade bara 12 deltagare, vilket är för litet för att "bevisa" effekten', isRelevant: true },
      { id: 'c3-2', text: 'Rubriken säger "bevisar", men studien visar bara en möjlig koppling', isRelevant: true },
      { id: 'c3-3', text: 'Artikeln är sponsrad av ett energidrycksbolag', isRelevant: true },
      { id: 'c3-4', text: '"Banbrytande" används utan tydlig jämförelse eller förklaring', isRelevant: true },
      { id: 'c3-5', text: 'Artikeln länkar faktiskt till en studie-PDF', isRelevant: false },
      { id: 'c3-6', text: 'Författaren använder titeln "Dr."', isRelevant: false },
    ],
    feedback:
      'Studien finns, men artikeln överdriver vad den visar. Ett litet, sponsrat underlag kan inte bära en så stark slutsats.',
    consequence:
      'Missvisande hälsopåståenden kan få människor att fatta sämre beslut om kost, sömn och studier.',
    image: 'energy-drinks.png',
    imageAnalysis: {
      matchFound: false
    },
  },
  {
    id: 'case-4',
    caseNumber: 4,
    type: 'headline',
    source: 'LocalNews24.se',
    author: 'Redaktionen',
    date: 'I går',
    headline: 'Skola förbjuder alla mobiler för alltid från och med i morgon',
    content:
      'Artikeln handlar om en skola som inför nya mobilregler. Rubriken beskriver det som ett permanent totalförbud, men texten visar att regeln gäller mobilanvändning under lektionstid och ska utvärderas senare.',
    correctClassification: 'misleading',
    clues: [
      { id: 'c4-1', text: 'Den faktiska regeln gäller bara användning under lektionstid', isRelevant: true },
      { id: 'c4-2', text: '"För alltid" finns i rubriken men stöds inte av artikeltexten', isRelevant: true },
      { id: 'c4-3', text: '"Alla mobiler" överdriver eftersom elever får ha mobilen utanför lektioner', isRelevant: true },
      { id: 'c4-4', text: 'Källan är en lokal nyhetssajt', isRelevant: false },
      { id: 'c4-5', text: 'En begränsning av mobilanvändning under lektioner är faktiskt bekräftad', isRelevant: false },
      { id: 'c4-6', text: 'Artikeln har publiceringsdatum', isRelevant: false },
    ],
    feedback:
      'Kärnan är delvis sann: skolan har en ny mobilregel. Men rubriken gör beslutet mycket mer extremt än det är.',
    consequence:
      'Om den delas kan elever och föräldrar reagera på en förvrängd version av skolans regler.',
    image: 'leave-mobile.png',
    imageAnalysis: {
      matchFound: false
    },
  },
  {
    id: 'case-5',
    caseNumber: 5,
    type: 'image-post',
    source: '@real_news_now (anonymt konto, 200 följare)',
    date: 'För 2 timmar sedan',
    headline: 'BREAKING: Känd artist gripen på flygplats - bildbevis',
    content:
      'Ett anonymt konto påstår att en bild visar en känd artist gripas på en flygplats. Det saknas bekräftelse från trovärdiga medier eller polis, och bilden har flera märkliga detaljer i händer, ansikte och polisbrickor.',
    correctClassification: 'false',
    clues: [
      { id: 'c5-1', text: 'Bilden har förvrängda händer och onaturliga ansiktsproportioner', isRelevant: true },
      { id: 'c5-2', text: 'Ingen trovärdig nyhetskälla bekräftar gripandet', isRelevant: true },
      { id: 'c5-3', text: 'Bilden publicerades först av ett anonymt konto med få följare', isRelevant: true },
      { id: 'c5-4', text: 'Det finns ingen polisrapport eller officiell kommentar', isRelevant: true },
      { id: 'c5-5', text: '"Dela innan bilden försvinner" är en klassisk stressignal', isRelevant: true },
      { id: 'c5-6', text: 'Bilden har hög upplösning', isRelevant: false },
      { id: 'c5-7', text: 'Inlägget använder versaler i rubriken', isRelevant: false },
    ],
    feedback:
      'Det här verkar vara en AI-genererad eller manipulerad bild. Bildfel och total avsaknad av trovärdig bekräftelse är starka varningssignaler.',
    consequence:
      'Falska gripandebilder kan skada rykten och leda till trakasserier mot verkliga personer.',
    image: 'celebrity-caught.png',
    imageAnalysis: {
      matchFound: false
    },
  },
  {
    id: 'case-6',
    caseNumber: 6,
    type: 'article',
    source: 'svt-nyheter.se.co',
    author: 'Nyhetsdesk',
    date: 'I dag',
    headline: 'Regeringen inför nattligt internetstopp för alla ungdomar',
    content:
      'En sida med en lookalike-URL påstår att regeringen har beslutat om nattligt internetstopp för alla under 18 år. Artikeln saknar officiella länkar och hänvisar bara till anonyma källor.',
    correctClassification: 'false',
    clues: [
      { id: 'c6-1', text: 'URL:en liknar en känd nyhetssajt men slutar på en ovanlig domän', isRelevant: true },
      { id: 'c6-2', text: 'Ett stort nationellt beslut saknar officiell källa eller pressmeddelande', isRelevant: true },
      { id: 'c6-3', text: 'Artikeln hänvisar bara till anonyma "källor nära beslutet"', isRelevant: true },
      { id: 'c6-4', text: 'Rubriken beskriver en extrem åtgärd utan konkreta detaljer', isRelevant: true },
      { id: 'c6-5', text: 'Inga andra etablerade medier rapporterar beslutet', isRelevant: true },
      { id: 'c6-6', text: 'Sidan har en logotyp som påminner om en nyhetssajt', isRelevant: false },
      { id: 'c6-7', text: 'Artikeln nämner ungdomar och internetvanor', isRelevant: false },
    ],
    feedback:
      'Det här är en falsk artikel som använder en förvillande URL och låtsas vara en etablerad nyhetskälla. Ett sådant beslut skulle ha tydliga officiella källor.',
    consequence:
      'Om den delas kan den skapa oro och misstro kring myndigheter och medier.',
    image: 'ban-late-surf.png',
    imageAnalysis: {
      matchFound: false
    },
  },
  {
    id: 'case-7',
    caseNumber: 7,
    type: 'headline',
    source: 'EkonomiDirekt24.se',
    author: 'Lena Holm',
    date: 'I går',
    headline: 'Matpriserna rusar 200 procent - barnfamiljer varnas',
    content:
      'Artikeln påstår att matpriserna har rusat med 200 procent. I texten framgår att siffran bygger på tre utvalda varor i en enda butik under en kampanjvecka, inte bred prisstatistik.',
    correctClassification: 'misleading',
    clues: [
      { id: 'c7-1', text: 'Siffran bygger på tre utvalda varor i en enda butik', isRelevant: true },
      { id: 'c7-2', text: 'Rubriken får det att låta som att alla matpriser har ökat 200 procent', isRelevant: true },
      { id: 'c7-3', text: 'Artikeln skiljer inte tydligt mellan en enkät och officiell statistik', isRelevant: true },
      { id: 'c7-4', text: '"Barnfamiljer varnas" förstärker dramatiken utan konkret varning från myndighet', isRelevant: true },
      { id: 'c7-5', text: 'Artikeln innehåller intervjuer med kunder', isRelevant: false },
      { id: 'c7-6', text: 'Priser kan faktiskt förändras över tid', isRelevant: false },
    ],
    feedback:
      'Artikeln bygger på en verklig observation, men rubriken och statistiken är missvisande. Ett smalt urval presenteras som en generell kris.',
    consequence:
      'Missvisande statistik kan göra att människor får en felaktig bild av ekonomin och fattar beslut på dåliga underlag.',
    image: 'expensive-food.png',
    imageAnalysis: {
      matchFound: false
    },
  },
  {
    id: 'case-8',
    caseNumber: 8,
    type: 'article',
    source: 'Klimatbladet.se',
    author: 'Sara Lind',
    date: 'I dag',
    headline: 'Kommun testar svala busshållplatser inför sommaren',
    content:
      'En kommun testar skuggande tak och ljusare markmaterial vid tre busshållplatser. Artikeln anger beslut, budget, ansvarig projektledare och att försöket ska utvärderas innan något permanent införande.',
    correctClassification: 'true',
    clues: [
      { id: 'c8-1', text: 'Artikeln beskriver försöket som begränsat och överdriver inte omfattningen', isRelevant: true },
      { id: 'c8-2', text: 'Det finns tydliga källor: beslut, budget och ansvarig projektledare', isRelevant: true },
      { id: 'c8-3', text: 'Rubriken är saklig och matchar artikelns innehåll', isRelevant: true },
      { id: 'c8-4', text: 'Texten skiljer mellan test, utvärdering och permanent införande', isRelevant: true },
      { id: 'c8-5', text: 'Ämnet handlar om klimat och värme', isRelevant: false },
      { id: 'c8-6', text: 'Artikeln nämner kommunala pengar', isRelevant: false },
    ],
    feedback:
      'Det här är en trovärdig artikel. Den är avgränsad, länkar till kontrollerbara uppgifter och drar inte större slutsatser än underlaget stödjer.',
    consequence:
      'Trovärdiga artiklar hjälper människor att förstå lokala beslut utan onödig dramatik.',
    image: 'cool-bus-stop.png',
    imageAnalysis: {
      matchFound: false
    },
  },
  {
    id: 'case-9',
    caseNumber: 9,
    type: 'article',
    source: 'TryggVardag.org',
    author: 'Annonsbilaga',
    date: 'För 1 dag sedan',
    headline: 'Professor: Den här brandvarnaren gör ditt hem helt säkert',
    content:
      'En annonsliknande artikel påstår att en brandvarnare gör hemmet helt säkert. Experten som citeras arbetar för företaget bakom produkten, och texten saknar oberoende tester eller certifieringar.',
    correctClassification: 'false',
    clues: [
      { id: 'c9-1', text: '"Helt säkert" är ett absolut löfte som inte stöds av fakta', isRelevant: true },
      { id: 'c9-2', text: 'Experten har ekonomisk koppling till företaget bakom produkten', isRelevant: true },
      { id: 'c9-3', text: 'Artikeln saknar oberoende tester eller certifieringar', isRelevant: true },
      { id: 'c9-4', text: 'Texten är märkt som annonsbilaga men låter som en nyhetsartikel', isRelevant: true },
      { id: 'c9-5', text: 'Artikeln handlar om säkerhet i hemmet', isRelevant: false },
      { id: 'c9-6', text: 'Brandvarnare är en verklig produktkategori', isRelevant: false },
    ],
    feedback:
      'Det här är falskt som säkerhetspåstående. Produkten kan finnas, men artikeln använder falsk auktoritet och absoluta löften utan bevis.',
    consequence:
      'Om människor tror på överdrivna säkerhetslöften kan de underskatta riktiga risker.',
    image: 'professor-alarm.png',
    imageAnalysis: {
      matchFound: false
    },
  },
  {
    id: 'case-10',
    caseNumber: 10,
    type: 'article',
    source: 'Lokalposten.se',
    author: 'Mikael Åberg',
    date: 'I dag',
    headline: 'Biblioteket förlänger öppettiderna två kvällar i veckan',
    content:
      'Kommunbiblioteket förlänger öppettiderna på tisdagar och torsdagar under en tre månader lång försöksperiod. Artikeln anger datum, tider, ansvarig person och att beslutet ska utvärderas.',
    correctClassification: 'true',
    clues: [
      { id: 'c10-1', text: 'Rubriken är konkret och överensstämmer med detaljerna i texten', isRelevant: true },
      { id: 'c10-2', text: 'Artikeln anger tidsperiod, veckodagar och ansvarig person', isRelevant: true },
      { id: 'c10-3', text: 'Texten beskriver ett försök och lovar inte mer än beslutet säger', isRelevant: true },
      { id: 'c10-4', text: 'Källan är en lokal nyhetssajt och uppgifterna är kontrollerbara', isRelevant: true },
      { id: 'c10-5', text: 'Artikeln handlar om bibliotek', isRelevant: false },
      { id: 'c10-6', text: 'Artikeln innehåller ett citat', isRelevant: false },
    ],
    feedback:
      'Det här är en trovärdig lokal nyhet. Den är specifik, kontrollerbar och använder en rubrik som stämmer med innehållet.',
    consequence:
      'När saklig information delas kan fler ta del av service och beslut som faktiskt påverkar vardagen.',
    image: 'library-open-late.png',
    imageAnalysis: {
      matchFound: false
    },
  },
]
