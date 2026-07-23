import React, { useState, useEffect, useMemo } from 'react';
import { Search, Filter, Bookmark, PlusCircle, BookOpen, Globe, Cpu, Users, Radio, Sparkles, X, Check, Clock, Unlock, Database } from 'lucide-react';
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
  const [isSearchFocused, setIsSearchFocused] = useState(false);
  
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

  const recentEntries = useMemo(() => {
    return [...allAssets].reverse().slice(0, 4);
  }, [allAssets]);

  const decryptedFiles = useMemo(() => {
    return allAssets.filter(item => item.attributes.clearanceLevel === 'Top Secret' || item.attributes.clearanceLevel === 'Classified').slice(0, 4);
  }, [allAssets]);

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
    { label: 'All', icon: Database },
    { label: 'Origins', icon: Globe },
    { label: 'Tech', icon: Cpu },
    { label: 'Species', icon: Users },
    { label: 'Cosmic', icon: Sparkles },
    { label: 'Agent Logs', icon: Radio },
    { label: 'Bookmarked', icon: Bookmark },
  ];

  return (
    <div className="page-container animate-fade-in">
      <div className="page-header futuristic-header">
        <div className="codex-header-badge neon-pulse">
          <BookOpen size={16} /> DEEP INTERSTELLAR LORE CODEX
        </div>
        <h1 className="page-title glow-text text-gradient glitched-title">LORE CODEX</h1>
        <p className="page-subtitle typing-effect">
          Comprehensive xenobiological, technological, and cosmic intel repository ({allAssets.length} Records)
        </p>
      </div>

      <div className="codex-layout">
        {/* Sidebar Component */}
        <aside className="codex-sidebar glass-panel futuristic-borders">
          <div className="sidebar-section">
            <h3 className="sidebar-title glow-text"><Clock size={18} className="sidebar-icon" /> Recent Entries</h3>
            <ul className="sidebar-list">
              {recentEntries.map(entry => (
                <li key={entry.id} className="sidebar-item hover-glow glass-panel-inner" onClick={() => setSelectedItem(entry)}>
                  <div className="sidebar-item-content">
                    <span className="sidebar-item-title text-truncate">{entry.title}</span>
                    <span className="sidebar-item-meta">{entry.attributes.discoveryDate || 'Unknown Date'}</span>
                  </div>
                </li>
              ))}
            </ul>
          </div>
          
          <div className="sidebar-separator"></div>

          <div className="sidebar-section">
            <h3 className="sidebar-title glow-text"><Unlock size={18} className="sidebar-icon" /> Decrypted Files</h3>
            <ul className="sidebar-list">
              {decryptedFiles.map(entry => (
                <li key={entry.id} className="sidebar-item hover-glow glass-panel-inner" onClick={() => setSelectedItem(entry)}>
                  <div className="sidebar-item-content">
                    <span className="sidebar-item-title text-truncate">{entry.title}</span>
                    <span className="sidebar-item-meta text-alert">{entry.attributes.clearanceLevel || 'Classified'}</span>
                  </div>
                </li>
              ))}
            </ul>
          </div>
        </aside>

        <main className="codex-main">
          {/* Advanced Search and Action Toolbar */}
          <div className={`codex-toolbar glass-panel search-toolbar ${isSearchFocused ? 'search-focused' : ''}`}>
            <div className="search-box-advanced">
              <Search size={22} className={`search-icon-advanced ${isSearchFocused ? 'icon-active' : ''}`} />
              <input
                type="text"
                placeholder="Search full-text lore, species, tech, origin planet..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                onFocus={() => setIsSearchFocused(true)}
                onBlur={() => setIsSearchFocused(false)}
                className="search-input-advanced"
              />
              <div className="search-fx-line"></div>
              {searchQuery && (
                <button className="clear-search-advanced" onClick={() => setSearchQuery('')}>
                  <X size={18} />
                </button>
              )}
            </div>

            <button className="btn-primary submit-lore-btn cyber-btn" onClick={() => setIsSubmitModalOpen(true)}>
              <span className="cyber-btn-glitch"></span>
              <PlusCircle size={18} /> SUBMIT LORE
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
                  className={`pill-btn cyber-pill ${isActive ? 'active' : ''}`}
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
              <div className="empty-state p-12 text-center rounded-2xl bg-cyan-950/10 border border-cyan-500/20 backdrop-blur-md">
                <Filter size={56} className="text-muted holo-icon animate-pulse mx-auto mb-4" />
                <h3 className="text-2xl font-bold text-cyan-300 mb-2">No Lore Entries Match Your Filter Criteria</h3>
                <p className="text-slate-400 font-mono text-sm mb-6">Adjust your search parameters or category filter to discover more intelligence.</p>
                <button className="btn-secondary cyber-btn" onClick={() => { setSearchQuery(''); setSelectedCategory('All'); }}>
                  Reset Filters
                </button>
              </div>
            ) : (
              filteredAssets.map((item) => {
                const isBookmarked = bookmarkedIds.includes(item.id);
                return (
                  <div key={item.id} className="codex-card glass-panel hover-glow cyber-card">
                    <div className="codex-card-image-wrap" onClick={() => setSelectedItem(item)}>
                      <img src={item.imagePath} alt={item.title} className="codex-card-image" />
                      <div className="cyber-overlay"></div>
                      <span className="codex-category-tag cyber-tag">{item.category}</span>
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
                      <div className="codex-origin cyber-origin">
                        <Globe size={14} className="spin-slow" /> {item.attributes.planetOrigin || 'Unmapped Coordinates'}
                      </div>
                      <h3 className="codex-card-title glow-text-sm">{item.title}</h3>
                      <p className="codex-card-desc">{item.description}</p>
                      <div className="codex-lore-snippet-container">
                         <p className="codex-lore-snippet">{item.lore.slice(0, 110)}...</p>
                      </div>

                      <div className="codex-card-footer">
                        <span className="read-more-link cyber-link">Inspect Intel &rarr;</span>
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
        </main>
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
        <div className="modal-backdrop cyber-backdrop" onClick={() => setIsSubmitModalOpen(false)}>
          <div
            className="modal-container glass-panel futuristic-borders animate-fade-in submit-lore-modal"
            onClick={(e) => e.stopPropagation()}
          >
            <button className="modal-close-btn cyber-close" onClick={() => setIsSubmitModalOpen(false)}>
              <X size={24} />
            </button>

            <div className="modal-header">
              <h2 className="modal-title glow-text text-gradient text-3xl font-black mb-2">SUBMIT DEEP SPACE LORE</h2>
              <p className="modal-id holo-text text-cyan-400/70 font-mono text-xs uppercase tracking-widest mb-6">BROADCAST NEW INTELLIGENCE TO NEXUS-7 REPOSITORY</p>
            </div>

            {submitSuccess ? (
              <div className="submit-success p-12 text-center rounded-2xl bg-cyan-900/20 border border-cyan-500/30">
                <Check size={48} className="mx-auto text-cyan-400 mb-4 animate-pulse" />
                <h3 className="glow-text text-2xl font-bold text-cyan-300 mb-2">Lore Entry Transmitted!</h3>
                <p className="text-slate-300 font-mono text-sm">Your intelligence log has been synced to the global network.</p>
              </div>
            ) : (
              <form onSubmit={handleAddLore} className="submit-lore-form cyber-form">
                <div className="form-group">
                  <label>ENTRY TITLE *</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Zenith Graviton Resonator"
                    value={newTitle}
                    onChange={(e) => setNewTitle(e.target.value)}
                    className="cyber-input"
                  />
                </div>

                <div className="form-row">
                  <div className="form-group">
                    <label>CATEGORY *</label>
                    <select
                      value={newCategory}
                      onChange={(e) => setNewCategory(e.target.value as AssetCategory)}
                      className="cyber-input"
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
                      className="cyber-input"
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
                      className="cyber-input"
                    />
                  </div>

                  <div className="form-group">
                    <label>CLASSIFICATION</label>
                    <input
                      type="text"
                      placeholder="e.g. Tesseract Core / Anomaly"
                      value={newClassification}
                      onChange={(e) => setNewClassification(e.target.value)}
                      className="cyber-input"
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
                    className="cyber-input"
                  />
                </div>

                <div className="form-group">
                  <label>FULL CLASSIFIED LORE *</label>
                  <textarea
                    rows={4}
                    required
                    placeholder="Detailed historical background, discovery conditions..."
                    value={newLore}
                    onChange={(e) => setNewLore(e.target.value)}
                    className="cyber-input"
                  ></textarea>
                </div>

                <div className="form-actions">
                  <button
                    type="button"
                    className="btn-secondary cyber-btn-outline"
                    onClick={() => setIsSubmitModalOpen(false)}
                  >
                    Cancel
                  </button>
                  <button type="submit" className="btn-primary cyber-btn">
                    Transmit
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

