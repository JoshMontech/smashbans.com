import Stage from '../Stage';

const AllStages = props => (
  // list all stages
  // IF starters, list single column of starter stages
  // IF counterpicks, list two columns of starter AND counterpick stages
  <React.Fragment>
    <ul>
      {props.stages.map(stage => {
        return <Stage key={stage.title} stageClicked={props.stageClicked} phase={'counterpick'} stage={stage} />
      })}
    </ul>
    <style jsx>{`
      ul {
        height: 100%;
        padding: 0;
        margin: 0;
        display: grid;
        grid-template-columns: 1fr 1fr;
        grid-auto-rows: 1fr;
        column-gap: 1rem;
        row-gap: 1rem;
      }
    `}</style>
  </React.Fragment>
);

export default AllStages;