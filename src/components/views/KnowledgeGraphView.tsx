'use client';

import React, { useState } from 'react';
import { useCyberStore, findShortestPath } from '@/store/cyberStore';
import { Network, Search, AlertTriangle } from 'lucide-react';

export default function KnowledgeGraphView() {
  const graphNodes = useCyberStore(state => state.graphNodes);
  const graphLinks = useCyberStore(state => state.graphLinks);

  const [selectedNode, setSelectedNode] = useState<string | null>(null);
  const [targetNode, setTargetNode] = useState<string | null>(null);
  const [calculatedPath, setCalculatedPath] = useState<string[]>([]);
  const [hasSearched, setHasSearched] = useState(false);

  const handleComputePath = () => {
    if (!selectedNode || !targetNode) return;
    const path = findShortestPath(graphNodes, graphLinks, selectedNode, targetNode);
    setCalculatedPath(path);
    setHasSearched(true);
  };

  const handleClearPath = () => {
    setSelectedNode(null);
    setTargetNode(null);
    setCalculatedPath([]);
    setHasSearched(false);
  };

  const isLinkInPath = (source: string, target: string) => {
    if (calculatedPath.length < 2) return false;
    for (let i = 0; i < calculatedPath.length - 1; i++) {
      const u = calculatedPath[i];
      const v = calculatedPath[i + 1];
      if ((source === u && target === v) || (source === v && target === u)) {
        return true;
      }
    }
    return false;
  };

  return (
    <div className="space-y-6 font-mono">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-[#070b19]/60 p-4 border border-cyan-500/10 rounded-xl backdrop-blur-md">
        <div>
          <h2 className="text-sm font-bold text-white uppercase tracking-wider flex items-center gap-2">
            <Network className="h-4 w-4 text-cyan-400" />
            Threat Knowledge Graph (BFS Pathfinder Engine)
          </h2>
          <span className="text-[10px] text-gray-400">
            Computes shortest attack traversal paths using Breadth-First Search across entity nodes.
          </span>
        </div>

        <div className="flex flex-wrap items-center gap-2 text-xs">
          <select
            value={selectedNode || ''}
            onChange={(e) => setSelectedNode(e.target.value || null)}
            className="bg-[#040815] border border-cyan-500/30 text-cyan-300 rounded px-2 py-1 text-[11px] max-w-[130px] sm:max-w-none"
          >
            <option value="">Start Node...</option>
            {graphNodes.map(n => (
              <option key={n.id} value={n.id}>{n.label} ({n.type})</option>
            ))}
          </select>

          <span className="text-gray-500">→</span>

          <select
            value={targetNode || ''}
            onChange={(e) => setTargetNode(e.target.value || null)}
            className="bg-[#040815] border border-cyan-500/30 text-cyan-300 rounded px-2 py-1 text-[11px] max-w-[130px] sm:max-w-none"
          >
            <option value="">Target Node...</option>
            {graphNodes.map(n => (
              <option key={n.id} value={n.id}>{n.label} ({n.type})</option>
            ))}
          </select>

          <button
            onClick={handleComputePath}
            disabled={!selectedNode || !targetNode || selectedNode === targetNode}
            className="bg-cyan-600 hover:bg-cyan-500 disabled:bg-cyan-950 disabled:text-gray-600 text-white px-3 py-1 rounded text-[11px] font-bold transition flex items-center gap-1"
          >
            <Search className="h-3 w-3" />
            Compute
          </button>

          {(selectedNode || calculatedPath.length > 0 || hasSearched) && (
            <button
              onClick={handleClearPath}
              className="bg-gray-800 hover:bg-gray-700 text-gray-300 px-2 py-1 rounded text-[11px]"
            >
              Reset
            </button>
          )}
        </div>
      </div>

      {calculatedPath.length > 0 && (
        <div className="p-3 bg-cyan-950/40 border border-cyan-500/30 rounded-lg text-xs flex items-center gap-2 overflow-x-auto">
          <span className="text-cyan-400 font-bold uppercase shrink-0">BFS Shortest Path Discovered:</span>
          <span className="text-white whitespace-nowrap">{calculatedPath.join(' → ')}</span>
        </div>
      )}

      {hasSearched && calculatedPath.length === 0 && (
        <div className="p-3 bg-amber-950/40 border border-amber-500/30 rounded-lg text-xs flex items-center gap-2 text-amber-300">
          <AlertTriangle className="h-4 w-4 text-amber-400 shrink-0" />
          <span>No traversal path exists between entity &quot;{selectedNode}&quot; and &quot;{targetNode}&quot;.</span>
        </div>
      )}

      {/* SVG Knowledge Graph Representation */}
      <div className="relative w-full h-[360px] sm:h-[450px] md:h-[500px] rounded-xl border border-cyan-500/10 bg-[#070b19]/60 backdrop-blur-md p-2 sm:p-6 overflow-hidden flex items-center justify-center">
        <svg className="w-full h-full" viewBox="0 0 950 480" preserveAspectRatio="xMidYMid meet">
          {/* Render Graph Links */}
          {graphLinks.map((link, idx) => {
            const sourceNode = graphNodes.find(n => n.id === link.source);
            const targetNode = graphNodes.find(n => n.id === link.target);
            if (!sourceNode || !targetNode) return null;

            const isHighlighted = isLinkInPath(link.source, link.target);

            // Simple layout positioning calculation
            const indexSource = graphNodes.findIndex(n => n.id === link.source);
            const indexTarget = graphNodes.findIndex(n => n.id === link.target);

            const x1 = 150 + (indexSource % 4) * 220;
            const y1 = 100 + Math.floor(indexSource / 4) * 180;
            const x2 = 150 + (indexTarget % 4) * 220;
            const y2 = 100 + Math.floor(indexTarget / 4) * 180;

            return (
              <g key={`link-${idx}`}>
                <line
                  x1={x1}
                  y1={y1}
                  x2={x2}
                  y2={y2}
                  stroke={isHighlighted ? '#ef4444' : '#06b6d4'}
                  strokeWidth={isHighlighted ? 3 : 1}
                  strokeDasharray={isHighlighted ? '4,4' : undefined}
                  opacity={isHighlighted ? 1 : 0.4}
                />
                <text
                  x={(x1 + x2) / 2}
                  y={(y1 + y2) / 2 - 6}
                  fill={isHighlighted ? '#ef4444' : '#64748b'}
                  fontSize="9"
                  textAnchor="middle"
                >
                  {link.type}
                </text>
              </g>
            );
          })}

          {/* Render Graph Nodes */}
          {graphNodes.map((node, idx) => {
            const x = 150 + (idx % 4) * 220;
            const y = 100 + Math.floor(idx / 4) * 180;
            const isSelected = calculatedPath.includes(node.id) || selectedNode === node.id;
            const isCompromised = node.status === 'compromised';

            return (
              <g 
                key={node.id} 
                className="cursor-pointer"
                onClick={() => setSelectedNode(node.id)}
              >
                <circle
                  cx={x}
                  cy={y}
                  r="24"
                  fill={isCompromised ? '#450a0a' : isSelected ? '#083344' : '#060a17'}
                  stroke={isCompromised ? '#ef4444' : isSelected ? '#06b6d4' : '#334155'}
                  strokeWidth={isSelected ? '3' : '1.5'}
                />
                <text
                  x={x}
                  y={y + 4}
                  fill={isCompromised ? '#ef4444' : '#06b6d4'}
                  fontSize="10"
                  fontWeight="bold"
                  textAnchor="middle"
                >
                  {node.label}
                </text>
                <text
                  x={x}
                  y={y + 40}
                  fill="#94a3b8"
                  fontSize="9"
                  textAnchor="middle"
                >
                  [{node.type}]
                </text>
              </g>
            );
          })}
        </svg>
      </div>
    </div>
  );
}
