import StartingStages from './stage_types/StartingStages';
import AllStages from './stage_types/AllStages';

function StagesContainer(props) {
  // list all stages
  // IF starters, list single column of starter stages
  // IF counterpicks, list two columns of starter AND counterpick stages
  if (props.displayStartingStages) {
    return <StartingStages stageClicked={props.stageClicked} stages={props.stages.start} />
  }
  return <AllStages stageClicked={props.stageClicked} stages={props.stages.start.concat(props.stages.counterpick)}/>
};

export default StagesContainer;