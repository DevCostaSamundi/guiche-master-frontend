import { Routes, Route, Link } from 'react-router-dom';
import { Search, MapPin, Calendar, Smartphone } from 'lucide-react';
import { mockEvents } from './services/mockData';
import EventDetails from './components/EventDetails';
import Checkout from './components/Checkout';

const Header = () => {
  return (
    <header className="bg-black text-white sticky top-0 z-50">
      <div className="container mx-auto px-4 h-16 flex items-center justify-between">
        {/* Logo */}
        <Link to="/" className="flex items-center space-x-2">
          <div className="bg-green-500 p-1.5 rounded">
            <Smartphone className="w-6 h-6 text-black" />
          </div>
          <span className="text-2xl font-bold italic">guichê<span className="text-green-500">web</span></span>
        </Link>

        {/* Search Bar - Hidden on Mobile */}
        <div className="hidden md:flex flex-1 max-w-xl mx-8 relative">
          <input 
            type="text" 
            placeholder="Faça sua pesquisa..." 
            className="w-full bg-zinc-800 border-none rounded-md py-2 px-4 focus:ring-2 focus:ring-green-500 text-sm"
          />
          <Search className="absolute right-3 top-2.5 w-4 h-4 text-zinc-400" />
        </div>

        {/* Actions */}
        <div className="flex items-center space-x-6 text-sm">
          <button className="hidden sm:flex items-center space-x-1 hover:text-green-500 transition-colors">
            <Calendar className="w-4 h-4" />
            <span>Crie seu evento</span>
          </button>
          <button className="border border-white/30 px-6 py-1.5 rounded-md hover:bg-white hover:text-black transition-all">
            ENTRAR
          </button>
        </div>
      </div>
    </header>
  );
};

const EventGrid = () => {
  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-2xl font-semibold mb-8 text-zinc-800 border-b pb-4">Resultados da Pesquisa</h1>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {mockEvents.map((event) => (
          <Link 
            key={event.id} 
            to={`/event/${event.id}`} 
            className="bg-white rounded-lg overflow-hidden shadow-sm hover:shadow-xl transition-shadow group flex flex-col"
          >
            <div className="aspect-square relative overflow-hidden">
              <img 
                src={event.cardImageUrl} 
                alt={event.title} 
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
              />
            </div>
            <div className="p-4 flex flex-col flex-1">
              <h3 className="font-bold text-zinc-800 mb-2 leading-tight min-h-[3rem] line-clamp-2">
                {event.title}
              </h3>
              <div className="text-xs text-zinc-500 space-y-1 mt-auto">
                <div className="flex items-center space-x-1">
                  <MapPin className="w-3 h-3 flex-shrink-0" />
                  <span>{event.city}/{event.state}</span>
                </div>
                <div className="flex items-center space-x-1">
                  <Calendar className="w-3 h-3 flex-shrink-0" />
                  <span>{event.endDate ? `de ${event.date.split('/')[0]}/${event.date.split('/')[1]} até ${event.endDate}` : event.date}</span>
                </div>
              </div>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
};

const Footer = () => (
  <footer className="bg-zinc-900 text-white py-12 mt-auto">
    <div className="container mx-auto px-4 grid grid-cols-1 md:grid-cols-4 gap-8">
      <div>
        <div className="flex items-center space-x-2 mb-4">
          <div className="bg-green-500 p-1 rounded">
             <Smartphone className="w-4 h-4 text-black" />
          </div>
          <span className="text-xl font-bold italic">guichê<span className="text-green-500">web</span></span>
        </div>
        <p className="text-zinc-400 text-sm">Sua melhor opção para venda de ingressos online.</p>
      </div>
      <div>
        <h4 className="font-bold mb-4">Empresa</h4>
        <ul className="text-sm text-zinc-400 space-y-2">
          <li>Sobre nós</li>
          <li>Blog</li>
          <li>Trabalhe conosco</li>
        </ul>
      </div>
      <div>
        <h4 className="font-bold mb-4">Ajuda</h4>
        <ul className="text-sm text-zinc-400 space-y-2">
          <li>Central de Ajuda</li>
          <li>Termos de Uso</li>
          <li>Privacidade</li>
        </ul>
      </div>
      <div>
        <h4 className="font-bold mb-4">Redes Sociais</h4>
        <div className="flex space-x-4">
          <div className="w-8 h-8 bg-zinc-700 rounded-full flex items-center justify-center hover:bg-green-500 transition-colors cursor-pointer">f</div>
          <div className="w-8 h-8 bg-zinc-700 rounded-full flex items-center justify-center hover:bg-green-500 transition-colors cursor-pointer">in</div>
          <div className="w-8 h-8 bg-zinc-700 rounded-full flex items-center justify-center hover:bg-green-500 transition-colors cursor-pointer">ig</div>
        </div>
      </div>
    </div>
  </footer>
);

const App = () => {
  return (
    <div className="min-h-screen flex flex-col bg-zinc-50">
      <Header />
      <main className="flex-1">
        <Routes>
          <Route path="/" element={<EventGrid />} />
          <Route path="/event/:id" element={<EventDetails />} />
          <Route path="/checkout" element={<Checkout />} />
        </Routes>
      </main>
      <Footer />
      
      {/* Sticky WhatsApp Button */}
      <a 
        href="https://wa.me/5554999999999" 
        target="_blank" 
        rel="noopener noreferrer"
        className="fixed bottom-6 right-6 w-14 h-14 bg-green-500 rounded-full shadow-lg flex items-center justify-center text-white hover:scale-110 transition-transform z-50"
      >
        <svg viewBox="0 0 24 24" className="w-8 h-8 fill-current">
          <path d="M12.031 6.172c-3.181 0-5.767 2.586-5.767 5.767 0 1.267.405 2.436 1.096 3.39l-.715 2.614 2.68-.703c.833.454 1.78.715 2.788.715 3.181 0 5.767-2.586 5.767-5.767 0-3.181-2.586-5.767-5.767-5.767zm3.394 8.203c-.145.408-.847.742-1.185.776-.339.034-.633.017-1.011-.102-.24-.075-.544-.176-1.114-.421-1.291-.555-2.13-1.874-2.193-1.959-.064-.085-.509-.678-.509-1.295 0-.617.322-.921.437-1.045.115-.124.254-.156.339-.156.085 0 .169.001.242.004.077.003.183-.029.286.223.106.26.363.882.395.945.032.064.053.138.01.223-.042.085-.064.138-.127.212-.064.074-.133.165-.19.223-.064.064-.13.133-.056.26.074.127.327.541.703.876.484.432.891.566 1.019.63.127.064.201.053.276-.032.074-.085.318-.371.403-.498.085-.127.169-.106.286-.064.116.042.742.35 0 .35l.869.41c.127.064.212.095.276.127.064.032.064.127.042.223z"/>
        </svg>
      </a>
    </div>
  );
};

export default App;