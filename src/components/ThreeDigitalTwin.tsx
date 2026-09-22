'use client';

import React, { useRef, useEffect, useState } from 'react';
import * as THREE from 'three';
import { useCyberStore, Asset } from '@/store/cyberStore';
import { Play, Shield, RefreshCw } from 'lucide-react';

interface NodeMesh {
  id: string;
  group: THREE.Group;
  baseMesh: THREE.Mesh;
  ringMesh: THREE.Mesh;
  baseMaterial: THREE.MeshStandardMaterial;
  glowMaterial: THREE.MeshBasicMaterial;
}

const positions: { [key: string]: THREE.Vector3 } = {
  'pwr-gen-1': new THREE.Vector3(-60, 15, -30),
  'pwr-sw-1': new THREE.Vector3(-30, 0, -10),
  'pwr-db-1': new THREE.Vector3(-60, -15, 10),
  'pwr-fw-1': new THREE.Vector3(0, 0, -30),
  'rly-sig-1': new THREE.Vector3(-30, 20, 40),
  'rly-sw-1': new THREE.Vector3(0, 0, 30),
  'med-rec-1': new THREE.Vector3(60, 15, -20),
  'med-fw-1': new THREE.Vector3(30, 0, -10),
  'smrt-cam-1': new THREE.Vector3(60, -15, 30),
  'cld-edge-1': new THREE.Vector3(30, 0, 30)
};

export default function ThreeDigitalTwin() {
  const containerRef = useRef<HTMLDivElement | null>(null);

  // Zustand Granular Selectors
  const assets = useCyberStore(state => state.assets);
  const simulateRansomwareOutbreak = useCyberStore(state => state.simulateRansomwareOutbreak);
  const resetSimulation = useCyberStore(state => state.resetSimulation);
  const isolateAsset = useCyberStore(state => state.isolateAsset);

  const [selectedNodeId, setSelectedNodeId] = useState<string | null>(null);

  // Persistent Refs to prevent WebGL scene recreation
  const nodeMeshesRef = useRef<Map<string, NodeMesh>>(new Map());
  const assetsRef = useRef<Asset[]>(assets);
  const lineMeshesRef = useRef<THREE.Line[]>([]);

  // Synchronize assetsRef without triggering WebGL re-initialization
  useEffect(() => {
    assetsRef.current = assets;
  }, [assets]);

  const selectedAsset = assets.find(a => a.id === selectedNodeId);

  // 1. WebGL Initialization & Scene Setup (Runs ONCE on mount)
  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    let animFrameId: number;

    // A. Scene, Camera, Renderer
    const scene = new THREE.Scene();
    scene.background = new THREE.Color('#030712');
    scene.fog = new THREE.FogExp2('#030712', 0.015);

    const camera = new THREE.PerspectiveCamera(
      50,
      container.clientWidth / container.clientHeight || 1,
      0.1,
      1000
    );
    camera.position.set(0, 80, 140);
    camera.lookAt(0, 0, 0);

    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    renderer.setSize(container.clientWidth || 300, container.clientHeight || 300);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.shadowMap.enabled = true;
    container.appendChild(renderer.domElement);

    // B. Lighting
    const ambientLight = new THREE.AmbientLight('#ffffff', 0.35);
    scene.add(ambientLight);

    const dirLight1 = new THREE.DirectionalLight('#00f0ff', 0.85);
    dirLight1.position.set(100, 150, 50);
    scene.add(dirLight1);

    const dirLight2 = new THREE.DirectionalLight('#6366f1', 0.45);
    dirLight2.position.set(-100, 50, -50);
    scene.add(dirLight2);

    // C. Grid Floor
    const gridHelper = new THREE.GridHelper(300, 40, '#06b6d4', '#06b6d4');
    const gridMaterial = gridHelper.material as THREE.LineBasicMaterial;
    gridMaterial.opacity = 0.06;
    gridMaterial.transparent = true;
    gridHelper.position.y = -20;
    scene.add(gridHelper);

    // D. Build Persistent Node Meshes Map
    const currentAssets = assetsRef.current;
    nodeMeshesRef.current.clear();

    currentAssets.forEach((asset) => {
      const pos = positions[asset.id] || new THREE.Vector3(0, 0, 0);
      const nodeGroup = new THREE.Group();
      nodeGroup.position.copy(pos);

      // Node Geometry based on type
      let geom: THREE.BufferGeometry;
      if (asset.type === 'database') {
        geom = new THREE.CylinderGeometry(6, 6, 12, 12);
      } else if (asset.type === 'server') {
        geom = new THREE.BoxGeometry(10, 10, 10);
      } else if (asset.type === 'ot_device') {
        geom = new THREE.TorusGeometry(5, 1.8, 8, 20);
      } else if (asset.type === 'cloud') {
        geom = new THREE.IcosahedronGeometry(7, 1);
      } else {
        geom = new THREE.BoxGeometry(8, 4, 8);
      }

      const baseMat = new THREE.MeshStandardMaterial({
        color: asset.status === 'compromised' ? '#ef4444' : asset.status === 'isolated' ? '#f97316' : '#0a142c',
        roughness: 0.2,
        metalness: 0.8
      });

      const coreMesh = new THREE.Mesh(geom, baseMat);
      coreMesh.castShadow = true;
      coreMesh.receiveShadow = true;
      nodeGroup.add(coreMesh);

      const ringGeom = new THREE.RingGeometry(9, 10, 32);
      const glowMat = new THREE.MeshBasicMaterial({
        color: asset.status === 'compromised' ? '#ef4444' : asset.status === 'isolated' ? '#f97316' : '#06b6d4',
        side: THREE.DoubleSide,
        transparent: true,
        opacity: 0.5
      });
      const ringMesh = new THREE.Mesh(ringGeom, glowMat);
      ringMesh.rotation.x = Math.PI / 2;
      nodeGroup.add(ringMesh);

      scene.add(nodeGroup);

      nodeMeshesRef.current.set(asset.id, {
        id: asset.id,
        group: nodeGroup,
        baseMesh: coreMesh,
        ringMesh,
        baseMaterial: baseMat,
        glowMaterial: glowMat
      });
    });

    // E. Build Connection Lines
    const linesGroup = new THREE.Group();
    scene.add(linesGroup);
    lineMeshesRef.current = [];

    currentAssets.forEach((asset) => {
      const startPos = positions[asset.id];
      if (!startPos) return;

      asset.dependencies.forEach((depId) => {
        const endPos = positions[depId];
        if (!endPos) return;

        const isCompromised = asset.status === 'compromised' || currentAssets.find(a => a.id === depId)?.status === 'compromised';

        const points = [startPos, endPos];
        const lineGeom = new THREE.BufferGeometry().setFromPoints(points);
        const lineMat = new THREE.LineBasicMaterial({
          color: isCompromised ? '#ef4444' : '#06b6d4',
          transparent: true,
          opacity: isCompromised ? 0.8 : 0.25
        });
        const line = new THREE.Line(lineGeom, lineMat);
        linesGroup.add(line);
        lineMeshesRef.current.push(line);
      });
    });

    // F. Drag Orbit Camera Interactivity
    let isDragging = false;
    let prevMouseX = 0;
    let prevMouseY = 0;
    let cameraAngleY = Math.PI / 4;
    let cameraAngleX = Math.PI / 8;
    const cameraRadius = 160;

    const updateCameraPosition = () => {
      camera.position.x = cameraRadius * Math.sin(cameraAngleY) * Math.cos(cameraAngleX);
      camera.position.z = cameraRadius * Math.cos(cameraAngleY) * Math.cos(cameraAngleX);
      camera.position.y = cameraRadius * Math.sin(cameraAngleX);
      camera.lookAt(0, 0, 0);
    };
    updateCameraPosition();

    const handleMouseDown = (e: MouseEvent) => {
      isDragging = true;
      prevMouseX = e.clientX;
      prevMouseY = e.clientY;
    };

    const handleMouseMove = (e: MouseEvent) => {
      if (!isDragging) return;
      const deltaX = e.clientX - prevMouseX;
      const deltaY = e.clientY - prevMouseY;
      
      cameraAngleY -= deltaX * 0.005;
      cameraAngleX = Math.max(-Math.PI / 3, Math.min(Math.PI / 3, cameraAngleX - deltaY * 0.005));

      updateCameraPosition();
      prevMouseX = e.clientX;
      prevMouseY = e.clientY;
    };

    const handleMouseUp = () => {
      isDragging = false;
    };

    container.addEventListener('mousedown', handleMouseDown);
    window.addEventListener('mousemove', handleMouseMove);
    window.addEventListener('mouseup', handleMouseUp);

    // G. Raycasting for Selection
    const raycaster = new THREE.Raycaster();
    const mouse = new THREE.Vector2();

    const handleMouseClick = (e: MouseEvent) => {
      if (!renderer.domElement) return;
      const rect = renderer.domElement.getBoundingClientRect();
      mouse.x = ((e.clientX - rect.left) / rect.width) * 2 - 1;
      mouse.y = -((e.clientY - rect.top) / rect.height) * 2 + 1;

      raycaster.setFromCamera(mouse, camera);

      const targets: THREE.Object3D[] = [];
      nodeMeshesRef.current.forEach(n => targets.push(n.baseMesh));

      const intersects = raycaster.intersectObjects(targets);
      if (intersects.length > 0) {
        const clickedMesh = intersects[0].object;
        nodeMeshesRef.current.forEach((node, id) => {
          if (node.baseMesh === clickedMesh) {
            setSelectedNodeId(id);
          }
        });
      }
    };
    container.addEventListener('click', handleMouseClick);

    // H. ResizeObserver (No division by zero)
    const resizeObserver = new ResizeObserver((entries) => {
      for (const entry of entries) {
        const width = entry.contentRect.width;
        const height = entry.contentRect.height;
        if (width === 0 || height === 0) continue;

        camera.aspect = width / height;
        camera.updateProjectionMatrix();
        renderer.setSize(width, height);
      }
    });
    resizeObserver.observe(container);

    // I. Animation Loop (Always uses assetsRef.current)
    const clock = new THREE.Clock();

    const animate = () => {
      animFrameId = requestAnimationFrame(animate);
      const elapsedTime = clock.getElapsedTime();

      const latestAssets = assetsRef.current;

      nodeMeshesRef.current.forEach((nodeMesh, assetId) => {
        const asset = latestAssets.find(a => a.id === assetId);
        if (!asset) return;

        // Subtle mesh rotation
        nodeMesh.baseMesh.rotation.y = elapsedTime * 0.4;
        if (asset.type === 'ot_device') {
          nodeMesh.baseMesh.rotation.x = elapsedTime * 0.2;
        }

        // Pulse scale & material glow without recreating scene
        if (asset.status === 'compromised') {
          const pulse = 1.0 + Math.sin(elapsedTime * 6) * 0.18;
          nodeMesh.group.scale.set(pulse, pulse, pulse);
          nodeMesh.baseMaterial.color.set('#ef4444');
          nodeMesh.glowMaterial.color.set('#ef4444');
          nodeMesh.glowMaterial.opacity = 0.5 + Math.sin(elapsedTime * 6) * 0.2;
        } else if (asset.status === 'isolated') {
          nodeMesh.group.scale.set(1.0, 1.0, 1.0);
          nodeMesh.baseMaterial.color.set('#f97316');
          nodeMesh.glowMaterial.color.set('#f97316');
          nodeMesh.glowMaterial.opacity = 0.3;
        } else {
          nodeMesh.group.scale.set(1.0, 1.0, 1.0);
          nodeMesh.baseMaterial.color.set('#0a142c');
          nodeMesh.glowMaterial.color.set('#06b6d4');
          nodeMesh.glowMaterial.opacity = 0.4 + Math.sin(elapsedTime * 2) * 0.1;
        }
      });

      renderer.render(scene, camera);
    };

    animate();

    const nodeMeshesMap = nodeMeshesRef.current;

    // J. Proper GPU Resource Disposal on Unmount
    return () => {
      cancelAnimationFrame(animFrameId);
      resizeObserver.disconnect();

      container.removeEventListener('mousedown', handleMouseDown);
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('mouseup', handleMouseUp);
      container.removeEventListener('click', handleMouseClick);

      // Traversal and disposal of GPU resources
      scene.traverse((object) => {
        if ((object as THREE.Mesh).isMesh) {
          const mesh = object as THREE.Mesh;
          if (mesh.geometry) mesh.geometry.dispose();
          if (mesh.material) {
            if (Array.isArray(mesh.material)) {
              mesh.material.forEach(m => m.dispose());
            } else {
              mesh.material.dispose();
            }
          }
        }
      });

      renderer.dispose();
      if (container.contains(renderer.domElement)) {
        container.removeChild(renderer.domElement);
      }
      nodeMeshesMap.clear();
      lineMeshesRef.current = [];
    };
  }, []); // Run WebGL Scene init ONCE on mount!

  // 2. Selective Application State Sync (Runs on assets state change WITHOUT recreating WebGL scene)
  useEffect(() => {
    nodeMeshesRef.current.forEach((nodeMesh, id) => {
      const asset = assets.find(a => a.id === id);
      if (!asset) return;

      if (asset.status === 'compromised') {
        nodeMesh.baseMaterial.color.set('#ef4444');
        nodeMesh.glowMaterial.color.set('#ef4444');
      } else if (asset.status === 'isolated') {
        nodeMesh.baseMaterial.color.set('#f97316');
        nodeMesh.glowMaterial.color.set('#f97316');
      } else {
        nodeMesh.baseMaterial.color.set('#0a142c');
        nodeMesh.glowMaterial.color.set('#06b6d4');
      }
    });
  }, [assets]);

  return (
    <div className="grid grid-cols-1 lg:grid-cols-4 gap-6 h-full min-h-[500px]">
      
      {/* 3D WebGL Canvas viewport */}
      <div className="lg:col-span-3 relative rounded-xl border border-cyan-500/10 bg-[#070b19]/60 backdrop-blur-md overflow-hidden flex flex-col justify-between p-4 min-h-[400px]">
        
        {/* Overlays */}
        <div className="absolute top-4 left-4 z-10 font-mono text-xs flex flex-col gap-1">
          <div className="text-cyan-400 font-bold tracking-widest uppercase">
            3D Infrastructure Digital Twin (WebGL Engine)
          </div>
          <span className="text-[9px] text-gray-500">
            Hold left mouse click and drag to orbit camera. Click 3D shapes to inspect.
          </span>
        </div>

        <div className="absolute top-4 right-4 z-10 flex gap-2">
          <button
            onClick={resetSimulation}
            className="flex items-center gap-1 bg-cyan-950/50 hover:bg-cyan-900 border border-cyan-500/30 text-cyan-400 text-[10px] px-2 py-1 rounded transition font-mono"
          >
            <RefreshCw className="h-3 w-3" />
            Reset Twin
          </button>
        </div>

        {/* WebGL Canvas Holder */}
        <div ref={containerRef} className="flex-grow w-full h-[400px]" />

        {/* Legend overlay */}
        <div className="border-t border-cyan-500/10 pt-2 flex gap-4 text-[9px] font-mono text-gray-500 uppercase">
          <div className="flex items-center gap-1">
            <span className="h-2 w-2 rounded-full bg-cyan-500"></span>
            Online
          </div>
          <div className="flex items-center gap-1">
            <span className="h-2 w-2 rounded-full bg-red-500 animate-pulse"></span>
            Compromised
          </div>
          <div className="flex items-center gap-1">
            <span className="h-2 w-2 rounded-full bg-orange-500"></span>
            Isolated
          </div>
        </div>

      </div>

      {/* Action panel */}
      <div className="rounded-xl border border-cyan-500/10 bg-[#070b19]/60 backdrop-blur-md p-4 flex flex-col justify-between font-mono">
        {selectedAsset ? (
          <div className="flex flex-col h-full justify-between">
            <div className="space-y-4">
              <div className="border-b border-cyan-500/10 pb-2 flex justify-between items-center">
                <span className="text-xs text-cyan-400 font-bold uppercase tracking-wider">3D Node Info</span>
                <span className="text-[8px] bg-cyan-950 px-2 py-0.5 rounded text-cyan-300 uppercase">{selectedAsset.type}</span>
              </div>

              <div className="space-y-2 text-xs">
                <div>
                  <span className="text-[9px] text-gray-500">Asset name:</span>
                  <div className="text-white font-bold">{selectedAsset.name}</div>
                </div>
                <div>
                  <span className="text-[9px] text-gray-500">IP address:</span>
                  <div className="text-cyan-300">{selectedAsset.ip}</div>
                </div>
                <div>
                  <span className="text-[9px] text-gray-500">Resilience Index (ARS):</span>
                  <div className={`font-bold ${selectedAsset.ars > 80 ? 'text-emerald-400' : 'text-red-400'}`}>{selectedAsset.ars}/100</div>
                </div>
              </div>

              <div className="pt-4">
                {selectedAsset.status === 'compromised' ? (
                  <div className="p-3 bg-red-950/20 border border-red-500/30 text-red-400 rounded text-[10px] leading-normal">
                    <strong>Compromised!</strong> Attacker is pivoting to dependent systems via BFS graph paths.
                  </div>
                ) : selectedAsset.status === 'isolated' ? (
                  <div className="p-3 bg-orange-950/20 border border-orange-500/30 text-orange-400 rounded text-[10px] leading-normal">
                    <strong>Isolated.</strong> Microsegmentation active.
                  </div>
                ) : (
                  <div className="p-3 bg-emerald-950/20 border border-emerald-500/30 text-emerald-400 rounded text-[10px] leading-normal">
                    <strong>Secure.</strong> Standard telemetry active.
                  </div>
                )}
              </div>
            </div>

            <div className="space-y-2 pt-4 border-t border-cyan-500/10">
              {selectedAsset.status === 'online' && (
                <>
                  <button
                    onClick={() => simulateRansomwareOutbreak(selectedAsset.id)}
                    className="w-full flex items-center justify-center gap-2 bg-red-950/40 hover:bg-red-900 border border-red-500/40 text-red-400 py-2 rounded text-xs transition duration-200"
                  >
                    <Play className="h-3.5 w-3.5" />
                    Inject BFS Ransomware
                  </button>
                  <button
                    onClick={() => isolateAsset(selectedAsset.id)}
                    className="w-full flex items-center justify-center gap-2 bg-orange-950/40 hover:bg-orange-900 border border-orange-500/40 text-orange-400 py-2 rounded text-xs transition duration-200"
                  >
                    <Shield className="h-3.5 w-3.5" />
                    SOAR Isolation
                  </button>
                </>
              )}
              {selectedAsset.status === 'compromised' && (
                <button
                  onClick={() => isolateAsset(selectedAsset.id)}
                  className="w-full bg-orange-600 hover:bg-orange-700 text-white font-bold py-2 rounded text-xs transition"
                >
                  Isolate node
                </button>
              )}
            </div>
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center h-full text-center text-gray-500">
            <Shield className="h-10 w-10 text-cyan-500/20 mb-3 animate-pulse" />
            <span className="text-[10px] uppercase">No 3D Node Selected</span>
          </div>
        )}
      </div>

    </div>
  );
}
