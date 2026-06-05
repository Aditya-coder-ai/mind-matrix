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

// Individual glowing node
function NeuralNode({ position, scale = 1 }: { position: THREE.Vector3; scale?: number }) {
  const ref = useRef<THREE.Mesh>(null);
  const speed = useMemo(() => 0.5 + Math.random() * 1.5, []);
  const offset = useMemo(() => Math.random() * Math.PI * 2, []);

  useFrame(({ clock }) => {
    if (ref.current) {
      const pulse = 0.7 + Math.sin(clock.elapsedTime * speed + offset) * 0.3;
      ref.current.scale.setScalar(scale * pulse);
    }
  });

  return (
    <mesh ref={ref} position={position}>
      <sphereGeometry args={[0.06, 12, 12]} />
      <meshStandardMaterial
        color="#818cf8"
        emissive="#6366f1"
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
    const maxDist = 1.2;

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
      mat.opacity = 0.15 + Math.sin(clock.elapsedTime * 0.5) * 0.08;
    }
  });

  return (
    <lineSegments ref={ref} geometry={geometry}>
      <lineBasicMaterial color="#818cf8" transparent opacity={0.18} />
    </lineSegments>
  );
}

// Rotating brain group
function BrainGroup() {
  const groupRef = useRef<THREE.Group>(null);
  const points = useMemo(() => fibonacciSphere(80, 2), []);

  useFrame(({ clock }) => {
    if (groupRef.current) {
      groupRef.current.rotation.y = clock.elapsedTime * 0.08;
      groupRef.current.rotation.x = Math.sin(clock.elapsedTime * 0.05) * 0.15;
    }
  });

  return (
    <group ref={groupRef}>
      {/* Inner glowing core */}
      <Float speed={1.5} rotationIntensity={0.3} floatIntensity={0.5}>
        <mesh>
          <sphereGeometry args={[1.3, 32, 32]} />
          <MeshDistortMaterial
            color="#312e81"
            emissive="#4338ca"
            emissiveIntensity={0.5}
            transparent
            opacity={0.15}
            distort={0.25}
            speed={2}
            roughness={0.2}
          />
        </mesh>
      </Float>

      {/* Neural nodes */}
      {points.map((p, i) => (
        <NeuralNode key={i} position={p} scale={0.6 + Math.random() * 0.8} />
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
    const pos = new Float32Array(200 * 3);
    for (let i = 0; i < 200; i++) {
      pos[i * 3] = (Math.random() - 0.5) * 12;
      pos[i * 3 + 1] = (Math.random() - 0.5) * 12;
      pos[i * 3 + 2] = (Math.random() - 0.5) * 12;
    }
    return [pos];
  }, []);

  useFrame(({ clock }) => {
    if (ref.current) {
      ref.current.rotation.y = clock.elapsedTime * 0.02;
    }
  });

  return (
    <points ref={ref}>
      <bufferGeometry>
        <bufferAttribute
          attach="attributes-position"
          count={200}
          array={positions}
          itemSize={3}
        />
      </bufferGeometry>
      <pointsMaterial
        color="#6366f1"
        size={0.03}
        transparent
        opacity={0.6}
        sizeAttenuation
      />
    </points>
  );
}

export default function NeuralBrain3D() {
  return (
    <div className="absolute inset-0 z-0">
      <Canvas
        camera={{ position: [0, 0, 5.5], fov: 50 }}
        gl={{ antialias: true, alpha: true }}
        style={{ background: 'transparent' }}
      >
        <ambientLight intensity={0.3} />
        <pointLight position={[5, 5, 5]} intensity={0.8} color="#818cf8" />
        <pointLight position={[-5, -3, 3]} intensity={0.4} color="#a78bfa" />

        <BrainGroup />
        <AmbientParticles />
      </Canvas>
    </div>
  );
}
