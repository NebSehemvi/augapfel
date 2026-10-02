import type { Frame, Theme } from './types';
import { acts, nouns, pairs, spots, things } from './types';

const F = (v: string, n: string, o: Omit<Frame, 'v' | 'n'> = {}): Frame => ({ v, n, ...o });

export const school: Theme = {
  id: 'school',
  emoji: '📚',
  name: { ru: 'Школа и учёба', de: 'Schule und Lernen', en: 'School & learning' },
  nouns: nouns(`
    f|Schule|Schulen|школа|school
    m|Kurs|Kurse|курс|course
    m|Lehrer|Lehrer|учитель|teacher
    f|Lehrerin|Lehrerinnen|учительница|teacher (f)
    mw|Student|Studenten|студент|student
    f|Studentin|Studentinnen|студентка|student (f)
    f|Hausaufgabe|Hausaufgaben|домашнее задание|homework
    n|Heft|Hefte|тетрадь|exercise book
    n|Wörterbuch|Wörterbücher|словарь|dictionary
    f|Prüfung|Prüfungen|экзамен|exam
    m|Test|Tests|тест|test
    f|Note|Noten|оценка|grade
    m|Kuli|Kulis|ручка|pen
    m|Bleistift|Bleistifte|карандаш|pencil
    f|Tafel|Tafeln|доска|board
    f|Klasse|Klassen|класс|class
    f|Frage|Fragen|вопрос|question
    f|Antwort|Antworten|ответ|answer
    f|Bibliothek|Bibliotheken|библиотека|library
    f|Universität|Universitäten|университет|university
    m|Text|Texte|текст|text
    m|Satz|Sätze|предложение|sentence
    m|Fehler|Fehler|ошибка|mistake
    m|Stuhl|Stühle|стул|chair
  `),
  acts: acts(`
    lernen|Deutsch|учить немецкий
    machen|die Hausaufgaben|делать домашнее задание
    schreiben|einen Test|писать тест
    lesen|einen Text|читать текст
    wiederholen|die Wörter|повторять слова
    üben|die Grammatik|тренировать грамматику
    verstehen|die Aufgabe|понимать задание
    übersetzen|einen Satz|переводить предложение
    fragen|den Lehrer|спрашивать учителя
    gehen|in die Bibliothek|идти в библиотеку
    bekommen|eine gute Note|получать хорошую оценку
    vergessen|das Heft|забывать тетрадь
    aufschreiben|die neuen Wörter|записывать новые слова
    korrigieren|die Fehler|исправлять ошибки
    studieren|an der Universität|учиться в университете
    abschreiben|die Hausaufgaben|списывать домашнее задание
    bestehen|die Prüfung|сдавать экзамен
    schlafen|im Unterricht|спать на уроке
    antworten|auf die Frage|отвечать на вопрос|p
    anfangen|mit dem Deutschkurs|начинать курс немецкого|p
    sich vorbereiten|auf die Prüfung|готовиться к экзамену|p
    sich konzentrieren|auf die Aufgabe|сосредоточиться на задании|p
    teilnehmen|an einem Kurs|участвовать в курсе|p
    sprechen|mit der Lehrerin|говорить с учительницей|pp
    sich anmelden|für den Kurs|записываться на курс|p
    fragen|nach der Hausaufgabe|спрашивать о домашнем задании|p
    sich interessieren|für Geschichte|интересоваться историей|p
    denken|an die Prüfung|думать об экзамене|p
    achten|auf die Aussprache|обращать внимание на произношение|p
  `),
  times: ['nach dem Unterricht', 'in der Pause', 'vor der Prüfung'],
  causes: pairs(`
    lernen|viel >> haben|morgen eine Prüfung
    gehen|in die Bibliothek >> brauchen|ein Wörterbuch
    fragen|den Lehrer >> verstehen|die Aufgabe nicht
    bekommen|eine gute Note >> lernen|jeden Tag
    wiederholen|die Wörter >> schreiben|morgen einen Test
  `),
  contras: pairs(`
    sein|müde >> machen|die Hausaufgaben
    lernen|viel >> bestehen|die Prüfung nicht
    verstehen|die Grammatik nicht >> machen|alle Übungen
  `),
  frames: [
    F('brauchen', 'Wörterbuch'),
    F('suchen', 'Kuli'),
    F('haben', 'Bleistift', { arts: ['kein', 'indef'] }),
    F('schreiben', 'Test'),
    F('kaufen', 'Heft'),
    F('lesen', 'Text'),
    F('fragen', 'Lehrerin', { arts: ['def'] }),
    F('helfen', 'Student', { case: 'dat', arts: ['def'] }),
    F('antworten', 'Lehrer', { case: 'dat', arts: ['def'] }),
    F('sprechen', 'Lehrer', { p: 'mit', arts: ['def'] }),
    F('lernen', 'Freundin', { p: 'mit', arts: ['mein', 'indef'] }),
    F('schreiben', 'Kuli', { p: 'mit', pre: 'den Text', arts: ['indef', 'mein'] }),
    F('fragen', 'Student', { arts: ['def'] }),
  ],
  spots: spots('in:Tasche, in:Rucksack, auf:Tisch, in:Regal, unter:Stuhl'),
  things: things('Buch:l, Heft:l, Kuli:l, Wörterbuch:l, Handy:l'),
};

export const family: Theme = {
  id: 'family',
  emoji: '👨‍👩‍👧',
  name: { ru: 'Семья и друзья', de: 'Familie und Freunde', en: 'Family & friends' },
  nouns: nouns(`
    f|Familie|Familien|семья|family
    f|Mutter|Mütter|мать|mother
    m|Vater|Väter|отец|father
    m|Bruder|Brüder|брат|brother
    f|Schwester|Schwestern|сестра|sister
    m|Sohn|Söhne|сын|son
    f|Tochter|Töchter|дочь|daughter
    n|Kind|Kinder|ребёнок|child
    m|Opa|Opas|дедушка|grandpa
    f|Oma|Omas|бабушка|grandma
    m|Onkel|Onkel|дядя|uncle
    f|Tante|Tanten|тётя|aunt
    n|Baby|Babys|младенец|baby
    m|Geburtstag|Geburtstage|день рождения|birthday
    f|Hochzeit|Hochzeiten|свадьба|wedding
    m|Brief|Briefe|письмо|letter
    f|Karte|Karten|открытка|card
    n|Fest|Feste|праздник|celebration
    m|Mann|Männer|мужчина, муж|man, husband
    f|Frau|Frauen|женщина, жена|woman, wife
    mw|Junge|Jungen|мальчик|boy
    n|Mädchen|Mädchen|девочка|girl
    m|Hund|Hunde|собака|dog
    f|Katze|Katzen|кошка|cat
    m|Enkel|Enkel|внук|grandson
    f|Enkelin|Enkelinnen|внучка|granddaughter
  `),
  acts: acts(`
    besuchen|die Großeltern|навещать бабушку и дедушку
    feiern|den Geburtstag|праздновать день рождения
    anrufen|die Oma|звонить бабушке
    schreiben|eine Karte|писать открытку
    schenken|der Mutter Blumen|дарить маме цветы
    helfen|dem Vater im Garten|помогать папе в саду
    spielen|mit den Kindern|играть с детьми
    abholen|die Kinder von der Schule|забирать детей из школы
    einladen|die ganze Familie|приглашать всю семью
    kochen|für die Familie|готовить для семьи
    erzählen|eine Geschichte|рассказывать историю
    vorlesen|den Kindern ein Märchen|читать детям сказку
    heiraten|in Italien|жениться / выходить замуж в Италии
    kennenlernen|die Eltern von Tom|знакомиться с родителями Тома
    fahren|zu den Eltern|ехать к родителям
    bleiben|bei der Oma|оставаться у бабушки
    spazieren gehen|mit dem Hund|гулять с собакой
    treffen|die Cousins|встречать двоюродных братьев
    backen|einen Kuchen|печь пирог
    sich kümmern|um die Katze|заботиться о кошке|p
    sich freuen|auf die Hochzeit|радоваться предстоящей свадьбе|p
    telefonieren|mit dem Bruder|говорить по телефону с братом|pp
    sich erinnern|an den Opa|вспоминать дедушку|pp
    sprechen|mit der Tochter|говорить с дочерью|pp
    warten|auf die Kinder|ждать детей|pp
    denken|an die Familie|думать о семье|p
    sich bedanken|für das Geschenk|благодарить за подарок|p
    sich verlieben|in einen Kollegen|влюбиться в коллегу|pp
  `),
  times: ['an Weihnachten', 'am Sonntag'],
  causes: pairs(`
    kaufen|ein Geschenk >> gehen|zu einer Geburtstagsparty
    anrufen|die Oma >> denken|oft an sie
    bleiben|zu Hause >> warten|auf die Kinder
    fahren|zu den Eltern >> feiern|dort Weihnachten
    backen|einen Kuchen >> haben|heute Geburtstag
  `),
  contras: pairs(`
    haben|wenig Zeit >> besuchen|die Oma
    sein|müde >> spielen|mit den Kindern
    wohnen|weit weg >> sehen|die Familie oft
  `),
  frames: [
    F('besuchen', 'Tante', { arts: ['mein'] }),
    F('anrufen', 'Bruder', { arts: ['mein'] }),
    F('suchen', 'Katze', { arts: ['def', 'mein'] }),
    F('haben', 'Hund', { arts: ['indef', 'kein'] }),
    F('kaufen', 'Geschenk'),
    F('helfen', 'Oma', { case: 'dat', arts: ['mein'] }),
    F('schenken', 'Mutter', { case: 'dat', post: 'Blumen', arts: ['mein'] }),
    F('danken', 'Vater', { case: 'dat', arts: ['mein'] }),
    F('spielen', 'Kind', { p: 'mit', arts: ['def'], plural: true }),
    F('wohnen', 'Opa', { p: 'bei', arts: ['mein'] }),
    F('kaufen', 'Sohn', { p: 'für', pre: 'ein Fahrrad', arts: ['mein'] }),
    F('fahren', 'Schwester', { p: 'zu', arts: ['mein'] }),
    F('gehen', 'Junge', { p: 'mit', post: 'in den Park', arts: ['def'] }),
  ],
};

export const health: Theme = {
  id: 'health',
  emoji: '🩺',
  name: { ru: 'Здоровье и тело', de: 'Gesundheit und Körper', en: 'Health & body' },
  nouns: nouns(`
    m|Arzt|Ärzte|врач|doctor
    f|Ärztin|Ärztinnen|врач (ж)|doctor (f)
    m|Kopf|Köpfe|голова|head
    m|Bauch|Bäuche|живот|belly
    m|Rücken|Rücken|спина|back
    n|Bein|Beine|нога|leg
    m|Arm|Arme|рука (от плеча)|arm
    f|Hand|Hände|кисть руки|hand
    m|Zahn|Zähne|зуб|tooth
    n|Auge|Augen|глаз|eye
    n|Ohr|Ohren|ухо|ear
    n*|Fieber|-|температура (жар)|fever
    f|Tablette|Tabletten|таблетка|pill
    n|Medikament|Medikamente|лекарство|medicine
    f|Apotheke|Apotheken|аптека|pharmacy
    n|Krankenhaus|Krankenhäuser|больница|hospital
    n|Rezept|Rezepte|рецепт|prescription
    f|Erkältung|Erkältungen|простуда|cold
    mw|Patient|Patienten|пациент|patient
    n|Pflaster|Pflaster|пластырь|plaster
    n|Thermometer|Thermometer|градусник|thermometer
    f|Salbe|Salben|мазь|ointment
  `),
  acts: acts(`
    gehen|zum Arzt|идти к врачу
    nehmen|eine Tablette|принимать таблетку
    bleiben|im Bett|оставаться в постели
    trinken|viel Tee|пить много чая
    messen|Fieber|измерять температуру
    machen|einen Termin|записываться на приём
    anrufen|die Praxis|звонить в кабинет врача
    holen|Medikamente aus der Apotheke|забирать лекарства из аптеки
    schlafen|viel|много спать
    husten|die ganze Nacht|кашлять всю ночь
    sich ausruhen|zu Hause|отдыхать дома
    sich erkälten|schnell|быстро простужаться
    sich hinlegen|auf das Sofa|прилечь на диван
    sich fühlen|nicht gut|плохо себя чувствовать
    abnehmen|fünf Kilo|худеть на пять кило
    treiben|mehr Sport|больше заниматься спортом
    essen|mehr Obst|есть больше фруктов
    zeigen|dem Arzt das Bein|показывать врачу ногу
    ausfüllen|das Formular|заполнять формуляр
    fahren|ins Krankenhaus|ехать в больницу
    warten|auf den Arzt|ждать врача|pp
    fragen|nach einem Termin|спрашивать о записи на приём|p
    sprechen|mit der Ärztin|говорить с врачом|pp
    sich kümmern|um die Gesundheit|заботиться о здоровье|p
    sich gewöhnen|an die Tabletten|привыкать к таблеткам|p
    sich bedanken|für das Rezept|благодарить за рецепт|p
  `),
  times: ['seit gestern', 'am Morgen'],
  causes: pairs(`
    gehen|zum Arzt >> haben|Fieber
    bleiben|im Bett >> sein|krank
    nehmen|eine Tablette >> haben|Kopfschmerzen
    trinken|viel Tee >> haben|eine Erkältung
    treiben|mehr Sport >> haben|Rückenschmerzen
  `),
  contras: pairs(`
    haben|Fieber >> gehen|zur Arbeit
    sein|krank >> treffen|Freunde
    haben|Zahnschmerzen >> essen|ein Eis
  `),
  frames: [
    F('brauchen', 'Tablette'),
    F('haben', 'Termin'),
    F('suchen', 'Apotheke'),
    F('nehmen', 'Medikament', { arts: ['def', 'indef'] }),
    F('brauchen', 'Pflaster'),
    F('haben', 'Rezept', { arts: ['indef', 'kein'] }),
    F('fragen', 'Ärztin', { arts: ['def'] }),
    F('helfen', 'Patient', { case: 'dat', arts: ['def'] }),
    F('sprechen', 'Arzt', { p: 'mit', arts: ['def'] }),
    F('messen', 'Thermometer', { p: 'mit', pre: 'Fieber', arts: ['indef', 'def'] }),
    F('zeigen', 'Ärztin', { case: 'dat', post: 'den Arm', arts: ['def'] }),
    F('kaufen', 'Salbe', { arts: ['indef'] }),
  ],
};

export const city: Theme = {
  id: 'city',
  emoji: '🏙️',
  name: { ru: 'Город и дорога', de: 'Stadt und Wege', en: 'City & directions' },
  nouns: nouns(`
    f|Straße|Straßen|улица|street
    m|Platz|Plätze|площадь|square
    f|Kirche|Kirchen|церковь|church
    n|Rathaus|Rathäuser|ратуша|town hall
    f|Bank|Banken|банк|bank
    f|Brücke|Brücken|мост|bridge
    f|Ampel|Ampeln|светофор|traffic light
    f|Kreuzung|Kreuzungen|перекрёсток|crossroads
    f|U-Bahn|U-Bahnen|метро|underground
    f|Straßenbahn|Straßenbahnen|трамвай|tram
    n|Café|Cafés|кафе|café
    m|Weg|Wege|путь, дорога|way
    mw|Tourist|Touristen|турист|tourist
    f|Touristin|Touristinnen|туристка|tourist (f)
    m|Turm|Türme|башня|tower
    f|Ecke|Ecken|угол|corner
    n|Zentrum|Zentren|центр|centre
    f|Post|-|почта|post office
    f*|Polizei|-|полиция|police
  `),
  acts: acts(`
    suchen|den Bahnhof|искать вокзал
    fahren|mit der U-Bahn|ехать на метро
    gehen|über die Brücke|идти через мост
    nehmen|die Straßenbahn|садиться на трамвай
    besichtigen|das Rathaus|осматривать ратушу
    abbiegen|an der Ampel rechts|поворачивать на светофоре направо
    gehen|geradeaus|идти прямо
    zeigen|dem Touristen den Weg|показывать туристу дорогу
    parken|in der Nähe|парковаться рядом
    trinken|einen Kaffee im Café|пить кофе в кафе
    wohnen|im Zentrum|жить в центре
    holen|Geld von der Bank|снимать деньги в банке
    aussteigen|am Marktplatz|выходить на рыночной площади
    laufen|in die Stadt|идти пешком в город
    verstehen|den Stadtplan nicht|не понимать карту
    kennen|die Stadt gut|хорошо знать город
    sich verlaufen|in der Altstadt|заблудиться в старом городе
    warten|an der Haltestelle|ждать на остановке
    fragen|nach dem Weg|спрашивать дорогу|p
    warten|auf die Straßenbahn|ждать трамвай|p
    sich interessieren|für die Geschichte der Stadt|интересоваться историей города|p
    sich verabreden|mit einem Freund|договариваться о встрече с другом|pp
    sich treffen|mit Kollegen im Café|встречаться с коллегами в кафе|pp
    sich ärgern|über den Verkehr|злиться из-за пробок|p
    sich gewöhnen|an die große Stadt|привыкать к большому городу|p
  `),
  causes: pairs(`
    nehmen|ein Taxi >> haben|keine Zeit
    fragen|nach dem Weg >> finden|das Museum nicht
    fahren|mit dem Fahrrad >> mögen|keine Busse
    wohnen|im Zentrum >> lieben|die Stadt
    gehen|zu Fuß >> brauchen|Bewegung
  `),
  contras: pairs(`
    haben|einen Stadtplan >> sich verlaufen|in der Altstadt
    wohnen|weit vom Zentrum >> fahren|jeden Tag in die Stadt
    sein|müde >> besichtigen|das Museum
  `),
  frames: [
    F('suchen', 'Bank'),
    F('sehen', 'Kirche', { arts: ['def'] }),
    F('nehmen', 'Straßenbahn', { arts: ['def'] }),
    F('finden', 'Haltestelle', { arts: ['def'] }),
    F('suchen', 'Café'),
    F('brauchen', 'Stadtplan'),
    F('fahren', 'U-Bahn', { p: 'mit', arts: ['def'] }),
    F('gehen', 'Brücke', { p: 'über', case: 'akk', arts: ['def'] }),
    F('helfen', 'Tourist', { case: 'dat', arts: ['def'] }),
    F('gehen', 'Park', { p: 'durch', arts: ['def'] }),
    F('kommen', 'Rathaus', { p: 'aus', arts: ['def'] }),
    F('gehen', 'Ecke', { p: 'um', arts: ['def'] }),
    F('sprechen', 'Touristin', { p: 'mit', arts: ['def', 'indef'] }),
  ],
};

export const daily: Theme = {
  id: 'daily',
  emoji: '⏰',
  name: { ru: 'Распорядок дня', de: 'Tagesablauf', en: 'Daily routine' },
  nouns: nouns(`
    m|Morgen|Morgen|утро|morning
    m|Abend|Abende|вечер|evening
    m|Tag|Tage|день|day
    f|Woche|Wochen|неделя|week
    f|Uhr|Uhren|часы|clock
    m|Wecker|Wecker|будильник|alarm clock
    f|Dusche|Duschen|душ|shower
    n|Frühstück|Frühstücke|завтрак|breakfast
    n|Mittagessen|Mittagessen|обед|lunch
    n|Abendessen|Abendessen|ужин|dinner
    f|Zahnbürste|Zahnbürsten|зубная щётка|toothbrush
    n|Handtuch|Handtücher|полотенце|towel
    f|Zeitung|Zeitungen|газета|newspaper
    f|Nachricht|Nachrichten|сообщение|message
    m|Feierabend|Feierabende|конец рабочего дня|end of the workday
    m|Spiegel|Spiegel|зеркало|mirror
  `),
  acts: acts(`
    aufstehen|früh|рано вставать
    aufwachen|vor dem Wecker|просыпаться до будильника
    duschen|schnell|быстро принимать душ
    frühstücken|in der Küche|завтракать на кухне
    sich anziehen|schnell|быстро одеваться
    sich waschen|im Bad|умываться в ванной
    putzen|die Zähne|чистить зубы
    lesen|die Zeitung|читать газету
    fahren|zur Arbeit|ехать на работу
    arbeiten|acht Stunden|работать восемь часов
    essen|zu Mittag|обедать
    einkaufen|für das Abendessen|делать покупки к ужину
    kochen|das Abendessen|готовить ужин
    fernsehen|ein bisschen|немного смотреть телевизор
    gehen|ins Bett|ложиться спать
    einschlafen|schnell|быстро засыпать
    schreiben|Nachrichten|писать сообщения
    lesen|E-Mails|читать письма
    machen|Sport|заниматься спортом
    sich beeilen||торопиться
    abholen|die Kinder|забирать детей
    anfangen|mit der Arbeit|начинать работу|p
    warten|auf den Bus|ждать автобус|p
    sich freuen|auf den Feierabend|радоваться концу рабочего дня|p
    sich kümmern|um den Haushalt|заниматься хозяйством|p
    denken|an den Termin|думать о встрече|p
    sich vorbereiten|auf den Tag|готовиться к дню|p
  `),
  times: ['um sieben Uhr', 'nach dem Frühstück', 'nach der Arbeit'],
  causes: pairs(`
    aufstehen|früh >> haben|viel zu tun
    sich beeilen| >> haben|einen Termin
    trinken|einen Kaffee >> sein|noch müde
    gehen|früh ins Bett >> haben|morgen viel Arbeit
    fahren|mit dem Auto zur Arbeit >> wohnen|weit weg
  `),
  contras: pairs(`
    sein|müde >> aufstehen|um sechs Uhr
    haben|keine Zeit >> frühstücken|in Ruhe
    gehen|spät ins Bett >> sein|morgens fit
  `),
  frames: [
    F('brauchen', 'Handtuch'),
    F('suchen', 'Zahnbürste', { arts: ['mein', 'def'] }),
    F('stellen', 'Wecker', { arts: ['def'] }),
    F('lesen', 'Zeitung', { arts: ['def'] }),
    F('haben', 'Termin'),
    F('schreiben', 'Nachricht'),
    F('kochen', 'Mittagessen', { arts: ['def'] }),
    F('frühstücken', 'Familie', { p: 'mit', arts: ['def', 'mein'] }),
    F('fahren', 'Kollege', { p: 'mit', post: 'zur Arbeit', arts: ['def', 'mein'] }),
    F('telefonieren', 'Mutter', { p: 'mit', arts: ['mein'] }),
  ],
};

export const nature: Theme = {
  id: 'nature',
  emoji: '🌦️',
  name: { ru: 'Погода и природа', de: 'Wetter und Natur', en: 'Weather & nature' },
  nouns: nouns(`
    n*|Wetter|-|погода|weather
    m*|Regen|-|дождь|rain
    m*|Schnee|-|снег|snow
    f|Sonne|Sonnen|солнце|sun
    m|Wind|Winde|ветер|wind
    f|Wolke|Wolken|облако|cloud
    m|Wald|Wälder|лес|forest
    m|See|Seen|озеро|lake
    m|Fluss|Flüsse|река|river
    f|Blume|Blumen|цветок|flower
    m|Baum|Bäume|дерево|tree
    n|Tier|Tiere|животное|animal
    m|Vogel|Vögel|птица|bird
    f|Wiese|Wiesen|луг|meadow
    n|Zelt|Zelte|палатка|tent
    m|Regenschirm|Regenschirme|зонт|umbrella
    f|Jahreszeit|Jahreszeiten|время года|season
    m|Frühling|Frühlinge|весна|spring
    m|Herbst|Herbste|осень|autumn
    m|Winter|Winter|зима|winter
    m|Sommer|Sommer|лето|summer
    n|Gewitter|Gewitter|гроза|thunderstorm
    m|Pilz|Pilze|гриб|mushroom
    n|Picknick|Picknicks|пикник|picnic
  `),
  acts: acts(`
    wandern|im Wald|ходить в поход по лесу
    spazieren gehen|am See|гулять у озера
    schwimmen|im See|плавать в озере
    fotografieren|die Blumen|фотографировать цветы
    sammeln|Pilze|собирать грибы
    machen|ein Picknick|устраивать пикник
    zelten|am See|жить в палатке у озера
    grillen|im Park|жарить на гриле в парке
    fahren|mit dem Fahrrad an den See|ехать на велосипеде к озеру
    mitnehmen|einen Regenschirm|брать с собой зонт
    tragen|eine warme Jacke|носить тёплую куртку
    bleiben|bei Regen zu Hause|оставаться дома в дождь
    frieren|ohne Mütze|мёрзнуть без шапки
    liegen|in der Sonne|лежать на солнце
    klettern|auf einen Berg|взбираться на гору
    sehen|einen Regenbogen|видеть радугу
    hören|die Vögel|слышать птиц
    sich freuen|auf den Frühling|радоваться предстоящей весне|p
    sich freuen|über das schöne Wetter|радоваться хорошей погоде|p
    sich ärgern|über den Regen|злиться из-за дождя|p
    sich interessieren|für Tiere|интересоваться животными|p
    träumen|von einem Haus am Meer|мечтать о доме у моря|p
    sprechen|über das Wetter|говорить о погоде|p
    warten|auf die Sonne|ждать солнца|p
    sich gewöhnen|an die Kälte|привыкать к холоду|p
  `),
  times: ['im Winter', 'im Frühling', 'im Herbst'],
  pastTimes: ['letzten Winter', 'im Herbst'],
  causes: pairs(`
    mitnehmen|einen Regenschirm >> sehen|dunkle Wolken
    bleiben|zu Hause >> haben|Angst vor dem Gewitter
    tragen|eine warme Jacke >> frieren|schnell
    gehen|an den See >> lieben|die Natur
  `),
  contras: pairs(`
    haben|keinen Regenschirm >> spazieren gehen|im Regen
    frieren|schnell >> schwimmen|im kalten See
    haben|Angst vor Spinnen >> zelten|im Wald
    sein|müde >> klettern|auf einen Berg
  `),
  frames: [
    F('brauchen', 'Regenschirm'),
    F('sehen', 'Vogel'),
    F('haben', 'Zelt', { arts: ['indef', 'kein'] }),
    F('suchen', 'Pilz', { arts: ['def'], plural: true }),
    F('fotografieren', 'Baum'),
    F('mögen', 'Winter', { arts: ['def'] }),
    F('gehen', 'Wald', { p: 'durch', arts: ['def'] }),
    F('wandern', 'Freund', { p: 'mit', arts: ['mein', 'indef'] }),
    F('sehen', 'Blume', { arts: ['def'], plural: true }),
    F('schwimmen', 'Fluss', { p: 'durch', arts: ['def'] }),
  ],
};
