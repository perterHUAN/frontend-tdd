import React from "react";
import CompassIndicator from "./CompassIndicator";

function FeedBack({ marsRover }) {
  return (
    <section className="flex flex-col gap-4 items-center">
      <h2 className="font-bold text-lg">FeedBack From MarsRover</h2>
      <div className="flex flex-row gap-2">
        {marsRover &&
          Object.entries(marsRover).map((e) => {
            return (
              <div
                key={e[0]}
                data-testid={`feedback-${e[0]}`}
                className=" rounded text-white text-center px-3 py-2"
                style={{
                  backgroundColor: "var(--bg-feedback)",
                }}
              >
                <h3 className="font-semibold mb-3">{e[0]}</h3>
                <p className="font-semibold">{e[1]}</p>
              </div>
            );
          })}
      </div>
      {marsRover && <CompassIndicator orientation={marsRover.orientation} />}
    </section>
  );
}

export default FeedBack;
