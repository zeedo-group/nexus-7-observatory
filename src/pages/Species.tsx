import React, { useState, useMemo, useEffect } from 'react';
import { Search, AlertTriangle, ShieldCheck, Dna, ChevronRight, Activity } from 'lucide-react';
import assetsData, { type AssetItem } from '../data/assetsData';
import AssetModal from '../components/AssetModal';
import './Gallery.css';

const Particles = () => {
  const [particles, setParticles] = useState<Array<{ id: number; left: string; top: string; delay: string; duration: string; size: string }>>([]);

  useEffect(() => {
    const newParticles = Array.from({ length: 40 }).map((_, i) => ({
      id: i,
      left: `${Math.random() * 100}%`,
      top: `${Math.random() * 100}%`,
      delay: `${Math.random() * 5}s`,
      duration: `${10 + Math.random() * 20}s`,
      size: `${1 + Math.random() * 3}px`
    }));
    setParticles(newParticles);
  }, []);

  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none fixed z-[-1]">
      {particles.map((p) => (
        <div
          key={p.id}
          className="absolute rounded-full bg-cyan-400/30 blur-[1px]"
          style={{
            left: p.left,
            top: p.top,
            width: p.size,
            height: p.size,
            animation: `float-particle ${p.duration} linear infinite`,
            animationDelay: p.delay,
            boxShadow: '0 0 10px 2px rgba(6, 182, 212, 0.4)'
          }}
        />
      ))}
      <style>{`
        @keyframes float-particle {
          0% { transform: translateY(100vh) translateX(0) scale(1); opacity: 0; }
          20% { opacity: 0.8; }
          80% { opacity: 0.8; }
          100% { transform: translateY(-20vh) translateX(50px) scale(0.5); opacity: 0; }
        }
        
        .futuristic-card {
          position: relative;
          background: rgba(10, 15, 30, 0.6);
          border: 1px solid rgba(0, 255, 255, 0.1);
          backdrop-filter: blur(12px);
          -webkit-backdrop-filter: blur(12px);
          border-radius: 12px;
          overflow: hidden;
          transition: all 0.4s cubic-bezier(0.25, 0.46, 0.45, 0.94);
        }
        
        .futuristic-card::before {
          content: '';
          position: absolute;
          inset: 0;
          background: linear-gradient(135deg, rgba(0,255,255,0.05) 0%, transparent 100%);
          z-index: 1;
          pointer-events: none;
        }

        .futuristic-card:hover {
          transform: translateY(-8px) scale(1.02);
          border-color: rgba(0, 255, 255, 0.5);
          box-shadow: 0 0 30px rgba(0, 255, 255, 0.2), inset 0 0 20px rgba(0, 255, 255, 0.1);
        }

        .futuristic-card:hover .gallery-image {
          transform: scale(1.1);
          filter: contrast(1.2) saturate(1.2);
        }
        
        .hex-badge {
          clip-path: polygon(10% 0, 100% 0, 90% 100%, 0% 100%);
          background: linear-gradient(90deg, rgba(0,255,255,0.2) 0%, rgba(0,255,255,0.05) 100%);
          border-left: 2px solid cyan;
        }

        .scan-line {
          position: absolute;
          width: 100%;
          height: 2px;
          background: rgba(0, 255, 255, 0.5);
          box-shadow: 0 0 10px cyan;
          top: 0;
          left: 0;
          animation: scan 3s linear infinite;
          opacity: 0;
          z-index: 20;
          pointer-events: none;
        }

        .futuristic-card:hover .scan-line {
          opacity: 1;
        }

        @keyframes scan {
          0% { top: 0; }
          100% { top: 100%; }
        }

        .glitch-text:hover {
          animation: glitch-anim 0.3s linear infinite;
        }

        @keyframes glitch-anim {
          0% { transform: translate(0) }
          20% { transform: translate(-2px, 1px) }
          40% { transform: translate(-1px, -1px) }
          60% { transform: translate(2px, 1px) }
          80% { transform: translate(1px, -1px) }
          100% { transform: translate(0) }
        }
      `}</style>
    </div>
  );
};

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
    <div className="relative min-h-screen pb-20 page-container animate-fade-in" style={{ backgroundColor: '#030712' }}>
      <Particles />
      
      <div className="relative z-10 page-header pt-10">
        <div className="inline-flex items-center gap-2 px-4 py-1 mb-4 border border-cyan-500/30 bg-cyan-500/10 rounded-full text-cyan-400 text-xs font-mono uppercase tracking-widest shadow-[0_0_15px_rgba(0,255,255,0.2)]">
          <Dna size={14} className="animate-pulse" />
          XENOBIOLOGICAL DATABASE ({speciesAssets.length} ENTRIES)
        </div>
        <h1 className="text-5xl font-black tracking-[0.2em] text-transparent bg-clip-text bg-gradient-to-r from-cyan-300 via-blue-500 to-purple-600 drop-shadow-[0_0_20px_rgba(0,255,255,0.4)] mb-2">
          SPECIES ARCHIVE
        </h1>
        <p className="text-cyan-400/60 font-mono text-sm max-w-2xl mx-auto mt-4">
          CLASSIFIED INTEL // AUTHORIZED ACCESS ONLY // SYS.OP.OVERRIDE
        </p>
      </div>

      <div className="relative z-10 codex-toolbar max-w-4xl mx-auto my-12 p-1 rounded-xl bg-gradient-to-r from-cyan-900/30 to-purple-900/30 border border-cyan-500/20 backdrop-blur-md shadow-[0_0_30px_rgba(0,255,255,0.05)] flex flex-col md:flex-row gap-4">
        <div className="relative flex-1 group">
          <div className="absolute inset-y-0 left-0 flex items-center pl-4 pointer-events-none text-cyan-400 group-focus-within:text-cyan-300">
            <Search size={18} />
          </div>
          <input
            type="text"
            placeholder="Search by species designation, origin, or trait..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full py-4 pl-12 pr-4 bg-black/40 border border-transparent focus:border-cyan-500/50 rounded-lg text-cyan-100 placeholder-cyan-700 font-mono text-sm outline-none transition-all duration-300 focus:shadow-[0_0_20px_rgba(0,255,255,0.15)]"
          />
        </div>

        <div className="relative flex items-center bg-black/40 rounded-lg px-2 border border-transparent hover:border-cyan-500/30 transition-all">
          <Activity size={18} className="text-red-400 ml-2" />
          <select
            value={dangerFilter}
            onChange={(e) => setDangerFilter(e.target.value)}
            className="appearance-none bg-transparent py-4 pl-2 pr-8 text-cyan-300 font-mono text-sm font-bold outline-none cursor-pointer"
          >
            <option value="ALL" className="bg-gray-900">THREAT: ALL</option>
            <option value="BENIGN" className="bg-gray-900 text-green-400">THREAT: BENIGN</option>
            <option value="LOW" className="bg-gray-900 text-blue-400">THREAT: LOW</option>
            <option value="MODERATE" className="bg-gray-900 text-yellow-400">THREAT: MODERATE</option>
            <option value="HIGH" className="bg-gray-900 text-orange-400">THREAT: HIGH</option>
            <option value="EXTREMELY HIGH" className="bg-gray-900 text-red-500">THREAT: CRITICAL</option>
          </select>
        </div>
      </div>

      <div className="relative z-10 gallery-grid px-6 max-w-[1600px] mx-auto" style={{ gridTemplateColumns: 'repeat(auto-fill, minmax(360px, 1fr))', gap: '40px' }}>
        {filteredSpecies.map((species) => (
          <div
            key={species.id}
            className="futuristic-card group cursor-pointer"
            onClick={() => setSelectedItem(species)}
          >
            <div className="scan-line"></div>
            
            <div className="relative h-64 overflow-hidden">
              <div className="absolute inset-0 bg-cyan-900/20 mix-blend-overlay z-10 group-hover:opacity-0 transition-opacity duration-500"></div>
              <img 
                src={species.imagePath} 
                alt={species.title} 
                className="w-full h-full object-cover gallery-image transition-transform duration-700" 
              />
              
              <div className="absolute top-3 right-3 z-20 hex-badge px-3 py-1 flex items-center gap-1.5 text-[10px] font-mono font-bold text-cyan-200 uppercase">
                <ShieldCheck size={10} className="text-cyan-400" /> 
                {species.attributes.classification || 'Entity'}
              </div>
            </div>

            <div className="relative p-5 z-20 bg-gradient-to-t from-gray-950 via-gray-900 to-transparent -mt-16 pt-16">
              <h3 className="text-2xl font-black text-white mb-1 tracking-wider glitch-text group-hover:text-cyan-300 transition-colors">
                {species.title}
              </h3>
              
              <p className="text-xs font-mono text-cyan-500/80 mb-3 flex items-center gap-1.5">
                <span className="w-1.5 h-1.5 rounded-full bg-cyan-500 animate-pulse"></span>
                ORIGIN: {species.attributes.planetOrigin || 'Uncharted Sector'}
              </p>
              
              <div className="h-[1px] w-full bg-gradient-to-r from-cyan-500/50 to-transparent my-3"></div>
              
              <div className="flex items-center justify-between mt-4">
                {species.attributes.dangerLevel ? (
                  <div className={`flex items-center gap-1.5 text-xs font-mono font-bold px-2 py-1 rounded bg-black/50 border
                    ${species.attributes.dangerLevel === 'Extremely High' ? 'text-red-400 border-red-500/30' : 
                      species.attributes.dangerLevel === 'High' ? 'text-orange-400 border-orange-500/30' : 
                      species.attributes.dangerLevel === 'Moderate' ? 'text-yellow-400 border-yellow-500/30' : 
                      'text-green-400 border-green-500/30'}`}>
                    <AlertTriangle size={12} /> 
                    {species.attributes.dangerLevel.toUpperCase()}
                  </div>
                ) : (
                  <div></div>
                )}
                
                <span className="text-[10px] font-mono text-cyan-400 flex items-center gap-1 opacity-60 group-hover:opacity-100 group-hover:translate-x-1 transition-all">
                  INSPECT <ChevronRight size={12} />
                </span>
              </div>
            </div>
            
            {/* Corner Accents */}
            <div className="absolute top-0 left-0 w-4 h-4 border-t-2 border-l-2 border-cyan-500/50 z-20"></div>
            <div className="absolute top-0 right-0 w-4 h-4 border-t-2 border-r-2 border-cyan-500/50 z-20"></div>
            <div className="absolute bottom-0 left-0 w-4 h-4 border-b-2 border-l-2 border-cyan-500/50 z-20"></div>
            <div className="absolute bottom-0 right-0 w-4 h-4 border-b-2 border-r-2 border-cyan-500/50 z-20"></div>
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
