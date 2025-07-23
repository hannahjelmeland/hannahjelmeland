// App.jsx
import React, { useRef, useEffect } from 'react';
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Link,
  useLocation,
} from 'react-router-dom';

// richer earth-tones
const colors = [
  '#D7CCC8', // pastel brown
  '#BCAAA4', // warm grey
  '#A1887F', // brown
  '#8D6E63', // darker brown
  '#E0AC69', // ochre
  '#C39E70', // tan
  '#A5D6A7', // sage
  '#81C784', // light green
];

// link color = outermost ring
const linkColor = colors[0];

/**
 * CanvasBackground draws concentric, mouse‐responsive circles.
 * On route change it drifts the whole pattern to different corners.
 */
function CanvasBackground() {
  const canvasRef = useRef(null);
  const mouse = useRef({ x: 0, y: 0 });
  const translate = useRef({ x: 0, y: 0 });
  const target = useRef({ x: 0, y: 0 });
  const loc = useLocation();

  // update drift target whenever the path changes
  useEffect(() => {
    const w = window.innerWidth;
    const h = window.innerHeight;
    const mapping = {
      '/': { x: 0, y: 0 },
      '/om': { x: -w * 0.3, y: -h * 0.3 },
      '/tidligere-prosjekter': { x:  w * 0.3, y: -h * 0.3 },
      '/priser': { x: -w * 0.3, y:  h * 0.3 },
    };
    target.current = mapping[loc.pathname] || { x: 0, y: 0 };
  }, [loc.pathname]);

  useEffect(() => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    let W = (canvas.width = window.innerWidth);
    let H = (canvas.height = window.innerHeight);

    const handleResize = () => {
      W = canvas.width = window.innerWidth;
      H = canvas.height = window.innerHeight;
    };
    window.addEventListener('resize', handleResize);

    const handleMouse = (e) => {
      mouse.current.x = e.clientX;
      mouse.current.y = e.clientY;
    };
    window.addEventListener('mousemove', handleMouse);

    let animId;
    const draw = () => {
      // ease translate toward target
      translate.current.x += (target.current.x - translate.current.x) * 0.05;
      translate.current.y += (target.current.y - translate.current.y) * 0.05;

      ctx.clearRect(0, 0, W, H);
      const cx = W / 2 + translate.current.x;
      const cy = H / 2 + translate.current.y;
      const dx = (mouse.current.x - W / 2) / (W / 2);
      const dy = (mouse.current.y - H / 2) / (H / 2);

      colors.forEach((col, i) => {
        const t = (i + 1) / colors.length;
        const offsetX = dx * 50 * t;
        const offsetY = dy * 50 * t;
        const radius = Math.min(W, H) * 0.4 * (1 - i / colors.length);

        ctx.beginPath();
        ctx.arc(cx + offsetX, cy + offsetY, radius, 0, Math.PI * 2);
        ctx.fillStyle = col;
        ctx.fill();
      });

      animId = requestAnimationFrame(draw);
    };
    draw();

    return () => {
      cancelAnimationFrame(animId);
      window.removeEventListener('resize', handleResize);
      window.removeEventListener('mousemove', handleMouse);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        width: '100vw',
        height: '100vh',
        zIndex: -1,
      }}
    />
  );
}

/**
 * Panel wraps non-Home pages, fading and sliding them in
 * inside a semi-transparent white box.
 */
function Panel({ children }) {
  const ref = useRef();
  useEffect(() => {
    const el = ref.current;
    el.style.opacity = 0;
    el.style.transform = 'translateY(20px)';
    requestAnimationFrame(() => {
      el.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
      el.style.opacity = 1;
      el.style.transform = 'translateY(0)';
    });
  }, [children]);
  return (
    <div
      ref={ref}
      style={{
        backgroundColor: 'rgba(255,255,255,0.75)',
        padding: '2rem',
        borderRadius: '8px',
        maxWidth: '80vw',
        textAlign: 'center',
        lineHeight: 1.5,
      }}
    >
      {children}
    </div>
  );
}

const navStyle = {
  position: 'fixed',
  top: '20px',
  right: '2rem',
  display: 'flex',
  flexDirection: 'column',
  gap: '0.75rem',
  zIndex: 10,
};

const linkStyle = {
  color: linkColor,
  textDecoration: 'none',
  fontSize: '1.1rem',
  fontFamily: `'Helvetica Neue', Arial, sans-serif`,
};

function Home() {
  return (
    <div
      style={{
        position: 'absolute',
        top: '50%',
        left: '50%',
        transform: 'translate(-50%, -50%)',
        textAlign: 'center',
        color: '#333',
        fontFamily: `'Helvetica Neue', Arial, sans-serif`,
      }}
    >
      <h1 style={{ fontSize: '4rem', margin: 0 }}>Hanna Hjelmeland</h1>
      <p style={{ fontSize: '1.5rem', margin: '0.5rem 0 0' }}>
        Enkle nettsider
      </p>
    </div>
  );
}

function Om() {
  return (
    <Panel>
      <h2>Om</h2>
      <p>
        Hei! Jeg heter Hanna Hjelmeland. Jeg designer og utvikler enkle,
        brukervennlige nettsider med fokus på god pris og rask levering.
      </p>
    </Panel>
  );
}

function Tidligere() {
  return (
    <Panel>
      <h2>Tidligere prosjekter</h2>
      <ul style={{ textAlign: 'left', display: 'inline-block' }}>
        <li>
          <strong>Prosjekt Alpha:</strong> Nettside for lokal kafé.
        </li>
        <li>
          <strong>Prosjekt Beta:</strong> Portfolio for fotograf.
        </li>
        <li>
          <strong>Prosjekt Gamma:</strong> Enkel nettbutikk for kunst.
        </li>
      </ul>
    </Panel>
  );
}

function Priser() {
  return (
    <Panel>
      <h2>Priser</h2>
      <p>
        Pakker fra 5 000 kr for statiske sider. Kontakt for e-handel, CMS eller
        vedlikehold.
      </p>
    </Panel>
  );
}

export default function App() {
  return (
    <Router>
      <CanvasBackground />

      <nav style={navStyle}>
        <Link to="/" style={linkStyle}>Hjem</Link>
        <Link to="/om" style={linkStyle}>Om</Link>
        <Link to="/tidligere-prosjekter" style={linkStyle}>
          Tidligere prosjekter
        </Link>
        <Link to="/priser" style={linkStyle}>Priser</Link>
      </nav>

      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/om" element={<Om />} />
        <Route path="/tidligere-prosjekter" element={<Tidligere />} />
        <Route path="/priser" element={<Priser />} />
      </Routes>
    </Router>
  );
}
