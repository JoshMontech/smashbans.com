import ScoreTile from './ScoreTile';
import PlayerTile from './PlayerTile';


export default function Dashboard(props) {
  
  return (
  <ul className="container">
    <ul className="dashboard">
    {props.scores.map((score,index) => {
      return <ScoreTile key={`${index}-${score.stage}-${score.winner}`} stage={score.stage} winner={score.winner} />
    })}
    </ul>
    <PlayerTile p1Turn={props.p1Turn} phase={props.phase} />

    
    <style jsx>{`
      .container {
        width: 100%;
        padding: 0;
        margin: 0;
        display: flex;
        justify-content: space-between;
      }

      .dashboard {
        padding-left: 0;
        height: 10%;
        display: flex;
        align-items: center;
      }
    `}</style>
  </ul>
  );
}
