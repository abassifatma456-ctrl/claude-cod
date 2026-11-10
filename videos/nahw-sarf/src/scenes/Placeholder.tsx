import {AbsoluteFill} from 'remotion';
import {De, SceneFrame} from '../components/ui';
import {T} from '../timing';
import {C} from '../theme';

/** Stand-in for scenes that are not built yet. */
export const Placeholder: React.FC<{id: string; bg: string}> = ({id, bg}) => {
  const s = T.scenes.find((x) => x.id === id)!;
  return (
    <SceneFrame id={id} bg={bg}>
      <AbsoluteFill style={{alignItems: 'center', justifyContent: 'center', paddingBottom: 300}}>
        <De size={44} color={C.sand}>{`${id} · ${s.start.toFixed(2)}–${s.end.toFixed(2)} s · in Arbeit`}</De>
      </AbsoluteFill>
    </SceneFrame>
  );
};
