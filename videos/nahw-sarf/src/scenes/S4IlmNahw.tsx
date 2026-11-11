import {AbsoluteFill, interpolate, interpolateColors} from 'remotion';
import {Ar, appear, De, MarkedWord, ramp, SceneFrame, useSceneFrame} from '../components/ui';
import {cue} from '../timing';
import {C, EASE_OUT} from '../theme';

const ID = 's4_ilm_nahw';

// The three examples stacked, اللَّه aligned in one column, endings in gold.
const ROWS = [
  {before: 'يَقُولُ', word: 'اللَّهُ', after: ''},
  {before: 'إِنَّ', word: 'اللَّهَ', after: ''},
  {before: 'أَفِي', word: 'اللَّهِ', after: 'شَكٌّ'},
];

const Inner: React.FC = () => {
  const fr = useSceneFrame();
  const pos = cue('s4_position', ID);
  const seal = cue('s4_siegel', ID);
  const posP = ramp(fr, pos, 18);
  const ctxColor = interpolateColors(posP, [0, 1], [C.sand, C.gold]);
  const sealP = ramp(fr, seal, 24, EASE_OUT);
  const stackOp = 1 - 0.8 * ramp(fr, seal - 4, 16);

  return (
    <AbsoluteFill style={{alignItems: 'center', justifyContent: 'center', paddingBottom: 300}}>
      <div style={{opacity: stackOp, transform: `scale(${1 - 0.08 * sealP})`}}>
        {ROWS.map((r, i) => (
          <div key={i} style={{display: 'flex', width: 1080, alignItems: 'center', height: 200, ...appear(fr, i * 7, 20)}}>
            <div style={{flex: 1, display: 'flex', justifyContent: 'flex-end', paddingRight: 30}}>
              <Ar size={96} color={ctxColor}>{r.after}</Ar>
            </div>
            <MarkedWord base="اللَّه" marks={[{text: r.word, opacity: 1}]} size={150} />
            <div style={{flex: 1, display: 'flex', justifyContent: 'flex-start', paddingLeft: 30}}>
              <Ar size={96} color={ctxColor}>{r.before}</Ar>
            </div>
          </div>
        ))}
        <div style={{textAlign: 'center', marginTop: 10, opacity: posP}}>
          <De size={38} color={C.ivory}>{'Andere Position → anderer Endvokal'}</De>
        </div>
      </div>

      {/* seal: "this is the science of Naḥw" */}
      <AbsoluteFill style={{alignItems: 'center', justifyContent: 'center', paddingBottom: 300, opacity: sealP}}>
        <div
          style={{
            width: 560,
            height: 560,
            borderRadius: '50%',
            border: `2px solid ${C.gold}`,
            boxShadow: `inset 0 0 0 14px ${C.anthracite}, inset 0 0 0 15px rgba(182,154,103,0.5)`,
            background: C.anthracite,
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            transform: `scale(${interpolate(sealP, [0, 1], [0.9, 1])})`,
          }}
        >
          <Ar size={110} color={C.gold} style={{lineHeight: 1.7}}>
            عِلْمُ النَّحْوِ
          </Ar>
          <De size={40} color={C.ivory}>{'_Naḥw_'}</De>
          <De size={32} color={C.sand} style={{marginTop: 6}}>{'das Ende des Wortes'}</De>
        </div>
      </AbsoluteFill>
    </AbsoluteFill>
  );
};

export const S4IlmNahw: React.FC = () => (
  <SceneFrame id={ID} bg={C.anthracite}>
    <Inner />
  </SceneFrame>
);
