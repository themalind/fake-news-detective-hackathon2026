import type { Case } from '../types/game'

export const CASES: Case[] = [
  {
    id: 'case-1',
    caseNumber: 1,
    type: 'headline',
    source: 'HealthBuzz',
    url: 'https://www.healthbuzz.net/halsa/choklad-cancer-genombrott',
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
    positiveClues: [
      { id: 'p1-1', text: 'Hälso-sajten har en professionell layout', isRelevant: false },
      { id: 'p1-2', text: 'Texten nämner att forskning bedrivs', isRelevant: false },
      { id: 'p1-3', text: 'Påståendet handlar om en faktisk medicinsk fråga', isRelevant: false },
      { id: 'p1-4', text: 'Artikeln har en tydlig rubrik och brödtext', isRelevant: false },
      { id: 'p1-5', text: 'Sajten har en publiceringstid angiven', isRelevant: false },
    ],
    misleadingClues: [
      { id: 'm1-1', text: 'Rubriken överdriver vad studien säger', isRelevant: false },
      { id: 'm1-2', text: 'Faktan är riktig men ramas in fel', isRelevant: false },
      { id: 'm1-3', text: 'Citat är tagna ur sammanhang', isRelevant: false },
      { id: 'm1-4', text: 'Texten blandar sant med falskt', isRelevant: false },
      { id: 'm1-5', text: 'Statistik är förvrängd men har grund', isRelevant: false },
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
    type: 'article',
    source: 'TryggVardag.org',
    url: 'https://www.tryggvardag.org/brandvarnare-helt-saker',
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
      { id: 'c9-7', text: 'Länken till den "oberoende laboratorietesten" leder till en 404 — rapporten existerar inte', isRelevant: true },
    ],
    positiveClues: [
      { id: 'p9-1', text: 'En expert med professorstitel citeras', isRelevant: false },
      { id: 'p9-2', text: 'Sajten heter "TryggVardag" — låter pålitligt', isRelevant: false },
      { id: 'p9-3', text: 'Texten är märkt som annonsbilaga', isRelevant: false },
      { id: 'p9-4', text: 'Artikeln innehåller varningar och fakta om brand', isRelevant: false },
      { id: 'p9-5', text: 'Sajten har .org-domän', isRelevant: false },
    ],
    misleadingClues: [
      { id: 'm9-1', text: 'Rubriken översvänger vad experten säger', isRelevant: false },
      { id: 'm9-2', text: 'Faktan finns men ramas in fel', isRelevant: false },
      { id: 'm9-3', text: '"Helt säkert" är dramatiskt men har grund', isRelevant: false },
      { id: 'm9-4', text: 'Annonsen blandar verkliga fakta med marknadsföring', isRelevant: false },
      { id: 'm9-5', text: 'Förstärkande ord översvänger en riktig produkt', isRelevant: false },
    ],
    feedback:
      'Det här är falskt som säkerhetspåstående. Produkten kan finnas, men artikeln använder falsk auktoritet och absoluta löften utan bevis.',
    consequence:
      'Om människor tror på överbudna säkerhetslöften kan de underskatta riktiga risker.',
    image: 'professor-alarm.png',
    imageAnalysis: {
      matchFound: false
    },
    inlineLinks: {
      labtest: {
        type: 'dead',
        url: 'https://sakerhemmiljo-institutet.se/tester/tryggbrand-pro-2024.pdf',
      },
    },
  },
  {
    id: 'case-3',
    caseNumber: 3,
    type: 'article',
    source: 'Lokalposten.se',
    url: 'https://www.lokalposten.se/kommunalt/biblioteket-langre-oppet',
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
    positiveClues: [
      { id: 'p10-1', text: 'Artikeln anger exakta öppettider och datum', isRelevant: true },
      { id: 'p10-2', text: 'Ansvarig person på biblioteket nämns', isRelevant: true },
      { id: 'p10-3', text: 'Försöket är tidsbegränsat (tre månader)', isRelevant: true },
      { id: 'p10-4', text: 'Författaren är namngiven', isRelevant: true },
      { id: 'p10-5', text: 'Beslutet ska utvärderas innan det blir permanent', isRelevant: true },
      { id: 'p10-6', text: 'Sidan ser professionell ut', isRelevant: false },
    ],
    misleadingClues: [
      { id: 'm10-1', text: 'Rubriken överdriver vad biblioteket gör', isRelevant: false },
      { id: 'm10-2', text: 'Tillfälligt försök framställs som permanent', isRelevant: false },
      { id: 'm10-3', text: 'Förstärkande ord skapar onödigt drama', isRelevant: false },
      { id: 'm10-4', text: 'Beslutet är förvrängt i texten', isRelevant: false },
      { id: 'm10-5', text: 'Citat tagna ur sammanhang', isRelevant: false },
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
  {
    id: 'case-4',
    caseNumber: 4,
    type: 'headline',
    source: 'LocalNews24',
    url: 'https://www.lokalanyheter.se/skola/mobilforbud-stockholmsskola',
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
    positiveClues: [
      { id: 'p4-1', text: 'Artikeln citerar skolledningen', isRelevant: false },
      { id: 'p4-2', text: 'Beslutet om nya mobilregler är bekräftat', isRelevant: false },
      { id: 'p4-3', text: 'Texten ger bakgrund till varför regeln införs', isRelevant: false },
      { id: 'p4-4', text: 'Artikeln har författarsignatur och datum', isRelevant: false },
      { id: 'p4-5', text: 'Reglerna handlar om en specifik skola', isRelevant: false },
    ],
    misleadingClues: [
      { id: 'm4-1', text: 'Rubriken säger "för alltid" men beslutet är temporärt', isRelevant: true },
      { id: 'm4-2', text: '"Alla mobiler" överdriver — gäller bara lektionstid', isRelevant: true },
      { id: 'm4-3', text: 'Beslutet är riktigt men förvrängt i rubriken', isRelevant: true },
      { id: 'm4-4', text: 'Texten ger en mer nyanserad bild än rubriken', isRelevant: true },
      { id: 'm4-5', text: 'Förstärkande ord ("alla", "alltid") skapar drama', isRelevant: true },
      { id: 'm4-6', text: 'Tillfällig regel framställs som permanent', isRelevant: true },
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
    source: 'Real News Now',
    url: 'https://x.com/real_news_now/status/1843951247869538172',
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
    positiveClues: [
      { id: 'p5-1', text: 'Bilden ser detaljerad och realistisk ut', isRelevant: false },
      { id: 'p5-2', text: 'Inlägget är märkt som "BREAKING"', isRelevant: false },
      { id: 'p5-3', text: 'Personen i bilden är välkänd', isRelevant: false },
      { id: 'p5-4', text: 'Inlägget har en tidsstämpel', isRelevant: false },
      { id: 'p5-5', text: 'Texten innehåller en konkret anklagelse', isRelevant: false },
    ],
    misleadingClues: [
      { id: 'm5-1', text: 'Bilden är äkta men i fel sammanhang', isRelevant: false },
      { id: 'm5-2', text: 'Citatet är taget ur sammanhang', isRelevant: false },
      { id: 'm5-3', text: 'Faktan finns men är förvrängd', isRelevant: false },
      { id: 'm5-4', text: 'Rubriken överdriver en verklig händelse', isRelevant: false },
      { id: 'm5-5', text: 'Förstärkande ord överdriver det som faktiskt hänt', isRelevant: false },
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
    source: 'svt-nyheter.se',
    url: 'https://svt-nyheter.se.co/sv/nyheter/12839?utm=campaign-N3WS',
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
    positiveClues: [
      { id: 'p6-1', text: 'Sajtens logotyp liknar en känd nyhetskälla', isRelevant: false },
      { id: 'p6-2', text: 'Texten är skriven på flytande svenska', isRelevant: false },
      { id: 'p6-3', text: 'Artikeln har en författare och datum', isRelevant: false },
      { id: 'p6-4', text: 'Sidan ser professionell och vältrimmad ut', isRelevant: false },
      { id: 'p6-5', text: 'Domännamnet innehåller "svt"', isRelevant: false },
    ],
    misleadingClues: [
      { id: 'm6-1', text: 'Beslutet finns men är förvrängt', isRelevant: false },
      { id: 'm6-2', text: 'Rubriken överdriver en riktig händelse', isRelevant: false },
      { id: 'm6-3', text: 'Bakomliggande fakta är riktig men förstärkt', isRelevant: false },
      { id: 'm6-4', text: 'Citat tagna ur sammanhang', isRelevant: false },
      { id: 'm6-5', text: 'Tillfällig åtgärd framställs som permanent', isRelevant: false },
    ],
    feedback:
      'Det här är en falsk artikel som använder en förvillande URL och låtsas vara en etablerad nyhetskälla. Ett sådant beslut skulle ha tydliga officiella källor.',
    consequence:
      'Om den delas kan den skapa oro och misstro kring myndigheter och medier.',
    image: 'ban-late-surf.png',
    imageAnalysis: {
      matchFound: false
    },
    inlineLinks: {
      pressrelease: {
        type: 'shady',
        url: 'https://regeringen-pressrum.x-info.cc/sv/12839?campaign=N3WS-EXKLUSIV',
        warning: {
          pretendsToBe: 'regeringens pressmeddelande',
          legitDomain: 'regeringen.se',
          reasons: [
            '"regeringen-pressrum" är inte regeringens domän — riktiga pressmeddelanden ligger på regeringen.se.',
            'Toppdomänen .cc (Cocosöarna, ofta använt för kommersiella återförsäljar-domäner) — inte .se.',
            'Extra subdomän "pressrum" och path med slumpmässig ID-sträng är typiskt för kampanjlandnings­sidor.',
            'URL:en innehåller "campaign=N3WS-EXKLUSIV" — en marknadsförings­parameter, inte officiell publicering.',
          ],
        },
      },
    },
  },
  {
    id: 'case-7',
    caseNumber: 7,
    type: 'headline',
    source: 'EkonomiDirekt.se',
    url: 'https://www.ekonomidirekt.se/ekonomi/matpriser-rusar-200-procent',
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
    positiveClues: [
      { id: 'p7-1', text: 'Artikeln innehåller konkreta prissiffror', isRelevant: false },
      { id: 'p7-2', text: 'Författaren är namngiven', isRelevant: false },
      { id: 'p7-3', text: 'Texten nämner specifik butik och vara', isRelevant: false },
      { id: 'p7-4', text: 'Artikeln innehåller intervjuer med kunder', isRelevant: false },
      { id: 'p7-5', text: 'Källan har "EkonomiDirekt" i namnet', isRelevant: false },
    ],
    misleadingClues: [
      { id: 'm7-1', text: '200%-siffran bygger på tre varor i en butik', isRelevant: true },
      { id: 'm7-2', text: 'Specifikt urval framställs som generellt', isRelevant: true },
      { id: 'm7-3', text: 'Anekdoter blandas med statistik så det ser starkare ut', isRelevant: true },
      { id: 'm7-4', text: 'Cherry-picking av priser från en kampanjvecka', isRelevant: true },
      { id: 'm7-5', text: 'Förstärkande ord ("rusar", "varnas") överdriver', isRelevant: true },
      { id: 'm7-6', text: 'Rubriken döljer att underlaget är extremt smalt', isRelevant: true },
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
    url: 'https://www.klimatbladet.se/lokalt/svala-busshallplatser-test-2026',
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
    positiveClues: [
      { id: 'p8-1', text: 'Artikeln namnger ansvarig projektledare', isRelevant: true },
      { id: 'p8-2', text: 'Beslut, budget och tidsperiod anges konkret', isRelevant: true },
      { id: 'p8-3', text: 'Texten skiljer mellan test och permanent införande', isRelevant: true },
      { id: 'p8-4', text: 'Försöket beskrivs som litet och utvärderingsbart', isRelevant: true },
      { id: 'p8-5', text: 'Författaren är namngiven', isRelevant: true },
      { id: 'p8-6', text: 'Sajten har en seriös design', isRelevant: false },
      { id: 'p8-7', text: 'Artikeln innehåller en bild', isRelevant: false },
    ],
    misleadingClues: [
      { id: 'm8-1', text: 'Rubriken överdriver vad försöket innebär', isRelevant: false },
      { id: 'm8-2', text: 'Tillfälligt försök framställs som permanent', isRelevant: false },
      { id: 'm8-3', text: 'Förstärkande ord skapar onödigt drama', isRelevant: false },
      { id: 'm8-4', text: 'Statistik är cherry-picked', isRelevant: false },
      { id: 'm8-5', text: 'Citat tagna ur sammanhang', isRelevant: false },
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
    type: 'image-post',
    source: 'News Alerts 247',
    url: 'https://x.com/news_alerts_247/status/1839283746591',
    date: 'Publicerad i dag',
    headline: 'Chockbilder: Göteborg under vatten - boende evakueras nu',
    content:
      'Ett anonymt konto påstår att en dramatisk översvämningbild visar Göteborg i dag och att boende evakueras. Bilden är verklig, men omvänd bildsökning visar att den kommer från Tyskland 2021.',
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
    positiveClues: [
      { id: 'p2-1', text: 'Inlägget har många delningar', isRelevant: false },
      { id: 'p2-2', text: 'Bilden är skarp och högupplöst', isRelevant: false },
      { id: 'p2-3', text: 'Texten anger en tydlig plats (Göteborg)', isRelevant: false },
      { id: 'p2-4', text: 'Inlägget har en tidsstämpel', isRelevant: false },
      { id: 'p2-5', text: 'Flera konton har delat samma bild', isRelevant: false },
    ],
    misleadingClues: [
      { id: 'm2-1', text: 'Bilden är äkta men placerad i fel sammanhang', isRelevant: true },
      { id: 'm2-2', text: 'Plats och datum stämmer inte med bilden', isRelevant: true },
      { id: 'm2-3', text: 'Äldre material framställs som aktuellt', isRelevant: true },
      { id: 'm2-4', text: 'Brådskebudskap förstärker en illusion av kris', isRelevant: true },
      { id: 'm2-5', text: 'Inlägget döljer var bilden faktiskt kommer ifrån', isRelevant: true },
      { id: 'm2-6', text: 'Förstärkande ord ("chockbilder", "evakueras nu") överdriver', isRelevant: true },
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
      subject: 'Översvämad gata efter kraftigt regn',
    },
  },
  {
    id: 'case-10',
    caseNumber: 10,
    type: 'article',
    source: 'EnergyBoost.com',
    url: 'https://www.energyboost.com/halsa/ny-studie-koffein-minne-2026',
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
    positiveClues: [
      { id: 'p3-1', text: 'Artikeln refererar till en namngiven studie', isRelevant: false },
      { id: 'p3-2', text: 'Författaren har akademisk titel (Dr.)', isRelevant: false },
      { id: 'p3-3', text: 'Det finns ett publiceringsdatum', isRelevant: false },
      { id: 'p3-4', text: 'Studien länkas i artikeln', isRelevant: false },
      { id: 'p3-5', text: 'Rubriken anger målgrupp (unga vuxna)', isRelevant: false },
      { id: 'p3-6', text: 'Texten innehåller numeriska resultat', isRelevant: false },
    ],
    misleadingClues: [
      { id: 'm3-1', text: 'Rubriken säger "bevisar" — starkare än vad data tillåter', isRelevant: true },
      { id: 'm3-2', text: 'Litet urval (12 personer) framställs som generellt', isRelevant: true },
      { id: 'm3-3', text: 'Sponsorskapet nämns inte i rubriken', isRelevant: true },
      { id: 'm3-4', text: '"Banbrytande" används utan jämförelse', isRelevant: true },
      { id: 'm3-5', text: 'Studien finns men slutsatsen är förstärkt', isRelevant: true },
      { id: 'm3-6', text: 'Förstärkande ord skapar en stark slutsats av svagt underlag', isRelevant: true },
    ],
    feedback:
      'Studien finns, men artikeln överdriver vad den visar. Ett litet, sponsrat underlag kan inte bära en så stark slutsats.',
    consequence:
      'Missvisande hälsopåståenden kan få människor att fatta sämre beslut om kost, sömn och studier.',
    image: 'energy-drinks.png',
    imageAnalysis: {
      matchFound: false
    },
    inlineLinks: {
      study: {
        type: 'report',
        url: 'https://psychstudies.uu.se/papers/2024/sunden-holm-koffein-minne.pdf',
        report: {
          title: 'Effekter av koffeinintag på korttidsminne hos unga vuxna — en pilotstudie',
          authors: 'Maria Sundén, Anders Holm',
          affiliation: 'Institutionen för psykologi, Karlstads universitet',
          funding: 'Studien finansierades av Volt Energy AB.',
          date: 'Mars 2024',
          participants: 12,
          abstract:
            'Vi undersökte om dagligt intag av koffeinhaltig energidryck påverkar korttidsminnet hos unga vuxna under en tvåveckorsperiod. Resultaten indikerar en svag tendens till förbättring i koffein-gruppen, men skillnaden mot placebo var inte statistiskt signifikant.',
          method:
            'Pilotstudie med 12 frivilliga deltagare (ålder 19–24, 7 kvinnor och 5 män). Ej slumpmässigt urval — deltagarna rekryterades via sociala medier. Koffein-gruppen (n=6) drack 250 ml energidryck dagligen i 14 dagar; placebo-gruppen (n=6) drack en likvärdig dryck utan koffein. Korttidsminne mättes med digit-span-test före och efter perioden.',
          findings: [
            'Koffein-gruppen: genomsnittlig förbättring 4,2 % (SD 6,8).',
            'Placebo-gruppen: genomsnittlig förbättring 1,8 % (SD 5,1).',
            'Skillnaden mellan grupperna var inte statistiskt signifikant (p = 0,18).',
            'Inga skillnader observerades mellan kön eller ålder inom gruppen.',
          ],
          conclusion:
            'Studiens resultat bör tolkas med försiktighet. Pilotstudien antyder en möjlig positiv effekt av koffein på korttidsminne hos unga vuxna, men effekten är liten och osäker. Vi rekommenderar replikering med större och mer diverst urval, längre studietid och oberoende finansiering innan slutsatser kan dras.',
        },
      },
    },
  },
    
]
