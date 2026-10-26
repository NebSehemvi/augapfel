import type { ComponentType } from 'react';
import { PraesensRegular } from './PraesensRegular';
import { PraesensIrregular } from './PraesensIrregular';
import { SatzbauInversion } from './SatzbauInversion';
import { Negation } from './Negation';
import { Fragen } from './Fragen';
import { Trennbare } from './Trennbare';
import { Modalverben } from './Modalverben';
import { Imperativ } from './Imperativ';
import { PerfektHaben } from './PerfektHaben';
import { PerfektSein } from './PerfektSein';
import { PerfektBesonders } from './PerfektBesonders';
import { ArtikelPlural } from './ArtikelPlural';
import { Akkusativ } from './Akkusativ';
import { Dativ } from './Dativ';
import { KonnektorenA1 } from './KonnektorenA1';
import { PraeteritumBasis } from './PraeteritumBasis';
import { Futur } from './Futur';
import { VerbenPraep } from './VerbenPraep';
import { Reflexiv } from './Reflexiv';
import { Nebensaetze } from './Nebensaetze';
import { DeshalbTrotzdem } from './DeshalbTrotzdem';
import { Wechselpraep } from './Wechselpraep';
import { Vergleiche } from './Vergleiche';
import { Zahlen } from './Zahlen';
import { Uhrzeit } from './Uhrzeit';
import { Datum } from './Datum';

export const EXPLAIN: Record<string, ComponentType> = {
  'praesens-regular': PraesensRegular,
  'praesens-irregular': PraesensIrregular,
  'satzbau-inversion': SatzbauInversion,
  'fragen': Fragen,
  'negation': Negation,
  'trennbare': Trennbare,
  'modalverben': Modalverben,
  'imperativ': Imperativ,
  'perfekt-haben': PerfektHaben,
  'perfekt-sein': PerfektSein,
  'perfekt-besonders': PerfektBesonders,
  'artikel-plural': ArtikelPlural,
  'akkusativ': Akkusativ,
  'dativ': Dativ,
  'konnektoren-a1': KonnektorenA1,
  'praeteritum-basis': PraeteritumBasis,
  'futur': Futur,
  'verben-praep': VerbenPraep,
  'reflexiv': Reflexiv,
  'nebensaetze': Nebensaetze,
  'deshalb-trotzdem': DeshalbTrotzdem,
  'wechselpraep': Wechselpraep,
  'vergleiche': Vergleiche,
  'zahlen': Zahlen,
  'uhrzeit': Uhrzeit,
  'datum': Datum,
};
