import React, { useState, useEffect, useRef } from 'react';
import { 
  Instagram, ExternalLink, 
  ChevronRight, Play, Pause
} from 'lucide-react';

export default function XtravaganzaPreview() {
  const [isPlaying, setIsPlaying] = useState(true);
  const [rotationAngle, setRotationAngle] = useState(0);
  const [lightIntensity, setLightIntensity] = useState(0);
  const [currentBackground, setCurrentBackground] = useState(1);
  const animationRef = useRef(null);
  const videoRef = useRef(null);
  const audioRef = useRef(null);

  // Animation de rotation pour le disque DJ
  useEffect(() => {
    let lastTimestamp = 0;
    const rotate = (timestamp) => {
      if (!lastTimestamp) lastTimestamp = timestamp;
      const delta = timestamp - lastTimestamp;
      setRotationAngle(prev => (prev + (delta * 0.05)) % 360);
      lastTimestamp = timestamp;
      animationRef.current = requestAnimationFrame(rotate);
    };
    
    if (isPlaying) {
      animationRef.current = requestAnimationFrame(rotate);
    }
    
    return () => {
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
    };
  }, [isPlaying]);

  // Animation des lumières pulsantes
  useEffect(() => {
    const interval = setInterval(() => {
      setLightIntensity(prev => (prev + 0.1) % (Math.PI * 2));
    }, 100);
    return () => clearInterval(interval);
  }, []);

  // Alternance automatique des images toutes les 5 secondes
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentBackground(prev => prev === 1 ? 2 : 1);
    }, 5000);
    return () => clearInterval(interval);
  }, []);

  const toggleRotation = () => {
    setIsPlaying(!isPlaying);
  };

  // ==================== META PIXEL TRACKING ====================
  // Fonction pour tracker les événements Meta Pixel
  const trackEvent = (eventName, params = {}) => {
    if (typeof window.fbq !== 'undefined') {
      window.fbq('track', eventName, params);
      console.log(`✅ Meta Pixel - ${eventName}:`, params);
    } else {
      console.warn('⚠️ Meta Pixel non chargé');
    }
  };

  // Fonction d'ouverture des liens avec tracking
  const openLink = (url, eventName = null, eventParams = {}) => {
    // Tracker l'événement si spécifié
    if (eventName) {
      trackEvent(eventName, eventParams);
    }
    
    // Ouvrir le lien
    window.open(url, '_blank', 'noopener,noreferrer');
  };

  // Trackers spécifiques pour les différentes actions
  const handleTicketClick = (ticketType, url) => {
    trackEvent('AddToCart', {
      content_name: ticketType,
      content_category: 'Billetterie',
      currency: 'MAD',
      value: 250
    });
    window.open(url, '_blank', 'noopener,noreferrer');
  };

  const handleQuizClick = (url) => {
    trackEvent('Lead', {
      content_name: 'Quiz XTRAVAGANZA',
      content_category: 'Quiz',
      content_type: 'tribe_discovery'
    });
    window.open(url, '_blank', 'noopener,noreferrer');
  };

  const handleSocialClick = (platform, url) => {
    trackEvent('Contact', {
      content_name: platform,
      content_category: 'Social Media'
    });
    window.open(url, '_blank', 'noopener,noreferrer');
  };

  const handleLineupClick = (url) => {
    trackEvent('ViewContent', {
      content_name: 'Line-up & Programme',
      content_category: 'Programmation'
    });
    window.open(url, '_blank', 'noopener,noreferrer');
  };

  const handleExperiencesClick = (url) => {
    trackEvent('ViewContent', {
      content_name: 'Nos Expériences',
      content_category: 'Expériences'
    });
    window.open(url, '_blank', 'noopener,noreferrer');
  };
  // ==================== FIN META PIXEL ====================

  // Calcul des couleurs dynamiques pour les effets de lumière
  const getLightColor = (offset) => {
    const hue = (lightIntensity * 50 + offset) % 360;
    return `hsla(${hue}, 100%, 60%, 0.15)`;
  };

  const getSpotColor = (offset) => {
    const hue = (lightIntensity * 80 + offset) % 360;
    return `hsla(${hue}, 100%, 65%, 0.25)`;
  };

  return (
    <div className="flex items-center justify-center bg-black p-4 font-sans antialiased text-white min-h-screen relative">
      
      {/* ÉLÉMENT AUDIO AVEC MUSIQUE DE FESTIVAL */}
      <audio 
        ref={audioRef}
        loop
        autoPlay
        className="hidden"
      >
        <source src="https://cdn.pixabay.com/download/audio/2022/05/27/audio_1c3f2c0e8a.mp3?filename=electronic-dance-117401.mp3" type="audio/mpeg" />
      </audio>
      
      {/* BACKGROUND AVEC IMAGES DE FESTIVALIERS - ALTERNANCE AUTOMATIQUE */}
      <div className="fixed inset-0 z-0 overflow-hidden">
        <div className="absolute inset-0 transition-all duration-1000 ease-in-out">
          <img 
            src={currentBackground === 1 ? "/xtravaganza-back1.jpg" : "/xtravaganza-back2.jpg"}
            alt="Festival crowd"
            className="absolute top-0 left-0 w-full h-full object-cover animate-scalePulse"
            style={{ 
              filter: 'brightness(0.65) contrast(1.2) saturate(1.1)',
              animation: 'scalePulse 20s ease-in-out infinite alternate'
            }}
          />
        </div>
        
        <div className="absolute inset-0 bg-gradient-to-b from-purple-900/30 via-black/40 to-black/70"></div>
        
        <div 
          className="absolute inset-0"
          style={{
            background: `radial-gradient(circle at 20% 40%, ${getLightColor(0)} 0%, transparent 50%),
                        radial-gradient(circle at 80% 60%, ${getLightColor(120)} 0%, transparent 50%),
                        radial-gradient(circle at 40% 80%, ${getLightColor(240)} 0%, transparent 50%),
                        radial-gradient(circle at 60% 20%, ${getLightColor(60)} 0%, transparent 50%)`,
            animation: 'pulseLight 2s ease-in-out infinite'
          }}
        />
        
        <div 
          className="absolute inset-0"
          style={{
            background: `radial-gradient(ellipse at ${30 + Math.sin(lightIntensity) * 10}% ${40 + Math.cos(lightIntensity * 0.8) * 10}%, ${getSpotColor(0)} 0%, transparent 40%),
                        radial-gradient(ellipse at ${70 + Math.cos(lightIntensity * 0.6) * 10}% ${60 + Math.sin(lightIntensity) * 10}%, ${getSpotColor(180)} 0%, transparent 40%)`,
          }}
        />
        
        <div className="absolute inset-0 overflow-hidden">
          <div 
            className="absolute top-0 left-1/4 w-32 h-full bg-gradient-to-r from-transparent via-purple-500/20 to-transparent"
            style={{
              transform: `rotate(${lightIntensity * 30}deg) translateX(${Math.sin(lightIntensity) * 50}px)`,
              animation: 'moveLight 4s linear infinite'
            }}
          />
          <div 
            className="absolute top-0 right-1/4 w-32 h-full bg-gradient-to-r from-transparent via-pink-500/20 to-transparent"
            style={{
              transform: `rotate(${-lightIntensity * 30}deg) translateX(${Math.cos(lightIntensity) * 50}px)`,
              animation: 'moveLight 3s linear infinite reverse'
            }}
          />
        </div>
        
        <div className="absolute inset-0">
          {[...Array(20)].map((_, i) => (
            <div
              key={i}
              className="absolute w-1 h-1 rounded-full bg-white/40"
              style={{
                left: `${(i * 37) % 100}%`,
                top: `${(lightIntensity * 50 + i * 30) % 100}%`,
                animation: `particleFloat ${2 + i % 3}s ease-in-out infinite`,
                opacity: 0.3 + Math.sin(lightIntensity + i) * 0.3,
                boxShadow: `0 0 ${4 + (i % 4)}px ${getSpotColor(i * 45)}`
              }}
            />
          ))}
        </div>
      </div>
      
      {/* Container principal */}
      <div className="w-full max-w-md bg-black/30 backdrop-blur-xl rounded-3xl shadow-2xl relative border border-white/20 overflow-hidden flex flex-col h-[780px] z-10">
        
        <div className="overflow-y-auto flex-1 w-full pb-8 hide-scrollbar">
          
          {/* ESPACE POUR LE LOGO EN HAUT */}
          <div className="pt-8 pb-2 px-6 text-center relative">
            <div className="absolute inset-0 pointer-events-none">
              <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-48 h-48 bg-gradient-to-r from-orange-500/20 via-pink-500/20 to-purple-500/20 rounded-full blur-3xl animate-pulse"></div>
            </div>
            
            {/* LOGO XTRAVAGANZA */}
            <div className="flex justify-center mb-6 relative">
              <img 
                src="/Artboard 2 copy 2.png" 
                alt="Xtravaganza Logo"
                className="w-32 h-auto object-contain drop-shadow-2xl"
              />
            </div>
            
            {/* CADRE DATE & LIEU - TEXTE 5 & 6 JUIN 2026 EN BLANC */}
            <div className="inline-flex flex-col gap-2 bg-black/50 backdrop-blur-md border border-white/20 rounded-xl p-3 shadow-xl mt-9 w-full">
              <div className="flex items-center justify-center gap-2 text-sm font-semibold text-white tracking-wide">
                <span>  À Radisson Blu Taghazout Bay</span>
              </div>
              <div className="h-px w-full bg-white/20"></div>
              <div className="flex flex-col items-center text-xs text-gray-200">
                <span className="font-bold flex items-center gap-1.5 text-[13px]">
                  <span></span>  <span>Le 5 & 6 JUIN 2026</span>
                </span>
                <span className="text-[10px] text-pink-200 mt-1 tracking-wider uppercase font-bold">
                 
                </span>
              </div>
            </div>
          </div>

          {/* Profile Avatar */}
          <div className="relative -mt-5 mb-6 z-20 shrink-0 flex justify-center">
            <div className="w-16 h-16 rounded-full border-2 border-purple-400/50 bg-gradient-to-br from-purple-600 via-pink-500 to-purple-700 flex items-center justify-center shadow-2xl shadow-purple-500/30">
              <div className="text-xl font-bold text-white drop-shadow-lg">X</div>
            </div>
          </div>

          {/* Socials Row - AVEC TRACKING */}
          <div className="flex justify-center gap-5 mb-6 px-4">
             <div 
               onClick={() => handleSocialClick('Instagram', 'https://www.instagram.com/xtravaganza.festival?igsh=dGE4a3pvNXUxOXNs')}
               className="w-9 h-9 rounded-full bg-white/10 backdrop-blur-md border border-white/20 flex items-center justify-center hover:bg-purple-500 transition-all hover:scale-110 cursor-pointer shadow-lg hover:shadow-purple-500/50"
             >
               <Instagram size={18} className="text-white" />
             </div>
             
             <div 
               onClick={() => handleSocialClick('TikTok', 'https://www.tiktok.com/@xtravaganza2026?_r=1&_t=ZS-95EVNripO7x')}
               className="w-9 h-9 rounded-full bg-white/10 backdrop-blur-md border border-white/20 flex items-center justify-center hover:bg-purple-500 transition-all hover:scale-110 cursor-pointer shadow-lg hover:shadow-purple-500/50"
             >
               <svg width="18" height="18" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                 <path d="M19.59 6.69a4.83 4.83 0 0 1-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 0 1-5.2 1.74 2.89 2.89 0 0 1 2.31-4.64 2.93 2.93 0 0 1 1.1.21V9.12a7.84 7.84 0 0 0-5.69 2.85 7.84 7.84 0 0 0 3.18 12.03 7.84 7.84 0 0 0 8.36-2.02 7.84 7.84 0 0 0 2.41-5.7V9.6a9.35 9.35 0 0 0 5.48 1.77V7.99a5.78 5.78 0 0 1-3.45-1.3z" fill="white"/>
               </svg>
             </div>
             
             <div 
               onClick={() => handleSocialClick('Threads', 'https://www.threads.com/@xtravaganza.festival?xmt=AQF0QgyMURx4Zqq4BWhXGILpj3nZ6_rDXzhvnGU1Qdw0wCc')}
               className="w-9 h-9 rounded-full bg-white/10 backdrop-blur-md border border-white/20 flex items-center justify-center hover:bg-purple-500 transition-all hover:scale-110 cursor-pointer shadow-lg hover:shadow-purple-500/50"
             >
               <img 
                 src="/images-removebg-preview.png" 
                 alt="Threads"
                 className="w-9 h-10 object-contain"
               />
             </div>
          </div>

          {/* Main Content */}
          <div className="w-full px-5 flex flex-col gap-3 pb-6">
             
             {/* BILLETTERIE & HÉBERGEMENTS - AVEC TRACKING AddToCart */}
             <div className="w-full p-3 rounded-xl bg-white/5 backdrop-blur-md border border-white/10 hover:border-purple-500/50 transition-all">
                <div className="flex items-center gap-2 mb-2 text-purple-400 font-black uppercase text-[10px] tracking-widest">
                   🎟️ ACHETEZ VOS TICKETS & HÉBERGEMENTS
                </div>
                <div className="flex flex-col gap-1.5">
                   <div 
                     onClick={() => handleTicketClick('Tidar.ma', 'https://buy.tidar.ma/event/xtravaganza')}
                     className="w-full py-2 px-3 rounded-lg bg-white/5 hover:bg-white/10 border border-white/10 flex items-center justify-between cursor-pointer group"
                   >
                      <span className="font-medium text-xs">Disponible sur Tidar.ma</span>
                      <ExternalLink size={12} className="text-gray-500 group-hover:text-purple-400" />
                   </div>
                   <div 
                     onClick={() => handleTicketClick('Ticket.ma', 'https://www.ticket.ma/ticket/xtravaganza?utm_source=ig&utm_medium=social&utm_content=link_in_bio&fbclid=PAZnRzaAQ8txJleHRuA2FlbQIxMQBzcnRjBmFwcF9pZA8xMjQwMjQ1NzQyODc0MTQAAadUcnKwuuA0nE0ZzGGQyPs6fpmUS7F9TBDeW1fumBsgPyvl77ZdacXcXkXmsQ_aem_BPWr9W6zHwEyY1c8O4tJLA')}
                     className="w-full py-2 px-3 rounded-lg bg-white/5 hover:bg-white/10 border border-white/10 flex items-center justify-between cursor-pointer group"
                   >
                      <span className="font-medium text-xs">Disponible sur Ticket.ma</span>
                      <ExternalLink size={12} className="text-gray-500 group-hover:text-purple-400" />
                   </div>
                   <div 
                     onClick={() => handleTicketClick('Shotgun.live', 'https://shotgun.live/fr/venues/xtravaganza?utm_source=ig&utm_medium=social&utm_content=link_in_bio&fbclid=PAZnRzaAQ8tyJleHRuA2FlbQIxMQBzcnRjBmFwcF9pZA8xMjQwMjQ1NzQyODc0MTQAAafMYzfp38SL5jy4wx9mrD5lbNL6efnPe9sRaVZPNCfiAGh-4x33kV6coNKWcg_aem_vlZqtzXnI9eAeGNLbDaJ5g')}
                     className="w-full py-2 px-3 rounded-lg bg-gradient-to-r from-purple-600 to-pink-600 hover:opacity-90 flex items-center justify-between cursor-pointer"
                   >
                      <span className="font-bold text-xs text-white">Disponible sur Shotgun.live</span>
                      <ExternalLink size={12} className="text-white" />
                   </div>
                   {/* Drapeau européen */}
                   <div 
                     onClick={() => handleTicketClick('Eventbrite.es', 'https://www.eventbrite.es/e/xtravaganza-tickets-1980773139782?aff=ebdssbdestsearch')}
                     className="w-full py-2 px-3 rounded-lg bg-white/5 hover:bg-white/10 border border-white/10 flex items-center justify-between cursor-pointer group"
                   >
                      <span className="font-medium text-xs flex items-center gap-1.5">
                        Disponible sur Eventbrite.es
                         <img src="/eu-flag-removebg-preview.png" alt="EU" className="w-4 h-6 object-contain" />
                      </span>
                      <ExternalLink size={12} className="text-gray-500 group-hover:text-purple-400" />
                   </div>
                   <div className="border-t border-white/10 my-1"></div>
                  
                </div>
             </div>

             {/* QUIZ DE TRIBU - AVEC TRACKING Lead */}
             <div 
               onClick={() => handleQuizClick('https://quizz.xtravaganza-festival.com/')}
               className="w-full p-3 rounded-xl bg-white/5 backdrop-blur-md border border-purple-500/30 cursor-pointer hover:scale-[1.02] transition-all hover:shadow-lg hover:shadow-purple-500/30"
             >
                <div className="flex items-center justify-between">
                   <div className="flex items-center gap-3">
                      <div className="text-xl animate-pulse">🧿</div>
                      <div>
                         <div className="font-bold text-sm">QUIZ DE TRIBU</div>
                         <div className="text-[10px] text-purple-400">Découvre ton ADN XTRAVAGANZA</div>
                      </div>
                   </div>
                   <ChevronRight size={16} className="text-purple-400" />
                </div>
             </div>

             {/* LINE-UP & PROGRAMME - AVEC TRACKING ViewContent */}
             <div 
               onClick={() => handleLineupClick('https://www.instagram.com/p/DWo9XXkDu1e/?igsh=dnVjYXU3MTdnd20w')}
               className="w-full p-3 rounded-xl bg-white/5 backdrop-blur-md border border-white/10 cursor-pointer hover:bg-white/10 transition-all"
             >
                <div className="flex items-center justify-between">
                   <div className="flex items-center gap-3">
                      <div className="w-7 h-7 rounded-full bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center text-sm animate-pulse">🎧</div>
                      <div>
                         <div className="font-bold text-sm">LINE-UP & PROGRAMME</div>
                         <div className="text-[10px] text-purple-400">Découvre la programmation sur Instagram</div>
                      </div>
                   </div>
                   <ChevronRight size={14} className="text-gray-500" />
                </div>
             </div>

             {/* NOS EXPÉRIENCES - AVEC TRACKING ViewContent */}
             <div 
               onClick={() => handleExperiencesClick('https://www.instagram.com/p/DVwaNw_jiZA/?igsh=am5lYjhjMXQ4aWUz')}
               className="w-full p-3 rounded-xl bg-white/5 backdrop-blur-md border border-white/10 cursor-pointer hover:bg-white/10 transition-all group"
             >
                <div className="flex items-center justify-between">
                   <div className="flex items-center gap-3">
                      <div className="w-7 h-7 rounded-full bg-gradient-to-br from-blue-500 to-purple-500 flex items-center justify-center text-sm animate-pulse group-hover:scale-110 transition-transform">🎪</div>
                      <div>
                         <div className="font-bold text-sm">NOS EXPÉRIENCES</div>
                         <div className="text-[10px] text-purple-400">Découvre nos expériences sur Instagram </div>
                      </div>
                   </div>
                   <ExternalLink size={14} className="text-gray-500 group-hover:text-purple-400 transition-colors" />
                </div>
             </div>

             {/* ABOUT - AVEC PAPILLON APRÈS LE POINT */}
             <div className="mt-1 p-3 rounded-xl bg-black/40 backdrop-blur-md border border-white/10">
                <h3 className="font-bold uppercase text-[10px] tracking-widest text-purple-400 mb-2">À PROPOS DU FESTIVAL</h3>
                <p className="text-gray-300 text-[10px] leading-relaxed text-justify">
                   Préparez-vous à vivre une expérience inédite ! <strong className="text-transparent bg-clip-text bg-gradient-to-r from-orange-400 to-pink-400">XTRAVAGANZA</strong> investit la magnifique baie de Taghazout (Agadir) les 5 et 6 juin 2026.
                   <br/><br/>
                   Niché dans un lieu événementiel à ciel ouvert <em className="text-orange-300">(open-air beachfront venue)</em> les pieds dans l'eau, venez vibrer au rythme de notre programmation internationale face à l'océan Atlantique. Laissez-vous emporter par la magie de la côte marocaine, entre musique, sunsets inoubliables et rencontres passionnées.
                   <img 
                     src="/butterflie1.png" 
                     alt="butterfly"
                     className="inline-block w-4 h-4 object-contain ml-1 align-middle animate-float"
                   />
                </p>
             </div>

             {/* Footer */}
             <div className="text-center mt-3 pt-2 border-t border-white/10">
                <div className="text-[9px] tracking-widest text-white/40">XTRAVAGANZA FESTIVAL 2026 • TAGHAZOUT BAY 🇲🇦</div>
             </div>

          </div>
        </div>

      </div>

      <style>{`
        .hide-scrollbar::-webkit-scrollbar {
          width: 0px;
          background: transparent;
        }
        
        @keyframes pulseLight {
          0%, 100% { opacity: 0.6; }
          50% { opacity: 1; }
        }
        
        @keyframes moveLight {
          0% { transform: translateX(-100%) rotate(0deg); }
          100% { transform: translateX(200%) rotate(360deg); }
        }
        
        @keyframes moveFloor {
          0% { background-position: 0 0; }
          100% { background-position: 100px 0; }
        }
        
        @keyframes particleFloat {
          0%, 100% { transform: translateY(0px) translateX(0px); opacity: 0.3; }
          50% { transform: translateY(-30px) translateX(10px); opacity: 0.8; }
        }
        
        @keyframes scalePulse {
          0% {
            transform: scale(1);
          }
          100% {
            transform: scale(1.05);
          }
        }
        
        .animate-scalePulse {
          animation: scalePulse 20s ease-in-out infinite alternate;
        }
        
        /* Animation pour le papillon */
        @keyframes float {
          0%, 100% {
            transform: translateY(0px) rotate(0deg);
          }
          50% {
            transform: translateY(-3px) rotate(5deg);
          }
        }
        
        .animate-float {
          animation: float 2s ease-in-out infinite;
        }
      `}</style>
    </div>
  );
}