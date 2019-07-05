class ReportingModal extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      displayModal: this.props.displayModal
    };

    this.closeModal = this.closeModal.bind(this);
    this.selectWinner = this.selectWinner.bind(this);
  }

  componentWillReceiveProps(nextProps) {
    // You don't have to do this check first, but it can help prevent an unneeded render
    if (nextProps.displayModal !== this.state.displayModal) {
      this.setState({ displayModal: nextProps.displayModal });
    }
  }

  closeModal() {
    this.props.cancelCallback();
    this.setState({displayModal: false});
  }

  selectWinner(player) {
    this.props.winnerCallback(player);
    this.setState({displayModal: false});
  }

  render() {
    return (
    <React.Fragment>
    <div className="overlay">
      <div className="modal-content">
        <div className="content-container">
          <button onClick={this.closeModal} className="cancel">X</button>
          <h3>{this.props.score['p1']} - {this.props.score['p2']}</h3> 
          <h3>Game {this.props.game} - {this.props.stageOfRound}</h3>
          <p>Who Won?</p>
        </div>
        <div className="button-container">
          <button onClick={() => this.selectWinner('Player 1')}>Player 1</button>
          <button onClick={() => this.selectWinner('Player 2')}>Player 2</button>
        </div>
      </div>
    </div>
    <style jsx>{`
      .overlay {
        display: ${this.state.displayModal ? 'flex' : 'none'};
        justify-content:center;
        align-items: center;
        position: fixed;
        z-index: 1;
        left: 0;
        top: 0;
        width: 100%;
        height: 100%;
        overflow: auto;
        background-color: rgba(0,0,0,0.8);
      }

      .content-container {
        padding: 1rem;
      }

      h3, p {
        margin: 0;
      }

      .content-container > * {
        margin-bottom: 1rem;
      }

      .content-container > *:last-child {
        margin-bottom: 0;
      }

      .button-container > button:first-child {
        color: #ff1a1c;
      }

      .button-container > button:last-child {
        color: #4c80ff;
      }

      .button-container > button {
        border: none;
        color: white;
        height: 100px;
        padding: 15px 32px;
        text-align: center;
        text-decoration: none;
        display: inline-block;
        font-size: 16px;
        width: 50%;
        background-color: #383838;
        font-weight: 700;
      }

      .cancel {
        border: none;
        text-align: center;
        text-decoration: none;
        position: absolute;
        display: inline-block;
        right: 3%;
        top: 5%;
        background-color: #383838;
        color: white;
      }

      .modal-content {
        color: white;
        z-index: 5;
        position: relative;
        display: flex;
        flex-direction: column;
        text-align: center;
        justify-content: center;
        background-color: #202020;
        width: 80%;
        border-radius: 5px;
      }
    `}</style>
    </React.Fragment>
    
    );
  }
}

export default ReportingModal;