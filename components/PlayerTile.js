export default function PlayerTile(props) {
  
  return (
    <div className="tile">
      <div><span className="player">{props.p1Turn? 'P1' : 'P2'}</span> {props.phase}</div>
    <style jsx>{`
      .tile {
        padding: 0 10px;
        width: 100px;
        height: 50px;
        display: flex;
        flex-direction: column;
        align-items: center;
        justify-content: center;
        color: ${props.p1Turn ? '#ff1a1c' : '#4c80ff'};
        font-weight: 700;
        box-shadow: 0 0 3px ${props.p1Turn ? '#ff1a1c' : '#4c80ff'}, 0 0 3px ${props.p1Turn ? '#ff1a1c' : '#4c80ff'}, 0 0 3px ${props.p1Turn ? '#ff1a1c' : '#4c80ff'}, 0 0 3px ${props.p1Turn ? '#ff1a1c' : '#4c80ff'};
      }

      .player {
        color: ${props.p1Turn ? '#ff1a1c' : '#4c80ff'};
        font-weight: 1100;
      }
    `}</style>
  </div>
  );
}