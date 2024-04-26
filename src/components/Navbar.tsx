import { useEffect, useState } from "react";
import { Algorithms, ResetType } from "./PathFindingVisualizer";

interface NavbarProps {
  setAlg: Function;
  startSolving: () => void;
  stopSolving: () => void;
  resetSearch: (type: ResetType) => void;
  setIsVisualizing: (isVis: boolean) => void;
  isVisualizing: boolean;
}

function Navbar(props: NavbarProps) {
  const [isVisualizing, setIsVisualizing] = useState(props.isVisualizing);

  useEffect(() => {
    console.log("useffe");
    setIsVisualizing(props.isVisualizing);
  }, [props.isVisualizing]);

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

  function handleVisualizeBtn() {
    if (isVisualizing) {
      props.setIsVisualizing(false);
    } else {
      props.setIsVisualizing(true);
    }
  }

  return (
    <nav id="navbar" className="navbar center fixed-top navbar-expand-sm bg-body-tertiary" data-bs-theme="dark">
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
          <ul className="navbar-nav justify-content-center me-auto mb-2 mb-lg-0 ">
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
              <a role="button" className="nav-link active" key={"resetButton"}>
                Information
              </a>
            </li>
            <li className="nav-item">
              <button
                role="button"
                className={"nav-link active visbtn " + props.isVisualizing}
                key={"resetButton"}
                onClick={handleVisualizeBtn}
              >
                Let's visualize
              </button>
            </li>
            <li className="nav-item">
              <a
                role="button"
                className="nav-link active"
                key={"resetButton"}
                onClick={() => {
                  props.resetSearch(ResetType.cleargrid);
                }}
              >
                Clear Grid
              </a>
            </li>
            <li className="nav-item">
              <a
                role="button"
                className="nav-link active"
                key={"resetButton"}
                onClick={() => {
                  props.resetSearch(ResetType.clearsolution);
                }}
              >
                Clear solution
              </a>
            </li>
            <li className="nav-item">
              <a
                role="button"
                className="nav-link active"
                key={"resetButton"}
                onClick={() => {
                  props.resetSearch(ResetType.resetgrid);
                }}
              >
                Reset grid
              </a>
            </li>
          </ul>
        </div>
      </div>
    </nav>
  );
}

export default Navbar;
