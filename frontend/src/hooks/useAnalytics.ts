import { useCallback } from 'react';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3001';

// Gerar ID de sessão único (fora do hook)
const getSessionId = (): string => {
  let sessionId = sessionStorage.getItem('analytics_session');
  if (!sessionId) {
    sessionId = `session_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
    sessionStorage.setItem('analytics_session', sessionId);
  }
  return sessionId;
};

export const useAnalytics = () => {
  // Chamar getSessionId() diretamente, sem useRef
  const sessionId = getSessionId();

  const trackPageView = useCallback(async (page: string, eventId?: string) => {
    try {
      await fetch(`${API_URL}/api/analytics/pageview`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          page,
          eventId,
          sessionId,
          referrer: document.referrer
        })
      });
    } catch (error) {
      console.error('Analytics pageview error:', error);
    }
  }, [sessionId]);

  const trackClick = useCallback(async (eventId: string, action: string, data?: any) => {
    try {
      await fetch(`${API_URL}/api/analytics/click`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          eventId,
          action,
          sessionId,
          data
        })
      });
    } catch (error) {
      console.error('Analytics click error:', error);
    }
  }, [sessionId]);

  const trackCheckout = useCallback(async (eventId: string, items: any[], total: number) => {
    try {
      await fetch(`${API_URL}/api/analytics/checkout`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          eventId,
          sessionId,
          items,
          total
        })
      });
    } catch (error) {
      console.error('Analytics checkout error:', error);
    }
  }, [sessionId]);

  const trackConversion = useCallback(async (eventId: string, orderId: string, total: number) => {
    try {
      await fetch(`${API_URL}/api/analytics/conversion`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          eventId,
          orderId,
          sessionId,
          total
        })
      });
    } catch (error) {
      console.error('Analytics conversion error:', error);
    }
  }, [sessionId]);

  return {
    trackPageView,
    trackClick,
    trackCheckout,
    trackConversion
  };
};