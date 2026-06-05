import React, { useRef, useMemo } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import * as THREE from 'three';

// Knowledge nodes floating in 3D space
function KnowledgeNodes({ count = 60 }: { count?: number }) {
  const meshRef = useRef<THREE.InstancedMesh>(null);
  const dummy = useMemo(() => new THREE.Object3D(), []);

  const nodes = useMemo(() => {
    return Array.from({ length: count }, () => ({
      position: new THREE.Vector3(
        (Math.random() - 0.5) * 16,
        (Math.random() - 0.5) * 10,
        (Math.random() - 0.5) * 8
      ),
      speed: 0.1 + Math.random() * 0.3,
      offset: Math.random() * Math.PI * 2,
      scale: 0.03 + Math.random() * 0.06,
    }));
  }, [count]);

  useFrame(({ clock }) => {
    if (!meshRef.current) return;
    const t = clock.elapsedTime;

    nodes.forEach((node, i) => {
      const floatY = Math.sin(t * node.speed + node.offset) * 0.3;
      const floatX = Math.cos(t * node.speed * 0.7 + node.offset) * 0.15;

      dummy.position.set(
        node.position.x + floatX,
        node.position.y + floatY,
        node.position.z
      );
      dummy.scale.setScalar(node.scale * (0.8 + Math.sin(t * node.speed * 2 + node.offset) * 0.2));
      dummy.updateMatrix();
      meshRef.current!.setMatrixAt(i, dummy.matrix);
    });

    meshRef.current.instanceMatrix.needsUpdate = true;
  });

  return (
    <instancedMesh ref={meshRef} args={[undefined, undefined, count]}>
      <sphereGeometry args={[1, 8, 8]} />
      <meshBasicMaterial color="#6366f1" transparent opacity={0.4} />
    </instancedMesh>
  );
}

// Subtle connection lines
function ConnectionLines() {
  const ref = useRef<THREE.LineSegments>(null);

  const geometry = useMemo(() => {
    const positions: number[] = [];
    const lineCount = 30;

    for (let i = 0; i < lineCount; i++) {
      const x1 = (Math.random() - 0.5) * 14;
      const y1 = (Math.random() - 0.5) * 8;
      const z1 = (Math.random() - 0.5) * 6;
      const x2 = x1 + (Math.random() - 0.5) * 4;
      const y2 = y1 + (Math.random() - 0.5) * 3;
      const z2 = z1 + (Math.random() - 0.5) * 2;
      positions.push(x1, y1, z1, x2, y2, z2);
    }

    const geo = new THREE.BufferGeometry();
    geo.setAttribute('position', new THREE.Float32BufferAttribute(positions, 3));
    return geo;
  }, []);

  useFrame(({ clock }) => {
    if (ref.current) {
      ref.current.rotation.y = clock.elapsedTime * 0.01;
      ref.current.rotation.x = Math.sin(clock.elapsedTime * 0.02) * 0.05;
    }
  });

  return (
    <lineSegments ref={ref} geometry={geometry}>
      <lineBasicMaterial color="#4f46e5" transparent opacity={0.08} />
    </lineSegments>
  );
}

// Slow-rotating ring
function OrbitalRing({ radius = 4, speed = 0.05, color = "#6366f1", opacity = 0.1 }: {
  radius?: number; speed?: number; color?: string; opacity?: number;
}) {
  const ref = useRef<THREE.Mesh>(null);

  useFrame(({ clock }) => {
    if (ref.current) {
      ref.current.rotation.x = Math.PI / 2 + Math.sin(clock.elapsedTime * speed) * 0.2;
      ref.current.rotation.z = clock.elapsedTime * speed;
    }
  });

  return (
    <mesh ref={ref}>
      <torusGeometry args={[radius, 0.008, 8, 100]} />
      <meshBasicMaterial color={color} transparent opacity={opacity} />
    </mesh>
  );
}

export default function ParticleField3D() {
  return (
    <div className="absolute inset-0 z-0 pointer-events-none" style={{ opacity: 0.6 }}>
      <Canvas
        camera={{ position: [0, 0, 8], fov: 50 }}
        gl={{ antialias: false, alpha: true }}
        style={{ background: 'transparent' }}
        dpr={[1, 1.5]} // limit pixel ratio for performance
      >
        <KnowledgeNodes count={60} />
        <ConnectionLines />
        <OrbitalRing radius={4.5} speed={0.03} opacity={0.12} />
        <OrbitalRing radius={3.5} speed={-0.04} color="#a78bfa" opacity={0.08} />
      </Canvas>
    </div>
  );
}
