import { Link, useLocation } from 'react-router-dom';
import { Menu, X, Hexagon, BookOpen, Bot, Compass, Radio, Users, Globe, Cpu } from 'lucide-react';
import { useState } from 'react';
import './Navbar.css';

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const location = useLocation();

  const navLinks = [
    { path: '/', label: 'Portal', icon: Hexagon },
    { path: '/lore', label: 'Lore Codex', icon: BookOpen },
    { path: '/agents', label: 'Agent Hub', icon: Bot },
    { path: '/starmap', label: 'Starmap', icon: Compass },
    { path: '/transmissions', label: 'Transmissions', icon: Radio },
    { path: '/species', label: 'Species Archive', icon: Users },
    { path: '/worlds', label: 'Alien Worlds', icon: Globe },
    { path: '/artifacts', label: 'Artifacts', icon: Cpu },
  ];

  return (
    <nav className="navbar glass-panel">
      <div className="nav-brand">
        <Link to="/" className="brand-link">
          <Hexagon className="brand-icon hover-glow" size={32} />
          <span className="brand-text text-gradient">NEXUS-7</span>
        </Link>
      </div>

      <div className="nav-links desktop-only">
        {navLinks.map((link) => {
          const Icon = link.icon;
          const isActive = location.pathname === link.path;
          return (
            <Link
              key={link.path}
              to={link.path}
              className={`nav-item ${isActive ? 'active' : ''}`}
            >
              <Icon size={16} className="nav-icon" />
              <span>{link.label}</span>
            </Link>
          );
        })}
      </div>

      <button className="mobile-toggle" onClick={() => setIsOpen(!isOpen)} aria-label="Toggle Navigation Menu">
        {isOpen ? <X size={28} className="text-gradient" /> : <Menu size={28} className="text-gradient" />}
      </button>

      {isOpen && (
        <div className="mobile-menu glass-panel animate-fade-in">
          {navLinks.map((link) => {
            const Icon = link.icon;
            const isActive = location.pathname === link.path;
            return (
              <Link
                key={link.path}
                to={link.path}
                className={`nav-item ${isActive ? 'active' : ''}`}
                onClick={() => setIsOpen(false)}
              >
                <Icon size={18} className="nav-icon" />
                <span>{link.label}</span>
              </Link>
            );
          })}
        </div>
      )}
    </nav>
  );
};

export default Navbar;
