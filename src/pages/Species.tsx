import React, { useState, useMemo } from 'react';
import { Search, Users, AlertTriangle, ShieldCheck } from 'lucide-react';
import assetsData, { type AssetItem } from '../data/assetsData';
import AssetModal from '../components/AssetModal';
import './Gallery.css';

const Species: React.FC = () => {
  const [selectedItem, setSelectedItem] = useState<AssetItem | null>(null);
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [dangerFilter, setDangerFilter] = useState<string>('ALL');

  const speciesAssets = useMemo(() => {
    return assetsData.filter((a) => a.category === 'species');
  }, []);

  const filteredSpecies = useMemo(() => {
    return speciesAssets.filter((item) => {
      const q = searchQuery.toLowerCase().trim();
      const matchesSearch =
        !q ||
        item.title.toLowerCase().includes(q) ||
        item.description.toLowerCase().includes(q) ||
        item.lore.toLowerCase().includes(q) ||
        (item.attributes.planetOrigin && item.attributes.planetOrigin.toLowerCase().includes(q));

      const matchesDanger =
        dangerFilter === 'ALL' ||
        (item.attributes.dangerLevel &&
          item.attributes.dangerLevel.toUpperCase() === dangerFilter.toUpperCase());

      return matchesSearch && matchesDanger;
    });
  }, [speciesAssets, searchQuery, dangerFilter]);

  return (
    <div className="page-container animate-fade-in">
      <div className="page-header">
        <div className="codex-header-badge">
          <Users size={16} /> XENOBIOLOGICAL DATABASE ({speciesAssets.length} ENTRIES)
        </div>
        <h1 className="page-title glow-text text-gradient">SPECIES ARCHIVE</h1>
      </div>

      <div className="codex-toolbar glass-panel">
        <div className="search-box">
          <Search size={20} className="search-icon" />
          <input
            type="text"
            placeholder="Search species name, classification, origin..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="search-input"
          />
        </div>

        <div className="filter-select-wrap">
          <label className="filter-label">DANGER LEVEL:</label>
          <select
            value={dangerFilter}
            onChange={(e) => setDangerFilter(e.target.value)}
            className="filter-select"
          >
            <option value="ALL">ALL DANGER RATINGS</option>
            <option value="BENIGN">BENIGN</option>
            <option value="LOW">LOW</option>
            <option value="MODERATE">MODERATE</option>
            <option value="HIGH">HIGH</option>
            <option value="EXTREMELY HIGH">EXTREMELY HIGH</option>
          </select>
        </div>
      </div>

      <div className="gallery-grid">
        {filteredSpecies.map((species) => (
          <div
            key={species.id}
            className="gallery-card glass-panel hover-glow"
            onClick={() => setSelectedItem(species)}
          >
            <img src={species.imagePath} alt={species.title} className="gallery-image" />
            <div className="gallery-card-badge">
              <ShieldCheck size={12} /> {species.attributes.classification || 'Entity'}
            </div>
            <div className="gallery-overlay">
              <h3 className="item-name">{species.title}</h3>
              <p className="item-class">
                ORIGIN: {species.attributes.planetOrigin || 'Uncharted Sector'}
              </p>
              {species.attributes.dangerLevel && (
                <div className="item-danger">
                  <AlertTriangle size={14} /> DANGER: {species.attributes.dangerLevel}
                </div>
              )}
              <span className="item-inspect-btn">INSPECT INTEL LOG &rarr;</span>
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

export default Species;
