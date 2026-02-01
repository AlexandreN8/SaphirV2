import { useEffect, useRef } from 'react';
import { useLocation } from 'react-router-dom';
import { supabase } from '@/lib/supabase';

export const useTrafficTracker = () => {
  const location = useLocation();
  const lastPathRef = useRef<string | null>(null); 

  useEffect(() => {
    const logVisit = async () => {
      // 1. Anti-Doublon React 
      if (lastPathRef.current === location.pathname) return;
      lastPathRef.current = location.pathname;

      // 2. Détection Robots & Localhost
      const userAgent = navigator.userAgent || navigator.vendor;
      const isBot = /bot|googlebot|crawler|spider|robot|crawling/i.test(userAgent);
      const isLocal = window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1';

      if (isBot || isLocal) return;

      // 3. Gestion Session ID (Persistant)
      let sessionId = localStorage.getItem('saphir_visitor_id');
      if (!sessionId) {
        sessionId = crypto.randomUUID();
        localStorage.setItem('saphir_visitor_id', sessionId);
      }

      const isMobile = /iPhone|iPad|iPod|Android/i.test(userAgent);
      const referrer = document.referrer || 'Direct';

      // 4. Envoi Log
      await supabase.from('traffic_logs').insert({
        path: location.pathname,
        device_type: isMobile ? 'Mobile' : 'Desktop',
        source: referrer.includes(window.location.hostname) ? 'Interne' : referrer,
        session_id: sessionId
      });
    };

    logVisit();
  }, [location.pathname]);
};