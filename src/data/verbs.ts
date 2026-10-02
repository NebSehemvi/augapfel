import type { Aux, Level, Verb, VerbKind } from '../grammar/types';
import { weakPartizip, weakPraeteritum } from '../grammar/conjugate';

/*
 * Row format: inf|ru|en|level|kind|pres|praet|pp|aux|class
 *   inf   – "sich " prefix = reflexive, "~" marks the separable prefix ("auf~stehen", "spazieren ~gehen")
 *   kind  – w weak, s strong, m mixed, mod modal, aux auxiliary
 *   pres  – "" | "du,er" stem change | "f:ich,du,er,wir,ihr,sie" full paradigm (of the base verb)
 *   praet – Präteritum ich/er of the base; "" = regular; "/" separates accepted variants
 *   pp    – Partizip II incl. prefix; "" = regular
 *   aux   – h | s | hs (both, haben preferred) | sh (both, sein preferred)
 *   class – ablaut class of the strong-verb table
 */

// The strong / irregular verb table (de-online.ru), tagged by level.
const TABLE = `
bleiben|оставаться|to stay|A1|s||blieb|geblieben|s|1a
leihen|брать/давать взаймы|to lend, borrow|A2|s||lieh|geliehen|h|1a
meiden|избегать|to avoid|B1|s||mied|gemieden|h|1a
scheiden|разделять, разводить|to separate, divorce|B1|s||schied|geschieden|hs|1a
scheinen|светить; казаться|to shine; to seem|A2|s||schien|geschienen|h|1a
schreiben|писать|to write|A1|s||schrieb|geschrieben|h|1a
schreien|кричать|to scream|B1|s||schrie|geschrien|h|1a
schweigen|молчать|to be silent|B1|s||schwieg|geschwiegen|h|1a
steigen|подниматься|to climb, rise|A2|s||stieg|gestiegen|s|1a
treiben|гнать; заниматься (спортом)|to drive; to do (sports)|A2|s||trieb|getrieben|h|1a
verzeihen|прощать|to forgive|B1|s||verzieh|verziehen|h|1a
weisen|указывать|to point|B1|s||wies|gewiesen|h|1a
beißen|кусать|to bite|B1|s||biss|gebissen|h|1b
gleichen|быть похожим|to resemble|B1|s||glich|geglichen|h|1b
gleiten|скользить|to glide|B1|s||glitt|geglitten|s|1b
greifen|хватать, браться|to grab|B1|s||griff|gegriffen|h|1b
leiden|страдать|to suffer|B1|s||litt|gelitten|h|1b
pfeifen|свистеть|to whistle|B1|s||pfiff|gepfiffen|h|1b
reißen|рвать|to tear|B1|s||riss|gerissen|h|1b
reiten|ездить верхом|to ride (a horse)|A2|s||ritt|geritten|sh|1b
schneiden|резать|to cut|A2|s||schnitt|geschnitten|h|1b
schreiten|шагать, шествовать|to stride|B1|s||schritt|geschritten|s|1b
streichen|красить; вычёркивать|to paint; to cross out|B1|s||strich|gestrichen|h|1b
streiten|спорить, ссориться|to argue|B1|s||stritt|gestritten|h|1b
biegen|гнуть; поворачивать|to bend; to turn|B1|s||bog|gebogen|hs|2
bieten|предлагать|to offer|A2|s||bot|geboten|h|2
fliegen|летать|to fly|A1|s||flog|geflogen|s|2
fliehen|убегать|to flee|B1|s||floh|geflohen|s|2
fließen|течь|to flow|B1|s||floss|geflossen|s|2
frieren|мёрзнуть|to freeze, be cold|A2|s||fror|gefroren|h|2
gießen|лить; поливать|to pour; to water|B1|s||goss|gegossen|h|2
genießen|наслаждаться|to enjoy|B1|s||genoss|genossen|h|2
kriechen|ползать|to crawl|B1|s||kroch|gekrochen|s|2
riechen|нюхать; пахнуть|to smell|B1|s||roch|gerochen|h|2
schieben|двигать|to push|B1|s||schob|geschoben|h|2
schießen|стрелять|to shoot|B1|s||schoss|geschossen|h|2
schließen|закрывать|to close|A2|s||schloss|geschlossen|h|2
verlieren|терять; проигрывать|to lose|A2|s||verlor|verloren|h|2
wiegen|взвешивать; весить|to weigh|B1|s||wog|gewogen|h|2
ziehen|тянуть; переезжать|to pull; to move|A2|s||zog|gezogen|hs|2
binden|завязывать|to tie|B1|s||band|gebunden|h|3a
dringen|проникать; настаивать|to penetrate; to insist|B1|s||drang|gedrungen|sh|3a
finden|находить|to find|A1|s||fand|gefunden|h|3a
gelingen|удаваться|to succeed|B1|s||gelang|gelungen|s|3a
klingen|звучать|to sound|B1|s||klang|geklungen|h|3a
singen|петь|to sing|A1|s||sang|gesungen|h|3a
sinken|тонуть, снижаться|to sink|B1|s||sank|gesunken|s|3a
springen|прыгать|to jump|A2|s||sprang|gesprungen|s|3a
trinken|пить|to drink|A1|s||trank|getrunken|h|3a
verschwinden|исчезать|to disappear|B1|s||verschwand|verschwunden|s|3a
zwingen|принуждать|to force|B1|s||zwang|gezwungen|h|3a
beginnen|начинать|to begin|A1|s||begann|begonnen|h|3b
gewinnen|выигрывать|to win|A2|s||gewann|gewonnen|h|3b
schwimmen|плавать|to swim|A1|s||schwamm|geschwommen|sh|3b
befehlen|приказывать|to order|B1|s|befiehlst,befiehlt|befahl|befohlen|h|4
bergen|спасать, прятать|to rescue, hide|B1|s|birgst,birgt|barg|geborgen|h|4
bersten|трескаться|to burst|B1|s|birst,birst|barst|geborsten|s|4
brechen|ломать|to break|B1|s|brichst,bricht|brach|gebrochen|hs|4
erschrecken|пугаться|to be startled|B1|s|erschrickst,erschrickt|erschrak|erschrocken|s|4
gelten|считаться; быть действительным|to be valid|B1|s|giltst,gilt|galt|gegolten|h|4
helfen|помогать|to help|A1|s|hilfst,hilft|half|geholfen|h|4
nehmen|брать|to take|A1|s|nimmst,nimmt|nahm|genommen|h|4
sprechen|говорить|to speak|A1|s|sprichst,spricht|sprach|gesprochen|h|4
stehlen|красть|to steal|B1|s|stiehlst,stiehlt|stahl|gestohlen|h|4
sterben|умирать|to die|A2|s|stirbst,stirbt|starb|gestorben|s|4
treffen|встречать(ся)|to meet|A1|s|triffst,trifft|traf|getroffen|h|4
werben|набирать; рекламировать|to advertise, recruit|B1|s|wirbst,wirbt|warb|geworben|h|4
werfen|бросать|to throw|B1|s|wirfst,wirft|warf|geworfen|h|4
gebären|рожать|to give birth|B1|s|gebärst,gebärt|gebar|geboren|h|4
essen|есть|to eat|A1|s|isst,isst|aß|gegessen|h|5
geben|давать|to give|A1|s|gibst,gibt|gab|gegeben|h|5
genesen|выздоравливать|to recover|B1|s||genas|genesen|s|5
geschehen|происходить, случаться|to happen|B1|s|geschiehst,geschieht|geschah|geschehen|s|5
lesen|читать|to read|A1|s|liest,liest|las|gelesen|h|5
messen|измерять|to measure|B1|s|misst,misst|maß|gemessen|h|5
sehen|видеть|to see|A1|s|siehst,sieht|sah|gesehen|h|5
treten|(на)ступать; пинать|to step; to kick|B1|s|trittst,tritt|trat|getreten|hs|5
vergessen|забывать|to forget|A1|s|vergisst,vergisst|vergaß|vergessen|h|5
bitten|просить|to ask (for)|A2|s||bat|gebeten|h|5
liegen|лежать|to lie (be lying)|A1|s||lag|gelegen|h|5
sitzen|сидеть|to sit|A1|s||saß|gesessen|h|5
backen|печь|to bake|A1|s||backte/buk|gebacken|h|6
fahren|ехать|to drive, go (by vehicle)|A1|s|fährst,fährt|fuhr|gefahren|s|6
graben|копать|to dig|B1|s|gräbst,gräbt|grub|gegraben|h|6
laden|грузить|to load|B1|s|lädst,lädt|lud|geladen|h|6
schaffen|создавать|to create|B1|s||schuf|geschaffen|h|6
schlagen|бить|to hit|B1|s|schlägst,schlägt|schlug|geschlagen|h|6
tragen|нести; носить|to carry; to wear|A2|s|trägst,trägt|trug|getragen|h|6
wachsen|расти|to grow|B1|s|wächst,wächst|wuchs|gewachsen|s|6
waschen|мыть, стирать|to wash|A2|s|wäschst,wäscht|wusch|gewaschen|h|6
erwägen|обдумывать|to consider|B1|s||erwog|erwogen|h|6b
flechten|плести|to braid|B1|s|flichtst,flicht|flocht|geflochten|h|6b
heben|поднимать|to lift|B1|s||hob|gehoben|h|6b
lügen|лгать|to lie (tell lies)|B1|s||log|gelogen|h|6b
schmelzen|таять|to melt|B1|s|schmilzt,schmilzt|schmolz|geschmolzen|s|6b
blasen|дуть|to blow|B1|s|bläst,bläst|blies|geblasen|h|7a
braten|жарить|to fry, roast|A2|s|brätst,brät|briet|gebraten|h|7a
fallen|падать|to fall|A2|s|fällst,fällt|fiel|gefallen|s|7a
gefallen|нравиться|to please (be liked)|A1|s|gefällst,gefällt|gefiel|gefallen|h|7a
halten|держать; останавливаться|to hold; to stop|A2|s|hältst,hält|hielt|gehalten|h|7a
lassen|оставлять; позволять|to leave; to let|A2|s|lässt,lässt|ließ|gelassen|h|7a
raten|советовать; угадывать|to advise; to guess|B1|s|rätst,rät|riet|geraten|h|7a
schlafen|спать|to sleep|A1|s|schläfst,schläft|schlief|geschlafen|h|7a
fangen|ловить|to catch|B1|s|fängst,fängt|fing|gefangen|h|7b
hängen|висеть|to hang (be hanging)|A2|s||hing|gehangen|h|7b
hauen|бить, ударять|to hit|B1|s||haute/hieb|gehauen|h|7c
heißen|называться|to be called|A1|s||hieß|geheißen|h|7c
laufen|бежать; идти пешком|to run; to walk|A1|s|läufst,läuft|lief|gelaufen|s|7c
rufen|кричать, звать|to call|A2|s||rief|gerufen|h|7c
stoßen|толкать|to push, bump|B1|s|stößt,stößt|stieß|gestoßen|hs|7c
gehen|идти|to go|A1|s||ging|gegangen|s|irr
kommen|приходить|to come|A1|s||kam|gekommen|s|irr
stehen|стоять|to stand|A1|s||stand|gestanden|h|irr
tun|делать|to do|A2|s|f:tue,tust,tut,tun,tut,tun|tat|getan|h|irr
sein|быть|to be|A1|aux|f:bin,bist,ist,sind,seid,sind|war|gewesen|s|aux
haben|иметь|to have|A1|aux|f:habe,hast,hat,haben,habt,haben|hatte|gehabt|h|aux
werden|становиться|to become|A2|aux|f:werde,wirst,wird,werden,werdet,werden|wurde|geworden|s|aux
brennen|гореть|to burn|B1|m||brannte|gebrannt|h|mixed
bringen|приносить|to bring|A1|m||brachte|gebracht|h|mixed
denken|думать|to think|A2|m||dachte|gedacht|h|mixed
kennen|знать (быть знакомым)|to know (be familiar with)|A1|m||kannte|gekannt|h|mixed
nennen|называть|to name|A2|m||nannte|genannt|h|mixed
rennen|мчаться, бегать|to run, race|A2|m||rannte|gerannt|s|mixed
senden|посылать|to send|A2|m||sandte/sendete|gesandt/gesendet|h|mixed
wenden|поворачивать|to turn|B1|m||wandte/wendete|gewandt/gewendet|h|mixed
wissen|знать (факт)|to know (a fact)|A1|m|f:weiß,weißt,weiß,wissen,wisst,wissen|wusste|gewusst|h|mixed
können|мочь, уметь|can, to be able to|A1|mod|f:kann,kannst,kann,können,könnt,können|konnte|gekonnt|h|modal
dürfen|мочь (разрешено)|may, to be allowed to|A1|mod|f:darf,darfst,darf,dürfen,dürft,dürfen|durfte|gedurft|h|modal
sollen|быть должным (по чужой воле)|should, to be supposed to|A1|mod|f:soll,sollst,soll,sollen,sollt,sollen|sollte|gesollt|h|modal
müssen|быть должным, надо|must, to have to|A1|mod|f:muss,musst,muss,müssen,müsst,müssen|musste|gemusst|h|modal
wollen|хотеть|to want|A1|mod|f:will,willst,will,wollen,wollt,wollen|wollte|gewollt|h|modal
mögen|любить, нравиться|to like|A1|mod|f:mag,magst,mag,mögen,mögt,mögen|mochte|gemocht|h|modal
`;

// Verbs outside the table: prefixed strong verbs, weak verbs, reflexive verbs.
const EXTRA = `
möchten|хотеть (вежливо), хотелось бы|would like|A1|mod|f:möchte,möchtest,möchte,möchten,möchtet,möchten|wollte|gewollt|h|
an~rufen|звонить (по телефону)|to call (phone)|A1|s||rief|angerufen|h|
auf~stehen|вставать|to get up|A1|s||stand|aufgestanden|s|
an~kommen|прибывать|to arrive|A1|s||kam|angekommen|s|
mit~kommen|идти вместе|to come along|A1|s||kam|mitgekommen|s|
zurück~kommen|возвращаться|to come back|A2|s||kam|zurückgekommen|s|
ab~fahren|отправляться, уезжать|to depart|A1|s|fährst,fährt|fuhr|abgefahren|s|
weg~fahren|уезжать|to go away|A2|s|fährst,fährt|fuhr|weggefahren|s|
ein~laden|приглашать|to invite|A1|s|lädst,lädt|lud|eingeladen|h|
fern~sehen|смотреть телевизор|to watch TV|A1|s|siehst,sieht|sah|ferngesehen|h|
aus~sehen|выглядеть|to look (appear)|A1|s|siehst,sieht|sah|ausgesehen|h|
an~fangen|начинать|to start|A1|s|fängst,fängt|fing|angefangen|h|
ein~schlafen|засыпать|to fall asleep|A2|s|schläfst,schläft|schlief|eingeschlafen|s|
mit~bringen|приносить с собой|to bring along|A1|m||brachte|mitgebracht|h|
um~ziehen|переезжать|to move (house)|A2|s||zog|umgezogen|s|
sich an~ziehen|одеваться|to get dressed|A1|s||zog|angezogen|h|
sich um~ziehen|переодеваться|to change clothes|A2|s||zog|umgezogen|h|
aus~gehen|выходить (развлекаться)|to go out|A2|s||ging|ausgegangen|s|
spazieren ~gehen|гулять|to go for a walk|A1|s||ging|spazieren gegangen|s|
ein~steigen|садиться (в транспорт)|to get on|A1|s||stieg|eingestiegen|s|
aus~steigen|выходить (из транспорта)|to get off|A1|s||stieg|ausgestiegen|s|
um~steigen|делать пересадку|to change (trains)|A1|s||stieg|umgestiegen|s|
teil~nehmen|участвовать|to take part|A2|s|nimmst,nimmt|nahm|teilgenommen|h|
ab~nehmen|худеть; снимать|to lose weight; to take off|A2|s|nimmst,nimmt|nahm|abgenommen|h|
mit~nehmen|брать с собой|to take along|A1|s|nimmst,nimmt|nahm|mitgenommen|h|
statt~finden|состояться|to take place|A2|s||fand|stattgefunden|h|
an~bieten|предлагать|to offer|A2|s||bot|angeboten|h|
ab~schreiben|списывать|to copy (write off)|A2|s||schrieb|abgeschrieben|h|
auf~schreiben|записывать|to write down|A1|s||schrieb|aufgeschrieben|h|
vor~lesen|читать вслух|to read aloud|A2|s|liest,liest|las|vorgelesen|h|
aus~geben|тратить (деньги)|to spend (money)|A2|s|gibst,gibt|gab|ausgegeben|h|
bekommen|получать|to get, receive|A1|s||bekam|bekommen|h|
verstehen|понимать|to understand|A1|s||verstand|verstanden|h|
beschreiben|описывать|to describe|A2|s||beschrieb|beschrieben|h|
unterschreiben|подписывать|to sign|A2|s||unterschrieb|unterschrieben|h|
empfehlen|рекомендовать|to recommend|A2|s|empfiehlst,empfiehlt|empfahl|empfohlen|h|
verbringen|проводить (время)|to spend (time)|A2|m||verbrachte|verbracht|h|
sich unterhalten|беседовать|to talk, chat|A2|s|unterhältst,unterhält|unterhielt|unterhalten|h|
sich treffen|встречаться|to meet up|A1|s|triffst,trifft|traf|getroffen|h|
sich entscheiden|решать(ся)|to decide|B1|s||entschied|entschieden|h|
sich bewerben|подавать заявку|to apply|A2|s|bewirbst,bewirbt|bewarb|beworben|h|
sich waschen|умываться|to wash (oneself)|A2|s|wäschst,wäscht|wusch|gewaschen|h|
bestehen|сдать (экзамен); состоять|to pass (an exam)|A2|s||bestand|bestanden|h|
ab~biegen|поворачивать|to turn (left/right)|A2|s||bog|abgebogen|s|
sich verlaufen|заблудиться|to get lost|A2|s|verläufst,verläuft|verlief|verlaufen|h|
an~probieren|примерять|to try on|A1|w||||h|
um~tauschen|обменять (товар)|to exchange|A2|w||||h|
machen|делать|to do, make|A1|w||||h|
kochen|готовить, варить|to cook|A1|w||||h|
kaufen|покупать|to buy|A1|w||||h|
spielen|играть|to play|A1|w||||h|
lernen|учить, учиться|to learn|A1|w||||h|
wohnen|жить (проживать)|to live (reside)|A1|w||||h|
arbeiten|работать|to work|A1|w||||h|
hören|слушать, слышать|to hear, listen|A1|w||||h|
fragen|спрашивать|to ask|A1|w||||h|
sagen|говорить, сказать|to say|A1|w||||h|
brauchen|нуждаться|to need|A1|w||||h|
suchen|искать|to look for|A1|w||||h|
zeigen|показывать|to show|A1|w||||h|
zahlen|платить|to pay|A1|w||||h|
bezahlen|оплачивать|to pay (for)|A1|w||||h|
besuchen|посещать|to visit|A1|w||||h|
erzählen|рассказывать|to tell|A1|w||||h|
bestellen|заказывать|to order|A1|w||||h|
lieben|любить|to love|A1|w||||h|
leben|жить|to live|A1|w||||h|
malen|рисовать|to paint|A1|w||||h|
putzen|убирать, чистить|to clean|A1|w||||h|
tanzen|танцевать|to dance|A1|w||||h|
reisen|путешествовать|to travel|A1|w||||s|
wandern|ходить в походы|to hike|A1|w||||s|
joggen|бегать трусцой|to jog|A1|w||||hs|
schmecken|быть на вкус|to taste|A1|w||||h|
kosten|стоить|to cost|A1|w||||h|
warten|ждать|to wait|A1|w||||h|
öffnen|открывать|to open|A1|w||||h|
duschen|принимать душ|to shower|A1|w||||h|
frühstücken|завтракать|to have breakfast|A1|w||||h|
telefonieren|говорить по телефону|to talk on the phone|A1|w||||h|
studieren|учиться (в вузе)|to study (at university)|A1|w||||h|
fotografieren|фотографировать|to take photos|A1|w||||h|
reparieren|ремонтировать|to repair|A2|w||||h|
probieren|пробовать|to try, taste|A1|w||||h|
packen|паковать|to pack|A1|w||||h|
feiern|праздновать|to celebrate|A1|w||||h|
lachen|смеяться|to laugh|A1|w||||h|
glauben|верить, полагать|to believe|A1|w||||h|
holen|приносить, забирать|to fetch|A1|w||||h|
ab~holen|забирать (кого-то)|to pick up|A1|w||||h|
auf~räumen|убирать (наводить порядок)|to tidy up|A1|w||||h|
ein~kaufen|делать покупки|to go shopping|A1|w||||h|
auf~machen|открывать|to open|A1|w||||h|
zu~machen|закрывать|to close|A1|w||||h|
auf~wachen|просыпаться|to wake up|A2|w||||s|
mit~machen|участвовать|to join in|A1|w||||h|
vor~bereiten|готовить (подготавливать)|to prepare|A2|w|||vorbereitet|h|
zu~hören|слушать|to listen|A1|w||||h|
aus~füllen|заполнять|to fill in|A1|w||||h|
auf~hören|прекращать|to stop|A2|w||||h|
kennen~lernen|знакомиться|to get to know|A1|w||||h|
Staub ~saugen|пылесосить|to vacuum|A2|w||||h|
an~machen|включать|to switch on|A1|w||||h|
aus~machen|выключать|to switch off|A1|w||||h|
üben|упражняться|to practise|A1|w||||h|
surfen|сёрфить; сидеть в интернете|to surf|A1|w||||h|
schicken|посылать|to send|A1|w||||h|
antworten|отвечать|to answer|A1|w||||h|
heiraten|жениться, выходить замуж|to marry|A1|w||||h|
sammeln|собирать|to collect|A2|w||||h|
klettern|лазать|to climb|A2|w||||s|
parken|парковаться|to park|A1|w||||h|
mieten|снимать (жильё)|to rent|A2|w||||h|
stellen|ставить|to put (upright)|A2|w||||h|
legen|класть|to lay, put|A2|w||||h|
setzen|сажать; ставить|to set, put|A2|w||||h|
danken|благодарить|to thank|A1|w||||h|
gehören|принадлежать|to belong|A1|w||||h|
passen|подходить|to fit, suit|A1|w||||h|
dauern|длиться|to last|A1|w||||h|
wünschen|желать|to wish|A1|w||||h|
gratulieren|поздравлять|to congratulate|A2|w||||h|
buchen|бронировать|to book|A1|w||||h|
übernachten|ночевать|to stay overnight|A2|w||||h|
planen|планировать|to plan|A1|w||||h|
decken|накрывать (на стол)|to set (the table)|A2|w||||h|
spülen|мыть посуду|to do the dishes|A2|w||||h|
bügeln|гладить|to iron|A2|w||||h|
erklären|объяснять|to explain|A1|w||||h|
verdienen|зарабатывать|to earn|A2|w||||h|
versuchen|пытаться|to try|A2|w||||h|
besichtigen|осматривать|to visit (sights)|A2|w||||h|
diskutieren|обсуждать|to discuss|A2|w||||h|
korrigieren|исправлять|to correct|A2|w||||h|
wiederholen|повторять|to repeat|A1|w||||h|
übersetzen|переводить|to translate|A2|w||||h|
drucken|печатать|to print|A2|w||||h|
husten|кашлять|to cough|A2|w||||h|
trainieren|тренироваться|to train|A2|w||||h|
grillen|жарить на гриле|to barbecue|A2|w||||h|
zelten|жить в палатке|to camp|A2|w||||h|
regnen|идёт дождь|to rain|A1|w||||h|
landen|приземляться|to land|A2|w||||s|
schenken|дарить|to give (a gift)|A1|w||||h|
benutzen|использовать|to use|A2|w||||h|
reden|говорить, разговаривать|to talk|A2|w||||h|
träumen|мечтать, видеть сны|to dream|A2|w||||h|
achten|обращать внимание|to pay attention|A2|w||||h|
chatten|переписываться в чате|to chat (online)|A1|w||||h|
mailen|писать e-mail|to email|A2|w||||h|
sich freuen|радоваться|to be glad, look forward|A2|w||||h|
sich interessieren|интересоваться|to be interested|A2|w||||h|
sich ärgern|злиться|to be annoyed|A2|w||||h|
sich erinnern|вспоминать, помнить|to remember|A2|w||||h|
sich kümmern|заботиться|to take care|A2|w||||h|
sich beeilen|торопиться|to hurry|A2|w||||h|
sich fühlen|чувствовать себя|to feel|A2|w||||h|
sich setzen|садиться|to sit down|A2|w||||h|
sich an~melden|записываться|to register|A2|w||||h|
sich entspannen|расслабляться|to relax|A2|w||||h|
sich verabreden|договариваться о встрече|to make a date|A2|w||||h|
sich beschweren|жаловаться|to complain|A2|w||||h|
sich entschuldigen|извиняться|to apologise|A2|w||||h|
sich konzentrieren|сосредотачиваться|to concentrate|A2|w||||h|
sich gewöhnen|привыкать|to get used to|A2|w||||h|
sich verlieben|влюбляться|to fall in love|A2|w||||h|
sich langweilen|скучать|to be bored|A2|w||||h|
sich vor~stellen|представляться|to introduce oneself|A2|w||||h|
sich aus~ruhen|отдыхать|to rest|A2|w||||h|
sich erkälten|простужаться|to catch a cold|A2|w||||h|
sich bedanken|благодарить|to thank|A2|w||||h|
sich beschäftigen|заниматься (чем-то)|to deal with|B1|w||||h|
sich vor~bereiten|готовиться|to prepare oneself|A2|w|||vorbereitet|h|
sich hin~legen|прилечь|to lie down|A2|w||||h|
`;

function parseAux(code: string): Aux[] {
  switch (code) {
    case 's': return ['sein'];
    case 'hs': return ['haben', 'sein'];
    case 'sh': return ['sein', 'haben'];
    default: return ['haben'];
  }
}

const KIND: Record<string, VerbKind> = { w: 'weak', s: 'strong', m: 'mixed', mod: 'modal', aux: 'aux' };

function parse(rows: string): Verb[] {
  return rows
    .trim()
    .split('\n')
    .map((line) => {
      const [rawInf, ru, en, level, kind, pres, praet, pp, aux, cls] = line.split('|');
      let inf = rawInf;
      const refl = inf.startsWith('sich ');
      if (refl) inf = inf.slice(5);
      let sep: string | undefined;
      let base = inf;
      if (inf.includes('~')) {
        [sep, base] = inf.split('~');
        inf = sep + base;
      }
      const verb: Verb = {
        inf,
        sep,
        base,
        refl,
        ru,
        en,
        level: level as Level,
        kind: KIND[kind],
        praet: praet ? praet.split('/') : [weakPraeteritum(base)],
        pp: pp ? pp.split('/') : [weakPartizip(base, sep)],
        aux: parseAux(aux),
        cls: cls || undefined,
      };
      if (pres.startsWith('f:')) verb.presFull = pres.slice(2).split(',');
      else if (pres) verb.presDuEr = pres.split(',') as [string, string];
      return verb;
    });
}

export const TABLE_VERBS: Verb[] = parse(TABLE);
export const VERBS: Verb[] = [...TABLE_VERBS, ...parse(EXTRA)];

/** Key = infinitive, with "sich " prefix for reflexive verbs (so "waschen" and "sich waschen" differ). */
export function verbKey(v: Verb): string {
  return (v.refl ? 'sich ' : '') + v.inf;
}

const BY_KEY = new Map(VERBS.map((v) => [verbKey(v), v]));

export function getVerb(key: string): Verb {
  const v = BY_KEY.get(key);
  if (!v) throw new Error(`Unknown verb: ${key}`);
  return v;
}

export function hasVerb(key: string): boolean {
  return BY_KEY.has(key);
}

export const CLASS_LABELS: Record<string, string> = {
  '1a': 'ei – ie – ie',
  '1b': 'ei – i – i',
  '2': 'ie – o – o',
  '3a': 'i – a – u',
  '3b': 'i – a – o',
  '4': 'e – a – o',
  '5': 'e/i – a – e',
  '6': 'a – u – a',
  '6b': '… – o – o',
  '7a': 'a – ie – a',
  '7b': 'a – i – a',
  '7c': 'au/ei/o/u – ie – …',
  irr: 'неправильные',
  aux: 'вспомогательные',
  mixed: 'смешанные',
  modal: 'модальные',
};
