import { Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar';
import Home from './pages/Home';
import LoreCodex from './pages/LoreCodex';
import AgentHub from './pages/AgentHub';
import Species from './pages/Species';
import Artifacts from './pages/Artifacts';
import Worlds from './pages/Worlds';
import Starmap from './pages/Starmap';
import Transmissions from './pages/Transmissions';

function App() {
  return (
    <div className="app-container">
      <Navbar />
      <main className="content">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/lore" element={<LoreCodex />} />
          <Route path="/agents" element={<AgentHub />} />
          <Route path="/species" element={<Species />} />
          <Route path="/artifacts" element={<Artifacts />} />
          <Route path="/worlds" element={<Worlds />} />
          <Route path="/starmap" element={<Starmap />} />
          <Route path="/transmissions" element={<Transmissions />} />
        </Routes>
      </main>
    </div>
  );
}

export default App;
