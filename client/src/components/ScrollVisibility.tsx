import React, { useEffect, useRef } from 'react';

const ScrollVisibility: React.FC = () => {
  const timeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const reserveTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    const root = document.documentElement;

    const updateReserve = () => {
   
      const needsScrollbar = document.documentElement.scrollHeight > window.innerHeight;
      if (needsScrollbar) {
        root.classList.add('reserve-scrollbar');
      } else {
        root.classList.remove('reserve-scrollbar');
      }
    };

    const onScroll = () => {
  
      root.classList.add('is-scrolling');

      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
      timeoutRef.current = setTimeout(() => {
        root.classList.remove('is-scrolling');
        timeoutRef.current = null;
      }, 3000);
    };

    updateReserve();

    const onResize = () => {
      if (reserveTimeoutRef.current) clearTimeout(reserveTimeoutRef.current);
      reserveTimeoutRef.current = setTimeout(() => {
        updateReserve();
        reserveTimeoutRef.current = null;
      }, 150);
    };

    window.addEventListener('scroll', onScroll, { passive: true });
    window.addEventListener('resize', onResize, { passive: true });

    const initialCheckTimeout = setTimeout(updateReserve, 300);

    return () => {
      window.removeEventListener('scroll', onScroll);
      window.removeEventListener('resize', onResize);
      if (timeoutRef.current) clearTimeout(timeoutRef.current);
      if (reserveTimeoutRef.current) clearTimeout(reserveTimeoutRef.current);
      clearTimeout(initialCheckTimeout);
    };
  }, []);

  return null;
};

export default ScrollVisibility;