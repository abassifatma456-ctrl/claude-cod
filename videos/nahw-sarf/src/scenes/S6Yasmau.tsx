import {AbsoluteFill, interpolateColors} from 'remotion';
import {colX, Loom} from '../components/Loom';
import {Ar, appear, De, ramp, SceneFrame, useSceneFrame} from '../components/ui';
import {cue} from '../timing';
import {C, W} from '../theme';
import {RowLabel, SARF_LAYOUT, SarfHeader} from './S5Sarf';

const ID = 's6_yasmau';

const Inner: React.FC = () => {
  const fr = useSceneFrame();
  const L = {...SARF_LAYOUT, gap: 200};
  const c = {
    yasmau: cue('s6_yasmau', ID),
    wazn: cue('s6_wazn', ID),
    yafalu: cue('s6_yafalu', ID),
    ya: cue('s6_ya', ID),
    fa: cue('s6_fa', ID),
    ain: cue('s6_ain', ID),
    lam: cue('s6_lam', ID),
    asliya: cue('s6_asliya', ID),
  };
  const yaP = ramp(fr, c.ya, 20);
  const lit = [0, ramp(fr, c.fa, 12), ramp(fr, c.ain, 12), ramp(fr, c.lam, 12)];
  const litColor = (i: number) => interpolateColors(lit[i], [0, 1], [C.ivory, C.gold]);

  const top = ['يَ', 'سْ', 'مَ', 'عُ'];
  const bot = ['يَ', 'فْ', 'عَ', 'لُ'];
  const n = 4;

  const topIn = (i: number) => ramp(fr, c.yasmau + 6 + i * 4, 14);
  const botIn = (i: number) => ramp(fr, c.wazn + i * 4, 14);
  const thr = (i: number) => ramp(fr, c.wazn + 2 + i * 4, 18);

  const ya = (inP: number) => ({
    text: 'يَ',
    op: inP * (1 - 0.55 * yaP),
    dy: -26 * yaP,
    color: C.sand,
  });

  return (
    <AbsoluteFill>
      <SarfHeader op={1} />
      <div style={{position: 'absolute', top: L.wordY - 110, width: W, textAlign: 'center', ...appear(fr, c.yasmau - 2, 16)}}>
        <Ar size={130}>
          <span style={{color: interpolateColors(yaP, [0, 1], [C.ivory, C.sand])}}>يَ</span>سْمَعُ
        </Ar>
      </div>
      <RowLabel y={L.topY} text="Wort" op={ramp(fr, c.yasmau + 6, 14)} />
      <RowLabel y={L.bottomY} text="Wazn" op={ramp(fr, c.wazn, 14)} />

      <Loom
        top={top.map((t, i) => (i === 0 ? ya(topIn(0)) : {text: t, op: topIn(i), color: C.ivory}))}
        bottom={bot.map((t, i) => (i === 0 ? ya(botIn(0)) : {text: t, op: botIn(i), color: litColor(i)}))}
        threads={[0, 1, 2, 3].map((i) =>
          i === 0 ? {p: thr(0) * (1 - yaP), dashed: true} : {p: thr(i), bright: lit[i]},
        )}
        topY={L.topY}
        bottomY={L.bottomY}
        gap={L.gap}
        size={L.size}
      />

      {/* "Yāʾ is not from the root": badge on the Yāʾ column */}
      <div
        style={{
          position: 'absolute',
          left: colX(0, n, L.gap),
          top: (L.topY + L.bottomY) / 2,
          transform: 'translate(-50%, -50%)',
          opacity: yaP,
          textAlign: 'center',
          padding: '0 16px 8px',
          border: `1.5px solid ${C.sand}`,
          borderRadius: 14,
          background: C.green,
        }}
      >
        <Ar size={44} color={C.sand} style={{display: 'block', lineHeight: 1.6}}>
          زَائِدٌ
        </Ar>
        <De size={24} color={C.sand}>{'nicht aus der Wurzel'}</De>
      </div>

      {/* pattern word */}
      <div style={{position: 'absolute', top: L.patternY - 100, width: W, textAlign: 'center', opacity: ramp(fr, c.yafalu, 16)}}>
        <Ar size={110} color={C.ivory}>
          <span style={{color: C.sand}}>يَ</span>
          <span style={{color: lit[1] > 0.5 ? C.gold : C.ivory}}>فْ</span>
          <span style={{color: lit[2] > 0.5 ? C.gold : C.ivory}}>عَ</span>
          <span style={{color: lit[3] > 0.5 ? C.gold : C.ivory}}>لُ</span>
        </Ar>
      </div>

      {/* Fāʾ · ʿAin · Lām: badges on their threads */}
      {['_Fāʾ_', '_ʿAin_', '_Lām_'].map((t, i) => (
        <div
          key={t}
          style={{
            position: 'absolute',
            left: colX(i + 1, n, L.gap),
            top: (L.topY + L.bottomY) / 2,
            transform: `translate(-50%, -50%) scale(${0.9 + 0.1 * lit[i + 1]})`,
            opacity: lit[i + 1],
            padding: '4px 14px 6px',
            border: `1.5px solid ${C.gold}`,
            borderRadius: 14,
            background: C.green,
          }}
        >
          <De size={34} color={C.gold}>{t}</De>
        </div>
      ))}
      {/* "root letters" label, right of the Wazn row */}
      <div style={{position: 'absolute', left: 60, top: L.patternY - 40, opacity: ramp(fr, c.asliya, 16)}}>
        <Ar size={44} color={C.gold} style={{display: 'block', lineHeight: 1.5}}>
          حُرُوفٌ أَصْلِيَّةٌ
        </Ar>
        <De size={26} color={C.sand}>{'Wurzelbuchstaben'}</De>
      </div>
    </AbsoluteFill>
  );
};

export const S6Yasmau: React.FC = () => (
  <SceneFrame id={ID} bg={C.green}>
    <Inner />
  </SceneFrame>
);
