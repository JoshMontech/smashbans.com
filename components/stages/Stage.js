class Stage extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      banned: this.props.stage.banned
    }
  }

  componentWillReceiveProps(nextProps) {
    // You don't have to do this check first, but it can help prevent an unneeded render
    if (nextProps.stage.banned !== this.state.banned) {
      this.setState({ banned: nextProps.stage.banned });
    }
  }

  calculateBackgroundColor() {
    if(this.state.banned === '') {
      return 'rgba(255, 255, 255, .7)';
    } else if (this.state.banned === 'Player 1') {
      return 'rgba(255, 26, 28, .8)';
    } else if (this.state.banned === 'Player 2') {
      return 'rgba(76, 128, 255, .8)';
    } else {
      return 'rgba(255, 201, 4, .8)';
    }
  }

  calculateFontColor() {
    if(this.state.banned === '') {
      return '#383838';
    } else if (this.state.banned === 'Player 1') {
      return 'rgba(255, 26, 28,1)';
    } else if (this.state.banned === 'Player 2') {
      return 'rgba(76, 128, 255, 1)';
    } else {
      return 'rgba(255, 201, 4, 1)';
    }
  }

  render() {
    const bgColor = this.calculateBackgroundColor();
    const fColor = this.calculateFontColor();
    return (
      <React.Fragment>
        <li onClick={() => this.props.stageClicked(this.props.stage, this.props.phase)}>{this.props.stage.title}</li>
        <style jsx>{`
        li {
          font-weight: 700;
          background-image: 
            linear-gradient(rgba(0,0,0,.7), rgba(0,0,0,.7)),
            url(${this.props.stage.imgUrl});
          background-position: center;
          background-size: cover;
          text-align: center;
          list-style: none;
          display: flex;
          align-items: center;
          justify-content: center;
          padding: 15px;
          border-radius: 8px;
          border: 3px solid ${fColor};
          color: white;
        }

        

        @media only screen and (max-width: 350px) {
          li { font-size: 11px; }
        }
        `}</style>
      </React.Fragment>
    )
  }
}

export default Stage;