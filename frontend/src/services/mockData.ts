
import type { Event } from '../types';

export const mockEvents: Event[] = [
  {
    id: 'festa-da-uva-passaporte',
    title: 'Passaporte Camarote | Festa da Uva',
    bannerUrl: 'https://cdn.guicheweb.com.br/gw-bucket/imagenseventos/05-12-2025_21-35-34.png',
    cardImageUrl: 'https://cdn.guicheweb.com.br/gw-bucket/imagenseventos/05-12-2025_21-35-29.jpg',
    venue: 'Arena de Shows da Festa da Uva',
    city: 'CAXIAS DO SUL',
    state: 'RS',
    date: '19/02/2026',
    endDate: '08/03/2026',
    time: '20:00H',
    description: 'Henrique & Juliano trazem seus maiores sucessos para a Festa da Uva 2026.',
    categories: [
      {
        name: 'Arquibancada',
        color: '#d4a373',
        tiers: [
          { id: 'arq-sol', name: 'Arquibancada (Solidária)', price: 60, fee: 9, batch: '1. LOTE + 1KG ALIMENTO', description: 'Entrega de 1kg de alimento' },
          { id: 'arq-int', name: 'Arquibancada (Inteira)', price: 100, fee: 15, batch: '1. LOTE', description: 'Acesso normal' }
        ]
      }
    ],
    info: 'Menores de 14 anos entram acompanhados.',
    mapUrl: 'https://images.unsplash.com/photo-1524368535928-5b5e00ddc76b?auto=format&fit=crop&q=80&w=800&h=400'
  },
  {
    id: 'henrique-juliano-uva',
    title: 'Henrique e Juliano | Festa da Uva',
    bannerUrl: 'https://cdn.guicheweb.com.br/gw-bucket/imagenseventos/05-12-2025_16-05-52.png',
    cardImageUrl: 'https://cdn.guicheweb.com.br/gw-bucket/imagenseventos/05-12-2025_16-05-43.png',
    venue: 'Arena de Shows da Festa da Uva',
    city: 'CAXIAS DO SUL',
    state: 'RS',
    date: '06/03/2026',
    time: '20:00H',
    description: 'A maior dupla sertaneja do Brasil em uma noite inesquecível.',
    categories: [
      {
        name: 'VIP',
        color: '#fb5607',
        tiers: [
          { id: 'vip-meia', name: 'VIP (Meia)', price: 150, fee: 22.5, batch: '2. LOTE', description: 'Frente ao palco' },
          { id: 'vip-int', name: 'VIP (Inteira)', price: 300, fee: 45, batch: '2. LOTE', description: 'Frente ao palco' }
        ]
      }
    ],
    info: 'Abertura dos portões às 18h.',
    mapUrl: 'https://images.unsplash.com/photo-1526726538690-5cbf956ae2fd?auto=format&fit=crop&q=80&w=800&h=400'
  },
  {
    id: 'conquista-privilege',
    title: 'Conquista Privilege Festival - Henrique e Juliano',
    bannerUrl: 'https://cdn.guicheweb.com.br/gw-bucket/imagenseventos/22-12-2025_14-52-34.png',
    cardImageUrl: 'https://cdn.guicheweb.com.br/gw-bucket/imagenseventos/22-12-2025_14-52-32.jpg',
    venue: 'Estádio Lomanto Junior',
    city: 'VITORIA DA CONQUISTA',
    state: 'BA',
    date: '21/03/2026',
    time: '19:00H',
    description: 'Um festival premium no coração da Bahia.',
    categories: [
       {
        name: 'Pista',
        color: '#2196F3',
        tiers: [
          { id: 'ba-pista', name: 'Pista', price: 80, fee: 12, batch: '1. LOTE', description: 'Setor padrão' }
        ]
      }
    ],
    info: 'Censura 16 anos.',
    mapUrl: 'https://images.unsplash.com/photo-1506157786151-b8491531f063?auto=format&fit=crop&q=80&w=800&h=400'
  },
  {
    id: 'hj-guaxupe',
    title: 'Henrique e Juliano - Guaxupé',
    bannerUrl: 'https://cdn.guicheweb.com.br/gw-bucket/imagenseventos/30-12-2025_07-58-54.png',
    cardImageUrl: 'https://cdn.guicheweb.com.br/gw-bucket/imagenseventos/30-12-2025_07-58-51.jpg',
    venue: 'Complexo Vila Olímpica',
    city: 'GUAXUPÉ',
    state: 'MG',
    date: '27/03/2026',
    time: '21:00H',
    description: 'Evento exclusivo na Vila Olímpica de Guaxupé.',
    categories: [
      {
        name: 'Arena',
        color: '#8338ec',
        tiers: [
          { id: 'mg-arena', name: 'Arena', price: 90, fee: 13.5, batch: '1. LOTE', description: 'Acesso total' }
        ]
      }
    ],
    info: 'Vendas oficiais iniciadas.',
    mapUrl: 'https://images.unsplash.com/photo-1533174072545-7a4b6ad7a6c3?auto=format&fit=crop&q=80&w=800&h=400'
  },
  {
    id: 'manifesto-goiania',
    title: 'Manifesto Musical - Goiânia',
    bannerUrl: 'https://cdn.guicheweb.com.br/gw-bucket/imagenseventos/16-01-2026_11-43-33.png',
    cardImageUrl: 'https://cdn.guicheweb.com.br/gw-bucket/imagenseventos/06-01-2026_15-46-53.jpg',
    venue: 'Estádio Serra Dourada',
    city: 'GOIANIA',
    state: 'GO',
    date: '02/05/2026',
    time: '16:00H',
    description: 'A turnê exclusiva 2026 do Manifesto Musical chega à capital do sertanejo.',
    categories: [
      {
        name: 'Pista',
        color: '#2196F3',
        tiers: [
          { id: 'go-pista-meia', name: 'Pista (Meia)', price: 70, fee: 10.5, batch: '1. LOTE', description: 'Acesso normal' },
          { id: 'go-pista-int', name: 'Pista (Inteira)', price: 140, fee: 21, batch: '1. LOTE', description: 'Acesso normal' }
        ]
      }
    ],
    info: 'Proibida a entrada de menores de 16 anos desacompanhados.',
    mapUrl: 'https://images.unsplash.com/photo-1524368535928-5b5e00ddc76b?auto=format&fit=crop&q=80&w=800&h=400'
  },
  {
    id: 'exponorte-2026',
    title: 'Exponorte 2026',
    bannerUrl: 'https://cdn.guicheweb.com.br/gw-bucket/imagenseventos/21-11-2025_12-14-09.png',
    cardImageUrl: 'https://cdn.guicheweb.com.br/gw-bucket/imagenseventos/21-11-2025_12-20-47.jpg',
    venue: 'Parque de Exposições de Sinop',
    city: 'SINOP',
    state: 'MT',
    date: '22/05/2026',
    endDate: '31/05/2026',
    time: '18:00H',
    description: 'A maior feira agropecuária do Norte de Mato Grosso.',
    categories: [
      {
        name: 'Passaporte Geral',
        color: '#4CAF50',
        tiers: [
          { id: 'mt-pass-meia', name: 'Passaporte (Meia)', price: 250, fee: 37.5, batch: 'LOTE ÚNICO', description: 'Válido para todos os dias' }
        ]
      }
    ],
    info: 'Ingresso nominal.',
    mapUrl: 'https://images.unsplash.com/photo-1533174072545-7a4b6ad7a6c3?auto=format&fit=crop&q=80&w=800&h=400'
  },
  {
    id: 'manifesto-bh',
    title: 'Manifesto Musical - Belo Horizonte',
    bannerUrl: 'https://cdn.guicheweb.com.br/gw-bucket/imagenseventos/19-01-2026_08-55-30.png',
    cardImageUrl: 'https://cdn.guicheweb.com.br/gw-bucket/imagenseventos/19-01-2026_08-55-27.jpg',
    venue: 'Estádio Mineirão',
    city: 'BELO HORIZONTE',
    state: 'MG',
    date: '18/07/2026',
    time: '14:00H',
    description: 'MANIFESTO MUSICAL BELO HORIZONTE | No Gigante da Pampulha.',
    categories: [
      {
        name: 'Gramado',
        color: '#4CAF50',
        tiers: [
          { id: 'bh-gram-meia', name: 'Gramado (Meia)', price: 120, fee: 18, batch: '1. LOTE', description: 'Acesso ao campo' }
        ]
      }
    ],
    info: 'Abertura dos portões às 14h.',
    mapUrl: 'https://images.unsplash.com/photo-1526726538690-5cbf956ae2fd?auto=format&fit=crop&q=80&w=800&h=400'
  },
  {
    id: 'manifesto-recife',
    title: 'Manifesto Musical - Recife',
    bannerUrl: 'https://cdn.guicheweb.com.br/gw-bucket/imagenseventos/18-01-2026_21-56-20.png',
    cardImageUrl: 'https://cdn.guicheweb.com.br/gw-bucket/imagenseventos/18-01-2026_21-56-14.jpg',
    venue: 'Classic Hall',
    city: 'OLINDA',
    state: 'PE',
    date: '08/08/2026',
    time: '21:00H',
    description: 'O espetáculo do Manifesto Musical chega ao Pernambuco.',
    categories: [
      {
        name: 'Front Stage',
        color: '#E91E63',
        tiers: [
          { id: 'pe-front-meia', name: 'Front (Meia)', price: 150, fee: 22.5, batch: '2. LOTE', description: 'Setor Premium' }
        ]
      }
    ],
    info: 'Censura 18 anos.',
    mapUrl: 'https://images.unsplash.com/photo-1506157786151-b8491531f063?auto=format&fit=crop&q=80&w=800&h=400'
  }
];
