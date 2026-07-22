import React, { useState, useMemo } from 'react';
import { Compass, Globe, AlertTriangle, Zap, Navigation, Search, Check, Maximize2, Radio } from 'lucide-react';
import assetsData, { type AssetItem } from '../data/assetsData';
import AssetModal from '../components/AssetModal';
import './Starmap.css';

interface StarNode {
  id: string;
  item: AssetItem;
  coords: { x: number; y: number; z: number };
  distLightYears: number;
  atmosphere: string;
  gravityG: number;
  resources: string[];
  sector: string;
}

export const Starmap: React.FC = () => {
  const [selectedNodeId, setSelectedNodeId] = useState<string>('alien_hero');
  const [inspectModalItem, setInspectModalItem] = useState<AssetItem | null>(null);
  const [starmapSearch, setStarmapSearch] = useState<string>('');
  const [jumpTargetLocked, setJumpTargetLocked] = useState<boolean>(false);
  const [isJumpScanning, setIsJumpScanning] = useState<boolean>(false);

  // Filter worlds and landscapes from assetsData
  const starNodes: StarNode[] = useMemo(() => {
    const worldAssets = assetsData.filter(
      (a) => a.category === 'world' || a.id.startsWith('alien_landscape') || a.id === 'alien_starmap_1'
    );

    const presetCoords = [
      { id: 'alien_hero', x: 50, y: 50, z: 0, dist: 0, atmo: 'Nitrogen-Oxygen Core', grav: 1.0, sector: 'Sector 7 Central', res: ['Zero-Point Ore', 'Tachyon Crystals'] },
      { id: 'alien_world_2', x: 25, y: 30, z: 14, dist: 4.2, atmo: 'Dense Methane-Argon', grav: 2.4, sector: 'Vespera System', res: ['Noble Gases', 'Plasma Deuterium'] },
      { id: 'alien_world_3', x: 75, y: 28, z: -8, dist: 8.7, atmo: 'Crystalline Silicate Dust', grav: 0.8, sector: 'Xylos Quadrant', res: ['Quartz Lattice', 'Resonance Shards'] },
      { id: 'alien_world_4', x: 80, y: 70, z: 32, dist: 15.1, atmo: 'Nebular Ionized Plasma', grav: 0.9, sector: 'Orion Nursery', res: ['Stellar Matter', 'Ion Filters'] },
      { id: 'alien_landscape_5', x: 30, y: 72, z: -19, dist: 11.4, atmo: 'Bioluminescent Oxygen-Rich', grav: 1.1, sector: 'Aurelia Sector', res: ['Flora Essence', 'Purple Quartz'] },
      { id: 'alien_landscape_6', x: 62, y: 45, z: 45, dist: 19.8, atmo: 'Low-Density Sub-zero Air', grav: 0.3, sector: 'Zephyrus System', res: ['Floating Mineral', 'Antigravity Core'] },
      { id: 'alien_landscape_7', x: 18, y: 55, z: -35, dist: 24.3, atmo: 'Sulfur-Geothermal Vapor', grav: 1.6, sector: 'Vulcan Ridge', res: ['Magma Pyrite', 'Thermal Cell'] },
      { id: 'alien_landscape_8', x: 42, y: 22, z: 12, dist: 13.6, atmo: 'Super-Pressurized Aqua', grav: 1.3, sector: 'Poseidon Abyss', res: ['Deep Corals', 'Hydro-Plasma'] },
      { id: 'alien_starmap_1', x: 88, y: 85, z: 88, dist: 35.0, atmo: 'Navigation Grid Core', grav: 1.0, sector: 'Outer Rim Terminal', res: ['Star Cartography'] },
    ];

    return worldAssets.map((asset) => {
      const match = presetCoords.find((p) => p.id === asset.id);
      return {
        id: asset.id,
        item: asset,
        coords: match ? { x: match.x, y: match.y, z: match.z } : { x: 50, y: 50, z: 0 },
        distLightYears: match ? match.dist : 12.0,
        atmosphere: match ? match.atmo : 'Unmapped Atmospheric Profile',
        gravityG: match ? match.grav : 1.0,
        sector: match ? match.sector : 'Uncharted Sector',
        resources: match ? match.res : ['Unknown Elements'],
      };
    });
  }, []);

  const filteredNodes = useMemo(() => {
    const q = starmapSearch.toLowerCase().trim();
    if (!q) return starNodes;
    return starNodes.filter(
      (node) =>
        node.item.title.toLowerCase().includes(q) ||
        node.sector.toLowerCase().includes(q) ||
        node.item.attributes.planetOrigin?.toLowerCase().includes(q)
    );
  }, [starNodes, starmapSearch]);

  const activeNode = starNodes.find((n) => n.id === selectedNodeId) || starNodes[0];

  const handleInitiateJumpLock = () => {
    setIsJumpScanning(true);
    setJumpTargetLocked(false);
    setTimeout(() => {
      setIsJumpScanning(false);
      setJumpTargetLocked(true);
    }, 1200);
  };

  const getDangerBadgeClass = (danger?: string) => {
    switch (danger) {
      case 'Low':
      case 'Benign':
        return 'danger-safe';
      case 'Moderate':
        return 'danger-warn';
      case 'High':
      case 'Extremely High':
        return 'danger-crit';
      default:
        return 'danger-unknown';
    }
  };

  return (
    <div className="page-container animate-fade-in">
      <div className="page-header">
        <div className="starmap-header-badge">
          <Compass size={16} /> CELESTIAL STARMAP NAVIGATION GRID
        </div>
        <h1 className="page-title glow-text text-gradient">STARMAP ARCHIVE</h1>
        <p className="page-subtitle">
          Real-time planetary coordinates, environmental telemetry, and sub-space jump vectors
        </p>
      </div>

      {/* Main Starmap Workspace */}
      <div className="starmap-workspace">
        {/* Left Interactive Grid Viewport */}
        <div className="starmap-viewport glass-panel">
          <div className="viewport-overlay-grid"></div>
          <div className="orbital-ring ring-1"></div>
          <div className="orbital-ring ring-2"></div>

          <div className="starmap-search-bar">
            <Search size={16} className="text-cyan" />
            <input
              type="text"
              placeholder="Search planet system or sector..."
              value={starmapSearch}
              onChange={(e) => setStarmapSearch(e.target.value)}
            />
          </div>

          <div className="grid-center-crosshair">+ NEXUS PRIME ORIGIN</div>

          {/* Interactive World Nodes on Grid */}
          {filteredNodes.map((node) => {
            const isSelected = node.id === selectedNodeId;
            return (
              <div
                key={node.id}
                className={`starmap-node ${isSelected ? 'active-node' : ''}`}
                style={{ top: `${node.coords.y}%`, left: `${node.coords.x}%` }}
                onClick={() => {
                  setSelectedNodeId(node.id);
                  setJumpTargetLocked(false);
                }}
              >
                <div className="node-beacon"></div>
                <div className="node-label">
                  <span className="node-title">{node.item.title}</span>
                  <span className="node-coords">
                    [{node.coords.x},{node.coords.y}]
                  </span>
                </div>
              </div>
            );
          })}
        </div>

        {/* Right Inspection & Telemetry Panel */}
        <div className="starmap-inspection-panel glass-panel">
          <div className="panel-header">
            <div className="panel-category">
              <Globe size={16} className="text-cyan" /> PLANETARY INSPECTION LOG
            </div>
            <h2 className="panel-title glow-text">{activeNode.item.title}</h2>
            <span className="panel-sector">SECTOR: {activeNode.sector.toUpperCase()}</span>
          </div>

          <div className="panel-image-preview">
            <img src={activeNode.item.imagePath} alt={activeNode.item.title} />
            <span className={`panel-danger-badge ${getDangerBadgeClass(activeNode.item.attributes.dangerLevel)}`}>
              <AlertTriangle size={14} /> DANGER: {activeNode.item.attributes.dangerLevel || 'UNKNOWN'}
            </span>
          </div>

          <div className="panel-body">
            <div className="stats-grid">
              <div className="stat-card">
                <span className="stat-label">DISTANCE FROM CORE</span>
                <span className="stat-val">{activeNode.distLightYears} LY</span>
              </div>
              <div className="stat-card">
                <span className="stat-label">GRAVITATIONAL INDEX</span>
                <span className="stat-val">{activeNode.gravityG} G</span>
              </div>
              <div className="stat-card">
                <span className="stat-label">ATMOSPHERIC TYPE</span>
                <span className="stat-val text-cyan">{activeNode.atmosphere}</span>
              </div>
              <div className="stat-card">
                <span className="stat-label">CLASSIFICATION</span>
                <span className="stat-val">{activeNode.item.attributes.classification || 'Celestial Body'}</span>
              </div>
            </div>

            <div className="panel-lore-box">
              <h4>ENVIRONMENTAL OVERVIEW</h4>
              <p>{activeNode.item.description}</p>
              <h4 style={{ marginTop: '12px' }}>CLASSIFIED LORE</h4>
              <p className="lore-snippet">{activeNode.item.lore}</p>
            </div>

            <div className="resources-section">
              <h4>DETECTED RESOURCES & ELEMENTS</h4>
              <div className="resource-tags">
                {activeNode.resources.map((res, i) => (
                  <span key={i} className="resource-tag">
                    <Zap size={12} className="text-cyan" /> {res}
                  </span>
                ))}
              </div>
            </div>
          </div>

          <div className="panel-footer">
            <button
              className={`btn-secondary jump-lock-btn ${jumpTargetLocked ? 'locked' : ''}`}
              onClick={handleInitiateJumpLock}
              disabled={isJumpScanning}
            >
              {isJumpScanning ? (
                <>
                  <Radio size={16} className="spin" /> COMPUTING JUMP VECTOR...
                </>
              ) : jumpTargetLocked ? (
                <>
                  <Check size={16} /> JUMP ROUTE LOCKED
                </>
              ) : (
                <>
                  <Navigation size={16} /> INITIATE JUMP LOCK
                </>
              )}
            </button>

            <button
              className="btn-primary full-intel-btn"
              onClick={() => setInspectModalItem(activeNode.item)}
            >
              <Maximize2 size={16} /> FULL INTEL MODAL
            </button>
          </div>
        </div>
      </div>

      {/* Asset Modal for deeper inspection */}
      {inspectModalItem && (
        <AssetModal item={inspectModalItem} onClose={() => setInspectModalItem(null)} />
      )}
    </div>
  );
};

export default Starmap;
