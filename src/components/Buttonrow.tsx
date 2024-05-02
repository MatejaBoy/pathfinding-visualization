import { renderToStaticMarkup } from "react-dom/server";

interface ButtonRowProps {
  setStartNode: () => void;
  setFinishNode: () => void;
  startSolving: () => void;
  stopSolving: () => void;
  resetSearch: () => void;
}

export default function ButtonRow(props: ButtonRowProps) {
  const dragImage = new Image();
  dragImage.src = "https://live.mdnplay.dev/en-US/docs/Web/HTML/Element/img/clock-demo-200px.png";
  function allowDrop(event: React.DragEvent<HTMLButtonElement>) {
    event.preventDefault();
    //event.dataTransfer.setDragImage(dragImage, 0, 0);
  }

  function onDragStart(event: React.DragEvent<HTMLButtonElement>) {
    //event.dataTransfer.setDragImage(dragImage, 0, 0);
  }

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
        <button onDragOver={allowDrop} className="menubuttons" key={"resetButton"} onClick={props.resetSearch}>
          Reset search
        </button>
        <i onDragStart={onDragStart} draggable="true" className="fa fa-cloud"></i>
      </div>
    </>
  );
}
