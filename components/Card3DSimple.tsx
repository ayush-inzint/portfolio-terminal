'use client';

import { useRef, useState } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { OrbitControls, Text, RoundedBox, MeshReflectorMaterial, Float } from '@react-three/drei';
import * as THREE from 'three';

function Card() {
  const meshRef = useRef<THREE.Mesh>(null);
  const [hovered, setHovered] = useState(false);
  const [clicked, setClicked] = useState(false);

  useFrame((state, delta) => {
    if (meshRef.current) {
      meshRef.current.rotation.y += delta * 0.2;
      if (hovered) {
        meshRef.current.scale.lerp(new THREE.Vector3(1.1, 1.1, 1.1), 0.1);
      } else {
        meshRef.current.scale.lerp(new THREE.Vector3(1, 1, 1), 0.1);
      }
    }
  });

  return (
    <Float
      speed={2}
      rotationIntensity={0.5}
      floatIntensity={0.5}
      floatingRange={[-0.1, 0.1]}
    >
      <group
        ref={meshRef}
        onPointerOver={() => setHovered(true)}
        onPointerOut={() => setHovered(false)}
        onClick={() => setClicked(!clicked)}
      >
        {/* Business Card */}
        <RoundedBox 
          args={[3.5, 2, 0.05]} 
          radius={0.05} 
          smoothness={4}
          position={[0, 0, 0]}
        >
          <meshPhysicalMaterial
            color="#0a0a0a"
            metalness={0.9}
            roughness={0.1}
            clearcoat={1}
            clearcoatRoughness={0.1}
            envMapIntensity={1}
            side={THREE.DoubleSide}
          />
        </RoundedBox>
        
        {/* Front Text */}
        <Text
          position={[0, 0.4, 0.03]}
          fontSize={0.3}
          color="#00ff00"
          anchorX="center"
          anchorY="middle"
        >
          MARK GATERE
        </Text>
        
        <Text
          position={[0, 0, 0.03]}
          fontSize={0.15}
          color="#00ffff"
          anchorX="center"
          anchorY="middle"
        >
          Software & AI Engineer
        </Text>
        
        <Text
          position={[0, -0.4, 0.03]}
          fontSize={0.12}
          color="#ffffff"
          anchorX="center"
          anchorY="middle"
        >
          Microsoft • Full Stack • Cloud
        </Text>

        {/* Back Text (when clicked) */}
        {clicked && (
          <>
            <Text
              position={[0, 0.3, -0.03]}
              fontSize={0.12}
              color="#00ff00"
              anchorX="center"
              anchorY="middle"
              rotation={[0, Math.PI, 0]}
            >
              gateremg@gmail.com
            </Text>
            <Text
              position={[0, 0, -0.03]}
              fontSize={0.12}
              color="#00ff00"
              anchorX="center"
              anchorY="middle"
              rotation={[0, Math.PI, 0]}
            >
              github.com/gateremark
            </Text>
            <Text
              position={[0, -0.3, -0.03]}
              fontSize={0.12}
              color="#00ff00"
              anchorX="center"
              anchorY="middle"
              rotation={[0, Math.PI, 0]}
            >
              +254-757-826724
            </Text>
          </>
        )}
        
        {/* Decorative Elements */}
        <mesh position={[1.5, 0.7, 0.05]}>
          <boxGeometry args={[0.3, 0.5, 0.02]} />
          <meshStandardMaterial color="silver" metalness={0.9} roughness={0.1} />
        </mesh>
        
        <mesh position={[0, 0.95, 0]}>
          <cylinderGeometry args={[0.1, 0.1, 0.15]} />
          <meshStandardMaterial color="gold" metalness={0.9} roughness={0.1} />
        </mesh>
      </group>
    </Float>
  );
}

export default function Card3DSimple() {
  return (
    <div className="absolute inset-0 h-full w-full">
      <Canvas 
        camera={{ position: [0, 0, 8], fov: 35 }} 
        style={{ backgroundColor: 'transparent' }}
        gl={{ antialias: true, alpha: true }}
      >
        <ambientLight intensity={0.5} />
        <spotLight 
          position={[10, 10, 10]} 
          angle={0.15} 
          penumbra={1} 
          intensity={1}
          castShadow
        />
        <pointLight position={[-10, -10, -10]} intensity={0.5} color="#00ff00" />
        
        <Card />
        
        {/* Interactive controls */}
        <OrbitControls 
          enablePan={false}
          enableZoom={false}
          minPolarAngle={Math.PI / 3}
          maxPolarAngle={Math.PI / 2}
        />
        
        {/* Reflective floor */}
        <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -3, 0]} receiveShadow>
          <planeGeometry args={[50, 50]} />
          <MeshReflectorMaterial
            blur={[300, 100]}
            resolution={2048}
            mixBlur={1}
            mixStrength={40}
            roughness={1}
            depthScale={1.2}
            minDepthThreshold={0.4}
            maxDepthThreshold={1.4}
            color="#101010"
            metalness={0.5}
            mirror={0}
          />
        </mesh>
      </Canvas>
    </div>
  );
}