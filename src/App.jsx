// App.jsx
import React, { useRef, useEffect } from 'react';
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Link,
  useLocation
} from 'react-router-dom';

// more “earth” tones
const colors = [
  '#D7CCC8', // pastel brown
  '#BCAAA4', // warm grey
  '#A1887F', // brown
  '#8D6E63', // darker brown
  '#E0AC69', // ochre
  '#C39E70', // tan
  '#A5D6A7', // sage
  '#81C784'  // light green
];

// outer-ring color for the links
const linkColor = colors[0];

function CanvasBackground() {
  const canvasRef = useRef(null);
  const mouseRef = useRef({ x: 0, y: 0 });
  const offsetRef = useRef(0);
  const location = useLocation();

  // map each route to a rotation offset
  useEffect(() => {
    const mapping = {
      '/': 0,
      '/om': Math.PI / 4,
      '/tidligere-prosjekter': Math.PI / 2,
      '/priser': (3 * Math.PI) / 4
    };
    offsetRef.current = mapping[location.pathname] ?? 0;
  }, [location]);

  useEffect(() => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    let width = (canvas.width = window.innerWidth);
    let height = (canvas.height = window.innerHeight);

    // resize handler
    const handleResize = () => {
      width = canvas.width = window.innerWidth;
      height = canvas.height = window.innerHeight;
    };
    window.addEventListener('resize', handleResize);

    // mouse tracking
    const handleMouseMove = (e) => {
      mouseRef.current.x = e.clientX;
      mouseRef.current.y = e.clientY;
    };
    window.addEventListener('mousemove', handleMouseMove);

    let animationId;
    const draw = () => {
      ctx.clearRect(0, 0, width, height);

      const cx = width / 2;
      const cy = height / 2;
      const dx = (mouseRef.current.x - cx) / cx;
      const dy = (mouseRef.current.y - cy) / cy;

      // get current route's rotation
      const angle = offsetRef.current;
      const sin = Math.sin(angle);
      const cos = Math.cos(angle);

      colors.forEach((color, i) => {
        const t = (i + 1) / colors.length;
        // rotated parallax direction
        const rdx = dx * cos - dy * sin;
        const rdy = dx * sin + dy * cos;
        const offsetX = rdx * 50 * t;
        const offsetY = rdy * 50 * t;
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
    <canvas
      ref={canvasRef}
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        width: '100vw',
        height: '100vh',
        zIndex: -1
      }}
    />
  );
}

const navStyle = {
  position: 'fixed',
  top: '50%',
  right: '20px',
  transform: 'translateY(-50%)',
  display: 'flex',
  flexDirection: 'column',
  gap: '1rem'
};

const linkStyle = {
  color: linkColor,
  textDecoration: 'none',
  fontSize: '1.25rem',
  fontFamily: `'Helvetica Neue', Arial, sans-serif`
};

const pageContainer = {
  position: 'absolute',
  top: '50%',
  left: '50%',
  transform: 'translate(-50%, -50%)',
  color: '#333',
  fontFamily: `'Helvetica Neue', Arial, sans-serif`,
  maxWidth: '80vw',
  textAlign: 'center',
  lineHeight: 1.5
};

function Home() {
  return (
    <div style={pageContainer}>
      <h1 style={{ fontSize: '4rem', margin: 0 }}>
        <Link to="/" style={{ color: '#333', textDecoration: 'none' }}>
          Hanna Hjelmeland
        </Link>
      </h1>
      <p style={{ fontSize: '1.5rem', marginTop: '0.5rem' }}>
        Enkle nettsider til greie priser
      </p>
    </div>
  );
}

function Om() {
  return (
    <div style={pageContainer}>
      <h2>Om</h2>
      <p>
        Hei! Jeg heter Hanna Hjelmeland. Jeg designer og utvikler enkle,
        brukervennlige nettsider med fokus på god pris og rask levering. Med
        bakgrunn fra React og moderne webverktøy hjelper jeg små bedrifter med å
        få et profesjonelt uttrykk på nett.
      </p>
    </div>
  );
}

function TidligereProsjekter() {
  return (
    <div style={pageContainer}>
      <h2>Tidligere prosjekter</h2>
      <ul style={{ textAlign: 'left', display: 'inline-block' }}>
        <li><strong>Prosjekt Alpha:</strong> Nettside for lokal kafé.</li>
        <li><strong>Prosjekt Beta:</strong> Portfolio for fotograf.</li>
        <li><strong>Prosjekt Gamma:</strong> Enkel nettbutikk for håndlaget kunst.</li>
      </ul>
    </div>
  );
}

function Priser() {
  return (
    <div style={pageContainer}>
      <h2>Priser</h2>
      <p>
        Mine pakker starter på 5 000 kr for en enkel statisk side. Ta kontakt for
        skreddersydde tilbud, eller om du trenger e-handel, CMS-integrasjon eller
        vedlikeholdsavtale.
      </p>
    </div>
  );
}

export default function App() {
  return (
    <Router>
      <CanvasBackground />

      <nav style={navStyle}>
        <Link to="/om" style={linkStyle}>Om</Link>
        <Link to="/tidligere-prosjekter" style={linkStyle}>Tidligere prosjekter</Link>
        <Link to="/priser" style={linkStyle}>Priser</Link>
      </nav>

      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/om" element={<Om />} />
        <Route path="/tidligere-prosjekter" element={<TidligereProsjekter />} />
        <Route path="/priser" element={<Priser />} />
      </Routes>
    </Router>
  );
}
