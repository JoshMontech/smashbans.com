class CompletionModal extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      displayModal: this.props.displayModal
    };

    this.closeModal = this.closeModal.bind(this);
  }

  componentWillReceiveProps(nextProps) {
    // You don't have to do this check first, but it can help prevent an unneeded render
    if (nextProps.displayModal !== this.state.displayModal) {
      this.setState({ displayModal: nextProps.displayModal });
    }
  }

  closeModal() {
    this.props.closeCallback();
    this.setState({displayModal: false});
  }

  render() {
    const winningPlayer = this.props.score.p1 > this.props.score.p2 ? 'Player 1' : 'Player 2';
    const winningColor = winningPlayer === 'Player 1' ? '#ff1a1c' : '#4c80ff';
    return (
    <React.Fragment>
    <div className="overlay">
      <div className="modal-content">
        <div className="content-container">
          <h3>{this.props.score.p1} - {this.props.score.p2}</h3>
          <p>Congratulations, <span className="winner">{winningPlayer}</span> wins!</p>
        </div>
        <div className="button-container">
          <button onClick={this.closeModal}>New Game</button>
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


      .button-container > button {
        border: none;
        color: white;
        height: 64px;
        width: 100%;
        padding: 15px 32px;
        text-align: center;
        text-decoration: none;
        display: inline-block;
        font-size: 16px;
        background-color: #383838;
        font-weight: 700;
      }

      .winner {
        font-weight: 700;
        color: ${winningColor};
      }

      .cancel {
        border: none;
        text-align: center;
        text-decoration: none;
        position: absolute;
        display: inline-block;
        right: 3%;
        top: 5%;
      }

      .modal-content {
        z-index: 5;
        position: relative;
        display: flex;
        flex-direction: column;
        text-align: center;
        justify-content: center;
        background-color: #202020;
        color: white;
        width: 80%;
        border-radius: 5px;
      }
    `}</style>
    </React.Fragment>
    
    );
  }
}

export default CompletionModal;