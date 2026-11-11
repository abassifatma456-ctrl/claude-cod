import {AbsoluteFill, interpolate, interpolateColors} from 'remotion';
import {Loom} from '../components/Loom';
import {Ar, appear, De, ramp, SceneFrame, useSceneFrame} from '../components/ui';
import {cue} from '../timing';
import {C, EASE_OUT, W} from '../theme';

const ID = 's5_sarf';

// Positions (px) shared with scene 6 so the hand-over is seamless.
export const SARF_LAYOUT = {headerY: 300, wordY: 500, topY: 700, bottomY: 990, patternY: 1180, gap: 210, size: 120};

export const SarfHeader: React.FC<{op: number}> = ({op}) => (
  <div style={{position: 'absolute', top: SARF_LAYOUT.headerY - 110, width: W, textAlign: 'center', opacity: op}}>
    <Ar size={84} color={C.gold} style={{display: 'block', lineHeight: 1.6}}>
      عِلْمُ الصَّرْفِ
    </Ar>
    <De size={36} color={C.sand} style={{letterSpacing: 2}}>
      {'_Ṣarf_ · der Blick ins Innere des Wortes'}
    </De>
  </div>
);

export const RowLabel: React.FC<{y: number; text: string; op: number}> = ({y, text, op}) => (
  <div style={{position: 'absolute', left: 64, top: y - 20, opacity: op}}>
    <De size={28} color={C.sand} style={{letterSpacing: 2}}>
      {text}
    </De>
  </div>
);

const Inner: React.FC = () => {
  const fr = useSceneFrame();
  const L = SARF_LAYOUT;
  const c = {
    kataba: cue('s5_kataba', ID),
    wazn1: cue('s5_wazn1', ID),
    faala: cue('s5_faala', ID),
    samia: cue('s5_samia', ID),
    wazn2: cue('s5_wazn2', ID),
    faila: cue('s5_faila', ID),
    asliya: cue('s5_asliya', ID),
  };

  // Zoom-in "lens": a golden ring opens from the centre (camera goes inside the word).
  const lens = ramp(fr, -6, 30, EASE_OUT);

  // Word 1 → word 2 cross-fade
  const swapTop = ramp(fr, c.samia - 4, 14);
  const swapBottom = ramp(fr, c.wazn2, 14);
  const swapPattern = ramp(fr, c.faila - 2, 14);
  const asl = ramp(fr, c.asliya, 18);
  const rootColor = interpolateColors(asl, [0, 1], [C.ivory, C.gold]);
  const kasra = ramp(fr, c.faila, 14);

  const topIn = (i: number) => ramp(fr, c.kataba + 4 + i * 5, 14);
  const botIn = (i: number) => ramp(fr, c.wazn1 + i * 5, 14);
  const thr = (i: number) => ramp(fr, c.wazn1 + 2 + i * 5, 18);

  const top1 = ['كَ', 'تَ', 'بَ'];
  const top2 = ['سَ', 'مِ', 'عَ'];
  const bot1 = ['فَ', 'عَ', 'لَ'];
  const bot2 = ['فَ', 'عِ', 'لَ'];

  const mk = (arr: string[], inF: (i: number) => number, op: number, highlightMid: boolean, color: string) =>
    arr.map((t, i) => ({
      text: t,
      base: highlightMid && i === 1 ? t.slice(0, 1) : undefined,
      markOn: highlightMid && i === 1 ? kasra : 0,
      op: inF(i) * op,
      color,
    }));

  return (
    <AbsoluteFill>
      {/* lens ring */}
      <div
        style={{
          position: 'absolute',
          left: W / 2,
          top: 760,
          width: 2400 * lens,
          height: 2400 * lens,
          borderRadius: '50%',
          border: `2px solid ${C.gold}`,
          transform: 'translate(-50%, -50%)',
          opacity: 1 - lens,
        }}
      />
      <SarfHeader op={ramp(fr, 0, 18)} />

      {/* whole word, above the loom */}
      <div style={{position: 'absolute', top: L.wordY, left: W / 2, transform: 'translate(-50%, -50%)'}}>
        <div style={{...appear(fr, c.kataba - 2, 16), opacity: ramp(fr, c.kataba - 2, 16) * (1 - swapTop), position: 'absolute', left: '50%', transform: 'translateX(-50%)', top: -110}}>
          <Ar size={130}>كَتَبَ</Ar>
        </div>
        <div style={{opacity: swapTop, position: 'absolute', left: '50%', transform: 'translateX(-50%)', top: -110}}>
          <Ar size={130}>سَمِعَ</Ar>
        </div>
      </div>

      <RowLabel y={L.topY} text="Wort" op={ramp(fr, c.kataba + 4, 14)} />
      <RowLabel y={L.bottomY} text="Wazn" op={ramp(fr, c.wazn1, 14)} />

      <Loom
        top={[...mk(top1, topIn, 1 - swapTop, false, rootColor)]}
        bottom={mk(bot1, botIn, 1 - swapBottom, false, C.ivory)}
        threads={[0, 1, 2].map((i) => ({p: thr(i), bright: asl}))}
        topY={L.topY}
        bottomY={L.bottomY}
        gap={L.gap}
        size={L.size}
      />
      <Loom
        top={mk(top2, () => 1, swapTop, true, rootColor)}
        bottom={mk(bot2, () => 1, swapBottom, true, C.ivory)}
        threads={[]}
        topY={L.topY}
        bottomY={L.bottomY}
        gap={L.gap}
        size={L.size}
      />

      {/* pattern word */}
      <div style={{position: 'absolute', top: L.patternY, left: W / 2, transform: 'translate(-50%, -50%)', textAlign: 'center'}}>
        <div style={{opacity: ramp(fr, c.faala, 16) * (1 - swapPattern), position: 'absolute', left: '50%', transform: 'translateX(-50%)', top: -100, whiteSpace: 'nowrap'}}>
          <Ar size={110} color={C.gold}>فَعَلَ</Ar>
        </div>
        <div style={{opacity: swapPattern, position: 'absolute', left: '50%', transform: 'translateX(-50%)', top: -100, whiteSpace: 'nowrap'}}>
          <Ar size={110} color={C.gold}>فَعِلَ</Ar>
        </div>
      </div>

      {/* root letters label */}
      <div
        style={{
          position: 'absolute',
          top: L.topY - 20,
          right: 40,
          opacity: asl,
          transform: `translateX(${interpolate(asl, [0, 1], [20, 0])}px)`,
          textAlign: 'center',
        }}
      >
        <Ar size={44} color={C.gold} style={{display: 'block', lineHeight: 1.5}}>
          أَصْلِيَّةٌ
        </Ar>
        <De size={24} color={C.sand}>{'Wurzel'}</De>
      </div>
    </AbsoluteFill>
  );
};

export const S5Sarf: React.FC = () => (
  <SceneFrame id={ID} bg={C.green}>
    <Inner />
  </SceneFrame>
);
