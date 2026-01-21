export interface TicketTier {
  id: string;
  name: string;
  price: number;
  fee: number;
  description: string;
  batch: string;
}

export interface TicketCategory {
  name: string;
  color: string;
  tiers: TicketTier[];
}

export interface Event {
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

export interface CartItem {
  eventId: string;
  tierId: string;
  quantity: number;
  price: number;
  fee: number;
  name: string;
  categoryName: string;
}
