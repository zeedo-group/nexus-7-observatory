import React, { useState, useMemo } from 'react';
import { Search, ShieldCheck, Microscope, Database, Radar, Scan } from 'lucide-react';
import assetsData, { type AssetItem } from '../data/assetsData';
import AssetModal from '../components/AssetModal';
import './Gallery.css';

const styles = `
  .deep-space-lab {
    background: radial-gradient(circle at center, #050510 0%, #000000 100%);
    border: 1px solid rgba(0, 255, 255, 0.15);
    box-shadow: inset 0 0 80px rgba(0, 255, 255, 0.05);
    border-radius: 16px;
    padding: 2rem;
    position: relative;
    overflow: hidden;
  }

  .deep-space-lab::before {
    content: '';
    position: absolute;
    top: 0; left: 0; right: 0; bottom: 0;
    background-image: 
      linear-gradient(rgba(0, 255, 255, 0.03) 1px, transparent 1px),
      linear-gradient(90deg, rgba(0, 255, 255, 0.03) 1px, transparent 1px);
    background-size: 30px 30px;
    z-index: 0;
    pointer-events: none;
  }
  
  .image-container {
    position: relative;
    width: 100%;
    height: 100%;
    overflow: hidden;
  }
  
  .scanner-laser {
    position: absolute;
    left: 0;
    right: 0;
    height: 3px;
    background: #00ffff;
    box-shadow: 0 0 15px #00ffff, 0 0 30px #00ffff;
    top: -10px;
    opacity: 0;
    transition: opacity 0.3s ease;
    z-index: 10;
  }
  
  .gallery-card:hover .scanner-laser {
    opacity: 1;
    animation: scan 2.5s ease-in-out infinite;
  }

  .gallery-card {
    border: 1px solid rgba(0, 255, 255, 0.2);
    background: rgba(0, 10, 20, 0.7);
    backdrop-filter: blur(10px);
  }

  .gallery-card:hover {
    box-shadow: 0 0 20px rgba(0, 255, 255, 0.3);
    border-color: rgba(0, 255, 255, 0.6);
  }

  .lab-header-icon {
    color: #00ffff;
    animation: pulse 2s infinite;
  }

  @keyframes scan {
    0% { top: 0; opacity: 1; }
    50% { top: calc(100% - 3px); opacity: 1; }
    100% { top: 0; opacity: 1; }
  }

  @keyframes pulse {
    0% { filter: drop-shadow(0 0 2px #00ffff); }
    50% { filter: drop-shadow(0 0 10px #00ffff); }
    100% { filter: drop-shadow(0 0 2px #00ffff); }
  }
`;

const Artifacts: React.FC = () => {
  const [selectedItem, setSelectedItem] = useState<AssetItem | null>(null);
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [categoryFilter, setCategoryFilter] = useState<string>('ALL');

  const artifactAssets = useMemo(() => {
    return assetsData.filter((a) => a.category === 'tech' || a.category === 'signal');
  }, []);

  const filteredArtifacts = useMemo(() => {
    return artifactAssets.filter((item) => {
      const q = searchQuery.toLowerCase().trim();
      const matchesSearch =
        !q ||
        item.title.toLowerCase().includes(q) ||
        item.description.toLowerCase().includes(q) ||
        item.lore.toLowerCase().includes(q) ||
        (item.attributes.classification && item.attributes.classification.toLowerCase().includes(q));

      const matchesCat =
        categoryFilter === 'ALL' || item.category.toUpperCase() === categoryFilter.toUpperCase();

      return matchesSearch && matchesCat;
    });
  }, [artifactAssets, searchQuery, categoryFilter]);

  return (
    <div className="page-container animate-fade-in deep-space-lab">
      <style>{styles}</style>
      
      <div className="page-header" style={{ position: 'relative', zIndex: 1 }}>
        <div className="codex-header-badge" style={{ border: '1px solid #00ffff', color: '#00ffff' }}>
          <Microscope size={16} className="lab-header-icon" /> XENO-BIOLOGY & TECHNOLOGY WING ({artifactAssets.length} ARTIFACTS)
        </div>
        <h1 className="page-title glow-text text-gradient" style={{ display: 'flex', alignItems: 'center', gap: '1rem', justifyContent: 'center' }}>
          <Radar size={40} className="lab-header-icon" />
          DEEP-SPACE LABORATORY
          <Database size={40} className="lab-header-icon" />
        </h1>
      </div>

      <div className="codex-toolbar glass-panel" style={{ position: 'relative', zIndex: 1, border: '1px solid rgba(0,255,255,0.3)' }}>
        <div className="search-box">
          <Search size={20} className="search-icon" style={{ color: '#00ffff' }} />
          <input
            type="text"
            placeholder="Scan registry for anomalous materials, tech specs..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="search-input"
            style={{ color: '#00ffff' }}
          />
        </div>

        <div className="filter-select-wrap">
          <label className="filter-label" style={{ color: '#00ffff' }}>SYSTEM:</label>
          <select
            value={categoryFilter}
            onChange={(e) => setCategoryFilter(e.target.value)}
            className="filter-select"
            style={{ border: '1px solid #00ffff', color: '#00ffff' }}
          >
            <option value="ALL">ALL SPECIMENS</option>
            <option value="TECH">RETRIEVED HARDWARE</option>
            <option value="SIGNAL">ELECTROMAGNETIC ANOMALIES</option>
          </select>
        </div>
      </div>

      <div className="gallery-grid" style={{ position: 'relative', zIndex: 1 }}>
        {filteredArtifacts.map((artifact) => {
          const isLandscape = artifact.category === 'signal' || artifact.id.includes('monolith');
          return (
            <div
              key={artifact.id}
              className={`gallery-card glass-panel hover-glow ${isLandscape ? 'landscape' : ''}`}
              onClick={() => setSelectedItem(artifact)}
            >
              <div className="image-container">
                <div className="scanner-laser"></div>
                <img src={artifact.imagePath} alt={artifact.title} className="gallery-image" />
              </div>
              <div className="gallery-card-badge" style={{ background: 'rgba(0, 255, 255, 0.1)', color: '#00ffff', border: '1px solid #00ffff' }}>
                <Scan size={12} style={{ animation: 'pulse 1s infinite' }} /> {artifact.attributes.classification || 'Unclassified Material'}
              </div>
              <div className="gallery-overlay">
                <h3 className="item-name" style={{ color: '#00ffff', textShadow: '0 0 10px #00ffff' }}>{artifact.title}</h3>
                <p className="item-class">
                  <ShieldCheck size={14} style={{ color: '#00ffff' }} /> CONTAINMENT: {artifact.attributes.status || 'Stable'}
                </p>
                <span className="item-inspect-btn" style={{ color: '#00ffff' }}>INITIATE DEEP SCAN &rarr;</span>
              </div>
            </div>
          );
        })}
      </div>

      {selectedItem && (
        <AssetModal item={selectedItem} onClose={() => setSelectedItem(null)} />
      )}
    </div>
  );
};

export default Artifacts;
