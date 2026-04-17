import { useRef } from "react";
import { motion } from "framer-motion";
import { gsap } from "gsap";

export default function InputField({
  id,
  label,
  type,
  value,
  onChange,
  endAction,
}) {
  const inputRef = useRef(null);

  const handleFocus = () => {
    gsap.to(`#lbl-${id}`, {
      y: -22,
      scale: 0.75,
      color: "#f5c518",
      duration: 0.22,
      ease: "power2.out",
    });
  };

  const handleBlur = () => {
    if (!value) {
      gsap.to(`#lbl-${id}`, {
        y: 0,
        scale: 1,
        color: "#666",
        duration: 0.22,
        ease: "power2.out",
      });
    } else {
      gsap.to(`#lbl-${id}`, { color: "#666", duration: 0.2 });
    }
  };

  // Keep label elevated if pre-filled
  const labelStyle =
    value
      ? { transform: "translateY(-50%) translateY(-22px) scale(0.75)", color: "#666", transformOrigin: "left center" }
      : {};

  return (
    <motion.div
      className="relative w-full"
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
    >
      <label
        id={`lbl-${id}`}
        htmlFor={id}
        className="float-label"
        style={labelStyle}
      >
        {label}
      </label>

      <input
        ref={inputRef}
        id={id}
        type={type}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder=" "
        className="auth-input"
        onFocus={handleFocus}
        onBlur={handleBlur}
        autoComplete={type === "password" ? "current-password" : "on"}
      />

      {/* Animated focus underline */}
      <div className="field-line" />

      {endAction && (
        <div className="absolute right-0 bottom-3 flex items-center">
          {endAction}
        </div>
      )}
    </motion.div>
  );
}
