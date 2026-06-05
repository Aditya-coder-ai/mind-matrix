import React, { useRef, useMemo } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { Float, MeshDistortMaterial } from '@react-three/drei';
import * as THREE from 'three';

// Generates points distributed on a sphere (Fibonacci sphere)
function fibonacciSphere(samples: number, radius: number): THREE.Vector3[] {
  const points: THREE.Vector3[] = [];
  const phi = Math.PI * (Math.sqrt(5) - 1); // golden angle
  for (let i = 0; i < samples; i++) {
    const y = 1 - (i / (samples - 1)) * 2;
    const r = Math.sqrt(1 - y * y);
    const theta = phi * i;
    points.push(new THREE.Vector3(
      Math.cos(theta) * r * radius,
      y * radius,
      Math.sin(theta) * r * radius
    ));
  }
  return points;
}

// Individual glowing node with varying colors (indigo, violet, rose)
function NeuralNode({ position, scale = 1 }: { position: THREE.Vector3; scale?: number }) {
  const ref = useRef<THREE.Mesh>(null);
  const speed = useMemo(() => 0.5 + Math.random() * 1.5, []);
  const offset = useMemo(() => Math.random() * Math.PI * 2, []);
  
  const colorIndex = useMemo(() => Math.floor(Math.random() * 3), []);
  const colors = [
    { main: "#6366f1", emissive: "#818cf8" }, // indigo
    { main: "#a855f7", emissive: "#c084fc" }, // violet
    { main: "#fb7185", emissive: "#fda4af" }  // rose
  ];

  useFrame(({ clock }) => {
    if (ref.current) {
      // Hot pink pulses randomly
      const time = clock.elapsedTime * speed + offset;
      const isPulsing = Math.sin(time * 0.5) > 0.85;
      
      const pulseScale = 0.7 + Math.sin(time) * 0.3;
      ref.current.scale.setScalar(scale * pulseScale);

      const mat = ref.current.material as THREE.MeshStandardMaterial;
      if (isPulsing) {
        mat.emissive.set("#ff1493"); // hot pink pulse
        mat.emissiveIntensity = 4;
      } else {
        mat.emissive.set(colors[colorIndex].emissive);
        mat.emissiveIntensity = 2;
      }
    }
  });

  return (
    <mesh ref={ref} position={position}>
      <sphereGeometry args={[0.06, 12, 12]} />
      <meshStandardMaterial
        color={colors[colorIndex].main}
        emissive={colors[colorIndex].emissive}
        emissiveIntensity={2}
        toneMapped={false}
      />
    </mesh>
  );
}

// Connections between nearby nodes
function NeuralConnections({ points }: { points: THREE.Vector3[] }) {
  const ref = useRef<THREE.LineSegments>(null);

  const geometry = useMemo(() => {
    const positions: number[] = [];
    const maxDist = 1.3;

    for (let i = 0; i < points.length; i++) {
      for (let j = i + 1; j < points.length; j++) {
        const dist = points[i].distanceTo(points[j]);
        if (dist < maxDist) {
          positions.push(points[i].x, points[i].y, points[i].z);
          positions.push(points[j].x, points[j].y, points[j].z);
        }
      }
    }

    const geo = new THREE.BufferGeometry();
    geo.setAttribute('position', new THREE.Float32BufferAttribute(positions, 3));
    return geo;
  }, [points]);

  useFrame(({ clock }) => {
    if (ref.current && ref.current.material) {
      const mat = ref.current.material as THREE.LineBasicMaterial;
      // Perspective fading is handled naturally by distance from camera
      mat.opacity = 0.15 + Math.sin(clock.elapsedTime * 0.5) * 0.05;
    }
  });

  return (
    <lineSegments ref={ref} geometry={geometry}>
      <lineBasicMaterial color="#a855f7" transparent opacity={0.2} depthWrite={false} />
    </lineSegments>
  );
}

// Rotating brain group
function BrainGroup() {
  const groupRef = useRef<THREE.Group>(null);
  const points = useMemo(() => fibonacciSphere(100, 2.2), []);

  useFrame(({ clock }) => {
    if (groupRef.current) {
      groupRef.current.rotation.y = clock.elapsedTime * 0.1;
      groupRef.current.rotation.x = Math.sin(clock.elapsedTime * 0.05) * 0.1;
    }
  });

  return (
    <group ref={groupRef}>
      {/* Inner soft purple radial glow */}
      <Float speed={1} rotationIntensity={0.2} floatIntensity={0.2}>
        <mesh>
          <sphereGeometry args={[1.5, 32, 32]} />
          <MeshDistortMaterial
            color="#2e1065"
            emissive="#4c1d95"
            emissiveIntensity={0.8}
            transparent
            opacity={0.3}
            distort={0.4}
            speed={2}
            roughness={0.1}
          />
        </mesh>
      </Float>

      {/* Neural nodes */}
      {points.map((p, i) => (
        <NeuralNode key={i} position={p} scale={0.5 + Math.random() * 0.7} />
      ))}

      {/* Connections */}
      <NeuralConnections points={points} />
    </group>
  );
}

// Ambient floating particles
function AmbientParticles() {
  const ref = useRef<THREE.Points>(null);

  const [positions] = useMemo(() => {
    const pos = new Float32Array(150 * 3);
    for (let i = 0; i < 150; i++) {
      pos[i * 3] = (Math.random() - 0.5) * 15;
      pos[i * 3 + 1] = (Math.random() - 0.5) * 15;
      pos[i * 3 + 2] = (Math.random() - 0.5) * 15;
    }
    return [pos];
  }, []);

  useFrame(({ clock }) => {
    if (ref.current) {
      ref.current.rotation.y = clock.elapsedTime * 0.015;
    }
  });

  return (
    <points ref={ref}>
      <bufferGeometry>
        <bufferAttribute
          attach="attributes-position"
          count={150}
          array={positions}
          itemSize={3}
        />
      </bufferGeometry>
      <pointsMaterial
        color="#fb7185"
        size={0.04}
        transparent
        opacity={0.4}
        sizeAttenuation
      />
    </points>
  );
}

interface NeuralBrain3DProps {
  className?: string;
}

export default function NeuralBrain3D({ className = "absolute inset-0 z-0" }: NeuralBrain3DProps) {
  return (
    <div className={className}>
      <Canvas
        camera={{ position: [0, 0, 6], fov: 45 }}
        gl={{ antialias: true, alpha: true }}
        style={{ background: 'transparent' }}
      >
        <ambientLight intensity={0.4} />
        <pointLight position={[5, 5, 5]} intensity={1.5} color="#c084fc" />
        <pointLight position={[-5, -3, 3]} intensity={1} color="#fb7185" />
        <pointLight position={[0, 5, -5]} intensity={0.5} color="#6366f1" />

        <BrainGroup />
        <AmbientParticles />
      </Canvas>
    </div>
  );
}
