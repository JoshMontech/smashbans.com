import Stage from '../Stage';

const StartingStages = props => (
  // list all stages
  // IF starters, list single column of starter stages
  // IF counterpicks, list two columns of starter AND counterpick stages
  <ul>
    {props.stages.map(stage => {
      return <Stage key={stage.title} stageClicked={props.stageClicked} phase={'start'} stage={stage} />
    })}
    
    <style jsx>{`
      ul {
        height: 100%;
        padding: 0;
        margin: 0;
        display: grid;
        grid-auto-rows: 1fr;
        row-gap: 1rem;
      }
    `}</style>
  </ul>
);

export default StartingStages;