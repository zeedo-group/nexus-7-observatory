import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ShieldCheck, ChevronRight } from 'lucide-react';
import assetsData, { type AssetItem } from '../data/assetsData';
import AssetModal from '../components/AssetModal';
import './Home.css';

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
        <img src="/assets/alien_hero.jpg" alt="Nexus Central Observatory" className="hero-bg" />
        <div className="hero-overlay"></div>

        <div className="hero-content">
          <div className="hero-badge animate-slide-up" style={{ animationDelay: '0.1s' }}>
            <ShieldCheck size={16} /> INTERSTELLAR NETWORK
          </div>
          <h1 className="hero-title glow-text text-gradient animate-slide-up" style={{ animationDelay: '0.2s' }}>
            NEXUS-7
          </h1>
          <p className="hero-subtitle animate-slide-up" style={{ animationDelay: '0.3s' }}>
            INTELLIGENCE OBSERVATORY
          </p>
          <div className="hero-button-group animate-slide-up" style={{ animationDelay: '0.4s' }}>
            <button className="btn-primary" onClick={() => navigate('/species')}>
              INITIATE
            </button>
          </div>
        </div>
      </div>

      <div className="section-title-wrap">
        <h2 className="section-main-title glow-text">SECTORS</h2>
      </div>

      <div className="hub-grid">
        <div className="hub-card image-card" onClick={() => navigate('/lore')}>
          <div className="hub-bg" style={{ backgroundImage: 'url(/assets/alien_signal.jpg)' }}></div>
          <div className="hub-overlay">
            <h3>LORE CODEX</h3>
            <span className="hub-card-link">ENTER <ChevronRight size={16} /></span>
          </div>
        </div>

        <div className="hub-card image-card" onClick={() => navigate('/agents')}>
          <div className="hub-bg" style={{ backgroundImage: 'url(/assets/alien_tech_3.jpg)' }}></div>
          <div className="hub-overlay">
            <h3>AGENT HUB</h3>
            <span className="hub-card-link">ENTER <ChevronRight size={16} /></span>
          </div>
        </div>

        <div className="hub-card image-card" onClick={() => navigate('/starmap')}>
          <div className="hub-bg" style={{ backgroundImage: 'url(/assets/alien_tech_2.jpg)' }}></div>
          <div className="hub-overlay">
            <h3>STARMAP</h3>
            <span className="hub-card-link">ENTER <ChevronRight size={16} /></span>
          </div>
        </div>

        <div className="hub-card image-card" onClick={() => navigate('/transmissions')}>
          <div className="hub-bg" style={{ backgroundImage: 'url(/assets/alien_hero.jpg)' }}></div>
          <div className="hub-overlay">
            <h3>TRANSMISSIONS</h3>
            <span className="hub-card-link">ENTER <ChevronRight size={16} /></span>
          </div>
        </div>

        <div className="hub-card image-card" onClick={() => navigate('/species')}>
          <div className="hub-bg" style={{ backgroundImage: 'url(/assets/alien_species_4.jpg)' }}></div>
          <div className="hub-overlay">
            <h3>SPECIES</h3>
            <span className="hub-card-link">ENTER <ChevronRight size={16} /></span>
          </div>
        </div>

        <div className="hub-card image-card" onClick={() => navigate('/worlds')}>
          <div className="hub-bg" style={{ backgroundImage: 'url(/assets/alien_world_3.jpg)' }}></div>
          <div className="hub-overlay">
            <h3>WORLDS</h3>
            <span className="hub-card-link">ENTER <ChevronRight size={16} /></span>
          </div>
        </div>
      </div>

      <div className="section-title-wrap" style={{ marginTop: '80px' }}>
        <h2 className="section-main-title glow-text">CLASSIFIED INTEL</h2>
      </div>

      <div className="showcase-section">
        {featuredAssets.map((asset) => (
          <div
            key={asset.id}
            className="showcase-card image-card"
            onClick={() => setModalItem(asset)}
          >
            <div className="hub-bg" style={{ backgroundImage: `url(${asset.imagePath})` }}></div>
            <div className="hub-overlay">
              <span className="featured-tag">{asset.category.toUpperCase()}</span>
              <h3>{asset.title}</h3>
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
