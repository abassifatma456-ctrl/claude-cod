import {AbsoluteFill, Audio, staticFile} from 'remotion';
import {Credit, Subtitles, Watermark} from './components/ui';
import {S1Titel} from './scenes/S1Titel';
import {S2Nahw} from './scenes/S2Nahw';
import {S3Allah} from './scenes/S3Allah';
import {S4IlmNahw} from './scenes/S4IlmNahw';
import {S5Sarf} from './scenes/S5Sarf';
import {S6Yasmau} from './scenes/S6Yasmau';
import {S7Skala} from './scenes/S7Skala';
import {S8Warnung} from './scenes/S8Warnung';
import {S8bVers} from './scenes/S8bVers';
import {S9Tatbiq} from './scenes/S9Tatbiq';
import {f, scene, T} from './timing';
import {C} from './theme';

export const NahwSarf: React.FC = () => (
  <AbsoluteFill style={{background: C.green}}>
    <Audio src={staticFile(T.audio)} />
    <S1Titel />
    <S2Nahw />
    <S3Allah />
    <S4IlmNahw />
    <S5Sarf />
    <S6Yasmau />
    <S7Skala />
    <S8Warnung />
    <S8bVers />
    <S9Tatbiq />
    <Watermark from={f(scene('s2_nahw').start)} until={f(scene('s9_tatbiq').start)} />
    <Credit />
    <Subtitles />
  </AbsoluteFill>
);
