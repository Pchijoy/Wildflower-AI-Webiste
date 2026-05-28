import React, { useState, useEffect, useRef } from 'react';

// Injects custom CSS transitions, smooth typography, and Framer entrance keyframes directly into the head element
const injectCustomStyles = () => {
  if (typeof document === 'undefined') return;
  const styleId = 'wildflower-premium-styles';
  if (document.getElementById(styleId)) return;

  const styleElement = document.createElement('style');
  styleElement.id = styleId;
  styleElement.innerHTML = `
    @import url('https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600&family=Space+Grotesk:wght@300;400;500;600;700;900&display=swap');
    
    body {
      font-family: 'Inter', sans-serif;
      cursor: none !important;
      background-color: #000000;
      color: #ffffff;
      overflow-x: hidden;
    }
    
    h1, h2, h3, h4, .font-display {
      font-family: 'Space Grotesk', sans-serif;
    }
    
    /* Disable default system cursors globally on interactive fields */
    a, button, input, select, textarea, [role="button"] {
      cursor: none !important;
    }

    /* Selection colors aligned with premium brand metrics */
    ::selection {
      background-color: #B4F8C8 !important;
      color: #000000 !important;
    }

    /* Custom scrollbar alignment */
    ::-webkit-scrollbar {
      width: 6px;
    }
    ::-webkit-scrollbar-track {
      background: #000000;
    }
    ::-webkit-scrollbar-thumb {
      background: #1c1c1e;
      border-radius: 99px;
    }
    ::-webkit-scrollbar-thumb:hover {
      background: #B4F8C8;
    }

    /* Framer entrance transition classes */
    .framer-slide-up {
      opacity: 0;
      transform: translateY(30px);
      transition: opacity 1.2s cubic-bezier(0.16, 1, 0.3, 1), transform 1.2s cubic-bezier(0.16, 1, 0.3, 1);
    }
    .framer-slide-up.visible {
      opacity: 1;
      transform: translateY(0);
    }

    /* Soft scale transitions */
    .hover-scale-img {
      transition: transform 0.8s cubic-bezier(0.16, 1, 0.3, 1), filter 0.8s cubic-bezier(0.16, 1, 0.3, 1);
    }
    .hover-scale-img:hover {
      transform: scale(1.025);
      filter: grayscale(0%);
    }
  `;
  document.head.appendChild(styleElement);
};

// Clean vector SVG templates inside react elements to secure high compatibility and zero build errors
const Icons = {
  ArrowRight: ({ className = "w-5 h-5" }) => (
    <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M14 5l7 7m0 0l-7 7m7-7H3" />
    </svg>
  ),
  ArrowUpRight: ({ className = "w-5 h-5" }) => (
    <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M7 17L17 7M17 7H7M17 7V17" />
    </svg>
  ),
  ChevronRight: ({ className = "w-5 h-5" }) => (
    <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 5l7 7-7 7" />
    </svg>
  ),
  Check: ({ className = "w-4 h-4" }) => (
    <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 13l4 4L19 7" />
    </svg>
  ),
  Menu: ({ className = "w-6 h-6" }) => (
    <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 6h16M4 12h16M4 18h16" />
    </svg>
  ),
  X: ({ className = "w-6 h-6" }) => (
    <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M6 18L18 6M6 6l12 12" />
    </svg>
  ),
  Sparkles: ({ className = "w-5 h-5" }) => (
    <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12l-5.714 2.143L13 21l-2.286-6.857L5 12l5.714-2.143L13 3z" />
    </svg>
  ),
  BookOpen: ({ className = "w-5 h-5" }) => (
    <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
    </svg>
  ),
  Layers: ({ className = "w-5 h-5" }) => (
    <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
    </svg>
  ),
  Video: ({ className = "w-5 h-5" }) => (
    <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z" />
    </svg>
  ),
  Clock: ({ className = "w-5 h-5" }) => (
    <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
    </svg>
  ),
  DollarSign: ({ className = "w-5 h-5" }) => (
    <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M12 16c1.11 0 2.08.402 2.599 1M12 16V7" />
    </svg>
  ),
  Send: ({ className = "w-5 h-5" }) => (
    <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
    </svg>
  )
};

// Framer-like Scroll Animation Hook using standard IntersectionObserver coordinates
const useScrollFade = () => {
  const containerRef = useRef(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add('visible');
          }
        });
      },
      { threshold: 0.12, rootMargin: '0px 0px -50px 0px' }
    );

    const elements = containerRef.current?.querySelectorAll('.framer-slide-up') || [];
    elements.forEach((el) => observer.observe(el));

    return () => {
      elements.forEach((el) => observer.unobserve(el));
    };
  }, []);

  return containerRef;
};

// Tracks mouse coordinates with mathematical interpolation (lerp) for a custom lagging feedback loop
const useCustomCursor = () => {
  const [position, setPosition] = useState({ x: 0, y: 0 });
  const [trail, setTrail] = useState({ x: 0, y: 0 });
  const [isHovered, setIsHovered] = useState(false);
  const [isHidden, setIsHidden] = useState(true);

  useEffect(() => {
    injectCustomStyles();

    const handleMouseMove = (e) => {
      setPosition({ x: e.clientX, y: e.clientY });
      setIsHidden(false);
    };

    const handleMouseLeave = () => setIsHidden(true);
    const handleMouseEnter = () => setIsHidden(false);

    window.addEventListener('mousemove', handleMouseMove);
    document.addEventListener('mouseleave', handleMouseLeave);
    document.addEventListener('mouseenter', handleMouseEnter);

    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mouseleave', handleMouseLeave);
      document.removeEventListener('mouseenter', handleMouseEnter);
    };
  }, []);

  // Smoothed outer lag trail calculation
  useEffect(() => {
    let animationFrameId;
    const updateTrail = () => {
      setTrail((prev) => {
        const dx = position.x - prev.x;
        const dy = position.y - prev.y;
        return {
          x: prev.x + dx * 0.16,
          y: prev.y + dy * 0.16
        };
      });
      animationFrameId = requestAnimationFrame(updateTrail);
    };
    animationFrameId = requestAnimationFrame(updateTrail);
    return () => cancelAnimationFrame(animationFrameId);
  }, [position]);

  // Track hover status on interactive components
  useEffect(() => {
    const handleHoverEnter = () => setIsHovered(true);
    const handleHoverLeave = () => setIsHovered(false);

    const refreshInteractiveElements = () => {
      const interactiveElements = document.querySelectorAll('a, button, [role="button"], input, textarea, select');
      interactiveElements.forEach((el) => {
        el.addEventListener('mouseenter', handleHoverEnter);
        el.addEventListener('mouseleave', handleHoverLeave);
      });
    };

    refreshInteractiveElements();

    const observer = new MutationObserver(refreshInteractiveElements);
    observer.observe(document.body, { childList: true, subtree: true });

    return () => {
      observer.disconnect();
    };
  }, []);

  return { position, trail, isHovered, isHidden };
};

export default function App() {
  const [currentPage, setCurrentPage] = useState('home'); 
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const cursorState = useCustomCursor();
  
  // Realignment on route modifications
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'instant' });
    setMobileMenuOpen(false);
  }, [currentPage]);

  // Client SPA hash listener setup
  useEffect(() => {
    const handleHashChange = () => {
      const hash = window.location.hash.replace('#', '');
      if (['home', 'work', 'about', 'services', 'start-project', 'case-study-1', 'case-study-2', 'case-study-3', 'case-study-4'].includes(hash)) {
        setCurrentPage(hash);
      } else {
        setCurrentPage('home');
      }
    };
    window.addEventListener('hashchange', handleHashChange);
    if (window.location.hash) {
      handleHashChange();
    }
    return () => window.removeEventListener('hashchange', handleHashChange);
  }, []);

  const navigateTo = (pageId) => {
    window.location.hash = pageId;
    setCurrentPage(pageId);
  };

  const caseStudies = [
    {
      id: 'case-study-1',
      title: 'Flora Organic Skincare',
      tagline: 'Formulating a botanical visual language and high-end packaging identity system.',
      service: 'Visual Identity System',
      year: '2026',
      heroImage: 'https://images.unsplash.com/photo-1545239351-ef35f43d514b?auto=format&fit=crop&w=1200&q=80',
      client: 'Flora Botanics International',
      duration: '3 Months',
    },
    {
      id: 'case-study-2',
      title: 'SynTech Solution',
      tagline: 'Synthesizing automated React frontend layouts utilizing neural compiler tools.',
      service: 'Web Development with AI Coding',
      year: '2026',
      heroImage: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?auto=format&fit=crop&w=1200&q=80',
      client: 'SynTech Global Inc.',
      duration: '4 Months',
    },
    {
      id: 'case-study-3',
      title: 'Beauty People Magazine',
      tagline: 'Asymmetric editorial configurations translating tactile high-fashion stories.',
      service: 'Editorial (Magazine) Design',
      year: '2025',
      heroImage: 'https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&w=1200&q=80',
      client: 'Beauty People Publishing',
      duration: '2 Months',
    },
    {
      id: 'case-study-4',
      title: 'Micro Animations',
      tagline: 'Designing high-frequency motion curves to elevate interactive conversion rates.',
      service: 'Motion Graphics',
      year: '2026',
      heroImage: 'https://images.unsplash.com/photo-1550684848-fac1c5b4e853?auto=format&fit=crop&w=1200&q=80',
      client: 'Kinetic Logic Systems',
      duration: '3 Months',
    }
  ];

  return (
    <div className="min-h-screen bg-black text-white selection:bg-[#B4F8C8] selection:text-black font-sans overflow-x-hidden relative">
      
      {/* Custom difference dotted cursor tracking halo */}
      {!cursorState.isHidden && (
        <>
          <div 
            className="fixed pointer-events-none z-[9999] rounded-full mix-blend-difference"
            style={{
              left: `${cursorState.position.x}px`,
              top: `${cursorState.position.y}px`,
              width: cursorState.isHovered ? '24px' : '6px',
              height: cursorState.isHovered ? '24px' : '6px',
              backgroundColor: '#FFFFFF', 
              transform: 'translate(-50%, -50%)',
              transition: 'width 0.2s, height 0.2s, background-color 0.2s',
            }}
          />
          <div 
            className="fixed pointer-events-none z-[9998] rounded-full border border-white mix-blend-difference"
            style={{
              left: `${cursorState.trail.x}px`,
              top: `${cursorState.trail.y}px`,
              width: cursorState.isHovered ? '48px' : '26px',
              height: cursorState.isHovered ? '48px' : '26px',
              transform: 'translate(-50%, -50%)',
              transition: 'width 0.2s, height 0.2s',
            }}
          />
        </>
      )}

      {/* HEADER SECTION */}
      <header className="fixed top-0 left-0 w-full z-50 mix-blend-difference py-6 px-6 md:px-12 flex justify-between items-center">
        <button 
          onClick={() => navigateTo('home')} 
          className="text-white hover:text-[#B4F8C8] transition-colors duration-300 font-extrabold tracking-wider text-lg flex items-center gap-2 focus:outline-none"
        >
          <span className="w-3.5 h-3.5 rounded-full bg-[#B4F8C8]"></span>
          <span className="font-display">WILDFLOWER</span>
        </button>

        {/* Desktop Navigation */}
        <nav className="hidden md:flex items-center gap-10">
          <button onClick={() => navigateTo('work')} className={`text-sm tracking-wider uppercase hover:text-[#B4F8C8] transition-colors duration-300 ${currentPage === 'work' ? 'text-[#B4F8C8] border-b border-[#B4F8C8] pb-1' : 'text-gray-300'}`}>Work</button>
          <button onClick={() => navigateTo('services')} className={`text-sm tracking-wider uppercase hover:text-[#B4F8C8] transition-colors duration-300 ${currentPage === 'services' ? 'text-[#B4F8C8] border-b border-[#B4F8C8] pb-1' : 'text-gray-300'}`}>Services</button>
          <button onClick={() => navigateTo('about')} className={`text-sm tracking-wider uppercase hover:text-[#B4F8C8] transition-colors duration-300 ${currentPage === 'about' ? 'text-[#B4F8C8] border-b border-[#B4F8C8] pb-1' : 'text-gray-300'}`}>Studio</button>
          
          <button 
            onClick={() => navigateTo('start-project')} 
            className="px-5 py-2.5 rounded-full border border-[#B4F8C8] text-[#B4F8C8] hover:bg-[#B4F8C8] hover:text-black font-semibold text-xs tracking-widest uppercase transition-all duration-300 shadow-sm"
          >
            Start Project
          </button>
        </nav>

        {/* Mobile menu trigger */}
        <button 
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)} 
          className="md:hidden text-white hover:text-[#B4F8C8] p-2 focus:outline-none"
          aria-label="Toggle Menu"
        >
          {mobileMenuOpen ? <Icons.X /> : <Icons.Menu />}
        </button>
      </header>

      {/* MOBILE NAV OVERLAY */}
      {mobileMenuOpen && (
        <div className="fixed inset-0 bg-black z-40 flex flex-col justify-between p-8 pt-28 animate-fade-in font-display">
          <div className="flex flex-col gap-8 text-4xl font-light">
            <button 
              onClick={() => navigateTo('home')} 
              className="text-left hover:text-[#B4F8C8] transition-colors py-2 flex items-center justify-between"
            >
              <span>Home</span> <Icons.ChevronRight className="text-[#B4F8C8] w-8 h-8" />
            </button>
            <button 
              onClick={() => navigateTo('work')} 
              className="text-left hover:text-[#B4F8C8] transition-colors py-2 flex items-center justify-between"
            >
              <span>Our Work</span> <Icons.ChevronRight className="text-[#B4F8C8] w-8 h-8" />
            </button>
            <button 
              onClick={() => navigateTo('services')} 
              className="text-left hover:text-[#B4F8C8] transition-colors py-2 flex items-center justify-between"
            >
              <span>Expertise</span> <Icons.ChevronRight className="text-[#B4F8C8] w-8 h-8" />
            </button>
            <button 
              onClick={() => navigateTo('about')} 
              className="text-left hover:text-[#B4F8C8] transition-colors py-2 flex items-center justify-between"
            >
              <span>The Studio</span> <Icons.ChevronRight className="text-[#B4F8C8] w-8 h-8" />
            </button>
          </div>

          <div className="flex flex-col gap-6">
            <button 
              onClick={() => navigateTo('start-project')} 
              className="w-full py-4 text-center rounded-full bg-[#B4F8C8] text-black font-bold uppercase tracking-widest text-sm hover:opacity-95 transition-opacity duration-200"
            >
              Start Project
            </button>
            <div className="text-center text-xs text-zinc-500 font-mono">
              © 2026 WILDFLOWER DESIGNS. LAGOS / LONDON
            </div>
          </div>
        </div>
      )}

      {/* ROUTED CONTENT */}
      <main className="pt-24 min-h-screen">
        {currentPage === 'home' && <HomePage caseStudies={caseStudies} navigateTo={navigateTo} />}
        {currentPage === 'work' && <WorkPage caseStudies={caseStudies} navigateTo={navigateTo} />}
        {currentPage === 'services' && <ServicesPage navigateTo={navigateTo} />}
        {currentPage === 'about' && <AboutPage navigateTo={navigateTo} />}
        {currentPage === 'start-project' && <StartProjectPage />}
        
        {/* CASE STUDIES ROUTERS */}
        {currentPage === 'case-study-1' && <CaseStudy1 meta={caseStudies[0]} navigateTo={navigateTo} />}
        {currentPage === 'case-study-2' && <CaseStudy2 meta={caseStudies[1]} navigateTo={navigateTo} />}
        {currentPage === 'case-study-3' && <CaseStudy3 meta={caseStudies[2]} navigateTo={navigateTo} />}
        {currentPage === 'case-study-4' && <CaseStudy4 meta={caseStudies[3]} navigateTo={navigateTo} />}
      </main>

      {/* FOOTER */}
      <footer className="bg-black border-t border-zinc-900 py-16 px-6 md:px-12 mt-20">
        <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-12">
          
          <div>
            <h3 className="text-[#B4F8C8] text-xl font-bold tracking-wider mb-6 font-display">WILDFLOWER</h3>
            <p className="text-zinc-400 text-sm max-w-sm leading-relaxed mb-8">
              A bespoke digital and design collective creating elegant, minimalist identities and high-performing smart websites.
            </p>
            <span className="inline-block px-3 py-1.5 rounded-full bg-zinc-900 border border-zinc-800 text-xs text-zinc-400 font-mono">
              v1.0.8 // Stable 2026 Edition
            </span>
          </div>

          <div>
            <h4 className="text-white font-medium text-xs uppercase tracking-widest mb-6 font-mono">Navigation</h4>
            <div className="flex flex-col gap-4 text-sm text-zinc-400">
              <button onClick={() => navigateTo('home')} className="text-left hover:text-[#B4F8C8] transition-colors">Home</button>
              <button onClick={() => navigateTo('work')} className="text-left hover:text-[#B4F8C8] transition-colors">Case Studies</button>
              <button onClick={() => navigateTo('services')} className="text-left hover:text-[#B4F8C8] transition-colors">Capabilities</button>
              <button onClick={() => navigateTo('about')} className="text-left hover:text-[#B4F8C8] transition-colors">About Studio</button>
              <button onClick={() => navigateTo('start-project')} className="text-left text-[#B4F8C8] font-semibold hover:underline">Start A Project</button>
            </div>
          </div>

          <div>
            <h4 className="text-white font-medium text-xs uppercase tracking-widest mb-6 font-mono">Contact & Socials</h4>
            <div className="flex flex-col gap-4 text-sm text-zinc-400">
              <a href="mailto:hello@wildflower.design" className="hover:text-[#B4F8C8] transition-colors font-mono">hello@wildflower.design</a>
              <span className="text-zinc-600 font-mono">Lagos & London</span>
              <div className="flex gap-4 mt-2">
                <a href="#" className="hover:text-[#B4F8C8] transition-colors text-xs font-mono">INSTAGRAM</a>
                <a href="#" className="hover:text-[#B4F8C8] transition-colors text-xs font-mono">TWITTER</a>
                <a href="#" className="hover:text-[#B4F8C8] transition-colors text-xs font-mono">LINKEDIN</a>
              </div>
            </div>
          </div>

        </div>

        <div className="max-w-7xl mx-auto mt-16 pt-8 border-t border-zinc-900 flex flex-col md:flex-row justify-between items-center text-xs text-zinc-500 gap-4">
          <div>© {new Date().getFullYear()} Wildflower Designs. All rights reserved.</div>
          <div className="flex gap-6">
            <a href="#" className="hover:text-[#B4F8C8]">Privacy Policy</a>
            <a href="#" className="hover:text-[#B4F8C8]">Terms of Service</a>
          </div>
        </div>
      </footer>
    </div>
  );
}

/* =========================================================================
   HOME PAGE SECTION
   ========================================================================= */
function HomePage({ caseStudies, navigateTo }) {
  const scrollRef = useScrollFade();

  return (
    <div ref={scrollRef} className="px-6 md:px-12 max-w-7xl mx-auto space-y-32">
      
      {/* HERO SECTION */}
      <section className="pt-12 md:pt-24 space-y-10 framer-slide-up">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-zinc-800 bg-zinc-950 text-xs text-zinc-300 font-mono">
          <span className="w-2 h-2 rounded-full bg-[#B4F8C8] animate-pulse"></span>
          <span>Open for select creative partnerships</span>
        </div>

        <h1 className="text-4xl md:text-7xl lg:text-8xl font-black tracking-tighter leading-[1.05] text-white font-display">
          We grow <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 via-[#B4F8C8] to-emerald-200">enduring brands</span> with beautiful design.
        </h1>

        <p className="text-lg md:text-2xl text-zinc-400 max-w-3xl font-light leading-relaxed">
          Wildflower is a high-end design collective. We combine <span className="text-white font-normal">visual identity systems</span>, <span className="text-white font-normal">AI-powered code</span>, and <span className="text-white font-normal">kinetic layouts</span> to tell memorable brand stories.
        </p>

        <div className="flex flex-wrap gap-4 pt-4">
          <button 
            onClick={() => navigateTo('work')} 
            className="group flex items-center gap-2 px-8 py-4 rounded-full bg-white text-black hover:bg-[#B4F8C8] transition-all duration-300 font-bold font-mono text-xs tracking-wider uppercase"
          >
            <span>Explore Work</span>
            <Icons.ArrowRight className="group-hover:translate-x-1.5 transition-transform" />
          </button>
          
          <button 
            onClick={() => navigateTo('start-project')} 
            className="group flex items-center gap-2 px-8 py-4 rounded-full bg-zinc-900 border border-zinc-800 text-white hover:bg-zinc-800 transition-colors duration-300 font-semibold font-mono text-xs tracking-wider uppercase"
          >
            <span>Start Your Project</span>
            <Icons.ArrowUpRight className="text-[#B4F8C8] group-hover:translate-y-[-2px] group-hover:translate-x-[2px] transition-transform" />
          </button>
        </div>
      </section>

      {/* METRIC BANNER */}
      <section className="grid grid-cols-2 md:grid-cols-4 gap-6 p-8 rounded-2xl bg-zinc-950 border border-zinc-900 framer-slide-up">
        {[
          { metric: "100%", label: "Bespoke Architecture" },
          { metric: "50M+", label: "Synthesized AI Iterations" },
          { metric: "24+", label: "International Awards" },
          { metric: "1.4s", label: "Average Page Load Speed" }
        ].map((item, idx) => (
          <div key={idx} className="space-y-1">
            <div className="text-3xl md:text-4xl font-black text-[#B4F8C8] font-display">{item.metric}</div>
            <div className="text-xs text-zinc-400 tracking-wider uppercase font-mono">{item.label}</div>
          </div>
        ))}
      </section>

      {/* SELECTED WORKS GRID */}
      <section className="space-y-12 framer-slide-up">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
          <div className="space-y-2">
            <span className="text-xs uppercase tracking-widest text-[#B4F8C8] font-mono font-bold">Selected Works</span>
            <h2 className="text-3xl md:text-5xl font-black tracking-tight font-display">Our Case Studies</h2>
          </div>
          <button 
            onClick={() => navigateTo('work')} 
            className="flex items-center gap-2 hover:text-[#B4F8C8] font-semibold text-sm transition-colors uppercase tracking-widest font-mono"
          >
            <span>View All Projects</span>
            <Icons.ChevronRight className="w-4 h-4" />
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
          {caseStudies.map((study, index) => {
            const isEven = index % 2 === 0;
            return (
              <div 
                key={study.id} 
                onClick={() => navigateTo(study.id)}
                className={`flex flex-col gap-6 cursor-pointer group ${!isEven ? 'md:translate-y-12' : ''}`}
              >
                <div className="relative overflow-hidden aspect-[4/3] rounded-3xl bg-zinc-900 border border-zinc-800">
                  <img 
                    src={study.heroImage} 
                    alt={study.title}
                    className="w-full h-full object-cover grayscale hover-scale-img group-hover:grayscale-0"
                  />
                  <div className="absolute top-6 left-6 flex flex-wrap gap-2">
                    <span className="bg-black/80 backdrop-blur-md text-white text-[11px] font-mono uppercase tracking-widest px-3 py-1.5 rounded-full border border-zinc-700">
                      {study.service}
                    </span>
                  </div>
                  <div className="absolute bottom-6 left-6 right-6 flex justify-between items-end">
                    <div className="bg-black/90 backdrop-blur-md px-4 py-2 rounded-xl border border-zinc-800">
                      <span className="text-xs font-mono text-zinc-400">CLIENT</span>
                      <p className="text-sm font-bold text-white">{study.client}</p>
                    </div>
                    <div className="w-12 h-12 rounded-full bg-[#B4F8C8] text-black flex items-center justify-center transform translate-y-4 opacity-0 group-hover:translate-y-0 group-hover:opacity-100 transition-all duration-300">
                      <Icons.ArrowRight className="w-6 h-6" />
                    </div>
                  </div>
                </div>

                <div className="space-y-2">
                  <div className="flex justify-between items-center text-xs text-zinc-500 font-mono">
                    <span>CASE STUDY 0{index + 1}</span>
                    <span>{study.year}</span>
                  </div>
                  <h3 className="text-2xl font-black group-hover:text-[#B4F8C8] transition-colors font-display">{study.title}</h3>
                  <p className="text-sm text-zinc-400 leading-relaxed">{study.tagline}</p>
                </div>
              </div>
            );
          })}
        </div>
      </section>

      {/* CTA BLOCK */}
      <section className="bg-zinc-950 border border-zinc-900 rounded-3xl p-8 md:p-16 flex flex-col md:flex-row items-center justify-between gap-12 text-center md:text-left framer-slide-up">
        <div className="space-y-4 max-w-xl">
          <h2 className="text-3xl md:text-5xl font-black tracking-tight font-display">Have a brand idea brewing?</h2>
          <p className="text-zinc-400 text-sm md:text-base leading-relaxed">
            Fill out our interactive project planner based on premium design architectures. It takes less than 2 minutes to calculate budget estimates and map project scopes.
          </p>
        </div>
        <button 
          onClick={() => navigateTo('start-project')} 
          className="whitespace-nowrap flex items-center gap-3 px-8 py-5 rounded-full bg-[#B4F8C8] text-black hover:opacity-95 transform hover:scale-[1.02] active:scale-[0.98] transition-all duration-300 font-bold tracking-wider uppercase text-xs font-mono"
        >
          <span>Get Started Now</span>
          <Icons.ArrowRight className="w-4 h-4" />
        </button>
      </section>

    </div>
  );
}

/* =========================================================================
   WORK PORTFOLIO PAGE
   ========================================================================= */
function WorkPage({ caseStudies, navigateTo }) {
  const [filter, setFilter] = useState('All');
  const scrollRef = useScrollFade();

  const filteredStudies = filter === 'All' 
    ? caseStudies 
    : caseStudies.filter(study => study.service === filter);

  return (
    <div ref={scrollRef} className="px-6 md:px-12 max-w-7xl mx-auto space-y-16 py-12">
      <div className="space-y-4 text-center max-w-2xl mx-auto framer-slide-up">
        <span className="text-xs uppercase tracking-widest text-[#B4F8C8] font-mono">OUR PORTFOLIO</span>
        <h1 className="text-4xl md:text-6xl font-black tracking-tight font-display">CRAFTED EXPERIENCES</h1>
        <p className="text-zinc-400 font-light text-base md:text-lg">
          Explore our long-form archive demonstrating deep technical strategy and stunning creative design formats.
        </p>
      </div>

      {/* FILTER BUTTONS */}
      <div className="flex flex-wrap justify-center gap-3 border-b border-zinc-900 pb-8 framer-slide-up">
        {['All', 'Visual Identity System', 'Web Development with AI Coding', 'Editorial (Magazine) Design', 'Motion Graphics'].map((cat) => (
          <button
            key={cat}
            onClick={() => setFilter(cat)}
            className={`px-5 py-2 rounded-full text-xs font-semibold tracking-wider uppercase transition-all duration-300 font-mono ${
              filter === cat 
                ? 'bg-[#B4F8C8] text-black' 
                : 'bg-zinc-950 text-zinc-400 border border-zinc-900 hover:text-white'
            }`}
          >
            {cat}
          </button>
        ))}
      </div>

      {/* PORTFOLIO GRID */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-16 framer-slide-up">
        {filteredStudies.map((study) => (
          <div 
            key={study.id} 
            onClick={() => navigateTo(study.id)}
            className="flex flex-col gap-6 cursor-pointer group"
          >
            <div className="relative overflow-hidden aspect-[16/10] rounded-3xl bg-zinc-900 border border-zinc-800">
              <img 
                src={study.heroImage} 
                alt={study.title} 
                className="w-full h-full object-cover grayscale hover-scale-img group-hover:grayscale-0"
              />
              <div className="absolute top-4 left-4">
                <span className="bg-black/95 backdrop-blur-md px-3 py-1.5 rounded-full border border-zinc-800 text-xs font-mono uppercase tracking-widest text-white">
                  {study.service}
                </span>
              </div>
            </div>
            <div className="flex justify-between items-start">
              <div className="space-y-1">
                <h3 className="text-2xl font-black group-hover:text-[#B4F8C8] transition-colors font-display">{study.title}</h3>
                <p className="text-zinc-400 text-sm max-w-md">{study.tagline}</p>
              </div>
              <div className="text-right">
                <span className="font-mono text-zinc-500 text-xs block">YEAR</span>
                <span className="font-mono font-bold text-sm text-white">{study.year}</span>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

/* =========================================================================
   SERVICES / CAPABILITIES PAGE
   ========================================================================= */
function ServicesPage({ navigateTo }) {
  const scrollRef = useScrollFade();

  return (
    <div ref={scrollRef} className="px-6 md:px-12 max-w-7xl mx-auto space-y-24 py-12">
      <div className="max-w-3xl space-y-4 framer-slide-up">
        <span className="text-xs uppercase tracking-widest text-[#B4F8C8] font-mono">Expertise Details</span>
        <h1 className="text-4xl md:text-6xl font-black tracking-tight leading-tight font-display">Capabilities designed for the vanguard.</h1>
        <p className="text-zinc-400 text-lg md:text-xl font-light">
          We integrate tactical design thinking with high-performing code systems to build complete digital pipelines.
        </p>
      </div>

      {/* DETAILED SPEC LIST */}
      <div className="space-y-16 framer-slide-up">
        {[
          {
            title: "Visual Identity Systems",
            tag: "Branding",
            desc: "Visual branding built upon strategic fundamentals. We compile comprehensive visual standards that translate smoothly across screen grids and print materials alike.",
            deliverables: ["Visual Strategy", "Vector Logo Marks", "Design Tokens", "Typography Hierarchy", "Corporate Brandbooks", "SVG Asset Libraries"],
            bg: "bg-zinc-950"
          },
          {
            title: "Web Development & AI Coding",
            tag: "Engineering",
            desc: "Modern, lightweight static site builds incorporating optimized JavaScript. We build headless frameworks using Gemini and LLM automation tools to guarantee pristine, lightning-fast rendering.",
            deliverables: ["NextJS & React Ecosystems", "AI Code Pipeline Synthesis", "SEO Technical Audits", "Optimized WebGL Systems", "API Microservices", "Adaptive UX Schemas"],
            bg: "bg-zinc-950"
          },
          {
            title: "Editorial & Publication Design",
            tag: "Print & Screen",
            desc: "A passion for classic layout structure. We craft bespoke physical publications, art catalogs, and interactive online magazines utilizing precise vertical rhythms and custom proportions.",
            deliverables: ["Art Direction", "Dynamic Editorial Systems", "Double-Page Grid Mockups", "Bespoke Book Covers", "Creative Type Styling", "Packaging Enclosures"],
            bg: "bg-zinc-950"
          },
          {
            title: "Premium Motion Graphics",
            tag: "Animation",
            desc: "Infusing energy and momentum. We animate kinetic typography layouts, coordinate path dynamics, and prepare beautiful motion videos suitable for modern brand storytelling.",
            deliverables: ["Kinetic Typographical Loops", "SVG Web Animation Models", "Explainer Frame Assets", "Render Architecture Strategy", "Interface Transition Sets", "Social Reels Packaging"],
            bg: "bg-zinc-950"
          }
        ].map((serv, i) => (
          <div key={i} className="p-8 md:p-12 bg-zinc-950 rounded-3xl border border-zinc-900 grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
            
            <div className="lg:col-span-4 space-y-3">
              <span className="px-3 py-1 bg-zinc-900 rounded-full text-xs text-[#B4F8C8] font-mono border border-zinc-800">
                {serv.tag}
              </span>
              <h2 className="text-2xl md:text-3xl font-black tracking-tight pt-2 font-display">{serv.title}</h2>
            </div>

            <div className="lg:col-span-5 text-zinc-400 text-sm md:text-base leading-relaxed">
              {serv.desc}
            </div>

            <div className="lg:col-span-3 space-y-3">
              <span className="text-xs text-zinc-500 font-mono block tracking-wider uppercase">DELIVERABLES</span>
              <ul className="space-y-2">
                {serv.deliverables.map((item, idx) => (
                  <li key={idx} className="text-xs md:text-sm font-medium flex items-center gap-2">
                    <span className="w-1.5 h-1.5 rounded-full bg-[#B4F8C8]"></span>
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
            </div>

          </div>
        ))}
      </div>

    </div>
  );
}

/* =========================================================================
   ABOUT THE STUDIO PAGE (With Nigerian Founders Rebrand)
   ========================================================================= */
function AboutPage({ navigateTo }) {
  const scrollRef = useScrollFade();

  return (
    <div ref={scrollRef} className="px-6 md:px-12 max-w-7xl mx-auto space-y-24 py-12">
      
      {/* HEADER STATEMENT */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center framer-slide-up">
        <div className="lg:col-span-7 space-y-6">
          <span className="text-xs uppercase tracking-widest text-[#B4F8C8] font-mono">Our DNA</span>
          <h1 className="text-4xl md:text-6xl font-black tracking-tight leading-tight font-display">
            We exist to synthesize raw creativity and technical precision.
          </h1>
          <p className="text-zinc-400 text-lg font-light leading-relaxed">
            Wildflower was founded as a reaction against over-complicated corporate web pages and visual noise. We operate as a tightly knit modern design and development agency. We focus on boutique aesthetics that perform exceptionally well.
          </p>
        </div>
        <div className="lg:col-span-5 relative aspect-square rounded-3xl overflow-hidden bg-zinc-900 border border-zinc-800">
          <img 
            src="https://images.unsplash.com/photo-1517245386807-bb43f82c33c4?auto=format&fit=crop&w=800&q=80" 
            alt="The wild flower design studio"
            className="w-full h-full object-cover grayscale"
          />
        </div>
      </div>

      {/* MODERN NIGERIAN LEADERSHIP */}
      <div className="space-y-12 framer-slide-up">
        <div className="text-center space-y-2">
          <span className="text-xs uppercase tracking-widest text-[#B4F8C8] font-mono">Lagos & London Office Founders</span>
          <h2 className="text-3xl md:text-4xl font-black font-display">Core Visionaries</h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-12 max-w-4xl mx-auto">
          {[
            {
              name: "Amara Nwosu",
              role: "Creative Director / Head of Typography",
              bio: "Amara spent over a decade leading art direction across London and Lagos editorial spaces. She oversees all visual brandbooks and layout grids.",
              img: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=400&h=400&q=80"
            },
            {
              name: "Tunde Adeleke",
              role: "Principal Developer / AI Lead",
              bio: "Tunde crafts lightweight static architectures and orchestrates automated design compiling systems to make digital experiences feel fluid.",
              img: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=400&h=400&q=80"
            }
          ].map((member, idx) => (
            <div key={idx} className="p-6 bg-zinc-950 border border-zinc-900 rounded-3xl flex flex-col md:flex-row gap-6 items-center">
              <img 
                src={member.img} 
                alt={member.name}
                className="w-24 h-24 rounded-full object-cover grayscale border-2 border-zinc-800"
              />
              <div className="space-y-2 text-center md:text-left">
                <h3 className="text-lg font-bold font-display">{member.name}</h3>
                <span className="text-xs text-[#B4F8C8] font-mono block">{member.role}</span>
                <p className="text-xs text-zinc-400 leading-relaxed">{member.bio}</p>
              </div>
            </div>
          ))}
        </div>
      </div>

    </div>
  );
}

/* =========================================================================
   CASE STUDY 01: FLORA ORGANIC SKINCARE (BRANDING deep dive)
   ========================================================================= */
function CaseStudy1({ meta, navigateTo }) {
  const scrollRef = useScrollFade();

  return (
    <div ref={scrollRef} className="py-12 animate-fade-in space-y-24">
      
      {/* HEADER SUMMARY */}
      <section className="px-6 md:px-12 max-w-7xl mx-auto space-y-8 framer-slide-up">
        <button 
          onClick={() => navigateTo('work')} 
          className="inline-flex items-center gap-2 text-xs uppercase tracking-widest text-[#B4F8C8] font-mono hover:underline focus:outline-none"
        >
          <span>← Back to Portfolio</span>
        </button>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
          <div className="lg:col-span-8 space-y-4">
            <span className="text-xs text-[#B4F8C8] font-mono uppercase tracking-widest block">{meta.service}</span>
            <h1 className="text-4xl md:text-7xl font-black tracking-tight font-display">{meta.title}</h1>
            <p className="text-xl text-zinc-400 font-light leading-relaxed">
              Establishing a premium, organic botanical brand identity manual and cosmetic packaging configuration.
            </p>
          </div>
          
          <div className="lg:col-span-4 bg-zinc-950 border border-zinc-900 rounded-2xl p-6 space-y-4 text-xs font-mono text-zinc-400">
            <div>
              <span className="text-zinc-600 block">CLIENT</span>
              <span className="text-white font-bold">{meta.client}</span>
            </div>
            <hr className="border-zinc-900" />
            <div>
              <span className="text-zinc-600 block">TIMELINE</span>
              <span className="text-white font-bold">{meta.duration}</span>
            </div>
            <hr className="border-zinc-900" />
            <div>
              <span className="text-zinc-600 block">DELIVERABLES</span>
              <span className="text-white font-bold">Brandmark Variations, Editorial Typography Set, Glass Packaging Blueprints</span>
            </div>
          </div>
        </div>
      </section>

      {/* FULL ASPECT HERO BANNER */}
      <div className="w-full relative overflow-hidden aspect-[21/9] bg-zinc-900 border-y border-zinc-800 framer-slide-up">
        <img src={meta.heroImage} alt={meta.title} className="w-full h-full object-cover grayscale" />
      </div>

      {/* CHALLENGES & CLIENT GOALS */}
      <section className="px-6 md:px-12 max-w-5xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-12 framer-slide-up">
        <div className="space-y-4">
          <span className="text-xs uppercase tracking-widest text-[#B4F8C8] font-mono">01 // THE CHALLENGE</span>
          <h3 className="text-2xl font-bold font-display">Transitioning from Clinical to Premium Earthy Luxury</h3>
          <p className="text-sm text-zinc-400 leading-relaxed">
            Flora Organic Skincare was initially launched with clinical, sterile branding that made it feel like a heavy prescription product. They struggled to communicate the raw botanical freshness of their plant-based formulation while justifying their high-end pricing structure in competitive retail spaces.
          </p>
        </div>
        <div className="space-y-4">
          <span className="text-xs uppercase tracking-widest text-[#B4F8C8] font-mono">02 // CLIENT GOALS</span>
          <h3 className="text-2xl font-bold font-display">Securing High-End Cohesion</h3>
          <p className="text-sm text-zinc-400 leading-relaxed">
            The target was to structure a modern, high-contrast visual architecture. Every customer touchpoint—from physical bottle labeling and shipping containers to the online storefront—needed to communicate organic purity.
          </p>
        </div>
      </section>

      {/* COLORS & TYPOGRAPHY MANUAL */}
      <section className="bg-zinc-950 border-y border-zinc-900 py-16 px-6 md:px-12 framer-slide-up">
        <div className="max-w-5xl mx-auto space-y-12">
          <h3 className="text-2xl font-bold text-center font-display">Core Brand Assets Specifications</h3>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-start">
            
            {/* Typography pairings block */}
            <div className="p-8 rounded-3xl border border-zinc-800 bg-black space-y-6">
              <span className="text-xs uppercase font-mono text-[#B4F8C8]">SPECIFIED TYPOGRAPHY</span>
              
              <div className="space-y-4">
                <div>
                  <span className="text-xs font-mono text-zinc-500 block mb-1">DISPLAY SERIF TYPOGRAPHY (Playfair Serif)</span>
                  <div className="text-3xl font-light italic font-serif text-white">Flora Botanical</div>
                </div>
                <div>
                  <span className="text-xs font-mono text-zinc-500 block mb-1">UTILITY BODY TYPOGRAPHY (Inter Sans)</span>
                  <div className="text-sm text-zinc-300 leading-relaxed">
                    Designed for maximum legibility on physical glass cosmetics containers and mobile product pages.
                  </div>
                </div>
              </div>
            </div>

            {/* Colors cards set */}
            <div className="p-8 rounded-3xl border border-zinc-800 bg-black space-y-6">
              <span className="text-xs uppercase font-mono text-[#B4F8C8]">COLOR SYSTEM MATRIX</span>
              
              <div className="grid grid-cols-2 gap-4">
                {[
                  { name: "Forest Onyx", hex: "#07110B", dark: true },
                  { name: "Wildflower Green", hex: "#B4F8C8", dark: false },
                  { name: "Alabaster Cream", hex: "#FAF9F6", dark: false },
                  { name: "Pitch Charcoal", hex: "#121212", dark: true }
                ].map((col, idx) => (
                  <div key={idx} className="p-4 rounded-xl border border-zinc-800 flex flex-col justify-between h-24">
                    <div className="w-6 h-6 rounded-full border border-zinc-700" style={{ backgroundColor: col.hex }}></div>
                    <div>
                      <span className="text-xs font-bold block text-white">{col.name}</span>
                      <span className="text-[10px] font-mono text-zinc-500">{col.hex}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>

          </div>
        </div>
      </section>

      {/* LOGO VARIATIONS & PRODUCT GLASS CONTAINER MOCKUPS */}
      <section className="px-6 md:px-12 max-w-5xl mx-auto space-y-12 framer-slide-up">
        <h3 className="text-2xl font-bold text-center font-display">Brand Variations & Bottle Mockups</h3>

        <div className="grid grid-cols-1 md:grid-cols-12 gap-8 items-stretch">
          
          {/* Packaging Glass Container Mockup (Rendered dynamically in vector layout) */}
          <div className="md:col-span-7 bg-zinc-950 border border-zinc-900 p-8 rounded-3xl flex flex-col justify-between items-center min-h-[380px]">
            <span className="text-xs font-mono text-zinc-500 uppercase tracking-widest block self-start">SPEC 01 // PREMIUM GLASS CONTAINER</span>
            
            {/* Hand-drawn inline Vector Skincare Bottle */}
            <svg className="w-48 h-auto text-white" viewBox="0 0 120 200" fill="none" xmlns="http://www.w3.org/2000/svg">
              <rect x="20" y="40" width="80" height="150" rx="20" stroke="currentColor" strokeWidth="1.5" fill="#0c1811" />
              <rect x="40" y="10" width="40" height="30" rx="4" stroke="currentColor" strokeWidth="1.5" fill="#B4F8C8" />
              <line x1="60" y1="10" x2="60" y2="40" stroke="currentColor" strokeWidth="1" />
              
              {/* Clean label layout on bottle */}
              <rect x="30" y="70" width="60" height="70" rx="4" stroke="currentColor" strokeWidth="1" strokeDasharray="2" />
              <text x="60" y="100" textAnchor="middle" fill="#B4F8C8" fontSize="8" fontFamily="Space Grotesk" fontWeight="bold">FLORA</text>
              <text x="60" y="112" textAnchor="middle" fill="#a1a1aa" fontSize="5" fontFamily="monospace">BOTANICS</text>
              <text x="60" y="128" textAnchor="middle" fill="white" fontSize="4" fontFamily="Inter">FACIAL SERUM // 50ml</text>
            </svg>

            <span className="text-[10px] font-mono text-[#B4F8C8]">CONSTRUCTED WITH 100% POST-CONSUMER RECYCLED GLASS</span>
          </div>

          {/* Linear Brand logo variation vectors */}
          <div className="md:col-span-5 bg-zinc-950 border border-zinc-900 p-8 rounded-3xl flex flex-col justify-between min-h-[380px]">
            <span className="text-xs font-mono text-zinc-500 uppercase tracking-widest block">SPEC 02 // STENCIL VARIANTS</span>
            
            <div className="space-y-8 flex-1 flex flex-col justify-center">
              {/* Primary Linear logo */}
              <div className="border border-zinc-800 p-4 rounded-xl flex items-center justify-between">
                <span className="text-xs font-mono text-zinc-500">PRIMARY LABEL</span>
                <span className="font-display font-extrabold text-lg tracking-wider text-[#B4F8C8]">FLORA™</span>
              </div>
              
              {/* Secondary Leaf Emblem Variant */}
              <div className="border border-zinc-800 p-4 rounded-xl flex items-center justify-between">
                <span className="text-xs font-mono text-zinc-500">BOTANICAL EMBLEM</span>
                <svg className="w-6 h-6 text-[#B4F8C8]" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm1 15.5c0 .83-.67 1.5-1.5 1.5s-1.5-.67-1.5-1.5.67-1.5 1.5-1.5 1.5.67 1.5 1.5zm-1.5-3.5c-.55 0-1-.45-1-1v-4c0-.55.45-1 1-1s1.45.45 1.1v4c0 .55-.45 1-1 1z" />
                </svg>
              </div>

              {/* Minimalist circular stamp variant */}
              <div className="border border-zinc-800 p-4 rounded-xl flex items-center justify-between">
                <span className="text-xs font-mono text-zinc-500">ROUND STAMP</span>
                <div className="w-8 h-8 rounded-full border border-dashed border-[#B4F8C8] flex items-center justify-center font-mono text-[8px] font-bold text-white">
                  F.B.
                </div>
              </div>
            </div>

            <span className="text-[10px] font-mono text-zinc-600 block pt-4">© FLORA BRAND GUIDELINES SECURED</span>
          </div>

        </div>
      </section>

    </div>
  );
}

/* =========================================================================
   CASE STUDY 02: SYNTECH SOLUTION (WEB DEV + CODE BLUEPRINT)
   ========================================================================= */
function CaseStudy2({ meta, navigateTo }) {
  const scrollRef = useScrollFade();

  return (
    <div ref={scrollRef} className="py-12 animate-fade-in space-y-24">
      
      {/* HEADER SECTION */}
      <section className="px-6 md:px-12 max-w-7xl mx-auto space-y-8 framer-slide-up">
        <button 
          onClick={() => navigateTo('work')} 
          className="inline-flex items-center gap-2 text-xs uppercase tracking-widest text-[#B4F8C8] font-mono hover:underline focus:outline-none"
        >
          <span>← Back to Portfolio</span>
        </button>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
          <div className="lg:col-span-8 space-y-4">
            <span className="text-xs text-[#B4F8C8] font-mono uppercase tracking-widest block">{meta.service}</span>
            <h1 className="text-4xl md:text-7xl font-black tracking-tight font-display">{meta.title}</h1>
            <p className="text-xl text-zinc-400 font-light leading-relaxed">
              Synthesizing a hyper-optimized developer analytics engine using dynamic frontend routing frameworks.
            </p>
          </div>
          
          <div className="lg:col-span-4 bg-zinc-950 border border-zinc-900 rounded-2xl p-6 space-y-4 text-xs font-mono text-zinc-400">
            <div>
              <span className="text-zinc-600 block">CLIENT</span>
              <span className="text-white font-bold">{meta.client}</span>
            </div>
            <hr className="border-zinc-900" />
            <div>
              <span className="text-zinc-600 block">DEVELOPMENT LIFECYCLE</span>
              <span className="text-white font-bold">6 Weeks Complete Execution</span>
            </div>
            <hr className="border-zinc-900" />
            <div>
              <span className="text-zinc-600 block">AI SYSTEM MODEL</span>
              <span className="text-white font-bold">AST Code Compiler, NextJS 15 Vercel Node</span>
            </div>
          </div>
        </div>
      </section>

      {/* FULL ASPECT HERO BANNER */}
      <div className="w-full relative overflow-hidden aspect-[21/9] bg-zinc-900 border-y border-zinc-800 framer-slide-up">
        <img src={meta.heroImage} alt={meta.title} className="w-full h-full object-cover grayscale" />
      </div>

      {/* CHALLENGES & CLIENT GOALS */}
      <section className="px-6 md:px-12 max-w-5xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-12 framer-slide-up">
        <div className="space-y-4">
          <span className="text-xs uppercase tracking-widest text-[#B4F8C8] font-mono">01 // THE CHALLENGE</span>
          <h3 className="text-2xl font-bold font-display">Taming Real-Time AST Complexity</h3>
          <p className="text-sm text-zinc-400 leading-relaxed">
            SynTech Solution’s AI platform outputs heavy streams of abstract syntax tree code nodes. Traditional interfaces suffered from extreme layout shift and DOM bloat, causing significant mobile browser crashes under heavy workloads.
          </p>
        </div>
        <div className="space-y-4">
          <span className="text-xs uppercase tracking-widest text-[#B4F8C8] font-mono">02 // THE ENGINEERING PLAN</span>
          <h3 className="text-2xl font-bold font-display">Fast Hydration & Zero Cumulative Layout Shifts</h3>
          <p className="text-sm text-zinc-400 leading-relaxed">
            We formulated a state-of-the-art NextJS build. By rendering the structural nodes inside static containers and loading heavy real-time tracking graphs as deferred asynchronous calls, we established an ultra-fast layout metric on page load tests.
          </p>
        </div>
      </section>

      {/* COMPILATION METADATA BLUEPRINTS */}
      <section className="bg-zinc-950 border-y border-zinc-900 py-16 px-6 md:px-12 framer-slide-up">
        <div className="max-w-5xl mx-auto space-y-12">
          <h3 className="text-2xl font-bold text-center font-display">AI Engineering Blueprint Specifications</h3>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
            
            <div className="p-8 rounded-3xl border border-zinc-800 bg-black space-y-6">
              <span className="text-xs uppercase font-mono text-[#B4F8C8]">AI INTEGRATION LAYER</span>
              
              <div className="space-y-4 text-xs font-mono text-zinc-400">
                <div className="flex justify-between border-b border-zinc-900 pb-2">
                  <span>AI PARSING MODEL</span>
                  <span className="text-white">Gemini 2.5 Flash API</span>
                </div>
                <div className="flex justify-between border-b border-zinc-900 pb-2">
                  <span>COMPILING TARGET</span>
                  <span className="text-white">NextJS Structural Components</span>
                </div>
                <div className="flex justify-between border-b border-zinc-900 pb-2">
                  <span>TRANSLATION TIME</span>
                  <span className="text-white">~12ms per AST Node</span>
                </div>
                <div className="flex justify-between">
                  <span>SEO METRIC PERFORMANCE</span>
                  <span className="text-[#B4F8C8]">100% Core Web Vitals Passed</span>
                </div>
              </div>
            </div>

            <div className="p-8 rounded-3xl border border-zinc-800 bg-black space-y-6 flex flex-col justify-center">
              <span className="text-xs uppercase font-mono text-[#B4F8C8] block mb-2">Development Timeline</span>
              
              <div className="space-y-3 font-mono text-xs">
                <div className="flex gap-4">
                  <span className="text-[#B4F8C8]">W1–W2</span>
                  <span className="text-zinc-400">Structural design token mappings & CSS setup.</span>
                </div>
                <div className="flex gap-4">
                  <span className="text-[#B4F8C8]">W3–W4</span>
                  <span className="text-zinc-400">AI AST parsing hooks & API web socket development.</span>
                </div>
                <div className="flex gap-4">
                  <span className="text-[#B4F8C8]">W5–W6</span>
                  <span className="text-zinc-400">Hydration tuning, cross-device testing, and Vercel CDN deployment.</span>
                </div>
              </div>
            </div>

          </div>
        </div>
      </section>

      {/* WEB DASHBOARD INTERACTION SHOTS */}
      <section className="px-6 md:px-12 max-w-5xl mx-auto space-y-12 framer-slide-up">
        <h3 className="text-2xl font-bold text-center font-display">Dashboard System Sections Visualized</h3>

        <div className="p-8 bg-zinc-950 border border-zinc-900 rounded-3xl space-y-8">
          <span className="text-xs font-mono text-zinc-500 uppercase tracking-widest block">BROWSER CONTAINER SHOT</span>
          
          {/* Mock responsive Admin Dashboard preview layout in SVG/HTML */}
          <div className="border border-zinc-800 rounded-2xl bg-black overflow-hidden shadow-2xl">
            {/* Minimal browser window header */}
            <div className="bg-zinc-950 px-4 py-3 border-b border-zinc-900 flex justify-between items-center text-xs font-mono">
              <div className="flex gap-1.5">
                <span className="w-2.5 h-2.5 rounded-full bg-zinc-800"></span>
                <span className="w-2.5 h-2.5 rounded-full bg-zinc-800"></span>
                <span className="w-2.5 h-2.5 rounded-full bg-zinc-800"></span>
              </div>
              <span className="text-zinc-500 text-[10px]">https://dashboard.syntech.solution</span>
              <div></div>
            </div>

            {/* Dashboard Workspace */}
            <div className="p-6 grid grid-cols-1 md:grid-cols-12 gap-6 min-h-[220px]">
              
              {/* Sidebar list items */}
              <div className="md:col-span-3 border-r border-zinc-900 pr-6 space-y-3 font-mono text-[10px] text-zinc-500">
                <span className="text-[#B4F8C8] block font-bold">● CLUSTER_STABILITY</span>
                <span>DATA INTEGRATION</span>
                <span>SYSTEM BLUEPRINTS</span>
                <span>METRICS REPORT</span>
              </div>

              {/* Main content chart mock */}
              <div className="md:col-span-9 flex flex-col justify-between">
                <div className="flex justify-between items-baseline border-b border-zinc-900 pb-2">
                  <span className="text-xs font-bold font-display">CLUSTER_STABILITY PERFORMANCE MONITOR</span>
                  <span className="text-emerald-400 text-xs font-mono">STABLE // 99.9% UPTIME</span>
                </div>

                {/* SVG Visual line chart mockup representing stability performance monitor */}
                <div className="h-28 py-4">
                  <svg className="w-full h-full text-[#B4F8C8]" viewBox="0 0 300 100" fill="none">
                    <path d="M 0 80 Q 50 20 100 60 T 200 10 T 300 40" stroke="currentColor" strokeWidth="1.5" />
                    <line x1="0" y1="90" x2="300" y2="90" stroke="#1f1f1f" strokeWidth="1" />
                    <line x1="100" y1="0" x2="100" y2="100" stroke="#1f1f1f" strokeWidth="1" strokeDasharray="3" />
                    <circle cx="100" cy="60" r="3.5" fill="currentColor" />
                  </svg>
                </div>

                <div className="flex justify-between items-center text-[10px] font-mono text-zinc-600">
                  <span>LAST SCAN: 0.02ms AGO</span>
                  <span>LOAD COEFFICIENT: 1:1.6</span>
                </div>
              </div>

            </div>
          </div>
        </div>
      </section>

    </div>
  );
}

/* =========================================================================
   CASE STUDY 03: BEAUTY PEOPLE MAGAZINE (EDITORIAL & LAYOUT DESIGN)
   ========================================================================= */
function CaseStudy3({ meta, navigateTo }) {
  const scrollRef = useScrollFade();

  return (
    <div ref={scrollRef} className="py-12 animate-fade-in space-y-24">
      
      {/* HEADER */}
      <section className="px-6 md:px-12 max-w-7xl mx-auto space-y-8 framer-slide-up">
        <button 
          onClick={() => navigateTo('work')} 
          className="inline-flex items-center gap-2 text-xs uppercase tracking-widest text-[#B4F8C8] font-mono hover:underline focus:outline-none"
        >
          <span>← Back to Portfolio</span>
        </button>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
          <div className="lg:col-span-8 space-y-4">
            <span className="text-xs text-[#B4F8C8] font-mono uppercase tracking-widest block">{meta.service}</span>
            <h1 className="text-4xl md:text-7xl font-black tracking-tight font-display">{meta.title}</h1>
            <p className="text-xl text-zinc-400 font-light leading-relaxed">
              Synthesizing asymmetric editorial spreads and physical publication visual standards for high-fashion stories.
            </p>
          </div>
          
          <div className="lg:col-span-4 bg-zinc-950 border border-zinc-900 rounded-2xl p-6 space-y-4 text-xs font-mono text-zinc-400">
            <div>
              <span className="text-zinc-600 block">CLIENT</span>
              <span className="text-white font-bold">{meta.client}</span>
            </div>
            <hr className="border-zinc-900" />
            <div>
              <span className="text-zinc-600 block">FORMAT SIZE</span>
              <span className="text-white font-bold">Standard A4 Print, Digital Spread Layout</span>
            </div>
            <hr className="border-zinc-900" />
            <div>
              <span className="text-zinc-600 block">DELIVERABLES</span>
              <span className="text-white font-bold">Cover Layout Scheme, Type Scale manual, 12-Column Grid Guidelines</span>
            </div>
          </div>
        </div>
      </section>

      {/* FULL WIDTH HERO GRAPHIC */}
      <div className="w-full relative overflow-hidden aspect-[21/9] bg-zinc-900 border-y border-zinc-800 framer-slide-up">
        <img src={meta.heroImage} alt={meta.title} className="w-full h-full object-cover grayscale" />
      </div>

      {/* CHALLENGES & CLIENT GOALS */}
      <section className="px-6 md:px-12 max-w-5xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-12 framer-slide-up">
        <div className="space-y-4">
          <span className="text-xs uppercase tracking-widest text-[#B4F8C8] font-mono">01 // THE CHALLENGE</span>
          <h3 className="text-2xl font-bold font-display">Injecting Tactile Tension on Flat Glass Screens</h3>
          <p className="text-sm text-zinc-400 leading-relaxed">
            Most digital magazines look like standard blogs—rigid, scrolling blocks with little to no editorial visual tension. Beauty People Magazine required a visual experience that mirrors the visceral weight and asymmetric beauty of open physical magazines.
          </p>
        </div>
        <div className="space-y-4">
          <span className="text-xs uppercase tracking-widest text-[#B4F8C8] font-mono">02 // CLIENT GOALS</span>
          <h3 className="text-2xl font-bold font-display">A 12-Column Asymmetrical Grid Rhythm</h3>
          <p className="text-sm text-zinc-400 leading-relaxed">
            We formulated a custom 12-column layout mapping method. By offsetting text blocks against oversized, off-grid photography columns and utilizing stark whitespace, we allowed the content itself to form structural visual balance.
          </p>
        </div>
      </section>

      {/* TYPOGRAPHIC RHYTHM & PHYSICAL DOUBLE PAGE MOCKUPS */}
      <section className="px-6 md:px-12 max-w-5xl mx-auto space-y-12 framer-slide-up">
        <h3 className="text-2xl font-bold text-center font-display">Physical Magazine Spreads Mapped</h3>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-stretch">
          
          {/* Magazine Cover Front Cover design layout */}
          <div className="bg-zinc-950 border border-zinc-900 p-8 rounded-3xl flex flex-col justify-between items-center min-h-[380px]">
            <span className="text-xs font-mono text-zinc-500 uppercase tracking-widest block self-start">SPEC 01 // FRONT COVER COMPOSITION</span>
            
            <div className="w-64 aspect-[3/4] border border-zinc-800 bg-zinc-900 flex flex-col justify-between p-6 relative overflow-hidden shadow-2xl">
              <span className="text-white text-3xl font-black font-display tracking-widest leading-none block border-b border-zinc-800 pb-2">BEAUTY PEOPLE</span>
              
              <div className="space-y-2 select-none">
                <span className="text-[9px] font-mono text-[#B4F8C8] tracking-widest uppercase block">[ ISS_04 // TRANSITION STATE ]</span>
                <p className="text-white text-xs leading-relaxed font-light">An editorial study exploring visual tension, organic shapes, and asymmetric layout grids on screen.</p>
              </div>

              <div className="flex justify-between items-center text-[8px] font-mono text-zinc-500">
                <span>YEAR: 2026 EDITION</span>
                <span>VOL_14 // STABLE</span>
              </div>
            </div>

            <span className="text-[10px] font-mono text-[#B4F8C8]">© BEAUTY PEOPLE PUBLISHING INC.</span>
          </div>

          {/* Double page spread mockups inside layout */}
          <div className="bg-zinc-950 border border-zinc-900 p-8 rounded-3xl flex flex-col justify-between min-h-[380px]">
            <span className="text-xs font-mono text-zinc-500 uppercase tracking-widest block">SPEC 02 // DOUBLE-PAGE GRID ALIGNMENT</span>
            
            <div className="grid grid-cols-2 gap-4 flex-1 items-center">
              
              {/* Left page model */}
              <div className="border border-zinc-800 p-4 rounded bg-black flex flex-col justify-between h-44 font-mono text-[9px] text-zinc-500">
                <span className="text-white">P. 12</span>
                <div className="space-y-2">
                  <div className="h-1 bg-zinc-800 w-full"></div>
                  <div className="h-1 bg-zinc-800 w-4/5"></div>
                  <div className="h-1 bg-[#B4F8C8] w-2/3"></div>
                </div>
                <span>BEAUTY PEOPLE</span>
              </div>

              {/* Right page model */}
              <div className="border border-zinc-800 p-4 rounded bg-black flex flex-col justify-between h-44 font-mono text-[9px] text-zinc-500">
                <span className="text-white">P. 13</span>
                <div className="space-y-2">
                  <div className="h-12 bg-zinc-900 rounded border border-zinc-800 flex items-center justify-center font-bold text-white uppercase text-[8px]">PHOTOGRAPHY BOUND</div>
                </div>
                <span>VOL_14 // STABLE</span>
              </div>

            </div>

            <span className="text-[10px] font-mono text-zinc-600 block pt-4">ASYMMETRIC GRID MAP: COMPLETED</span>
          </div>

        </div>
      </section>

    </div>
  );
}

/* =========================================================================
   CASE STUDY 04: MICRO ANIMATIONS (MOTION & COMPONENT INTERACTION)
   ========================================================================= */
function CaseStudy4({ meta, navigateTo }) {
  const scrollRef = useScrollFade();
  const [activeTab, setActiveTab] = useState(0);
  const [btnState, setBtnState] = useState('idle');

  return (
    <div ref={scrollRef} className="py-12 animate-fade-in space-y-24">
      
      {/* HEADER SUMMARY */}
      <section className="px-6 md:px-12 max-w-7xl mx-auto space-y-8 framer-slide-up">
        <button 
          onClick={() => navigateTo('work')} 
          className="inline-flex items-center gap-2 text-xs uppercase tracking-widest text-[#B4F8C8] font-mono hover:underline focus:outline-none"
        >
          <span>← Back to Portfolio</span>
        </button>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
          <div className="lg:col-span-8 space-y-4">
            <span className="text-xs text-[#B4F8C8] font-mono uppercase tracking-widest block">{meta.service}</span>
            <h1 className="text-4xl md:text-7xl font-black tracking-tight font-display">{meta.title}</h1>
            <p className="text-xl text-zinc-400 font-light leading-relaxed">
              Synthesizing lightweight micro-interactions and vector spring curves to elevate digital conversion metrics.
            </p>
          </div>
          
          <div className="lg:col-span-4 bg-zinc-950 border border-zinc-900 rounded-2xl p-6 space-y-4 text-xs font-mono text-zinc-400">
            <div>
              <span className="text-zinc-600 block">CLIENT</span>
              <span className="text-white font-bold">{meta.client}</span>
            </div>
            <hr className="border-zinc-900" />
            <div>
              <span className="text-zinc-600 block">ANIMATION REFRESH</span>
              <span className="text-white font-bold">120Hz Ultra-Fluid Vector Refresh</span>
            </div>
            <hr className="border-zinc-900" />
            <div>
              <span className="text-zinc-600 block">COMPRESSION</span>
              <span className="text-white font-bold">Lottie Paths & Custom CSS Spring Keyframes</span>
            </div>
          </div>
        </div>
      </section>

      {/* FULL ASPECT GRAPHIC */}
      <div className="w-full relative overflow-hidden aspect-[21/9] bg-zinc-900 border-y border-zinc-800 framer-slide-up">
        <img src={meta.heroImage} alt={meta.title} className="w-full h-full object-cover grayscale" />
      </div>

      {/* CHALLENGES & CLIENT GOALS */}
      <section className="px-6 md:px-12 max-w-5xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-12 framer-slide-up">
        <div className="space-y-4">
          <span className="text-xs uppercase tracking-widest text-[#B4F8C8] font-mono">01 // THE CHALLENGE</span>
          <h3 className="text-2xl font-bold font-display">Unlocking High-Frequency Motion Without Latency</h3>
          <p className="text-sm text-zinc-400 leading-relaxed">
            SynTech Solution required high-performance layout curves. Standard Javascript animations caused massive visual lag and frames dropped under heavy scroll workflows, diluting brand precision.
          </p>
        </div>
        <div className="space-y-4">
          <span className="text-xs uppercase tracking-widest text-[#B4F8C8] font-mono">02 // CLIENT GOALS</span>
          <h3 className="text-2xl font-bold font-display">Pure-CSS Keyframes & Spring curves</h3>
          <p className="text-sm text-zinc-400 leading-relaxed">
            We formulated over 15 custom layout micro-interactions using native CSS spring curves. By shifting execution paths to GPU hardware threads, we secured a lock-stable 120Hz visual refresh across mobile platforms.
          </p>
        </div>
      </section>

      {/* DETAILED INTERACTIVE INTERACTION SAMPLES DEMO */}
      <section className="px-6 md:px-12 max-w-5xl mx-auto space-y-12 framer-slide-up">
        <h3 className="text-2xl font-bold text-center font-display">10-15s Frame-by-Frame Micro Interactions</h3>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-stretch">
          
          {/* Sample 1: Fluid Navigation Menu switch animation */}
          <div className="p-8 rounded-3xl border border-zinc-900 bg-zinc-950 flex flex-col justify-between min-h-[350px]">
            <div>
              <span className="text-xs font-mono text-zinc-500 uppercase tracking-widest block mb-4">INTERACTION 01 // FLUID GRID TAB CHANGER</span>
              <p className="text-xs text-zinc-400 leading-relaxed mb-6">
                Tap the tabs below to observe the zero-lag fluid frame state transitions.
              </p>
            </div>

            {/* Custom Tab component */}
            <div className="p-2 rounded-xl bg-black border border-zinc-800 space-y-4">
              <div className="flex gap-2 justify-between">
                {['DASHBOARD', 'STABILITY', 'REPORTS'].map((item, idx) => (
                  <button
                    key={idx}
                    onClick={() => setActiveTab(idx)}
                    className={`flex-1 py-2 text-center rounded-lg text-xs font-mono font-bold transition-all duration-300 ${
                      activeTab === idx ? 'bg-[#B4F8C8] text-black' : 'text-zinc-500 hover:text-white'
                    }`}
                  >
                    {item}
                  </button>
                ))}
              </div>

              <div className="p-4 bg-zinc-900/40 rounded-lg text-xs font-mono text-zinc-400 min-h-[80px] flex items-center justify-center border border-zinc-900">
                {activeTab === 0 && "⚡ ACTIVE STATE: CLUSTER_STABILITY MONITOR"}
                {activeTab === 1 && "⚡ ACTIVE STATE: AST CODE CACHE METRICS"}
                {activeTab === 2 && "⚡ ACTIVE STATE: PERFORMANCE SUMMARY REPORT"}
              </div>
            </div>

            <span className="text-[10px] font-mono text-[#B4F8C8] pt-4 uppercase">SYSTEM STATE INTERLOCKS // LOCKED</span>
          </div>

          {/* Sample 2: Spring-Physics Button layout */}
          <div className="p-8 rounded-3xl border border-zinc-900 bg-zinc-950 flex flex-col justify-between min-h-[350px]">
            <div>
              <span className="text-xs font-mono text-zinc-500 uppercase tracking-widest block mb-4">INTERACTION 02 // SPRING-PHYSICS ACTION TRIGGER</span>
              <p className="text-xs text-zinc-400 leading-relaxed mb-6">
                Click the action module to trigger dynamic, high-frequency CSS micro-transitions.
              </p>
            </div>

            <div className="flex flex-col items-center justify-center gap-4 flex-1">
              <button
                onMouseDown={() => setBtnState('active')}
                onMouseUp={() => setBtnState('idle')}
                onMouseLeave={() => setBtnState('idle')}
                className={`px-8 py-4 rounded-full font-mono font-bold text-xs uppercase tracking-widest border transition-all duration-300 ${
                  btnState === 'active' 
                    ? 'scale-95 bg-white text-black border-white shadow-[0_0_20px_rgba(255,255,255,0.4)]' 
                    : 'scale-100 bg-[#B4F8C8] text-black border-[#B4F8C8]'
                }`}
              >
                {btnState === 'active' ? "TRIGGERED!" : "TRIGGER SPRING PHYSICS"}
              </button>

              <span className="text-[10px] font-mono text-zinc-500 block">STATUS STATE: {btnState.toUpperCase()}</span>
            </div>

            <span className="text-[10px] font-mono text-zinc-600 block">FRAME VELOCITY: 120Hz TARGET MET</span>
          </div>

        </div>
      </section>

    </div>
  );
}

/* =========================================================================
   INTERACTIVE START-PROJECT PLANNER PAGE (Inspired by KOTA)
   ========================================================================= */
function StartProjectPage() {
  const [step, setStep] = useState(1);
  const [selectedServices, setSelectedServices] = useState([]);
  const [budgetRange, setBudgetRange] = useState('');
  const [timeline, setTimeline] = useState('');
  const [clientInfo, setClientInfo] = useState({ name: '', email: '', details: '' });
  const [submitted, setSubmitted] = useState(false);

  const services = [
    "Visual Identity System",
    "Web Development with AI Coding",
    "Editorial (Magazine) design",
    "Motion Graphics"
  ];

  const budgets = [
    "£5,000 – £10,000",
    "£10,000 – £25,000",
    "£25,000 – £50,000",
    "£50,000+"
  ];

  const timelines = [
    "Under 1 Month",
    "1 – 3 Months",
    "3 – 6 Months",
    "Flexible Timeframe"
  ];

  const toggleService = (srv) => {
    setSelectedServices(prev => 
      prev.includes(srv) ? prev.filter(s => s !== srv) : [...prev, srv]
    );
  };

  const handleInputChange = (field, val) => {
    setClientInfo(prev => ({ ...prev, [field]: val }));
  };

  const handleFormSubmit = (e) => {
    e.preventDefault();
    setSubmitted(true);
  };

  if (submitted) {
    return (
      <div className="px-6 md:px-12 max-w-2xl mx-auto py-24 text-center space-y-6 animate-fade-in">
        <div className="w-16 h-16 rounded-full bg-[#B4F8C8]/20 text-[#B4F8C8] flex items-center justify-center mx-auto border border-[#B4F8C8]/30">
          <Icons.Check className="w-8 h-8" />
        </div>
        <h1 className="text-4xl font-black tracking-tight font-display">Your request is safe with us</h1>
        <p className="text-zinc-400 text-sm leading-relaxed max-w-md mx-auto">
          We have received your visual briefing scope. Amelia or Marcus will reach out within 24 business hours with an initial estimation plan. Let's make something remarkable.
        </p>
        <span className="inline-block text-xs font-mono text-zinc-500">WILDFLOWER AGENCY CODE: WLDF-2026-INIT</span>
      </div>
    );
  }

  return (
    <div className="px-6 md:px-12 max-w-3xl mx-auto py-12 space-y-12 animate-fade-in">
      
      {/* HEADER STATEMENT */}
      <div className="space-y-3 text-center">
        <span className="text-xs uppercase tracking-widest text-[#B4F8C8] font-mono">ONBOARDING BLUEPRINT</span>
        <h1 className="text-4xl md:text-5xl font-black tracking-tight font-display">Start Your Project</h1>
        <p className="text-zinc-400 text-sm md:text-base max-w-lg mx-auto leading-relaxed">
          Inspired by premium interactive planners. Configure your scope, budget, and details below to start the blueprint.
        </p>
      </div>

      {/* STEP PROGRESS TRACKER */}
      <div className="flex justify-between items-center bg-zinc-950 p-4 rounded-xl border border-zinc-900 max-w-md mx-auto">
        {[1, 2, 3, 4].map((num) => (
          <div key={num} className="flex items-center gap-1.5">
            <span className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold transition-all ${
              step >= num ? 'bg-[#B4F8C8] text-black' : 'bg-zinc-900 text-zinc-500'
            }`}>
              {num}
            </span>
            <span className="text-[10px] font-mono text-zinc-500 uppercase">
              {num === 1 && "SERVICES"}
              {num === 2 && "BUDGET"}
              {num === 3 && "TIMELINE"}
              {num === 4 && "DETAILS"}
            </span>
          </div>
        ))}
      </div>

      {/* WORKFLOW STEPS FORM */}
      <div className="bg-zinc-950 border border-zinc-900 rounded-3xl p-6 md:p-10 space-y-8 min-h-[380px] flex flex-col justify-between">
        
        {/* STEP 1: SERVICES SELECT */}
        {step === 1 && (
          <div className="space-y-6">
            <h3 className="text-xl md:text-2xl font-bold flex items-center gap-2 font-display">
              <Icons.Layers className="text-[#B4F8C8]" />
              <span>What are you looking to create?</span>
            </h3>
            <p className="text-xs text-zinc-500 font-mono uppercase tracking-wider">SELECT ALL THAT APPLY</p>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {services.map((srv, idx) => (
                <button
                  key={idx}
                  onClick={() => toggleService(srv)}
                  className={`p-5 rounded-2xl border text-left text-sm font-semibold transition-all duration-300 flex justify-between items-center ${
                    selectedServices.includes(srv)
                      ? 'bg-[#B4F8C8]/10 border-[#B4F8C8] text-white'
                      : 'bg-zinc-900 border-zinc-800 text-zinc-400 hover:text-white'
                  }`}
                >
                  <span>{srv}</span>
                  <div className={`w-5 h-5 rounded-full border flex items-center justify-center ${
                    selectedServices.includes(srv) ? 'bg-[#B4F8C8] border-[#B4F8C8] text-black' : 'border-zinc-700'
                  }`}>
                    {selectedServices.includes(srv) && <Icons.Check className="w-3.5 h-3.5 text-black" />}
                  </div>
                </button>
              ))}
            </div>
          </div>
        )}

        {/* STEP 2: BUDGET BRACKETS */}
        {step === 2 && (
          <div className="space-y-6">
            <h3 className="text-xl md:text-2xl font-bold flex items-center gap-2 font-display">
              <Icons.DollarSign className="text-[#B4F8C8]" />
              <span>What is your estimated typical budget size?</span>
            </h3>
            <p className="text-xs text-zinc-500 font-mono uppercase tracking-wider">SELECT ONE BRACKET</p>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {budgets.map((bgt, idx) => (
                <button
                  key={idx}
                  onClick={() => setBudgetRange(bgt)}
                  className={`p-5 rounded-2xl border text-left text-sm font-semibold transition-all duration-300 flex justify-between items-center ${
                    budgetRange === bgt
                      ? 'bg-[#B4F8C8]/10 border-[#B4F8C8] text-white'
                      : 'bg-zinc-900 border-zinc-800 text-zinc-400 hover:text-white'
                  }`}
                >
                  <span>{bgt}</span>
                  <div className={`w-5 h-5 rounded-full border flex items-center justify-center ${
                    budgetRange === bgt ? 'bg-[#B4F8C8] border-[#B4F8C8] text-black' : 'border-zinc-700'
                  }`}>
                    {budgetRange === bgt && <Icons.Check className="w-3.5 h-3.5 text-black" />}
                  </div>
                </button>
              ))}
            </div>
          </div>
        )}

        {/* STEP 3: TIMELINE SELECT */}
        {step === 3 && (
          <div className="space-y-6">
            <h3 className="text-xl md:text-2xl font-bold flex items-center gap-2 font-display">
              <Icons.Clock className="text-[#B4F8C8]" />
              <span>What is your targeted timeline?</span>
            </h3>
            <p className="text-xs text-zinc-500 font-mono uppercase tracking-wider">SELECT ONE TIMEFRAME</p>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {timelines.map((tml, idx) => (
                <button
                  key={idx}
                  onClick={() => setTimeline(tml)}
                  className={`p-5 rounded-2xl border text-left text-sm font-semibold transition-all duration-300 flex justify-between items-center ${
                    timeline === tml
                      ? 'bg-[#B4F8C8]/10 border-[#B4F8C8] text-white'
                      : 'bg-zinc-900 border-zinc-800 text-zinc-400 hover:text-white'
                  }`}
                >
                  <span>{tml}</span>
                  <div className={`w-5 h-5 rounded-full border flex items-center justify-center ${
                    timeline === tml ? 'bg-[#B4F8C8] border-[#B4F8C8] text-black' : 'border-zinc-700'
                  }`}>
                    {timeline === tml && <Icons.Check className="w-3.5 h-3.5 text-black" />}
                  </div>
                </button>
              ))}
            </div>
          </div>
        )}

        {/* STEP 4: CONTACT INFO DETAILS */}
        {step === 4 && (
          <div className="space-y-6">
            <h3 className="text-xl md:text-2xl font-bold flex items-center gap-2 font-display">
              <Icons.User className="text-[#B4F8C8]" />
              <span>Tell us about yourself</span>
            </h3>
            <p className="text-xs text-zinc-500 font-mono uppercase tracking-wider">CONTACT INFORMATION</p>

            <div className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <input
                  type="text"
                  placeholder="Your Name"
                  required
                  value={clientInfo.name}
                  onChange={(e) => handleInputChange('name', e.target.value)}
                  className="p-4 rounded-xl bg-zinc-900 border border-zinc-800 text-sm focus:outline-none focus:border-[#B4F8C8] text-white w-full"
                />
                
                <input
                  type="email"
                  placeholder="Your Email"
                  required
                  value={clientInfo.email}
                  onChange={(e) => handleInputChange('email', e.target.value)}
                  className="p-4 rounded-xl bg-zinc-900 border border-zinc-800 text-sm focus:outline-none focus:border-[#B4F8C8] text-white w-full"
                />
              </div>

              <textarea
                placeholder="Briefly explain your vision, brand name, and targets..."
                rows="4"
                value={clientInfo.details}
                onChange={(e) => handleInputChange('details', e.target.value)}
                className="p-4 rounded-xl bg-zinc-900 border border-zinc-800 text-sm focus:outline-none focus:border-[#B4F8C8] text-white w-full font-sans"
              />
            </div>
          </div>
        )}

        {/* NAVIGATION PREV/NEXT CONTROLS */}
        <div className="flex justify-between items-center pt-8 border-t border-zinc-900 font-mono">
          <button
            onClick={() => setStep(prev => Math.max(1, prev - 1))}
            disabled={step === 1}
            className="text-xs font-semibold uppercase tracking-wider text-zinc-500 hover:text-white disabled:opacity-40 disabled:pointer-events-none"
          >
            ← Previous Step
          </button>

          {step < 4 ? (
            <button
              onClick={() => setStep(prev => Math.min(4, prev + 1))}
              disabled={(step === 1 && selectedServices.length === 0) || (step === 2 && !budgetRange) || (step === 3 && !timeline)}
              className="px-6 py-2.5 rounded-full bg-[#B4F8C8] text-black font-bold uppercase tracking-widest text-xs flex items-center gap-1.5 hover:opacity-90 disabled:opacity-40"
            >
              <span>Next Step</span>
              <Icons.ChevronRight className="w-3.5 h-3.5 text-black" />
            </button>
          ) : (
            <button
              onClick={handleFormSubmit}
              disabled={!clientInfo.name || !clientInfo.email}
              className="px-8 py-3 rounded-full bg-[#B4F8C8] text-black font-bold uppercase tracking-widest text-xs flex items-center gap-2 hover:opacity-90 disabled:opacity-40"
            >
              <Icons.Send className="w-4 h-4 text-black" />
              <span>Submit Brief</span>
            </button>
          )}
        </div>

      </div>

    </div>
  );
}