import React, { useState, useEffect } from 'react';
import { 
  Heart, 
  Menu, 
  X, 
  CheckCircle2, 
  Clock, 
  Copy, 
  Check, 
  ChevronRight, 
  ThumbsUp, 
  MessageCircle, 
  Share2, 
  ShieldCheck, 
  ArrowUp,
  Sparkles,
  QrCode
} from 'lucide-react';

interface Comment {
  id: string;
  name: string;
  initials: string;
  bgColor: string;
  textColor: string;
  time: string;
  amount: number;
  text: string;
  likes: number;
  isLiked?: boolean;
  isLive?: boolean;
}

export default function App() {
  // Campaign State
  const [raisedAmount, setRaisedAmount] = useState<number>(1939);
  const [goalAmount] = useState<number>(10000);
  const [backerCount, setBackerCount] = useState<number>(77);
  const [activeTab, setActiveTab] = useState<'about' | 'updates' | 'comments'>('about');

  // UI Modals State
  const [isMenuOpen, setIsMenuOpen] = useState<boolean>(false);
  const [isDonateModalOpen, setIsDonateModalOpen] = useState<boolean>(false);
  const [isCheckoutModalOpen, setIsCheckoutModalOpen] = useState<boolean>(false);
  const [isCustomAmountStep, setIsCustomAmountStep] = useState<boolean>(false);
  const [customAmountValue, setCustomAmountValue] = useState<string>('');
  const [selectedAmount, setSelectedAmount] = useState<number>(100);

  // PIX Checkout State
  const [pixCopied, setPixCopied] = useState<boolean>(false);
  const [pixPaid, setPixPaid] = useState<boolean>(false);
  const [pixTimer, setPixTimer] = useState<number>(900); // 15:00
  const [donorNameInput, setDonorNameInput] = useState<string>('');
  const [donorCommentInput, setDonorCommentInput] = useState<string>('');
  const [hasDonatedInSession, setHasDonatedInSession] = useState<boolean>(false);

  // Exit Popup State
  const [isExitPopupOpen, setIsExitPopupOpen] = useState<boolean>(false);
  const [hasTriggeredExit, setHasTriggeredExit] = useState<boolean>(false);

  // Comments State
  const [comments, setComments] = useState<Comment[]>([
    {
      id: '1',
      name: 'Rosângela M.',
      initials: 'RM',
      bgColor: '#FCE7F3',
      textColor: '#BE185D',
      time: 'há 3 min',
      amount: 50,
      text: 'Ajuda feita. Força, senhor. Que gesto lindo entregar a sacola toda. ❤️',
      likes: 341,
      isLiked: false,
      isLive: true,
    },
    {
      id: '2',
      name: 'Diego A.',
      initials: 'DA',
      bgColor: '#DBEAFE',
      textColor: '#1D4ED8',
      time: 'há 12 min',
      amount: 50,
      text: 'Ajudei com R$ 50. Que ele consiga descansar e cuidar desse tremor.',
      likes: 287,
      isLiked: false,
      isLive: true,
    },
    {
      id: '3',
      name: 'Luciana F.',
      initials: 'LF',
      bgColor: '#DCFCE7',
      textColor: '#16A34A',
      time: 'há 18 min',
      amount: 25,
      text: 'Compartilhei. R$ 10 de muita gente muda a situação dele rapidinho.',
      likes: 312,
      isLiked: false,
      isLive: true,
    },
    {
      id: '4',
      name: 'Marcos V.',
      initials: 'MV',
      bgColor: '#FEF9C3',
      textColor: '#92400E',
      time: 'há 31 min',
      amount: 100,
      text: 'Força, guerreiro. O senhor merece todo o amparo do mundo. 🙏',
      likes: 198,
      isLiked: false,
      isLive: false,
    },
  ]);

  // Handle Exit Intent Detection
  useEffect(() => {
    const handleMouseLeave = (e: MouseEvent) => {
      if (e.clientY <= 10 && !hasTriggeredExit && !isDonateModalOpen && !isCheckoutModalOpen) {
        setIsExitPopupOpen(true);
        setHasTriggeredExit(true);
      }
    };
    document.addEventListener('mouseleave', handleMouseLeave);
    return () => document.removeEventListener('mouseleave', handleMouseLeave);
  }, [hasTriggeredExit, isDonateModalOpen, isCheckoutModalOpen]);

  // PIX Timer countdown when checkout is open
  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (isCheckoutModalOpen && !pixPaid && pixTimer > 0) {
      interval = setInterval(() => {
        setPixTimer((prev) => prev - 1);
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [isCheckoutModalOpen, pixPaid, pixTimer]);

  const progressPercent = Math.min(100, Math.round((raisedAmount / goalAmount) * 100));

  const formatCurrency = (val: number) => {
    return new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL', maximumFractionDigits: 0 }).format(val);
  };

  const handleOpenDonateModal = () => {
    setIsDonateModalOpen(true);
    setIsCustomAmountStep(false);
  };

  const handleSelectAmount = (amount: number) => {
    setSelectedAmount(amount);
    setIsDonateModalOpen(false);
    setIsExitPopupOpen(false);
    setIsCheckoutModalOpen(true);
    setPixPaid(false);
    setPixCopied(false);
    setPixTimer(900);
  };

  const handleCustomAmountSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const parsed = parseFloat(customAmountValue.replace(',', '.'));
    if (parsed && parsed >= 5) {
      handleSelectAmount(parsed);
    }
  };

  const handleCopyPix = () => {
    const pixCode = `00020126580014br.gov.bcb.pix0136campanhadobem-parkinson-ref4007520400005303986540${selectedAmount}.005802BR5925CAMPANHA DO BEM APOIO6009SAO PAULO62070503***6304E8A9`;
    navigator.clipboard.writeText(pixCode);
    setPixCopied(true);
    setTimeout(() => setPixCopied(false), 3000);
  };

  const handleSimulatePixSuccess = () => {
    setPixPaid(true);
    setRaisedAmount((prev) => prev + selectedAmount);
    setBackerCount((prev) => prev + 1);
    setHasDonatedInSession(true);
  };

  const handleAddComment = (e: React.FormEvent) => {
    e.preventDefault();
    if (!donorNameInput.trim()) return;

    const initials = donorNameInput
      .split(' ')
      .map((n) => n[0])
      .join('')
      .substring(0, 2)
      .toUpperCase();

    const newComment: Comment = {
      id: Date.now().toString(),
      name: donorNameInput.trim(),
      initials: initials || 'CD',
      bgColor: '#DCFCE7',
      textColor: '#15803D',
      time: 'agora',
      amount: selectedAmount,
      text: donorCommentInput.trim() || 'Fiz minha doação com muito carinho para ajudar esta família!',
      likes: 1,
      isLiked: true,
      isLive: true,
    };

    setComments([newComment, ...comments]);
    setIsCheckoutModalOpen(false);
    setActiveTab('comments');
    setDonorNameInput('');
    setDonorCommentInput('');
  };

  const toggleLike = (id: string) => {
    setComments((prev) =>
      prev.map((c) => {
        if (c.id === id) {
          return {
            ...c,
            isLiked: !c.isLiked,
            likes: c.isLiked ? c.likes - 1 : c.likes + 1,
          };
        }
        return c;
      })
    );
  };

  const formatTimer = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  return (
    <div className="min-h-screen bg-[#f9f9f9] text-[#282828] flex flex-col font-sans">
      {/* HEADER */}
      <header className="site-header">
        <div className="site-header__inner">
          <div className="site-header__left">
            <a href="#topo" className="site-header__brand" aria-label="Campanha para esta família">
              <svg className="site-header__mark" viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg">
                <rect width="32" height="32" rx="8" fill="#24CA68" />
                <path d="M16 23.5s-7-4.2-7-9.3c0-2.3 1.7-4 3.7-4 1.3 0 2.4.7 3.3 1.8.9-1.1 2-1.8 3.3-1.8 2 0 3.7 1.7 3.7 4 0 5.1-7 9.3-7 9.3z" fill="#FFFFFF" />
              </svg>
              <span className="wm-text">
                <span>Campanha</span>
                <span className="wm-mid">do</span>
                <span>esta família</span>
              </span>
            </a>
          </div>

          <div className="relative">
            <button
              type="button"
              className="site-header__menu-toggle"
              aria-expanded={isMenuOpen}
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              aria-label="Abrir menu"
            >
              <span></span>
              <span></span>
              <span></span>
            </button>

            {isMenuOpen && (
              <div className="site-header__menu-panel">
                <button
                  className="site-header__menu-item"
                  onClick={() => {
                    setActiveTab('about');
                    setIsMenuOpen(false);
                    document.getElementById('aboutSection')?.scrollIntoView({ behavior: 'smooth' });
                  }}
                >
                  Sobre
                </button>
                <button
                  className="site-header__menu-item"
                  onClick={() => {
                    setActiveTab('updates');
                    setIsMenuOpen(false);
                    document.getElementById('campaignUpdatesSection')?.scrollIntoView({ behavior: 'smooth' });
                  }}
                >
                  Atualizações (3)
                </button>
                <button
                  className="site-header__menu-item"
                  onClick={() => {
                    setActiveTab('comments');
                    setIsMenuOpen(false);
                    document.getElementById('comentariosSection')?.scrollIntoView({ behavior: 'smooth' });
                  }}
                >
                  Quem ajudou
                </button>
                <div className="h-px bg-slate-100 my-1" />
                <button
                  className="site-header__menu-item site-header__menu-cta"
                  onClick={() => {
                    setIsMenuOpen(false);
                    handleOpenDonateModal();
                  }}
                >
                  Doar agora
                </button>
              </div>
            )}
          </div>
        </div>
      </header>

      {/* MAIN CONTAINER */}
      <main id="topo" className="flex-1 pb-24">
        <div className="max-w-[720px] mx-auto px-4 pt-6">
          {/* TOP CAMPAIGN HEADLINE */}
          <div className="topCampaign">
            <span className="category-badge">SAÚDE / TRABALHO</span>
            <h1>Quase sem aguentar andar pelo Parkinson, ele ainda ofereceu a sacola toda de doces</h1>
            <p className="campaign-subheadline">
              Vivendo uma situação que só Deus sabe, ele trabalha nas ruas vendendo paçoquinhas mesmo enfrentando os fortes tremores no corpo.
            </p>
          </div>

          {/* HERO MEDIA & ORGANIZER */}
          <div className="detalhes-view mb-4">
            <div className="hero-image-container">
              <img
                src="/assets/aistudio/banner-4007_5c1e194b.webp"
                alt="Quase sem aguentar andar pelo Parkinson, ele ainda ofereceu a sacola toda de doces"
                className="w-full h-auto object-cover"
                onError={(e) => {
                  // Fallback to local image or styled placeholder if needed
                  (e.target as HTMLElement).style.display = 'block';
                }}
              />
            </div>

            <div className="beneficiary-info">
              <div className="beneficiary-row">
                <Heart className="w-3.5 h-3.5 text-[#24CA68] fill-[#24CA68] shrink-0" />
                <span>
                  Campanha de <strong>Esta família</strong>
                  <img
                    src="/assets/aistudio/perfil-verificado_39b21c08.png"
                    alt="Verificado"
                    className="w-3.5 h-3.5 inline-block ml-1 align-middle"
                  />
                </span>
              </div>
              <div className="beneficiary-row">
                <Clock className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                <span>Criada em 30 de outubro de 2026</span>
              </div>
            </div>
          </div>

          {/* PROGRESS CARD */}
          <div className="resumo-card">
            <div className="progress-eyebrow">
              <span className="progress-label">Progresso da Campanha</span>
              <span className="progress-percent">{progressPercent}%</span>
            </div>

            <div className="progress-bar-bg">
              <div
                className="progress-bar-fill"
                style={{ width: `${progressPercent}%` }}
              />
            </div>

            <div className="arrecadacao-text">
              <strong>{formatCurrency(raisedAmount)}</strong>{' '}
              <span className="text-slate-500 font-normal">
                arrecadados da meta de {formatCurrency(goalAmount)}
              </span>
            </div>
          </div>

          {/* TABS SELECTOR */}
          <div className="menu-detalhes mt-6 mb-4 flex justify-center">
            <ul className="menu-detalhes-list">
              <li
                className={`menu-detalhes-item ${activeTab === 'about' ? 'active' : ''}`}
                onClick={() => setActiveTab('about')}
              >
                Sobre
              </li>
              <li
                className={`menu-detalhes-item ${activeTab === 'updates' ? 'active' : ''}`}
                onClick={() => setActiveTab('updates')}
              >
                Atualizações (3)
              </li>
              <li
                className={`menu-detalhes-item ${activeTab === 'comments' ? 'active' : ''}`}
                onClick={() => setActiveTab('comments')}
              >
                Quem ajudou ({backerCount})
              </li>
            </ul>
          </div>

          {/* SECTION: ABOUT / STORY */}
          {activeTab === 'about' && (
            <div id="aboutSection" className="bg-white rounded-2xl p-6 border border-slate-200 shadow-sm mt-4">
              <div className="story-content">
                <section className="mb-6">
                  <div className="story-v2__rule">
                    <span className="story-v2__rule-line"></span>
                    <span className="story-v2__rule-icon">
                      <Heart className="w-3.5 h-3.5 text-[#24CA68]" />
                    </span>
                    <span className="story-v2__rule-line"></span>
                  </div>

                  <h3 className="story-v2__heading">
                    A generosidade de quem quase não aguenta andar, mas não desiste de trabalhar
                  </h3>

                  <p className="story-v2__lead">
                    Mesmo enfrentando os tremores do parkinsonismo e dificuldades severas para caminhar, ele sai às ruas todos os dias para vender seus docinhos.
                  </p>

                  <p className="text-slate-600 leading-relaxed mb-4">
                    Quando um rapaz se aproximou na rua perguntando se podia comprar uma paçoquinha para pagar depois, a resposta desse senhor surpreendeu. Sem hesitar, ele disse que não daria apenas uma, mas entregaria a sacola inteira. Mesmo precisando de cada venda para sobreviver, o primeiro impulso dele foi ajudar quem parecia precisar naquele momento.
                  </p>

                  <p className="text-slate-600 leading-relaxed mb-4">
                    A rotina nas ruas, porém, cobra um preço muito alto do seu corpo. Segundo o relato dele mesmo, está cada dia mais difícil continuar caminhando por causa do tremor constante provocado pelo parkinsonismo. Ele faz questão de repetir que não está pedindo esmola e que ninguém tem obrigação de ajudar, apenas pede uma força na compra dos seus doces.
                  </p>

                  <p className="text-slate-600 leading-relaxed">
                    Por trás da educação e da voz calma de quem agradece a Deus por tudo, existe uma urgência silenciosa. Ao pedir que divulgassem o seu contato na internet, ele desabafou que vive uma situação difícil que só Deus sabe. Esta campanha existe para garantir que ele tenha amparo, cuidado e descanso, sem precisar forçar o próprio corpo até o limite.
                  </p>
                </section>

                <section className="mb-6 pt-4 border-t border-slate-100">
                  <div className="story-v2__rule">
                    <span className="story-v2__rule-line"></span>
                    <span className="story-v2__rule-icon">
                      <ShieldCheck className="w-3.5 h-3.5 text-[#24CA68]" />
                    </span>
                    <span className="story-v2__rule-line"></span>
                  </div>

                  <h3 className="story-v2__heading">
                    Cuidados de saúde, sustento e descanso
                  </h3>

                  <p className="story-v2__lead mb-4">
                    Sua doação vai direto para aliviar o peso de quem trabalha com dor e dificuldade todos os dias.
                  </p>

                  <p className="font-semibold text-slate-800 mb-2">A ajuda será usada em:</p>
                  <ul className="story-v2__list">
                    <li>Apoio direto para as despesas urgentes de casa e alimentação diária</li>
                    <li>Custeio de medicamentos e cuidados necessários para lidar com os tremores</li>
                    <li>Fôlego financeiro para que ele não precise caminhar até a exaustão nas ruas</li>
                    <li>Segurança para enfrentar essa situação difícil com dignidade e amparo</li>
                    <li>Reposição das mercadorias para que ele trabalhe apenas quando tiver condições</li>
                  </ul>
                </section>

                <section className="text-center pt-4">
                  <div className="story-v2__rule">
                    <span className="story-v2__rule-line"></span>
                    <span className="story-v2__rule-icon">
                      <Sparkles className="w-3.5 h-3.5 text-[#24CA68]" />
                    </span>
                    <span className="story-v2__rule-line"></span>
                  </div>

                  <h3 className="story-v2__heading">
                    Fica do lado desse trabalhador
                  </h3>

                  <p className="story-v2__lead mb-6">
                    Qualquer valor faz diferença. Se não puder agora, compartilhe.
                  </p>

                  <button
                    type="button"
                    className="inline-story-cta"
                    onClick={handleOpenDonateModal}
                  >
                    ❤️ AJUDAR AGORA
                  </button>
                </section>
              </div>
            </div>
          )}

          {/* SECTION: UPDATES */}
          {activeTab === 'updates' && (
            <div id="campaignUpdatesSection" className="mt-4">
              <div className="flex items-baseline justify-between mb-4">
                <h2 className="text-xl font-bold text-slate-900">Atualizações da Campanha</h2>
                <span className="text-xs text-slate-400 font-medium">3 atualizações</span>
              </div>

              <div className="space-y-4">
                <div className="campaign-update-card">
                  <div className="campaign-update-meta">
                    <span className="campaign-update-date">8 de novembro de 2026</span>
                    <span className="campaign-update-tag">Atualização</span>
                  </div>
                  <h3 className="campaign-update-title">Cada doação alivia o peso das ruas</h3>
                  <p className="campaign-update-body">
                    A corrente do bem está crescendo para que ele possa cuidar da saúde e descansar das longas caminhadas.
                  </p>
                  <div className="mt-4 pt-3 border-t border-slate-100">
                    <button
                      type="button"
                      className="px-4 py-2 bg-[#24CA68] hover:bg-[#1fab58] text-white text-xs font-bold rounded-lg transition-colors inline-flex items-center gap-2"
                      onClick={handleOpenDonateModal}
                    >
                      Ajudar esta família agora <ChevronRight className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>

                <div className="campaign-update-card">
                  <div className="campaign-update-meta">
                    <span className="campaign-update-date">8 de novembro de 2026</span>
                    <span className="campaign-update-tag">Atualização</span>
                  </div>
                  <h3 className="campaign-update-title">A história dele emocionou muita gente</h3>
                  <p className="campaign-update-body">
                    O gesto de oferecer a sacola inteira de paçoquinhas tocou milhares de corações pela internet.
                  </p>
                  <div className="mt-4 pt-3 border-t border-slate-100">
                    <button
                      type="button"
                      className="px-4 py-2 bg-[#24CA68] hover:bg-[#1fab58] text-white text-xs font-bold rounded-lg transition-colors inline-flex items-center gap-2"
                      onClick={handleOpenDonateModal}
                    >
                      Ajudar esta família agora <ChevronRight className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>

                <div className="campaign-update-card">
                  <div className="campaign-update-meta">
                    <span className="campaign-update-date">8 de novembro de 2026</span>
                    <span className="campaign-update-tag">Atualização</span>
                  </div>
                  <h3 className="campaign-update-title">Campanha iniciada</h3>
                  <p className="campaign-update-body">
                    Unimos forças para espalhar o pedido de ajuda desse senhor pelo Brasil inteiro.
                  </p>
                  <div className="mt-4 pt-3 border-t border-slate-100">
                    <button
                      type="button"
                      className="px-4 py-2 bg-[#24CA68] hover:bg-[#1fab58] text-white text-xs font-bold rounded-lg transition-colors inline-flex items-center gap-2"
                      onClick={handleOpenDonateModal}
                    >
                      Ajudar esta família agora <ChevronRight className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* SECTION: COMMENTS / QUEM AJUDOU */}
          {(activeTab === 'comments' || activeTab === 'about') && (
            <div id="comentariosSection" className="mt-6">
              <div className="people-saying-box">
                <div className="flex flex-col items-center text-center mb-4">
                  {/* Avatar stack */}
                  <div className="flex -space-x-2 overflow-hidden mb-3">
                    <img className="inline-block h-8 w-8 rounded-full ring-2 ring-white" src="/assets/aistudio/avs_6ac13d13.svg" alt="Apoiador" />
                    <img className="inline-block h-8 w-8 rounded-full ring-2 ring-white object-cover" src="/assets/aistudio/banner-4007_5c1e194b.webp" alt="Apoiador" />
                    <img className="inline-block h-8 w-8 rounded-full ring-2 ring-white" src="/assets/aistudio/imm_71b7e7c6.svg" alt="Apoiador" />
                    <img className="inline-block h-8 w-8 rounded-full ring-2 ring-white object-cover" src="/assets/aistudio/kc_df5bf926.webp" alt="Apoiador" />
                    <img className="inline-block h-8 w-8 rounded-full ring-2 ring-white object-cover" src="/assets/aistudio/lo_07b9845d.webp" alt="Apoiador" />
                    <div className="inline-flex h-8 w-8 rounded-full ring-2 ring-white bg-slate-100 items-center justify-center text-xs font-bold text-slate-700">
                      +
                    </div>
                  </div>

                  <h4 className="people-saying-title border-none pb-0">
                    <span className="text-[#24CA68] font-bold">{backerCount}</span> pessoas já apoiaram esta família
                  </h4>
                </div>

                <div className="divide-y divide-slate-100">
                  {comments.map((comment) => (
                    <div key={comment.id} className="comentario py-3">
                      <div className="flex items-start gap-3">
                        <div
                          className="w-9 h-9 rounded-full flex items-center justify-center font-bold text-xs shrink-0"
                          style={{ backgroundColor: comment.bgColor, color: comment.textColor }}
                        >
                          {comment.initials}
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="flex flex-wrap items-center gap-2 mb-1">
                            <h3 className="font-semibold text-sm text-slate-900">{comment.name}</h3>
                            <span className="text-xs text-slate-400 font-medium">
                              {comment.isLive ? (
                                <span className="inline-flex items-center gap-1 text-[#24CA68]">
                                  <span className="w-1.5 h-1.5 rounded-full bg-[#24CA68] animate-pulse"></span>
                                  {comment.time}
                                </span>
                              ) : (
                                comment.time
                              )}
                            </span>
                            <span className="donation-badge">R${comment.amount}</span>
                          </div>
                          <p className="text-sm text-slate-600 leading-relaxed">{comment.text}</p>
                          <div className="mt-2 flex items-center gap-3">
                            <button
                              type="button"
                              onClick={() => toggleLike(comment.id)}
                              className={`text-xs font-medium inline-flex items-center gap-1 py-1 px-2 rounded hover:bg-slate-50 transition-colors ${
                                comment.isLiked ? 'text-[#1fab58]' : 'text-slate-500'
                              }`}
                            >
                              <ThumbsUp className={`w-3.5 h-3.5 ${comment.isLiked ? 'fill-[#1fab58]' : ''}`} />
                              <span>{comment.likes}</span> Curtir
                            </button>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>

                <div className="mt-4 pt-4 border-t border-slate-100 text-center">
                  <p className="text-xs text-slate-400 italic">
                    Faça uma doação para deixar sua mensagem de carinho e apoio!
                  </p>
                </div>
              </div>
            </div>
          )}
        </div>
      </main>

      {/* FIXED BOTTOM CTA BAR */}
      <div id="fixed-mobile">
        <button
          type="button"
          className="btn-ajudar"
          onClick={handleOpenDonateModal}
        >
          ❤️ AJUDAR AGORA
        </button>
      </div>

      {/* FOOTER */}
      <footer className="site-footer">
        <div className="site-footer__container">
          <div className="site-footer__top">
            <div className="site-footer__col">
              <h4>PLATAFORMA</h4>
              <ul>
                <li><a href="#topo">Sobre nós</a></li>
                <li><a href="#topo">Campanhas</a></li>
                <li><a href="#topo">Criar campanha</a></li>
                <li><a href="#topo">Entrar</a></li>
              </ul>
            </div>
            <div className="site-footer__col">
              <h4>SUPORTE</h4>
              <ul>
                <li><a href="#topo">FAQ</a></li>
                <li><a href="#topo">Taxas e prazos</a></li>
                <li><a href="#topo">Segurança e transparência</a></li>
                <li><a href="#topo">Consultar recibo</a></li>
              </ul>
            </div>
            <div className="site-footer__col">
              <h4>LEGAL</h4>
              <ul>
                <li><a href="#topo">Política de privacidade</a></li>
                <li><a href="#topo">Termos de uso</a></li>
                <li><a href="#topo">Campanhas mais amadas</a></li>
                <li><a href="#topo">Loja de corações</a></li>
              </ul>
            </div>
          </div>

          <div className="site-footer__divider" />

          {/* Social Icons row */}
          <div className="site-footer__social">
            <a href="#topo" aria-label="Instagram" className="site-footer__social-btn">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <rect x="2" y="2" width="20" height="20" rx="5" ry="5"></rect>
                <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"></path>
                <line x1="17.5" y1="6.5" x2="17.51" y2="6.5"></line>
              </svg>
            </a>
            <a href="#topo" aria-label="Facebook" className="site-footer__social-btn">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
                <path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z"></path>
              </svg>
            </a>
            <a href="#topo" aria-label="YouTube" className="site-footer__social-btn">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
                <path d="M22.54 6.42a2.78 2.78 0 0 0-1.94-2C18.88 4 12 4 12 4s-6.88 0-8.6.46a2.78 2.78 0 0 0-1.94 2A29 29 0 0 0 1 11.75a29 29 0 0 0 .46 5.33A2.78 2.78 0 0 0 3.4 19c1.72.46 8.6.46 8.6.46s6.88 0 8.6-.46a2.78 2.78 0 0 0 1.94-2 29 29 0 0 0 .46-5.25 29 29 0 0 0-.46-5.33z"></path>
                <polygon points="9.75 15.02 15.5 11.75 9.75 8.48 9.75 15.02" fill="#1b2432"></polygon>
              </svg>
            </a>
          </div>

          <div className="site-footer__bottom">
            <p>© 2026 · Todos os direitos reservados</p>
          </div>
        </div>
      </footer>

      {/* DONATION MODAL */}
      {isDonateModalOpen && (
        <div className="modal-overlay" onClick={() => setIsDonateModalOpen(false)}>
          <div className="modal-box" onClick={(e) => e.stopPropagation()}>
            <button
              type="button"
              className="absolute top-4 right-4 w-8 h-8 rounded-full bg-slate-100 text-slate-500 flex items-center justify-center hover:bg-slate-200 transition-colors"
              onClick={() => setIsDonateModalOpen(false)}
            >
              <X className="w-4 h-4" />
            </button>

            {!isCustomAmountStep ? (
              <>
                <div className="text-center mb-4">
                  <h3 className="text-xl font-bold text-slate-900 mb-1">
                    Quanto você consegue hoje? 🧡
                  </h3>
                  <span className="text-[11px] font-bold text-slate-400 tracking-wider uppercase">
                    CADA VALOR AJUDA ESTA FAMÍLIA
                  </span>
                </div>

                <div className="donation-option-grid">
                  {[30, 50, 70].map((amt) => (
                    <button
                      key={amt}
                      type="button"
                      className="donation-btn"
                      onClick={() => handleSelectAmount(amt)}
                    >
                      R${amt}
                    </button>
                  ))}

                  <div className="relative">
                    <span className="popular-tag">❤️ MAIS ESCOLHIDO</span>
                    <button
                      type="button"
                      className="donation-btn highlight pt-4"
                      onClick={() => handleSelectAmount(100)}
                    >
                      R$100
                    </button>
                  </div>

                  {[150, 200, 300, 500, 700, 1000].map((amt) => (
                    <button
                      key={amt}
                      type="button"
                      className="donation-btn"
                      onClick={() => handleSelectAmount(amt)}
                    >
                      R${amt.toLocaleString('pt-BR')}
                    </button>
                  ))}
                </div>

                <button
                  type="button"
                  className="w-full text-center text-xs text-slate-500 hover:text-slate-800 underline mt-4 py-2 font-medium"
                  onClick={() => setIsCustomAmountStep(true)}
                >
                  Digitar outro valor
                </button>

                <ul className="donate-impact-list">
                  <li><strong>R$30</strong> = um pouco do que falta agora</li>
                  <li><strong>R$50</strong> = parte do cuidado do dia</li>
                  <li><strong>R$70</strong> = transporte no dia</li>
                  <li><strong>R$100</strong> = um passo no tratamento</li>
                  <li><strong>R$150</strong> = mais um passo no cuidado</li>
                  <li><strong>R$200</strong> = apoio da semana</li>
                  <li><strong>R$300</strong> = parte do tratamento</li>
                  <li><strong>R$500</strong> = aproxima o cuidado desta família</li>
                </ul>
              </>
            ) : (
              <form onSubmit={handleCustomAmountSubmit} className="pt-2">
                <h3 className="text-xl font-bold text-slate-900 text-center mb-1">
                  Digite outro valor
                </h3>
                <p className="text-xs text-slate-500 text-center mb-4">
                  Insira o valor que deseja doar (mínimo R$ 5)
                </p>

                <div className="relative mb-4">
                  <span className="absolute left-4 top-1/2 -translate-y-1/2 font-bold text-lg text-[#24CA68]">
                    R$
                  </span>
                  <input
                    type="number"
                    min="5"
                    step="1"
                    placeholder="50"
                    value={customAmountValue}
                    onChange={(e) => setCustomAmountValue(e.target.value)}
                    className="w-full pl-12 pr-4 py-3 text-2xl font-bold text-slate-900 border-2 border-slate-200 rounded-xl focus:border-[#24CA68] focus:outline-none"
                    autoFocus
                  />
                </div>

                <button
                  type="submit"
                  className="w-full py-3.5 bg-[#24CA68] hover:bg-[#1fab58] text-white font-bold text-base rounded-xl transition-colors shadow-md"
                >
                  CONTINUAR PARA DOAR
                </button>

                <button
                  type="button"
                  className="w-full text-center text-xs text-slate-500 hover:text-slate-800 underline mt-3 py-1 font-medium"
                  onClick={() => setIsCustomAmountStep(false)}
                >
                  Voltar às opções de valores
                </button>
              </form>
            )}
          </div>
        </div>
      )}

      {/* CHECKOUT / PIX MODAL */}
      {isCheckoutModalOpen && (
        <div className="modal-overlay" onClick={() => setIsCheckoutModalOpen(false)}>
          <div className="modal-box max-w-[500px]" onClick={(e) => e.stopPropagation()}>
            <button
              type="button"
              className="absolute top-4 right-4 w-8 h-8 rounded-full bg-slate-100 text-slate-500 flex items-center justify-center hover:bg-slate-200 transition-colors"
              onClick={() => setIsCheckoutModalOpen(false)}
            >
              <X className="w-4 h-4" />
            </button>

            {!pixPaid ? (
              <div className="text-center">
                <div className="inline-flex items-center gap-1.5 px-3 py-1 bg-emerald-50 text-emerald-700 rounded-full text-xs font-bold mb-3">
                  <ShieldCheck className="w-4 h-4 text-[#24CA68]" /> Pagamento Instantâneo PIX
                </div>

                <h3 className="text-xl font-extrabold text-slate-900 mb-1">
                  Contribuição de {formatCurrency(selectedAmount)}
                </h3>
                <p className="text-xs text-slate-500 mb-4">
                  Copie a chave PIX abaixo ou escaneie o código QR com seu banco
                </p>

                {/* Simulated QR Code */}
                <div className="bg-white p-4 border border-slate-200 rounded-2xl w-48 h-48 mx-auto mb-4 flex flex-col items-center justify-center shadow-inner relative group">
                  <div className="w-40 h-40 bg-slate-900 p-2 rounded-lg flex items-center justify-center relative">
                    <QrCode className="w-32 h-32 text-white" />
                    <div className="absolute inset-0 flex items-center justify-center">
                      <div className="w-8 h-8 bg-[#24CA68] rounded-full flex items-center justify-center text-white font-bold text-xs ring-4 ring-slate-900">
                        PIX
                      </div>
                    </div>
                  </div>
                </div>

                {/* PIX Copy Button */}
                <button
                  type="button"
                  onClick={handleCopyPix}
                  className={`w-full py-4 rounded-xl font-extrabold text-base transition-all flex items-center justify-center gap-2 uppercase tracking-wide shadow-md ${
                    pixCopied
                      ? 'bg-emerald-700 text-white'
                      : 'bg-[#24CA68] hover:bg-[#1fab58] text-white'
                  }`}
                >
                  {pixCopied ? (
                    <>
                      <Check className="w-5 h-5" /> CÓDIGO PIX COPIADO!
                    </>
                  ) : (
                    <>
                      <Copy className="w-5 h-5" /> COPIAR CÓDIGO PIX
                    </>
                  )}
                </button>

                <div className="mt-3 flex items-center justify-between text-xs text-slate-500 bg-slate-50 p-3 rounded-lg border border-slate-100">
                  <span className="flex items-center gap-1.5 font-medium">
                    <span className="w-2 h-2 rounded-full bg-amber-500 animate-ping"></span>
                    Aguardando confirmação
                  </span>
                  <span className="font-mono font-bold text-slate-700">
                    Expira em {formatTimer(pixTimer)}
                  </span>
                </div>

                {/* Simulated Payment Trigger for Demo / Interactive user */}
                <div className="mt-6 pt-4 border-t border-slate-100">
                  <button
                    type="button"
                    onClick={handleSimulatePixSuccess}
                    className="w-full py-2.5 bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs rounded-lg transition-colors flex items-center justify-center gap-1.5"
                  >
                    <CheckCircle2 className="w-4 h-4 text-[#24CA68]" /> Simular Pagamento Confirmado (Testar Doação)
                  </button>
                </div>
              </div>
            ) : (
              <div className="text-center py-2">
                <div className="w-14 h-14 bg-emerald-100 text-[#24CA68] rounded-full flex items-center justify-center mx-auto mb-3 shadow-inner">
                  <CheckCircle2 className="w-8 h-8" />
                </div>

                <h3 className="text-2xl font-extrabold text-slate-900 mb-1">
                  Doação Confirmada! 🎉
                </h3>
                <p className="text-sm text-slate-600 mb-4">
                  Muito obrigado por apoiar com <strong>{formatCurrency(selectedAmount)}</strong>. Sua generosidade ajuda este senhor a ter tratamento e descanso.
                </p>

                <form onSubmit={handleAddComment} className="bg-slate-50 p-4 rounded-xl border border-slate-200 text-left space-y-3">
                  <h4 className="font-bold text-xs text-slate-800 uppercase tracking-wider">
                    Deixe sua mensagem no mural de apoio
                  </h4>

                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1">
                      Seu Nome
                    </label>
                    <input
                      type="text"
                      placeholder="Ex: Maria Silva"
                      required
                      value={donorNameInput}
                      onChange={(e) => setDonorNameInput(e.target.value)}
                      className="w-full px-3 py-2 text-sm border border-slate-300 rounded-lg focus:outline-none focus:border-[#24CA68]"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1">
                      Mensagem de carinho
                    </label>
                    <textarea
                      rows={2}
                      placeholder="Deixe uma palavra de força e esperança..."
                      value={donorCommentInput}
                      onChange={(e) => setDonorCommentInput(e.target.value)}
                      className="w-full px-3 py-2 text-sm border border-slate-300 rounded-lg focus:outline-none focus:border-[#24CA68]"
                    />
                  </div>

                  <button
                    type="submit"
                    className="w-full py-3 bg-[#24CA68] hover:bg-[#1fab58] text-white font-bold text-sm rounded-lg transition-colors shadow-sm"
                  >
                    PUBLICAR MENSAGEM NO MURAL
                  </button>
                </form>
              </div>
            )}
          </div>
        </div>
      )}

      {/* EXIT INTENT POPUP */}
      {isExitPopupOpen && (
        <div className="modal-overlay" onClick={() => setIsExitPopupOpen(false)}>
          <div className="exit-popup-card" onClick={(e) => e.stopPropagation()}>
            <button
              type="button"
              className="absolute top-4 right-4 w-8 h-8 rounded-full bg-slate-100 text-slate-500 flex items-center justify-center hover:bg-slate-200 transition-colors"
              onClick={() => setIsExitPopupOpen(false)}
            >
              <X className="w-4 h-4" />
            </button>

            <span className="exit-urgency-tag">⏰ SUA AJUDA É URGENTE</span>

            <div className="w-24 h-24 rounded-full overflow-hidden border-4 border-white shadow-md mx-auto mb-3">
              <img
                src="/assets/aistudio/banner-4007_5c1e194b.webp"
                alt="Campanha"
                className="w-full h-full object-cover"
              />
            </div>

            <h2 className="text-xl font-extrabold text-slate-900 mb-2">
              Não saia sem ajudar este senhor
            </h2>

            <p className="text-sm text-slate-600 mb-4 leading-relaxed">
              Antes de sair, lembra: ele ofereceu a sacola inteira mesmo quase sem conseguir andar. Entra e ajuda.
            </p>

            <div className="grid grid-cols-2 gap-2 mb-3">
              {[20, 50, 70, 100].map((amt) => (
                <button
                  key={amt}
                  type="button"
                  className="py-2.5 bg-white border-2 border-[#24CA68] text-[#24CA68] font-bold text-base rounded-xl hover:bg-emerald-50 transition-colors"
                  onClick={() => handleSelectAmount(amt)}
                >
                  R${amt}
                </button>
              ))}
            </div>

            <button
              type="button"
              className="text-xs text-slate-400 hover:text-slate-600 underline font-medium"
              onClick={() => {
                setIsExitPopupOpen(false);
                handleOpenDonateModal();
              }}
            >
              Escolher outro valor
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
