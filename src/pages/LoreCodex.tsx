import React, { useState, useEffect, useMemo } from 'react';
import { Search, Filter, Bookmark, PlusCircle, BookOpen, Globe, Cpu, Users, Radio, Sparkles, X, Check } from 'lucide-react';
import assetsData, { type AssetItem, type AssetCategory } from '../data/assetsData';
import * as loreDb from '../services/loreDb';
import AssetModal from '../components/AssetModal';
import './Gallery.css';
import './LoreCodex.css';

type FilterCategory = 'All' | 'Origins' | 'Tech' | 'Species' | 'Cosmic' | 'Agent Logs' | 'Bookmarked';

export const LoreCodex: React.FC = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<FilterCategory>('All');
  const [selectedItem, setSelectedItem] = useState<AssetItem | null>(null);

  const [loreEntries, setLoreEntries] = useState<loreDb.LoreEntry[]>([]);
  const [bookmarkedIds, setBookmarkedIds] = useState<string[]>([]);

  const [isSubmitModalOpen, setIsSubmitModalOpen] = useState(false);
  const [submitSuccess, setSubmitSuccess] = useState(false);
  
  // Submission Form State
  const [newTitle, setNewTitle] = useState('');
  const [newCategory, setNewCategory] = useState<AssetCategory>('species');
  const [newOrigin, setNewOrigin] = useState('');
  const [newClassification, setNewClassification] = useState('');
  const [newDangerLevel, setNewDangerLevel] = useState<'Low' | 'Moderate' | 'High' | 'Extremely High' | 'Benign'>('Moderate');
  const [newDescription, setNewDescription] = useState('');
  const [newLore, setNewLore] = useState('');

  // Load lore entries from loreDb on mount
  useEffect(() => {
    const initAndFetchLore = async () => {
      try {
        await loreDb.initDb();
        const entries = await loreDb.getAllEntries();
        setLoreEntries(entries);
        setBookmarkedIds(entries.filter((e) => e.isBookmarked).map((e) => e.id));
      } catch (error) {
        console.error('Error initializing or fetching lore entries from loreDb:', error);
      }
    };
    initAndFetchLore();
  }, []);

  const toggleBookmark = async (id: string) => {
    try {
      const isBookmarked = await loreDb.toggleBookmark(id);
      setBookmarkedIds((prev) =>
        isBookmarked ? (prev.includes(id) ? prev : [...prev, id]) : prev.filter((item) => item !== id)
      );
      setLoreEntries((prev) =>
        prev.map((entry) => (entry.id === id ? { ...entry, isBookmarked } : entry))
      );
    } catch (error) {
      console.error('Error toggling bookmark in loreDb:', error);
    }
  };

  const allAssets: AssetItem[] = useMemo(() => {
    if (loreEntries.length === 0) {
      return assetsData;
    }
    return loreEntries.map((entry) => ({
      id: entry.id,
      title: entry.title,
      category: (entry.category as AssetCategory) || 'species',
      description: entry.description,
      lore: entry.lore,
      imagePath: entry.imagePath || '/assets/alien_hero.jpg',
      attributes: {
        planetOrigin: entry.planetOrigin || entry.attributes?.planetOrigin,
        classification: entry.attributes?.classification || 'Classified Log',
        dangerLevel: (entry.dangerLevel || entry.attributes?.dangerLevel) as AssetItem['attributes']['dangerLevel'],
        status: entry.status || entry.attributes?.status,
        clearanceLevel: entry.clearanceLevel || entry.attributes?.clearanceLevel,
        discoveryDate: entry.createdAt ? entry.createdAt.split('T')[0] : entry.attributes?.discoveryDate,
        ...entry.attributes,
      },
    }));
  }, [loreEntries]);

  const filteredAssets = useMemo(() => {
    return allAssets.filter((item) => {
      // Category filter
      let matchesCategory = true;
      if (selectedCategory === 'Tech') {
        matchesCategory = item.category === 'tech';
      } else if (selectedCategory === 'Species') {
        matchesCategory = item.category === 'species';
      } else if (selectedCategory === 'Origins') {
        matchesCategory = item.category === 'world' || Boolean(item.attributes.planetOrigin);
      } else if (selectedCategory === 'Cosmic') {
        matchesCategory =
          item.category === 'signal' ||
          item.attributes.dangerLevel === 'High' ||
          item.attributes.dangerLevel === 'Extremely High';
      } else if (selectedCategory === 'Agent Logs') {
        matchesCategory = item.category === 'agent';
      } else if (selectedCategory === 'Bookmarked') {
        matchesCategory = bookmarkedIds.includes(item.id);
      }

      // Search filter
      const q = searchQuery.toLowerCase().trim();
      const matchesSearch =
        !q ||
        item.title.toLowerCase().includes(q) ||
        item.description.toLowerCase().includes(q) ||
        item.lore.toLowerCase().includes(q) ||
        item.category.toLowerCase().includes(q) ||
        (item.attributes.planetOrigin && item.attributes.planetOrigin.toLowerCase().includes(q)) ||
        (item.attributes.classification && item.attributes.classification.toLowerCase().includes(q));

      return matchesCategory && matchesSearch;
    });
  }, [allAssets, selectedCategory, searchQuery, bookmarkedIds]);

  const handleAddLore = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTitle.trim() || !newLore.trim() || !newDescription.trim()) return;

    const imagePath =
      newCategory === 'species'
        ? '/assets/alien_species_1.jpg'
        : newCategory === 'world'
        ? '/assets/alien_world_2.jpg'
        : newCategory === 'tech'
        ? '/assets/alien_tech_3.jpg'
        : newCategory === 'signal'
        ? '/assets/alien_signal.jpg'
        : '/assets/agent_coder.jpg';

    try {
      await loreDb.addEntry({
        title: newTitle.trim(),
        category: newCategory,
        description: newDescription.trim(),
        lore: newLore.trim(),
        imagePath,
        planetOrigin: newOrigin.trim() || 'Uncharted Sector',
        dangerLevel: newDangerLevel,
        status: 'User Transmitted',
        attributes: {
          planetOrigin: newOrigin.trim() || 'Uncharted Sector',
          classification: newClassification.trim() || 'Custom Signal Entry',
          dangerLevel: newDangerLevel,
          status: 'User Transmitted',
          discoveryDate: new Date().toISOString().split('T')[0],
        },
      });

      const entries = await loreDb.getAllEntries();
      setLoreEntries(entries);
      setBookmarkedIds(entries.filter((e) => e.isBookmarked).map((e) => e.id));

      setSubmitSuccess(true);
      setTimeout(() => {
        setSubmitSuccess(false);
        setIsSubmitModalOpen(false);
        setNewTitle('');
        setNewOrigin('');
        setNewClassification('');
        setNewDescription('');
        setNewLore('');
      }, 1200);
    } catch (error) {
      console.error('Error adding entry to loreDb:', error);
    }
  };

  const categories: { label: FilterCategory; icon: React.ElementType }[] = [
    { label: 'All', icon: BookOpen },
    { label: 'Origins', icon: Globe },
    { label: 'Tech', icon: Cpu },
    { label: 'Species', icon: Users },
    { label: 'Cosmic', icon: Sparkles },
    { label: 'Agent Logs', icon: Radio },
    { label: 'Bookmarked', icon: Bookmark },
  ];

  return (
    <div className="page-container animate-fade-in">
      <div className="page-header">
        <div className="codex-header-badge">
          <BookOpen size={16} /> DEEP INTERSTELLAR LORE CODEX
        </div>
        <h1 className="page-title glow-text text-gradient">LORE CODEX</h1>
        <p className="page-subtitle">
          Comprehensive xenobiological, technological, and cosmic intel repository ({allAssets.length} Records)
        </p>
      </div>

      {/* Search and Action Toolbar */}
      <div className="codex-toolbar glass-panel">
        <div className="search-box">
          <Search size={20} className="search-icon" />
          <input
            type="text"
            placeholder="Search full-text lore, species, tech, origin planet, or classification..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="search-input"
          />
          {searchQuery && (
            <button className="clear-search" onClick={() => setSearchQuery('')}>
              <X size={16} />
            </button>
          )}
        </div>

        <button className="btn-primary submit-lore-btn" onClick={() => setIsSubmitModalOpen(true)}>
          <PlusCircle size={18} /> SUBMIT NEW LORE
        </button>
      </div>

      {/* Category Filter Pills */}
      <div className="category-pills">
        {categories.map((cat) => {
          const Icon = cat.icon;
          const isActive = selectedCategory === cat.label;
          return (
            <button
              key={cat.label}
              className={`pill-btn ${isActive ? 'active' : ''}`}
              onClick={() => setSelectedCategory(cat.label)}
            >
              <Icon size={16} />
              <span>{cat.label}</span>
              {cat.label === 'Bookmarked' && (
                <span className="pill-count">{bookmarkedIds.length}</span>
              )}
            </button>
          );
        })}
      </div>

      {/* Results grid */}
      <div className="codex-grid">
        {filteredAssets.length === 0 ? (
          <div className="no-results glass-panel">
            <Filter size={48} className="text-muted" />
            <h3>No Lore Entries Match Your Filter Criteria</h3>
            <p>Try clearing your search query or selecting a different category filter.</p>
            <button className="btn-secondary" onClick={() => { setSearchQuery(''); setSelectedCategory('All'); }}>
              Reset Filters
            </button>
          </div>
        ) : (
          filteredAssets.map((item) => {
            const isBookmarked = bookmarkedIds.includes(item.id);
            return (
              <div key={item.id} className="codex-card glass-panel hover-glow">
                <div className="codex-card-image-wrap" onClick={() => setSelectedItem(item)}>
                  <img src={item.imagePath} alt={item.title} className="codex-card-image" />
                  <span className="codex-category-tag">{item.category}</span>
                  <button
                    className={`bookmark-btn ${isBookmarked ? 'active' : ''}`}
                    onClick={(e) => {
                      e.stopPropagation();
                      toggleBookmark(item.id);
                    }}
                    title={isBookmarked ? 'Remove bookmark' : 'Bookmark entry'}
                  >
                    <Bookmark size={18} />
                  </button>
                </div>

                <div className="codex-card-content" onClick={() => setSelectedItem(item)}>
                  <div className="codex-origin">
                    <Globe size={14} /> {item.attributes.planetOrigin || 'Unmapped Coordinates'}
                  </div>
                  <h3 className="codex-card-title">{item.title}</h3>
                  <p className="codex-card-desc">{item.description}</p>
                  <p className="codex-lore-snippet">{item.lore.slice(0, 110)}...</p>

                  <div className="codex-card-footer">
                    <span className="read-more-link">Inspect Intel &rarr;</span>
                    {item.attributes.dangerLevel && (
                      <span className={`danger-dot danger-${item.attributes.dangerLevel.toLowerCase().replace(/\s+/g, '-')}`}>
                        {item.attributes.dangerLevel}
                      </span>
                    )}
                  </div>
                </div>
              </div>
            );
          })
        )}
      </div>

      {/* Detail Modal */}
      {selectedItem && (
        <AssetModal
          item={selectedItem}
          onClose={() => setSelectedItem(null)}
          onBookmark={toggleBookmark}
          isBookmarked={bookmarkedIds.includes(selectedItem.id)}
        />
      )}

      {/* Submit Lore Modal */}
      {isSubmitModalOpen && (
        <div className="modal-backdrop" onClick={() => setIsSubmitModalOpen(false)}>
          <div
            className="modal-container glass-panel animate-fade-in submit-lore-modal"
            onClick={(e) => e.stopPropagation()}
          >
            <button className="modal-close-btn" onClick={() => setIsSubmitModalOpen(false)}>
              <X size={24} />
            </button>

            <div className="modal-header">
              <h2 className="modal-title glow-text text-gradient">SUBMIT DEEP SPACE LORE</h2>
              <p className="modal-id">BROADCAST NEW INTELLIGENCE TO NEXUS-7 REPOSITORY</p>
            </div>

            {submitSuccess ? (
              <div className="submit-success-box">
                <Check size={48} className="success-icon" />
                <h3>Lore Entry Transmitted Successfully!</h3>
                <p>Your intelligence log has been added to the active Codex database.</p>
              </div>
            ) : (
              <form onSubmit={handleAddLore} className="submit-lore-form">
                <div className="form-group">
                  <label>ENTRY TITLE *</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Zenith Graviton Resonator"
                    value={newTitle}
                    onChange={(e) => setNewTitle(e.target.value)}
                  />
                </div>

                <div className="form-row">
                  <div className="form-group">
                    <label>CATEGORY *</label>
                    <select
                      value={newCategory}
                      onChange={(e) => setNewCategory(e.target.value as AssetCategory)}
                    >
                      <option value="species">Alien Species</option>
                      <option value="world">Alien World</option>
                      <option value="tech">Advanced Tech</option>
                      <option value="signal">Cosmic Signal</option>
                      <option value="agent">Agent Log</option>
                    </select>
                  </div>

                  <div className="form-group">
                    <label>DANGER LEVEL *</label>
                    <select
                      value={newDangerLevel}
                      onChange={(e) =>
                        setNewDangerLevel(
                          e.target.value as 'Low' | 'Moderate' | 'High' | 'Extremely High' | 'Benign'
                        )
                      }
                    >
                      <option value="Benign">Benign</option>
                      <option value="Low">Low</option>
                      <option value="Moderate">Moderate</option>
                      <option value="High">High</option>
                      <option value="Extremely High">Extremely High</option>
                    </select>
                  </div>
                </div>

                <div className="form-row">
                  <div className="form-group">
                    <label>PLANET ORIGIN</label>
                    <input
                      type="text"
                      placeholder="e.g. Orion Spur Delta"
                      value={newOrigin}
                      onChange={(e) => setNewOrigin(e.target.value)}
                    />
                  </div>

                  <div className="form-group">
                    <label>CLASSIFICATION</label>
                    <input
                      type="text"
                      placeholder="e.g. Tesseract Core / Anomaly"
                      value={newClassification}
                      onChange={(e) => setNewClassification(e.target.value)}
                    />
                  </div>
                </div>

                <div className="form-group">
                  <label>SHORT DESCRIPTION *</label>
                  <input
                    type="text"
                    required
                    placeholder="Brief system overview or field assessment..."
                    value={newDescription}
                    onChange={(e) => setNewDescription(e.target.value)}
                  />
                </div>

                <div className="form-group">
                  <label>FULL CLASSIFIED LORE *</label>
                  <textarea
                    rows={4}
                    required
                    placeholder="Detailed historical background, discovery conditions, and biological or physical properties..."
                    value={newLore}
                    onChange={(e) => setNewLore(e.target.value)}
                  ></textarea>
                </div>

                <div className="form-actions">
                  <button
                    type="button"
                    className="btn-secondary"
                    onClick={() => setIsSubmitModalOpen(false)}
                  >
                    Cancel
                  </button>
                  <button type="submit" className="btn-primary">
                    Transmit Lore Entry
                  </button>
                </div>
              </form>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default LoreCodex;
