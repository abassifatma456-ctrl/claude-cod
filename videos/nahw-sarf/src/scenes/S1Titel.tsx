import {AbsoluteFill} from 'remotion';
import {Ar, appear, De, GoldRule, ramp, SceneFrame, useSceneFrame} from '../components/ui';
import {cue} from '../timing';
import {C} from '../theme';

const ID = 's1_titel';

const Inner: React.FC = () => {
  const fr = useSceneFrame();
  const nahw = cue('s1_nahw', ID);
  const sarf = cue('s1_sarf', ID);
  const rule = ramp(fr, nahw + 4, 24);
  return (
    <AbsoluteFill style={{alignItems: 'center', justifyContent: 'center', paddingBottom: 260}}>
      <div style={{display: 'flex', flexDirection: 'column', alignItems: 'center'}}>
        <div style={{...appear(fr, nahw - 6, 20), textAlign: 'center'}}>
          <Ar size={210} color={C.ivory} style={{display: 'block', lineHeight: 1.7}}>
            النَّحْوُ
          </Ar>
          <De size={46} color={C.gold} style={{letterSpacing: 4}}>
            {'_Naḥw_'}
          </De>
        </div>
        <GoldRule progress={rule} width={520} style={{margin: '56px 0 8px'}} />
        <div style={{...appear(fr, sarf, 20), textAlign: 'center'}}>
          <Ar size={210} color={C.ivory} style={{display: 'block', lineHeight: 1.7}}>
            الصَّرْفُ
          </Ar>
          <De size={46} color={C.gold} style={{letterSpacing: 4}}>
            {'_Ṣarf_'}
          </De>
        </div>
      </div>
    </AbsoluteFill>
  );
};

export const S1Titel: React.FC = () => (
  <SceneFrame id={ID} bg={C.green}>
    <Inner />
  </SceneFrame>
);
