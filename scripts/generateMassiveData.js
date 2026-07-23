const fs = require('fs');

const speciesAdjectives = ["Bioluminescent", "Cybernetic", "Ethereal", "Silicate", "Plasma-based", "Symbiotic", "Hive-mind", "Chronal", "Void", "Quantum", "Necrotic", "Astral", "Crystalline", "Fungal", "Revenant"];
const speciesNouns = ["Arachnids", "Seraphim", "Goliaths", "Wraiths", "Morphs", "Cephalopods", "Constructs", "Nomads", "Weavers", "Elders", "Symbiotes", "Overlords", "Husk", "Sentinels", "Colossus"];

const worldAdjectives = ["Obsidian", "Shattered", "Verdant", "Toxic", "Frozen", "Crystalline", "Volcanic", "Gas", "Oceanic", "Subterranean", "Fractured", "Echoing", "Hollow", "Blistering", "Silent"];
const worldNouns = ["Citadel", "Wasteland", "Sanctuary", "Nexus", "Abyss", "Spire", "Labyrinth", "Core", "Expanse", "Pulsar", "Trench", "Rift", "Monolith", "Crucible", "Haven"];

const speciesImages = ['/alien_species_1_1784744202290.jpg', '/alien_species_2_1784744257049.jpg', '/alien_species_3_1784744269103.jpg', '/alien_species_4_1784744348495.jpg'];
const worldImages = ['/alien_world_2_1784744234712.jpg', '/alien_world_3_1784744245450.jpg', '/alien_world_4_1784744295336.jpg'];

function r(arr) { return arr[Math.floor(Math.random() * arr.length)]; }

function generateSpecies(id) {
  const adj = r(speciesAdjectives);
  const noun = r(speciesNouns);
  const img = r(speciesImages);
  const civType = `Type ${Math.floor(Math.random() * 4 + 1)} Kardashev`;
  const galaxies = Math.floor(Math.random() * 500);
  
  return {
    id: `massive_species_${id}`,
    title: `${adj} ${noun}`,
    category: 'species',
    description: `The ${adj} ${noun} are a formidable ${civType} civilization that has expanded aggressively across the local cluster. Their biological or cybernetic composition allows them to thrive in environments that would instantly crush lesser beings. Observers have noted their massive orbital infrastructure and terrifying efficiency.\n\nTheir primary mode of expansion relies on rapid assimilation of planetary resources, converting raw matter into massive Dyson swarms to fuel their endless computing matrices and war machines.`,
    lore: `First encountered in Cycle ${Math.floor(Math.random()*9999)}, the ${noun} immediately established dominance over ${galaxies} star systems. Ancient precursor texts refer to them as the "Eradicators of the Void". It is heavily rumored that their central intelligence operates from a dimension parallel to ours, transmitting commands via quantum entanglement.\n\nAttempts to communicate have resulted in catastrophic cognitive feedback loops for human telepaths. Their technology is beyond our comprehension, utilizing dark energy as a primary power source and bending spacetime to traverse galaxies instantaneously.`,
    imagePath: img,
    attributes: {
      planetOrigin: `Sector ${Math.floor(Math.random()*999)} - Unknown`,
      dangerLevel: r(['Low', 'Moderate', 'High', 'Extremely High', 'Catastrophic', 'Existential']),
      classification: r(['Biological Hive', 'Synthetic Swarm', 'Energy Beings', 'Post-Physical']),
      cssFilter: `hue-rotate(${Math.floor(Math.random()*360)}deg) saturate(${100 + Math.floor(Math.random()*150)}%) contrast(${100 + Math.floor(Math.random()*50)}%)`,
      civilizationType: civType,
      controlledGalaxies: `${galaxies} Star Systems`,
      infrastructure: r(['Dyson Spheres', 'Orbital Rings', 'Subterranean Hives', 'Nomadic Fleets', 'Stellar Engines']),
      techProgress: r(['Singularity', 'Post-Scarcity', 'Ascended', 'Matrioshka Brain Builders']),
      dimensionalResonance: `${(Math.random() * 100).toFixed(2)} THz`
    }
  };
}

function generateWorld(id) {
  const adj = r(worldAdjectives);
  const noun = r(worldNouns);
  const img = r(worldImages);
  
  return {
    id: `massive_world_${id}`,
    title: `The ${adj} ${noun}`,
    category: 'world',
    description: `The ${adj} ${noun} is a planetary body of immense scale and terrifying beauty. It defies traditional astrophysical models, boasting a gravity well that fluctuates wildly and an atmosphere saturated with highly exotic particles. Massive megastructures dot the surface, hinting at a civilization that once commanded the power of stars.\n\nThe surface is a chaotic mix of volatile energy storms and dead zones where time itself seems to stand still. Scans indicate massive subterranean networks spanning the entire crust, potentially housing dormant precursor technology.`,
    lore: `Discovered by a rogue scout ship during the Orion Expansion, The ${adj} ${noun} immediately caused navigational computers to crash due to its intense magnetic anomalies. Legends say this world was the birthplace of a forgotten empire that attempted to weaponize black holes. \n\nDeep core scans reveal that the planet is not entirely natural. It appears to be an artificially constructed shell surrounding a singularity, acting as an eternal prison or a massive stellar engine. Anyone attempting to land on the surface faces a 99.9% mortality rate due to the unpredictable temporal rifts.`,
    imagePath: img,
    attributes: {
      planetOrigin: `Unknown Quadrant X-${Math.floor(Math.random()*999)}`,
      dangerLevel: r(['High', 'Extremely High', 'Catastrophic', 'Existential']),
      classification: r(['Megastructure', 'Rogue Planet', 'Gas Giant Core', 'Shattered World', 'Artificial Sphere']),
      cssFilter: `hue-rotate(${Math.floor(Math.random()*360)}deg) saturate(${100 + Math.floor(Math.random()*150)}%) contrast(${100 + Math.floor(Math.random()*50)}%)`,
      atmosphere: r(['Toxic Plasma', 'Zero-Atmosphere', 'Dense Acid', 'Hyper-Oxygenated', 'Chronal Gas']),
      gravityG: `${(Math.random() * 5 + 0.1).toFixed(2)} G`,
      coreTemperature: `${Math.floor(Math.random() * 100000)} K`,
      anomalies: r(['Temporal Rifts', 'Gravity Wells', 'Sentient Storms', 'Spatial Distortions'])
    }
  };
}

const massiveData = [];
for (let i = 1; i <= 100; i++) massiveData.push(generateSpecies(i));
for (let i = 1; i <= 100; i++) massiveData.push(generateWorld(i));

const fileContent = `
import { AssetItem } from './assetsData';

export const massiveAssetsData: AssetItem[] = ${JSON.stringify(massiveData, null, 2)};
`;

fs.mkdirSync('./scripts', { recursive: true });
fs.writeFileSync('./scripts/generateMassiveData.js', '// Generated'); // just touch
fs.writeFileSync('./src/data/massiveData.ts', fileContent);
console.log('Successfully generated 200 massive data entries in src/data/massiveData.ts');
