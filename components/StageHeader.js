export default function StageHeader(props) {

  return (
    <div className="header">
    <button className="revert" onClick={props.backCallback}>
      <svg xmlns="http://www.w3.org/2000/svg" width="40" height="40" viewBox="0 0 24 24"><path d="M12.5 8c-2.65 0-5.05.99-6.9 2.6L2 7v9h9l-3.62-3.62c1.39-1.16 3.16-1.88 5.12-1.88 3.54 0 6.55 2.31 7.6 5.5l2.37-.78C21.08 11.03 17.15 8 12.5 8z"/></svg>
    </button>
    <h2>{props.title}</h2>
    <button className="reset" onClick={props.resetGameCallback}>
      <svg xmlns="http://www.w3.org/2000/svg" width="40" height="40" viewBox="0 0 24 24"><path d="M12 6v3l4-4-4-4v3c-4.42 0-8 3.58-8 8 0 1.57.46 3.03 1.24 4.26L6.7 14.8c-.45-.83-.7-1.79-.7-2.8 0-3.31 2.69-6 6-6zm6.76 1.74L17.3 9.2c.44.84.7 1.79.7 2.8 0 3.31-2.69 6-6 6v-3l-4 4 4 4v-3c4.42 0 8-3.58 8-8 0-1.57-.46-3.03-1.24-4.26z"/></svg>
    </button>
    <style jsx>{`
      .header {
        width: 100%;
        height: 10%;
        background-color: #202020;
        margin-bottom: 20px;
        color: white;
        display: flex;
        align-items: center;
        justify-content: space-between;
      }

      p {
        margin: 0;
      }

      h1 {
        justify-self: center;
      }

      .revert {
        height: 100%;
        fill: white;
        width: 15%;
        border: none;
        outline: none;
        background-color: initial;
      }

      .revert:active {
        outline: none;
        fill: grey;
        // background-color: maroon;
      }

      .reset {
        height: 100%;
        fill: white;
        width: 15%;
        border: none;
        outline: none;
        background-color: initial;
      }

      .reset:active {
        outline: none;
        fill: grey;
        // background-color: maroon;
      }

    `}</style>
  </div>
  );
}
