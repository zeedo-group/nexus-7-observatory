import React from 'react';
import { X, Bookmark, Share2, Globe, AlertTriangle, ShieldCheck, Zap, Calendar, Cpu, Activity, Database, Radar } from 'lucide-react';
import type { AssetItem } from '../data/assetsData';
import './AssetModal.css';

interface AssetModalProps {
  item: AssetItem | null;
  onClose: () => void;
  onBookmark?: (id: string) => void;
  isBookmarked?: boolean;
}

export const AssetModal: React.FC<AssetModalProps> = ({
  item,
  onClose,
  onBookmark,
  isBookmarked = false,
}) => {
  // Removed unused useEffect

  if (!item) return null;

  const handleShare = () => {
    if (navigator.clipboard) {
      navigator.clipboard.writeText(`${window.location.origin}/lore?item=${item.id}`);
      alert(`Terminal sequence synchronized. Datapad link for "${item.title}" copied.`);
    }
  };

  const getDangerColor = (danger?: string) => {
    switch (danger) {
      case 'Low':
      case 'Benign':
        return '#0f0';
      case 'Moderate':
        return '#ff0';
      case 'High':
      case 'Extremely High':
        return '#f00';
      default:
        return '#0ff';
    }
  };

  return (
    <div className="alien-modal-backdrop" onClick={onClose}>
      <div className="alien-modal-container slide-up-anim" onClick={(e) => e.stopPropagation()}>
        
        {/* Top Header Bar */}
        <div className="alien-modal-header">
          <div className="header-deco-line"></div>
          <div className="header-title-wrap">
            <h1 className="alien-modal-title" data-text={item.title}>{item.title}</h1>
            <p className="alien-modal-id">UUID: // DIW-{item.id.toUpperCase()} // STATUS: ACTIVE</p>
          </div>
          <button className="alien-close-btn" onClick={onClose} aria-label="Close terminal">
            <X size={32} />
          </button>
        </div>

        {/* Multi-column layout */}
        <div className="alien-modal-body">
          {/* Column 1: Visuals & Core Stats */}
          <div className="alien-col alien-col-visuals">
            <div className="alien-image-frame">
              <div className="frame-corners"></div>
              <img src={item.imagePath} alt={item.title} className="alien-image" />
              <div className="alien-scanline"></div>
              <div className="alien-hud-overlay">
                <Activity className="hud-icon" size={24} />
                <span>TARGET LOCK</span>
              </div>
            </div>

            <div className="alien-stats-panel">
              <h3 className="alien-section-title"><Radar size={18} /> BIOSENSORS</h3>
              <div className="stat-row">
                <span className="stat-label">CATEGORY</span>
                <span className="stat-value text-cyan">{item.category.toUpperCase()}</span>
              </div>
              {item.attributes.dangerLevel && (
                <div className="stat-row">
                  <span className="stat-label">THREAT</span>
                  <span className="stat-value" style={{ color: getDangerColor(item.attributes.dangerLevel), textShadow: `0 0 10px ${getDangerColor(item.attributes.dangerLevel)}` }}>
                    <AlertTriangle size={14} className="inline-icon" /> {item.attributes.dangerLevel.toUpperCase()}
                  </span>
                </div>
              )}
              {item.attributes.status && (
                <div className="stat-row">
                  <span className="stat-label">STATUS</span>
                  <span className="stat-value text-purple"><ShieldCheck size={14} className="inline-icon" /> {item.attributes.status.toUpperCase()}</span>
                </div>
              )}
            </div>
            
            <div className="alien-data-bars">
               <div className="data-bar-wrap">
                 <span>INTEGRITY</span>
                 <div className="data-bar"><div className="data-bar-fill" style={{width: '87%'}}></div></div>
               </div>
               <div className="data-bar-wrap">
                 <span>ENERGY</span>
                 <div className="data-bar"><div className="data-bar-fill" style={{width: '64%'}}></div></div>
               </div>
            </div>
          </div>

          {/* Column 2: Specs & Details */}
          <div className="alien-col alien-col-specs">
             <h3 className="alien-section-title"><Database size={18} /> TELEMETRY DATA</h3>
             <div className="alien-attributes-grid">
              {item.attributes.planetOrigin && (
                <div className="alien-attr-card">
                  <Globe size={16} className="attr-icon" />
                  <div className="attr-text">
                    <span className="attr-label">ORIGIN</span>
                    <span className="attr-value">{item.attributes.planetOrigin}</span>
                  </div>
                </div>
              )}
              {item.attributes.classification && (
                <div className="alien-attr-card">
                  <ShieldCheck size={16} className="attr-icon" />
                  <div className="attr-text">
                    <span className="attr-label">CLASS</span>
                    <span className="attr-value">{item.attributes.classification}</span>
                  </div>
                </div>
              )}
              {item.attributes.energyOutput && (
                <div className="alien-attr-card">
                  <Zap size={16} className="attr-icon" />
                  <div className="attr-text">
                    <span className="attr-label">ENERGY</span>
                    <span className="attr-value">{item.attributes.energyOutput}</span>
                  </div>
                </div>
              )}
              {item.attributes.clearanceLevel && (
                <div className="alien-attr-card">
                  <ShieldCheck size={16} className="attr-icon" />
                  <div className="attr-text">
                    <span className="attr-label">CLEARANCE</span>
                    <span className="attr-value">{item.attributes.clearanceLevel}</span>
                  </div>
                </div>
              )}
              {item.attributes.discoveryDate && (
                <div className="alien-attr-card">
                  <Calendar size={16} className="attr-icon" />
                  <div className="attr-text">
                    <span className="attr-label">LOG DATE</span>
                    <span className="attr-value">{item.attributes.discoveryDate}</span>
                  </div>
                </div>
              )}
            </div>

            <div className="alien-summary-box">
              <h3 className="alien-section-title"><Cpu size={18} /> DECRYPTED SUMMARY</h3>
              <p className="alien-paragraph">{item.description}</p>
            </div>
          </div>

          {/* Column 3: Deep Lore */}
          <div className="alien-col alien-col-lore">
            <h3 className="alien-section-title"><Globe size={18} /> CLASSIFIED ARCHIVES</h3>
            <div className="alien-lore-container">
              {item.lore.split('\n').map((paragraph, idx) => (
                <p key={idx} className="alien-paragraph lore-para">{paragraph}</p>
              ))}
              <div className="lore-end-marker">// END OF FILE //</div>
            </div>
          </div>

        </div>

        {/* Footer Actions */}
        <div className="alien-modal-footer">
          <div className="footer-sys-info">SYSTEM OP: NOMAD // ENCRYPTION: KETER // TERMINAL LINK ESTABLISHED</div>
          <div className="footer-actions">
            {onBookmark && (
              <button
                className={`alien-btn ${isBookmarked ? 'btn-active' : ''}`}
                onClick={() => onBookmark(item.id)}
              >
                <Bookmark size={18} />
                {isBookmarked ? 'OVERRIDE SAVED' : 'SAVE TO DATAPAD'}
              </button>
            )}
            <button className="alien-btn" onClick={handleShare}>
              <Share2 size={18} /> UPLOAD COORDS
            </button>
            <button className="alien-btn btn-danger" onClick={onClose}>
              PURGE INSTANCE
            </button>
          </div>
        </div>

      </div>
    </div>
  );
};

export default AssetModal;
