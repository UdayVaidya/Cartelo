import React from 'react';
import { motion } from 'framer-motion';

export default function ErrorPage({ error, onRetry }) {
  // Try to extract a clean string from Redux errors (which are sometimes objects or Axios errors)
  const errorMessage = typeof error === 'string' ? error : 
    (error?.message || "An unexpected error occurred during authentication.");

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95, y: 10 }}
      animate={{ opacity: 1, scale: 1, y: 0 }}
      exit={{ opacity: 0, scale: 0.95, y: -10 }}
      transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
      className="flex flex-col items-center justify-center w-full py-10 px-6 text-center"
    >
      {/* Animated Icon Container */}
      <motion.div 
        initial={{ rotate: -20, scale: 0.5, opacity: 0 }}
        animate={{ rotate: 0, scale: 1, opacity: 1 }}
        transition={{ type: "spring", stiffness: 300, damping: 20, delay: 0.1 }}
        className="w-16 h-16 rounded-full bg-red-900/20 flex items-center justify-center mb-6"
      >
        <svg 
          className="w-8 h-8 text-red-500" 
          fill="none" 
          stroke="currentColor" 
          viewBox="0 0 24 24" 
          xmlns="http://www.w3.org/2000/svg"
        >
          {/* Warning Exclamation Icon */}
          <path 
            strokeLinecap="round" 
            strokeLinejoin="round" 
            strokeWidth={2} 
            d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" 
          />
        </svg>
      </motion.div>

      {/* Typography matches Cartelo branding */}
      <h2 
        className="text-2xl font-bold text-[#f0f0f0] mb-3" 
        style={{ fontFamily: "Manrope" }}
      >
        Authentication failed
      </h2>
      
      <p 
        className="text-[0.9375rem] text-[#666] mb-8 max-w-[280px] leading-relaxed" 
        style={{ fontFamily: "Inter" }}
      >
        {errorMessage}
      </p>

      {/* Modern Try Again Button */}
      <motion.button
        type="button"
        whileHover={{ scale: 1.02 }}
        whileTap={{ scale: 0.98 }}
        onClick={() => {
          // If a custom onRetry handler is passed, call it.
          if (onRetry) onRetry();
          // Otherwise, clear the page by reloading so they can try again.
          else window.location.reload();
        }}
        className="w-full bg-[#f5c518] text-black font-medium py-3.5 px-4 rounded-md transition-colors hover:bg-[#e6b800]"
        style={{ fontFamily: "Inter" }}
      >
        Try Again
      </motion.button>
    </motion.div>
  );
}