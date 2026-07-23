import React, { useState, useMemo, useEffect, useRef } from 'react';
import { Search, Globe, Crosshair, Map, ShieldAlert } from 'lucide-react';
import assetsData, { type AssetItem } from '../data/assetsData';
import AssetModal from '../components/AssetModal';
import './Gallery.css';
import './Worlds.css';

const Worlds: React.FC = () => {
  const [selectedItem, setSelectedItem] = useState<AssetItem | null>(null);
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      if (!containerRef.current) return;
      const { innerWidth, innerHeight } = window;
      // Normalize mouse position between -1 and 1
      const x = (e.clientX / innerWidth) * 2 - 1;
      const y = (e.clientY / innerHeight) * 2 - 1;
      setMousePos({ x, y });
    };

    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, []);

  const worldAssets = useMemo(() => {
    return assetsData.filter((a) => a.category === 'world' || a.id.startsWith('alien_landscape'));
  }, []);

  const filteredWorlds = useMemo(() => {
    return worldAssets.filter((item) => {
      const q = searchQuery.toLowerCase().trim();
      return (
        !q ||
        item.title.toLowerCase().includes(q) ||
        item.description.toLowerCase().includes(q) ||
        item.lore.toLowerCase().includes(q) ||
        (item.attributes.planetOrigin && item.attributes.planetOrigin.toLowerCase().includes(q))
      );
    });
  }, [worldAssets, searchQuery]);

  const getDangerClass = (level?: string) => {
    if (!level) return 'danger-low';
    if (level.includes('High') || level.includes('Extreme') || level.includes('Critical')) return 'danger-high';
    if (level.includes('Medium') || level.includes('Moderate')) return 'danger-medium';
    return 'danger-low';
  };

  return (
    <div ref={containerRef} className="worlds-page-wrapper">
      {/* Massive Parallax Background */}
      <div className="worlds-parallax-container">
        <div 
          className="parallax-layer parallax-bg"
          style={{ transform: `translate(${mousePos.x * 10}px, ${mousePos.y * 10}px) scale(1.05)` }}
        />
        <div 
          className="parallax-layer parallax-stars"
          style={{ transform: `translate(${mousePos.x * 25}px, ${mousePos.y * 25}px) scale(1.1)` }}
        />
        <div 
          className="parallax-layer parallax-nebula"
          style={{ transform: `translate(${mousePos.x * -15}px, ${mousePos.y * -15}px) scale(1.05)` }}
        />
      </div>

      <div className="page-container animate-fade-in" style={{ position: 'relative', zIndex: 10 }}>
        <div className="page-header">
          <div className="codex-header-badge" style={{ display: 'inline-flex', alignItems: 'center', gap: '8px', padding: '8px 16px', background: 'rgba(0, 240, 255, 0.1)', border: '1px solid var(--accent-cyan)', borderRadius: '30px', color: 'var(--accent-cyan)', fontWeight: 'bold', letterSpacing: '2px', fontSize: '0.8rem', marginBottom: '20px' }}>
            <Crosshair size={16} /> STELLAR CARTOGRAPHY ({worldAssets.length} LOCATIONS)
          </div>
          <h1 className="page-title glow-text text-gradient" style={{ fontSize: '4.5rem', textShadow: '0 0 40px rgba(0, 240, 255, 0.4)' }}>ALIEN WORLDS</h1>
        </div>

        <div className="codex-toolbar glass-panel" style={{ background: 'rgba(10, 15, 30, 0.6)', backdropFilter: 'blur(20px)', border: '1px solid rgba(0, 240, 255, 0.2)', maxWidth: '600px', margin: '0 auto 50px', borderRadius: '30px', padding: '5px' }}>
          <div className="search-box" style={{ display: 'flex', alignItems: 'center', padding: '10px 20px' }}>
            <Search size={22} className="search-icon" style={{ color: 'var(--accent-cyan)' }} />
            <input
              type="text"
              placeholder="Search by planetary designation, biome..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="search-input"
              style={{ background: 'transparent', border: 'none', color: '#fff', width: '100%', padding: '10px', fontSize: '1rem', outline: 'none' }}
            />
          </div>
        </div>

        <div className="gallery-grid" style={{ gridTemplateColumns: 'repeat(auto-fill, minmax(360px, 1fr))', gap: '40px' }}>
          {filteredWorlds.map((world) => (
            <div
              key={world.id}
              className="world-card-advanced"
              onClick={() => setSelectedItem(world)}
            >
              <div className="hover-scanline" />
              <div className="world-image-container">
                <img src={world.imagePath} alt={world.title} />
                <div className="card-glitch-overlay"></div>
                <div className="gallery-card-badge" style={{ top: '20px', left: '20px', background: 'rgba(0,0,0,0.7)', border: '1px solid var(--accent-cyan)', padding: '6px 12px' }}>
                  <Map size={14} /> {world.attributes.classification || 'Uncharted Biome'}
                </div>
              </div>
              
              <div className="world-content">
                <h3 className="world-title">{world.title}</h3>
                <p className="world-subtitle">
                  <Globe size={14} /> SYS: {world.attributes.planetOrigin || 'Unknown Sector'}
                </p>
                
                <div className="world-stats">
                  <div className="world-stat-item">
                    <span className="stat-label">Atmosphere</span>
                    <span className="stat-value">{world.attributes.condition || 'Unknown'}</span>
                  </div>
                  {world.attributes.dangerLevel && (
                    <div className="world-stat-item" style={{ alignItems: 'flex-end' }}>
                      <span className="stat-label" style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                        <ShieldAlert size={12} /> Threat Level
                      </span>
                      <span className={`stat-value ${getDangerClass(world.attributes.dangerLevel)}`}>
                        {world.attributes.dangerLevel}
                      </span>
                    </div>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>

        {selectedItem && (
          <AssetModal item={selectedItem} onClose={() => setSelectedItem(null)} />
        )}
      </div>
    </div>
  );
};

export default Worlds;
