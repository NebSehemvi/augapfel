/*
 * Frequent words that are not in the verb/noun database: articles, pronouns, prepositions,
 * conjunctions, adverbs, numbers, adjectives. Format: forms|lemma|pos|ru|en
 * (forms separated by commas; the first form is shown when it differs from the lemma).
 */
const WORDS = `
der,die,das,den,dem,des|der / die / das|art|определённый артикль|the
ein,eine,einen,einem,einer,eines|ein / eine|art|неопределённый артикль|a, an
kein,keine,keinen,keinem,keiner,keines|kein|art|никакой, не|no, not a
ich|ich|pron|я|I
mich|mich|pron|меня|me
mir|mir|pron|мне|(to) me
du|du|pron|ты|you
dich|dich|pron|тебя|you
dir|dir|pron|тебе|(to) you
er|er|pron|он|he, it
ihn|ihn|pron|его|him, it
ihm|ihm|pron|ему|(to) him
sie|sie|pron|она; они|she; they
es|es|pron|оно; это|it
wir|wir|pron|мы|we
uns|uns|pron|нас; нам|us
ihr|ihr|pron|вы; её; их|you (pl.); her; their
euch|euch|pron|вас; вам|you (pl.)
ihnen|ihnen|pron|им|(to) them
sich|sich|pron|себя, -ся|oneself
man|man|pron|(безличное) люди, «-ют»|one, people
mein,meine,meinen,meinem,meiner,meines|mein|pron|мой|my
dein,deine,deinen,deinem,deiner,deines|dein|pron|твой|your
sein,seine,seinen,seinem,seiner,seines|sein|pron|его (притяж.)|his, its
ihre,ihren,ihrem,ihrer,ihres|ihr|pron|её; их (притяж.)|her; their
unser,unsere,unseren,unserem,unserer|unser|pron|наш|our
euer,eure,euren,eurem,eurer|euer|pron|ваш|your (pl.)
dieser,diese,dieses,diesen,diesem|dieser|pron|этот|this
jeder,jede,jedes,jeden,jedem|jeder|pron|каждый|every
alle,allen,aller|alle|pron|все|all
viele,vielen|viele|pron|многие|many
manche,manchen|manche|pron|некоторые|some
andere,anderen,anderer,anderes|andere|adj|другой|other
etwas|etwas|pron|что-то; немного|something; a little
nichts|nichts|pron|ничего|nothing
alles|alles|pron|всё|everything
wer|wer|pron|кто|who
was|was|pron|что|what
wen|wen|pron|кого|whom
wem|wem|pron|кому|(to) whom
wo|wo|adv|где|where
woher|woher|adv|откуда|where from
wohin|wohin|adv|куда|where to
wann|wann|adv|когда|when
wie|wie|adv|как|how; like
warum|warum|adv|почему|why
welche,welcher,welches,welchen,welchem|welcher|pron|какой, который|which
und|und|conj|и|and
oder|oder|conj|или|or
aber|aber|conj|но|but
denn|denn|conj|потому что|because
sondern|sondern|conj|а (но)|but (rather)
weil|weil|conj|потому что (глагол в конце)|because
dass|dass|conj|что (союз)|that
wenn|wenn|conj|если; когда|if; when
als|als|conj|когда (в прошлом); чем; как|when; than; as
ob|ob|conj|ли|whether
obwohl|obwohl|conj|хотя|although
damit|damit|conj|чтобы; с этим|so that; with it
deshalb|deshalb|adv|поэтому|therefore
trotzdem|trotzdem|adv|всё равно, тем не менее|nevertheless
dann|dann|adv|потом, тогда|then
danach|danach|adv|после этого|after that
zuerst|zuerst|adv|сначала|first
später|später|adv|позже|later
in|in|prep|в|in, into
im|im (in dem)|prep|в (Dat.)|in the
ins|ins (in das)|prep|в (Akk.)|into the
an|an|prep|у, на, к|at, on, to
am|am (an dem)|prep|у, на; в (дни)|at the, on the
ans|ans (an das)|prep|к, на|to the
auf|auf|prep|на|on, onto
aus|aus|prep|из|from, out of
bei|bei|prep|у, при|at, near, with
beim|beim (bei dem)|prep|у, при|at the
mit|mit|prep|с|with
nach|nach|prep|после; в (страну, город)|after; to
seit|seit|prep|с (какого-то времени)|since, for
von|von|prep|от, из; о|from, of
vom|vom (von dem)|prep|от, с|from the
zu|zu|prep|к; слишком|to; too
zum|zum (zu dem)|prep|к|to the
zur|zur (zu der)|prep|к|to the
für|für|prep|для, за|for
ohne|ohne|prep|без|without
durch|durch|prep|через, сквозь|through
gegen|gegen|prep|против; около|against; around
um|um|prep|в (время); вокруг|at (time); around
über|über|prep|над; о; через|over, about
unter|unter|prep|под; среди|under; among
vor|vor|prep|перед; назад|in front of; ago
hinter|hinter|prep|за, позади|behind
neben|neben|prep|рядом с|next to
zwischen|zwischen|prep|между|between
bis|bis|prep|до|until
pro|pro|prep|в, за (каждый)|per
während|während|prep|во время|during
nicht|nicht|adv|не|not
nein|nein|adv|нет|no
ja|ja|adv|да|yes
auch|auch|adv|тоже|also, too
sehr|sehr|adv|очень|very
schon|schon|adv|уже|already
noch|noch|adv|ещё|still, yet
nur|nur|adv|только|only
immer|immer|adv|всегда|always
oft|oft|adv|часто|often
manchmal|manchmal|adv|иногда|sometimes
nie|nie|adv|никогда|never
heute|heute|adv|сегодня|today
morgen|morgen|adv|завтра|tomorrow
gestern|gestern|adv|вчера|yesterday
jetzt|jetzt|adv|сейчас|now
hier|hier|adv|здесь|here
dort|dort|adv|там|there
da|da|adv|там; тут|there; here
so|so|adv|так|so, like this
sogar|sogar|adv|даже|even
fast|fast|adv|почти|almost
gern,gerne|gern|adv|охотно, с удовольствием|gladly
lieber|lieber|adv|охотнее, лучше|rather
mehr|mehr|adv|больше|more
meistens|meistens|adv|чаще всего|mostly
zusammen|zusammen|adv|вместе|together
wieder|wieder|adv|снова|again
genug|genug|adv|достаточно|enough
ungefähr|ungefähr|adv|примерно|about, approx.
besonders|besonders|adv|особенно|especially
draußen|draußen|adv|снаружи, на улице|outside
drinnen|drinnen|adv|внутри|inside
überall|überall|adv|везде|everywhere
früher|früher|adv|раньше|earlier, in the past
heute|heute|adv|сегодня|today
natürlich|natürlich|adv|конечно; естественный|of course; natural
vielleicht|vielleicht|adv|может быть|maybe
leider|leider|adv|к сожалению|unfortunately
endlich|endlich|adv|наконец|finally
plötzlich|plötzlich|adv|вдруг|suddenly
abends|abends|adv|по вечерам|in the evening
morgens|morgens|adv|по утрам|in the morning
mittags|mittags|adv|в обед|at noon
nachts|nachts|adv|ночью|at night
weg|weg|adv|прочь, нет на месте|away
zurück|zurück|adv|назад|back
geradeaus|geradeaus|adv|прямо|straight ahead
links|links|adv|слева, налево|left
rechts|rechts|adv|справа, направо|right
oben|oben|adv|наверху|above
unten|unten|adv|внизу|below
eins,ein|eins|num|один|one
zwei|zwei|num|два|two
drei|drei|num|три|three
vier|vier|num|четыре|four
fünf|fünf|num|пять|five
sechs|sechs|num|шесть|six
sieben|sieben|num|семь|seven
acht|acht|num|восемь|eight
neun|neun|num|девять|nine
zehn|zehn|num|десять|ten
elf|elf|num|одиннадцать|eleven
zwölf|zwölf|num|двенадцать|twelve
zwanzig|zwanzig|num|двадцать|twenty
hundert|hundert|num|сто|hundred
tausend|tausend|num|тысяча|thousand
millionen,million|Million|num|миллион|million
erste,ersten,erster,erstes|erste|num|первый|first
zweite,zweiten|zweite|num|второй|second
halb,halbe,halben|halb|adj|половина, пол-|half
uhr|die Uhr|noun|часы; (время) … часов|clock; o'clock
Essen|das Essen|noun|еда|food
Leben|das Leben|noun|жизнь|life
Fernsehen|das Fernsehen|noun|телевидение|television
Ruhe|die Ruhe|noun|покой, тишина|peace, quiet
Regel,Regeln|die Regel|noun|правило|rule
Ware,Waren|die Ware|noun|товар|goods
Schiene,Schienen|die Schiene|noun|рельс|rail
Stimme,Stimmen|die Stimme|noun|голос|voice
Mensch,Menschen|der Mensch|noun|человек; мн.: люди|person; people
Leute|die Leute (мн.)|noun|люди|people
Jahr,Jahre,Jahren,Jahres|das Jahr|noun|год|year
Monat,Monate,Monaten|der Monat|noun|месяц|month
Stunde,Stunden|die Stunde|noun|час; урок|hour; lesson
Minute,Minuten|die Minute|noun|минута|minute
Zeit|die Zeit|noun|время|time
Nacht,Nächte|die Nacht|noun|ночь|night
Welt|die Welt|noun|мир|world
Erde|die Erde|noun|земля, Земля|earth, ground
Luft|die Luft|noun|воздух|air
Land,Länder,Ländern|das Land|noun|страна; сельская местность|country; countryside
Ort,Orte,Orten|der Ort|noun|место; населённый пункт|place
Raum,Räume|der Raum|noun|помещение, комната|room, space
Platz,Plätze|der Platz|noun|место; площадь|place, space; square
Ding,Dinge,Dingen|das Ding|noun|вещь|thing
Sache,Sachen|die Sache|noun|вещь, дело|thing
Beispiel|das Beispiel|noun|пример|example
Wort,Wörter|das Wort|noun|слово|word
Name,Namen|der Name|noun|имя, название|name
Idee|die Idee|noun|идея|idea
Ende|das Ende|noun|конец|end
Arbeit|die Arbeit|noun|работа|work
Beruf,Berufe|der Beruf|noun|профессия|profession
Freizeit|die Freizeit|noun|свободное время|free time
Glück|das Glück|noun|счастье; удача|luck, happiness
Unglück|das Unglück|noun|несчастье, неудача|bad luck
Körper|der Körper|noun|тело|body
Kopf|der Kopf|noun|голова|head
Herz|das Herz|noun|сердце|heart
Musik|die Musik|noun|музыка|music
Sport|der Sport|noun|спорт|sport
Theater|das Theater|noun|театр|theatre
Internet|das Internet|noun|интернет|internet
Gebäude|das Gebäude|noun|здание|building
Kleidung|die Kleidung|noun|одежда|clothes
Möbel|die Möbel (мн.)|noun|мебель|furniture
Eltern|die Eltern (мн.)|noun|родители|parents
Großeltern|die Großeltern (мн.)|noun|бабушка и дедушка|grandparents
Geschwister|die Geschwister (мн.)|noun|братья и сёстры|siblings
Erwachsene,Erwachsener,Erwachsenen|der/die Erwachsene|noun|взрослый|adult
Holz|das Holz|noun|дерево (материал)|wood
Stein,Steine,Steinen|der Stein|noun|камень|stone
Metall|das Metall|noun|металл|metal
Licht,Lichter,Lichtern|das Licht|noun|свет|light
Feuer|das Feuer|noun|огонь, пожар|fire
Strom|der Strom|noun|электричество|electricity
Pferd,Pferde|das Pferd|noun|лошадь|horse
Obst|das Obst|noun|фрукты|fruit
Gemüse|das Gemüse|noun|овощи|vegetables
Lebensmittel|das Lebensmittel|noun|продукт питания|food(stuff)
Getränk,Getränke|das Getränk|noun|напиток|drink
Art,Arten|die Art|noun|вид, способ|kind, way
Medizin|die Medizin|noun|медицина|medicine
Deutschland|Deutschland|noun|Германия|Germany
Österreich|Österreich|noun|Австрия|Austria
Schweiz|die Schweiz|noun|Швейцария|Switzerland
Europa|Europa|noun|Европа|Europe
Amerika|Amerika|noun|Америка|America
Berlin|Berlin|noun|Берлин|Berlin
Wien|Wien|noun|Вена|Vienna
Euro|der Euro|noun|евро|euro
Bundesland|das Bundesland|noun|федеральная земля|federal state
Französischen,Französisch|das Französische|noun|французский язык|French
Englischen,Englisch|das Englische|noun|английский язык|English
Lateinischen,Latein|das Lateinische|noun|латынь|Latin
Montag|der Montag|noun|понедельник|Monday
Dienstag|der Dienstag|noun|вторник|Tuesday
Mittwoch|der Mittwoch|noun|среда|Wednesday
Donnerstag|der Donnerstag|noun|четверг|Thursday
Freitag|der Freitag|noun|пятница|Friday
Samstag|der Samstag|noun|суббота|Saturday
Sonntag|der Sonntag|noun|воскресенье|Sunday
Wochenende|das Wochenende|noun|выходные|weekend
Januar|der Januar|noun|январь|January
Februar|der Februar|noun|февраль|February
März|der März|noun|март|March
April|der April|noun|апрель|April
Mai|der Mai|noun|май|May
Juni|der Juni|noun|июнь|June
Juli|der Juli|noun|июль|July
August|der August|noun|август|August
September|der September|noun|сентябрь|September
Oktober|der Oktober|noun|октябрь|October
November|der November|noun|ноябрь|November
Dezember|der Dezember|noun|декабрь|December
allem|vor allem|adv|прежде всего (vor allem)|above all
hause|zu Hause / nach Hause|adv|дома / домой|at home / home
beispiel|zum Beispiel|adv|например|for example
meisten,meiste|am meisten / die meisten|adj|больше всего; большинство|most
besser,bessere,besseren|besser (← gut)|adj|лучше|better
beste,besten,bester|am besten / der beste (← gut)|adj|лучший|best
größere,größer,größeren|größer (← groß)|adj|больше|bigger
größte,größten,größter|der größte (← groß)|adj|самый большой|biggest
länger|länger (← lang)|adj|дольше, длиннее|longer
wärmer|wärmer (← warm)|adj|теплее|warmer
kälter|kälter (← kalt)|adj|холоднее|colder
härter|härter (← hart)|adj|твёрже|harder
schlechteste|der schlechteste (← schlecht)|adj|худший|worst
teuersten|am teuersten (← teuer)|adj|дороже всего|most expensive
beliebtesten|der beliebteste (← beliebt)|adj|самый популярный|most popular
selbst|selbst|adv|сам; даже|oneself; even
dafür|dafür|adv|для этого; за это|for it
davon|davon|adv|от этого; на это|of it, from it
dazu|dazu|adv|к этому|in addition, to it
darum|darum|adv|поэтому|therefore
dabei|dabei|adv|при этом|in doing so
davor|davor|adv|до этого|before that
dazwischen|dazwischen|adv|между этим|in between
dagegen|dagegen|adv|напротив, зато|on the other hand
anders|anders|adv|иначе, по-другому|differently
einmal|einmal|adv|один раз|once
zweimal|zweimal|adv|два раза|twice
etwa|etwa|adv|примерно|about
erst|erst|adv|только (лишь); сначала|only; first
mehrere|mehrere|pron|несколько|several
einige,einigen,einiger|einige|pron|некоторые, несколько|some
niemand|niemand|pron|никто|nobody
bisschen|ein bisschen|adv|немного|a bit
je|je|adv|по (каждый)|each
ab|ab|prep|с (времени); (приставка: abfahren…)|from; (prefix)
los|los|adv|(приставка: losfahren); «что случилось?»|off; (prefix)
herum|herum|adv|вокруг|around
hinten|hinten|adv|сзади|at the back
vorne|vorne|adv|впереди|at the front
daneben|daneben|adv|рядом|next to it
sofort|sofort|adv|сразу|immediately
selten|selten|adv|редко|rarely
ursprünglich|ursprünglich|adv|изначально|originally
gerade|gerade|adv|сейчас, только что; прямой|just now; straight
spazieren|spazieren gehen|verb|гулять|to go for a walk
extra|extra|adv|отдельно, дополнительно|extra
inklusive|inklusive|adv|включено|included
normal,normale,normalen|normal|adj|обычный, нормальный|normal
`;

/** Adjectives: base|ru|en — inflected forms (-e, -en, -er, -es, -em) are generated. */
const ADJECTIVES = `
gut|хороший|good
schlecht|плохой|bad
groß|большой|big
klein|маленький|small
alt|старый|old
neu|новый|new
jung|молодой|young
lang|длинный, долгий|long
kurz|короткий|short
schön|красивый, хороший|beautiful, nice
warm|тёплый|warm
kalt|холодный|cold
heiß|горячий, жаркий|hot
kühl|прохладный|cool
frisch|свежий|fresh
gesund|здоровый, полезный|healthy
krank|больной|ill
müde|уставший|tired
wichtig|важный|important
schnell|быстрый|fast
langsam|медленный|slow
leicht|лёгкий|easy, light
schwer|тяжёлый, трудный|heavy, difficult
einfach|простой|simple
teuer|дорогой|expensive
billig|дешёвый|cheap
voll|полный|full
leer|пустой|empty
hell|светлый|bright
dunkel|тёмный|dark
laut|громкий|loud
leise|тихий|quiet
ruhig|спокойный|calm
viel|много|much, a lot
wenig|мало|little
hoch|высокий|high
tief|глубокий|deep
weit|далёкий, широкий|far, wide
nah|близкий|near
breit|широкий|wide
schmal|узкий|narrow
rund|круглый|round
weich|мягкий|soft
hart|твёрдый|hard
süß|сладкий|sweet
sauer|кислый|sour
salzig|солёный|salty
lecker|вкусный|tasty
rot|красный|red
blau|синий|blue
grün|зелёный|green
gelb|жёлтый|yellow
weiß|белый|white
schwarz|чёрный|black
braun|коричневый|brown
grau|серый|grey
bunt|разноцветный|colourful
bekannt|известный|well-known
beliebt|популярный, любимый|popular
berühmt|знаменитый|famous
verschieden|разный|different
gleich|одинаковый; сразу|same; right away
richtig|правильный|right, correct
falsch|неправильный|wrong
möglich|возможный|possible
nötig|нужный|necessary
typisch|типичный|typical
modern|современный|modern
eigen|собственный|own
ganz|целый; совсем|whole; quite
letzt|последний|last
nächst|следующий|next
spät|поздний|late
früh|ранний|early
klar|ясный|clear
sicher|безопасный; уверенный|safe; sure
gefährlich|опасный|dangerous
stark|сильный|strong
schwach|слабый|weak
froh|радостный|glad
glücklich|счастливый|happy
traurig|грустный|sad
freundlich|дружелюбный|friendly
nett|милый, приятный|nice
lustig|весёлый, смешной|funny
interessant|интересный|interesting
langweilig|скучный|boring
praktisch|практичный|practical
öffentlich|общественный|public
deutsch|немецкий|German
international|международный|international
sauber|чистый|clean
schmutzig|грязный|dirty
trocken|сухой|dry
nass|мокрый|wet
reich|богатый|rich
arm|бедный|poor
eilig|срочный («es eilig haben» — спешить)|hurried
männlich|мужской|male
weiblich|женский|female
blind|слепой|blind
spitz|острый|pointed
flach|плоский|flat
eng|узкий, тесный|narrow
giftig|ядовитый|poisonous
satt|сытый|full (not hungry)
wach|бодрый, не спящий|awake
stumm|немой|silent, mute
gemütlich|уютный|cosy
beweglich|подвижный|movable
wertvoll|ценный|valuable
freiwillig|добровольный|voluntary
besonder|особый|special
bestimmt|определённый|certain
schief|наклонный, кривой|tilted
schlimm|плохой, страшный|bad, serious
elektrisch|электрический|electric
farbig|цветной|coloured
fantastisch|фантастический|fantastic
spanisch|испанский|Spanish
italienisch|итальянский|Italian
schwarzbraun|чёрно-коричневый|dark brown
`;

export interface CommonWord {
  lemma: string;
  pos: string;
  ru: string;
  en: string;
}

export const COMMON = new Map<string, CommonWord>();

for (const line of WORDS.trim().split('\n')) {
  const [forms, lemma, pos, ru, en] = line.split('|');
  for (const f of forms.split(',')) if (!COMMON.has(f.toLowerCase())) COMMON.set(f.toLowerCase(), { lemma, pos, ru, en });
}

function adjForms(base: string): string[] {
  const stem = base.endsWith('e') ? base.slice(0, -1) : base;
  const forms = [base, stem + 'e', stem + 'en', stem + 'er', stem + 'es', stem + 'em'];
  // dunkel → dunkle, teuer → teure, hoch → hohe
  if (/el$/.test(base)) forms.push(...['e', 'en', 'er', 'es', 'em'].map((e) => base.slice(0, -2) + 'l' + e));
  if (/er$/.test(base)) forms.push(...['e', 'en', 'er', 'es', 'em'].map((e) => base.slice(0, -2) + 'r' + e));
  if (base === 'hoch') forms.push('hohe', 'hohen', 'hoher', 'hohes', 'hohem');
  return forms;
}

for (const line of ADJECTIVES.trim().split('\n')) {
  const [base, ru, en] = line.split('|');
  for (const f of adjForms(base)) if (!COMMON.has(f)) COMMON.set(f, { lemma: base, pos: 'adj', ru, en });
}
