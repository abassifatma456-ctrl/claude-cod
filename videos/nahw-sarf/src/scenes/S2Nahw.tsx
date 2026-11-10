import {AbsoluteFill, interpolateColors} from 'remotion';
import {Ar, appear, De, GoldRule, ramp, SceneFrame, useSceneFrame} from '../components/ui';
import {cue} from '../timing';
import {C} from '../theme';

const ID = 's2_nahw';

// قَرَأَ الطَّالِبُ الْكِتَابَ – "Der Student las das Buch".
// Only the two nouns get a highlighted ending: their final vowel depends on
// the position in the sentence (the verb ending is fixed, so it stays plain).
const WORDS: {stem: string; end: string; label?: string; mark?: string}[] = [
  {stem: 'قَرَأَ', end: ''},
  {stem: 'الطَّالِ', end: 'بُ', label: 'Subjekt', mark: '-u'},
  {stem: 'الْكِتَا', end: 'بَ', label: 'Objekt', mark: '-a'},
];

const Inner: React.FC = () => {
  const fr = useSceneFrame();
  const endCue = cue('s2_endungen', ID);
  const posCue = cue('s2_position', ID);
  const endP = ramp(fr, endCue, 20);
  const endColor = interpolateColors(endP, [0, 1], [C.ivory, C.gold]);

  return (
    <AbsoluteFill style={{alignItems: 'center', justifyContent: 'center', paddingBottom: 300}}>
      {/* header */}
      <div style={{...appear(fr, 0, 18), textAlign: 'center', marginBottom: 70}}>
        <Ar size={84} color={C.gold} style={{display: 'block', lineHeight: 1.6}}>
          عِلْمُ النَّحْوِ
        </Ar>
        <De size={36} color={C.sand} style={{letterSpacing: 3}}>
          {'_Naḥw_ · der Blick auf das Wortende'}
        </De>
      </div>

      {/* sentence, the whole sentence is visible: the "wide" view */}
      <div dir="rtl" style={{display: 'flex', gap: 44, alignItems: 'flex-start'}}>
        {WORDS.map((w, i) => (
          <div key={i} style={{...appear(fr, 6 + i * 8, 20), display: 'flex', flexDirection: 'column', alignItems: 'center'}}>
            <Ar size={128} color={C.ivory}>
              {w.stem}
              {w.end ? (
                <span style={{color: endColor, textShadow: endP > 0 ? `0 0 ${24 * endP}px rgba(182,154,103,${0.45 * endP})` : undefined}}>
                  {w.end}
                </span>
              ) : null}
            </Ar>
            {w.label ? (
              <div dir="ltr" style={{...appear(fr, posCue + (i - 1) * 8, 18, 14), textAlign: 'center', marginTop: -10}}>
                <GoldRule progress={ramp(fr, posCue + (i - 1) * 8, 18)} width={180} style={{margin: '0 auto 14px'}} />
                <De size={38} color={C.ivory}>{w.label}</De>
                <br />
                <De size={38} color={C.gold}>{`→ _${w.mark}_`}</De>
              </div>
            ) : null}
          </div>
        ))}
      </div>

      <div style={{...appear(fr, endCue + 6, 18), marginTop: 60}}>
        <De size={36} color={C.sand}>
          {'Der Student las das Buch.'}
        </De>
      </div>
    </AbsoluteFill>
  );
};

export const S2Nahw: React.FC = () => (
  <SceneFrame id={ID} bg={C.anthracite}>
    <Inner />
  </SceneFrame>
);
