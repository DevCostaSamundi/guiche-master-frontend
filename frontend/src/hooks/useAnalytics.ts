import { useEffect, useRef } from 'react';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3001';

// Gerar ID de sessão único
const getSessionId = (): string => {
    let sessionId = sessionStorage.getItem('analytics_session');
    if (!sessionId) {
        sessionId = `session_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
        sessionStorage.setItem('analytics_session', sessionId);
    }
    return sessionId;
};

export const useAnalytics = () => {
    const sessionId = useRef(getSessionId());

    const trackPageView = async (page: string, eventId?: string) => {
        try {
            await fetch(`${API_URL}/api/analytics/pageview`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    page,
                    eventId,
                    sessionId: sessionId.current,
                    referrer: document.referrer
                })
            });
        } catch (error) {
            console.error('Analytics error:', error);
        }
    };

    const trackClick = async (eventId: string, action: string, data?: any) => {
        try {
            await fetch(`${API_URL}/api/analytics/click`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    eventId,
                    action,
                    sessionId: sessionId.current,
                    data
                })
            });
        } catch (error) {
            console.error('Analytics error:', error);
        }
    };

    const trackCheckout = async (eventId: string, items: any[], total: number) => {
        try {
            await fetch(`${API_URL}/api/analytics/checkout`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    eventId,
                    sessionId: sessionId.current,
                    items,
                    total
                })
            });
        } catch (error) {
            console.error('Analytics error:', error);
        }
    };

    const trackConversion = async (eventId: string, orderId: string, total: number) => {
        try {
            await fetch(`${API_URL}/api/analytics/conversion`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    eventId,
                    orderId,
                    sessionId: sessionId.current,
                    total
                })
            });
        } catch (error) {
            console.error('Analytics error:', error);
        }
    };

    return {
        trackPageView,
        trackClick,
        trackCheckout,
        trackConversion
    };
};