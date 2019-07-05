export default function ScoreTile(props) {
  function stageName(stage) {
    switch (stage) {
      case 'Pokemon Stadium':
        return 'PS';
      case 'Smashville':
        return 'SV';
      case 'Lylat Cruise':
        return 'LC';
      case 'Battlefield':
        return 'BF';
      case 'Town & City':
        return 'TC';
      case 'Final Destination':
        return 'FD';
      case 'Unova':
        return 'UV';
      case 'Kalos':
        return 'KL';
      case 'Yoshi\'s Island':
        return 'YI';
      case 'Yoshi\'s Story':
        return 'YS';
      default:
        return 'NaN';
    }
  }

  function getStageUrl(stageName) {
    return `/static/images/stages/${stageName}-min.png`;
  }

  function stageUrl(stageName) {
    switch (stageName) {
      case 'Pokemon Stadium':
        return getStageUrl('ps');
      case 'Smashville':
        return getStageUrl('sv');
      case 'Lylat Cruise':
        return getStageUrl('lc');
      case 'Battlefield':
        return getStageUrl('bf');
      case 'Town & City':
        return getStageUrl('tc');
      case 'Final Destination':
        return getStageUrl('fd');
      case 'Unova':
        return getStageUrl('uv');
      case 'Kalos':
        return getStageUrl('kl');
      case 'Yoshi\'s Island':
        return getStageUrl('yi');
      case 'Yoshi\'s Story':
        return getStageUrl('ys');
      default:
        return 'NaN';
    }
  }


  function calculateBackgroundColor(winner) {
     return winner === 'Player 1' ? '#ff1a1c' : '#4c80ff';
  }


  const bgColor = calculateBackgroundColor(props.winner);
  return (
    <div className="tile">
      <div>{stageName(props.stage)}</div>
    <style jsx>{`
      .tile {
        width: 50px;
        background-image: 
          linear-gradient(rgba(0, 0, 0,.7), rgba(0, 0, 0,.7)),
          url(${stageUrl(props.stage)});
        background-position: center;
        background-size: cover;
        height: 50px;
        background-color: grey;
        display: flex;
        flex-direction: column;
        align-items: center;
        justify-content: center;
        margin-right: 10px;
        color: ${bgColor};
        box-shadow: 0 0 3px ${bgColor}, 0 0 3px ${bgColor}, 0 0 3px ${bgColor}, 0 0 3px ${bgColor};

        font-weight: 700;
      }
    `}</style>
  </div>
  );
}
