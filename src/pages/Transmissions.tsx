import React, { useState, useEffect, useRef } from 'react';
import { Radio, Volume2, VolumeX, Play, Pause, Activity, Sliders, ShieldCheck, Terminal, Maximize2, RefreshCw } from 'lucide-react';
import assetsData, { type AssetItem } from '../data/assetsData';
import AssetModal from '../components/AssetModal';
import './Transmissions.css';

interface SignalLogItem {
  id: string;
  timestamp: string;
  frequency: string;
  source: string;
  decryptionRatio: number;
  status: 'DECRYPTED' | 'DECIPHERING' | 'LOCKED';
  asset?: AssetItem;
  transcript: string;
}

export const Transmissions: React.FC = () => {
  const [isPlaying, setIsPlaying] = useState<boolean>(true);
  const [isAudioEnabled, setIsAudioEnabled] = useState<boolean>(false);
  const [frequency, setFrequency] = useState<number>(14.8);
  const [amplitude, setAmplitude] = useState<number>(50);
  const [waveMode, setWaveMode] = useState<'sine' | 'cybernetic' | 'quantum'>('cybernetic');
  const [selectedSignalId, setSelectedSignalId] = useState<string>('alien_signal');
  const [detailModalItem, setDetailModalItem] = useState<AssetItem | null>(null);

  // Typewriter effect state for translated alien text stream
  const [displayText, setDisplayText] = useState<string>('');
  const [typingIndex, setTypingIndex] = useState<number>(0);

  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const audioCtxRef = useRef<AudioContext | null>(null);
  const oscRef = useRef<OscillatorNode | null>(null);
  const gainRef = useRef<GainNode | null>(null);

  // Signal logs
  const signalLogs: SignalLogItem[] = [
    {
      id: 'alien_signal',
      timestamp: '2026-07-22 21:30 UTC',
      frequency: '14.8 GHz Sub-space',
      source: 'Andromeda Anomaly Rim',
      decryptionRatio: 100,
      status: 'DECRYPTED',
      asset: assetsData.find((a) => a.id === 'alien_signal'),
      transcript:
        'PRIMARY PULSE VERIFIED: [02 03 05 07 11 13 17 19 23 29]. Sub-space carrier wave indicates intelligent non-terrestrial origin. Quantum encryption key handshake verified by Nexus Observatory.',
    },
    {
      id: 'sig_02',
      timestamp: '2026-07-22 20:15 UTC',
      frequency: '9.4 GHz Tachyon',
      source: 'Cygnus X-1 Star Factory',
      decryptionRatio: 88,
      status: 'DECIPHERING',
      asset: assetsData.find((a) => a.id === 'alien_species_1'),
      transcript:
        'Luminari photonic harmonic stream intercepted: "Core energy levels stabilizing. Requesting orbital vector alignment for Cygnus-1 energy conduit phase shift."',
    },
    {
      id: 'sig_03',
      timestamp: '2026-07-22 18:40 UTC',
      frequency: '22.1 GHz Quantum',
      source: 'Titan-3 Excavation Ridge',
      decryptionRatio: 100,
      status: 'DECRYPTED',
      asset: assetsData.find((a) => a.id === 'alien_tech_1'),
      transcript:
        'Neural Matrix Array beacon response: "Precursor computing core online. Hyper-dimensional memory sectors accessible. Clearance protocol: Level 5."',
    },
    {
      id: 'sig_04',
      timestamp: '2026-07-22 14:02 UTC',
      frequency: '4.1 GHz Gravimetric',
      source: 'Sagittarius A* Horizon',
      decryptionRatio: 42,
      status: 'LOCKED',
      asset: assetsData.find((a) => a.id === 'alien_species_4'),
      transcript:
        'WARNING: Gravimetric distortion wave detected near void anomaly. Temporal decay rate accelerating. Non-Euclidean geometry parameters unmapped.',
    },
  ];

  const activeSignal = signalLogs.find((s) => s.id === selectedSignalId) || signalLogs[0];

  // Canvas visualizer animation loop
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animationFrameId: number;
    let phase = 0;

    const render = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      // Dark sci-fi background grid on canvas
      ctx.strokeStyle = 'rgba(0, 240, 255, 0.05)';
      ctx.lineWidth = 1;
      const gridSize = 20;
      for (let x = 0; x < canvas.width; x += gridSize) {
        ctx.beginPath();
        ctx.moveTo(x, 0);
        ctx.lineTo(x, canvas.height);
        ctx.stroke();
      }
      for (let y = 0; y < canvas.height; y += gridSize) {
        ctx.beginPath();
        ctx.moveTo(0, y);
        ctx.lineTo(canvas.width, y);
        ctx.stroke();
      }

      if (isPlaying) {
        phase += 0.05 * (frequency / 10);
      }

      const cy = canvas.height / 2;

      // Draw primary glowing wave
      ctx.beginPath();
      ctx.lineWidth = 3;
      ctx.strokeStyle = '#00f0ff';
      ctx.shadowColor = '#00f0ff';
      ctx.shadowBlur = 15;

      for (let x = 0; x < canvas.width; x++) {
        let y = cy;
        const normX = x / canvas.width;

        if (waveMode === 'sine') {
          y = cy + Math.sin(normX * frequency * 10 + phase) * amplitude;
        } else if (waveMode === 'cybernetic') {
          const s1 = Math.sin(normX * frequency * 10 + phase);
          const s2 = Math.cos(normX * frequency * 5 - phase * 0.5);
          const noise = (Math.random() - 0.5) * 4;
          y = cy + (s1 + s2 * 0.5) * amplitude + noise;
        } else if (waveMode === 'quantum') {
          const square = Math.sin(normX * frequency * 12 + phase) > 0 ? 1 : -1;
          const harmonic = Math.sin(normX * frequency * 24 + phase * 2) * 0.3;
          y = cy + (square + harmonic) * amplitude * 0.7;
        }

        if (x === 0) ctx.moveTo(x, y);
        else ctx.lineTo(x, y);
      }
      ctx.stroke();

      // Secondary violet harmonic overlay wave
      ctx.beginPath();
      ctx.lineWidth = 1.5;
      ctx.strokeStyle = '#a855f7';
      ctx.shadowColor = '#a855f7';
      ctx.shadowBlur = 10;

      for (let x = 0; x < canvas.width; x++) {
        const normX = x / canvas.width;
        const y2 = cy + Math.sin(normX * frequency * 6 - phase * 1.2) * (amplitude * 0.6);
        if (x === 0) ctx.moveTo(x, y2);
        else ctx.lineTo(x, y2);
      }
      ctx.stroke();

      // Reset shadow
      ctx.shadowBlur = 0;

      animationFrameId = requestAnimationFrame(render);
    };

    render();

    return () => {
      cancelAnimationFrame(animationFrameId);
    };
  }, [isPlaying, frequency, amplitude, waveMode]);

  // Audio synthesizer via Web Audio API
  useEffect(() => {
    if (!isAudioEnabled) {
      if (audioCtxRef.current) {
        audioCtxRef.current.close();
        audioCtxRef.current = null;
      }
      return;
    }

    try {
      const AudioCtx = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
      const ctx = new AudioCtx();
      audioCtxRef.current = ctx;

      const osc = ctx.createOscillator();
      const gain = ctx.createGain();

      osc.type = waveMode === 'sine' ? 'sine' : waveMode === 'cybernetic' ? 'sawtooth' : 'square';
      osc.frequency.setValueAtTime(150 + frequency * 15, ctx.currentTime);

      gain.gain.setValueAtTime(0.04, ctx.currentTime);

      osc.connect(gain);
      gain.connect(ctx.destination);

      osc.start();
      oscRef.current = osc;
      gainRef.current = gain;
    } catch (e) {
      console.error('Web Audio API error:', e);
    }

    return () => {
      if (oscRef.current) {
        oscRef.current.stop();
        oscRef.current.disconnect();
      }
    };
  }, [isAudioEnabled, waveMode]);

  // Update synth tone when frequency slider changes
  useEffect(() => {
    if (audioCtxRef.current && oscRef.current) {
      oscRef.current.frequency.setValueAtTime(150 + frequency * 15, audioCtxRef.current.currentTime);
    }
  }, [frequency]);

  // Typewriter effect for transcript when activeSignal changes
  useEffect(() => {
    setDisplayText('');
    setTypingIndex(0);
  }, [selectedSignalId]);

  useEffect(() => {
    const fullText = activeSignal.transcript;
    if (typingIndex < fullText.length) {
      const timeout = setTimeout(() => {
        setDisplayText((prev) => prev + fullText[typingIndex]);
        setTypingIndex((prev) => prev + 1);
      }, 20);
      return () => clearTimeout(timeout);
    }
  }, [typingIndex, activeSignal]);

  return (
    <div className="page-container animate-fade-in">
      <div className="page-header">
        <div className="transmissions-header-badge">
          <Radio size={16} /> SUB-SPACE TRANSMISSIONS & CYBERNETIC DECODER
        </div>
        <h1 className="page-title glow-text text-gradient">TRANSMISSIONS</h1>
        <p className="page-subtitle">
          Real-time audio-visual signal wave analyzer, alien text translator, and deep-space pulse archive
        </p>
      </div>

      {/* Cybernetic Wave Visualizer Workspace */}
      <div className="visualizer-workspace glass-panel">
        <div className="visualizer-header">
          <div className="v-header-info">
            <Activity size={20} className="text-cyan" />
            <span className="v-title">WAVEFORM FREQUENCY ANALYZER</span>
            <span className="v-status-badge">
              <ShieldCheck size={14} /> SIGNAL LOCK: {frequency.toFixed(1)} GHz
            </span>
          </div>

          <div className="visualizer-controls-top">
            <button
              className={`btn-secondary audio-toggle-btn ${isAudioEnabled ? 'audio-on' : ''}`}
              onClick={() => setIsAudioEnabled(!isAudioEnabled)}
            >
              {isAudioEnabled ? <Volume2 size={16} /> : <VolumeX size={16} />}
              <span>{isAudioEnabled ? 'AUDIO SYNTH FEED: ON' : 'AUDIO SYNTH FEED: OFF'}</span>
            </button>

            <button
              className="btn-secondary play-pause-btn"
              onClick={() => setIsPlaying(!isPlaying)}
            >
              {isPlaying ? <Pause size={16} /> : <Play size={16} />}
              <span>{isPlaying ? 'PAUSE WAVE' : 'RESUME WAVE'}</span>
            </button>
          </div>
        </div>

        {/* HTML5 Canvas Wave Visualization */}
        <div className="canvas-wrapper">
          <canvas ref={canvasRef} width={1000} height={220} className="wave-canvas"></canvas>
          <div className="canvas-osd">
            <span>FREQ: {frequency.toFixed(1)} GHz</span>
            <span>AMP: {amplitude}%</span>
            <span>MODE: {waveMode.toUpperCase()}</span>
          </div>
        </div>

        {/* Sliders & Wave Presets */}
        <div className="visualizer-sliders-bar">
          <div className="slider-group">
            <label><Sliders size={14} /> FREQUENCY MODULATION ({frequency} GHz)</label>
            <input
              type="range"
              min="2.0"
              max="40.0"
              step="0.5"
              value={frequency}
              onChange={(e) => setFrequency(parseFloat(e.target.value))}
            />
          </div>

          <div className="slider-group">
            <label><Activity size={14} /> SIGNAL AMPLITUDE ({amplitude}%)</label>
            <input
              type="range"
              min="10"
              max="100"
              step="5"
              value={amplitude}
              onChange={(e) => setAmplitude(parseInt(e.target.value))}
            />
          </div>

          <div className="wave-mode-buttons">
            <button
              className={`mode-btn ${waveMode === 'sine' ? 'active' : ''}`}
              onClick={() => setWaveMode('sine')}
            >
              Sine
            </button>
            <button
              className={`mode-btn ${waveMode === 'cybernetic' ? 'active' : ''}`}
              onClick={() => setWaveMode('cybernetic')}
            >
              Cybernetic
            </button>
            <button
              className={`mode-btn ${waveMode === 'quantum' ? 'active' : ''}`}
              onClick={() => setWaveMode('quantum')}
            >
              Quantum Pulse
            </button>
          </div>
        </div>
      </div>

      {/* Translated Alien Text Stream & Signal Logs Grid */}
      <div className="transmissions-layout">
        {/* Left: Translated Text Decoder Stream */}
        <div className="decoder-stream-panel glass-panel">
          <div className="panel-header">
            <div className="panel-title-wrap">
              <Terminal size={18} className="text-cyan" />
              <span className="panel-title">TRANSLATED ALIEN TEXT STREAM</span>
            </div>
            <span className="source-tag">SOURCE: {activeSignal.source}</span>
          </div>

          <div className="transcript-screen">
            <div className="transcript-metadata">
              <span>TIMESTAMP: {activeSignal.timestamp}</span>
              <span>CARRIER FREQ: {activeSignal.frequency}</span>
              <span className="text-emerald">DECRYPTION: {activeSignal.decryptionRatio}%</span>
            </div>
            <div className="transcript-body">
              <p className="typewriter-text">{displayText}<span className="cursor-blink">|</span></p>
            </div>
          </div>

          <div className="decoder-actions">
            <button
              className="btn-secondary"
              onClick={() => {
                setDisplayText('');
                setTypingIndex(0);
              }}
            >
              <RefreshCw size={14} /> RE-DECODE TRANSMISSION
            </button>

            {activeSignal.asset && (
              <button
                className="btn-primary"
                onClick={() => setDetailModalItem(activeSignal.asset || null)}
              >
                <Maximize2 size={14} /> VIEW LINKED INTEL ITEM
              </button>
            )}
          </div>
        </div>

        {/* Right: Signal Intercept Log Archive */}
        <div className="signal-logs-panel glass-panel">
          <h2 className="section-heading">
            <Radio size={18} /> INTERCEPTED SIGNAL LOGS
          </h2>
          <div className="signal-list">
            {signalLogs.map((sig) => {
              const isSelected = sig.id === selectedSignalId;
              return (
                <div
                  key={sig.id}
                  className={`signal-card glass-panel hover-glow ${isSelected ? 'selected' : ''}`}
                  onClick={() => setSelectedSignalId(sig.id)}
                >
                  <div className="sig-status-indicator">
                    <span className={`sig-dot sig-${sig.status.toLowerCase()}`}></span>
                  </div>
                  <div className="sig-info">
                    <div className="sig-header">
                      <span className="sig-source">{sig.source}</span>
                      <span className="sig-freq">{sig.frequency}</span>
                    </div>
                    <p className="sig-snippet">{sig.transcript.slice(0, 75)}...</p>
                    <div className="sig-footer">
                      <span className="sig-time">{sig.timestamp}</span>
                      <span className="sig-ratio">{sig.decryptionRatio}% Decrypted</span>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* Asset Detail Modal */}
      {detailModalItem && (
        <AssetModal item={detailModalItem} onClose={() => setDetailModalItem(null)} />
      )}
    </div>
  );
};

export default Transmissions;
