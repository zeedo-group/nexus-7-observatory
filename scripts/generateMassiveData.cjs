const fs = require('fs');

const speciesAdjectives = ["Bioluminescent", "Cybernetic", "Ethereal", "Silicate", "Plasma-based", "Symbiotic", "Hive-mind", "Chronal", "Void", "Quantum", "Necrotic", "Astral", "Crystalline", "Fungal", "Revenant"];
const speciesNouns = ["Arachnids", "Seraphim", "Goliaths", "Wraiths", "Morphs", "Cephalopods", "Constructs", "Nomads", "Weavers", "Elders", "Symbiotes", "Overlords", "Husk", "Sentinels", "Colossus"];

const worldAdjectives = ["Obsidian", "Shattered", "Verdant", "Toxic", "Frozen", "Crystalline", "Volcanic", "Gas", "Oceanic", "Subterranean", "Fractured", "Echoing", "Hollow", "Blistering", "Silent"];
const worldNouns = ["Citadel", "Wasteland", "Sanctuary", "Nexus", "Abyss", "Spire", "Labyrinth", "Core", "Expanse", "Pulsar", "Trench", "Rift", "Monolith", "Crucible", "Haven"];

const galaxyNames = ["Andromeda's Veil", "The Abyssal Cluster", "Cygnus Prime", "Orion's Anomaly", "The Obsidian Vortex"];
const starNames = ["Alpha", "Beta", "Gamma", "Delta", "Epsilon", "Zeta", "Sigma", "Tau", "Omega", "Prime"];

const galaxies = [];
const stars = [];
const planets = [];
const species = [];
const artifacts = [];

// Image pools (combining original seeds and new clean seeds)
const galaxyImages = ['/assets/alien_hero.jpg'];
const starImages = ['/assets/alien_signal.jpg'];
const aiWorldImages = [
  '/assets/alien_world_2.jpg',
  '/assets/alien_world_3.jpg',
  '/assets/alien_world_4.jpg',
  '/assets/clean_world_1.jpg',
  '/assets/new_world_1.jpg',
  '/assets/new_world_2.jpg',
  '/assets/new_world_3.jpg',
  '/assets/new_world_5.jpg',
  '/assets/new_world_6.jpg',
  '/assets/new_world_7.jpg'
];
const aiSpeciesImages = [
  '/assets/alien_species_1.jpg',
  '/assets/alien_species_2.jpg',
  '/assets/alien_species_3.jpg',
  '/assets/alien_species_4.jpg',
  '/assets/alien_species_5.jpg',
  '/assets/clean_species_1.jpg',
  '/assets/new_species_3.jpg',
  '/assets/new_species_6.jpg',
  '/assets/new_species_7.jpg'
];
const aiArtifactImages = [
  '/assets/alien_tech_1.jpg',
  '/assets/alien_tech_2.jpg',
  '/assets/alien_tech_3.jpg',
  '/assets/alien_tech_4.jpg',
  '/assets/alien_tech_5.jpg',
  '/assets/clean_tech_1.jpg',
  '/assets/new_tech_1.jpg',
  '/assets/new_tech_2.jpg',
  '/assets/new_tech_4.jpg',
  '/assets/new_tech_6.jpg'
];

function r(arr) { return arr[Math.floor(Math.random() * arr.length)]; }
function rCoord(min, max) { return Math.floor(Math.random() * (max - min + 1) + min); }

let stockImages = [];
try {
  const files = fs.readdirSync('./public/assets/stock');
  stockImages = files.filter(f => f.endsWith('.jpg') || f.endsWith('.png')).map(f => '/assets/stock/' + f);
} catch (e) {
  console.warn('Could not read stock images directory. Fallback array empty.');
}

// Mix AI images with dynamic downloaded stock photos to ensure hundreds of unique high quality images
function getRandomStockImage() {
  if (stockImages.length > 0) {
    return r(stockImages);
  }
  return '/assets/alien_hero.jpg'; // safe fallback
}

const massiveData = [];

// 1. Generate 5 Galaxies
for (let i = 0; i < 5; i++) {
  const galX = rCoord(10, 90);
  const galY = rCoord(10, 90);
  const g = {
    id: `galaxy_${i}`,
    title: galaxyNames[i],
    category: 'world',
    description: `A massive galactic cluster located at X:${galX} Y:${galY}. Contains billions of stars and numerous hyper-advanced civilizations.`,
    lore: `The ${galaxyNames[i]} was first mapped by autonomous scout drones during the early expansion era. It remains largely unexplored.`,
    imagePath: getRandomStockImage(),
    attributes: {
      classification: 'Spiral Galaxy',
      dangerLevel: 'Unknown',
      type: 'galaxy',
      x: String(galX),
      y: String(galY)
    }
  };
  galaxies.push(g);
  massiveData.push(g);
}

// 2. Generate 100 Stars (20 per galaxy)
for (let i = 0; i < 100; i++) {
  const parentGal = galaxies[Math.floor(i / 20)];
  const starX = parentGal.attributes.x + (Math.random() * 20 - 10);
  const starY = parentGal.attributes.y + (Math.random() * 20 - 10);
  
  const s = {
    id: `star_${i}`,
    title: `${parentGal.title.split(' ')[0]} ${r(starNames)}-${i}`,
    category: 'world',
    description: `A prominent star system in ${parentGal.title}.`,
    lore: `Emits highly unusual radiation patterns, suggesting large-scale megastructures in orbit.`,
    imagePath: getRandomStockImage(),
    attributes: {
      classification: r(['Main Sequence', 'Red Dwarf', 'Blue Giant', 'Neutron Star']),
      dangerLevel: 'Moderate',
      type: 'star',
      x: String(Math.max(0, Math.min(100, starX))),
      y: String(Math.max(0, Math.min(100, starY))),
      parentGalaxy: parentGal.id
    }
  };
  stars.push(s);
  massiveData.push(s);
}

// 3. Generate 100 Worlds (assigned to stars)
for (let i = 0; i < 100; i++) {
  const parentStar = stars[i];
  const adj = r(worldAdjectives);
  const noun = r(worldNouns);
  
  const planetX = parentStar.attributes.x + (Math.random() * 2 - 1);
  const planetY = parentStar.attributes.y + (Math.random() * 2 - 1);
  
  const w = {
    id: `massive_world_${i}`,
    title: `The ${adj} ${noun}`,
    category: 'world',
    description: `An exotic planet orbiting ${parentStar.title}. Massive megastructures dot the surface.`,
    lore: `Deep core scans reveal that the planet is not entirely natural. Anyone attempting to land faces extreme risk.`,
    imagePath: (Math.random() > 0.5 && aiWorldImages.length > 0) ? r(aiWorldImages) : getRandomStockImage(),
    attributes: {
      planetOrigin: parentStar.title,
      atmosphere: r(['Toxic', 'Oxygen-rich', 'Methane', 'None', 'Plasma', 'Helium-3']),
      gravityG: (Math.random() * 3 + 0.1).toFixed(2),
      classification: r(['Terrestrial', 'Gas Giant', 'Ice World', 'Lava Planet', 'Oceanic']),
      dangerLevel: r(['High', 'Extremely High']),
      type: 'planet',
      x: String(Math.max(0, Math.min(100, planetX))),
      y: String(Math.max(0, Math.min(100, planetY))),
      parentStar: parentStar.id
    }
  };
  planets.push(w);
  massiveData.push(w);
}

// 4. Generate 100 Species
for (let i = 0; i < 100; i++) {
  const adj = r(speciesAdjectives);
  const noun = r(speciesNouns);
  
  const s = {
    id: `massive_species_${i}`,
    title: `${adj} ${noun}`,
    category: 'species',
    description: `A formidable civilization that has expanded aggressively across the local cluster.`,
    lore: `First encountered in Cycle ${Math.floor(Math.random()*9999)}. Their technology is beyond our comprehension.`,
    imagePath: (Math.random() > 0.5 && aiSpeciesImages.length > 0) ? r(aiSpeciesImages) : getRandomStockImage(),
    attributes: {
      planetOrigin: r(planets).title,
      techLevel: r(['Tier 1', 'Tier 2', 'Tier 3', 'Tier 4', 'Tier 5 (Ascended)']),
      classification: r(['Carbon-based', 'Silicon-based', 'Energy Being', 'Biomechanical']),
      dangerLevel: r(['Low', 'Moderate', 'High', 'Catastrophic', 'Existential'])
    }
  };
  species.push(s);
  massiveData.push(s);
}

const fileContent = `
import type { AssetItem } from './assetsData';

export const massiveAssetsData: AssetItem[] = ${JSON.stringify(massiveData, null, 2)};
`;

fs.writeFileSync('./src/data/massiveData.ts', fileContent);
console.log('Successfully generated hierarchical massive data entries in src/data/massiveData.ts');
