import style from "./CompassIndicator.module.css";

const directions = ["top", "right", "bottom", "left"];
const orientations = ["N", "E", "S", "W"];
function orientationToDirection(orientation) {
  return directions[orientations.findIndex((o) => o === orientation)];
}
function CompassIndicator({ orientation }) {
  const lightDirection = orientationToDirection(orientation);
  return (
    <div
      className={`${style.compassIndicator}`}
      data-testid="compass-indicator"
    >
      {directions.map((d) => {
        return (
          <div
            className={`${style.arrow} ${style[d]} ${
              lightDirection === d ? style.light : ""
            }`}
          >
            <div className={`${style.arrowTop}`}></div>
            <div className={`${style.arrowBottom}`}></div>
          </div>
        );
      })}
    </div>
  );
  return (
    <div className={`${style.compassIndicator}`}>
      <div className={`${style.arrow} ${style.top}`}>
        <div className={`${style.arrowTop}`}></div>
        <div className={`${style.arrowBottom}`}></div>
      </div>
      <div className={`${style.arrow} ${style.right}`}>
        <div className={`${style.arrowTop}`}></div>
        <div className={`${style.arrowBottom}`}></div>
      </div>
      <div className={`${style.arrow} ${style.bottom}`}>
        <div className={`${style.arrowTop}`}></div>
        <div className={`${style.arrowBottom}`}></div>
      </div>
      <div className={`${style.arrow} ${style.left} ${style.light}`}>
        <div className={`${style.arrowTop}`}></div>
        <div className={`${style.arrowBottom}`}></div>
      </div>
    </div>
  );
}

export default CompassIndicator;
