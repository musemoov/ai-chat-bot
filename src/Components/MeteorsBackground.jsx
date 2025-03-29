import React from "react";
import { motion } from "framer-motion";

const MeteorsBackground = ({ number = 30 }) => {
  const meteors = new Array(number).fill(true);
  return (
    <motion.div
      className="fixed top-0 left-0 w-full h-full z-0 pointer-events-none overflow-hidden"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
    >
      {meteors.map((_, idx) => {
        const delay = Math.random() * 5;
        const duration = Math.random() * 5 + 5;
        const left = Math.random() * 100;
        const key = `meteor-${idx}-${Math.random()}`;

        return (
          <span
            key={key}
            className="absolute h-[1px] w-[50px] bg-gradient-to-l from-white to-transparent animate-meteor-effect"
            style={{
              top: "-40px",
              left: `${left}%`,
              animationDelay: `${delay}s`,
              animationDuration: `${duration}s`,
              transform: "rotate(45deg)",
            }}
          />
        );
      })}
    </motion.div>
  );
};

export default MeteorsBackground;
