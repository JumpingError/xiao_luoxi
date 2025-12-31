import React, { useRef, useState } from 'react';
import { useFrame, useThree } from '@react-three/fiber';
import { Html } from '@react-three/drei';
import * as THREE from 'three';

const Group = 'group' as any;

interface FloatingItemProps {
  text: string;
  colorClass: string;
  glowColor?: string;
  position: [number, number, number];
  baseScale: number;
  speed: number;
}

export const FloatingItem: React.FC<FloatingItemProps> = ({ 
  text, 
  colorClass, 
  glowColor = "rgba(255,255,255,0.5)",
  position: initialPosition, 
  baseScale,
  speed
}) => {
  const groupRef = useRef<THREE.Group>(null);
  const textDivRef = useRef<HTMLDivElement>(null);
  const { camera } = useThree();
  
  // Random offset for sine wave movement
  const [randomOffset] = useState(() => Math.random() * 1000);
  const tempVec = useRef(new THREE.Vector3());

  useFrame((state, delta) => {
    if (!groupRef.current || !textDivRef.current) return;

    // --- Movement ---
    groupRef.current.position.y += speed * delta;
    groupRef.current.position.x += Math.sin(state.clock.elapsedTime * 0.5 + randomOffset) * 0.005;

    // Reset loop
    const TOP_LIMIT = 18;
    const BOTTOM_LIMIT = -18;
    const HEIGHT = TOP_LIMIT - BOTTOM_LIMIT;
    
    if (groupRef.current.position.y > TOP_LIMIT) {
      groupRef.current.position.y -= HEIGHT;
      // Reset to a random X within the narrower centralized range
      groupRef.current.position.x = (Math.random() - 0.5) * 14;
    }

    // --- Perspective & Opacity Logic ---
    groupRef.current.getWorldPosition(tempVec.current);
    const distance = camera.position.distanceTo(tempVec.current);
    
    const currentY = groupRef.current.position.y;
    
    // 1. Edge Fade (Top/Bottom)
    const edgeDist = Math.min(
      Math.abs(currentY - TOP_LIMIT), 
      Math.abs(currentY - BOTTOM_LIMIT)
    );
    const edgeOpacity = Math.min(1, edgeDist / 4);

    // 2. Depth Fade (Atmospheric Perspective)
    // Distance varies roughly from 5 (Close) to 40 (Far)
    // We want close items to be fully opaque (1.0), far items to be very faint (0.1)
    let depthOpacity = 1 - (distance - 10) / 30;
    depthOpacity = Math.max(0.1, Math.min(1, depthOpacity));

    const finalOpacity = edgeOpacity * depthOpacity;

    // Apply styles
    // IMPORTANT: Removed 'filter: blur()' to fix the mosaic/pixelation issue.
    // We rely purely on opacity and size to convey depth.
    textDivRef.current.style.opacity = finalOpacity.toString();
    
    // Always face camera
    groupRef.current.lookAt(camera.position);
  });

  return (
    <Group ref={groupRef} position={initialPosition}>
      <Html 
        transform 
        center 
        // Use a sprite-like rendering hint to prevent some jitter
        style={{ pointerEvents: 'none' }}
        // Increasing the distance factor helps with aliasing on some screens
        distanceFactor={10} 
      >
        <div 
          ref={textDivRef}
          className={`
            ${colorClass} 
            font-bold
            whitespace-nowrap 
            select-none
            transition-opacity duration-300
          `}
          style={{ 
            // Aesthetic: Use the rounded font
            fontFamily: '"ZCOOL KuaiLe", sans-serif',
            // HIGH RESOLUTION TRICK:
            // Render text very large (e.g. 80px), then the 3D perspective scales it down.
            // This prevents the jagged "sawtooth" edges on transform.
            fontSize: '80px', 
            // Adjust local scale to compensate for the large font size
            transform: `scale(${baseScale * 0.2})`, 
            // Stronger glow for the neon effect
            textShadow: `0 0 10px ${glowColor}, 0 0 20px ${glowColor}, 0 0 40px ${glowColor}`
          }}
        >
          {text}
        </div>
      </Html>
    </Group>
  );
};