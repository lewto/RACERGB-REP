import React, { useEffect, useRef } from 'react';

const GlowCursor = () => {
  const cursorRef = useRef<HTMLDivElement>(null);
  const glowRef = useRef<HTMLDivElement>(null);
  const lastPos = useRef({ x: 0, y: 0 });

  useEffect(() => {
    let rafId: number;
    
    const updateCursor = (e: MouseEvent) => {
      if (!cursorRef.current || !glowRef.current) return;

      // Cancel any pending animation frame
      if (rafId) {
        cancelAnimationFrame(rafId);
      }

      // Use RAF for smooth animation
      rafId = requestAnimationFrame(() => {
        const target = e.target as HTMLElement;
        const isClickable = 
          window.getComputedStyle(target).cursor === 'pointer' ||
          target.tagName.toLowerCase() === 'button' ||
          target.tagName.toLowerCase() === 'a';

        // Update cursor position immediately
        if (cursorRef.current) {
          cursorRef.current.style.transform = `translate(${e.clientX}px, ${e.clientY}px)`;
          cursorRef.current.classList.toggle('scale-150', isClickable);
        }

        // Update glow position with lag
        if (glowRef.current) {
          // Calculate distance moved
          const dx = e.clientX - lastPos.current.x;
          const dy = e.clientY - lastPos.current.y;
          
          // Calculate lag position (15% behind cursor)
          const lagX = e.clientX - (dx * 0.15);
          const lagY = e.clientY - (dy * 0.15);
          
          glowRef.current.style.transform = `translate(${lagX}px, ${lagY}px)`;
          
          // Update last position
          lastPos.current = { x: e.clientX, y: e.clientY };
        }
      });
    };

    // Initialize last position
    lastPos.current = { x: window.innerWidth / 2, y: window.innerHeight / 2 };

    window.addEventListener('mousemove', updateCursor, { passive: true });
    
    return () => {
      window.removeEventListener('mousemove', updateCursor);
      if (rafId) {
        cancelAnimationFrame(rafId);
      }
    };
  }, []);

  return (
    <>
      {/* Glow trail */}
      <div
        ref={glowRef}
        className="fixed pointer-events-none z-40 w-48 h-48 -translate-x-1/2 -translate-y-1/2 
                   rounded-full opacity-30 will-change-transform"
        style={{
          transform: 'translate(0px, 0px)',
          background: 'radial-gradient(circle, rgba(59,130,246,0.3) 0%, rgba(59,130,246,0) 70%)',
          transition: 'transform 0.15s cubic-bezier(0.23, 1, 0.32, 1)'
        }}
      />

      {/* Main cursor */}
      <div
        ref={cursorRef}
        className="fixed pointer-events-none z-50 left-0 top-0 will-change-transform mix-blend-difference"
        style={{ transform: 'translate(0px, 0px)' }}
      >
        <div className="relative">
          {/* Inner dot */}
          <div className="absolute w-1.5 h-1.5 -translate-x-1/2 -translate-y-1/2 bg-white rounded-full" />
          
          {/* Outer ring */}
          <div className="absolute w-5 h-5 -translate-x-1/2 -translate-y-1/2 border border-white rounded-full 
                         transition-transform duration-200 ease-out" />
        </div>
      </div>
    </>
  );
};

export default GlowCursor;