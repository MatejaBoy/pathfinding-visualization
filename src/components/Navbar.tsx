import { Algorithms } from "./PathFindingVisualizer";

interface NavbarProps {
  setAlg: Function;
  setStartNode: () => void;
  setFinishNode: () => void;
  startSolving: () => void;
  stopSolving: () => void;
  resetSearch: () => void;
}

function Navbar(props: NavbarProps) {
  function clickOnAlgorithm(event: React.MouseEvent<HTMLAnchorElement>) {
    let alg;
    switch (event.currentTarget.id) {
      case "dfsbutton":
        alg = Algorithms.DFS;
        break;
      case "bfsbutton":
        alg = Algorithms.BFS;
        break;
      case "wdbutton":
        alg = Algorithms.WD;
        break;
      case "asbutton":
        alg = Algorithms.AS;
        break;
    }
    props.setAlg(alg);
  }

  return (
    <nav id="navbar" className="navbar fixed-top navbar-expand-lg bg-body-tertiary" data-bs-theme="dark">
      <div className="container-fluid">
        <a className="navbar-brand" href="#">
          Pathfinder
        </a>
        <button
          className="navbar-toggler"
          type="button"
          data-bs-toggle="collapse"
          data-bs-target="#navbarSupportedContent"
          aria-controls="navbarSupportedContent"
          aria-expanded="false"
          aria-label="Toggle navigation"
        >
          <span className="navbar-toggler-icon"></span>
        </button>
        <div className="collapse navbar-collapse" id="navbarSupportedContent">
          <ul className="navbar-nav me-auto mb-2 mb-lg-0">
            <li className="nav-item dropdown">
              <a
                className="nav-link active dropdown-toggle"
                href="#"
                role="button"
                data-bs-toggle="dropdown"
                aria-expanded="false"
              >
                Algorithms
              </a>
              <ul className="dropdown-menu">
                <li>
                  <a id="bfsbutton" onClick={clickOnAlgorithm} className="dropdown-item" href="#">
                    Breadth First search
                  </a>
                </li>
                <li>
                  <hr className="dropdown-divider" />
                </li>
                <li>
                  <a id="dfsbutton" onClick={clickOnAlgorithm} className="dropdown-item" href="#">
                    Depth First search
                  </a>
                </li>
                <li>
                  <hr className="dropdown-divider" />
                </li>
                <li>
                  <a id="wdbutton" onClick={clickOnAlgorithm} className="dropdown-item" href="#">
                    Dijkstra search
                  </a>
                </li>
                <li>
                  <hr className="dropdown-divider" />
                </li>
                <li>
                  <a id="asbutton" onClick={clickOnAlgorithm} className="dropdown-item" href="#">
                    A* search
                  </a>
                </li>
              </ul>
            </li>
            <li className="nav-item">
              <a
                href="#"
                aria-expanded="false"
                role="button"
                className="nav-link active"
                id="startnodebutton"
                key={"startnodebutton"}
                onClick={props.setStartNode}
              >
                Set start node
              </a>
            </li>
            <li className="nav-item">
              <a
                role="button"
                className="nav-link active"
                id="finishnodebutton"
                key={"finishnodebutton"}
                onClick={props.setFinishNode}
              >
                Set finish node
              </a>
            </li>
            <li className="nav-item">
              <a role="button" className="nav-link active" key={"startSolvingButton"} onClick={props.startSolving}>
                Start solving
              </a>
            </li>
            <li className="nav-item">
              <a role="button" className="nav-link active" key={"stopSolvingButton"} onClick={props.stopSolving}>
                Stop solving
              </a>
            </li>
            <li className="nav-item">
              <a role="button" className="nav-link active" key={"resetButton"} onClick={props.resetSearch}>
                Reset search
              </a>
            </li>
          </ul>
        </div>
      </div>
    </nav>
  );
}

export default Navbar;
