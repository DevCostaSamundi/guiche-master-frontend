// src/hooks/useAnalytics.ts
 const API_URL = import.meta.env.VITE_API_URL ||
    'https://guiche-master-backend.vercel.app';
// Função para obter/criar sessionId (fora de qualquer hook)
function getOrCreateSessionId(): string {
  const key = 'analytics_session';
  let sessionId = sessionStorage.getItem(key);
  
  if (!sessionId) {
    sessionId = `session_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
    sessionStorage.setItem(key, sessionId);
  }
  
  return sessionId;
}

// Hook simplificado SEM useRef, useCallback, etc.
export function useAnalytics() {
  const sessionId = getOrCreateSessionId();

  async function trackPageView(page: string, eventId?: string) {
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
  }

  async function trackClick(eventId: string, action: string, data?: any) {
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
  }

  async function trackCheckout(eventId: string, items: any[], total: number) {
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
  }

  async function trackConversion(eventId: string, orderId: string, total: number) {
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
  }

  return {
    trackPageView,
    trackClick,
    trackCheckout,
    trackConversion
  };
}