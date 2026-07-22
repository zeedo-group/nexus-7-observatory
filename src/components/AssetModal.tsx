import React from 'react';
import { X, Bookmark, Share2, Globe, AlertTriangle, ShieldCheck, Zap, Calendar, Cpu } from 'lucide-react';
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
  if (!item) return null;

  const handleShare = () => {
    if (navigator.clipboard) {
      navigator.clipboard.writeText(`${window.location.origin}/lore?item=${item.id}`);
      alert(`Direct access link for "${item.title}" copied to clipboard.`);
    }
  };

  const getDangerBadgeClass = (danger?: string) => {
    switch (danger) {
      case 'Low':
      case 'Benign':
        return 'danger-badge-safe';
      case 'Moderate':
        return 'danger-badge-warning';
      case 'High':
      case 'Extremely High':
        return 'danger-badge-critical';
      default:
        return 'danger-badge-unknown';
    }
  };

  return (
    <div className="modal-backdrop" onClick={onClose}>
      <div className="modal-container glass-panel animate-fade-in" onClick={(e) => e.stopPropagation()}>
        <button className="modal-close-btn" onClick={onClose} aria-label="Close modal">
          <X size={24} />
        </button>

        <div className="modal-header">
          <div className="modal-tags">
            <span className="category-badge">{item.category.toUpperCase()}</span>
            {item.attributes.dangerLevel && (
              <span className={`danger-badge ${getDangerBadgeClass(item.attributes.dangerLevel)}`}>
                <AlertTriangle size={14} /> DANGER: {item.attributes.dangerLevel.toUpperCase()}
              </span>
            )}
            {item.attributes.status && (
              <span className="status-badge">
                <ShieldCheck size={14} /> {item.attributes.status.toUpperCase()}
              </span>
            )}
          </div>
          <h2 className="modal-title glow-text">{item.title}</h2>
          <p className="modal-id">INDEX ID: DIW-{item.id.toUpperCase()}</p>
        </div>

        <div className="modal-body">
          <div className="modal-image-wrapper">
            <img src={item.imagePath} alt={item.title} className="modal-image" />
            <div className="image-overlay-scanlines"></div>
          </div>

          <div className="modal-content">
            <div className="lore-section">
              <h3 className="section-title">
                <Cpu size={18} className="section-icon" /> SYSTEM SUMMARY
              </h3>
              <p className="description-text">{item.description}</p>
            </div>

            <div className="lore-section">
              <h3 className="section-title">
                <Globe size={18} className="section-icon" /> CLASSIFIED ARCHIVE LORE
              </h3>
              <div className="lore-text-box">
                <p>{item.lore}</p>
              </div>
            </div>

            <div className="attributes-grid">
              {item.attributes.planetOrigin && (
                <div className="attribute-card">
                  <span className="attr-label"><Globe size={14} /> Planet Origin</span>
                  <span className="attr-value">{item.attributes.planetOrigin}</span>
                </div>
              )}
              {item.attributes.classification && (
                <div className="attribute-card">
                  <span className="attr-label"><ShieldCheck size={14} /> Classification</span>
                  <span className="attr-value">{item.attributes.classification}</span>
                </div>
              )}
              {item.attributes.energyOutput && (
                <div className="attribute-card">
                  <span className="attr-label"><Zap size={14} /> Energy Output</span>
                  <span className="attr-value">{item.attributes.energyOutput}</span>
                </div>
              )}
              {item.attributes.clearanceLevel && (
                <div className="attribute-card">
                  <span className="attr-label"><ShieldCheck size={14} /> Clearance</span>
                  <span className="attr-value">{item.attributes.clearanceLevel}</span>
                </div>
              )}
              {item.attributes.discoveryDate && (
                <div className="attribute-card">
                  <span className="attr-label"><Calendar size={14} /> Intercept Date</span>
                  <span className="attr-value">{item.attributes.discoveryDate}</span>
                </div>
              )}
            </div>
          </div>
        </div>

        <div className="modal-footer">
          {onBookmark && (
            <button
              className={`btn-secondary ${isBookmarked ? 'bookmarked' : ''}`}
              onClick={() => onBookmark(item.id)}
            >
              <Bookmark size={18} />
              {isBookmarked ? 'BOOKMARKED' : 'BOOKMARK ENTRY'}
            </button>
          )}
          <button className="btn-secondary" onClick={handleShare}>
            <Share2 size={18} /> SHARE DATA LINK
          </button>
          <button className="btn-primary" onClick={onClose}>
            CLOSE ARCHIVE
          </button>
        </div>
      </div>
    </div>
  );
};

export default AssetModal;
