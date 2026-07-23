import React, { useState, useEffect, useRef } from 'react';
import { Bot, Terminal, Cpu, Activity, Play, Send, RefreshCw, CheckCircle2, Zap, Shield, Sparkles, Code, Compass, Radio } from 'lucide-react';
import './AgentHub.css';

interface AgentDef {
  id: string;
  name: string;
  codename: string;
  role: string;
  specialization: string;
  imagePath: string;
  status: 'ONLINE' | 'STANDBY' | 'PROCESSING';
  load: number;
  sync: number;
  activeTaskCount: number;
  capabilities: string[];
  sampleCommand: string;
  icon: React.ElementType;
}

interface CommandLog {
  id: string;
  timestamp: string;
  sender: 'USER' | 'SYSTEM' | 'AGENT';
  agentName?: string;
  text: string;
  type?: 'info' | 'success' | 'warning' | 'code';
}

export const AgentHub: React.FC = () => {
  const [activeAgentId, setActiveAgentId] = useState<string>('agent_coder');
  const [commandInput, setCommandInput] = useState<string>('');
  const [systemLoad, setSystemLoad] = useState<number>(42);
  const [quantumSync, setQuantumSync] = useState<number>(99.8);
  const [isScanning, setIsScanning] = useState<boolean>(false);
  const consoleEndRef = useRef<HTMLDivElement>(null);

  const [alienLines, setAlienLines] = useState<string[]>([]);
  const alienEndRef = useRef<HTMLDivElement>(null);

  // Alien Terminal Effect
  useEffect(() => {
    const chars = '⎍⎎⎏⎐⎑⎒⎓⎔⎕⎖⎗⎘⎙⎚⎛⎜⎝⎞⎟⍀⍁⍂⍃⍄⍅⍆⍇⍈⍉⍊⍋⍌⍍⍎⍏⍐⍑⍒⍓⍔⍕⍖⍗0123456789ABCDEF<>[]{}!@#$%^&*()';
    const interval = setInterval(() => {
      const lineLength = Math.floor(Math.random() * 50) + 20;
      let newLine = '';
      for (let i = 0; i < lineLength; i++) {
        newLine += chars[Math.floor(Math.random() * chars.length)];
      }
      setAlienLines((prev) => {
        const next = [...prev, `[SYS.DAT.${Math.floor(Math.random() * 9999).toString().padStart(4, '0')}] ${newLine}`];
        return next.length > 40 ? next.slice(next.length - 40) : next;
      });
    }, 120);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    alienEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [alienLines]);

  const agents: AgentDef[] = [
    {
      id: 'agent_coder',
      name: 'Agent Coder Glyph',
      codename: 'NEXUS-CODE-01',
      role: 'Code & Logic Architect',
      specialization: 'Translates alien subroutines & quantum math into clean system architecture',
      imagePath: '/assets/agent_coder.jpg',
      status: 'ONLINE',
      load: 38,
      sync: 99.9,
      activeTaskCount: 5,
      capabilities: [
        'Quantum Algorithm Synthesis',
        'TypeScript / React Refactoring',
        'Sub-light Protocol Optimization',
        'Automated Diagnostic Verification',
      ],
      sampleCommand: '/run-agent coder --optimize-matrix',
      icon: Code,
    },
    {
      id: 'agent_artist',
      name: 'Agent Artist Glyph',
      codename: 'NEXUS-ART-02',
      role: 'Neural Visual Synthesizer',
      specialization: 'Generates high-fidelity visual constructs, cybernetic UI layouts & holograms',
      imagePath: '/assets/agent_artist.jpg',
      status: 'ONLINE',
      load: 64,
      sync: 98.4,
      activeTaskCount: 3,
      capabilities: [
        'Holographic UI Rendering',
        'Glassmorphism & Shader Design',
        'Aesthetic Color Palette Generation',
        'Alien Flora/Fauna Concepting',
      ],
      sampleCommand: '/generate-concept --theme obsidian-neon',
      icon: Sparkles,
    },
    {
      id: 'agent_planner',
      name: 'Agent Planner Glyph',
      codename: 'NEXUS-PLAN-03',
      role: 'Orchestrator & Strategist',
      specialization: 'Manages constellation matrices, task decomposition & mission alignment',
      imagePath: '/assets/agent_planner.jpg',
      status: 'ONLINE',
      load: 22,
      sync: 100.0,
      activeTaskCount: 8,
      capabilities: [
        'Multi-Agent Workflow Dispatch',
        'Milestone Risk Decomposition',
        'Starmap Jump Route Calculation',
        'Resource Allocation Protocol',
      ],
      sampleCommand: '/orchestrate-mission --milestone-2',
      icon: Compass,
    },
    {
      id: 'agent_decoder',
      name: 'Vigil Signal Transducer',
      codename: 'NEXUS-SIG-04',
      role: 'Xenolinguistic Signal Decoder',
      specialization: 'Intercepts, deciphers, and translates extragalactic audio-visual pulses',
      imagePath: '/assets/alien_signal.jpg',
      status: 'ONLINE',
      load: 51,
      sync: 97.6,
      activeTaskCount: 4,
      capabilities: [
        'Tachyon Pulse Decryption',
        'Sub-space Frequency Filtering',
        'Harmonic Audio Reconstruction',
        'Xenobiological Speech Mapping',
      ],
      sampleCommand: '/decode-signal --freq 14.8GHZ',
      icon: Radio,
    },
  ];

  const [consoleLogs, setConsoleLogs] = useState<CommandLog[]>([
    {
      id: '1',
      timestamp: new Date().toLocaleTimeString(),
      sender: 'SYSTEM',
      text: 'NEXUS-7 AGENT SUBSYSTEM INITIALIZED. 4 NEURAL CORES ONLINE.',
      type: 'info',
    },
    {
      id: '2',
      timestamp: new Date().toLocaleTimeString(),
      sender: 'AGENT',
      agentName: 'NEXUS-CODE-01',
      text: 'Standby mode active. Ready to process system expansion commands.',
      type: 'success',
    },
  ]);

  // Telemetry fluctuation effect
  useEffect(() => {
    const interval = setInterval(() => {
      setSystemLoad((prev) => {
        const delta = Math.floor(Math.random() * 5) - 2;
        const val = prev + delta;
        return val < 15 ? 15 : val > 85 ? 85 : val;
      });
      setQuantumSync((prev) => {
        const delta = (Math.random() * 0.4 - 0.2);
        const val = +(prev + delta).toFixed(1);
        return val < 95.0 ? 95.0 : val > 100.0 ? 100.0 : val;
      });
    }, 3000);
    return () => clearInterval(interval);
  }, []);

  // Auto-scroll console
  useEffect(() => {
    consoleEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [consoleLogs]);

  const executeCommand = (cmdText: string) => {
    const trimmed = cmdText.trim();
    if (!trimmed) return;

    const timeStr = new Date().toLocaleTimeString();
    const userLog: CommandLog = {
      id: `cmd_${Date.now()}`,
      timestamp: timeStr,
      sender: 'USER',
      text: trimmed,
    };

    setConsoleLogs((prev) => [...prev, userLog]);
    setCommandInput('');

    // Simulate Agent responses
    setTimeout(() => {
      let respText = '';
      let agentName = 'NEXUS-7 CORE';
      let type: 'info' | 'success' | 'warning' | 'code' = 'info';

      const lower = trimmed.toLowerCase();

      if (lower === '/ping') {
        respText = 'PONG! Latency: 1.4ms | Subspace Link: Nominal | Orbiting Nexus Prime';
        type = 'success';
      } else if (lower.includes('/run-agent coder') || lower.includes('--optimize-matrix')) {
        agentName = 'NEXUS-CODE-01';
        respText = 'Executing code matrix optimization... [OK] All 28 assets verified in assetsData.ts. React 19 compilation clean.';
        type = 'code';
      } else if (lower.includes('/generate-concept')) {
        agentName = 'NEXUS-ART-02';
        respText = 'Constructing visual neural concept... [OK] Cyan/Violet obsidian theme deployed across all 8 routes.';
        type = 'success';
      } else if (lower.includes('/orchestrate-mission')) {
        agentName = 'NEXUS-PLAN-03';
        respText = 'Orchestration status: Milestone 2 in progress. All pages (LoreCodex, AgentHub, Starmap, Transmissions, Species, Worlds, Artifacts) aligned.';
        type = 'info';
      } else if (lower.includes('/decode-signal')) {
        agentName = 'NEXUS-SIG-04';
        respText = 'Intercepting Tachyon Pulse 14.8 GHz... [DECRYPTED]: "Greetings from Andromeda Rim. Prime number sequence verified."';
        type = 'warning';
      } else if (lower.includes('/telemetry-scan') || lower === '/status') {
        respText = `TELEMETRY REPORT: System Load ${systemLoad}% | Quantum Sync ${quantumSync}% | Active Nodes: 4 | Security: CLEARANCE LEVEL 5`;
        type = 'info';
      } else if (lower === '/clear') {
        setConsoleLogs([]);
        return;
      } else {
        respText = `Command "${trimmed}" acknowledged by Agent Command Subroutine. Processing telemetry vector... [SUCCESS]`;
        type = 'info';
      }

      setConsoleLogs((prev) => [
        ...prev,
        {
          id: `resp_${Date.now()}`,
          timestamp: new Date().toLocaleTimeString(),
          sender: 'AGENT',
          agentName,
          text: respText,
          type,
        },
      ]);
    }, 600);
  };

  const handleFormSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    executeCommand(commandInput);
  };

  const triggerTelemetryScan = () => {
    setIsScanning(true);
    executeCommand('/telemetry-scan');
    setTimeout(() => setIsScanning(false), 1500);
  };

  const activeAgent = agents.find((a) => a.id === activeAgentId) || agents[0];

  return (
    <div className="page-container animate-fade-in">
      <div className="page-header">
        <div className="agent-header-badge">
          <Bot size={16} /> CYBERNETIC INTELLIGENCE COMMAND
        </div>
        <h1 className="page-title glow-text text-gradient">AGENT HUB</h1>
        <p className="page-subtitle">
          Autonomous specialized agents operating across the Deep Interstellar Network
        </p>
      </div>

      {/* Telemetry Metrics Bar */}
      <div className="telemetry-bar glass-panel">
        <div className="telemetry-item">
          <div className="telemetry-icon-wrap">
            <Cpu size={22} className="text-cyan" />
          </div>
          <div className="telemetry-info">
            <span className="telemetry-label">NEURAL LOAD</span>
            <div className="telemetry-bar-outer">
              <div className="telemetry-bar-inner" style={{ width: `${systemLoad}%` }}></div>
            </div>
            <span className="telemetry-value">{systemLoad}%</span>
          </div>
        </div>

        <div className="telemetry-item">
          <div className="telemetry-icon-wrap">
            <Activity size={22} className="text-magenta" />
          </div>
          <div className="telemetry-info">
            <span className="telemetry-label">QUANTUM SYNC</span>
            <span className="telemetry-value text-magenta">{quantumSync}%</span>
            <span className="telemetry-sub">Phase-Locked</span>
          </div>
        </div>

        <div className="telemetry-item">
          <div className="telemetry-icon-wrap">
            <Zap size={22} className="text-cyan" />
          </div>
          <div className="telemetry-info">
            <span className="telemetry-label">ACTIVE SUBROUTINES</span>
            <span className="telemetry-value">20 Tasks</span>
            <span className="telemetry-sub">Parallel Processing</span>
          </div>
        </div>

        <div className="telemetry-item">
          <div className="telemetry-icon-wrap">
            <Shield size={22} className="text-emerald" />
          </div>
          <div className="telemetry-info">
            <span className="telemetry-label">SYSTEM HEALTH</span>
            <span className="telemetry-value text-emerald">100% NOMINAL</span>
            <span className="telemetry-sub">Clearance Alpha</span>
          </div>
        </div>

        <button
          className={`btn-secondary scan-telemetry-btn ${isScanning ? 'scanning' : ''}`}
          onClick={triggerTelemetryScan}
        >
          <RefreshCw size={16} className={isScanning ? 'spin' : ''} />
          {isScanning ? 'SCANNING...' : 'SCAN TELEMETRY'}
        </button>
      </div>

      {/* Main Agent Roster & Detail split view */}
      <div className="agent-hub-layout">
        {/* Left Column: Agent Cards Roster */}
        <div className="agent-roster">
          <h2 className="section-heading">
            <Bot size={20} /> ACTIVE AGENT UNITS
          </h2>
          <div className="agent-card-list">
            {agents.map((agent) => {
              const Icon = agent.icon;
              const isSelected = agent.id === activeAgentId;
              return (
                <div
                  key={agent.id}
                  className={`agent-card glass-panel hover-glow ${isSelected ? 'selected' : ''}`}
                  onClick={() => setActiveAgentId(agent.id)}
                >
                  <div className="agent-card-thumb">
                    <img src={agent.imagePath} alt={agent.name} />
                    <span className="status-dot online"></span>
                  </div>
                  <div className="agent-card-info">
                    <div className="agent-card-header">
                      <h3 className="agent-name">{agent.name}</h3>
                      <span className="agent-codename">{agent.codename}</span>
                    </div>
                    <p className="agent-role">{agent.role}</p>
                    <div className="agent-mini-stats">
                      <span><Icon size={14} /> Load: {agent.load}%</span>
                      <span>Sync: {agent.sync}%</span>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Right Column: Selected Agent Deep Inspection Panel */}
        <div className="agent-detail-panel glass-panel">
          <div className="agent-banner">
            <img src={activeAgent.imagePath} alt={activeAgent.name} className="agent-banner-img" />
            <div className="agent-banner-overlay"></div>
            <div className="agent-banner-content">
              <h2 className="agent-banner-title glow-text">{activeAgent.name}</h2>
              <p className="agent-banner-sub text-cyan-400 font-mono text-sm tracking-wider uppercase mb-2">{activeAgent.role} // {activeAgent.codename}</p>
              
              <div className="agent-status-indicator mt-4 flex items-center gap-2">
                <span className="status-dot online"></span>
                <span className="status-text text-white/70 font-mono text-xs">STATUS: {activeAgent.status} // LOAD: {activeAgent.load}%</span>
              </div>
            </div>
          </div>

          <div className="agent-specs grid grid-cols-1 md:grid-cols-2 gap-6 mt-6 p-6">
            <div className="spec-card p-4 rounded-xl bg-black/40 border border-white/5 backdrop-blur-md">
              <h4 className="text-cyan-300/80 font-bold text-xs tracking-[0.2em] uppercase mb-2 flex items-center gap-2"><Cpu size={14}/> SPECIALIZATION CORE</h4>
              <p className="text-slate-300 font-medium leading-relaxed">{activeAgent.specialization}</p>
            </div>
            
            <div className="spec-card p-4 rounded-xl bg-black/40 border border-white/5 backdrop-blur-md">
              <h4 className="text-purple-300/80 font-bold text-xs tracking-[0.2em] uppercase mb-2 flex items-center gap-2"><Zap size={14}/> PRIMARY CAPABILITIES</h4>
              <ul className="capabilities-list text-slate-300 text-sm space-y-1">
                {activeAgent.capabilities.map((cap, idx) => (
                  <div key={idx} className="capability-tag flex items-center gap-2">
                    <Sparkles size={14} className="cap-icon text-purple-400" /> {cap}
                  </div>
                ))}
              </ul>
            </div>

            <div className="command-sample mt-6 p-4 rounded-xl bg-cyan-950/20 border border-cyan-500/20">
              <h4 className="text-cyan-400 font-mono text-[10px] uppercase tracking-[0.3em] mb-3 flex items-center gap-2"><Terminal size={12}/> EXECUTE DIRECT AGENT COMMAND</h4>
              <div className="cmd-preview flex items-center justify-between">
                <code className="text-cyan-300/80 font-mono text-sm">{activeAgent.sampleCommand}</code>
                <button
                  className="btn-primary run-cmd-btn bg-cyan-600/20 hover:bg-cyan-500/40 text-cyan-100 border border-cyan-500/50 rounded-lg px-4 py-2 flex items-center gap-2 transition-colors"
                  onClick={() => executeCommand(activeAgent.sampleCommand)}
                >
                  <Play size={16} /> RUN
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Interactive Command Simulation Console */}
      <div className="command-console-section glass-panel">
        <div className="console-header">
          <div className="console-title">
            <Terminal size={18} className="text-cyan" />
            <span>NEXUS-7 AGENT COMMAND CONSOLE (SIMULATED CLI)</span>
          </div>
          <div className="console-presets">
            <button className="preset-btn" onClick={() => executeCommand('/ping')}>
              /ping
            </button>
            <button className="preset-btn" onClick={() => executeCommand('/status')}>
              /status
            </button>
            <button className="preset-btn" onClick={() => executeCommand('/run-agent coder')}>
              /run-agent coder
            </button>
            <button className="preset-btn" onClick={() => executeCommand('/decode-signal')}>
              /decode-signal
            </button>
            <button className="preset-btn" onClick={() => executeCommand('/clear')}>
              /clear
            </button>
          </div>
        </div>

        <div className="console-screen">
          {consoleLogs.map((log) => (
            <div key={log.id} className={`console-line line-${log.sender.toLowerCase()} type-${log.type || 'info'}`}>
              <span className="console-time">[{log.timestamp}]</span>
              <span className="console-sender">
                {log.sender === 'USER' ? 'COMMANDER>' : `${log.agentName || 'SYSTEM'}>`}
              </span>
              <span className="console-text">{log.text}</span>
            </div>
          ))}
          <div ref={consoleEndRef} />
        </div>

        <form onSubmit={handleFormSubmit} className="console-input-bar">
          <span className="prompt-symbol">&gt;</span>
          <input
            type="text"
            placeholder="Enter agent command (e.g. /ping, /decode-signal, /run-agent coder)..."
            value={commandInput}
            onChange={(e) => setCommandInput(e.target.value)}
            className="console-input"
          />
          <button type="submit" className="btn-primary console-send-btn">
            <Send size={16} /> EXECUTE
          </button>
        </form>
      </div>

      {/* Live Hacker Alien Code Terminal */}
      <div className="alien-terminal glass-panel mt-8">
        <div className="alien-terminal-header">
          <Activity size={18} className="text-emerald animate-pulse" />
          <span className="alien-terminal-title">LIVE XENO-DATA DECRYPTION STREAM</span>
          <div className="alien-spinner"></div>
        </div>
        <div className="alien-terminal-screen">
          {alienLines.map((line, idx) => (
            <div key={idx} className="alien-line">{line}</div>
          ))}
          <div ref={alienEndRef} />
        </div>
      </div>
    </div>
  );
};

export default AgentHub;
