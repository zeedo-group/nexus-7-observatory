import React, { useState, useMemo } from 'react';
import { Search, Cpu, Zap, ShieldCheck } from 'lucide-react';
import assetsData, { type AssetItem } from '../data/assetsData';
import AssetModal from '../components/AssetModal';
import './Gallery.css';

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
    <div className="page-container animate-fade-in">
      <div className="page-header">
        <div className="codex-header-badge">
          <Cpu size={16} /> ADVANCED ALIEN TECHNOLOGY ({artifactAssets.length} ARTIFACTS)
        </div>
        <h1 className="page-title glow-text text-gradient">ARTIFACTS</h1>
      </div>

      <div className="codex-toolbar glass-panel">
        <div className="search-box">
          <Search size={20} className="search-icon" />
          <input
            type="text"
            placeholder="Search technology title, classification, energy output..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="search-input"
          />
        </div>

        <div className="filter-select-wrap">
          <label className="filter-label">TYPE:</label>
          <select
            value={categoryFilter}
            onChange={(e) => setCategoryFilter(e.target.value)}
            className="filter-select"
          >
            <option value="ALL">ALL ARTIFACT TYPES</option>
            <option value="TECH">ADVANCED TECH</option>
            <option value="SIGNAL">COSMIC SIGNALS</option>
          </select>
        </div>
      </div>

      <div className="gallery-grid">
        {filteredArtifacts.map((artifact) => {
          const isLandscape = artifact.category === 'signal' || artifact.id.includes('monolith');
          return (
            <div
              key={artifact.id}
              className={`gallery-card glass-panel hover-glow ${isLandscape ? 'landscape' : ''}`}
              onClick={() => setSelectedItem(artifact)}
            >
              <img src={artifact.imagePath} alt={artifact.title} className="gallery-image" />
              <div className="gallery-card-badge">
                <Zap size={12} /> {artifact.attributes.classification || 'Tech Unit'}
              </div>
              <div className="gallery-overlay">
                <h3 className="item-name">{artifact.title}</h3>
                <p className="item-class">
                  <ShieldCheck size={14} /> STATUS: {artifact.attributes.status || 'Active'}
                </p>
                <span className="item-inspect-btn">INSPECT ARTIFACT DATA &rarr;</span>
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
