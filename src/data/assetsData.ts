export type AssetCategory = 'species' | 'world' | 'tech' | 'agent' | 'signal';

export interface AssetAttributes {
  planetOrigin?: string;
  dangerLevel?: 'Low' | 'Moderate' | 'High' | 'Extremely High' | 'Unknown' | 'Benign';
  classification?: string;
  status?: string;
  discoveryDate?: string;
  energyOutput?: string;
  clearanceLevel?: string;
  [key: string]: string | undefined;
}

export interface AssetItem {
  id: string;
  title: string;
  category: AssetCategory;
  description: string;
  lore: string;
  imagePath: string;
  attributes: AssetAttributes;
}

export const assetsData: AssetItem[] = [
  {
    id: 'alien_hero',
    title: 'Nexus Prime Central Observatory',
    category: 'world',
    description: 'The primary orbital command structure overseeing galactic deep-space signal monitoring and xenobiological indexing.',
    lore: 'Built during the First Convergence Era, Nexus Prime rests at the gravitational center of Sector 7. Its quantum array processes petabytes of tachyon signals every second.',
    imagePath: '/assets/alien_hero.jpg',
    attributes: { planetOrigin: 'Nexus Prime', dangerLevel: 'Low', classification: 'Orbital Complex', status: 'Active' }
  },
  {
    id: 'alien_signal',
    title: 'Vigil-9 Tachyon Pulse',
    category: 'signal',
    description: 'An ultra-wideband cosmic signal detected near the rim of the Andromeda anomaly.',
    lore: 'First intercepted at 04:00 UTC by the Deep Space Array. The pulse carries prime number sequences encoded in sub-space harmonic frequencies.',
    imagePath: '/assets/alien_signal.jpg',
    attributes: { planetOrigin: 'Andromeda Rim', dangerLevel: 'Unknown', classification: 'Extragalactic Signal', status: 'Deciphering' }
  },
  {
    id: 'alien_species_1',
    title: 'Luminari',
    category: 'species',
    description: 'Photonic lifeform capable of phasing through solid matter and manipulating electromagnetic fields.',
    lore: 'Native to the star factories of Cygnus X-1, Luminari communicate via spectral frequency shifts rather than acoustic waves.',
    imagePath: '/assets/alien_species_1.jpg',
    attributes: { planetOrigin: 'Cygnus X-1', dangerLevel: 'Benign', classification: 'Energy Being', status: 'Monitored' }
  },
  {
    id: 'alien_species_2',
    title: 'Kaelen Warrior',
    category: 'species',
    description: 'Biomechanical apex predator engineered with cybernetic chitin exoskeletons.',
    lore: 'Hailing from the volcanic crags of Kaelen-4, these warriors possess neural links connected directly to quantum targeting matrices.',
    imagePath: '/assets/alien_species_2.jpg',
    attributes: { planetOrigin: 'Kaelen-4', dangerLevel: 'High', classification: 'Biomechanical Organism', status: 'Restricted Access' }
  },
  {
    id: 'alien_species_3',
    title: 'Sylar Diplomat',
    category: 'species',
    description: 'A fluid light entity renowned across interstellar alliances for empathetic telepathy.',
    lore: 'Sylar diplomats can mimic the vocal harmonic signatures of any known species, serving as galactic peace brokers for three millennia.',
    imagePath: '/assets/alien_species_3.jpg',
    attributes: { planetOrigin: 'Sylar Basin', dangerLevel: 'Low', classification: 'Liquid Light Form', status: 'Allied' }
  },
  {
    id: 'alien_species_4',
    title: 'Void Entity',
    category: 'species',
    description: 'A non-Euclidean cosmic anomaly manifesting as dark energy strands.',
    lore: 'Observed at the event horizon of Sagittarius A*. Attempts to isolate the entity resulted in gravimetric distortions.',
    imagePath: '/assets/alien_species_4.jpg',
    attributes: { planetOrigin: 'Deep Void', dangerLevel: 'Extremely High', classification: 'Cosmic Anomaly', status: 'Contained' }
  },
  {
    id: 'alien_species_5',
    title: 'Chrono-Phantasm',
    category: 'species',
    description: 'A sentient temporal organism existing simultaneously in multiple timeline branches.',
    lore: 'Discovered within chronal fractures near Sector 9. Chrono-Phantasms leave residual tachyon decay trails whenever they shift state.',
    imagePath: '/assets/alien_species_5.jpg',
    attributes: { planetOrigin: 'Chronos Rift', dangerLevel: 'Moderate', classification: 'Temporal Energy Entity', status: 'Active Research' }
  },
  {
    id: 'alien_species_6',
    title: 'Xeno-Apex Leviathan',
    category: 'species',
    description: 'A massive chitinous deep-space hunter adapted to high-gravitational marine ecosystems.',
    lore: 'Inhabiting the abyss trenches of planet Thalassa-Prime, the Leviathan uses bioluminescent pulses to disorient prey.',
    imagePath: '/assets/alien_species_6.jpg',
    attributes: { planetOrigin: 'Thalassa-Prime', dangerLevel: 'Extremely High', classification: 'Abyssal Apex Predator', status: 'Quarantined' }
  },
  {
    id: 'alien_species_7',
    title: 'Crystalline Sybils',
    category: 'species',
    description: 'Harmonic crystal lattice entities that store galactic histories inside refractive facets.',
    lore: 'Found inside deep mantle caverns of Aurelia-6, Sybils resonate at frequencies that trigger telepathic visions in nearby sentient beings.',
    imagePath: '/assets/alien_species_7.jpg',
    attributes: { planetOrigin: 'Aurelia-6', dangerLevel: 'Low', classification: 'Harmonic Crystalline Entity', status: 'Protected' }
  },
  {
    id: 'alien_species_8',
    title: 'Aether-Winged Sentinel',
    category: 'species',
    description: 'Stellar nomad boasting wings forged from solar plasma filaments.',
    lore: 'Soaring through interstellar nebulae, Sentinels absorb stellar radiation and channel it to repair planetary atmospheric breaches.',
    imagePath: '/assets/alien_species_8.jpg',
    attributes: { planetOrigin: 'Solar Helix', dangerLevel: 'Benign', classification: 'Stellar Nomad', status: 'Observing' }
  },
  {
    id: 'alien_tech_1',
    title: 'Neural Matrix Array',
    category: 'tech',
    description: 'Sub-light quantum processing core capable of running hyper-dimensional neural simulations.',
    lore: 'Excavated from the ruins of Titan-3. The core continues to process data despite lacking an external power source for over 10,000 years.',
    imagePath: '/assets/alien_tech_1.jpg',
    attributes: { planetOrigin: 'Titan-3 Ruins', dangerLevel: 'Low', classification: 'Quantum Core', status: 'Operational' }
  },
  {
    id: 'alien_tech_2',
    title: 'Starlight Drive Engine',
    category: 'tech',
    description: 'Gravitational warp engine utilizing antimatter containment field channels.',
    lore: 'Recovered from an ancient derelict vessel in the Oort Cloud. Powered by stabilized singularity crystals.',
    imagePath: '/assets/alien_tech_2.jpg',
    attributes: { planetOrigin: 'Oort Derelict', dangerLevel: 'Moderate', classification: 'Warp Drive', status: 'Under Analysis' }
  },
  {
    id: 'alien_tech_3',
    title: 'Void Resonance Core',
    category: 'tech',
    description: 'Zero-point energy extractor tapping directly into dark matter vacuum fluctuations.',
    lore: 'Generates unlimited clean energy while projecting a localized dampening field that nullifies thermal signatures.',
    imagePath: '/assets/alien_tech_3.jpg',
    attributes: { planetOrigin: 'Kepler-186f', dangerLevel: 'High', classification: 'Zero-Point Generator', status: 'Experimental' }
  },
  {
    id: 'alien_tech_4',
    title: 'Quantum Matrix Core',
    category: 'tech',
    description: 'Hyper-dimensional tesseract memory drive storing multidimensional quantum state vectors.',
    lore: 'Encased in a levitating stasis ring, the core holds encrypted blueprints for wormhole transit nodes.',
    imagePath: '/assets/alien_tech_4.jpg',
    attributes: { planetOrigin: 'Verdant-X', dangerLevel: 'Moderate', classification: 'Tesseract Storage Unit', status: 'Encrypted' }
  },
  {
    id: 'alien_tech_5',
    title: 'Neural Resonance Relic',
    category: 'tech',
    description: 'Ancient telepathic relay monolith inscribed with self-luminescent alien runes.',
    lore: 'Acts as a interplanetary subspace broadcaster, converting cognitive thoughts into localized radio bursts.',
    imagePath: '/assets/alien_tech_5.jpg',
    attributes: { planetOrigin: 'Ancient Monolith Ridge', dangerLevel: 'Low', classification: 'Subspace Relic', status: 'Broadcasting' }
  },
  {
    id: 'alien_tech_6',
    title: 'Hyper-Drive Singularity Monolith',
    category: 'tech',
    description: 'Miniaturized black hole containment unit powering fast-than-light warp gates.',
    lore: 'Harvested from the core of a collapsed neutron star, the monolith bends spacetime in a 50km radius.',
    imagePath: '/assets/alien_tech_6.jpg',
    attributes: { planetOrigin: 'Neutron Core 9', dangerLevel: 'Extremely High', classification: 'Gravitational Engine', status: 'Critical Shielding' }
  },
  {
    id: 'alien_tech_7',
    title: 'Chronos Dial',
    category: 'tech',
    description: 'Rotatable chronal displacement ring interface for calibrating temporal flux coordinates.',
    lore: 'Engineered by an unknown precursor race to measure time across non-linear dimensions.',
    imagePath: '/assets/alien_tech_7.jpg',
    attributes: { planetOrigin: 'Chrono-Station Zeta', dangerLevel: 'High', classification: 'Temporal Interface', status: 'Locked' }
  },
  {
    id: 'alien_world_2',
    title: 'Vespera Gas Giant',
    category: 'world',
    description: 'A stormy gas giant with glowing auroral bands and atmospheric floating research stations.',
    lore: 'Vespera\'s lower atmosphere contains high concentrations of rare noble gases used in hyper-drive jump drives.',
    imagePath: '/assets/alien_world_2.jpg',
    attributes: { planetOrigin: 'Vespera System', dangerLevel: 'Moderate', classification: 'Gas Giant', status: 'Explored' }
  },
  {
    id: 'alien_world_3',
    title: 'Xylos Crystal Spire Realm',
    category: 'world',
    description: 'A crystalline desert planet dominated by kilometer-tall quartz spires.',
    lore: 'Sunlight refracting through the spires creates perpetual rainbow lightstorms across the desert plains.',
    imagePath: '/assets/alien_world_3.jpg',
    attributes: { planetOrigin: 'Xylos-4', dangerLevel: 'Low', classification: 'Crystalline World', status: 'Colonized' }
  },
  {
    id: 'alien_world_4',
    title: 'Nebula Prime',
    category: 'world',
    description: 'A young planet situated inside an active stellar nursery nebula.',
    lore: 'The night sky of Nebula Prime is lit with vibrant violet and gold cloud curtains, making night as bright as twilight.',
    imagePath: '/assets/alien_world_4.jpg',
    attributes: { planetOrigin: 'Orion Nursery', dangerLevel: 'Low', classification: 'Nebular Planet', status: 'Uncharted' }
  },
  {
    id: 'alien_landscape_5',
    title: 'Bioluminescent Crystal Canyon',
    category: 'world',
    description: 'Deep crystal canyon bathed in violet bioluminescence beneath twin crescent moons.',
    lore: 'Carved by ancient plasma rivers, the canyon walls emit soft purple light that pulses in rhythm with planetary magnetic tides.',
    imagePath: '/assets/alien_landscape_5.jpg',
    attributes: { planetOrigin: 'Aurelia Prime', dangerLevel: 'Low', classification: 'Bioluminescent Canyon', status: 'Surveyed' }
  },
  {
    id: 'alien_landscape_6',
    title: 'Sky Haven Floating Islands',
    category: 'world',
    description: 'Antigravity landmasses floating above neon cloud strata with glowing cyan waterfalls.',
    lore: 'Held aloft by dense zero-point mineral deposits in the lower mantle, these islands house rare airborne flora.',
    imagePath: '/assets/alien_landscape_6.jpg',
    attributes: { planetOrigin: 'Zephyrus-7', dangerLevel: 'Low', classification: 'Floating Landforms', status: 'Settled' }
  },
  {
    id: 'alien_landscape_7',
    title: 'Subterranean Magma Cavern',
    category: 'world',
    description: 'Deep mantle cavern featuring massive crystal pillars rising over subterranean lava flows.',
    lore: 'Extreme geothermal pressure nurtures heat-resistant quartz crystals that glow with stored magma energy.',
    imagePath: '/assets/alien_landscape_7.jpg',
    attributes: { planetOrigin: 'Vulcan-9', dangerLevel: 'High', classification: 'Geothermal Cavern', status: 'Hazard Zone' }
  },
  {
    id: 'alien_landscape_8',
    title: 'Bioluminescent Oceanic Trench',
    category: 'world',
    description: 'Sub-sea abyssal canyon adorned with glowing coral spires and floating plasma medusae.',
    lore: 'Pressure in the trench exceeds 10,000 atmospheres, yet vibrant aquatic ecosystems thrive under thermal vent light.',
    imagePath: '/assets/alien_landscape_8.jpg',
    attributes: { planetOrigin: 'Poseidon-X', dangerLevel: 'Moderate', classification: 'Abyssal Trench', status: 'Mapping in Progress' }
  },
  {
    id: 'agent_coder',
    title: 'Agent Coder Glyph',
    category: 'agent',
    description: 'Specialized cybernetic intelligence avatar tasked with code synthesis, algorithm optimization, and logic compilation.',
    lore: 'Created during the Nexus-7 initialization protocol. Agent Coder translates complex xenobiological data streams into clean system architecture.',
    imagePath: '/assets/agent_coder.jpg',
    attributes: { planetOrigin: 'Nexus Core', dangerLevel: 'Benign', classification: 'Autonomous Agent Avatar', status: 'Active' }
  },
  {
    id: 'agent_artist',
    title: 'Agent Artist Glyph',
    category: 'agent',
    description: 'Creative visual intelligence avatar responsible for neural asset generation, UI styling, and aesthetic synthesis.',
    lore: 'Engineered to capture the beauty of uncharted stellar phenomena and translate alien sensory inputs into visual masterpieces.',
    imagePath: '/assets/agent_artist.jpg',
    attributes: { planetOrigin: 'Nexus Core', dangerLevel: 'Benign', classification: 'Creative Agent Avatar', status: 'Active' }
  },
  {
    id: 'agent_planner',
    title: 'Agent Planner Glyph',
    category: 'agent',
    description: 'Strategic planning intelligence avatar specializing in workflow orchestration, milestone tracking, and task decomposition.',
    lore: 'Operates the central constellation matrix of Nexus Prime, maintaining system integrity and coordinate alignment.',
    imagePath: '/assets/agent_planner.jpg',
    attributes: { planetOrigin: 'Nexus Core', dangerLevel: 'Benign', classification: 'Orchestrator Agent Avatar', status: 'Active' }
  },
  {
    id: 'alien_starmap_1',
    title: 'Sector 7 Celestial Chart',
    category: 'agent',
    description: 'Interactive polar coordinate starmap charting jump routes, anomalies, and sector planetary clusters.',
    lore: 'Compiled over three stellar cycles by deep space reconnaissance drones. Serves as the primary navigation map for Nexus-7 expeditions.',
    imagePath: '/assets/alien_starmap_1.jpg',
    attributes: { planetOrigin: 'Sector 7 System', dangerLevel: 'Low', classification: 'Navigation Starmap', status: 'Verified' }
  }
];

export default assetsData;
