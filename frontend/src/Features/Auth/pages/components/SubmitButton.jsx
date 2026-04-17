import { useRef } from "react";
import { motion } from "framer-motion";
import { gsap } from "gsap";

export default function SubmitButton({ label, loading = false }) {
  const btnRef = useRef(null);

  const handleClick = () => {
    gsap.fromTo(
      btnRef.current,
      { scale: 0.97 },
      { scale: 1, duration: 0.4, ease: "elastic.out(1, 0.5)" }
    );
  };

  return (
    <motion.button
      ref={btnRef}
      type="submit"
      id="auth-submit-btn"
      className="submit-btn relative w-full overflow-hidden bg-[#f5c518] text-black font-semibold text-sm tracking-wide uppercase py-4 px-8 hover:bg-[#e6b800] active:scale-[0.98] transition-colors duration-150 disabled:opacity-60"
      style={{ fontFamily: "Inter, sans-serif", borderRadius: "0.25rem" }}
      onClick={handleClick}
      whileTap={{ scale: 0.97 }}
      disabled={loading}
    >
      <span className="relative z-10">
        {loading ? "Please wait…" : label}
      </span>
      <div className="btn-shine" />
    </motion.button>
  );
}
