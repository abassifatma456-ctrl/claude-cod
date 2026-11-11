import {AbsoluteFill, interpolate} from 'remotion';
import {Ar, appear, De, ramp, SceneFrame, useSceneFrame} from '../components/ui';
import {cue} from '../timing';
import {C, EASE} from '../theme';

const ID = 's8_warnung';

const PANEL = {top: 470, h: 520, w: 420};
const X_JANNA = 540 + 240; // right panel centre
const X_NAR = 540 - 240; // left panel centre

/** A text token that travels on an arc from one panel to the other. */
const Token: React.FC<{text: string; from: number; to: number; at: number; y0: number; y1: number; fr: number}> = ({
  text,
  from,
  to,
  at,
  y0,
  y1,
  fr,
}) => {
  const p = interpolate(fr, [at, at + 28], [0, 1], {easing: EASE, extrapolateLeft: 'clamp', extrapolateRight: 'clamp'});
  const x = interpolate(p, [0, 1], [from, to]);
  const y = interpolate(p, [0, 1], [y0, y1]) - Math.sin(Math.PI * p) * 170;
  const moving = p > 0 && p < 1;
  return (
    <div style={{position: 'absolute', left: x, top: y, transform: 'translate(-50%, -50%)', whiteSpace: 'nowrap'}}>
      <Ar size={58} color={p > 0 ? C.gold : C.ivory} style={{opacity: moving ? 1 : 0.95}}>
        {text}
      </Ar>
    </div>
  );
};

const Panel: React.FC<{x: number; ar: string; de: string; border: string; op: number}> = ({x, ar, de, border, op}) => (
  <div
    style={{
      position: 'absolute',
      left: x - PANEL.w / 2,
      top: PANEL.top,
      width: PANEL.w,
      height: PANEL.h,
      border: `2px solid ${border}`,
      borderRadius: 28,
      textAlign: 'center',
      paddingTop: 20,
      opacity: op,
    }}
  >
    <Ar size={110} color={C.ivory} style={{display: 'block', lineHeight: 1.7}}>
      {ar}
    </Ar>
    <De size={34} color={C.sand}>{de}</De>
  </div>
);

const Inner: React.FC = () => {
  const fr = useSceneFrame();
  const err = cue('s8_fehler', ID);
  const hin = cue('s8_hin', ID);
  const rueck = cue('s8_rueck', ID);

  return (
    <AbsoluteFill>
      <Panel x={X_JANNA} ar="الْجَنَّةُ" de="das Paradies" border={C.gold} op={ramp(fr, 0, 18)} />
      <Panel x={X_NAR} ar="النَّارُ" de="das Feuer" border={C.sand} op={ramp(fr, 6, 18)} />

      <div style={{opacity: ramp(fr, 10, 18)}}>
        <Token text="أَهْلُ الْجَنَّةِ" from={X_JANNA} to={X_NAR} at={hin} y0={790} y1={925} fr={fr} />
        <Token text="أَهْلُ النَّارِ" from={X_NAR} to={X_JANNA} at={rueck} y0={790} y1={925} fr={fr} />
      </div>

      <div style={{position: 'absolute', top: 1080, width: 1080, textAlign: 'center', ...appear(fr, err, 18)}}>
        <De size={46} color={C.ivory}>{'Ein falscher Vokal –'}</De>
        <br />
        <De size={46} color={C.gold}>{'und die Bedeutung kippt.'}</De>
      </div>
    </AbsoluteFill>
  );
};

export const S8Warnung: React.FC = () => (
  <SceneFrame id={ID} bg={C.anthracite}>
    <Inner />
  </SceneFrame>
);
