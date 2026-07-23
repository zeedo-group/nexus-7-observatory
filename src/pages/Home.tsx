import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { ShieldCheck, ChevronRight, Zap, Target, Network, Cpu } from 'lucide-react';
import assetsData, { type AssetItem } from '../data/assetsData';
import AssetModal from '../components/AssetModal';
import './Home.css';

const Starfield: React.FC = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let width = (canvas.width = window.innerWidth);
    let height = (canvas.height = window.innerHeight);

    // Create 3D star coordinates
    const stars = Array.from({ length: 800 }, () => ({
      x: (Math.random() - 0.5) * 2000,
      y: (Math.random() - 0.5) * 2000,
      z: Math.random() * 2000,
      size: Math.random() * 2 + 0.5,
    }));

    let animationFrameId: number;

    const animate = () => {
      ctx.fillStyle = 'rgba(5, 5, 8, 0.3)'; // Trail effect
      ctx.fillRect(0, 0, width, height);
      
      const centerX = width / 2;
      const centerY = height / 2;

      stars.forEach((star) => {
        star.z -= 4; // Speed of travel
        if (star.z <= 0) {
          star.z = 2000;
          star.x = (Math.random() - 0.5) * 2000;
          star.y = (Math.random() - 0.5) * 2000;
        }

        const k = 128.0 / star.z;
        const px = star.x * k + centerX;
        const py = star.y * k + centerY;

        if (px >= 0 && px <= width && py >= 0 && py <= height) {
          const intensity = (1 - star.z / 2000) * 255;
          ctx.fillStyle = `rgb(${intensity}, ${intensity}, ${intensity})`;
          ctx.beginPath();
          ctx.arc(px, py, star.size * k, 0, Math.PI * 2);
          ctx.fill();
        }
      });

      animationFrameId = requestAnimationFrame(animate);
    };

    animate();

    const handleResize = () => {
      width = canvas.width = window.innerWidth;
      height = canvas.height = window.innerHeight;
    };
    window.addEventListener('resize', handleResize);

    return () => {
      cancelAnimationFrame(animationFrameId);
      window.removeEventListener('resize', handleResize);
    };
  }, []);

  return <canvas ref={canvasRef} className="starfield-canvas" />;
};

const Home: React.FC = () => {
  const navigate = useNavigate();
  const [modalItem, setModalItem] = useState<AssetItem | null>(null);

  const featuredAssets = [
    assetsData.find((a) => a.id === 'alien_hero') || assetsData[0],
    assetsData.find((a) => a.id === 'alien_species_1') || assetsData[2],
    assetsData.find((a) => a.id === 'alien_tech_1') || assetsData[10],
    assetsData.find((a) => a.id === 'agent_coder') || assetsData[24],
  ];

  return (
    <div className="home-container animate-fade-in">
      <div className="hero-section">
        <Starfield />
        
        {/* Layered Epic Geometric Shapes */}
        <div className="geo-container">
          <div className="geo-shape geo-1"></div>
          <div className="geo-shape geo-2"></div>
          <div className="geo-shape geo-3"></div>
        </div>

        <div className="hero-overlay-epic"></div>

        <div className="hero-content">
          <div className="hero-badge animate-slide-up" style={{ animationDelay: '0.1s' }}>
            <ShieldCheck size={16} /> INTERSTELLAR NETWORK ACTIVE
          </div>
          <h1 className="hero-title epic-glow-text text-gradient animate-slide-up" style={{ animationDelay: '0.2s' }}>
            NEXUS-7
          </h1>
          <p className="hero-subtitle animate-slide-up" style={{ animationDelay: '0.3s' }}>
            <Target size={16} style={{ display: 'inline', marginRight: '8px', verticalAlign: 'middle' }} />
            INTELLIGENCE OBSERVATORY
          </p>
          <div className="hero-button-group animate-slide-up" style={{ animationDelay: '0.4s' }}>
            <button className="btn-primary epic-btn" onClick={() => navigate('/species')}>
              INITIATE PROTOCOL <Zap size={18} />
            </button>
            <button className="btn-secondary glass-btn epic-btn" onClick={() => navigate('/starmap')}>
              OPEN STARMAP <Network size={18} />
            </button>
          </div>
        </div>
      </div>

      <div className="section-title-wrap">
        <h2 className="section-main-title epic-glow-text">SECTORS</h2>
      </div>

      <div className="hub-grid">
        <div className="hub-card image-card" onClick={() => navigate('/lore')}>
          <div className="hub-bg" style={{ backgroundImage: 'url(/assets/alien_signal.jpg)' }}></div>
          <div className="hub-overlay">
            <Cpu size={32} className="hub-icon" />
            <h3>LORE CODEX</h3>
            <span className="hub-card-link">ENTER <ChevronRight size={16} /></span>
          </div>
        </div>

        <div className="hub-card image-card" onClick={() => navigate('/agents')}>
          <div className="hub-bg" style={{ backgroundImage: 'url(/assets/alien_tech_3.jpg)' }}></div>
          <div className="hub-overlay">
            <Network size={32} className="hub-icon" />
            <h3>AGENT HUB</h3>
            <span className="hub-card-link">ENTER <ChevronRight size={16} /></span>
          </div>
        </div>

        <div className="hub-card image-card" onClick={() => navigate('/starmap')}>
          <div className="hub-bg" style={{ backgroundImage: 'url(/assets/alien_tech_2.jpg)' }}></div>
          <div className="hub-overlay">
            <Target size={32} className="hub-icon" />
            <h3>STARMAP</h3>
            <span className="hub-card-link">ENTER <ChevronRight size={16} /></span>
          </div>
        </div>

        <div className="hub-card image-card" onClick={() => navigate('/transmissions')}>
          <div className="hub-bg" style={{ backgroundImage: 'url(/assets/alien_hero.jpg)' }}></div>
          <div className="hub-overlay">
            <Zap size={32} className="hub-icon" />
            <h3>TRANSMISSIONS</h3>
            <span className="hub-card-link">ENTER <ChevronRight size={16} /></span>
          </div>
        </div>

        <div className="hub-card image-card" onClick={() => navigate('/species')}>
          <div className="hub-bg" style={{ backgroundImage: 'url(/assets/alien_species_4.jpg)' }}></div>
          <div className="hub-overlay">
            <ShieldCheck size={32} className="hub-icon" />
            <h3>SPECIES</h3>
            <span className="hub-card-link">ENTER <ChevronRight size={16} /></span>
          </div>
        </div>

        <div className="hub-card image-card" onClick={() => navigate('/worlds')}>
          <div className="hub-bg" style={{ backgroundImage: 'url(/assets/alien_world_3.jpg)' }}></div>
          <div className="hub-overlay">
            <Network size={32} className="hub-icon" />
            <h3>WORLDS</h3>
            <span className="hub-card-link">ENTER <ChevronRight size={16} /></span>
          </div>
        </div>
      </div>

      <div className="section-title-wrap" style={{ marginTop: '80px' }}>
        <h2 className="section-main-title epic-glow-text">CLASSIFIED INTEL</h2>
      </div>

      <div className="showcase-section">
        {featuredAssets.map((asset) => (
          <div
            key={asset?.id || Math.random().toString()}
            className="showcase-card image-card"
            onClick={() => asset && setModalItem(asset)}
          >
            <div className="hub-bg" style={{ backgroundImage: `url(${asset?.imagePath})` }}></div>
            <div className="hub-overlay glass-overlay">
              <span className="featured-tag">{asset?.category?.toUpperCase()}</span>
              <h3>{asset?.title}</h3>
            </div>
          </div>
        ))}
      </div>

      {modalItem && (
        <AssetModal item={modalItem} onClose={() => setModalItem(null)} />
      )}
    </div>
  );
};

export default Home;
