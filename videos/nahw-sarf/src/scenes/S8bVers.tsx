import {AbsoluteFill} from 'remotion';
import {Ar, appear, De, ramp, SceneFrame, useSceneFrame} from '../components/ui';
import {cue} from '../timing';
import {C} from '../theme';

const ID = 's8b_vers';

// at-Tauba 9:3 – the correct reading (ḍamma: "… and so is His Messenger")
// and, faint and struck through, the misreading with kasra ("… and of His
// Messenger"), which according to the tradition led Abū l-Aswad ad-Duʾalī to
// lay down the Naḥw.
const Inner: React.FC = () => {
  const fr = useSceneFrame();
  const verse = cue('s8b_vers', ID);
  const wrong = cue('s8b_falsch', ID);
  const right = cue('s8b_richtig', ID);
  const wrongP = ramp(fr, wrong, 16);
  const rightP = ramp(fr, right, 18);
  const strike = ramp(fr, wrong + 12, 14);

  return (
    <AbsoluteFill style={{alignItems: 'center'}}>
      <div style={{position: 'absolute', top: 250, width: 1080, textAlign: 'center', ...appear(fr, verse - 6, 16)}}>
        <De size={34} color={C.gold} style={{letterSpacing: 2}}>{'_at-Tauba_ 9:3'}</De>
      </div>

      <div style={{position: 'absolute', top: 310, left: 70, right: 70, textAlign: 'center', ...appear(fr, verse, 20)}}>
        <Ar size={84} color={C.ivory}>
          أَنَّ اللَّهَ بَرِيءٌ مِنَ الْمُشْرِكِينَ وَرَسُو
          <span style={{color: C.gold, textShadow: `0 0 ${20 * rightP}px rgba(182,154,103,${0.6 * rightP})`}}>لُهُ</span>
        </Ar>
        <div style={{marginTop: 10}}>
          <De size={36} color={C.ivory}>{'„… dass Allah sich von den Götzendienern lossagt – und ebenso Sein Gesandter.“'}</De>
        </div>
      </div>

      {/* misreading */}
      <div
        style={{
          position: 'absolute',
          top: 860,
          width: 1080,
          textAlign: 'center',
          opacity: wrongP * (1 - 0.55 * rightP),
        }}
      >
        <div style={{position: 'relative', display: 'inline-block'}}>
          <Ar size={80} color={C.sand}>وَرَسُولِهِ</Ar>
          <div
            style={{
              position: 'absolute',
              left: 0,
              top: '52%',
              height: 3,
              width: `${100 * strike}%`,
              background: C.sand,
            }}
          />
        </div>
        <br />
        <De size={34} color={C.sand}>{'mit _Kasra_: „… und von Seinem Gesandten“ ✗'}</De>
      </div>

      <div style={{position: 'absolute', top: 1150, left: 90, right: 90, textAlign: 'center', opacity: rightP}}>
        <De size={30} color={C.sand}>
          {'Der Überlieferung nach brachte genau dieser Fehler _Abū l-Aswad ad-Duʾalī_ dazu, den _Naḥw_ niederzulegen.'}
        </De>
      </div>
    </AbsoluteFill>
  );
};

export const S8bVers: React.FC = () => (
  <SceneFrame id={ID} bg={C.anthracite}>
    <Inner />
  </SceneFrame>
);
