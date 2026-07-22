import React, { useState, useMemo } from 'react';
import { Search, Globe, AlertTriangle } from 'lucide-react';
import assetsData, { type AssetItem } from '../data/assetsData';
import AssetModal from '../components/AssetModal';
import './Gallery.css';

const Worlds: React.FC = () => {
  const [selectedItem, setSelectedItem] = useState<AssetItem | null>(null);
  const [searchQuery, setSearchQuery] = useState<string>('');

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

  return (
    <div className="page-container animate-fade-in">
      <div className="page-header">
        <div className="codex-header-badge">
          <Globe size={16} /> PLANETARY SURVEY ({worldAssets.length} LOCATIONS)
        </div>
        <h1 className="page-title glow-text text-gradient">ALIEN WORLDS</h1>
      </div>

      <div className="codex-toolbar glass-panel">
        <div className="search-box">
          <Search size={20} className="search-icon" />
          <input
            type="text"
            placeholder="Search world name, biome, origin planet..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="search-input"
          />
        </div>
      </div>

      <div className="gallery-grid">
        {filteredWorlds.map((world) => (
          <div
            key={world.id}
            className="gallery-card landscape glass-panel hover-glow"
            onClick={() => setSelectedItem(world)}
          >
            <img src={world.imagePath} alt={world.title} className="gallery-image" />
            <div className="gallery-card-badge">
              <Globe size={12} /> {world.attributes.classification || 'Planetary Biome'}
            </div>
            <div className="gallery-overlay">
              <h3 className="item-name">{world.title}</h3>
              <p className="item-class">
                SYSTEM: {world.attributes.planetOrigin || 'Sector 7'}
              </p>
              {world.attributes.dangerLevel && (
                <div className="item-danger">
                  <AlertTriangle size={14} /> DANGER: {world.attributes.dangerLevel}
                </div>
              )}
              <span className="item-inspect-btn">INSPECT PLANETARY SURVEY &rarr;</span>
            </div>
          </div>
        ))}
      </div>

      {selectedItem && (
        <AssetModal item={selectedItem} onClose={() => setSelectedItem(null)} />
      )}
    </div>
  );
};

export default Worlds;
