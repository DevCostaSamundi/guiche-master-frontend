import React, { useState, useEffect } from 'react';
import { 
  BarChart3, TrendingUp, Users, ShoppingCart, 
  DollarSign, Eye, MousePointerClick, CheckCircle,
  RefreshCw, Lock
} from 'lucide-react';

 const API_URL = import.meta.env.VITE_API_URL ||
    'https://guiche-master-backend.vercel.app';
interface DashboardData {
  summary: {
    totalPageViews: number;
    uniqueSessions: number;
    totalOrders: number;
    totalCheckouts: number;
    totalConversions: number;
    conversionRate: string;
    totalRevenue: number;
  };
  events: Array<{
    eventId: string;
    views: number;
    uniqueViews: number;
    clicks: any;
    checkouts: number;
    conversions: number;
    revenue: number;
    conversionRate: string;
  }>;
  pages: Record<string, number>;
  recentConversions: any[];
  trafficByHour: Array<{ hour: number; views: number }>;
}

const AnalyticsDashboard = () => {
  const [data, setData] = useState<DashboardData | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [key, setKey] = useState('');
  const [authenticated, setAuthenticated] = useState(false);

  const fetchData = async (accessKey: string) => {
    setLoading(true);
    setError(null);

    try {
      const response = await fetch(`${API_URL}/api/analytics/dashboard?key=${accessKey}`);
      const result = await response.json();

      if (!response.ok || !result.success) {
        throw new Error(result.error || 'Erro ao carregar dados');
      }

      setData(result);
      setAuthenticated(true);
      localStorage.setItem('analytics_key', accessKey);
    } catch (err: any) {
      setError(err.message);
      setAuthenticated(false);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const savedKey = localStorage.getItem('analytics_key');
    if (savedKey) {
      setKey(savedKey);
      fetchData(savedKey);
    }
  }, []);

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    fetchData(key);
  };

  if (!authenticated) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-zinc-900 via-zinc-800 to-black flex items-center justify-center p-4">
        <div className="bg-white rounded-2xl shadow-2xl p-8 w-full max-w-md">
          <div className="w-16 h-16 bg-green-500 rounded-full flex items-center justify-center mx-auto mb-6">
            <Lock className="w-8 h-8 text-white" />
          </div>
          
          <h1 className="text-2xl font-bold text-center mb-2">Analytics Dashboard</h1>
          <p className="text-zinc-500 text-center mb-8 text-sm">
            Insira a chave de acesso para visualizar as estatísticas
          </p>

          <form onSubmit={handleLogin} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-zinc-700 mb-2">
                Chave de Acesso
              </label>
              <input
                type="password"
                value={key}
                onChange={(e) => setKey(e.target.value)}
                placeholder="Digite a chave"
                className="w-full px-4 py-3 border-2 border-zinc-200 rounded-lg focus:border-green-500 outline-none transition-colors"
                required
              />
            </div>

            {error && (
              <div className="bg-red-50 border-2 border-red-200 rounded-lg p-3 text-sm text-red-700">
                {error}
              </div>
            )}

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-green-500 text-white py-3 rounded-lg font-bold hover:bg-green-600 transition-colors disabled:opacity-50"
            >
              {loading ? 'Verificando...' : 'Acessar Dashboard'}
            </button>
          </form>

          <p className="text-xs text-zinc-400 text-center mt-6">
            Chave padrão: <code className="bg-zinc-100 px-2 py-1 rounded">guiche2024@analytics</code>
          </p>
        </div>
      </div>
    );
  }

  if (!data) {
    return (
      <div className="min-h-screen bg-zinc-50 flex items-center justify-center">
        <div className="text-center">
          <RefreshCw className="w-12 h-12 text-green-500 animate-spin mx-auto mb-4" />
          <p className="text-zinc-600">Carregando dados...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-zinc-50 p-4 md:p-8">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold text-zinc-900">Analytics Dashboard</h1>
            <p className="text-zinc-500 mt-1">Visão geral do desempenho</p>
          </div>
          <button
            onClick={() => fetchData(key)}
            className="flex items-center space-x-2 bg-white px-4 py-2 rounded-lg border-2 border-zinc-200 hover:border-green-500 transition-colors"
          >
            <RefreshCw className="w-4 h-4" />
            <span className="font-medium text-sm">Atualizar</span>
          </button>
        </div>

        {/* Summary Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <div className="bg-white p-6 rounded-xl shadow-sm border border-zinc-100">
            <div className="flex items-center justify-between mb-2">
              <span className="text-zinc-500 text-sm font-medium">Visualizações</span>
              <Eye className="w-5 h-5 text-blue-500" />
            </div>
            <p className="text-3xl font-bold text-zinc-900">{data.summary.totalPageViews}</p>
            <p className="text-xs text-zinc-400 mt-1">{data.summary.uniqueSessions} sessões únicas</p>
          </div>

          <div className="bg-white p-6 rounded-xl shadow-sm border border-zinc-100">
            <div className="flex items-center justify-between mb-2">
              <span className="text-zinc-500 text-sm font-medium">Checkouts</span>
              <ShoppingCart className="w-5 h-5 text-orange-500" />
            </div>
            <p className="text-3xl font-bold text-zinc-900">{data.summary.totalCheckouts}</p>
            <p className="text-xs text-zinc-400 mt-1">{data.summary.totalOrders} pedidos criados</p>
          </div>

          <div className="bg-white p-6 rounded-xl shadow-sm border border-zinc-100">
            <div className="flex items-center justify-between mb-2">
              <span className="text-zinc-500 text-sm font-medium">Conversões</span>
              <CheckCircle className="w-5 h-5 text-green-500" />
            </div>
            <p className="text-3xl font-bold text-zinc-900">{data.summary.totalConversions}</p>
            <p className="text-xs text-zinc-400 mt-1">Taxa: {data.summary.conversionRate}</p>
          </div>

          <div className="bg-white p-6 rounded-xl shadow-sm border border-zinc-100">
            <div className="flex items-center justify-between mb-2">
              <span className="text-zinc-500 text-sm font-medium">Receita</span>
              <DollarSign className="w-5 h-5 text-emerald-500" />
            </div>
            <p className="text-3xl font-bold text-zinc-900">
              R$ {data.summary.totalRevenue.toFixed(2)}
            </p>
            <p className="text-xs text-zinc-400 mt-1">Total confirmado</p>
          </div>
        </div>

        {/* Events Performance */}
        <div className="bg-white rounded-xl shadow-sm border border-zinc-100 p-6 mb-8">
          <h2 className="text-xl font-bold mb-4 flex items-center">
            <BarChart3 className="w-5 h-5 mr-2 text-green-500" />
            Desempenho por Evento
          </h2>
          
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b">
                  <th className="text-left py-3 px-4 text-sm font-semibold text-zinc-600">Evento ID</th>
                  <th className="text-right py-3 px-4 text-sm font-semibold text-zinc-600">Views</th>
                  <th className="text-right py-3 px-4 text-sm font-semibold text-zinc-600">Únicos</th>
                  <th className="text-right py-3 px-4 text-sm font-semibold text-zinc-600">Checkouts</th>
                  <th className="text-right py-3 px-4 text-sm font-semibold text-zinc-600">Conversões</th>
                  <th className="text-right py-3 px-4 text-sm font-semibold text-zinc-600">Taxa</th>
                  <th className="text-right py-3 px-4 text-sm font-semibold text-zinc-600">Receita</th>
                </tr>
              </thead>
              <tbody>
                {data.events.map((event, idx) => (
                  <tr key={idx} className="border-b hover:bg-zinc-50">
                    <td className="py-3 px-4 font-mono text-sm">{event.eventId}</td>
                    <td className="py-3 px-4 text-right">{event.views}</td>
                    <td className="py-3 px-4 text-right">{event.uniqueViews}</td>
                    <td className="py-3 px-4 text-right">{event.checkouts}</td>
                    <td className="py-3 px-4 text-right font-bold">{event.conversions}</td>
                    <td className="py-3 px-4 text-right">
                      <span className="bg-green-100 text-green-700 px-2 py-1 rounded text-sm font-semibold">
                        {event.conversionRate}%
                      </span>
                    </td>
                    <td className="py-3 px-4 text-right font-bold">R$ {event.revenue.toFixed(2)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Traffic by Hour */}
        <div className="bg-white rounded-xl shadow-sm border border-zinc-100 p-6">
          <h2 className="text-xl font-bold mb-4 flex items-center">
            <TrendingUp className="w-5 h-5 mr-2 text-blue-500" />
            Tráfego por Hora (Últimas 24h)
          </h2>
          
          <div className="flex items-end space-x-1 h-64">
            {data.trafficByHour.map((item, idx) => (
              <div key={idx} className="flex-1 flex flex-col items-center">
                <div 
                  className="w-full bg-green-500 rounded-t hover:bg-green-600 transition-colors"
                  style={{ 
                    height: `${(item.views / Math.max(...data.trafficByHour.map(i => i.views)) * 100) || 5}%`,
                    minHeight: '4px'
                  }}
                  title={`${item.hour}h: ${item.views} views`}
                />
                <span className="text-[10px] text-zinc-400 mt-1">{item.hour}h</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default AnalyticsDashboard;