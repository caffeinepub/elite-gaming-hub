import { useState, useEffect, useCallback } from 'react';
import { ChevronLeft, ChevronRight, Trophy, Flame, Swords } from 'lucide-react';

const slides = [
  {
    id: 1,
    image: '/assets/generated/banner-slide-1.dim_1200x400.png',
    title: 'MEGA TOURNAMENTS',
    subtitle: 'Battle for Glory',
    tag: 'LIVE NOW',
    tagColor: 'bg-neon-red',
    icon: <Flame className="w-6 h-6" />,
    prize: '₹50,000',
  },
  {
    id: 2,
    image: '/assets/generated/banner-slide-2.dim_1200x400.png',
    title: 'MEGA TOURNAMENTS',
    subtitle: 'Champion\'s Arena',
    tag: 'REGISTERING',
    tagColor: 'bg-neon-red',
    icon: <Trophy className="w-6 h-6" />,
    prize: '₹1,00,000',
  },
  {
    id: 3,
    image: '/assets/generated/banner-slide-3.dim_1200x400.png',
    title: 'MEGA TOURNAMENTS',
    subtitle: 'Elite Showdown',
    tag: 'UPCOMING',
    tagColor: 'bg-neon-red/80',
    icon: <Swords className="w-6 h-6" />,
    prize: '₹25,000',
  },
];

export default function TournamentBanner() {
  const [current, setCurrent] = useState(0);
  const [isTransitioning, setIsTransitioning] = useState(false);

  const goTo = useCallback((index: number) => {
    if (isTransitioning) return;
    setIsTransitioning(true);
    setCurrent(index);
    setTimeout(() => setIsTransitioning(false), 400);
  }, [isTransitioning]);

  const next = useCallback(() => {
    goTo((current + 1) % slides.length);
  }, [current, goTo]);

  const prev = useCallback(() => {
    goTo((current - 1 + slides.length) % slides.length);
  }, [current, goTo]);

  useEffect(() => {
    const timer = setInterval(next, 5000);
    return () => clearInterval(timer);
  }, [next]);

  return (
    <section className="relative w-full overflow-hidden bg-dark-bg" aria-label="Tournament Banner">
      {/* Slides */}
      <div className="relative w-full" style={{ paddingBottom: '33.33%' }}>
        {slides.map((slide, idx) => (
          <div
            key={slide.id}
            className="absolute inset-0 transition-opacity duration-500"
            style={{ opacity: idx === current ? 1 : 0, zIndex: idx === current ? 1 : 0 }}
            aria-hidden={idx !== current}
          >
            {/* Background Image */}
            <img
              src={slide.image}
              alt={slide.title}
              className="absolute inset-0 w-full h-full object-cover"
            />

            {/* Dark overlay gradient */}
            <div className="absolute inset-0 bg-gradient-to-r from-dark-bg/90 via-dark-bg/50 to-transparent" />
            <div className="absolute inset-0 bg-gradient-to-t from-dark-bg/80 via-transparent to-transparent" />

            {/* Content */}
            <div className="absolute inset-0 flex flex-col justify-center px-6 sm:px-10 md:px-14">
              {/* Tag */}
              <div className="flex items-center gap-2 mb-2">
                <span className={`${slide.tagColor} text-white text-xs font-orbitron font-bold px-2 py-0.5 rounded-sm tracking-widest pulse-neon`}>
                  {slide.tag}
                </span>
                <span className="text-neon-red">{slide.icon}</span>
              </div>

              {/* Title */}
              <h2
                className="font-orbitron font-black text-2xl sm:text-3xl md:text-4xl lg:text-5xl uppercase tracking-widest text-foreground neon-text leading-none mb-1"
              >
                {slide.title}
              </h2>

              {/* Subtitle */}
              <p className="font-rajdhani font-semibold text-base sm:text-lg md:text-xl text-neon-red/90 tracking-wider uppercase mb-3">
                {slide.subtitle}
              </p>

              {/* Prize */}
              <div className="flex items-center gap-2">
                <span className="font-rajdhani text-sm text-muted-foreground uppercase tracking-wider">Prize Pool</span>
                <span className="font-orbitron font-bold text-lg sm:text-xl text-neon-red-bright neon-text">
                  {slide.prize}
                </span>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Navigation Arrows */}
      <button
        onClick={prev}
        className="absolute left-2 sm:left-4 top-1/2 -translate-y-1/2 z-10 w-8 h-8 sm:w-10 sm:h-10 rounded-full bg-dark-bg/70 border border-neon-red/50 flex items-center justify-center text-neon-red hover:bg-neon-red/20 hover:border-neon-red transition-all duration-200 neon-glow-sm"
        aria-label="Previous slide"
      >
        <ChevronLeft className="w-4 h-4 sm:w-5 sm:h-5" />
      </button>
      <button
        onClick={next}
        className="absolute right-2 sm:right-4 top-1/2 -translate-y-1/2 z-10 w-8 h-8 sm:w-10 sm:h-10 rounded-full bg-dark-bg/70 border border-neon-red/50 flex items-center justify-center text-neon-red hover:bg-neon-red/20 hover:border-neon-red transition-all duration-200 neon-glow-sm"
        aria-label="Next slide"
      >
        <ChevronRight className="w-4 h-4 sm:w-5 sm:h-5" />
      </button>

      {/* Dot Indicators */}
      <div className="absolute bottom-3 left-1/2 -translate-x-1/2 z-10 flex items-center gap-2">
        {slides.map((_, idx) => (
          <button
            key={idx}
            onClick={() => goTo(idx)}
            aria-label={`Go to slide ${idx + 1}`}
            className={`transition-all duration-300 rounded-full ${
              idx === current
                ? 'w-6 h-2 bg-neon-red neon-glow-sm'
                : 'w-2 h-2 bg-foreground/30 hover:bg-neon-red/50'
            }`}
          />
        ))}
      </div>
    </section>
  );
}
