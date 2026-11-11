import React from 'react';
import {AbsoluteFill, Img, interpolate, Sequence, staticFile, useCurrentFrame} from 'remotion';
import {f, T} from '../timing';
import {C, EASE, EASE_OUT, FONT_AR, FONT_DE, H, SAFE, W} from '../theme';

/** 0→1 between two frames with the calm default easing (clamped). */
export const ramp = (frame: number, from: number, dur = 15, ease = EASE) =>
  interpolate(frame, [from, from + dur], [0, 1], {
    easing: ease,
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  });

/** Fade + slight rise in, used for most text entrances. */
export const appear = (frame: number, from: number, dur = 18, rise = 24): React.CSSProperties => {
  const p = ramp(frame, from, dur, EASE_OUT);
  return {opacity: p, transform: `translateY(${(1 - p) * rise}px)`};
};

/** Arabic text: Amiri, RTL, line height 2 so the Ḥarakāt never collide. */
export const Ar: React.FC<{
  size: number;
  color?: string;
  style?: React.CSSProperties;
  children: React.ReactNode;
}> = ({size, color = C.ivory, style, children}) => (
  <span dir="rtl" lang="ar" style={{fontFamily: FONT_AR, fontSize: size, lineHeight: 2, color, ...style}}>
    {children}
  </span>
);

/** German text: EB Garamond. `_word_` is set in italics (transliterations). */
export const De: React.FC<{
  size: number;
  color?: string;
  style?: React.CSSProperties;
  children: string;
}> = ({size, color = C.ivory, style, children}) => (
  <span style={{fontFamily: FONT_DE, fontSize: size, lineHeight: 1.3, color, ...style}}>
    {children.split('_').map((part, i) => (i % 2 ? <i key={i}>{part}</i> : <React.Fragment key={i}>{part}</React.Fragment>))}
  </span>
);

/**
 * A word whose final Ḥaraka is shown in a different colour.
 * Two stacked layers: the full word in `markColor`, and on top the word
 * without its final mark in `color`. Only the mark stays visible in gold,
 * and the browser still shapes the word as one unit.
 */
export const MarkedWord: React.FC<{
  base: string;
  marks: {text: string; opacity: number; dy?: number}[];
  size: number;
  color?: string;
  markColor?: string;
}> = ({base, marks, size, color = C.ivory, markColor = C.gold}) => (
  <span style={{position: 'relative', display: 'inline-block'}}>
    {marks.map((m) => (
      <Ar
        key={m.text}
        size={size}
        color={markColor}
        style={{
          position: 'absolute',
          inset: 0,
          opacity: m.opacity,
          transform: `translateY(${m.dy ?? 0}px)`,
        }}
      >
        {m.text}
      </Ar>
    ))}
    <Ar size={size} color={color} style={{position: 'relative'}}>
      {base}
    </Ar>
  </span>
);

const SceneOffset = React.createContext(0);

/** Frame relative to the scene start defined in scenes.json (negative during fade-in). */
export const useSceneFrame = () => useCurrentFrame() - React.useContext(SceneOffset);

/** Wraps a scene: placed by scenes.json, soft cross-fade in and out. */
export const SceneFrame: React.FC<{
  id: string;
  bg: string;
  children: React.ReactNode;
}> = ({id, bg, children}) => {
  const s = T.scenes.find((x) => x.id === id)!;
  const half = Math.round(f(T.transition) / 2);
  const from = Math.max(0, f(s.start) - half);
  const dur = f(s.end) + half - from;
  return (
    <Sequence from={from} durationInFrames={dur} name={id}>
      <Fader dur={dur} fade={half * 2} fadeIn={from > 0} fadeOut={s === T.scenes[T.scenes.length - 1]}>
        <AbsoluteFill style={{background: bg}}>
          <SceneOffset.Provider value={f(s.start) - from}>{children}</SceneOffset.Provider>
        </AbsoluteFill>
      </Fader>
    </Sequence>
  );
};

// The incoming scene fades in over the outgoing one (no dip to black).
const Fader: React.FC<{dur: number; fade: number; fadeIn: boolean; fadeOut: boolean; children: React.ReactNode}> = ({
  dur,
  fade,
  fadeIn,
  fadeOut,
  children,
}) => {
  const frame = useCurrentFrame();
  const inOp = fadeIn ? interpolate(frame, [0, fade], [0, 1], {extrapolateRight: 'clamp', easing: EASE}) : 1;
  const outOp = fadeOut ? interpolate(frame, [dur - fade, dur], [1, 0], {extrapolateLeft: 'clamp', easing: EASE}) : 1;
  return <AbsoluteFill style={{opacity: Math.min(inOp, outOp)}}>{children}</AbsoluteFill>;
};

/** German subtitles from scenes.json, lower third, above the Shorts UI. */
export const Subtitles: React.FC = () => {
  const frame = useCurrentFrame();
  const t = frame / 30;
  const sub = T.subtitles.find((s) => t >= s.start - 0.1 && t < s.end + 0.15);
  if (!sub) return null;
  const op = Math.min(ramp(frame, f(sub.start) - 3, 6), 1 - ramp(frame, f(sub.end), 6));
  const light = T.scenes.some((s) => s.light && t >= s.start && t < s.end);
  return (
    <AbsoluteFill style={{justifyContent: 'flex-start', alignItems: 'center'}}>
      <div
        style={{
          position: 'absolute',
          top: 1330,
          left: SAFE.x + 20,
          right: SAFE.x + 20,
          textAlign: 'center',
          opacity: op,
          textWrap: 'balance',
        }}
      >
        <De size={50} color={light ? C.green : C.ivory} style={{textShadow: light ? 'none' : '0 2px 12px rgba(0,0,0,0.35)'}}>
          {sub.text}
        </De>
      </div>
    </AbsoluteFill>
  );
};

export const LOGO = 'logo/malakah_logo_gold.png';

/** Logo watermark, top right, ~30 % opacity; hidden again from `until`. */
export const Watermark: React.FC<{from: number; until: number}> = ({from, until}) => {
  const frame = useCurrentFrame();
  const op = 0.3 * Math.min(ramp(frame, from, 20), 1 - ramp(frame, until - 10, 10));
  return (
    <Img
      src={staticFile(LOGO)}
      style={{position: 'absolute', top: SAFE.y - 20, right: SAFE.x - 10, height: 150, opacity: op}}
    />
  );
};

/** Source credit for the Šaiḵ at the start. */
export const Credit: React.FC = () => {
  const frame = useCurrentFrame();
  const op = Math.min(ramp(frame, f(T.credit.start), 20), 1 - ramp(frame, f(T.credit.end) - 20, 20));
  return (
    <div
      style={{
        position: 'absolute',
        top: SAFE.y + 10,
        left: SAFE.x,
        opacity: op * 0.85,
        display: 'flex',
        flexDirection: 'column',
        gap: 0,
      }}
    >
      <Ar size={40} color={C.ivory} style={{lineHeight: 1.7}}>
        الشَّيْخُ أَيْمَن سُوَيْد حَفِظَهُ اللَّهُ
      </Ar>
      <De size={30} color={C.sand}>
        {'_Šaiḵ_ Aiman Suwaid'}
      </De>
    </div>
  );
};

/** Thin gold rule drawn from the centre outwards. */
export const GoldRule: React.FC<{progress: number; width: number; style?: React.CSSProperties}> = ({
  progress,
  width,
  style,
}) => (
  <div
    style={{
      width: width * progress,
      height: 2,
      background: `linear-gradient(90deg, transparent, ${C.gold} 15%, ${C.gold} 85%, transparent)`,
      ...style,
    }}
  />
);

export const Stage: React.FC<{children: React.ReactNode; style?: React.CSSProperties}> = ({children, style}) => (
  <AbsoluteFill
    style={{
      top: 0,
      height: H,
      width: W,
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      ...style,
    }}
  >
    {children}
  </AbsoluteFill>
);
