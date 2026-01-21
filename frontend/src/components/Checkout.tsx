import React, { useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { 
  CreditCard, ArrowLeft, ShieldCheck, CheckCircle2, User, 
  QrCode, Copy, AlertCircle, Loader, Clock, Smartphone,
  Mail, Key, Hash
} from 'lucide-react';

interface CartItem {
  eventId: string;
  tierId: string;
  quantity: number;
  price: number;
  fee: number;
  name: string;
  categoryName: string;
}

interface PixResponse {
  key: string;
  type: string;
  name: string;
}

interface OrderResponse {
  id: string;
  code: string;
  status: string;
  expiresAt: string;
}

const Checkout = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { cart, eventTitle } = (location.state as { cart: CartItem[], eventTitle: string }) || { cart: [], eventTitle: '' };
  
const BACKEND_URL = import.meta.env.VITE_API_URL || 
  (import.meta.env.NODE_ENV === 'production' 
    ? 'https://guiche-master-backend.vercel.app'
    : 'http://localhost:3001');
  const [step, setStep] = useState<'form' | 'pix' | 'success'>('form');
  const [loading, setLoading] = useState(false);
  const [copied, setCopied] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [pixData, setPixData] = useState<PixResponse | null>(null);
  const [orderData, setOrderData] = useState<OrderResponse | null>(null);
  const [timeLeft, setTimeLeft] = useState<string>('30:00');

  const [formData, setFormData] = useState({
    name: '',
    email: '',
    cpf: '',
    phone: ''
  });

  const total = cart.reduce((acc, item) => acc + (item.price + item.fee) * item.quantity, 0);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    setError(null);
  };

  const handleCPFChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const formatted = formatCPF(e.target.value);
    setFormData(prev => ({ ...prev, cpf: formatted }));
    setError(null);
  };

  const handlePhoneChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const formatted = formatPhone(e.target.value);
    setFormData(prev => ({ ...prev, phone: formatted }));
    setError(null);
  };

  const formatCPF = (value: string) => {
    return value
      .replace(/\D/g, '')
      .replace(/(\d{3})(\d)/, '$1.$2')
      .replace(/(\d{3})(\d)/, '$1.$2')
      .replace(/(\d{3})(\d{1,2})$/, '$1-$2')
      .slice(0, 14);
  };

  const formatPhone = (value: string) => {
    return value
      .replace(/\D/g, '')
      .replace(/(\d{2})(\d)/, '($1) $2')
      .replace(/(\d{5})(\d)/, '$1-$2')
      .slice(0, 15);
  };

  const validateCPF = (cpf: string): boolean => {
    const cleanCPF = cpf.replace(/\D/g, '');
    if (cleanCPF.length !== 11) return false;
    if (/^(\d)\1+$/.test(cleanCPF)) return false;
    
    let sum = 0;
    for (let i = 0; i < 9; i++) {
      sum += parseInt(cleanCPF.charAt(i)) * (10 - i);
    }
    let digit = 11 - (sum % 11);
    if (digit >= 10) digit = 0;
    if (digit !== parseInt(cleanCPF.charAt(9))) return false;
    
    sum = 0;
    for (let i = 0; i < 10; i++) {
      sum += parseInt(cleanCPF.charAt(i)) * (11 - i);
    }
    digit = 11 - (sum % 11);
    if (digit >= 10) digit = 0;
    if (digit !== parseInt(cleanCPF.charAt(10))) return false;
    
    return true;
  };

  // Ícone baseado no tipo de chave PIX
  const getPixTypeIcon = (type: string) => {
    switch (type) {
      case 'email': return <Mail className="w-5 h-5" />;
      case 'phone': return <Smartphone className="w-5 h-5" />;
      case 'cpf':
      case 'cnpj': return <Hash className="w-5 h-5" />;
      default: return <Key className="w-5 h-5" />;
    }
  };

  // Timer countdown
  React.useEffect(() => {
    if (step !== 'pix' || !orderData?.expiresAt) return;

    const timer = setInterval(() => {
      const now = new Date().getTime();
      const expires = new Date(orderData.expiresAt).getTime();
      const diff = expires - now;

      if (diff <= 0) {
        setTimeLeft('Expirado');
        clearInterval(timer);
        return;
      }

      const minutes = Math.floor(diff / 60000);
      const seconds = Math.floor((diff % 60000) / 1000);
      setTimeLeft(`${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`);
    }, 1000);

    return () => clearInterval(timer);
  }, [step, orderData]);

  const handlePayment = async () => {
    setError(null);
    
    if (!formData.name || !formData.email || !formData.cpf) {
      setError('Por favor, preencha Nome, E-mail e CPF.');
      return;
    }

    if (!validateCPF(formData.cpf)) {
      setError('CPF inválido. Por favor, digite um CPF válido.');
      return;
    }

    setLoading(true);

    try {
      const paymentData = {
        customer: {
          name: formData.name,
          email: formData.email,
          cpf: formData.cpf.replace(/\D/g, ''),
          phone: formData.phone.replace(/\D/g, '') || ''
        },
        items: cart.map(item => ({
          title: `${item.quantity}x ${item.name} - ${item.categoryName}`,
          unitPrice: (item.price + item.fee),
          quantity: item.quantity
        })),
        total: total
      };

      console.log('🚀 Enviando pedido para backend...');

      const response = await fetch(`${BACKEND_URL}/api/payment`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(paymentData)
      });

      const data = await response.json();

      if (!response.ok || !data.success) {
        throw new Error(data.error || 'Erro ao processar pedido');
      }

      console.log('✅ Resposta do backend:', data);

      setPixData(data.pix);
      setOrderData(data.order);
      setStep('pix');

    } catch (err: any) {
      console.error('❌ Erro:', err);
      setError(err.message || 'Erro ao processar pedido. Tente novamente.');
    } finally {
      setLoading(false);
    }
  };

  const copyPixKey = () => {
    if (pixData?.key) {
      navigator.clipboard.writeText(pixData.key);
      setCopied(true);
      setTimeout(() => setCopied(false), 3000);
    }
  };

  const confirmPayment = () => {
    setStep('success');
  };

  if (cart.length === 0) {
    return (
      <div className="container mx-auto px-4 py-20 text-center">
        <h2 className="text-2xl font-bold mb-4 text-zinc-800">Seu carrinho está vazio</h2>
        <button onClick={() => navigate('/')} className="bg-black text-white px-8 py-3 rounded-lg font-bold hover:bg-zinc-800 transition-colors">
          Voltar
        </button>
      </div>
    );
  }

  const inputClass = "w-full bg-white border-2 border-zinc-200 rounded-xl p-4 text-sm text-black placeholder:text-zinc-400 focus:border-green-500 outline-none transition-all";

  return (
    <div className="bg-[#f4f4f5] min-h-screen py-10">
      <div className="container mx-auto px-4 max-w-5xl">
        
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <button 
            onClick={() => step === 'form' ? navigate(-1) : setStep('form')} 
            className="flex items-center space-x-2 text-zinc-500 hover:text-zinc-900 font-bold text-xs uppercase tracking-widest"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Voltar</span>
          </button>
          
          <div className="flex items-center space-x-2 bg-white px-4 py-2 rounded-full shadow-sm border border-zinc-200">
            <ShieldCheck className="w-4 h-4 text-green-600" />
            <span className="text-[10px] font-black text-zinc-400 uppercase tracking-tighter">Pagamento Seguro</span>
          </div>
        </div>

        {/* Mensagem de erro */}
        {error && (
          <div className="bg-red-50 border-2 border-red-200 rounded-2xl p-4 mb-6 flex items-start space-x-3">
            <AlertCircle className="w-5 h-5 text-red-600 flex-shrink-0 mt-0.5" />
            <p className="text-red-900 font-bold text-sm">{error}</p>
          </div>
        )}

        {/* STEP 1: Formulário */}
        {step === 'form' && (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <div className="lg:col-span-2 space-y-6">
              
              {/* Dados Pessoais */}
              <div className="bg-white p-8 rounded-3xl shadow-sm border border-zinc-100">
                <div className="flex items-center space-x-3 mb-8">
                  <div className="w-10 h-10 bg-zinc-100 rounded-xl flex items-center justify-center">
                    <User className="w-5 h-5 text-zinc-900" />
                  </div>
                  <h2 className="text-xl font-black text-zinc-900 uppercase italic">Meus Dados</h2>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <label className="text-[10px] font-black text-zinc-400 uppercase tracking-widest">Nome Completo *</label>
                    <input 
                      name="name" 
                      value={formData.name} 
                      onChange={handleInputChange} 
                      type="text" 
                      placeholder="João Silva" 
                      className={inputClass} 
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-[10px] font-black text-zinc-400 uppercase tracking-widest">E-mail *</label>
                    <input 
                      name="email" 
                      value={formData.email} 
                      onChange={handleInputChange} 
                      type="email" 
                      placeholder="seu@email.com" 
                      className={inputClass} 
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-[10px] font-black text-zinc-400 uppercase tracking-widest">CPF *</label>
                    <input 
                      name="cpf" 
                      value={formData.cpf} 
                      onChange={handleCPFChange} 
                      type="text" 
                      placeholder="000.000.000-00" 
                      className={inputClass}
                      maxLength={14}
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-[10px] font-black text-zinc-400 uppercase tracking-widest">WhatsApp</label>
                    <input 
                      name="phone" 
                      value={formData.phone} 
                      onChange={handlePhoneChange} 
                      type="text" 
                      placeholder="(00) 00000-0000" 
                      className={inputClass}
                      maxLength={15}
                    />
                  </div>
                </div>
              </div>

              {/* Método de Pagamento */}
              <div className="bg-white p-8 rounded-3xl shadow-sm border border-zinc-100">
                <div className="flex items-center space-x-3 mb-8">
                  <div className="w-10 h-10 bg-green-100 rounded-xl flex items-center justify-center">
                    <QrCode className="w-5 h-5 text-green-600" />
                  </div>
                  <h2 className="text-xl font-black text-zinc-900 uppercase italic">Pagamento via PIX</h2>
                </div>
                
                <div className="bg-green-50 border-2 border-green-200 rounded-2xl p-6">
                  <div className="flex items-start space-x-4">
                    <div className="w-12 h-12 bg-green-500 rounded-xl flex items-center justify-center flex-shrink-0">
                      <QrCode className="w-6 h-6 text-white" />
                    </div>
                    <div>
                      <h3 className="font-bold text-green-800 mb-1">Pagamento Instantâneo</h3>
                      <p className="text-sm text-green-700">
                        Ao clicar em "Efetuar Compra", você receberá uma chave PIX para realizar o pagamento. 
                        O pagamento é confirmado instantaneamente.
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Resumo */}
            <div className="space-y-6">
              <div className="bg-zinc-900 text-white p-8 rounded-[2rem] shadow-xl sticky top-24">
                <h3 className="font-black text-xl mb-6 uppercase italic">Resumo</h3>
                
                <div className="space-y-3 mb-6 pb-6 border-b border-zinc-700">
                  {cart.map((item, idx) => (
                    <div key={idx} className="flex justify-between text-sm">
                      <span className="text-zinc-400">{item.quantity}x {item.name}</span>
                      <span className="font-bold">R$ {((item.price + item.fee) * item.quantity).toFixed(2)}</span>
                    </div>
                  ))}
                </div>
                
                <div className="text-4xl font-black italic mb-8">R$ {total.toFixed(2)}</div>
                
                <button 
                  onClick={handlePayment} 
                  disabled={loading} 
                  className="w-full bg-green-600 text-black py-5 rounded-2xl font-black text-sm hover:bg-green-500 transition-all flex items-center justify-center space-x-3 uppercase tracking-widest disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {loading ? (
                    <>
                      <Loader className="w-5 h-5 animate-spin" />
                      <span>GERANDO PIX...</span>
                    </>
                  ) : (
                    <span>EFETUAR COMPRA</span>
                  )}
                </button>
              </div>
            </div>
          </div>
        )}

        {/* STEP 2: Exibir Chave PIX */}
        {step === 'pix' && pixData && orderData && (
          <div className="max-w-2xl mx-auto">
            <div className="bg-white p-8 md:p-12 rounded-[3rem] shadow-2xl text-center">
              
              {/* Ícone e Título */}
              <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
                <QrCode className="w-10 h-10 text-green-600" />
              </div>
              
              <h2 className="text-3xl font-black text-zinc-900 mb-2 italic uppercase">Pague via PIX</h2>
              <p className="text-zinc-500 mb-8">Copie a chave abaixo e faça o pagamento no seu banco</p>
              
              {/* Timer */}
              <div className="flex items-center justify-center space-x-2 mb-8">
                <Clock className="w-5 h-5 text-orange-500" />
                <span className="text-sm font-bold text-zinc-600">Expira em:</span>
                <span className={`text-lg font-black ${timeLeft === 'Expirado' ? 'text-red-500' : 'text-orange-500'}`}>
                  {timeLeft}
                </span>
              </div>

              {/* Valor */}
              <div className="bg-zinc-100 rounded-2xl p-6 mb-8">
                <p className="text-sm text-zinc-500 mb-1">Valor a pagar</p>
                <p className="text-4xl font-black text-zinc-900">R$ {total.toFixed(2)}</p>
              </div>

              {/* Tipo de Chave */}
              <div className="flex items-center justify-center space-x-2 mb-4">
                <span className="text-zinc-400">{getPixTypeIcon(pixData.type)}</span>
                <span className="text-sm font-bold text-zinc-600 uppercase">{pixData.name}</span>
              </div>

              {/* Chave PIX */}
              <div className="bg-zinc-50 border-2 border-zinc-200 rounded-2xl p-6 mb-6">
                <p className="text-[10px] font-black text-zinc-400 uppercase tracking-widest mb-3">Chave PIX</p>
                <p className="font-mono text-lg font-bold text-zinc-800 break-all select-all">
                  {pixData.key}
                </p>
              </div>
              
              {/* Botão Copiar */}
              <button 
                onClick={copyPixKey} 
                className={`w-full py-5 rounded-2xl font-black mb-4 flex items-center justify-center space-x-3 transition-all ${
                  copied 
                    ? 'bg-green-500 text-white' 
                    : 'bg-zinc-900 text-white hover:bg-zinc-800'
                }`}
              >
                <Copy className="w-5 h-5" />
                <span>{copied ? 'CHAVE COPIADA!' : 'COPIAR CHAVE PIX'}</span>
              </button>
              
              {/* Botão Confirmar */}
              <button 
                onClick={confirmPayment} 
                className="w-full border-2 border-green-500 text-green-600 py-5 rounded-2xl font-black hover:bg-green-50 transition-colors flex items-center justify-center space-x-2"
              >
                <CheckCircle2 className="w-5 h-5" />
                <span>JÁ REALIZEI O PAGAMENTO</span>
              </button>
              
              {/* Info do Pedido */}
              <div className="mt-8 pt-6 border-t border-zinc-200">
                <p className="text-xs text-zinc-400">
                  Pedido: <span className="font-bold text-zinc-600">{orderData.code}</span>
                </p>
              </div>
            </div>

            {/* Instruções */}
            <div className="mt-8 bg-blue-50 border border-blue-200 rounded-2xl p-6">
              <h4 className="font-bold text-blue-800 mb-3">📱 Como pagar:</h4>
              <ol className="text-sm text-blue-700 space-y-2">
                <li>1. Abra o aplicativo do seu banco</li>
                <li>2. Escolha pagar via PIX</li>
                <li>3. Selecione "PIX Copia e Cola" ou digite a chave</li>
                <li>4. Cole a chave copiada</li>
                <li>5. Confirme o pagamento</li>
              </ol>
            </div>
          </div>
        )}

        {/* STEP 3: Sucesso */}
        {step === 'success' && (
          <div className="bg-white p-12 md:p-16 rounded-[4rem] shadow-2xl text-center max-w-2xl mx-auto">
            <div className="w-24 h-24 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-8">
              <CheckCircle2 className="w-12 h-12 text-green-500" />
            </div>
            
            <h2 className="text-4xl font-black text-zinc-900 mb-4 italic uppercase">Pedido Registrado!</h2>
            <p className="text-zinc-600 mb-2">Seu pedido foi registrado com sucesso.</p>
            <p className="text-sm text-zinc-500 mb-8">
              Assim que o pagamento for confirmado, enviaremos os ingressos para <strong>{formData.email}</strong>
            </p>
            
            {orderData && (
              <div className="bg-zinc-50 p-6 rounded-2xl mb-8">
                <p className="text-xs text-zinc-400 mb-2">Código do Pedido</p>
                <p className="font-mono font-bold text-2xl text-zinc-800">{orderData.code}</p>
              </div>
            )}

            <div className="bg-yellow-50 border border-yellow-200 rounded-2xl p-4 mb-8">
              <p className="text-sm text-yellow-800">
                ⚠️ <strong>Importante:</strong> Guarde o código do pedido para acompanhar o status do seu pagamento.
              </p>
            </div>
            
            <button 
              onClick={() => navigate('/')} 
              className="bg-black text-white px-12 py-6 rounded-2xl font-black uppercase tracking-widest text-xs hover:bg-zinc-800 transition-colors"
            >
              VOLTAR AO INÍCIO
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default Checkout;