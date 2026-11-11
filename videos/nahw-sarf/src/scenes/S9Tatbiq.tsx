import {AbsoluteFill, Img, interpolate, staticFile} from 'remotion';
import {Ar, appear, De, LOGO, ramp, SceneFrame, useSceneFrame} from '../components/ui';
import {f, scene} from '../timing';
import {C, W} from '../theme';

const ID = 's9_tatbiq';

// Silent exercise after the voice ends: which ending does اللَّه take in
// رَضِيَ اللَّهُ عَنْهُمْ (al-Baiyina 98:8)? Answer: Ḍamma (it is the subject).
// The answer is NOT shown; it goes into the pinned comment.
const CHIPS = [
  {ar: 'ضَمَّةٌ', de: '_Ḍamma_'},
  {ar: 'فَتْحَةٌ', de: '_Fatḥa_'},
  {ar: 'كَسْرَةٌ', de: '_Kasra_'},
];

const Inner: React.FC = () => {
  const fr = useSceneFrame();
  const s = scene(ID);
  const total = f(s.end) - f(s.start);
  const pulse = 0.5 + 0.5 * Math.sin((fr / 30) * Math.PI * 1.6);
  const timer = interpolate(fr, [20, total - 18], [1, 0], {extrapolateLeft: 'clamp', extrapolateRight: 'clamp'});

  return (
    <AbsoluteFill>
      <div style={{position: 'absolute', top: 220, width: W, textAlign: 'center', ...appear(fr, 0, 18)}}>
        <Ar size={88} color={C.gold} style={{display: 'block', lineHeight: 1.6}}>
          تَطْبِيقٌ
        </Ar>
        <De size={46} color={C.ivory}>{'_Taṭbīq_ – jetzt du:'}</De>
      </div>

      <div style={{position: 'absolute', top: 520, width: W, textAlign: 'center', ...appear(fr, 6, 18)}}>
        <De size={36} color={C.sand}>{'Welche Endung trägt '}</De>
        <Ar size={44} color={C.sand} style={{lineHeight: 1}}>اللَّه</Ar>
        <De size={36} color={C.sand}>{' hier?'}</De>
      </div>

      {/* phrase with an open ending on اللَّه */}
      <div style={{position: 'absolute', top: 590, width: W, display: 'flex', alignItems: 'center', ...appear(fr, 10, 20)}}>
        <div style={{flex: 1, display: 'flex', justifyContent: 'flex-end', paddingRight: 30}}>
          <Ar size={104}>عَنْهُمْ</Ar>
        </div>
        <div style={{position: 'relative'}}>
          <Ar size={170}>اللَّه</Ar>
          <div
            style={{
              position: 'absolute',
              left: 0,
              top: 76,
              width: 54,
              height: 54,
              borderRadius: '50%',
              border: `4px dashed ${C.gold}`,
              background: `rgba(182,154,103,${0.12 + 0.12 * pulse})`,
              opacity: (0.7 + 0.3 * pulse) * ramp(fr, 18, 14),
              transform: `scale(${0.94 + 0.08 * pulse})`,
            }}
          />
        </div>
        <div style={{flex: 1, display: 'flex', justifyContent: 'flex-start', paddingLeft: 30}}>
          <Ar size={104}>رَضِيَ</Ar>
        </div>
      </div>
      <div style={{position: 'absolute', top: 905, width: W, textAlign: 'center', opacity: ramp(fr, 16, 18)}}>
        <De size={30} color={C.gold}>{'_al-Baiyina_ 98:8'}</De>
      </div>

      <div dir="rtl" style={{position: 'absolute', top: 980, width: W, display: 'flex', justifyContent: 'center', gap: 28}}>
        {CHIPS.map((c, i) => (
          <div
            key={c.ar}
            style={{
              ...appear(fr, 22 + i * 5, 16, 14),
              width: 260,
              padding: '4px 0 14px',
              border: `2px solid rgba(182,154,103,0.6)`,
              borderRadius: 18,
              textAlign: 'center',
            }}
          >
            <Ar size={58} style={{display: 'block', lineHeight: 1.6}}>{c.ar}</Ar>
            <De size={32}>{c.de}</De>
          </div>
        ))}
      </div>

      <div style={{position: 'absolute', top: 1230, width: W, textAlign: 'center', ...appear(fr, 34, 18)}}>
        <De size={46} color={C.ivory}>{'Schreib deine Antwort in die Kommentare.'}</De>
      </div>

      {/* calm countdown line */}
      <div
        style={{
          position: 'absolute',
          top: 1340,
          left: W / 2 - 360 * timer,
          width: 720 * timer,
          height: 3,
          background: C.gold,
          opacity: ramp(fr, 20, 12),
        }}
      />

      <Img
        src={staticFile(LOGO)}
        style={{position: 'absolute', top: 1390, left: W / 2 - 70, height: 215, opacity: 0.9 * ramp(fr, 40, 24)}}
      />
    </AbsoluteFill>
  );
};

export const S9Tatbiq: React.FC = () => (
  <SceneFrame id={ID} bg={C.green}>
    <Inner />
  </SceneFrame>
);
