import {Composition} from 'remotion';
import {FontTest} from './FontTest';
import {NahwSarf} from './Video';
import {totalFrames} from './timing';
import {FPS, H, W} from './theme';

export const RemotionRoot: React.FC = () => (
  <>
    <Composition id="NahwSarf" component={NahwSarf} durationInFrames={totalFrames()} fps={FPS} width={W} height={H} />
    <Composition id="FontTest" component={FontTest} durationInFrames={30} fps={FPS} width={W} height={H} />
  </>
);
