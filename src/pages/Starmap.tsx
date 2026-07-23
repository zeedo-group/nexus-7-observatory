import React, { useState, useMemo, useRef } from 'react';
import { Compass, Globe, AlertTriangle, Navigation, Check, Maximize2, Radio, Target, Crosshair, Radar, Activity } from 'lucide-react';
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
  type: string;
}

export const Starmap: React.FC = () => {
  const [selectedNodeId, setSelectedNodeId] = useState<string>('alien_hero');
  const [inspectModalItem, setInspectModalItem] = useState<AssetItem | null>(null);
  const [starmapSearch, setStarmapSearch] = useState<string>('');
  const [jumpTargetLocked, setJumpTargetLocked] = useState<boolean>(false);
  const [isJumpScanning, setIsJumpScanning] = useState<boolean>(false);
  
  // Viewport mapping state
  const [pan, setPan] = useState({ x: -1500, y: -1500 }); // start somewhere in the middle
  const [scale, setScale] = useState(0.5);
  const [isInfiniteMap, setIsInfiniteMap] = useState<boolean>(true);
  
  const [isDragging, setIsDragging] = useState(false);
  const dragStart = useRef({ x: 0, y: 0 });
  const viewportRef = useRef<HTMLDivElement>(null);
  
  // 4000x4000 massive map
  const MAP_SIZE = 4000;

  // Filter massive data
  const celestialNodes: StarNode[] = useMemo(() => {
    const worldAssets = assetsData.filter((a) => a.category === 'world');
    return worldAssets.map((asset, index) => {
      // Procedurally assign types for hierarchical zoom
      let assignedType = 'planet';
      if (index % 20 === 0) assignedType = 'galaxy';
      else if (index % 7 === 0) assignedType = 'cluster';
      else if (index % 3 === 0) assignedType = 'star';
      
      return {
        id: asset.id,
        item: asset,
        coords: { 
          x: asset.attributes.x ? Number(asset.attributes.x) : Math.random() * 95 + 2.5, 
          y: asset.attributes.y ? Number(asset.attributes.y) : Math.random() * 95 + 2.5, 
          z: 0 
        },
        type: asset.attributes.type || assignedType,
        distLightYears: asset.attributes.x ? Number(asset.attributes.x) * 1.5 : 12.0,
        atmosphere: asset.attributes.atmosphere || 'Unmapped Atmospheric Profile',
        gravityG: asset.attributes.gravityG ? parseFloat(String(asset.attributes.gravityG)) : 1.0,
        sector: asset.attributes.planetOrigin || 'Uncharted Sector',
        resources: ['Unknown Elements'],
      };
    });
  }, []);

  const filteredNodes = useMemo(() => {
    const q = starmapSearch.toLowerCase().trim();
    if (!q) return celestialNodes;
    return celestialNodes.filter(
      (node) =>
        node.item.title.toLowerCase().includes(q) ||
        node.sector.toLowerCase().includes(q)
    );
  }, [celestialNodes, starmapSearch]);

  const activeNode = celestialNodes.find((n) => n.id === selectedNodeId) || celestialNodes[0];

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
      case 'Benign': return 'danger-safe';
      case 'Moderate': return 'danger-warn';
      case 'High':
      case 'Extremely High':
      case 'Catastrophic':
      case 'Existential': return 'danger-crit';
      default: return 'danger-unknown';
    }
  };

  const clampPan = (newX: number, newY: number, currentScale: number) => {
    if (!viewportRef.current) return { x: newX, y: newY };
    
    if (isInfiniteMap) {
      // Allow panning infinitely
      return { x: newX, y: newY };
    }
    
    const rect = viewportRef.current.getBoundingClientRect();
    const minX = rect.width - MAP_SIZE * currentScale;
    const minY = rect.height - MAP_SIZE * currentScale;
    return {
      x: Math.min(0, Math.max(minX, newX)),
      y: Math.min(0, Math.max(minY, newY))
    };
  };

  const handleMouseDown = (e: React.MouseEvent) => {
    setIsDragging(true);
    dragStart.current = { x: e.clientX - pan.x, y: e.clientY - pan.y };
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (isDragging) {
      const newX = e.clientX - dragStart.current.x;
      const newY = e.clientY - dragStart.current.y;
      setPan(clampPan(newX, newY, scale));
    }
  };

  const handleMouseUp = () => setIsDragging(false);
  const handleMouseLeave = () => setIsDragging(false);

  const handleWheel = (e: React.WheelEvent) => {
    if (!viewportRef.current) return;
    
    // Determine new scale
    const scaleChange = e.deltaY * -0.001;
    let newScale = scale + scaleChange;
    newScale = Math.min(Math.max(0.1, newScale), 3.0); // clamp scale between 0.1 and 3.0
    
    // Zoom toward mouse pointer
    const rect = viewportRef.current.getBoundingClientRect();
    const mouseX = e.clientX - rect.left;
    const mouseY = e.clientY - rect.top;

    // Calculate new pan to keep mouse position relatively same
    const scaleRatio = newScale / scale;
    const newPanX = mouseX - (mouseX - pan.x) * scaleRatio;
    const newPanY = mouseY - (mouseY - pan.y) * scaleRatio;

    setScale(newScale);
    setPan(clampPan(newPanX, newPanY, newScale));
  };

  const centerOnNode = (node: StarNode) => {
    if (!viewportRef.current) return;
    const rect = viewportRef.current.getBoundingClientRect();
    
    // Center of viewport
    const cx = rect.width / 2;
    const cy = rect.height / 2;

    // Node pixel position in massive map
    const nodePx = (node.coords.x / 100) * MAP_SIZE * scale;
    const nodePy = (node.coords.y / 100) * MAP_SIZE * scale;

    setPan(clampPan(cx - nodePx, cy - nodePy, scale));
  };

  return (
    <div className="page-container animate-fade-in starmap-container">
      <div className="page-header futuristic-header">
        <div className="starmap-header-badge neon-pulse">
          <Compass size={18} className="spin-slow" /> HIERARCHICAL CELESTIAL STARMAP
        </div>
        <h1 className="page-title glow-text text-gradient glitch-text" data-text="STARMAP ARCHIVE">STARMAP ARCHIVE</h1>
        <p className="page-subtitle terminal-text">
          <Activity size={14} className="inline-icon" /> Deep-Zoom Enabled. Scroll to traverse Galaxies, Stars, and Planetary Bodies.
        </p>
      </div>

      <div className="starmap-workspace">
        <div 
          className="starmap-viewport glass-panel ultra-glass" 
          ref={viewportRef}
          onMouseDown={handleMouseDown}
          onMouseMove={handleMouseMove}
          onMouseUp={handleMouseUp}
          onMouseLeave={handleMouseLeave}
          onWheel={handleWheel}
          style={{ cursor: isDragging ? 'grabbing' : 'grab', overflow: 'hidden' }}
        >
          <div 
            className="viewport-parallax-layer" 
            style={{ 
              width: MAP_SIZE, 
              height: MAP_SIZE, 
              position: 'absolute',
              transformOrigin: '0 0',
              transform: `translate(${pan.x}px, ${pan.y}px) scale(${scale})` 
            }}
          >
            <div className="viewport-overlay-grid glowing-grid" style={{ width: '100%', height: '100%', position: 'absolute' }}></div>

            {/* Hierarchical Nodes Rendering */}
            {filteredNodes.map((node) => {
              const isSelected = node.id === selectedNodeId;
              
              // Level of detail logic
              let isVisible = false;
              let opacity = 1.0;
              let sizeClass = '';
              
              if (node.type === 'galaxy') {
                isVisible = true; // Always visible
                opacity = scale > 1.0 ? 0.2 : 1.0; // Fade out when zoomed in deeply
                sizeClass = 'node-galaxy';
              } else if (node.type === 'star') {
                isVisible = scale > 0.4;
                opacity = scale > 2.0 ? 0.3 : 1.0; // Fade out when looking at planets
                sizeClass = 'node-star';
              } else if (node.type === 'cluster') {
                isVisible = scale > 0.1 && scale < 1.0;
                opacity = scale > 0.6 ? 0.3 : 1.0;
                sizeClass = 'node-cluster';
              } else if (node.type === 'planet' || node.type === 'unknown') {
                isVisible = scale > 1.5;
                sizeClass = 'node-planet';
              }

              if (!isVisible) return null;

              return (
                <div
                  key={node.id}
                  className={`starmap-node ${isSelected ? 'active-node' : ''} ${sizeClass}`}
                  style={{ 
                    top: `${node.coords.y}%`, 
                    left: `${node.coords.x}%`,
                    position: 'absolute',
                    opacity: opacity,
                    transition: 'opacity 0.3s ease'
                  }}
                  onMouseDown={(e) => e.stopPropagation()}
                  onClick={() => {
                    setSelectedNodeId(node.id);
                    setJumpTargetLocked(false);
                    // auto center
                    setTimeout(() => centerOnNode(node), 50);
                    // auto zoom
                    if (node.type === 'galaxy' && scale < 0.3) setScale(0.5);
                    if (node.type === 'cluster' && scale < 0.6) setScale(0.8);
                    if (node.type === 'star' && scale < 1.8) setScale(2.5);
                  }}
                >
                  <div className="node-beacon ripple-effect"></div>
                  <div className="node-label hologram-box">
                    <span className="node-title">{node.item.title}</span>
                    <span className="node-coords">
                      <Crosshair size={10} className="inline-icon"/> [{node.coords.x.toFixed(1)},{node.coords.y.toFixed(1)}]
                    </span>
                  </div>
                </div>
              );
            })}
          </div>

          <div className="starmap-search-bar futuristic-search">
            <Radar size={18} className="text-cyan-400 animate-pulse" />
            <input
              type="text"
              placeholder="SEARCH SYSTEM..."
              value={starmapSearch}
              onChange={(e) => setStarmapSearch(e.target.value)}
              onMouseDown={(e) => e.stopPropagation()}
              className="bg-transparent text-white outline-none placeholder-cyan-700/50"
            />
          </div>

          <div className="absolute bottom-6 right-6 flex flex-col gap-4 z-50 pointer-events-auto">
            <button
              className="w-12 h-12 rounded-full bg-cyan-950/80 border border-cyan-500/50 flex items-center justify-center text-cyan-400 hover:bg-cyan-900 hover:text-white hover:border-cyan-300 transition-all shadow-[0_0_15px_rgba(6,182,212,0.3)] backdrop-blur-md"
              onClick={() => setIsInfiniteMap(!isInfiniteMap)}
              title={isInfiniteMap ? "Switch to Finite Bounds" : "Switch to Infinite Map"}
            >
              <Globe size={20} className={isInfiniteMap ? "animate-pulse" : ""} />
            </button>
            <button 
              className="w-12 h-12 rounded-full bg-purple-950/80 border border-purple-500/50 flex items-center justify-center text-purple-400 hover:bg-purple-900 hover:text-white hover:border-purple-300 transition-all shadow-[0_0_15px_rgba(168,85,247,0.3)] backdrop-blur-md"
              onClick={() => {
                 if(activeNode) centerOnNode(activeNode);
              }}
              title="Center on Target"
            >
              <Target size={24} className="animate-spin-slow" />
            </button>
          </div>
          
          <div className="viewport-overlay-scanline pointer-events-none"></div>
        </div>

        {/* HUD PANEL */}
        <div className="starmap-inspection-panel glass-panel ultra-glass holographic-panel">
          {activeNode && (
            <>
              <div className="panel-header border-b-cyan">
                <div className="panel-category neon-text">
                  <Globe size={16} className="text-cyan spin-slow" /> {activeNode.item.attributes.classification || 'PLANETARY INSPECTION'}
                </div>
                <h2 className="panel-title glow-text cyber-title">{activeNode.item.title}</h2>
                <span className="panel-sector glitch-effect" data-text={`SECTOR: ${activeNode.sector.toUpperCase()}`}>
                  SECTOR: {activeNode.sector.toUpperCase()}
                </span>
              </div>

              <div className="panel-image-preview cyber-frame">
                <div className="scan-line-horizontal"></div>
                <img 
                  src={activeNode.item.imagePath} 
                  alt={activeNode.item.title} 
                  className="cyber-image" 
                />
                <span className={`panel-danger-badge ${getDangerBadgeClass(activeNode.item.attributes.dangerLevel)}`}>
                  <AlertTriangle size={14} className="pulse" /> DANGER: {activeNode.item.attributes.dangerLevel || 'UNKNOWN'}
                </span>
              </div>

              <div className="panel-body custom-scrollbar">
                <div className="stats-grid">
                  <div className="stat-card cyber-stat">
                    <span className="stat-label">COORD X</span>
                    <span className="stat-val">{activeNode.coords.x.toFixed(2)}</span>
                  </div>
                  <div className="stat-card cyber-stat">
                    <span className="stat-label">COORD Y</span>
                    <span className="stat-val">{activeNode.coords.y.toFixed(2)}</span>
                  </div>
                  <div className="stat-card cyber-stat">
                    <span className="stat-label">TYPE</span>
                    <span className="stat-val text-cyan">{activeNode.type.toUpperCase()}</span>
                  </div>
                  <div className="stat-card cyber-stat">
                    <span className="stat-label">CLASS</span>
                    <span className="stat-val">{activeNode.item.attributes.classification || 'Celestial Body'}</span>
                  </div>
                </div>

                <div className="panel-lore-box cyber-lore">
                  <h4 className="text-cyan-300 font-bold text-[10px] tracking-widest uppercase mb-2"><Activity size={14} className="inline-icon text-cyan-400" /> ENVIRONMENTAL OVERVIEW</h4>
                  <p className="text-slate-300 text-sm leading-relaxed">{activeNode.item.description}</p>
                  <h4 className="mt-4 text-purple-300 font-bold text-[10px] tracking-widest uppercase mb-2"><Target size={14} className="inline-icon text-purple-400" /> CLASSIFIED LORE</h4>
                  <p className="lore-snippet text-slate-400 italic text-sm">{activeNode.item.lore}</p>
                </div>
              </div>

              <div className="panel-footer">
                <button
                  className={`btn-secondary jump-lock-btn cyber-btn ${jumpTargetLocked ? 'locked success-pulse' : ''}`}
                  onClick={handleInitiateJumpLock}
                  disabled={isJumpScanning}
                >
                  <div className="btn-glitch-layer"></div>
                  {isJumpScanning ? (
                    <><Radio size={16} className="spin" /> COMPUTING VECTOR...</>
                  ) : jumpTargetLocked ? (
                    <><Check size={16} className="pulse" /> JUMP ROUTE LOCKED</>
                  ) : (
                    <><Navigation size={16} /> INITIATE JUMP LOCK</>
                  )}
                </button>

                <button
                  className="btn-primary full-intel-btn cyber-btn"
                  onClick={() => setInspectModalItem(activeNode.item)}
                >
                  <div className="btn-glitch-layer"></div>
                  <Maximize2 size={16} /> FULL INTEL
                </button>
              </div>
            </>
          )}
        </div>
      </div>

      {inspectModalItem && (
        <AssetModal item={inspectModalItem} onClose={() => setInspectModalItem(null)} />
      )}
    </div>
  );
};

export default Starmap;
