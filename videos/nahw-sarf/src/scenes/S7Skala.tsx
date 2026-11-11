import {AbsoluteFill, interpolate} from 'remotion';
import {Ar, appear, De, ramp, SceneFrame, useSceneFrame} from '../components/ui';
import {cue} from '../timing';
import {C, EASE} from '../theme';

const ID = 's7_skala';

// Elfenbein + Tiefgrün. Gold only for lines and the marker, never as text.
const X0 = 210; // ʿadam (left)
const X1 = 870; // Sībawaih (right)
const Y = 760;

const Inner: React.FC = () => {
  const fr = useSceneFrame();
  const sib = cue('s7_sibawaih', ID);
  const adam = cue('s7_adam', ID);
  const mid = cue('s7_mitte', ID);

  const line = ramp(fr, 4, 30);
  // Marker: start in the middle, drift to Sībawaih, then to ʿadam, then settle in the middle.
  const x = interpolate(
    fr,
    [0, sib, sib + 24, adam, adam + 24, mid, mid + 30],
    [540, 540, X1 - 70, X1 - 70, X0 + 70, X0 + 70, 540],
    {easing: EASE, extrapolateLeft: 'clamp', extrapolateRight: 'clamp'},
  );
  const noSib = ramp(fr, sib + 20, 14);
  const noAdam = ramp(fr, adam + 20, 14);
  const midP = ramp(fr, mid + 20, 18);

  return (
    <AbsoluteFill>
      <div style={{position: 'absolute', top: 300, width: 1080, textAlign: 'center', ...appear(fr, 0, 18)}}>
        <De size={58} color={C.green}>{'Wer den _Qurʾān_ studiert …'}</De>
      </div>

      {/* scale */}
      <div style={{position: 'absolute', left: X0, top: Y, width: (X1 - X0) * line, height: 3, background: C.gold}} />
      {[X0, X1].map((px) => (
        <div key={px} style={{position: 'absolute', left: px - 9, top: Y - 8, width: 18, height: 18, borderRadius: '50%', background: C.gold, opacity: line}} />
      ))}

      {/* ʿadam end */}
      <div style={{position: 'absolute', left: X0, top: Y - 210, transform: 'translateX(-50%)', textAlign: 'center', opacity: ramp(fr, 10, 18)}}>
        <Ar size={90} color={C.green} style={{display: 'block', lineHeight: 1.7}}>عَدَمٌ</Ar>
      </div>
      <div style={{position: 'absolute', left: X0 - 60, top: Y + 40, width: 260, opacity: ramp(fr, 10, 18)}}>
        <De size={32} color={C.green}>{'_ʿadam_ · bei null'}</De>
        <div style={{opacity: noAdam, marginTop: 8}}>
          <De size={30} color={C.anthracite} style={{fontStyle: 'italic'}}>{'darf nicht sein'}</De>
        </div>
      </div>

      {/* Sībawaih end */}
      <div style={{position: 'absolute', left: X1, top: Y - 210, transform: 'translateX(-50%)', textAlign: 'center', opacity: ramp(fr, 16, 18)}}>
        <Ar size={90} color={C.green} style={{display: 'block', lineHeight: 1.7}}>سِيبَوَيْهِ</Ar>
      </div>
      <div style={{position: 'absolute', right: 1080 - X1 - 60, top: Y + 40, width: 300, textAlign: 'right', opacity: ramp(fr, 16, 18)}}>
        <De size={32} color={C.green}>{'_Sībawaih_ · der Meister'}</De>
        <div style={{opacity: noSib, marginTop: 8}}>
          <De size={30} color={C.anthracite} style={{fontStyle: 'italic'}}>{'muss nicht sein'}</De>
        </div>
      </div>

      {/* marker */}
      <div
        style={{
          position: 'absolute',
          left: x,
          top: Y + 1,
          width: 46,
          height: 46,
          transform: 'translate(-50%, -50%)',
          borderRadius: '50%',
          background: C.green,
          border: `4px solid ${C.gold}`,
          opacity: ramp(fr, 20, 14),
        }}
      />

      {/* the middle */}
      <div style={{position: 'absolute', top: Y + 200, width: 1080, textAlign: 'center', opacity: midP, transform: `translateY(${(1 - midP) * 16}px)`}}>
        <De size={46} color={C.green}>{'… braucht ein solides Fundament'}</De>
        <br />
        <De size={36} color={C.anthracite}>{'in _Naḥw_ und _Ṣarf_.'}</De>
      </div>
    </AbsoluteFill>
  );
};

export const S7Skala: React.FC = () => (
  <SceneFrame id={ID} bg={C.ivory}>
    <Inner />
  </SceneFrame>
);
