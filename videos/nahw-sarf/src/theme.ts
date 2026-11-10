import {continueRender, delayRender, Easing, staticFile} from 'remotion';

// Fonts are served locally from public/fonts (the render browser has no
// internet access). Amiri for Arabic, EB Garamond for German.
const faces: [string, string, string, string][] = [
  ['Amiri', 'Amiri-Regular.ttf', '400', 'normal'],
  ['Amiri', 'Amiri-Bold.ttf', '700', 'normal'],
  ['Gentium Book Plus', 'GentiumBookPlus-Regular.ttf', '400', 'normal'],
  ['Gentium Book Plus', 'GentiumBookPlus-Bold.ttf', '700', 'normal'],
  ['Gentium Book Plus', 'GentiumBookPlus-Italic.ttf', '400', 'italic'],
  ['EB Garamond', 'EBGaramond-Regular.ttf', '400', 'normal'],
  ['EB Garamond', 'EBGaramond-Medium.ttf', '500', 'normal'],
  ['EB Garamond', 'EBGaramond-Italic.ttf', '400', 'italic'],
];

if (typeof document !== 'undefined') {
  const handle = delayRender('Loading local fonts');
  Promise.all(
    faces.map(([family, file, weight, style]) => {
      const face = new FontFace(family, `url(${staticFile(`fonts/${file}`)})`, {weight, style});
      document.fonts.add(face);
      return face.load();
    }),
  )
    .then(() => continueRender(handle))
    .catch((err) => {
      console.error(err);
      continueRender(handle);
    });
}

export const amiri = 'Amiri';
export const gentium = 'Gentium Book Plus';
export const garamond = 'EB Garamond';

export const C = {
  green: '#12372D',
  anthracite: '#25231F',
  ivory: '#F3EDE0',
  gold: '#B69A67',
  sand: '#D5C8B1',
} as const;

// EB Garamond covers all Hans Wehr glyphs (checked); Gentium only as fallback.
export const FONT_DE = `'${garamond}', '${gentium}', serif`;
export const FONT_AR = `'${amiri}', serif`;

export const W = 1080;
export const H = 1920;
export const FPS = 30;
// 5 % safe area
export const SAFE = {x: W * 0.05, y: H * 0.05};

// Calm, soft easing used everywhere.
export const EASE = Easing.bezier(0.33, 0, 0.2, 1);
export const EASE_OUT = Easing.bezier(0.16, 1, 0.3, 1);
