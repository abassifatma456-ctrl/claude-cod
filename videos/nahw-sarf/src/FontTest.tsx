import {AbsoluteFill} from 'remotion';
import {amiri, C, garamond, gentium} from './theme';

const sample = 'Naḥw · Ṣarf · ḍamma · fatḥa · kasra · faʿala · Šaiḵ · Sībawaih · Qurʾān · ʿadam';
const stack: React.CSSProperties = {position: 'relative', display: 'inline-block'};
const top: React.CSSProperties = {position: 'absolute', inset: 0, color: C.ivory};

export const FontTest: React.FC = () => (
  <AbsoluteFill style={{background: C.green, color: C.ivory, padding: 60, gap: 20}}>
    <div style={{fontFamily: garamond, fontSize: 44}}>EB Garamond: {sample}</div>
    <div style={{fontFamily: gentium, fontSize: 44}}>Gentium: {sample}</div>
    <div dir="rtl" style={{fontFamily: amiri, fontSize: 90, lineHeight: 2}}>
      يَقُولُ اللَّهُ · إِنَّ اللَّهَ · أَفِي اللَّهِ شَكٌّ
    </div>
    <div dir="rtl" style={{fontFamily: amiri, fontSize: 90, lineHeight: 2}}>
      قَرَأَ الطَّالِ<span style={{color: C.gold}}>بُ</span> الْكِتَا<span style={{color: C.gold}}>بَ</span>
    </div>
    <div dir="rtl" style={{fontFamily: amiri, fontSize: 200, lineHeight: 2, display: 'flex', gap: 80}}>
      {['اللَّهُ', 'اللَّهَ', 'اللَّهِ'].map((w) => (
        <span key={w} style={stack}>
          <span style={{color: C.gold}}>{w}</span>
          <span style={top}>اللَّه</span>
        </span>
      ))}
    </div>
  </AbsoluteFill>
);
