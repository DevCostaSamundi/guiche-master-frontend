import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { MapPin, Calendar, Clock, Share2, Facebook, Instagram, MessageCircle, Info, Map, Ticket, User, Minus, Plus, Smartphone } from 'lucide-react';
import { mockEvents } from '../services/mockData';
interface TicketTier {
  id: string;
  name: string;
  price: number;
  fee: number;
  description: string;
  batch: string;
}

interface TicketCategory {
  name: string;
  color: string;
  tiers: TicketTier[];
}

interface Event {
  id: string;
  title: string;
  bannerUrl: string;
  cardImageUrl: string;
  venue: string;
  city: string;
  state: string;
  date: string;
  endDate?: string;
  time: string;
  description: string;
  categories: TicketCategory[];
  info: string;
  mapUrl: string;
}

interface CartItem {
  eventId: string;
  tierId: string;
  quantity: number;
  price: number;
  fee: number;
  name: string;
  categoryName: string;
}

const EventDetails = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [event, setEvent] = useState<Event | null>(null);
  const [activeTab, setActiveTab] = useState<'ingressos' | 'info' | 'local' | 'pdv'>('ingressos');
  const [quantities, setQuantities] = useState<Record<string, number>>({});

  useEffect(() => {
    const found = mockEvents.find(e => e.id === id);
    if (found) {
      setEvent(found);
    }
  }, [id]);

  if (!event) return <div className="p-20 text-center">Carregando evento...</div>;

  const updateQuantity = (tierId: string, delta: number) => {
    setQuantities(prev => ({
      ...prev,
      [tierId]: Math.max(0, (prev[tierId] || 0) + delta)
    }));
  };

  const totalTickets = Object.values(quantities).reduce((acc, q) => acc + q, 0);
  
  const totalPrice = Object.entries(quantities).reduce((acc, [tierId, qty]) => {
    const category = event.categories.find(c => c.tiers.some(t => t.id === tierId));
    const tier = category?.tiers.find(t => t.id === tierId);
    return acc + (tier ? (tier.price + tier.fee) * qty : 0);
  }, 0);

  const handleCheckout = () => {
    const cart: CartItem[] = [];
    Object.entries(quantities).forEach(([tierId, qty]) => {
      if (qty > 0) {
        const category = event.categories.find(c => c.tiers.some(t => t.id === tierId));
        const tier = category?.tiers.find(t => t.id === tierId);
        if (tier && category) {
          cart.push({
            eventId: event.id,
            tierId,
            quantity: qty,
            price: tier.price,
            fee: tier.fee,
            name: tier.name,
            categoryName: category.name
          });
        }
      }
    });
    
    if (cart.length > 0) {
      navigate('/checkout', { state: { cart, eventTitle: event.title } });
    }
  };

  return (
    <div className="bg-white min-h-screen">
      {/* Hero Banner */}
      <div className="relative h-[250px] md:h-[400px] w-full bg-zinc-900 overflow-hidden">
        <div 
          className="absolute inset-0 bg-cover bg-center opacity-40 blur-sm scale-110"
          style={{ backgroundImage: `url(${event.bannerUrl})` }}
        />
        <div className="container mx-auto px-4 h-full flex flex-col items-center justify-center relative z-10 text-center">
            <img 
              src={event.bannerUrl} 
              alt={event.title} 
              className="max-h-[80%] max-w-full object-contain shadow-2xl rounded-lg"
            />
        </div>
      </div>

      {/* Basic Info Bar */}
      <div className="bg-zinc-50 border-b">
        <div className="container mx-auto px-4 py-6 md:py-10 flex flex-col md:flex-row gap-8 items-start">
          {/* Small Card Image */}
          <div className="hidden md:block w-64 -mt-24 relative z-20">
            <div className="bg-white p-2 rounded-lg shadow-xl">
               <img src={event.cardImageUrl} alt={event.title} className="w-full rounded" />
               <div className="mt-4 flex justify-between px-2 pb-2">
                 <span className="text-[10px] text-zinc-400 font-bold uppercase">Compartilhar</span>
                 <div className="flex space-x-2">
                   <MessageCircle className="w-4 h-4 text-zinc-400 cursor-pointer hover:text-green-500" />
                   <Facebook className="w-4 h-4 text-zinc-400 cursor-pointer hover:text-blue-600" />
                   <Instagram className="w-4 h-4 text-zinc-400 cursor-pointer hover:text-pink-600" />
                 </div>
               </div>
            </div>
          </div>

          <div className="flex-1 space-y-4">
             <h1 className="text-3xl font-bold text-zinc-800">{event.title}</h1>
             <div className="flex flex-wrap gap-4 text-zinc-600">
                <div className="flex items-center space-x-1">
                  <Calendar className="w-4 h-4 text-zinc-400" />
                  <span className="text-sm">de {event.date} {event.endDate ? `até ${event.endDate}` : ''}</span>
                </div>
                <div className="flex items-center space-x-1">
                  <Clock className="w-4 h-4 text-zinc-400" />
                  <span className="text-sm">{event.time}</span>
                </div>
                <div className="flex items-center space-x-1">
                  <MapPin className="w-4 h-4 text-zinc-400" />
                  <span className="text-sm">{event.venue} - {event.city}/{event.state}</span>
                </div>
             </div>
             
             {/* Social for mobile */}
             <div className="md:hidden flex items-center space-x-4">
                <button className="flex items-center space-x-2 border rounded-full px-4 py-1.5 text-xs font-medium bg-white text-zinc-600">
                  <Share2 className="w-3.5 h-3.5" />
                  <span>COMPARTILHAR</span>
                </button>
             </div>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="sticky top-16 bg-white border-b z-40">
        <div className="container mx-auto px-4">
          <div className="flex overflow-x-auto no-scrollbar py-2 space-x-8">
            {[
              { id: 'ingressos', label: 'Ingressos', icon: Ticket },
              { id: 'info', label: 'Info', icon: Info },
              { id: 'local', label: 'Localização', icon: MapPin },
              { id: 'pdv', label: 'PDVs', icon: Map },
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as any)}
                className={`flex items-center space-x-2 py-3 px-1 border-b-2 transition-all whitespace-nowrap ${
                  activeTab === tab.id 
                    ? 'border-green-500 text-green-600' 
                    : 'border-transparent text-zinc-500 hover:text-zinc-800'
                }`}
              >
                <tab.icon className="w-4 h-4" />
                <span className="text-sm font-semibold">{tab.label}</span>
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Tab Content */}
      <div className="container mx-auto px-4 py-12">
        {activeTab === 'ingressos' && (
          <div className="max-w-4xl mx-auto">
            <div className="text-center mb-12">
              <h2 className="text-2xl font-bold text-zinc-800">ADQUIRA SEU INGRESSO AGORA</h2>
              <p className="text-zinc-500 mt-2">Selecione os ingressos desejados e prossiga para o pagamento.</p>
            </div>

            <div className="mb-8 p-4 bg-zinc-50 rounded-lg border flex items-center justify-between">
              <div className="flex items-center space-x-4">
                <User className="w-5 h-5 text-zinc-400" />
                <div className="text-sm">
                   <p className="font-semibold text-zinc-700">Tem Clube GDO ou NSC? Adicione seu cupom abaixo</p>
                </div>
              </div>
              <div className="flex-1 max-w-xs ml-4 relative">
                <input 
                  type="text" 
                  placeholder="CÓDIGO AQUI" 
                  className="w-full border rounded py-1.5 px-3 text-sm focus:ring-green-500 outline-none" 
                />
                <button className="absolute right-2 top-1.5 text-zinc-400 hover:text-green-500">
                  <Smartphone className="w-4 h-4" />
                </button>
              </div>
            </div>

            <div className="space-y-6">
              {event.categories.map((cat, idx) => (
                <div key={idx} className="bg-white border rounded-lg overflow-hidden shadow-sm">
                  <div className="bg-zinc-800 text-white p-4 flex items-center justify-between">
                    <div className="flex items-center space-x-3">
                      <div className="w-4 h-4 rounded-sm" style={{ backgroundColor: cat.color }} />
                      <h3 className="font-bold uppercase tracking-wide">{cat.name}</h3>
                    </div>
                    <span className="text-xs text-zinc-400">a partir de R$ {Math.min(...cat.tiers.map(t => t.price)).toFixed(2)}</span>
                  </div>
                  <div className="divide-y">
                    {cat.tiers.map((tier) => (
                      <div key={tier.id} className="p-4 md:p-6 flex flex-col md:flex-row md:items-center justify-between gap-4">
                        <div className="flex-1">
                          <div className="flex items-center space-x-2">
                             <h4 className="font-bold text-zinc-800">{tier.name}</h4>
                             {tier.description.includes('Solidária') && (
                               <span className="bg-blue-500 text-white text-[10px] px-2 py-0.5 rounded font-bold uppercase">Saiba Mais</span>
                             )}
                          </div>
                          <p className="text-xs text-zinc-500 mt-1 uppercase font-semibold">Lote: {tier.batch}</p>
                          <p className="text-sm text-zinc-800 font-bold mt-1">Valor: R$ {tier.price.toFixed(2)} <span className="text-xs text-zinc-400 font-normal">+ taxa R$ {tier.fee.toFixed(2)}</span></p>
                        </div>
                        <div className="flex items-center space-x-4 self-end md:self-auto">
                           <button 
                             onClick={() => updateQuantity(tier.id, -1)}
                             className="w-8 h-8 rounded-full border border-zinc-300 flex items-center justify-center text-zinc-400 hover:border-zinc-800 hover:text-zinc-800 transition-colors"
                           >
                             <Minus className="w-4 h-4" />
                           </button>
                           <span className="w-8 text-center font-bold text-lg">{quantities[tier.id] || 0}</span>
                           <button 
                             onClick={() => updateQuantity(tier.id, 1)}
                             className="w-8 h-8 rounded-full border border-zinc-300 flex items-center justify-center text-zinc-400 hover:border-zinc-800 hover:text-zinc-800 transition-colors"
                           >
                             <Plus className="w-4 h-4" />
                           </button>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>

            {totalTickets > 0 && (
              <div className="fixed bottom-0 left-0 right-0 bg-white border-t shadow-2xl p-4 z-50 animate-in fade-in slide-in-from-bottom">
                 <div className="container mx-auto max-w-4xl flex items-center justify-between">
                    <div>
                       <p className="text-sm text-zinc-500 font-medium">{totalTickets} ingressos selecionados</p>
                       <p className="text-xl font-bold text-zinc-800">Total: R$ {totalPrice.toFixed(2)}</p>
                    </div>
                    <button 
                      onClick={handleCheckout}
                      className="bg-zinc-900 text-white px-8 py-3 rounded-lg font-bold hover:bg-green-600 transition-colors"
                    >
                      CONTINUAR
                    </button>
                 </div>
              </div>
            )}
          </div>
        )}

        {activeTab === 'info' && (
          <div className="max-w-4xl mx-auto bg-zinc-50 p-8 rounded-xl border">
            <h2 className="text-xl font-bold mb-6 text-center uppercase tracking-widest text-zinc-800">Informações do Evento</h2>
            <div className="prose prose-zinc max-w-none text-zinc-600 space-y-4">
               <p className="font-bold text-center text-zinc-800 mb-8">{event.title}</p>
               <p>{event.description}</p>
               <div className="border-t pt-6 mt-6">
                 <h3 className="font-bold text-zinc-800 mb-2">CLASSIFICAÇÃO</h3>
                 <p className="text-sm">{event.info}</p>
               </div>
               <div className="mt-8">
                 <img src={event.mapUrl} alt="Mapa do Evento" className="w-full rounded-lg shadow-md border bg-white p-1" />
                 <p className="text-center text-xs text-zinc-400 mt-2">Mapa ilustrativo sujeito a alterações.</p>
               </div>
            </div>
          </div>
        )}

        {activeTab === 'local' && (
          <div className="max-w-4xl mx-auto space-y-6">
             <div className="bg-zinc-50 p-6 rounded-lg border">
                <h3 className="font-bold text-lg mb-4">{event.venue}</h3>
                <p className="text-zinc-600">{event.city} - {event.state}</p>
                <div className="aspect-video bg-zinc-200 rounded-lg mt-6 overflow-hidden relative">
                   {/* Simulating a Google Map */}
                   <div className="absolute inset-0 flex items-center justify-center">
                     <div className="text-center">
                        <MapPin className="w-12 h-12 text-green-500 mx-auto mb-2" />
                        <p className="text-zinc-500 font-medium">Visualização do Mapa</p>
                     </div>
                   </div>
                   <img src={`https://picsum.photos/seed/location${id}/1000/600`} className="w-full h-full object-cover opacity-60" />
                </div>
             </div>
          </div>
        )}

        {activeTab === 'pdv' && (
           <div className="max-w-4xl mx-auto space-y-8">
              <h2 className="text-xl font-bold border-b pb-4">Pontos de Venda Oficiais</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {[
                  { name: 'Unifique Farroupilha', address: 'Rua Rui Barbosa, 262, Centro' },
                  { name: 'Unifique Caxias do Sul', address: 'Av. Rubem Bento Alves, 1192 - centro' },
                  { name: 'Unifique Bento Gonçalves', address: 'Rua Barão do Rio Branco, 280, Centro' },
                  { name: 'Unifique Caxias do Sul (Loja 2)', address: 'Av. Julio de Castilhos 915 - centro' }
                ].map((pdv, i) => (
                  <div key={i} className="p-4 bg-zinc-50 border rounded-lg">
                    <h4 className="font-bold text-zinc-800 uppercase text-sm mb-1">{pdv.name}</h4>
                    <p className="text-zinc-500 text-sm">{pdv.address}</p>
                  </div>
                ))}
              </div>
           </div>
        )}
      </div>
    </div>
  );
};

export default EventDetails;