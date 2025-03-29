import React from "react";

const TwinklingStars = ({ number = 100 }) => {
  const stars = new Array(number).fill(true);

  return (
    <div className="fixed top-0 left-0 w-full h-full z-0 overflow-hidden pointer-events-none">
      {stars.map((_, idx) => {
        const size = Math.random() * 2 + 0.5; // 0.5px ~ 2.5px
        const top = Math.random() * 100;
        const left = Math.random() * 100;
        const duration = Math.random() * 3 + 2; // 2s ~ 5s
        const opacity = Math.random() * 0.5 + 0.3; // 0.3 ~ 0.8

        return (
          <span
            key={`star-${idx}`}
            className="absolute rounded-full bg-white"
            style={{
              top: `${top}%`,
              left: `${left}%`,
              width: `${size}px`,
              height: `${size}px`,
              opacity: opacity,
              filter: "blur(1px)",
              animation: `twinkle ${duration}s ease-in-out infinite`,
            }}
          />
        );
      })}
    </div>
  );
};

export default TwinklingStars;
