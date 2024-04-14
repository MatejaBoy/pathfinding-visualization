interface ButtonRowProps {
  setStartNode: () => void;
  setFinishNode: () => void;
  startSolving: () => void;
  stopSolving: () => void;
  resetSearch: () => void;
}

export default function ButtonRow(props: ButtonRowProps) {
  return (
    <>
      <div className="buttonrow">
        <button className="menubuttons" id="startnodebutton" key={"startnodebutton"} onClick={props.setStartNode}>
          Set start node
        </button>
        <button className="menubuttons" id="finishnodebutton" key={"finishnodebutton"} onClick={props.setFinishNode}>
          Set finish node
        </button>
        <button className="menubuttons" key={"startSolvingButton"} onClick={props.startSolving}>
          Start solving
        </button>
        <button className="menubuttons" key={"stopSolvingButton"} onClick={props.stopSolving}>
          Stop solving
        </button>
        <button className="menubuttons" key={"resetButton"} onClick={props.resetSearch}>
          Reset search
        </button>
      </div>
    </>
  );
}
