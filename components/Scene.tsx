import React, { useMemo } from 'react';
import { Canvas } from '@react-three/fiber';
import { FloatingItem } from './FloatingItem';

// Workaround for TypeScript error: Property '...' does not exist on type 'JSX.IntrinsicElements'
const AmbientLight = 'ambientLight' as any;
const PointLight = 'pointLight' as any;
const Group = 'group' as any;

const TEXT_OPTIONS = [
  { text: "小洛熙", type: "text", color: "text-pink-300", glowColor: "rgba(249, 168, 212, 0.8)" },
  { text: "小圆头", type: "text", color: "text-cyan-300", glowColor: "rgba(103, 232, 249, 0.8)" },
  { text: "要真相", type: "text", color: "text-amber-200", glowColor: "rgba(253, 230, 138, 0.8)" },
  { text: "❤", type: "icon", color: "text-red-400", glowColor: "rgba(248, 113, 113, 0.8)" },
  { text: "✨", type: "icon", color: "text-yellow-200", glowColor: "rgba(254, 240, 138, 0.8)" },
  { text: "💕", type: "icon", color: "text-pink-400", glowColor: "rgba(244, 114, 182, 0.8)" }
];

// Generate positions with better centralization
const generateItems = (count: number) => {
  return Array.from({ length: count }, (_, i) => {
    const isText = Math.random() > 0.4; 
    const options = isText 
      ? TEXT_OPTIONS.filter(t => t.type === 'text') 
      : TEXT_OPTIONS.filter(t => t.type === 'icon');
    
    const textConfig = options[Math.floor(Math.random() * options.length)];

    // Use a simpler randomization but clustered more towards center
    // X: Reduced spread from 28 to 14 to keep items on screen
    const x = (Math.random() - 0.5) * 14; 
    
    // Y: Keep vertical flow
    const y = (Math.random() - 0.5) * 35;
    
    // Z: Significantly increased depth range for dramatic "Near Big, Far Small"
    // Range: -25 (very far) to 5 (very close)
    const z = (Math.random() * 30) - 25; 

    return {
      id: i,
      ...textConfig,
      position: [x, y, z] as [number, number, number],
      // Base scale slightly varied
      scale: isText ? 1.0 : 0.7, 
      speed: 0.2 + Math.random() * 0.5 
    };
  });
};

export const Scene: React.FC = () => {
  // Increased count from 80 to 120
  const items = useMemo(() => generateItems(120), []);

  return (
    <Canvas camera={{ position: [0, 0, 15], fov: 45 }}>
      <AmbientLight intensity={0.8} />
      <PointLight position={[10, 10, 10]} intensity={0.5} />

      <Group>
        {items.map((item) => (
          <FloatingItem 
            key={item.id}
            text={item.text}
            colorClass={item.color}
            glowColor={item.glowColor}
            position={item.position}
            baseScale={item.scale}
            speed={item.speed}
          />
        ))}
      </Group>
    </Canvas>
  );
};