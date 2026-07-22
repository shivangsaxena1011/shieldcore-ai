'use client';

import React, { useRef, useEffect } from 'react';

interface City {
  name: string;
  lat: number;
  lng: number;
  color: string;
  size: number;
}

const cities: City[] = [
  { name: 'New Delhi (CNI HQ / AIIMS)', lat: 28.6139, lng: 77.2090, color: '#06b6d4', size: 6 },
  { name: 'Mumbai (Western Power Grid / Port)', lat: 19.0760, lng: 72.8777, color: '#10b981', size: 5 },
  { name: 'Bengaluru (Defense R&D / Aero)', lat: 12.9716, lng: 77.5946, color: '#6366f1', size: 5 },
  { name: 'Chennai (Southern Telecom / Smart City)', lat: 13.0827, lng: 80.2707, color: '#f59e0b', size: 4 },
  { name: 'Kolkata (Eastern Railway Command)', lat: 22.5726, lng: 88.3639, color: '#ec4899', size: 4 }
];

interface AttackArc {
  startLat: number;
  startLng: number;
  endLat: number;
  endLng: number;
  progress: number;
  speed: number;
  color: string;
}

export default function CyberGlobe() {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const rotationRef = useRef({ x: 0, y: 0.4 });
  const arcsRef = useRef<AttackArc[]>([]);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animationFrameId: number;
    let width = canvas.width;
    let height = canvas.height;

    // Handle resizing
    const resize = () => {
      if (!canvas) return;
      const rect = canvas.getBoundingClientRect();
      canvas.width = rect.width * window.devicePixelRatio;
      canvas.height = rect.height * window.devicePixelRatio;
      canvas.style.width = '100%';
      canvas.style.height = '100%';
      width = canvas.width;
      height = canvas.height;
    };
    resize();
    window.addEventListener('resize', resize);

    // Initialize random attack arcs
    const createRandomArc = () => {
      const targetCity = cities[Math.floor(Math.random() * cities.length)];
      // Spawn attacks from global regions (e.g. North America, East Asia, Europe)
      const startLat = (Math.random() - 0.5) * 120;
      const startLng = (Math.random() - 0.5) * 360;
      
      arcsRef.current.push({
        startLat,
        startLng,
        endLat: targetCity.lat,
        endLng: targetCity.lng,
        progress: 0,
        speed: 0.008 + Math.random() * 0.012,
        color: Math.random() > 0.6 ? '#ef4444' : '#f97316'
      });
    };

    // Keep around 4 active arcs
    for (let i = 0; i < 4; i++) {
      createRandomArc();
    }

    // Mathematical projection variables
    const radius = Math.min(width, height) * 0.35;
    
    const project = (lat: number, lng: number, rotY: number, rotX: number) => {
      // Convert lat/lng to radians
      const radLat = (lat * Math.PI) / 180;
      const radLng = ((lng + 180) * Math.PI) / 180 + rotY;

      // 3D Cartesian coordinates
      let x = radius * Math.cos(radLat) * Math.sin(radLng);
      let y = -radius * Math.sin(radLat);
      let z = radius * Math.cos(radLat) * Math.cos(radLng);

      // Rotate around X axis
      const cosX = Math.cos(rotX);
      const sinX = Math.sin(rotX);
      const rotY1 = y * cosX - z * sinX;
      const rotZ1 = y * sinX + z * cosX;

      return {
        x: x + width / 2,
        y: rotY1 + height / 2,
        z: rotZ1,
        visible: rotZ1 > -50 // check if on the front hemisphere
      };
    };

    // Render loop
    const render = () => {
      ctx.clearRect(0, 0, width, height);

      // Draw cyber scanning background grid
      ctx.strokeStyle = 'rgba(6, 182, 212, 0.03)';
      ctx.lineWidth = 1;
      const gridSize = 40;
      for (let x = 0; x < width; x += gridSize) {
        ctx.beginPath();
        ctx.moveTo(x, 0);
        ctx.lineTo(x, height);
        ctx.stroke();
      }
      for (let y = 0; y < height; y += gridSize) {
        ctx.beginPath();
        ctx.moveTo(0, y);
        ctx.lineTo(width, y);
        ctx.stroke();
      }

      const rotY = rotationRef.current.y;
      const rotX = rotationRef.current.x;

      // Draw Globe Outer Atmosphere Glow
      const glowGrad = ctx.createRadialGradient(
        width / 2, height / 2, radius * 0.9,
        width / 2, height / 2, radius * 1.15
      );
      glowGrad.addColorStop(0, 'rgba(6, 182, 212, 0.08)');
      glowGrad.addColorStop(0.5, 'rgba(99, 102, 241, 0.03)');
      glowGrad.addColorStop(1, 'rgba(0, 0, 0, 0)');
      
      ctx.fillStyle = glowGrad;
      ctx.beginPath();
      ctx.arc(width / 2, height / 2, radius * 1.25, 0, Math.PI * 2);
      ctx.fill();

      // Draw Globe Base circle (back shadow)
      ctx.fillStyle = '#060914';
      ctx.beginPath();
      ctx.arc(width / 2, height / 2, radius, 0, Math.PI * 2);
      ctx.fill();

      // Draw Latitude Grids
      ctx.strokeStyle = 'rgba(6, 182, 212, 0.12)';
      ctx.lineWidth = 0.8;
      for (let lat = -80; lat <= 80; lat += 20) {
        ctx.beginPath();
        let first = true;
        for (let lng = -180; lng <= 180; lng += 10) {
          const pt = project(lat, lng, rotY, rotX);
          if (pt.visible) {
            if (first) {
              ctx.moveTo(pt.x, pt.y);
              first = false;
            } else {
              ctx.lineTo(pt.x, pt.y);
            }
          } else {
            first = true;
          }
        }
        ctx.stroke();
      }

      // Draw Longitude Grids
      for (let lng = -180; lng < 180; lng += 20) {
        ctx.beginPath();
        let first = true;
        for (let lat = -90; lat <= 90; lat += 10) {
          const pt = project(lat, lng, rotY, rotX);
          if (pt.visible) {
            if (first) {
              ctx.moveTo(pt.x, pt.y);
              first = false;
            } else {
              ctx.lineTo(pt.x, pt.y);
            }
          } else {
            first = true;
          }
        }
        ctx.stroke();
      }

      // Draw Indian CNI Cities
      cities.forEach((city) => {
        const pt = project(city.lat, city.lng, rotY, rotX);
        if (pt.visible) {
          // Draw Glow Ring
          const pulse = (1 + Math.sin(Date.now() * 0.005)) * 4;
          ctx.strokeStyle = city.color;
          ctx.lineWidth = 1;
          ctx.beginPath();
          ctx.arc(pt.x, pt.y, city.size + pulse, 0, Math.PI * 2);
          ctx.stroke();

          // Draw Solid Center Node
          ctx.fillStyle = city.color;
          ctx.beginPath();
          ctx.arc(pt.x, pt.y, city.size, 0, Math.PI * 2);
          ctx.fill();

          // Text label
          ctx.fillStyle = '#9ca3af';
          ctx.font = `${width > 600 ? '11px' : '9px'} monospace`;
          ctx.fillText(city.name, pt.x + 8, pt.y + 4);
        }
      });

      // Update and Draw Attack Arcs
      const activeArcs = arcsRef.current;
      for (let i = activeArcs.length - 1; i >= 0; i--) {
        const arc = activeArcs[i];
        arc.progress += arc.speed;

        if (arc.progress >= 1) {
          activeArcs.splice(i, 1);
          createRandomArc();
          continue;
        }

        // Project start and end positions
        const startPt = project(arc.startLat, arc.startLng, rotY, rotX);
        const endPt = project(arc.endLat, arc.endLng, rotY, rotX);

        if (startPt.visible || endPt.visible) {
          // Draw Arc Line
          ctx.beginPath();
          ctx.strokeStyle = arc.color;
          ctx.lineWidth = 1.5;
          
          // Draw Bezier Curve (interpolating coordinates for 3D sphere curvature)
          // Compute mid-point Lat/Lng
          const midLat = (arc.startLat + arc.endLat) / 2 + 15; // arc height offset
          const midLng = (arc.startLng + arc.endLng) / 2;
          const midPt = project(midLat, midLng, rotY, rotX);

          ctx.moveTo(startPt.x, startPt.y);
          ctx.quadraticCurveTo(midPt.x, midPt.y, endPt.x, endPt.y);
          ctx.setLineDash([4, 4]); // Cyber dotted telemetry
          ctx.stroke();
          ctx.setLineDash([]); // reset

          // Draw Glowing Attack Head
          // Interpolate along quadratic curve
          const t = arc.progress;
          const currentX = (1 - t) * (1 - t) * startPt.x + 2 * (1 - t) * t * midPt.x + t * t * endPt.x;
          const currentY = (1 - t) * (1 - t) * startPt.y + 2 * (1 - t) * t * midPt.y + t * t * endPt.y;

          ctx.fillStyle = arc.color;
          ctx.shadowBlur = 10;
          ctx.shadowColor = arc.color;
          ctx.beginPath();
          ctx.arc(currentX, currentY, 3, 0, Math.PI * 2);
          ctx.fill();
          
          ctx.shadowBlur = 0; // reset glow
        }
      }

      // Rotate Globe slowly
      rotationRef.current.y += 0.0015;

      animationFrameId = requestAnimationFrame(render);
    };

    render();

    // Cleanups
    return () => {
      cancelAnimationFrame(animationFrameId);
      window.removeEventListener('resize', resize);
    };
  }, []);

  return (
    <div className="relative w-full h-full flex items-center justify-center overflow-hidden rounded-xl border border-cyan-500/10 bg-[#070b19]/60 backdrop-blur-md">
      <div className="absolute top-4 left-4 z-10 font-mono text-[10px] text-cyan-400/80 tracking-widest uppercase flex items-center gap-2">
        <span className="h-2 w-2 rounded-full bg-cyan-500 animate-ping"></span>
        Globe Live Telemetry Streams (CNI Enclaves)
      </div>
      <canvas ref={canvasRef} className="w-full h-full block" />
    </div>
  );
}
