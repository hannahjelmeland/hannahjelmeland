import React, { useRef, useEffect } from 'react';

const colors = [
  '#F5E7C1', // pale sand
  '#D4B483', // muted ochre
  '#A8A68B', // olive gray
  '#C8B3A6', // dusty rose
  '#E6D4C3', // light terra
  '#B7C4A6', // sage
  '#D9A8A8', // soft clay
  '#C1B7D0', // lavender gray
];

export default function App() {
  const canvasRef = useRef(null);
  const mouseRef = useRef({ x: 0, y: 0 });

  useEffect(() => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    let width = (canvas.width = window.innerWidth);
    let height = (canvas.height = window.innerHeight);

    // handle resize
    const handleResize = () => {
      width = canvas.width = window.innerWidth;
      height = canvas.height = window.innerHeight;
    };
    window.addEventListener('resize', handleResize);

    // track mouse
    const handleMouseMove = (e) => {
      mouseRef.current.x = e.clientX;
      mouseRef.current.y = e.clientY;
    };
    window.addEventListener('mousemove', handleMouseMove);

    // draw loop
    let animationId;
    const draw = () => {
      ctx.clearRect(0, 0, width, height);

      const cx = width / 2;
      const cy = height / 2;
      const dx = (mouseRef.current.x - cx) / cx;
      const dy = (mouseRef.current.y - cy) / cy;

      colors.forEach((color, i) => {
        const t = (i + 1) / colors.length;
        // parallax offset scaled by t
        const offsetX = dx * 50 * t;
        const offsetY = dy * 50 * t;
        // decreasing radius
        const radius = Math.min(width, height) * 0.4 * (1 - i / colors.length);

        ctx.beginPath();
        ctx.arc(cx + offsetX, cy + offsetY, radius, 0, Math.PI * 2);
        ctx.fillStyle = color;
        ctx.fill();
      });

      animationId = requestAnimationFrame(draw);
    };

    draw();
    return () => {
      window.removeEventListener('resize', handleResize);
      window.removeEventListener('mousemove', handleMouseMove);
      cancelAnimationFrame(animationId);
    };
  }, []);

  return (
    <div style={{ position: 'relative', width: '100vw', height: '100vh', overflow: 'hidden' }}>
      <canvas
        ref={canvasRef}
        style={{
          display: 'block',
          position: 'absolute',
          top: 0,
          left: 0,
        }}
      />
      <div
        style={{
          position: 'absolute',
          top: '50%',
          left: '50%',
          transform: 'translate(-50%, -50%)',
          textAlign: 'center',
          color: '#333',
          fontFamily: `'Helvetica Neue', Arial, sans-serif`,
          pointerEvents: 'none',
        }}
      >
        <h1 style={{ fontSize: '4rem', margin: 0 }}>Hanna Hjelmeland</h1>
        <p style={{ fontSize: '1.5rem', margin: '0.5rem 0 0' }}>
          Enkle nettsider til greie priser
        </p>
      </div>
    </div>
  );
}
