import React from 'react';
import {Ar, MarkedWord} from './ui';
import {C, W} from '../theme';

/**
 * "Loom" for the Ṣarf scenes: the letters of a word (top row) are tied by
 * golden threads to the letters of its Wazn (bottom row). Column 0 is the
 * rightmost (Arabic reading order).
 */
export type LoomLetter = {
  text: string; // letter with its Ḥaraka
  base?: string; // letter without the Ḥaraka → Ḥaraka can light up in gold
  markOn?: number; // 0..1, gold Ḥaraka
  color?: string;
  op: number;
  dy?: number;
};

export const colX = (i: number, n: number, gap: number) => W / 2 + ((n - 1) / 2 - i) * gap;

const Letter: React.FC<{l: LoomLetter; x: number; y: number; size: number}> = ({l, x, y, size}) => (
  <div
    style={{
      position: 'absolute',
      left: x,
      top: y,
      transform: `translate(-50%, -50%) translateY(${l.dy ?? 0}px)`,
      opacity: l.op,
    }}
  >
    {l.base ? (
      <MarkedWord
        base={l.base}
        marks={[{text: l.text, opacity: l.markOn ?? 0}]}
        size={size}
        color={l.color ?? C.ivory}
      />
    ) : (
      <Ar size={size} color={l.color ?? C.ivory}>
        {l.text}
      </Ar>
    )}
  </div>
);

export const Loom: React.FC<{
  top: LoomLetter[];
  bottom: LoomLetter[];
  threads: {p: number; dashed?: boolean; bright?: number}[];
  topY: number;
  bottomY: number;
  gap: number;
  size: number;
}> = ({top, bottom, threads, topY, bottomY, gap, size}) => {
  const n = Math.max(top.length, bottom.length);
  const y0 = topY + size * 0.8;
  const y1 = bottomY - size * 0.78;
  return (
    <>
      <svg width={W} height={1920} style={{position: 'absolute', left: 0, top: 0}}>
        {threads.map((t, i) => {
          const x = colX(i, n, gap);
          const len = (y1 - y0) * t.p;
          return (
            <line
              key={i}
              x1={x}
              x2={x}
              y1={y0}
              y2={y0 + len}
              stroke={t.dashed ? C.sand : C.gold}
              strokeOpacity={t.dashed ? 0.5 : 0.55 + 0.45 * (t.bright ?? 0)}
              strokeWidth={t.dashed ? 2 : 2 + 1.5 * (t.bright ?? 0)}
              strokeDasharray={t.dashed ? '6 10' : undefined}
              strokeLinecap="round"
            />
          );
        })}
      </svg>
      {top.map((l, i) => (
        <Letter key={`t${i}`} l={l} x={colX(i, n, gap)} y={topY} size={size} />
      ))}
      {bottom.map((l, i) => (
        <Letter key={`b${i}`} l={l} x={colX(i, n, gap)} y={bottomY} size={size} />
      ))}
    </>
  );
};
