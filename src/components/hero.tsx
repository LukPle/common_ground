'use client';

import { MouseEvent, useEffect, useState } from 'react';

export const Hero = () => {
  const [hoveredBlock, setHoveredBlock] = useState<number | null>(null);
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const checkMobile = () => {
      const mobileCheck = window.innerWidth < 768;
      if (mobileCheck !== isMobile) {
        setIsMobile(mobileCheck);
      }
    };
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, [isMobile]);

  const handleMouseMove = (e: MouseEvent<HTMLDivElement>) => {
    if (isMobile) return;
    const rect = e.currentTarget.getBoundingClientRect();
    const x = ((e.clientX - rect.left) / rect.width) * 100;
    const y = ((e.clientY - rect.top) / rect.height) * 100;
  };

  const handleMouseLeave = () => {
    setHoveredBlock(null);
  };

  const desktopBlocks = [
    { id: 1, x: 2, y: 8, w: 12, h: 18, color: 'from-blue-400/20 to-blue-500/10' },
    { id: 2, x: 16, y: 4, w: 15, h: 22, color: 'from-indigo-400/15 to-indigo-500/10' },
    { id: 3, x: 33, y: 10, w: 10, h: 16, color: 'from-purple-400/20 to-purple-500/10' },
    { id: 4, x: 45, y: 6, w: 13, h: 20, color: 'from-blue-500/15 to-blue-600/10' },
    { id: 5, x: 60, y: 3, w: 16, h: 17, color: 'from-indigo-500/20 to-indigo-600/10' },
    { id: 6, x: 78, y: 8, w: 12, h: 19, color: 'from-purple-500/15 to-purple-600/10' },
    { id: 7, x: 93, y: 5, w: 6, h: 22, color: 'from-blue-400/20 to-blue-500/15' },
    { id: 8, x: 4, y: 30, w: 14, h: 15, color: 'from-purple-400/15 to-purple-500/10' },
    { id: 9, x: 20, y: 32, w: 11, h: 20, color: 'from-blue-500/20 to-blue-600/10' },
    { id: 10, x: 33, y: 34, w: 13, h: 14, color: 'from-indigo-400/15 to-indigo-500/10' },
    { id: 11, x: 48, y: 31, w: 10, h: 18, color: 'from-purple-500/20 to-purple-600/10' },
    { id: 12, x: 60, y: 28, w: 15, h: 16, color: 'from-blue-400/15 to-blue-500/10' },
    { id: 13, x: 77, y: 33, w: 12, h: 19, color: 'from-indigo-500/20 to-indigo-600/10' },
    { id: 14, x: 91, y: 30, w: 8, h: 15, color: 'from-purple-400/15 to-purple-500/10' },
    { id: 15, x: 1, y: 55, w: 13, h: 20, color: 'from-blue-500/20 to-blue-600/10' },
    { id: 16, x: 16, y: 58, w: 16, h: 17, color: 'from-indigo-400/15 to-indigo-500/10' },
    { id: 17, x: 34, y: 53, w: 11, h: 22, color: 'from-purple-500/20 to-purple-600/10' },
    { id: 18, x: 47, y: 56, w: 14, h: 18, color: 'from-blue-400/15 to-blue-500/10' },
    { id: 19, x: 63, y: 51, w: 12, h: 24, color: 'from-indigo-500/20 to-indigo-600/10' },
    { id: 20, x: 77, y: 57, w: 13, h: 16, color: 'from-purple-400/20 to-purple-500/10' },
    { id: 21, x: 92, y: 54, w: 7, h: 20, color: 'from-blue-500/15 to-blue-600/10' },
    { id: 22, x: 8, y: 80, w: 15, h: 18, color: 'from-indigo-400/20 to-indigo-500/10' },
    { id: 23, x: 25, y: 82, w: 12, h: 16, color: 'from-purple-500/15 to-purple-600/10' },
    { id: 24, x: 39, y: 79, w: 14, h: 19, color: 'from-blue-400/20 to-blue-500/10' },
    { id: 25, x: 55, y: 81, w: 16, h: 17, color: 'from-indigo-500/15 to-indigo-600/10' },
    { id: 26, x: 73, y: 78, w: 11, h: 20, color: 'from-purple-400/20 to-purple-500/10' },
    { id: 27, x: 86, y: 80, w: 13, h: 18, color: 'from-blue-500/20 to-blue-600/10' },
  ];

  const mobileBlocks = [
    { id: 1, x: 3, y: 5, w: 40, h: 25, color: 'from-blue-400/20 to-blue-500/10' },
    { id: 4, x: 55, y: 10, w: 40, h: 22, color: 'from-blue-500/15 to-blue-600/10' },
    { id: 5, x: 5, y: 35, w: 45, h: 20, color: 'from-indigo-500/20 to-indigo-600/10' },
    { id: 8, x: 52, y: 36, w: 43, h: 20, color: 'from-indigo-400/15 to-indigo-500/10' },
    { id: 9, x: 8, y: 62, w: 40, h: 32, color: 'from-purple-400/20 to-purple-500/10' },
    { id: 12, x: 55, y: 68, w: 40, h: 26, color: 'from-purple-500/20 to-purple-600/10' },
  ];

  const blocks = isMobile ? mobileBlocks : desktopBlocks;
  const gridNodeCount = isMobile ? 12 : 30;
  const gridCols = isMobile ? 3 : 6;

  const gridNodes = Array.from({ length: gridNodeCount }, (_, i) => ({
    id: i,
    x: 8 + (i % gridCols) * (84 / (gridCols - 1)),
    y: 15 + Math.floor(i / gridCols) * (70 / Math.ceil(gridNodeCount / gridCols - 1)),
  }));

  const getDistance = (x1: number, y1: number, x2: number, y2: number) => {
    return Math.sqrt(Math.pow(x2 - x1, 2) + Math.pow(y2 - y1, 2));
  };

  const getBlockTransform = (block: typeof blocks[0]) => {
    if (hoveredBlock === null) return { scale: 1, brightness: 1, z: 0 };
    if (block.id === hoveredBlock) return { scale: 1.1, brightness: 1.25, z: 30 };
    const hoveredData = blocks.find(b => b.id === hoveredBlock);
    if (!hoveredData) return { scale: 1, brightness: 1, z: 0 };
    const distance = getDistance(block.x + block.w / 2, block.y + block.h / 2, hoveredData.x + hoveredData.w / 2, hoveredData.y + hoveredData.h / 2);
    if (distance < 25) return { scale: 1.05, brightness: 1.15, z: 20 };
    return { scale: 1, brightness: 1, z: 0 };
  };

  const getNodeOpacity = (node: typeof gridNodes[0]) => {
    if (hoveredBlock === null) return 0.4;
    const hoveredData = blocks.find(b => b.id === hoveredBlock);
    if (!hoveredData) return 0.4;
    const dist = getDistance(node.x, node.y, hoveredData.x + hoveredData.w / 2, hoveredData.y + hoveredData.h / 2);
    if (dist < 20) return 1;
    if (dist < 35) return 0.7;
    return 0.3;
  };

  const getLineOpacity = (node1: typeof gridNodes[0], node2: typeof gridNodes[0]) => {
    if (hoveredBlock === null) return 0.1;
    const hoveredData = blocks.find(b => b.id === hoveredBlock);
    if (!hoveredData) return 0.1;
    const dist1 = getDistance(node1.x, node1.y, hoveredData.x + hoveredData.w / 2, hoveredData.y + hoveredData.h / 2);
    const dist2 = getDistance(node2.x, node2.y, hoveredData.x + hoveredData.w / 2, hoveredData.y + hoveredData.h / 2);
    if (dist1 < 25 || dist2 < 25) return 0.5;
    return 0.1;
  };

  return (
    <div
      className="relative z-30 bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100 py-20 md:py-36 overflow-hidden"
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
    >
      <div className="absolute inset-0">
        <svg className="w-full h-full absolute inset-0" preserveAspectRatio="none">
          <defs>
            <filter id="glow"><feGaussianBlur stdDeviation="2" result="coloredBlur" /><feMerge><feMergeNode in="coloredBlur" /><feMergeNode in="SourceGraphic" /></feMerge></filter>
            <linearGradient id="lineGradient" x1="0%" y1="0%" x2="100%" y2="100%"><stop offset="0%" stopColor="#6366f1" /><stop offset="100%" stopColor="#8b5cf6" /></linearGradient>
          </defs>

          {gridNodes.map((node, i) =>
            gridNodes.slice(i + 1).map((node2, j) => {
              const distance = getDistance(node.x, node.y, node2.x, node2.y);
              if (distance < (isMobile ? 40 : 30)) {
                return <line key={`line-${i}-${j}`} x1={`${node.x}%`} y1={`${node.y}%`} x2={`${node.x}%`} y2={`${node2.y}%`} stroke="url(#lineGradient)" strokeWidth="1.5" opacity={isMobile ? 0.1 : getLineOpacity(node, node2)} className="transition-all duration-500 ease-out" />;
              }
              return null;
            })
          )}
          {gridNodes.map(node => (
            <circle key={`node-${node.id}`} cx={`${node.x}%`} cy={`${node.y}%`} r={isMobile ? "3" : "4"} fill="#6366f1" opacity={isMobile ? 0.4 : getNodeOpacity(node)} filter="url(#glow)" className="transition-all duration-500 ease-out" />
          ))}
        </svg>

        {blocks.map(block => {
          const transform = isMobile ? { scale: 1, brightness: 1, z: 0 } : getBlockTransform(block);
          return (
            <div
              key={block.id}
              className={`absolute bg-gradient-to-br ${block.color} border border-white/60 backdrop-blur-sm rounded-sm transition-all duration-500 ease-out ${!isMobile ? 'cursor-pointer' : ''}`}
              style={{
                left: `${block.x}%`, top: `${block.y}%`,
                width: `${block.w}%`, height: `${block.h}%`,
                transform: `scale(${transform.scale}) translateZ(0)`,
                filter: `brightness(${transform.brightness})`,
                boxShadow: `0 ${transform.z}px ${transform.z * 2}px rgba(99, 102, 241, ${0.05 + transform.z * 0.005}), inset 0 1px 0 rgba(255, 255, 255, 0.2)`,
                zIndex: transform.z,
              }}
              onMouseEnter={() => !isMobile && setHoveredBlock(block.id)}
            />
          );
        })}
      </div>

      <div className={`relative z-40 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 ${!isMobile ? 'pointer-events-none' : ''}`}>
        <div className="text-center max-w-3xl mx-auto">
          <div className="relative">
            <div className="absolute inset-0 bg-white/40 backdrop-blur-xl rounded-3xl -m-6" style={{ maskImage: 'radial-gradient(ellipse at center, black 40%, transparent 85%)', WebkitMaskImage: 'radial-gradient(ellipse at center, black 40%, transparent 85%)' }} />
            <div className="relative">
              <h2 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-gray-900 mb-6 leading-tight">
                <span className="block">Shaping Cities on</span>
                <span className="bg-gradient-to-r from-blue-600 to-indigo-700 text-transparent bg-clip-text">Common Ground</span>
              </h2>
              <p className="text-xl text-gray-600 mb-8">Bring your voice to the table. Share ideas, shape policies, and co-create the cities we need for tomorrow.</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
