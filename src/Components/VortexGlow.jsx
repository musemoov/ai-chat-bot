import React, { useEffect, useRef } from "react";
import { createNoise3D } from "simplex-noise";
import { motion } from "framer-motion";

const VortexGlow = ({ onStartChat }) => {
  const canvasRef = useRef(null);
  const particleCount = 700;
  const particlePropCount = 9;
  const particlePropsLength = particleCount * particlePropCount;
  const rangeY = 200;
  const baseTTL = 300;
  const rangeTTL = 400;
  const baseSpeed = 0.005;
  const rangeSpeed = 0.2;
  const baseRadius = 1;
  const rangeRadius = 2;
  const baseHue = 220;
  const rangeHue = 100;
  const noiseSteps = 6;
  const xOff = 0.00125;
  const yOff = 0.00125;
  const zOff = 0.0005;
  const backgroundColor = "#000000";

  const tick = useRef(0);
  const noise3D = createNoise3D();
  const particleProps = useRef(new Float32Array(particlePropsLength));
  const center = useRef([0, 0]);

  const TAU = 2 * Math.PI;
  const rand = (n) => n * Math.random();
  const randRange = (n) => n - rand(2 * n);
  const fadeInOut = (t, m) => {
    let hm = 0.5 * m;
    return Math.abs(((t + hm) % m) - hm) / hm;
  };
  const lerp = (n1, n2, speed) => (1 - speed) * n1 + speed * n2;

  const initParticles = () => {
    for (let i = 0; i < particlePropsLength; i += particlePropCount) {
      const x = rand(window.innerWidth);
      const y = center.current[1] + randRange(rangeY);
      const vx = 0;
      const vy = 0;
      const life = 0;
      const ttl = baseTTL + rand(rangeTTL);
      const speed = baseSpeed + rand(rangeSpeed);
      const radius = baseRadius + rand(rangeRadius);
      const hue = baseHue + rand(rangeHue);
      particleProps.current.set(
        [x, y, vx, vy, life, ttl, speed, radius, hue],
        i
      );
    }
  };

  const drawParticle = (ctx, x, y, x2, y2, life, ttl, radius, hue) => {
    ctx.save();
    ctx.lineCap = "round";
    ctx.lineWidth = radius;
    ctx.strokeStyle = `hsla(${hue},100%,60%,${fadeInOut(life, ttl)})`;
    ctx.beginPath();
    ctx.moveTo(x, y);
    ctx.lineTo(x2, y2);
    ctx.stroke();
    ctx.closePath();
    ctx.restore();
  };

  const resize = (canvas) => {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
    center.current[0] = 0.5 * canvas.width;
    center.current[1] = 0.5 * canvas.height;
  };

  const renderGlow = (canvas, ctx) => {
    ctx.save();
    ctx.filter = "blur(8px) brightness(200%)";
    ctx.globalCompositeOperation = "lighter";
    ctx.drawImage(canvas, 0, 0);
    ctx.restore();

    ctx.save();
    ctx.filter = "blur(4px) brightness(200%)";
    ctx.globalCompositeOperation = "lighter";
    ctx.drawImage(canvas, 0, 0);
    ctx.restore();
  };

  const animate = () => {
    const canvas = canvasRef.current;
    if (!canvas) return; // canvasRef.current가 null인 경우 함수 종료
    const ctx = canvas.getContext("2d");
    tick.current++;
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.fillStyle = backgroundColor;
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    for (let i = 0; i < particlePropsLength; i += particlePropCount) {
      let x = particleProps.current[i];
      let y = particleProps.current[i + 1];
      let vx = particleProps.current[i + 2];
      let vy = particleProps.current[i + 3];
      let life = particleProps.current[i + 4];
      let ttl = particleProps.current[i + 5];
      const speed = particleProps.current[i + 6];
      const radius = particleProps.current[i + 7];
      const hue = particleProps.current[i + 8];

      const angle =
        noise3D(x * xOff, y * yOff, tick.current * zOff) * noiseSteps * TAU;

      // 소용돌이 회전 효과를 위해 중심으로부터의 방향 보정
      const dx = x - center.current[0];
      const dy = y - center.current[1];
      const dist = Math.sqrt(dx * dx + dy * dy);

      // 회전 방향과 속도를 조합
      const swirlStrength = 0.002; // 커질수록 더 세게 회전
      const swirlAngle = Math.atan2(dy, dx) + swirlStrength * dist;

      vx = lerp(vx, Math.cos(angle + swirlAngle), 0.05);
      vy = lerp(vy, Math.sin(angle + swirlAngle), 0.05);

      const x2 = x + vx * speed;
      const y2 = y + vy * speed;

      drawParticle(ctx, x, y, x2, y2, life, ttl, radius, hue);

      life++;
      if (
        x2 > canvas.width ||
        x2 < 0 ||
        y2 > canvas.height ||
        y2 < 0 ||
        life > ttl
      ) {
        const newX = rand(canvas.width);
        const newY = center.current[1] + randRange(rangeY);
        particleProps.current.set(
          [
            newX,
            newY,
            0,
            0,
            0,
            baseTTL + rand(rangeTTL),
            baseSpeed + rand(rangeSpeed),
            baseRadius + rand(rangeRadius),
            baseHue + rand(rangeHue),
          ],
          i
        );
      } else {
        particleProps.current.set(
          [x2, y2, vx, vy, life, ttl, speed, radius, hue],
          i
        );
      }
    }

    renderGlow(canvas, ctx);

    ctx.save();
    ctx.globalCompositeOperation = "lighter";
    ctx.drawImage(canvas, 0, 0);
    ctx.restore();

    requestAnimationFrame(animate);
  };

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    resize(canvas);
    initParticles();
    animate();

    window.addEventListener("resize", () => resize(canvas));
    return () => window.removeEventListener("resize", () => resize(canvas));
  }, []);

  return (
    <div className="relative w-full h-screen">
      <canvas
        ref={canvasRef}
        className="absolute top-0 left-0 w-full h-full z-0"
      />
      <div className="absolute inset-0 flex items-center justify-center text-center">
        <motion.div
          
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 4, ease: "easeOut" }}
        >
          <h1 className="text-white text-5xl sm:text-6xl md:text-7xl lg:text-9xl font-bold mb-8">
            Chat with AI
          </h1>
          <p className="text-white text-lg sm:text-xl md:text-2xl lg:text-3xl mb-20 mt-18">
            Ask anything — get fast, smart answers
            <br />
            to help you learn, create, and discover more.
          </p>
          <button
            onClick={onStartChat}
            className="px-12 py-6 text-[2rem] text-white/100 bg-white/10 opacity-70 backdrop-blur-md border border-white/70 shadow-[0_4px_30px_rgba(0,0,0,0.1)] [border-radius:35px] hover:bg-white/90 hover:text-black hover:text-extrabold hover:opacity-70 transition mt-[-1rem]"
          >
            Start Chatting
          </button>
        </motion.div>
      </div>
     </div>
  );
};

export default VortexGlow;
