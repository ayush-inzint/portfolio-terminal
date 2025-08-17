'use client';

import { useRef, useState } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { Text } from '@react-three/drei';
import * as THREE from 'three';

function Card() {
  const meshRef = useRef<THREE.Group>(null);
  const [hovered, setHovered] = useState(false);

  useFrame((state, delta) => {
    if (meshRef.current) {
      meshRef.current.rotation.y += delta * 0.3;
      if (hovered) {
        meshRef.current.scale.lerp(new THREE.Vector3(1.1, 1.1, 1.1), 0.1);
      } else {
        meshRef.current.scale.lerp(new THREE.Vector3(1, 1, 1), 0.1);
      }
    }
  });

  return (
    <group
      ref={meshRef}
      onPointerOver={() => setHovered(true)}
      onPointerOut={() => setHovered(false)}
    >
      {/* Business Card Base */}
      <mesh position={[0, 0, 0]}>
        <boxGeometry args={[3.5, 2, 0.1]} />
        <meshStandardMaterial
          color="#0a0a0a"
          metalness={0.8}
          roughness={0.2}
          side={THREE.DoubleSide}
        />
      </mesh>
      
      {/* Green Accent Border */}
      <mesh position={[0, 0, 0.051]}>
        <boxGeometry args={[3.52, 2.02, 0.01]} />
        <meshStandardMaterial
          color="#00ff00"
          emissive="#00ff00"
          emissiveIntensity={0.2}
        />
      </mesh>
      
      {/* Front Text */}
      <Text
        position={[0, 0.5, 0.06]}
        fontSize={0.25}
        color="#00ff00"
        anchorX="center"
        anchorY="middle"
      >
        MARK GATERE
      </Text>
      
      <Text
        position={[0, 0.1, 0.06]}
        fontSize={0.15}
        color="#00ffff"
        anchorX="center"
        anchorY="middle"
      >
        Software Engineer
      </Text>
      
      <Text
        position={[0, -0.2, 0.06]}
        fontSize={0.12}
        color="#ffffff"
        anchorX="center"
        anchorY="middle"
      >
        Full Stack Developer
      </Text>
      
      <Text
        position={[0, -0.5, 0.06]}
        fontSize={0.1}
        color="#888888"
        anchorX="center"
        anchorY="middle"
      >
        Microsoft • Cloud • AI
      </Text>

      {/* Back Text */}
      <Text
        position={[0, 0.3, -0.06]}
        fontSize={0.12}
        color="#00ff00"
        anchorX="center"
        anchorY="middle"
        rotation={[0, Math.PI, 0]}
      >
        gateremg@gmail.com
      </Text>
      
      <Text
        position={[0, 0, -0.06]}
        fontSize={0.12}
        color="#00ff00"
        anchorX="center"
        anchorY="middle"
        rotation={[0, Math.PI, 0]}
      >
        github.com/gateremark
      </Text>
      
      <Text
        position={[0, -0.3, -0.06]}
        fontSize={0.12}
        color="#00ff00"
        anchorX="center"
        anchorY="middle"
        rotation={[0, Math.PI, 0]}
      >
        +254-757-826724
      </Text>
    </group>
  );
}

export default function Card3DBasic() {
  return (
    <div className="absolute inset-0 h-full w-full">
      <Canvas 
        camera={{ position: [0, 0, 6], fov: 45 }} 
        style={{ background: 'transparent' }}
      >
        <ambientLight intensity={0.5} />
        <pointLight position={[10, 10, 10]} intensity={1} />
        <pointLight position={[-10, -10, -10]} intensity={0.5} color="#00ff00" />
        
        <Card />
      </Canvas>
    </div>
  );
}