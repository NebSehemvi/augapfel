/*
 * Which case (or other complement) a verb takes — its "Rektion".
 *   A  + Akkusativ           (sehen: ich sehe den Hund)
 *   D  + Dativ               (helfen: ich helfe dem Kind)
 *   DA + Dativ + Akkusativ   (geben: ich gebe dem Kind einen Apfel)
 *   N  + Nominativ           (sein: er ist ein Lehrer)
 *   I  + Infinitiv           (können: ich kann schwimmen)
 *   AI + Akkusativ / Infinitiv (möchten: einen Tee / schlafen)
 *   -  no object             (gehen, schlafen, sich freuen)
 * Only A1/A2 verbs are listed; verbs with a fixed preposition live in prepVerbs.ts.
 */
export type GovCode = 'A' | 'D' | 'DA' | 'N' | 'I' | 'AI' | '-';

export const GOV_LABEL: Record<GovCode, string> = {
  A: 'Akk.',
  D: 'Dat.',
  DA: 'Dat. + Akk.',
  N: 'Nom.',
  I: 'Inf.',
  AI: 'Akk. / Inf.',
  '-': '',
};

/** The Russian questions of a case — what the learner should "hear" when using the verb. */
export const GOV_QUESTION: Record<GovCode, string> = {
  A: 'Akkusativ — кого? что?',
  D: 'Dativ — кому? чему?',
  DA: 'Dativ (кому?) + Akkusativ (что?)',
  N: 'Nominativ — кто? что?',
  I: '+ инфинитив другого глагола',
  AI: 'Akkusativ (что?) или инфинитив',
  '-': 'без прямого дополнения',
};

/** The cases a learner picks from in "which case?" questions. */
export const CASE_CODES: GovCode[] = ['A', 'D', 'DA'];

const ROWS = `
bleiben|- leihen|DA scheinen|- schreiben|DA steigen|- treiben|A reiten|- schneiden|A bieten|DA fliegen|- frieren|-
schließen|A verlieren|A ziehen|A finden|A singen|A springen|- trinken|A beginnen|- gewinnen|A schwimmen|- helfen|D
nehmen|A sprechen|A sterben|- treffen|A essen|A geben|DA lesen|A sehen|A vergessen|A bitten|A liegen|- sitzen|-
backen|A fahren|- tragen|A waschen|A braten|A fallen|- gefallen|D halten|A lassen|A schlafen|- hängen|- heißen|N
laufen|- rufen|A gehen|- kommen|- stehen|- tun|A sein|N haben|A werden|N bringen|DA denken|- kennen|A nennen|A
rennen|- senden|DA wissen|A können|I dürfen|I sollen|I müssen|I wollen|I mögen|A möchten|AI
anrufen|A aufstehen|- ankommen|- mitkommen|- zurückkommen|- abfahren|- wegfahren|- einladen|A fernsehen|- aussehen|-
anfangen|- einschlafen|- mitbringen|DA umziehen|- sich anziehen|- sich umziehen|- ausgehen|- spazieren gehen|-
einsteigen|- aussteigen|- umsteigen|- teilnehmen|- abnehmen|- mitnehmen|A stattfinden|- anbieten|DA abschreiben|A
aufschreiben|A vorlesen|DA ausgeben|A bekommen|A verstehen|A beschreiben|A unterschreiben|A empfehlen|DA verbringen|A
sich unterhalten|- sich treffen|- sich bewerben|- sich waschen|- bestehen|A abbiegen|- sich verlaufen|- anprobieren|A
umtauschen|A bauen|A schauen|- bedeuten|A meinen|A passieren|D bewegen|A schützen|A tauschen|A untersuchen|A erkennen|A
entstehen|- fehlen|D sortieren|A speichern|A atmen|- starten|- sorgen|- scannen|A tippen|A löschen|A transportieren|A
unterrichten|A erfinden|A drehen|A stimmen|- wärmen|A kauen|A verletzen|A anbauen|A aufnehmen|A ausleihen|A
weiterlernen|- abgeben|A ansagen|A abfliegen|- losfahren|- dabeihaben|A ausfallen|- machen|A kochen|A kaufen|A
spielen|A lernen|A wohnen|- arbeiten|- hören|A fragen|A sagen|DA brauchen|A suchen|A zeigen|DA zahlen|A bezahlen|A
besuchen|A erzählen|DA bestellen|A lieben|A leben|- malen|A putzen|A tanzen|- reisen|- wandern|- joggen|- schmecken|D
kosten|A warten|- öffnen|A duschen|- frühstücken|- telefonieren|- studieren|A fotografieren|A reparieren|A probieren|A
packen|A feiern|A lachen|- glauben|DA holen|A abholen|A aufräumen|A einkaufen|- aufmachen|A zumachen|A aufwachen|-
mitmachen|- vorbereiten|A zuhören|D ausfüllen|A aufhören|- kennenlernen|A Staub saugen|- anmachen|A ausmachen|A üben|A
surfen|- schicken|DA antworten|D heiraten|A sammeln|A klettern|- parken|- mieten|A stellen|A legen|A setzen|A danken|D
gehören|D passen|D dauern|- wünschen|DA gratulieren|D buchen|A übernachten|- planen|A decken|A spülen|A bügeln|A
erklären|DA verdienen|A versuchen|A besichtigen|A diskutieren|- korrigieren|A wiederholen|A übersetzen|A drucken|A
husten|- trainieren|- grillen|A zelten|- regnen|- landen|- schenken|DA benutzen|A reden|- träumen|- achten|- chatten|-
mailen|DA sich freuen|- sich interessieren|- sich ärgern|- sich erinnern|- sich kümmern|- sich beeilen|- sich fühlen|-
sich setzen|- sich anmelden|- sich entspannen|- sich verabreden|- sich beschweren|- sich entschuldigen|- sich konzentrieren|-
sich gewöhnen|- sich verlieben|- sich langweilen|- sich vorstellen|- sich ausruhen|- sich erkälten|- sich bedanken|-
sich vorbereiten|- sich hinlegen|-
`;

/** verb key ("sich " + infinitive for reflexive verbs) → complement */
export const VERB_GOV: Map<string, GovCode> = new Map(
  ROWS.trim()
    .split(/\n/)
    .flatMap((line) => line.match(/[^|]+\|(DA|AI|A|D|N|I|-)(?=\s|$)/g) ?? [])
    .map((pair) => {
      const [verb, code] = pair.trim().split('|');
      return [verb.trim(), code as GovCode];
    }),
);
