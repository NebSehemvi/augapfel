import type { Frame, Theme } from './types';
import { acts, nouns, pairs, spots, things } from './types';

const F = (v: string, n: string, o: Omit<Frame, 'v' | 'n'> = {}): Frame => ({ v, n, ...o });

export const food: Theme = {
  id: 'food',
  emoji: '🍎',
  name: { ru: 'Еда и напитки', de: 'Essen und Trinken', en: 'Food & drinks' },
  nouns: nouns(`
    m|Apfel|Äpfel|яблоко|apple
    f|Banane|Bananen|банан|banana
    n|Brot|Brote|хлеб|bread
    n|Brötchen|Brötchen|булочка|bread roll
    m*|Käse|-|сыр|cheese
    f*|Milch|-|молоко|milk
    m|Kaffee|Kaffees|кофе|coffee
    m|Tee|Tees|чай|tea
    n|Ei|Eier|яйцо|egg
    f|Kartoffel|Kartoffeln|картофель|potato
    f|Tomate|Tomaten|помидор|tomato
    m|Kuchen|Kuchen|пирог, торт|cake
    f|Suppe|Suppen|суп|soup
    m|Salat|Salate|салат|salad
    n*|Wasser|-|вода|water
    m|Saft|Säfte|сок|juice
    f|Wurst|Würste|колбаса|sausage
    n*|Fleisch|-|мясо|meat
    m|Fisch|Fische|рыба|fish
    f|Zwiebel|Zwiebeln|лук|onion
    n|Glas|Gläser|стакан|glass
    f|Tasse|Tassen|чашка|cup
    m|Teller|Teller|тарелка|plate
    m|Löffel|Löffel|ложка|spoon
    n|Messer|Messer|нож|knife
    f|Gabel|Gabeln|вилка|fork
    m|Kühlschrank|Kühlschränke|холодильник|fridge
    n|Restaurant|Restaurants|ресторан|restaurant
    f|Rechnung|Rechnungen|счёт|bill
    m|Kellner|Kellner|официант|waiter
    f|Pizza|Pizzas|пицца|pizza
    m*|Reis|-|рис|rice
    f|Flasche|Flaschen|бутылка|bottle
    m|Markt|Märkte|рынок|market
  `),
  acts: acts(`
    kochen|eine Suppe|варить суп
    backen|einen Kuchen|печь пирог
    essen|einen Apfel|есть яблоко
    trinken|einen Kaffee|пить кофе
    trinken|ein Glas Wasser|выпить стакан воды
    frühstücken|mit der Familie|завтракать с семьёй
    kaufen|Brot und Käse|покупать хлеб и сыр
    bestellen|eine Pizza|заказывать пиццу
    probieren|den Salat|пробовать салат
    schneiden|die Zwiebeln|резать лук
    braten|den Fisch|жарить рыбу
    bezahlen|die Rechnung|оплачивать счёт
    decken|den Tisch|накрывать на стол
    spülen|das Geschirr|мыть посуду
    einkaufen|im Supermarkt|делать покупки в супермаркете
    einladen|Freunde zum Essen|приглашать друзей на ужин
    mitbringen|einen Salat|приносить с собой салат
    aufmachen|eine Flasche Wein|открывать бутылку вина
    vorbereiten|das Abendessen|готовить ужин
    gehen|in ein Restaurant|идти в ресторан
    fahren|zum Markt|ехать на рынок
    nehmen|ein Stück Kuchen|брать кусок пирога
    geben|dem Kind einen Apfel|давать ребёнку яблоко
    empfehlen|die Suppe|рекомендовать суп
    vergessen|die Milch|забывать молоко
    essen|zu viel Schokolade|есть слишком много шоколада
    waschen|das Obst|мыть фрукты
    warten|auf das Essen|ждать еду|p
    sich freuen|auf das Abendessen|радоваться предстоящему ужину|p
    sprechen|über das Rezept|говорить о рецепте|p
    fragen|nach der Speisekarte|спрашивать меню|p
    sich beschweren|über das Essen|жаловаться на еду|p
    telefonieren|mit dem Pizzaservice|звонить в доставку пиццы|p
    sich bedanken|für das Essen|благодарить за еду|p
    haben|Hunger|быть голодным
    haben|Durst|хотеть пить
  `),
  times: ['zum Frühstück', 'mittags', 'nach der Arbeit'],
  causes: pairs(`
    essen|einen Salat >> haben|Hunger
    trinken|ein Glas Wasser >> haben|Durst
    kochen|eine Suppe >> haben|heute Gäste
    bestellen|eine Pizza >> haben|keine Zeit
    einkaufen|im Supermarkt >> haben|keine Milch mehr
    backen|einen Kuchen >> haben|morgen Geburtstag
    trinken|einen Kaffee >> sein|müde
  `),
  contras: pairs(`
    sein|satt >> essen|noch ein Stück Kuchen
    haben|keinen Hunger >> essen|eine Suppe
    sein|müde >> kochen|das Abendessen
    haben|wenig Geld >> gehen|in ein Restaurant
  `),
  frames: [
    F('kaufen', 'Apfel'),
    F('brauchen', 'Löffel'),
    F('essen', 'Brötchen'),
    F('trinken', 'Saft'),
    F('bestellen', 'Pizza'),
    F('suchen', 'Messer'),
    F('haben', 'Teller', { arts: ['kein'] }),
    F('nehmen', 'Tasse'),
    F('essen', 'Löffel', { p: 'mit', pre: 'die Suppe' }),
    F('schneiden', 'Messer', { p: 'mit', pre: 'das Brot' }),
    F('sprechen', 'Kellner', { p: 'mit' }),
    F('geben', 'Kellner', { case: 'dat', post: 'das Geld', arts: ['def'] }),
    F('danken', 'Kellner', { case: 'dat', arts: ['def'] }),
    F('backen', 'Tante', { p: 'für', pre: 'einen Kuchen', arts: ['mein'] }),
    F('fahren', 'Fahrrad', { p: 'mit', post: 'zum Markt', arts: ['def'] }),
  ],
  spots: spots('auf:Tisch, in:Kühlschrank, auf:Teller, in:Schrank'),
  things: things('Milch:s, Flasche:s, Glas:s, Tasse:s, Messer:l, Brot:l, Käse:l, Apfel:l, Kuchen:s, Löffel:l'),
};

export const home: Theme = {
  id: 'home',
  emoji: '🏠',
  name: { ru: 'Квартира и быт', de: 'Wohnung und Haushalt', en: 'Home & housework' },
  nouns: nouns(`
    f|Wohnung|Wohnungen|квартира|flat
    n|Zimmer|Zimmer|комната|room
    f|Küche|Küchen|кухня|kitchen
    n|Bad|Bäder|ванная|bathroom
    n|Schlafzimmer|Schlafzimmer|спальня|bedroom
    n|Wohnzimmer|Wohnzimmer|гостиная|living room
    m|Balkon|Balkons|балкон|balcony
    m|Tisch|Tische|стол|table
    m|Stuhl|Stühle|стул|chair
    n|Bett|Betten|кровать|bed
    n|Sofa|Sofas|диван|sofa
    m|Schrank|Schränke|шкаф|cupboard
    n|Regal|Regale|полка|shelf
    f|Lampe|Lampen|лампа|lamp
    m|Teppich|Teppiche|ковёр|carpet
    n|Fenster|Fenster|окно|window
    f|Tür|Türen|дверь|door
    f|Wand|Wände|стена|wall
    f|Waschmaschine|Waschmaschinen|стиральная машина|washing machine
    f|Pflanze|Pflanzen|растение|plant
    m|Schlüssel|Schlüssel|ключ|key
    f|Miete|Mieten|арендная плата|rent
    m|Vermieter|Vermieter|арендодатель|landlord
    mw|Nachbar|Nachbarn|сосед|neighbour
    f|Nachbarin|Nachbarinnen|соседка|neighbour (f)
    n|Haus|Häuser|дом|house
    m|Garten|Gärten|сад|garden
    n|Buch|Bücher|книга|book
    n|Handy|Handys|мобильный телефон|mobile phone
    f|Jacke|Jacken|куртка|jacket
    n|Bild|Bilder|картина|picture
    f|Vase|Vasen|ваза|vase
    m|Fernseher|Fernseher|телевизор|TV set
  `),
  acts: acts(`
    aufräumen|das Zimmer|убирать комнату
    putzen|das Bad|мыть ванную
    Staub saugen|im Wohnzimmer|пылесосить в гостиной
    waschen|die Wäsche|стирать бельё
    bügeln|die Hemden|гладить рубашки
    spülen|das Geschirr|мыть посуду
    reparieren|die Lampe|чинить лампу
    kaufen|ein neues Sofa|покупать новый диван
    mieten|eine Wohnung|снимать квартиру
    umziehen|in eine neue Wohnung|переезжать в новую квартиру
    bezahlen|die Miete|платить за квартиру
    öffnen|das Fenster|открывать окно
    zumachen|die Tür|закрывать дверь
    anmachen|das Licht|включать свет
    ausmachen|den Fernseher|выключать телевизор
    fernsehen|im Wohnzimmer|смотреть телевизор в гостиной
    schlafen|lange|долго спать
    bleiben|zu Hause|оставаться дома
    kochen|in der Küche|готовить на кухне
    einladen|die Nachbarn|приглашать соседей
    helfen|der Nachbarin|помогать соседке
    suchen|den Schlüssel|искать ключ
    finden|den Schlüssel nicht|не находить ключ
    sich ausruhen|auf dem Sofa|отдыхать на диване
    sich kümmern|um die Pflanzen|ухаживать за растениями|p
    sich ärgern|über den Lärm|злиться из-за шума|p
    sich beschweren|über die Nachbarn|жаловаться на соседей|pp
    warten|auf den Handwerker|ждать мастера|pp
    sprechen|mit dem Vermieter|говорить с арендодателем|pp
    denken|an die Miete|думать о квартплате|p
    sich gewöhnen|an die neue Wohnung|привыкать к новой квартире|p
  `),
  times: ['am Samstag', 'jeden Sonntag'],
  causes: pairs(`
    aufräumen|das Zimmer >> haben|heute Besuch
    öffnen|das Fenster >> brauchen|frische Luft
    Staub saugen|im Wohnzimmer >> haben|am Abend Gäste
    umziehen|in eine neue Wohnung >> brauchen|mehr Platz
    bleiben|zu Hause >> sein|krank
    anmachen|das Licht >> sehen|nichts
  `),
  contras: pairs(`
    sein|müde >> putzen|die Küche
    haben|wenig Zeit >> aufräumen|das Zimmer
    sein|krank >> waschen|die Wäsche
  `),
  frames: [
    F('kaufen', 'Sofa'),
    F('brauchen', 'Lampe'),
    F('suchen', 'Schlüssel'),
    F('putzen', 'Fenster', { arts: ['def'] }),
    F('reparieren', 'Waschmaschine', { arts: ['def'] }),
    F('haben', 'Balkon'),
    F('kaufen', 'Teppich'),
    F('helfen', 'Nachbarin', { case: 'dat' }),
    F('danken', 'Nachbar', { case: 'dat' }),
    F('wohnen', 'Nachbar', { p: 'bei', arts: ['mein'] }),
    F('sprechen', 'Vermieter', { p: 'mit' }),
    F('kaufen', 'Küche', { p: 'für', pre: 'eine Pflanze', arts: ['def'] }),
    F('telefonieren', 'Vermieter', { p: 'mit', arts: ['def'] }),
  ],
  spots: spots('auf:Tisch, auf:Sofa, in:Schrank, auf:Bett, in:Regal, neben:Lampe, unter:Bett, auf:Balkon'),
  things: things('Buch:l, Handy:l, Jacke:l, Schlüssel:l, Lampe:s, Vase:s, Pflanze:s'),
};

export const work: Theme = {
  id: 'work',
  emoji: '💼',
  name: { ru: 'Работа и офис', de: 'Arbeit und Büro', en: 'Work & office' },
  nouns: nouns(`
    n|Büro|Büros|офис|office
    mw|Kollege|Kollegen|коллега|colleague
    f|Kollegin|Kolleginnen|коллега (ж)|colleague (f)
    m|Chef|Chefs|начальник|boss
    f|Chefin|Chefinnen|начальница|boss (f)
    f|Besprechung|Besprechungen|совещание|meeting
    m|Termin|Termine|встреча, запись|appointment
    f|E-Mail|E-Mails|электронное письмо|email
    m|Computer|Computer|компьютер|computer
    m|Drucker|Drucker|принтер|printer
    m|Schreibtisch|Schreibtische|письменный стол|desk
    n|Projekt|Projekte|проект|project
    f|Pause|Pausen|перерыв|break
    m|Vertrag|Verträge|договор|contract
    n|Gehalt|Gehälter|зарплата|salary
    f|Firma|Firmen|фирма|company
    mw|Kunde|Kunden|клиент|customer
    f|Kundin|Kundinnen|клиентка|customer (f)
    m|Bericht|Berichte|отчёт|report
    f|Präsentation|Präsentationen|презентация|presentation
    n|Telefon|Telefone|телефон|telephone
    n|Dokument|Dokumente|документ|document
    m|Ordner|Ordner|папка|folder
    f|Tasche|Taschen|сумка|bag
    m|Kalender|Kalender|календарь|calendar
    mw|Praktikant|Praktikanten|стажёр|intern
    f|Kantine|Kantinen|столовая|canteen
  `),
  acts: acts(`
    arbeiten|im Büro|работать в офисе
    schreiben|eine E-Mail|писать письмо
    lesen|den Bericht|читать отчёт
    schicken|die Dokumente|отправлять документы
    drucken|die Präsentation|распечатывать презентацию
    haben|eine Besprechung|иметь совещание
    vorbereiten|die Präsentation|готовить презентацию
    machen|eine Pause|делать перерыв
    anrufen|den Chef|звонить начальнику
    fahren|mit dem Bus ins Büro|ехать на автобусе в офис
    kommen|zu spät|опаздывать
    verdienen|viel Geld|зарабатывать много денег
    unterschreiben|den Vertrag|подписывать договор
    übersetzen|einen Text|переводить текст
    erklären|dem Praktikanten das Projekt|объяснять стажёру проект
    helfen|der Kollegin|помогать коллеге
    bleiben|länger im Büro|оставаться дольше в офисе
    essen|in der Kantine|обедать в столовой
    trinken|einen Kaffee|пить кофе
    telefonieren|mit einem Kunden|говорить по телефону с клиентом|pp
    anfangen|mit der Arbeit|начинать работу|p
    aufhören|mit der Arbeit|заканчивать работу|p
    sich bewerben|um eine neue Stelle|претендовать на новую должность|p
    sich konzentrieren|auf das Projekt|сосредоточиться на проекте|p
    sich ärgern|über den Drucker|злиться на принтер|p
    sprechen|mit der Chefin|говорить с начальницей|pp
    warten|auf eine Antwort|ждать ответа|p
    teilnehmen|an einem Kurs|участвовать в курсе|p
    antworten|auf die E-Mail|отвечать на письмо|p
    sich treffen|mit den Kollegen|встречаться с коллегами|pp
  `),
  times: ['nach der Arbeit', 'in der Pause', 'um neun Uhr'],
  causes: pairs(`
    bleiben|länger im Büro >> haben|viel Arbeit
    trinken|einen Kaffee >> sein|müde
    schreiben|eine E-Mail >> haben|eine Frage
    kommen|zu spät >> stehen|im Stau
    anrufen|den Chef >> sein|krank
    sich bewerben|um eine neue Stelle >> verdienen|zu wenig
  `),
  contras: pairs(`
    sein|krank >> arbeiten|im Büro
    haben|viel Arbeit >> machen|eine Pause
    sein|müde >> vorbereiten|die Präsentation
  `),
  frames: [
    F('schreiben', 'E-Mail'),
    F('brauchen', 'Drucker'),
    F('haben', 'Termin'),
    F('suchen', 'Ordner'),
    F('lesen', 'Bericht'),
    F('anrufen', 'Kunde', { arts: ['def'] }),
    F('fragen', 'Chefin', { arts: ['def'] }),
    F('helfen', 'Kollegin', { case: 'dat' }),
    F('danken', 'Chefin', { case: 'dat', arts: ['def'] }),
    F('sprechen', 'Chef', { p: 'mit', arts: ['def'] }),
    F('fahren', 'Kollege', { p: 'mit', post: 'ins Büro' }),
    F('telefonieren', 'Kunde', { p: 'mit' }),
    F('arbeiten', 'Projekt', { p: 'an', case: 'dat' }),
  ],
  spots: spots('auf:Schreibtisch, in:Tasche, in:Ordner, neben:Computer, auf:Drucker'),
  things: things('Bericht:l, Handy:l, Kalender:l, Telefon:s, Tasse:s, Dokument:l'),
};

export const leisure: Theme = {
  id: 'leisure',
  emoji: '⚽',
  name: { ru: 'Свободное время и хобби', de: 'Freizeit und Hobbys', en: 'Free time & hobbies' },
  nouns: nouns(`
    n|Hobby|Hobbys|хобби|hobby
    m|Ball|Bälle|мяч|ball
    n|Fahrrad|Fahrräder|велосипед|bicycle
    n|Kino|Kinos|кинотеатр|cinema
    m|Film|Filme|фильм|film
    n|Konzert|Konzerte|концерт|concert
    f|Gitarre|Gitarren|гитара|guitar
    n|Klavier|Klaviere|пианино|piano
    n|Spiel|Spiele|игра|game
    m|Verein|Vereine|клуб, секция|club
    f|Mannschaft|Mannschaften|команда|team
    n|Museum|Museen|музей|museum
    f|Party|Partys|вечеринка|party
    n|Schwimmbad|Schwimmbäder|бассейн|swimming pool
    n|Fitnessstudio|Fitnessstudios|фитнес-клуб|gym
    m|Freund|Freunde|друг|friend
    f|Freundin|Freundinnen|подруга|friend (f)
    n|Foto|Fotos|фотография|photo
    f|Kamera|Kameras|камера|camera
    n|Lied|Lieder|песня|song
    n|Ticket|Tickets|билет|ticket
    m|Park|Parks|парк|park
  `),
  acts: acts(`
    spielen|Fußball|играть в футбол
    spielen|Gitarre|играть на гитаре
    schwimmen|im Schwimmbad|плавать в бассейне
    fahren|Fahrrad|кататься на велосипеде
    gehen|ins Kino|ходить в кино
    sehen|einen Film|смотреть фильм
    lesen|ein Buch|читать книгу
    malen|ein Bild|рисовать картину
    singen|im Chor|петь в хоре
    tanzen|auf einer Party|танцевать на вечеринке
    treffen|Freunde|встречать друзей
    fotografieren|im Park|фотографировать в парке
    joggen|im Park|бегать в парке
    reiten|im Wald|кататься верхом в лесу
    treiben|Sport|заниматься спортом
    gewinnen|das Spiel|выигрывать игру
    verlieren|das Spiel|проигрывать игру
    trainieren|im Verein|тренироваться в клубе
    kaufen|Tickets für das Konzert|покупать билеты на концерт
    ausgehen|mit Freunden|выходить куда-нибудь с друзьями
    spazieren gehen|im Park|гулять в парке
    sich langweilen|zu Hause|скучать дома
    sich treffen|mit Freunden|встречаться с друзьями|pp
    sich interessieren|für Musik|интересоваться музыкой|p
    sich freuen|auf das Konzert|радоваться предстоящему концерту|p
    sich verabreden|mit einer Freundin|договариваться о встрече с подругой|pp
    teilnehmen|an einem Tanzkurs|участвовать в курсе танцев|p
    träumen|von einer Weltreise|мечтать о кругосветном путешествии|p
    sich anmelden|für einen Kurs|записываться на курс|p
    sich unterhalten|über den Film|беседовать о фильме|p
  `),
  times: ['nach der Arbeit', 'am Sonntag'],
  causes: pairs(`
    gehen|ins Kino >> haben|heute frei
    spielen|Fußball >> treiben|gern Sport
    bleiben|zu Hause >> haben|keine Lust
    kaufen|Tickets für das Konzert >> lieben|die Band
    trainieren|jeden Tag >> haben|bald ein Turnier
  `),
  contras: pairs(`
    sein|müde >> gehen|auf die Party
    haben|wenig Zeit >> spielen|Gitarre
    trainieren|viel >> verlieren|das Spiel
  `),
  frames: [
    F('kaufen', 'Ball'),
    F('brauchen', 'Fahrrad'),
    F('suchen', 'Kamera'),
    F('haben', 'Hobby'),
    F('sehen', 'Film'),
    F('kaufen', 'Gitarre'),
    F('spielen', 'Freund', { p: 'mit', arts: ['mein', 'indef'] }),
    F('gehen', 'Freundin', { p: 'mit', post: 'ins Kino', arts: ['mein'] }),
    F('kaufen', 'Konzert', { p: 'für', pre: 'ein Ticket', arts: ['def'] }),
    F('fahren', 'Fahrrad', { p: 'mit', post: 'in den Park', arts: ['def'] }),
    F('gehen', 'Freund', { p: 'ohne', post: 'ins Kino', arts: ['mein'] }),
    F('helfen', 'Freundin', { case: 'dat', arts: ['mein'] }),
    F('schenken', 'Freund', { case: 'dat', post: 'ein Buch', arts: ['mein'] }),
  ],
};

export const travel: Theme = {
  id: 'travel',
  emoji: '✈️',
  name: { ru: 'Путешествия и транспорт', de: 'Reisen und Verkehr', en: 'Travel & transport' },
  nouns: nouns(`
    m|Zug|Züge|поезд|train
    m|Bus|Busse|автобус|bus
    n|Flugzeug|Flugzeuge|самолёт|plane
    m|Bahnhof|Bahnhöfe|вокзал|station
    m|Flughafen|Flughäfen|аэропорт|airport
    f|Fahrkarte|Fahrkarten|билет (на транспорт)|ticket
    m|Koffer|Koffer|чемодан|suitcase
    m|Rucksack|Rucksäcke|рюкзак|backpack
    n|Hotel|Hotels|отель|hotel
    m|Pass|Pässe|паспорт|passport
    f|Reise|Reisen|поездка|trip
    m|Urlaub|Urlaube|отпуск|holiday
    n|Meer|Meere|море|sea
    m|Strand|Strände|пляж|beach
    n*|Gepäck|-|багаж|luggage
    f|Stadt|Städte|город|city
    n|Land|Länder|страна|country
    m|Stadtplan|Stadtpläne|карта города|city map
    n|Taxi|Taxis|такси|taxi
    n|Auto|Autos|машина|car
    f|Haltestelle|Haltestellen|остановка|stop
    m|Berg|Berge|гора|mountain
    f|Sonnenbrille|Sonnenbrillen|солнечные очки|sunglasses
  `),
  acts: acts(`
    fliegen|nach Spanien|лететь в Испанию
    fahren|mit dem Zug nach Berlin|ехать на поезде в Берлин
    packen|den Koffer|собирать чемодан
    buchen|ein Hotel|бронировать отель
    kaufen|eine Fahrkarte|покупать билет
    ankommen|in München|приезжать в Мюнхен
    abfahren|pünktlich|отправляться вовремя
    umsteigen|in Frankfurt|делать пересадку во Франкфурте
    einsteigen|in den Zug|садиться в поезд
    aussteigen|am Hauptbahnhof|выходить на главном вокзале
    übernachten|im Hotel|ночевать в отеле
    besichtigen|die Altstadt|осматривать старый город
    fotografieren|den Dom|фотографировать собор
    schwimmen|im Meer|плавать в море
    liegen|am Strand|лежать на пляже
    wandern|in den Bergen|ходить в походы в горах
    mitnehmen|einen Regenschirm|брать с собой зонт
    vergessen|den Pass|забывать паспорт
    bleiben|eine Woche in Wien|оставаться на неделю в Вене
    machen|Urlaub|отдыхать (в отпуске)
    reisen|nach Italien|путешествовать в Италию
    zurückkommen|aus dem Urlaub|возвращаться из отпуска
    nehmen|ein Taxi|брать такси
    warten|auf den Zug|ждать поезд|p
    sich freuen|auf den Urlaub|радоваться предстоящему отпуску|p
    fragen|nach dem Weg|спрашивать дорогу|p
    sich erinnern|an die Reise|вспоминать поездку|p
    sich beschweren|über das Hotelzimmer|жаловаться на номер|p
    träumen|von einer Reise nach Japan|мечтать о поездке в Японию|p
    erzählen|von der Reise|рассказывать о поездке|p
  `),
  times: ['im Sommer', 'im Urlaub', 'nächste Woche'],
  pastTimes: ['letzten Sommer', 'im Urlaub'],
  causes: pairs(`
    nehmen|ein Taxi >> haben|viel Gepäck
    fahren|mit dem Zug >> haben|kein Auto
    buchen|ein Hotel >> brauchen|ein Zimmer
    bleiben|im Hotel >> sein|müde
    kaufen|eine Sonnenbrille >> fahren|ans Meer
  `),
  contras: pairs(`
    haben|wenig Geld >> reisen|nach Italien
    sein|müde >> besichtigen|die Altstadt
    haben|Angst vor dem Fliegen >> fliegen|nach Spanien
  `),
  frames: [
    F('kaufen', 'Fahrkarte'),
    F('brauchen', 'Koffer'),
    F('suchen', 'Haltestelle', { arts: ['def'] }),
    F('buchen', 'Hotel'),
    F('vergessen', 'Pass', { arts: ['mein'] }),
    F('nehmen', 'Taxi'),
    F('packen', 'Rucksack', { arts: ['mein', 'def'] }),
    F('fahren', 'Zug', { p: 'mit', arts: ['def'] }),
    F('fahren', 'Bus', { p: 'mit', post: 'in die Stadt', arts: ['def'] }),
    F('reisen', 'Rucksack', { p: 'mit', arts: ['indef'] }),
    F('kommen', 'Flughafen', { p: 'von', arts: ['def'] }),
    F('gehen', 'Stadt', { p: 'durch', arts: ['def'] }),
  ],
  spots: spots('in:Koffer, in:Rucksack, auf:Bett, in:Tasche'),
  things: things('Pass:l, Sonnenbrille:l, Fahrkarte:l, Ticket:l, Handy:l'),
};

export const shopping: Theme = {
  id: 'shopping',
  emoji: '🛍️',
  name: { ru: 'Покупки и одежда', de: 'Einkaufen und Kleidung', en: 'Shopping & clothes' },
  nouns: nouns(`
    n|Geschäft|Geschäfte|магазин|shop
    m|Supermarkt|Supermärkte|супермаркет|supermarket
    n|Kaufhaus|Kaufhäuser|универмаг|department store
    f|Kasse|Kassen|касса|checkout
    n*|Geld|-|деньги|money
    m|Preis|Preise|цена|price
    f|Hose|Hosen|брюки|trousers
    n|Hemd|Hemden|рубашка|shirt
    n|Kleid|Kleider|платье|dress
    m|Rock|Röcke|юбка|skirt
    m|Mantel|Mäntel|пальто|coat
    m|Schuh|Schuhe|ботинок, туфля|shoe
    m|Pullover|Pullover|свитер|sweater
    n|T-Shirt|T-Shirts|футболка|T-shirt
    f|Größe|Größen|размер|size
    f|Farbe|Farben|цвет|colour
    m|Verkäufer|Verkäufer|продавец|shop assistant
    f|Verkäuferin|Verkäuferinnen|продавщица|shop assistant (f)
    f|Kreditkarte|Kreditkarten|кредитная карта|credit card
    f|Tüte|Tüten|пакет|bag (plastic)
    m|Korb|Körbe|корзина|basket
    m|Laden|Läden|лавка, магазин|store
    f|Mütze|Mützen|шапка|cap, hat
    m|Schal|Schals|шарф|scarf
    n|Geschenk|Geschenke|подарок|present
  `),
  acts: acts(`
    kaufen|eine neue Jacke|покупать новую куртку
    anprobieren|die Hose|примерять брюки
    bezahlen|mit Karte|платить картой
    suchen|ein Geschenk|искать подарок
    brauchen|neue Schuhe|нуждаться в новой обуви
    einkaufen|auf dem Markt|делать покупки на рынке
    tragen|einen Mantel|носить пальто
    gehen|ins Kaufhaus|идти в универмаг
    ausgeben|viel Geld|тратить много денег
    finden|die Kasse nicht|не находить кассу
    bekommen|einen Rabatt|получать скидку
    bestellen|ein Kleid online|заказывать платье онлайн
    zeigen|der Freundin das Kleid|показывать подруге платье
    schenken|dem Bruder einen Pullover|дарить брату свитер
    umtauschen|die Schuhe|обменивать обувь
    sich anziehen|schnell|быстро одеваться
    sich ärgern|über den Preis|злиться из-за цены|p
    fragen|nach der Größe|спрашивать размер|p
    sich beschweren|über die Qualität|жаловаться на качество|p
    sprechen|mit der Verkäuferin|говорить с продавщицей|pp
    bitten|um eine Tüte|просить пакет|p
    sich freuen|über das Geschenk|радоваться подарку|p
    suchen|nach einem Geschenk|искать подарок|p
    warten|an der Kasse|ждать у кассы
  `),
  causes: pairs(`
    kaufen|eine neue Jacke >> frieren|im Winter
    bezahlen|mit Karte >> haben|kein Bargeld
    umtauschen|die Hose >> brauchen|eine andere Größe
    suchen|ein Geschenk >> gehen|morgen auf eine Party
    einkaufen|auf dem Markt >> mögen|frisches Obst
  `),
  contras: pairs(`
    haben|wenig Geld >> kaufen|ein teures Kleid
    haben|schon viele Schuhe >> kaufen|neue Schuhe
    sein|müde >> gehen|ins Kaufhaus
  `),
  frames: [
    F('kaufen', 'Hose'),
    F('brauchen', 'Mantel'),
    F('suchen', 'Kasse', { arts: ['def'] }),
    F('anprobieren', 'Kleid'),
    F('tragen', 'Rock'),
    F('haben', 'Tüte', { arts: ['kein', 'indef'] }),
    F('kaufen', 'Pullover'),
    F('bezahlen', 'Kreditkarte', { p: 'mit', arts: ['def', 'mein'] }),
    F('sprechen', 'Verkäuferin', { p: 'mit', arts: ['def'] }),
    F('kaufen', 'Bruder', { p: 'für', pre: 'eine Mütze', arts: ['mein'] }),
    F('schenken', 'Schwester', { case: 'dat', post: 'einen Schal', arts: ['mein'] }),
    F('gehen', 'Freundin', { p: 'mit', post: 'ins Kaufhaus', arts: ['mein'] }),
  ],
  spots: spots('in:Tasche, in:Korb, in:Regal, auf:Tisch'),
  things: things('Hemd:l, Pullover:l, T-Shirt:l, Mütze:l, Kreditkarte:l, Schal:l'),
};
