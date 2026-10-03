import { nouns } from './themes/types';

/** Frequent A1/A2 nouns that don't belong to a vocabulary theme (shown as "Общие слова"). */
export const GENERAL_NOUNS = nouns(`
  mw|Mensch|Menschen|человек|person
  pl|Leute|-|люди|people
  pl|Eltern|-|родители|parents
  pl|Großeltern|-|бабушка и дедушка|grandparents
  pl|Geschwister|-|братья и сёстры|siblings
  m|Herr|Herren|господин|Mr, gentleman
  f|Dame|Damen|дама|lady
  m|Partner|Partner|партнёр|partner
  f|Partnerin|Partnerinnen|партнёрша|partner (f)
  f|Person|Personen|человек, лицо|person
  n|Jahr|Jahre|год|year
  m|Monat|Monate|месяц|month
  f|Stunde|Stunden|час; урок|hour; lesson
  f|Minute|Minuten|минута|minute
  f|Zeit|Zeiten|время|time
  f|Nacht|Nächte|ночь|night
  m|Montag|Montage|понедельник|Monday
  m|Dienstag|Dienstage|вторник|Tuesday
  m|Mittwoch|Mittwoche|среда|Wednesday
  m|Donnerstag|Donnerstage|четверг|Thursday
  m|Freitag|Freitage|пятница|Friday
  m|Samstag|Samstage|суббота|Saturday
  m|Sonntag|Sonntage|воскресенье|Sunday
  n|Wochenende|Wochenenden|выходные|weekend
  f|Welt|Welten|мир|world
  f*|Erde|-|земля, Земля|earth
  f*|Luft|-|воздух|air
  m|Ort|Orte|место|place
  m|Raum|Räume|помещение|room, space
  n|Ding|Dinge|вещь|thing
  f|Sache|Sachen|вещь, дело|thing
  n|Beispiel|Beispiele|пример|example
  n|Wort|Wörter|слово|word
  mw|Name|Namen|имя, название|name
  f|Idee|Ideen|идея|idea
  n|Ende|Enden|конец|end
  f|Arbeit|Arbeiten|работа|work
  m|Beruf|Berufe|профессия|profession
  f*|Freizeit|-|свободное время|free time
  n*|Glück|-|счастье; удача|luck, happiness
  m|Körper|Körper|тело|body
  n|Herz|Herzen|сердце|heart
  f*|Musik|-|музыка|music
  m*|Sport|-|спорт|sport
  n|Theater|Theater|театр|theatre
  n*|Internet|-|интернет|internet
  n|Gebäude|Gebäude|здание|building
  f*|Kleidung|-|одежда|clothes
  n|Pferd|Pferde|лошадь|horse
  n*|Obst|-|фрукты|fruit
  n*|Gemüse|-|овощи|vegetables
  n|Getränk|Getränke|напиток|drink
  n|Lebensmittel|Lebensmittel|продукт питания|food item
  n*|Essen|-|еда|food
  n|Leben|Leben|жизнь|life
  f|Regel|Regeln|правило|rule
  f|Stimme|Stimmen|голос|voice
  n|Licht|Lichter|свет|light
  n|Feuer|Feuer|огонь, пожар|fire
  m|Stein|Steine|камень|stone
  n*|Holz|-|дерево (материал)|wood
  f|Sprache|Sprachen|язык|language
  f|Adresse|Adressen|адрес|address
  f|Nummer|Nummern|номер|number
  n|Problem|Probleme|проблема|problem
  f*|Hilfe|-|помощь|help
  f|Information|Informationen|информация|information
  n|Formular|Formulare|бланк, анкета|form
  m|Euro|Euro|евро|euro
  m|Cent|Cent|цент|cent
  n|Kilo|Kilo|килограмм|kilo
  m|Liter|Liter|литр|litre
`);

/** Nouns at level A2 — everything else in the lexicon counts as A1. */
export const A2_NOUNS = new Set(
  `Zwiebel Löffel Messer Gabel Teppich Waschmaschine Pflanze Vermieter Vase Besprechung Drucker Projekt Vertrag Gehalt Kunde Kundin
  Bericht Präsentation Dokument Ordner Kalender Praktikant Kantine Verein Mannschaft Konzert Gitarre Klavier Kamera Lied Schwimmbad
  Fitnessstudio Rucksack Gepäck Stadtplan Sonnenbrille Kaufhaus Größe Kreditkarte Tüte Korb Laden Mütze Schal Wörterbuch Note Bleistift
  Tafel Universität Satz Hochzeit Fest Enkel Enkelin Rücken Fieber Tablette Medikament Rezept Erkältung Patient Pflaster Thermometer Salbe
  Kirche Rathaus Brücke Ampel Kreuzung Straßenbahn Turm Ecke Zentrum Polizei Wecker Dusche Zahnbürste Handtuch Nachricht Feierabend
  Spiegel Wolke Fluss Wiese Zelt Regenschirm Jahreszeit Gewitter Pilz Picknick Wind Ort Raum Sache Idee Körper Herz Gebäude Pferd
  Lebensmittel Regel Stimme Licht Feuer Stein Holz Welt Erde Luft Glück Partner Partnerin Kilo Liter Cent`.split(/\s+/),
);

/**
 * Plurals for nouns that appear only in reading texts (their word lists don't carry plurals).
 * Keyed by lemma with article; "-" = no plural in normal use.
 */
const TEXT_PLURALS = `
das Mehl:-|das Salz:-|der Teig:Teige|der Ofen:Öfen|die Sorte:Sorten|das Korn:Körner|die Butter:-|die Marmelade:Marmeladen|das Abendbrot:-
die Brotzeit:Brotzeiten|die Mahlzeit:Mahlzeiten|der Bäcker:Bäcker|die Kaffeebohne:Kaffeebohnen|die Kaffeepflanze:Kaffeepflanzen
die Kaffeemaschine:Kaffeemaschinen|der Espresso:Espressos|der Cappuccino:Cappuccinos|der Schaum:-|das Gebirge:Gebirge|der Seefahrer:Seefahrer
die Knolle:Knollen|die Stärke:-|der Kartoffelsalat:Kartoffelsalate|die Gegend:Gegenden|der Erdapfel:Erdäpfel|die Höhle:Höhlen|die Hütte:Hütten
der Beton:-|die Kälte:-|die Treppe:Treppen|der Aufzug:Aufzüge|das Geschirr:-|das Gerät:Geräte|der Herd:Herde|die Mikrowelle:Mikrowellen
die Spülmaschine:Spülmaschinen|das Spülbecken:Spülbecken|die Wohnküche:Wohnküchen|die Bedeutung:Bedeutungen|das Sauerkraut:-|die Brezel:Brezeln
der Schweinebraten:Schweinebraten|der Vorhang:Vorhänge|der Koch:Köche|der Mechaniker:Mechaniker|der Schmied:Schmiede|das Papier:Papiere
der Stift:Stifte|der Mitarbeiter:Mitarbeiter|das Homeoffice:-|die Feuerwehr:Feuerwehren|der Brand:Brände|der Unfall:Unfälle
die Naturkatastrophe:Naturkatastrophen|die Notrufnummer:Notrufnummern|die Gefahr:Gefahren|das Mitglied:Mitglieder|die Aktivität:Aktivitäten
der Spaß:-|die Entspannung:-|der Fußball:Fußbälle|das Instrument:Instrumente|die Briefmarke:Briefmarken|das Spielzeug:Spielzeuge|der Stock:Stöcke
der Pferdekopf:Pferdeköpfe|die Sportart:Sportarten|der Spieler:Spieler|der Torwart:Torwarte|das Tor:Tore|die Halbzeit:Halbzeiten
die Weltmeisterschaft:Weltmeisterschaften|der Eingang:Eingänge|die Eintrittskarte:Eintrittskarten|der Kinosaal:Kinosäle|der Zuschauer:Zuschauer
die Leinwand:Leinwände|der Saal:Säle|der Projektor:Projektoren|der Jahrmarkt:Jahrmärkte|der Ton:Töne|der Musiker:Musiker|die Eisenbahn:Eisenbahnen
das Eisen:-|die Lokomotive:Lokomotiven|der Wagen:Wagen|der Dampf:-|der Römer:Römer|die Spur:Spuren|die Dampfmaschine:Dampfmaschinen|der ICE:ICEs
der Kilometer:Kilometer|die Bahn:Bahnen|der Start:Starts|die Landung:Landungen|das Terminal:Terminals|die Halle:Hallen|das Gate:Gates
die Geschäftsreise:Geschäftsreisen|der Gastgeber:Gastgeber|der Stern:Sterne|der Luxus:-|die Seife:Seifen|die Zahnpasta:Zahnpasten
das Putzmittel:Putzmittel|der Einkaufswagen:Einkaufswagen|die Selbstbedienung:-|die Kassiererin:Kassiererinnen|der Strichcode:Strichcodes
die Mode:Moden|die Jeans:Jeans|der Arbeiter:Arbeiter|die Münze:Münzen|der Geldschein:Geldscheine|das Bargeld:-|das Konto:Konten|das Getreide:-
das Schaf:Schafe|das Silber:-|das Gold:-|das Papiergeld:-|der Franken:Franken|der Schüler:Schüler|der Direktor:Direktoren
die Direktorin:Direktorinnen|das Fach:Fächer|die Mathematik:-|die Grundschule:Grundschulen|die Bücherei:Büchereien|die Zeitschrift:Zeitschriften
die Stadtbücherei:Stadtbüchereien|der Ausweis:Ausweise|die Hochschule:Hochschulen|die Uni:Unis|der Schulabschluss:Schulabschlüsse|das Abitur:-
die Matura:-|der Studienplatz:Studienplätze|der Bewerber:Bewerber|die Biologie:-|die Kleinfamilie:Kleinfamilien|die Großfamilie:Großfamilien
der Cousin:Cousins|die Cousine:Cousinen|die Geburt:Geburten|die Kerze:Kerzen|der König:Könige|das Säugetier:Säugetiere|der Rüde:Rüden
die Hündin:Hündinnen|der Welpe:Welpen|der Wolf:Wölfe|die Hunderasse:Hunderassen|die Jagd:Jagden|die Aufgabe:Aufgaben|die Freude:Freuden
der Doktortitel:Doktortitel|der Spezialist:Spezialisten|der Zahnarzt:Zahnärzte|der Augenarzt:Augenärzte|der Kinderarzt:Kinderärzte
die Praxis:Praxen|der Hausarzt:Hausärzte|die Babynahrung:-|der Apotheker:Apotheker|die Apothekerin:Apothekerinnen|der Schneidezahn:Schneidezähne
der Eckzahn:Eckzähne|der Backenzahn:Backenzähne|der Milchzahn:Milchzähne|die Hauptstadt:Hauptstädte|der Osten:-|der Reichstag:-
das Parlament:Parlamente|der Stadtteil:Stadtteile|die Tram:Trams|das Loch:Löcher|der Verkehr:-|der Fußgänger:Fußgänger|der Radfahrer:Radfahrer
das Signal:Signale|der Polizist:Polizisten|der Schlaf:-|das Gehirn:Gehirne|das Gedächtnis:-|der Tiefschlaf:-|der REM-Schlaf:-
die Armbanduhr:Armbanduhren|die Wanduhr:Wanduhren|die Sonnenuhr:Sonnenuhren|der Stab:Stäbe|der Schatten:Schatten|die Sanduhr:Sanduhren
die Wasseruhr:Wasseruhren|die Borste:Borsten|das Zähneputzen:-|der Essensrest:Essensreste|das Holzstück:Holzstücke|die Zahnärztin:Zahnärztinnen
der Griff:Griffe|der Sonnenschein:-|der Bauer:Bauern|der Wetterbericht:Wetterberichte|das Stück:Stücke|die Wüste:Wüsten|der Nordpol:-
der Nadelwald:Nadelwälder|der Laubwald:Laubwälder|der Nadelbaum:Nadelbäume|die Nadel:Nadeln|die Tanne:Tannen|der Laubbaum:Laubbäume
das Blatt:Blätter|der Mischwald:Mischwälder|das Reh:Rehe|der Fuchs:Füchse|das Wildschwein:Wildschweine|die Buche:Buchen|die Erdachse:-
die Lieblingsjahreszeit:Lieblingsjahreszeiten|das Zimmer:Zimmer|die Person:Personen
die Art:Arten|das Metall:Metalle|das Französische:-|das Lateinische:-|das Englische:-|das Fernsehen:-|die Schiene:Schienen|der Strom:-|die Ware:Waren
die Schweiz:-|das Bundesland:Bundesländer|die Ruhe:-|die Medizin:-|das Unglück:-|der Januar:-|der Februar:-|der März:-|der April:-|der Mai:-|der Juni:-
der Juli:-|der August:-|der September:-|der Oktober:-|der November:-|der Dezember:-
`;

/** lemma → plural (null = no plural). */
export const PLURALS = new Map<string, string | null>(
  TEXT_PLURALS.trim()
    .split(/[|\n]/)
    .map((pair) => {
      const [lemma, pl] = pair.split(':');
      return [lemma.trim(), pl.trim() === '-' ? null : pl.trim()] as [string, string | null];
    }),
);
