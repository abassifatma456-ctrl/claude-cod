import {AbsoluteFill, interpolate} from 'remotion';
import {Ar, appear, De, MarkedWord, ramp, SceneFrame, useSceneFrame} from '../components/ui';
import {cue} from '../timing';
import {C, EASE, EASE_OUT} from '../theme';

const ID = 's3_allah';

type Case = 'damma' | 'fatha' | 'kasra';

const WORD: Record<Case, string> = {damma: 'اللَّهُ', fatha: 'اللَّهَ', kasra: 'اللَّهِ'};
const CHIP: Record<Case, {ar: string; de: string; role: string}> = {
  damma: {ar: 'ضَمَّةٌ', de: '_Ḍamma_ · -u', role: 'als Subjekt (_fāʿil_)'},
  fatha: {ar: 'فَتْحَةٌ', de: '_Fatḥa_ · -a', role: 'nach _inna_'},
  kasra: {ar: 'كَسْرَةٌ', de: '_Kasra_ · -i', role: 'nach der Präposition _fī_'},
};
// Context words around the fixed word اللَّه (right = before it, left = after it).
const CONTEXT: Record<Case, {before: string; after?: string; ref?: string}> = {
  damma: {before: 'يَقُولُ'},
  fatha: {before: 'إِنَّ'},
  kasra: {before: 'أَفِي', after: 'شَكٌّ', ref: 'Ibrāhīm 14:10'},
};
const ORDER: Case[] = ['damma', 'fatha', 'kasra'];

const Inner: React.FC = () => {
  const fr = useSceneFrame();
  const first = {damma: cue('s3_damma', ID), fatha: cue('s3_fatha', ID), kasra: cue('s3_kasra', ID)};
  const lafz = cue('s3_lafz', ID);
  const recap = {
    damma: cue('s3_recap_damma', ID),
    fatha: cue('s3_recap_fatha', ID),
    kasra: cue('s3_recap_kasra', ID),
  };

  // Which ending is active now (and since when)?
  const timeline: {c: Case | null; at: number}[] = [
    {c: 'damma', at: first.damma - 4},
    {c: 'fatha', at: first.fatha - 4},
    {c: 'kasra', at: first.kasra - 4},
    {c: null, at: lafz},
    {c: 'damma', at: recap.damma - 4},
    {c: 'fatha', at: recap.fatha - 4},
    {c: 'kasra', at: recap.kasra - 4},
  ];
  let idx = -1;
  timeline.forEach((t, i) => {
    if (fr >= t.at) idx = i;
  });
  const active = idx >= 0 ? timeline[idx].c : null;
  const activeAt = idx >= 0 ? timeline[idx].at : 0;
  const prev = idx > 0 ? timeline[idx - 1].c : null;
  const inP = ramp(fr, activeAt, 12, EASE_OUT);

  // The Ḥaraka "falls" into place: Ḍamma/Fatḥa from above, Kasra from below.
  const marks = ORDER.map((c) => {
    const dir = c === 'kasra' ? 1 : -1;
    if (c === active) return {text: WORD[c], opacity: inP, dy: dir * 40 * (1 - inP)};
    if (c === prev && c !== active) return {text: WORD[c], opacity: 1 - inP, dy: -dir * 20 * inP};
    return {text: WORD[c], opacity: 0, dy: 0};
  });

  // Context phrase: visible during the three spoken examples, gone for the recap.
  const ctxCase: Case | null = fr < lafz ? (active ?? null) : null;
  const ctxOpacity = fr < lafz ? inP : 1 - ramp(fr, lafz, 12);
  const ctx = ctxCase ? CONTEXT[ctxCase] : prev ? CONTEXT[prev] : null;
  const lafzP = ramp(fr, lafz, 20, EASE);

  return (
    <AbsoluteFill style={{alignItems: 'center', justifyContent: 'center', paddingBottom: 300}}>
      {/* label for the recap */}
      <div style={{height: 150, opacity: lafzP, textAlign: 'center'}}>
        <Ar size={72} color={C.gold} style={{display: 'block', lineHeight: 1.5}}>
          لَفْظُ الْجَلَالَةِ
        </Ar>
        <De size={34} color={C.sand}>{'_Lafẓ al-jalāla_ · der Name Allahs'}</De>
      </div>

      {/* fixed centre word with context around it */}
      <div style={{display: 'flex', width: 1080, alignItems: 'center', ...appear(fr, -6, 16, 0)}}>
        <div style={{flex: 1, display: 'flex', justifyContent: 'flex-end', paddingRight: 34, opacity: ctx?.after ? ctxOpacity * 0.85 : 0}}>
          <Ar size={120} color={C.ivory}>{ctx?.after ?? ''}</Ar>
        </div>
        <MarkedWord base="اللَّه" marks={marks} size={250} />
        <div style={{flex: 1, display: 'flex', justifyContent: 'flex-start', paddingLeft: 34, opacity: ctxOpacity * 0.85}}>
          <Ar size={120} color={C.ivory}>{ctx?.before ?? ''}</Ar>
        </div>
      </div>
      <div style={{height: 50, opacity: ctx?.ref && fr < lafz ? ctxOpacity : 0, marginTop: -30}}>
        <De size={32} color={C.gold}>{ctx?.ref ?? ''}</De>
      </div>

      {/* the three endings */}
      <div dir="rtl" style={{display: 'flex', gap: 28, marginTop: 40}}>
        {ORDER.map((c) => {
          const on = c === active;
          const seen = fr >= first[c] - 4;
          const glow = on ? inP : 0;
          return (
            <div
              key={c}
              style={{
                ...appear(fr, first[c] - 4, 16, 16),
                opacity: seen ? interpolate(glow, [0, 1], [0.4, 1]) : 0,
                width: 290,
                padding: '6px 0 18px',
                border: `2px solid rgba(182,154,103,${0.25 + 0.75 * glow})`,
                borderRadius: 18,
                textAlign: 'center',
                background: `rgba(182,154,103,${0.1 * glow})`,
              }}
            >
              <Ar size={64} color={on ? C.gold : C.ivory} style={{display: 'block', lineHeight: 1.6}}>
                {CHIP[c].ar}
              </Ar>
              <De size={32} color={C.ivory}>{CHIP[c].de}</De>
              <br />
              <De size={26} color={C.sand} style={{opacity: 0.9}}>{CHIP[c].role}</De>
            </div>
          );
        })}
      </div>
    </AbsoluteFill>
  );
};

export const S3Allah: React.FC = () => (
  <SceneFrame id={ID} bg={C.green}>
    <Inner />
  </SceneFrame>
);
