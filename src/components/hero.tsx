'use client';

import { useEffect, useRef } from 'react';
import * as THREE from 'three';
import { HowTo } from './how_to';

interface Rectangle {
  mesh: THREE.Mesh;
  position: THREE.Vector3;
  originalY: number;
  targetY: number;
  material: THREE.MeshStandardMaterial;
  targetColor: THREE.Color;
}

export const Hero = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const sceneRef = useRef<{
    scene: THREE.Scene;
    camera: THREE.OrthographicCamera;
    renderer: THREE.WebGLRenderer;
    rectangles: Rectangle[];
    raycaster: THREE.Raycaster;
    mouse: THREE.Vector2;
    hoverPoint: THREE.Vector3 | null;
    groundPlane: THREE.Plane;
    baseColor: number;
    hoverColor: number;
  } | null>(null);

  useEffect(() => {
    if (!canvasRef.current) return;

    // Scene setup
    const scene = new THREE.Scene();
    scene.background = new THREE.Color(0xf9fafb); // Tailwind gray-50

    // Camera setup - Isometric orthographic
    const aspect = window.innerWidth / window.innerHeight;
    const frustumSize = 10;
    const camera = new THREE.OrthographicCamera(
      (frustumSize * aspect) / -2,
      (frustumSize * aspect) / 2,
      frustumSize / 2,
      frustumSize / -2,
      0.1,
      1000
    );
    camera.position.set(8, 8, 8);
    camera.lookAt(0, 0, 0);

    // Renderer setup
    const renderer = new THREE.WebGLRenderer({
      canvas: canvasRef.current,
      antialias: true,
      alpha: false,
    });
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));

    // Lighting
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.6);
    scene.add(ambientLight);

    // Color configuration
    const baseColor = 0xcccccc;
    const hoverColor = 0xdddddd;

    // Create rectangles in chess pattern
    const rectangles: Rectangle[] = [];
    const cols = 12;
    const rows = 12;
    const layers = 6;
    const spacing = 1.0;
    const width = 1;
    const height = 1;
    const depth = 0.01;

    for (let z = 0; z < layers; z++) {
      for (let x = 0; x < cols; x++) {
        for (let y = 0; y < rows; y++) {
          // Chess pattern - only place on alternating squares (2D checkerboard)
          if ((x + y) % 2 !== 0) continue;

          const geometry = new THREE.BoxGeometry(width, depth, height);

          const material = new THREE.MeshStandardMaterial({
            color: 0xffffff,
            emissive: baseColor,
            emissiveIntensity: 1,
          });

          const mesh = new THREE.Mesh(geometry, material);

          // Position in grid
          const posX = (x - cols / 2) * spacing;
          const posY = 0;
          const posZ = (y - rows / 2) * spacing - z * spacing * 2;

          mesh.position.set(posX, posY, posZ);

          rectangles.push({
            mesh,
            position: mesh.position.clone(),
            originalY: posY,
            targetY: posY,
            material,
            targetColor: new THREE.Color(baseColor),
          });

          scene.add(mesh);
        }
      }
    }

    // Raycaster for hover detection with ground plane
    const raycaster = new THREE.Raycaster();
    const mouse = new THREE.Vector2();
    const groundPlane = new THREE.Plane(new THREE.Vector3(0, 1, 0), 0);

    sceneRef.current = {
      scene,
      camera,
      renderer,
      rectangles,
      raycaster,
      mouse,
      hoverPoint: null,
      groundPlane,
      baseColor,
      hoverColor,
    };

    // Handle resize
    const handleResize = () => {
      if (!sceneRef.current) return;
      const aspect = window.innerWidth / window.innerHeight;
      sceneRef.current.camera.left = (frustumSize * aspect) / -2;
      sceneRef.current.camera.right = (frustumSize * aspect) / 2;
      sceneRef.current.camera.top = frustumSize / 2;
      sceneRef.current.camera.bottom = frustumSize / -2;
      sceneRef.current.camera.updateProjectionMatrix();
      sceneRef.current.renderer.setSize(window.innerWidth, window.innerHeight);
    };

    window.addEventListener('resize', handleResize);

    // Initial render
    renderer.render(scene, camera);

    // Animation loop
    let animationFrameId: number;
    let isAnimating = false;

    const animate = () => {
      animationFrameId = requestAnimationFrame(animate);

      if (!sceneRef.current) return;

      let needsRender = false;

      // Smooth transitions for elevation and color
      sceneRef.current.rectangles.forEach(rect => {
        // Animate Y position
        const currentY = rect.mesh.position.y;
        const targetY = rect.targetY;
        const diffY = targetY - currentY;

        if (Math.abs(diffY) > 0.001) {
          rect.mesh.position.y += diffY * 0.1;
          needsRender = true;
        } else if (Math.abs(diffY) > 0) {
          rect.mesh.position.y = targetY;
          needsRender = true;
        }

        // Animate color
        const currentColor = rect.material.emissive;
        const targetColor = rect.targetColor;

        if (!currentColor.equals(targetColor)) {
          currentColor.lerp(targetColor, 0.1);
          needsRender = true;
        }
      });

      // Only render if something changed or currently animating
      if (needsRender) {
        sceneRef.current.renderer.render(sceneRef.current.scene, sceneRef.current.camera);
        isAnimating = true;
      } else if (isAnimating) {
        // One final render after animation completes
        sceneRef.current.renderer.render(sceneRef.current.scene, sceneRef.current.camera);
        isAnimating = false;
      }
    };
    animate();

    // Cleanup
    return () => {
      window.removeEventListener('resize', handleResize);
      cancelAnimationFrame(animationFrameId);
      renderer.dispose();
      rectangles.forEach(rect => {
        rect.mesh.geometry.dispose();
        rect.material.dispose();
      });
    };
  }, []);

  const handleMouseMove = (event: React.MouseEvent<HTMLDivElement>) => {
    if (!sceneRef.current) return;

    const { raycaster, mouse, camera, rectangles, groundPlane, baseColor, hoverColor } = sceneRef.current;

    // Calculate mouse position in normalized device coordinates
    mouse.x = (event.clientX / window.innerWidth) * 2 - 1;
    mouse.y = -(event.clientY / window.innerHeight) * 2 + 1;

    // Update raycaster
    raycaster.setFromCamera(mouse, camera);

    // Find intersection with ground plane
    const hoverPoint = new THREE.Vector3();
    raycaster.ray.intersectPlane(groundPlane, hoverPoint);

    if (hoverPoint) {
      sceneRef.current.hoverPoint = hoverPoint;

      // Update all rectangles based on distance to hover point
      rectangles.forEach(rect => {
        // Calculate distance from rectangle's original position to hover point
        const distance = new THREE.Vector3(
          rect.position.x,
          0,
          rect.position.z
        ).distanceTo(new THREE.Vector3(hoverPoint.x, 0, hoverPoint.z));

        // Apply elevation and color based on distance
        if (distance < 3) {
          const influence = 1 - distance / 3;
          rect.targetY = rect.originalY + influence * 0.5;
          rect.targetColor.setHex(hoverColor);
        } else {
          rect.targetY = rect.originalY;
          rect.targetColor.setHex(baseColor);
        }
      });
    }
  };

  const handleMouseLeave = () => {
    if (!sceneRef.current) return;

    const { rectangles, baseColor } = sceneRef.current;

    rectangles.forEach(rect => {
      rect.targetY = rect.originalY;
      rect.targetColor.setHex(baseColor);
    });

    sceneRef.current.hoverPoint = null;
  };

  return (
    <div
      className="relative z-30 bg-gray-50 py-20 md:py-32 overflow-hidden"
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
    >
      <canvas
        ref={canvasRef}
        className="absolute inset-0 w-full h-full"
      />

      <div className="relative z-40 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pointer-events-none">
        <div className="text-left max-w-7xl mx-auto">
          <div className="relative">
            <h2 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-gray-900 mb-6 leading-tight">
              <span className="block">Shaping Cities on</span>
              <span className="bg-gradient-to-r from-blue-600 to-indigo-700 text-transparent bg-clip-text">Common Ground</span>
            </h2>
            <p className="text-xl text-gray-600 mb-8">Bring your voice to the table. Share ideas, shape policies, and co-create the cities we need for tomorrow.</p>
          </div>
          <HowTo />
        </div>
      </div>
    </div>
  );
};
