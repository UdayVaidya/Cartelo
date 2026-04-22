import { useRef, useEffect, useMemo } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { Float, MeshDistortMaterial, Sparkles } from "@react-three/drei";
import { motion, AnimatePresence } from "framer-motion";
import { gsap } from "gsap";
import * as THREE from "three";

/* ─────────────────────────────────────────────
   Three.js scene pieces
───────────────────────────────────────────── */

function DistortedSphere() {
  const meshRef = useRef();
  useFrame(({ clock }) => {
    if (meshRef.current) {
      meshRef.current.rotation.x = clock.getElapsedTime() * 0.18;
      meshRef.current.rotation.y = clock.getElapsedTime() * 0.22;
    }
  });
  return (
    <Float speed={1.6} rotationIntensity={0.4} floatIntensity={0.8}>
      <mesh ref={meshRef}>
        <icosahedronGeometry args={[1.35, 1]} />
        <MeshDistortMaterial
          color="#f5c518"
          distort={0.55}
          speed={2.5}
          roughness={0.1}
          metalness={0.9}
          transparent
          opacity={0.18}
          wireframe
        />
      </mesh>
    </Float>
  );
}

function FloatingDebris() {
  const count = 38;
  const meshRefs = useRef([]);

  const data = useMemo(() =>
    Array.from({ length: count }, () => ({
      position: [
        (Math.random() - 0.5) * 9,
        (Math.random() - 0.5) * 9,
        (Math.random() - 0.5) * 6,
      ],
      speed: 0.15 + Math.random() * 0.45,
      offset: Math.random() * Math.PI * 2,
      scale: 0.04 + Math.random() * 0.14,
      color: Math.random() > 0.55 ? "#f5c518" : "#ffffff",
    })), []);

  useFrame(({ clock }) => {
    const t = clock.getElapsedTime();
    meshRefs.current.forEach((mesh, i) => {
      if (!mesh) return;
      const d = data[i];
      mesh.position.y = d.position[1] + Math.sin(t * d.speed + d.offset) * 0.6;
      mesh.position.x = d.position[0] + Math.cos(t * d.speed * 0.7 + d.offset) * 0.3;
      mesh.rotation.x = t * d.speed;
      mesh.rotation.z = t * d.speed * 0.6;
    });
  });

  return (
    <>
      {data.map((d, i) => (
        <mesh
          key={i}
          ref={(el) => (meshRefs.current[i] = el)}
          position={d.position}
          scale={d.scale}
        >
          {i % 3 === 0 ? (
            <octahedronGeometry args={[1]} />
          ) : i % 3 === 1 ? (
            <tetrahedronGeometry args={[1]} />
          ) : (
            <boxGeometry args={[1, 1, 1]} />
          )}
          <meshStandardMaterial
            color={d.color}
            metalness={0.7}
            roughness={0.2}
            transparent
            opacity={0.65}
          />
        </mesh>
      ))}
    </>
  );
}

function Scene() {
  return (
    <>
      <ambientLight intensity={0.3} />
      <pointLight position={[4, 4, 4]} intensity={2.5} color="#f5c518" />
      <pointLight position={[-4, -2, -2]} intensity={1.2} color="#ff4444" />
      <spotLight position={[0, 8, 2]} angle={0.35} penumbra={1} intensity={3} color="#ffffff" />
      <DistortedSphere />
      <FloatingDebris />
      <Sparkles
        count={60}
        scale={10}
        size={1.2}
        speed={0.3}
        color="#f5c518"
        opacity={0.5}
      />
    </>
  );
}

/* ─────────────────────────────────────────────
   GSAP hooks
───────────────────────────────────────────── */

function useGlitchText(ref) {
  useEffect(() => {
    if (!ref.current) return;
    const chars = "!@#$%^&*<>?/\\|~`[]{}ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
    const original = ref.current.textContent;
    let glitchInterval;

    const startGlitch = () => {
      let iterations = 0;
      clearInterval(glitchInterval);
      glitchInterval = setInterval(() => {
        ref.current.textContent = original
          .split("")
          .map((char, idx) => {
            if (idx < iterations) return original[idx];
            if (char === " ") return " ";
            return chars[Math.floor(Math.random() * chars.length)];
          })
          .join("");
        if (iterations >= original.length) {
          clearInterval(glitchInterval);
          ref.current.textContent = original;
        }
        iterations += 0.5;
      }, 28);
    };

    // Initial glitch on mount
    setTimeout(startGlitch, 400);

    // Repeat glitch every 4s
    const loop = setInterval(startGlitch, 4000);
    return () => {
      clearInterval(glitchInterval);
      clearInterval(loop);
    };
  }, [ref]);
}

function useTypewriter(ref, text, delay = 800) {
  useEffect(() => {
    if (!ref.current) return;
    ref.current.textContent = "";
    let i = 0;
    const timeout = setTimeout(() => {
      const interval = setInterval(() => {
        ref.current.textContent += text[i];
        i++;
        if (i >= text.length) clearInterval(interval);
      }, 32);
    }, delay);
    return () => clearTimeout(timeout);
  }, [ref, text, delay]);
}

/* ─────────────────────────────────────────────
   Framer Motion variants
───────────────────────────────────────────── */

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.12, delayChildren: 0.2 },
  },
};

const itemVariants = {
  hidden: { opacity: 0, y: 32, filter: "blur(8px)" },
  visible: {
    opacity: 1,
    y: 0,
    filter: "blur(0px)",
    transition: { duration: 0.65, ease: [0.22, 1, 0.36, 1] },
  },
};

const pulseRingVariants = {
  animate: {
    scale: [1, 2.2, 1],
    opacity: [0.5, 0, 0.5],
    transition: { duration: 3, repeat: Infinity, ease: "easeInOut" },
  },
};

/* ─────────────────────────────────────────────
   Main Error Component
───────────────────────────────────────────── */

const Error = ({ error, statusCode, isAuthError }) => {
  const codeRef = useRef(null);
  const messageRef = useRef(null);
  const subtitleRef = useRef(null);

  useGlitchText(codeRef);
  useTypewriter(
    messageRef,
    error || "Something went wrong",
    900
  );
  useTypewriter(
    subtitleRef,
    "The system encountered an unexpected fault. Our team has been notified.",
    1400
  );

  // GSAP scanline animation
  const scanRef = useRef(null);
  useEffect(() => {
    if (!scanRef.current) return;
    gsap.fromTo(
      scanRef.current,
      { top: "-10%" },
      {
        top: "110%",
        duration: 3.2,
        ease: "none",
        repeat: -1,
        delay: 0.5,
      }
    );
  }, []);

  // GSAP border flicker
  const cardRef = useRef(null);
  useEffect(() => {
    if (!cardRef.current) return;
    gsap.to(cardRef.current, {
      boxShadow: "0 0 40px rgba(245,197,24,0.6), 0 0 80px rgba(245,197,24,0.2)",
      duration: 0.08,
      repeat: 3,
      yoyo: true,
      delay: 0.6,
      onComplete: () => {
        gsap.to(cardRef.current, {
          boxShadow: "0 0 30px rgba(245,197,24,0.25), 0 0 60px rgba(245,197,24,0.1)",
          duration: 1.5,
          ease: "power2.out",
        });
      },
    });
  }, []);

  const code = statusCode || "500";

  return (
    <div style={styles.root}>
      {/* Three.js canvas */}
      <div style={styles.canvasWrapper}>
        <Canvas camera={{ position: [0, 0, 5], fov: 60 }}>
          <Scene />
        </Canvas>
      </div>

      {/* Radial gradient overlay */}
      <div style={styles.radialOverlay} />

      {/* GSAP scanline */}
      <div ref={scanRef} style={styles.scanline} />

      {/* Main content */}
      <motion.div
        style={styles.content}
        variants={containerVariants}
        initial="hidden"
        animate="visible"
      >
        {/* Status badge */}
        <motion.div variants={itemVariants} style={styles.badge}>
          <span style={styles.badgeDot} />
          SYSTEM ERROR DETECTED
        </motion.div>

        {/* Status code with pulse rings */}
        <motion.div variants={itemVariants} style={styles.codeWrapper}>
          <motion.div
            style={{ ...styles.pulseRing, width: 180, height: 180 }}
            variants={pulseRingVariants}
            animate="animate"
          />
          <motion.div
            style={{ ...styles.pulseRing, width: 140, height: 140 }}
            variants={pulseRingVariants}
            animate="animate"
            transition={{ delay: 0.8 }}
          />
          <div ref={codeRef} style={styles.statusCode}>
            {code}
          </div>
        </motion.div>

        {/* Glass card */}
        <motion.div
          ref={cardRef}
          variants={itemVariants}
          style={styles.card}
        >
          {/* Corner accents */}
          <div style={{ ...styles.corner, top: 0, left: 0, borderTopLeftRadius: 2 }} />
          <div style={{ ...styles.corner, top: 0, right: 0, transform: "rotate(90deg)", borderTopLeftRadius: 2 }} />
          <div style={{ ...styles.corner, bottom: 0, left: 0, transform: "rotate(-90deg)", borderTopLeftRadius: 2 }} />
          <div style={{ ...styles.corner, bottom: 0, right: 0, transform: "rotate(180deg)", borderTopLeftRadius: 2 }} />

          <div style={styles.cardInner}>
            {/* Error label */}
            <div style={styles.errorLabel}>
              <span style={styles.errorLabelLine} />
              ERROR
              <span style={styles.errorLabelLine} />
            </div>

            {/* Main message */}
            <h1 ref={messageRef} style={styles.headline}>
              {error || "Something went wrong"}
            </h1>

            {/* Subtitle */}
            <p ref={subtitleRef} style={styles.subtitle}>
              {" "}
            </p>

            {/* Divider */}
            <div style={styles.divider}>
              <div style={styles.dividerLine} />
              <div style={styles.dividerDot} />
              <div style={styles.dividerLine} />
            </div>

            {/* Code display */}
            <div style={styles.codeBlock}>
              <span style={styles.codePrompt}>{">"}</span>
              <span style={styles.codeText}>
                STATUS: <span style={styles.codeHighlight}>{code}</span>
                {"  "}|{"  "}
                {error ? "RUNTIME_EXCEPTION" : "INTERNAL_SERVER_ERROR"}
              </span>
            </div>

            {/* Actions */}
            <motion.div
              style={styles.actions}
              variants={itemVariants}
            >
              <motion.button
                style={styles.btnPrimary}
                whileHover={{ scale: 1.04, boxShadow: "0 0 24px rgba(245,197,24,0.5)" }}
                whileTap={{ scale: 0.97 }}
                onClick={() => window.location.href = "/"}
              >
                ← Go Back
              </motion.button>
              <motion.button
                style={styles.btnSecondary}
                whileHover={{ scale: 1.04, borderColor: "#f5c518", color: "#f5c518" }}
                whileTap={{ scale: 0.97 }}
                onClick={() => {
                  if (isAuthError) {
                    window.location.href = "/api/auth/google";
                  } else {
                    window.location.reload();
                  }
                }}
              >
                ↻ Retry
              </motion.button>
            </motion.div>
          </div>
        </motion.div>

        {/* Footer */}
        <motion.p variants={itemVariants} style={styles.footer}>
          CARTELO SYSTEM · FAULT ISOLATION MODULE
        </motion.p>
      </motion.div>
    </div>
  );
};

/* ─────────────────────────────────────────────
   Styles
───────────────────────────────────────────── */

const styles = {
  root: {
    position: "relative",
    width: "100vw",
    height: "100vh",
    background: "#080808",
    overflow: "hidden",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    fontFamily: "'Inter', 'Segoe UI', sans-serif",
  },
  canvasWrapper: {
    position: "absolute",
    inset: 0,
    zIndex: 0,
  },
  radialOverlay: {
    position: "absolute",
    inset: 0,
    background:
      "radial-gradient(ellipse 60% 60% at 50% 50%, rgba(8,8,8,0.15) 0%, rgba(8,8,8,0.85) 70%, #080808 100%)",
    zIndex: 1,
  },
  scanline: {
    position: "absolute",
    left: 0,
    right: 0,
    height: "2px",
    background:
      "linear-gradient(90deg, transparent 0%, rgba(245,197,24,0.3) 40%, rgba(245,197,24,0.6) 50%, rgba(245,197,24,0.3) 60%, transparent 100%)",
    zIndex: 2,
    pointerEvents: "none",
  },
  content: {
    position: "relative",
    zIndex: 3,
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    gap: "20px",
    padding: "0 20px",
    width: "100%",
    maxWidth: "560px",
  },
  badge: {
    display: "flex",
    alignItems: "center",
    gap: "8px",
    background: "rgba(255,68,68,0.12)",
    border: "1px solid rgba(255,68,68,0.35)",
    borderRadius: "999px",
    padding: "6px 16px",
    fontSize: "11px",
    fontWeight: 700,
    letterSpacing: "2px",
    color: "#ff6b6b",
    textTransform: "uppercase",
  },
  badgeDot: {
    width: "7px",
    height: "7px",
    borderRadius: "50%",
    background: "#ff4444",
    boxShadow: "0 0 8px #ff4444",
    animation: "pulse-dot 1.2s ease-in-out infinite",
  },
  codeWrapper: {
    position: "relative",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    width: "180px",
    height: "180px",
  },
  pulseRing: {
    position: "absolute",
    borderRadius: "50%",
    border: "1.5px solid rgba(245,197,24,0.4)",
  },
  statusCode: {
    fontSize: "88px",
    fontWeight: 900,
    color: "#f5c518",
    letterSpacing: "-4px",
    lineHeight: 1,
    fontVariantNumeric: "tabular-nums",
    textShadow: "0 0 40px rgba(245,197,24,0.6), 0 0 80px rgba(245,197,24,0.2)",
    fontFamily: "'Inter', monospace",
    zIndex: 1,
  },
  card: {
    width: "100%",
    background: "rgba(255,255,255,0.04)",
    backdropFilter: "blur(20px)",
    WebkitBackdropFilter: "blur(20px)",
    border: "1px solid rgba(255,255,255,0.1)",
    borderRadius: "16px",
    boxShadow: "0 0 30px rgba(245,197,24,0.25), 0 0 60px rgba(245,197,24,0.1)",
    position: "relative",
    overflow: "hidden",
  },
  corner: {
    position: "absolute",
    width: "16px",
    height: "16px",
    border: "2px solid #f5c518",
    borderRight: "none",
    borderBottom: "none",
    margin: "8px",
  },
  cardInner: {
    padding: "32px 36px",
    display: "flex",
    flexDirection: "column",
    gap: "16px",
  },
  errorLabel: {
    display: "flex",
    alignItems: "center",
    gap: "10px",
    fontSize: "10px",
    fontWeight: 700,
    letterSpacing: "3px",
    color: "rgba(245,197,24,0.6)",
    textTransform: "uppercase",
  },
  errorLabelLine: {
    flex: 1,
    height: "1px",
    background: "rgba(245,197,24,0.2)",
  },
  headline: {
    margin: 0,
    fontSize: "22px",
    fontWeight: 700,
    color: "#ffffff",
    lineHeight: 1.35,
    minHeight: "30px",
    letterSpacing: "-0.3px",
  },
  subtitle: {
    margin: 0,
    fontSize: "13px",
    color: "rgba(255,255,255,0.45)",
    lineHeight: 1.65,
    minHeight: "42px",
  },
  divider: {
    display: "flex",
    alignItems: "center",
    gap: "10px",
  },
  dividerLine: {
    flex: 1,
    height: "1px",
    background: "rgba(255,255,255,0.08)",
  },
  dividerDot: {
    width: "4px",
    height: "4px",
    borderRadius: "50%",
    background: "rgba(245,197,24,0.4)",
  },
  codeBlock: {
    background: "rgba(0,0,0,0.5)",
    borderRadius: "8px",
    padding: "12px 16px",
    display: "flex",
    alignItems: "center",
    gap: "10px",
    border: "1px solid rgba(255,255,255,0.06)",
  },
  codePrompt: {
    color: "#f5c518",
    fontFamily: "'Fira Code', 'Courier New', monospace",
    fontWeight: 700,
    fontSize: "14px",
  },
  codeText: {
    fontFamily: "'Fira Code', 'Courier New', monospace",
    fontSize: "11px",
    color: "rgba(255,255,255,0.5)",
    letterSpacing: "0.5px",
  },
  codeHighlight: {
    color: "#f5c518",
    fontWeight: 700,
  },
  actions: {
    display: "flex",
    gap: "12px",
    paddingTop: "4px",
  },
  btnPrimary: {
    flex: 1,
    padding: "12px 0",
    background: "#f5c518",
    color: "#080808",
    border: "none",
    borderRadius: "10px",
    fontWeight: 800,
    fontSize: "13px",
    cursor: "pointer",
    letterSpacing: "0.3px",
    transition: "all 0.2s ease",
  },
  btnSecondary: {
    flex: 1,
    padding: "12px 0",
    background: "transparent",
    color: "rgba(255,255,255,0.6)",
    border: "1px solid rgba(255,255,255,0.15)",
    borderRadius: "10px",
    fontWeight: 700,
    fontSize: "13px",
    cursor: "pointer",
    letterSpacing: "0.3px",
    transition: "all 0.2s ease",
  },
  footer: {
    fontSize: "9px",
    letterSpacing: "3px",
    color: "rgba(255,255,255,0.2)",
    textTransform: "uppercase",
    margin: 0,
  },
};

export default Error;