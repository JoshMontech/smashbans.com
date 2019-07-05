import Layout from '../components/MyLayout';
import fetch from 'isomorphic-unfetch';
import StageHeader from '../components/StageHeader';
import StagesContainer from '../components/stages/StagesContainer';
import ReportingModal from '../components/ReportingModal';
import CompletionModal from '../components/CompletionModal';
import SimpleSnackbar from '../src/SimpleSnackbar';
import Dashboard from '../components/Dashboard';
import ConfirmationModal from '../components/ConfirmationModal';

const INITIAL_STATE = {
  roundsComplete: 0,
  displaySnackbar: false,
  snackbarMessage: '',
  displayReportingModal: false,
  displayCompletionModal: false,
  displayConfirmationModal: false,
  p1Turn: true,
  currentTurn: 1,
  stageOfRound: '',
  currentPhase: 'start',
  score: []
};

class StageList extends React.Component {
  constructor(props) {
    super(props);
    
    // function binding
    this.closeCompletionModal = this.closeCompletionModal.bind(this);
    this.stageClicked = this.stageClicked.bind(this);
    this.winnerReported = this.winnerReported.bind(this);
    this.cancelClicked = this.cancelClicked.bind(this);
    this.stepHistoryBack = this.stepHistoryBack.bind(this);
    this.backCallback = this.backCallback.bind(this);
    this.resetGameCallback = this.resetGameCallback.bind(this);
    this.selectionCallback = this.selectionCallback.bind(this);

    // initial state
    this.state = {
      stages: this.props.metadata.stages,
      displaySnackbar: INITIAL_STATE.displaySnackbar,
      snackbarMessage: INITIAL_STATE.snackbarMessage,
      roundsComplete: INITIAL_STATE.roundsComplete,
      displayReportingModal: INITIAL_STATE.displayReportingModal,
      displayCompletionModal: INITIAL_STATE.displayCompletionModal,
      displayConfirmationModal: INITIAL_STATE.displayConfirmationModal,
      p1Turn: INITIAL_STATE.p1Turn,
      currentTurn: INITIAL_STATE.currentTurn,
      stageOfRound: INITIAL_STATE.stageOfRound,
      currentPhase: INITIAL_STATE.currentPhase,
      score: INITIAL_STATE.score
    };

    // create new instance of state
    this.history = [JSON.parse(JSON.stringify(this.state))];
    this.revertHistoryFlag = false;
  }

  componentDidUpdate(prevProps, prevState) {
    if (prevState !== this.state && !this.state.displayConfirmationModal && !prevState.displayConfirmationModal && !this.revertHistoryFlag) this.saveStateToHistory(this.state);
  }

  backCallback() {
    this.stepHistoryBack();
  }

  resetGameCallback() {
    // this.resetToInitialState();
    this.displayConfirmationModal();
  }

  selectionCallback(response) {
    this.setState({
      displayConfirmationModal: false
    }, () => {
      if (response) this.resetToInitialState();
    });
  }

  saveStateToHistory(state) {
    console.log('previous history', this.history);
    this.history.push(JSON.parse(JSON.stringify(state)));
    console.log('new history', this.history);
  }

  stepHistoryBack() {
    console.log(this.history);
    
    new Promise((resolve, reject) => {
      const snapshot = this.getLastHistorySnapshot();
      console.log('snapshot', snapshot);
      if (snapshot !== undefined) {
        this.revertHistoryFlag = true;
        resolve(snapshot);
      } 
      else {
        this.resetToInitialState();
        reject('no history to pull from');
      }
    })
    .then(snapshot => {
      this.setState({
        stages: snapshot.stages,
        displaySnackbar: snapshot.displaySnackbar,
        snackbarMessage: snapshot.snackbarMessage,
        roundsComplete: snapshot.roundsComplete,
        displayReportingModal: snapshot.displayReportingModal,
        displayCompletionModal: snapshot.displayCompletionModal,
        displayConfirmationModal: INITIAL_STATE.displayConfirmationModal,
        p1Turn: snapshot.p1Turn,
        currentTurn: snapshot.currentTurn,
        stageOfRound: snapshot.stageOfRound,
        currentPhase: snapshot.currentPhase,
        score: snapshot.score
      }, () => {
        this.revertHistoryFlag = false;
        this.saveStateToHistory(this.state);
      });
    })
    .catch(error => console.error(error));
  }


  getLastHistorySnapshot() {
    // flatten history and take second to last state
    const currentState = this.history.pop();
    const prevState = this.history.pop();
    return prevState;
  }

  resetToInitialState() {
    console.log('resetting to initial state');
    this.setState({
      stages: this.cleanStages(this.props.metadata.stages),
      displaySnackbar: INITIAL_STATE.displaySnackbar,
      snackbarMessage: INITIAL_STATE.snackbarMessage,
      roundsComplete: INITIAL_STATE.roundsComplete,
      displayReportingModal: INITIAL_STATE.displayReportingModal,
      displayCompletionModal: INITIAL_STATE.displayCompletionModal,
      displayConfirmationModal: INITIAL_STATE.displayConfirmationModal,
      p1Turn: INITIAL_STATE.p1Turn,
      currentTurn: INITIAL_STATE.currentTurn,
      stageOfRound: INITIAL_STATE.stageOfRound,
      currentPhase: INITIAL_STATE.currentPhase,
      score: INITIAL_STATE.score
    }, () => this.history = [JSON.parse(JSON.stringify(this.state))]);
  }

  proceedToNextTurn(stage) {
    const { startingBans } = this.props.metadata;
    const { counterpickBans } = this.props.metadata;
    if (stage.banned !== '') return false;
    // console.log(startingBans.length, this.state.currentTurn,this.state.currentTurn <= startingBans.length);
    if (this.state.currentPhase === 'start') {
      return this.state.currentTurn <= startingBans.length;
    } else {
      return this.state.currentTurn <= counterpickBans;
    }
  }

  updateStartingBansState(stages) {
    const { startingBans } = this.props.metadata;
    const newTurn = this.state.currentTurn + 1;
    const phase = this.state.currentPhase;
    const playerIndex = newTurn - 1;
    const playerTurn = startingBans[playerIndex] !== undefined ? startingBans[playerIndex] : !this.state.p1turn;
    if (this.shouldAutoHighlightStage(newTurn, phase)) this.identifyStage(newTurn, playerTurn, stages, phase);
    else {
      this.setState({
        currentTurn: newTurn,
        p1Turn: playerTurn,
        stages: stages
      });
    }
  }

  updateCounterpickBansState(stages) {
    if (this.state.currentTurn === this.props.metadata.counterpickBans) {
      this.setState({
        currentTurn: this.state.currentTurn + 1,
        p1Turn: !(this.state.p1Turn),
        stages: stages
      });
    } else {
      this.setState({
        currentTurn: this.state.currentTurn + 1,
        stages: stages,
      });
    }
  }

  displayReportingModal(stage) {
    console.log('display modal with this stage', stage);
    this.setState({
      displayReportingModal: true,
      stageOfRound: stage.title
    });
  }

  displayConfirmationModal() {
    this.setState({
      displayConfirmationModal: true
    });
  }

  displayCompletionModal() {
    this.setState({displayCompletionModal: true});
  }

  stageClicked(stage) {
    console.log('stage clicked');
    if (this.stageBanned(stage)) return;
    this.handleStageClick(stage);
  }

  stageBanned(stage) {
    return stage.banned !== '' && stage.banned !== 'selected';
  }

  handleStageClick(stage) {
    const phase = this.state.currentPhase;
    console.log('handleStageclick called');
    if (this.shouldBanStage(phase)) {
      this.banStage(stage, phase);
    } else if (this.shouldHighlightStage(stage, phase)) {
      this.highlightStage(stage, phase);
    } else if (this.shouldSelectStage(stage)) {
      this.selectStage(stage);
    } 
  }

  shouldSelectStage(stage) {
    return this.state.stageOfRound !== '' && stage.banned === 'selected';
  }

  selectStage(stage) {
    this.displayReportingModal(stage);
    this.setState({
      displaySnackbar: false,
      snackbarMessage: ''
    });
  }

  shouldBanStage(phase) {
    return phase === 'start' ? 
      this.state.currentTurn <= this.props.metadata.startingBans.length :
      this.state.currentTurn <= this.props.metadata.counterpickBans;
  }

  banStage(stage, phase) {
      let stages = Object.assign({}, this.state.stages);
      let currentPlayer = this.state.p1Turn ? 'Player 1' : 'Player 2';
      const index = stages[phase].findIndex(st => st.title === stage.title);
      // do the things
      stage.banned = currentPlayer;
      stages[phase][index] = stage;
      
      this.updateRoundState(stages, phase);
  }

  updateRoundState(stages, phase) {
    console.log('updating round state...');
    phase === 'start' ?
      this.updateStartingBansState(stages) :
      this.updateCounterpickBansState(stages);
  }

  shouldAutoHighlightStage(turn, phase) {
    return phase === 'start' && turn - 1 === this.props.metadata.startingBans.length;
  }

  identifyStage(turn, playerTurn, stages, phase) {
    console.log('auto highlight called');
    const index = stages[phase].findIndex(s => s.banned === '');
    const stage = stages[phase][index];
    this.autoHighlightStage(turn, playerTurn, stages, stage, phase);
  }

  shouldHighlightStage(stage, phase) {
    return phase === 'counterpick' && this.state.currentTurn > this.props.metadata.counterpickBans
                                   && stage.banned !== 'selected';
  }

  autoHighlightStage(newTurn, playerTurn, stages, stage, phase) {
    // clear any stages that are already highlighted
    stages = this.clearSelectedStages(stages);
    
    // get index of stage
    const index = stages[phase].findIndex(st => st.title === stage.title);

    // update stages with updated stage
    stage.banned = 'selected';
    stages[phase][index] = stage;

    this.setState({
      displaySnackbar: true,
      snackbarMessage: `Tap ${stage.title} to begin game ${this.state.roundsComplete + 1}`,
      stages: stages,
      stageOfRound: stage.title,
      currentTurn: newTurn,
      p1turn: playerTurn
    });
  }

  highlightStage(stage, phase) {
    console.log('highlight called');
      let stages = Object.assign({}, this.state.stages);

      // clear any stages that are already highlighted
      stages = this.clearSelectedStages(stages);
      
      // get index of stage
      const index = stages[phase].findIndex(st => st.title === stage.title);
  
      // update stages with updated stage
      stage.banned = 'selected';
      stages[phase][index] = stage;
  
      this.setState({
        currentTurn: this.state.currentTurn + 1,
        p1Turn: this.state.currentTurn === this.props.metadata.counterpickBans ? 1(this.state.p1turn) : this.state.p1turn,
        displaySnackbar: true,
        snackbarMessage: `Tap ${stage.title} to begin game ${this.state.roundsComplete + 1}`,
        stages: stages,
        stageOfRound: stage.title
      });
  }

  clearSelectedStages(stages) {
    for(let stageType in stages) {
      stages[stageType].forEach(stage => {
        if (stage.banned === 'selected') stage.banned = '';
      });
    }

    return stages;
  }

  cleanStages(stages) {
    for (let stageType in stages) {
      stages[stageType].forEach(stage => stage.banned = '');
    }

    return JSON.parse(JSON.stringify(stages));
  }

  proceedToSelectCounterpickStage() {
    return this.props.metadata.counterpickBans < this.state.currentTurn &&
           this.state.currentPhase === 'counterpick';
  }

  winnerReported(winner) {   
    // clear stages
    let stages = Object.assign({}, this.state.stages);
    for (let stageGroup in stages) {
      stages[stageGroup].forEach(stage => {
        stage.banned = '';
      });
    }

    if (!this.isSetComplete()) {
      // get dsr stages for loser
      const scores = this.state.score;
      const dsrStages = [];
      const counterpicker = winner === 'Player 1' ? 'Player 2' : 'Player 1';

      scores.forEach(gameScore => {
        if (gameScore.winner === counterpicker) dsrStages.push(gameScore.stage);
      });

        // apply those to counterpick stagelist
      for (let stageGroup in stages) {
        [...stages[stageGroup]].forEach(stage => {
          if (dsrStages.includes(stage.title)) stage.banned = counterpicker;
        });
      }
    }

    this.setState(state => ({
      stages: stages,
      stageOfRound: '',
      currentTurn: 1,
      p1Turn: winner === 'Player 1',
      score: [...state.score, {winner: winner, stage: state.stageOfRound}],
      roundsComplete: state.roundsComplete + 1,
      currentPhase: 'counterpick',
      displayReportingModal: false
    }),
      () => this.afterWinnerReported(winner)
    );
  }

  afterWinnerReported(winner) {
    // this.clearRoundStates();
    if (this.isSetComplete()) {
      this.displayCompletionModal();
    } 
    // else this.applyDSRBans(winner);
  }

  applyDSRBans(winner) {
    // get dsr stages for loser
    const scores = this.state.score;
    const stages = Object.assign({}, this.state.stages);
    const dsrStages = [];
    const counterpicker = winner === 'Player 1' ? 'Player 2' : 'Player 1';

    scores.forEach(gameScore => {
      if (gameScore.winner === counterpicker) dsrStages.push(gameScore.stage);
    });

      // apply those to counterpick stagelist
    for (let stageGroup in stages) {
      [...stages[stageGroup]].forEach(stage => {
        if (dsrStages.includes(stage.title)) stage.banned = counterpicker;
      });
    }

    this.setState({
      stages: stages,
      continuingToNextRound: false
    });
  }

  isSetComplete() {
    let {p1, p2}  = this.calculateScore(); 
    console.log(p1, p2);
    if (p1 === this.props.metadata.firstTo) {
      console.log('PLAYER 1 WINS!!!');
      // TODO: display modal
      return true;
    } else if (p2 === this.props.metadata.firstTo) {
      // TODO: display modal
      console.log('PLAYER 2 WINS!!!');
      return true;
    }
    return false;
  }

  calculateScore() {
    let p1Score = 0;
    let p2Score = 0;
    this.state.score.forEach(game => {
      game.winner === 'Player 1' ? p1Score++ : p2Score++;
    });

    return {p1: p1Score, p2: p2Score};
  }

  cancelClicked() {
    console.log('cancelClicked');
    this.stepHistoryBack();
  }

  closeCompletionModal() {
    this.setState({displayCompletionModal: false});
    this.resetToInitialState();
  }

  isBanPhase() {
    let banLength = 0;
    banLength = this.state.currentPhase === 'start' ? 
      this.props.metadata.startingBans.length : 
      this.props.metadata.counterpickBans;
    return this.state.currentTurn <= banLength;
  }

  clearRoundStates() {
    let stages = Object.assign({}, this.state.stages);
    for (let stageGroup in stages) {
      stages[stageGroup].forEach(stage => {
        stage.banned = '';
      });
    }
    
    this.setState({
      continuingToNextRound: true,
      stages: stages,
      stageOfRound: '',
      currentTurn: 1      
    });
  }

  render() {
    const selectionPhase = this.isBanPhase() ? 'Ban' : 'Stage';
    const playerColor = this.state.p1Turn ? '#ff1a1c' : '#4c80ff';
    return (
      <div className="container">
      <ReportingModal displayModal={this.state.displayReportingModal} 
                      cancelCallback={this.cancelClicked} 
                      winnerCallback={this.winnerReported}
                      stageOfRound={this.state.stageOfRound}
                      score={this.calculateScore()}
                      game={this.state.roundsComplete + 1} />
      <ConfirmationModal displayModal={this.state.displayConfirmationModal}
                         selectionCallback={this.selectionCallback} />
      <CompletionModal displayModal={this.state.displayCompletionModal}
                       score={this.calculateScore()}
                       closeCallback={this.closeCompletionModal}  />
      <SimpleSnackbar open={this.state.displaySnackbar} 
                      message={this.state.snackbarMessage} />
        {/* <header backButtonCallback={this.onBackButtonClick} /> */}
        <StageHeader resetGameCallback={this.resetGameCallback} backCallback={this.backCallback} title={this.props.metadata.name} />
        <Dashboard scores={this.state.score} p1Turn={this.state.p1Turn} phase={selectionPhase} />
        <div className="inner-container">
          <div className="bottom-items">
            <StagesContainer stages={this.state.stages} 
                          stageClicked={this.stageClicked}
                          displayStartingStages={this.state.currentPhase === 'start'} />
          </div>
        </div>
        <div className="bottom-space">
        </div>


      <style jsx>{`
        .container {
          height: 100%;
          position: absolute;
          top: 0; bottom: 0; left: 0; right: 0;
          overflow: hidden;
          background-color: #121212;
        }

        .inner-container {
          height: 68%;
          display: flex;
          flex-direction: column;
          padding: 20px;
        }

        h3 {
          margin-top: 0;
        }

        .bottom-items {
          height: 100%;
        }

        .bottom-space {
          height: 15%;
          width: 100%;
        }

        .player {
          color: ${playerColor};
        }

      `}</style>
      </div>
    );
  }
}

StageList.getInitialProps = async function(context) {
  const { id } = context.query;
  // const res = await fetch(`https://api.tvmaze.com/shows/${id}`);
  // const show = await res.json();

  const metadata = await import(`../mockapi/${id}.json`);

  // console.log(`Fetched show: ${show.name}`);
  console.log(`Fetched mock: ${metadata.id}`);

  return { metadata };
};

export default StageList;