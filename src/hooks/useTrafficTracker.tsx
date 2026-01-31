import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { supabase } from '@/lib/supabase';

export const useTrafficTracker = () => {
  const location = useLocation();

  useEffect(() => {
    const logVisit = async () => {
      // 1. DÉTECTION DES ROBOTS 
      const userAgent = navigator.userAgent || navigator.vendor;
      const isBot = /bot|googlebot|crawler|spider|robot|crawling/i.test(userAgent);
      
      // 2. DÉTECTION LOCALHOST
      const isLocal = window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1';

      // Si c'est un robot ou si on est en dev, on ne fait rien 
      if (isBot || isLocal) return;

      const isMobile = /iPhone|iPad|iPod|Android/i.test(userAgent);
      const referrer = document.referrer || 'Direct';
      
      let sessionId = sessionStorage.getItem('saphir_session');
      if (!sessionId) {
        sessionId = Math.random().toString(36).substring(2) + Date.now().toString(36);
        sessionStorage.setItem('saphir_session', sessionId);
      }

      await supabase.from('traffic_logs').insert({
        path: location.pathname,
        device_type: isMobile ? 'Mobile' : 'Desktop',
        source: referrer.includes('saphir') ? 'Interne' : referrer,
        session_id: sessionId
      });
    };

    logVisit();
  }, [location.pathname]);
};