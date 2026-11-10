import {AbsoluteFill, Audio, staticFile} from 'remotion';
import {Credit, Subtitles, Watermark} from './components/ui';
import {Placeholder} from './scenes/Placeholder';
import {S1Titel} from './scenes/S1Titel';
import {S2Nahw} from './scenes/S2Nahw';
import {S3Allah} from './scenes/S3Allah';
import {f, scene, T} from './timing';
import {C} from './theme';

export const NahwSarf: React.FC = () => (
  <AbsoluteFill style={{background: C.green}}>
    <Audio src={staticFile(T.audio)} />
    <S1Titel />
    <S2Nahw />
    <S3Allah />
    <Placeholder id="s4_ilm_nahw" bg={C.anthracite} />
    <Placeholder id="s5_sarf" bg={C.green} />
    <Placeholder id="s6_yasmau" bg={C.green} />
    <Placeholder id="s7_skala" bg={C.ivory} />
    <Placeholder id="s8_warnung" bg={C.anthracite} />
    <Placeholder id="s9_tatbiq" bg={C.green} />
    <Watermark from={f(scene('s2_nahw').start)} />
    <Credit />
    <Subtitles />
  </AbsoluteFill>
);
