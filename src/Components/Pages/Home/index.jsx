import { useState, useRef, useEffect, useLayoutEffect, useCallback } from "react";
import { motion, AnimatePresence, useAnimationFrame } from "framer-motion";
import heroImage from "../../../assets/hero.png";

/* ─── SAMPLE DATA ─── */
const works = [
  {
    title: "Bridal Blouse",
    tag: "Bridal",
    desc: "Heavy bridal arri work with intricate gold zari embroidery and stone detailing.",
    images: [
      "https://images.unsplash.com/photo-1610030469983-98e550d6193c?w=800&auto=format&fit=crop",
      "https://images.unsplash.com/photo-1583391733981-8498408ee4b6?w=800&auto=format&fit=crop",
      "https://images.unsplash.com/photo-1594938298603-c8148c4b3b3a?w=800&auto=format&fit=crop",
    ],
  },
  {
    title: "Arri Embroidery",
    tag: "Arri Work",
    desc: "Traditional hand-done arri thread work crafted with patience and skill.",
    images: [
      "https://images.unsplash.com/photo-1610030469983-98e550d6193c?w=800&auto=format&fit=crop",
      "https://images.unsplash.com/photo-1583391733981-8498408ee4b6?w=800&auto=format&fit=crop",
      "https://images.unsplash.com/photo-1594938298603-c8148c4b3b3a?w=800&auto=format&fit=crop",
    ],
  },
  {
    title: "Designer Saree Blouse",
    tag: "Designer",
    desc: "Custom-fit designer saree blouses with mirror work and sequin borders.",
    images: [
      "https://images.unsplash.com/photo-1610030469983-98e550d6193c?w=800&auto=format&fit=crop",
      "https://images.unsplash.com/photo-1583391733981-8498408ee4b6?w=800&auto=format&fit=crop",
      "https://images.unsplash.com/photo-1594938298603-c8148c4b3b3a?w=800&auto=format&fit=crop",
    ],
  },
  {
    title: "Casual Kurti",
    tag: "Casual",
    desc: "Lightweight cotton and silk kurtis stitched to precise measurements.",
    images: [
      "https://images.unsplash.com/photo-1610030469983-98e550d6193c?w=800&auto=format&fit=crop",
      "https://images.unsplash.com/photo-1583391733981-8498408ee4b6?w=800&auto=format&fit=crop",
      "https://images.unsplash.com/photo-1594938298603-c8148c4b3b3a?w=800&auto=format&fit=crop",
    ],
  },
  {
    title: "Wedding Lehenga",
    tag: "Bridal",
    desc: "Full lehenga blouse with heavy zardosi work, perfect for grand receptions.",
    images: [
      "https://images.unsplash.com/photo-1610030469983-98e550d6193c?w=800&auto=format&fit=crop",
      "https://images.unsplash.com/photo-1583391733981-8498408ee4b6?w=800&auto=format&fit=crop",
      "https://images.unsplash.com/photo-1594938298603-c8148c4b3b3a?w=800&auto=format&fit=crop",
    ],
  },
  {
    title: "Silk Party Wear",
    tag: "Party",
    desc: "Luxurious silk party blouses adorned with crystal and beadwork.",
    images: [
      "https://images.unsplash.com/photo-1610030469983-98e550d6193c?w=800&auto=format&fit=crop",
      "https://images.unsplash.com/photo-1583391733981-8498408ee4b6?w=800&auto=format&fit=crop",
      "https://images.unsplash.com/photo-1594938298603-c8148c4b3b3a?w=800&auto=format&fit=crop",
    ],
  },
];

/* ─── INFINITE MARQUEE CAROUSEL ─── */
/*
 * Strategy: render the cards list TWICE side-by-side (strip A + strip B).
 * We scroll left continuously. When strip A's full width has scrolled off
 * the left edge, we silently snap x back by exactly one strip width.
 * At that moment strip B is in exactly the same visual position strip A
 * was — so the viewer sees zero discontinuity. This repeats forever.
 *
 * Initial position: we start x so that the strip begins centered in the
 * viewport, showing ~4 cards from the middle of the list.
 */
function InfiniteCarousel({ onSelect }) {
  const CARD_W = 260;
  const GAP = 20;
  const STEP = CARD_W + GAP;
  const SPEED = 55; // px per second

  const wrapRef = useRef(null);
  const xRef = useRef(null); // null = "not initialized yet"
  const pauseRef = useRef(false);
  const rafRef = useRef(null);
  const lastTsRef = useRef(null);
  const [tick, setTick] = useState(0); // triggers re-render for transform update

  const stripW = works.length * STEP - GAP; // width of one copy of all cards

  // On mount, compute the starting x so cards are centered
  useLayoutEffect(() => {
    if (!wrapRef.current) return;
    const vpW = wrapRef.current.offsetWidth;
    // Total 4 cards width centered:  vpW/2 - 2*STEP  positions card index 0 at center-left
    // We want card index 1 to start roughly at the left edge of center-area
    // Centering: start so that the middle of the first 4 cards aligns with viewport center
    const centerOffset = (vpW - 4 * STEP + GAP) / 2;
    // xRef is the translateX of the strip container
    xRef.current = centerOffset;
  }, [stripW]);

  useEffect(() => {
    let lastTs = null;

    const loop = (ts) => {
      if (!pauseRef.current && xRef.current !== null) {
        const delta = lastTs === null ? 0 : ts - lastTs;
        lastTs = ts;
        xRef.current -= (delta / 1000) * SPEED;

        // When strip A has fully scrolled off left, snap forward by one strip width
        // (strip B is now in the exact visual position strip A just vacated)
        if (xRef.current <= -(stripW + GAP)) {
          xRef.current += stripW + GAP;
        }

        setTick((t) => t + 1);
      } else {
        lastTs = null;
      }
      rafRef.current = requestAnimationFrame(loop);
    };

    rafRef.current = requestAnimationFrame(loop);
    return () => cancelAnimationFrame(rafRef.current);
  }, [stripW]);

  const cards = [...works, ...works]; // strip A + strip B

  return (
    <div
      ref={wrapRef}
      className="relative overflow-hidden"
      style={{ height: 370 }}
      onMouseEnter={() => (pauseRef.current = true)}
      onMouseLeave={() => (pauseRef.current = false)}
    >
      {/* Left fade */}
      <div
        className="pointer-events-none absolute left-0 top-0 h-full w-24 z-10"
        style={{ background: "linear-gradient(to right, #d1d1d1 0%, transparent 20%)" }}
      />
      {/* Right fade */}
      <div
        className="pointer-events-none absolute right-0 top-0 h-full w-24 z-10"
        style={{ background: "linear-gradient(to left, #d1d1d1 0%, transparent 20%)" }}
      />

      {/* The scrolling strip */}
      <div
        className="flex absolute top-0 left-0"
        style={{
          gap: GAP,
          transform: xRef.current === null ? "none" : `translateX(${xRef.current}px)`,
          willChange: "transform",
        }}
      >
        {cards.map((item, i) => (
          <motion.div
            key={i}
            className="flex-shrink-0 rounded-2xl overflow-hidden cursor-pointer relative group shadow-md"
            style={{ width: CARD_W, height: 350 }}
            whileHover={{ scale: 1.05, y: -8 }}
            transition={{ type: "spring", stiffness: 320, damping: 22 }}
            onClick={() => onSelect(item)}
          >
            <img
              src={item.images[0]}
              alt={item.title}
              className="w-full h-full object-cover"
              draggable={false}
            />
            {/* Hover overlay */}
            <div className="absolute inset-0 bg-gradient-to-t from-black/75 via-black/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
            <div className="absolute bottom-0 left-0 right-0 p-4 translate-y-3 group-hover:translate-y-0 opacity-0 group-hover:opacity-100 transition-all duration-300">
              <span className="text-xs font-bold uppercase tracking-widest text-[#e7cdb5] block mb-1">
                {item.tag}
              </span>
              <h3 className="text-white font-bold text-lg leading-tight">{item.title}</h3>
              <p className="text-white/70 text-xs mt-1">Click to view ↗</p>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
}

/* ─── IMAGE MODAL ─── */
function Modal({ item, onClose }) {
  const [preview, setPreview] = useState(0);

  useEffect(() => {
    const handler = (e) => e.key === "Escape" && onClose();
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, [onClose]);

  const prev = () => setPreview((p) => (p - 1 + item.images.length) % item.images.length);
  const next = () => setPreview((p) => (p + 1) % item.images.length);

  return (
    <AnimatePresence>
      <motion.div
        className="fixed inset-0 z-50 flex items-center justify-center p-4"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        onClick={onClose}
      >
        {/* Backdrop */}
        <div className="absolute inset-0 bg-black/80 backdrop-blur-sm" />

        <motion.div
          className="relative rounded-3xl overflow-hidden w-full max-w-2xl z-10 border border-white shadow-2xl bg-white/95 backdrop-blur"
          initial={{ scale: 0.85, opacity: 0, y: 40 }}
          animate={{ scale: 1, opacity: 1, y: 0 }}
          exit={{ scale: 0.85, opacity: 0, y: 40 }}
          transition={{ type: "spring", stiffness: 280, damping: 22 }}
          onClick={(e) => e.stopPropagation()}
        >
          {/* Main image */}
          <div className="relative overflow-hidden" style={{ height: 360 }}>
            <AnimatePresence mode="wait">
              <motion.img
                key={preview}
                src={item.images[preview]}
                alt={item.title}
                className="w-full h-full object-cover"
                initial={{ opacity: 0, x: 30 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -30 }}
                transition={{ duration: 0.25 }}
              />
            </AnimatePresence>

            {/* Nav arrows */}
            {item.images.length > 1 && (
              <>
                <button
                  onClick={prev}
                  className="absolute left-3 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full border border-sky-100 bg-white/85 backdrop-blur flex items-center justify-center shadow hover:bg-sky-50 transition"
                >
                  <svg className="w-5 h-5 text-[#0f172a]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                  </svg>
                </button>
                <button
                  onClick={next}
                  className="absolute right-3 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full border border-sky-100 bg-white/85 backdrop-blur flex items-center justify-center shadow hover:bg-sky-50 transition"
                >
                  <svg className="w-5 h-5 text-[#0f172a]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                  </svg>
                </button>
              </>
            )}

            {/* Tag badge */}
            <span className="absolute top-4 left-4 bg-gradient-to-r from-[#67e8f9] to-[#818cf8] text-white text-xs font-bold uppercase tracking-widest px-3 py-1 rounded-full">
              {item.tag}
            </span>

            {/* Close */}
            <button
              onClick={onClose}
              className="absolute top-4 right-4 w-9 h-9 rounded-full bg-black/40 backdrop-blur text-white flex items-center justify-center hover:bg-black/70 transition"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>

          {/* Info + thumbnails */}
          <div className="p-5">
            <h3 className="text-2xl font-bold text-[#0f172a] mb-1">{item.title}</h3>
            <p className="text-[#64748b] text-sm mb-4">{item.desc}</p>

            {/* Thumbnails */}
            {item.images.length > 1 && (
              <div className="flex gap-3">
                {item.images.map((img, idx) => (
                  <motion.button
                    key={idx}
                    onClick={() => setPreview(idx)}
                    whileHover={{ scale: 1.07 }}
                    whileTap={{ scale: 0.95 }}
                    className={`relative rounded-xl overflow-hidden flex-shrink-0 transition-all ${
                      preview === idx
                        ? "ring-2 ring-[#38bdf8] ring-offset-2 ring-offset-white opacity-100"
                        : "opacity-60 hover:opacity-90"
                    }`}
                    style={{ width: 72, height: 72 }}
                  >
                    <img src={img} alt="" className="w-full h-full object-cover" />
                  </motion.button>
                ))}
              </div>
            )}

            {/* Dot indicators */}
            <div className="flex gap-2 mt-4 items-center">
              {item.images.map((_, idx) => (
                <button
                  key={idx}
                  onClick={() => setPreview(idx)}
                  className={`rounded-full transition-all ${
                    preview === idx
                      ? "bg-[#38bdf8] w-6 h-2"
                      : "bg-sky-100 w-2 h-2 hover:bg-sky-200"
                  }`}
                />
              ))}
            </div>
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}

/* ─── HEADER ─── */
function Header() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const links = ["Home", "About", "Works", "Contact"];

  return (
    <motion.header
      className="fixed top-0 left-0 right-0 z-50 transition-all duration-300"
      style={{
        background: scrolled ? "rgba(247,252,255,0.78)" : "transparent",
        backdropFilter: scrolled ? "blur(14px)" : "none",
        boxShadow: scrolled ? "0 12px 36px rgba(96,165,250,0.12)" : "none",
      }}
    >
      <div className="max-w-6xl mx-auto flex justify-between items-center px-5 py-4">
        {/* Logo */}
        <a href="#home" className="flex items-center gap-2 group no-underline">
          <span className="w-8 h-8 rounded-full bg-gradient-to-br from-[#7dd3fc] via-[#60a5fa] to-[#6366f1] flex items-center justify-center text-white text-sm font-bold shadow-md">
            SB
          </span>
          <span className="text-xl font-bold tracking-tight">
            <span className="text-[#1d4ed8]">Sumana</span>
            <span className="text-[#0f172a]"> Boutique</span>
          </span>
        </a>

        {/* Desktop nav */}
        <nav className="hidden md:flex items-center gap-1">
          {links.map((link) => (
            <a
              key={link}
              href={`#${link.toLowerCase()}`}
              className="relative px-4 py-2 text-sm font-semibold text-[#334155] hover:text-[#1d4ed8] transition-colors group no-underline"
            >
              {link.toUpperCase()}
              <span className="absolute bottom-1 left-4 right-4 h-0.5 bg-gradient-to-r from-[#7dd3fc] to-[#a78bfa] scale-x-0 group-hover:scale-x-100 transition-transform origin-left rounded-full" />
            </a>
          ))}
          <a
            href="#contact"
            className="ml-4 border border-sky-200 bg-white/80 hover:bg-sky-50 text-[#1d4ed8] text-sm font-semibold px-5 py-2 rounded-full shadow transition-colors backdrop-blur no-underline"
          >
            Book Now
          </a>
        </nav>

        {/* Mobile hamburger */}
        <button
          className="md:hidden w-10 h-10 flex flex-col justify-center items-center gap-1.5 !bg-transparent !border-0"
          onClick={() => setMenuOpen(!menuOpen)}
          aria-label="Toggle menu"
        >
          <motion.span
            className="block w-6 h-0.5 bg-[#1e293b] rounded-full"
            animate={menuOpen ? { rotate: 45, y: 8 } : { rotate: 0, y: 0 }}
            transition={{ duration: 0.25 }}
          />
          <motion.span
            className="block w-6 h-0.5 bg-[#1e293b] rounded-full"
            animate={menuOpen ? { opacity: 0 } : { opacity: 1 }}
            transition={{ duration: 0.2 }}
          />
          <motion.span
            className="block w-6 h-0.5 bg-[#1e293b] rounded-full"
            animate={menuOpen ? { rotate: -45, y: -8 } : { rotate: 0, y: 0 }}
            transition={{ duration: 0.25 }}
          />
        </button>
      </div>

      {/* Mobile menu */}
      <AnimatePresence>
        {menuOpen && (
          <motion.div
            className="md:hidden bg-white/90 backdrop-blur border-t border-sky-100"
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.25 }}
          >
            <nav className="flex flex-col px-5 py-4 gap-1">
              {links.map((link) => (
                <a
                  key={link}
                  href={`#${link.toLowerCase()}`}
                  onClick={() => setMenuOpen(false)}
                  className="py-3 text-sm font-semibold text-[#334155] hover:text-[#1d4ed8] border-b border-sky-100 transition-colors no-underline"
                >
                  {link.toUpperCase()}
                </a>
              ))}
              <a
                href="#contact"
                onClick={() => setMenuOpen(false)}
                className="mt-3 border border-sky-200 bg-white text-[#1d4ed8] text-sm font-semibold px-5 py-2.5 rounded-full text-center backdrop-blur no-underline"
              >
                Book Now
              </a>
            </nav>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.header>
  );
}

/* ─── HOME / HERO ─── */
function Home() {
  return (
    <section
      id="home"
      className="relative min-h-screen flex items-center justify-center overflow-hidden"
      style={{
        background: "linear-gradient(135deg, #fdfbff 0%, #eef8ff 34%, #e0f2fe 68%, #fff1f2 100%)",
      }}
    >
      {/* Decorative blobs */}
      <div className="absolute top-20 left-10 w-72 h-72 rounded-full opacity-30 blur-3xl"
        style={{ background: "radial-gradient(circle, rgba(34,211,238,0.35), transparent 65%)" }} />
      <div className="absolute bottom-20 right-10 w-96 h-96 rounded-full opacity-20 blur-3xl"
        style={{ background: "radial-gradient(circle, rgba(251,113,133,0.22), transparent 68%)" }} />

      <div className="relative text-center max-w-2xl px-5 pt-24 pb-16">
        <motion.p
          className="text-xs font-bold uppercase tracking-[0.35em] text-[#0ea5e9] mb-4"
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
        >
          Handcrafted · Bespoke · Timeless
        </motion.p>
        <motion.h1
          className="text-5xl sm:text-6xl md:text-7xl font-extrabold text-[#0f172a] leading-tight mb-5"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.35 }}
        >
          Elegant
          <span className="block text-transparent bg-clip-text"
            style={{ backgroundImage: "linear-gradient(90deg, #06b6d4, #3b82f6, #fb7185)" }}>
            Tailoring &
          </span>
          Designer Wear
        </motion.h1>
        <motion.p
          className="text-[#475569] text-lg mb-8 max-w-md mx-auto"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
        >
          Specialised in Arri works, wedding blouses & designer saree blouses — crafted with love.
        </motion.p>
        <motion.div
          className="flex flex-col sm:flex-row gap-3 justify-center"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.65 }}
        >
          <a href="#works" className="no-underline">
            <motion.button
              className="border border-sky-200 bg-white/85 hover:bg-sky-50 text-[#0f172a] font-semibold px-8 py-3 rounded-full shadow-lg backdrop-blur transition-colors"
              whileHover={{ scale: 1.04 }}
              whileTap={{ scale: 0.97 }}
            >
              Explore Works
            </motion.button>
          </a>
          <a href="#contact" className="no-underline">
            <motion.button
              className="bg-gradient-to-r from-[#22d3ee] via-[#3b82f6] to-[#fb7185] text-white font-semibold px-8 py-3 rounded-full transition-colors shadow-lg"
              whileHover={{ scale: 1.04 }}
              whileTap={{ scale: 0.97 }}
            >
              Book an Appointment
            </motion.button>
          </a>
        </motion.div>
      </div>
    </section>
  );
}

/* ─── ABOUT ─── */
function About() {
  const features = [
    { icon: "✂️", title: "Expert Tailoring", desc: "20+ years of bespoke stitching experience." },
    { icon: "🪡", title: "Arri Work", desc: "Authentic hand-embroidery passed through generations." },
    { icon: "💍", title: "Bridal Special", desc: "Heavy bridal sets for weddings and receptions." },
    { icon: "📐", title: "Custom Fit", desc: "Every piece is crafted to your exact measurements." },
  ];

  return (
    <section id="about" className="py-20 px-5 bg-white">
      <div className="max-w-5xl mx-auto text-center">
        <p className="text-xs font-bold uppercase tracking-widest text-pink-500 mb-2">Who We Are</p>
        <h2 className="text-4xl font-extrabold text-gray-900 mb-4">About Arri Designs</h2>
        <p className="text-gray-500 max-w-xl mx-auto mb-14 text-lg">
          We blend traditional artistry with modern design sensibilities to create garments that feel
          as extraordinary as the moments you wear them for.
        </p>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6">
          {features.map((f, i) => (
            <motion.div
              key={i}
              className="bg-pink-50 rounded-2xl p-6 text-left"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-40px" }}
              transition={{ delay: i * 0.1 }}
            >
              <span className="text-3xl block mb-3">{f.icon}</span>
              <h3 className="font-bold text-gray-900 mb-1">{f.title}</h3>
              <p className="text-gray-500 text-sm">{f.desc}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}

/* ─── WORKS ─── */
function AboutSection() {
  const features = [
    {
      label: "01",
      title: "Expert Tailoring",
      desc: "20+ years of bespoke stitching experience for bridal, festive, and daily wear.",
    },
    {
      label: "02",
      title: "Signature Arri Work",
      desc: "Detailed hand-embroidery that brings heritage craftsmanship into every design.",
    },
    {
      label: "03",
      title: "Custom Bridal Focus",
      desc: "Statement pieces designed for weddings, receptions, and milestone celebrations.",
    },
    {
      label: "04",
      title: "Made To Measure",
      desc: "Every blouse and outfit is shaped around your fit, comfort, and styling needs.",
    },
  ];

  const stats = [
    { value: "20+", label: "Years of tailoring experience" },
    { value: "500+", label: "Custom pieces delivered with care" },
    { value: "100%", label: "Fit-focused design approach" },
  ];

  return (
    <section
      id="about"
      className="py-20 px-5"
      style={{ background: "linear-gradient(180deg, #f8fdff 0%, #eef8ff 55%, #fff4f7 100%)" }}
    >
      <div className="max-w-6xl mx-auto">
        <div className="grid items-center gap-8 lg:grid-cols-[0.82fr_1.18fr]">
          <motion.div
            className="relative mx-auto hidden w-full max-w-[380px] overflow-hidden rounded-[2rem] border border-white/70 bg-white/60 shadow-xl backdrop-blur lg:block"
            initial={{ opacity: 0, x: -24 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, margin: "-80px" }}
            transition={{ duration: 0.55 }}
          >
            <img
              src={heroImage}
              alt="Arri Designs tailoring and embroidery showcase"
              className="h-full min-h-[300px] w-full object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/55 via-black/10 to-transparent" />
            <div className="absolute bottom-0 left-0 right-0 p-6 text-left text-white sm:p-8">
              <p className="mb-2 text-xs font-bold uppercase tracking-[0.35em] text-[#dbeafe]">About Us</p>
              <h3 className="max-w-sm text-2xl font-bold leading-tight sm:text-3xl">
                Crafted for special moments and everyday confidence.
              </h3>
            </div>
          </motion.div>

          <motion.div
            className="text-left"
            initial={{ opacity: 0, x: 24 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, margin: "-80px" }}
            transition={{ duration: 0.55, delay: 0.08 }}
          >
            <p className="mb-3 text-xs font-bold uppercase tracking-widest text-[#0ea5e9]">Who We Are</p>
            <h2 className="mb-5 text-4xl font-extrabold text-[#0f172a] sm:text-5xl">About Arri Designs</h2>
            <p className="mb-4 text-base leading-7 text-[#475569] sm:text-lg">
              Arri Designs brings together traditional tailoring, detailed arri embroidery, and
              personalized styling to create pieces that feel elegant, comfortable, and truly yours.
            </p>
            <p className="mb-8 text-base leading-7 text-[#64748b] sm:text-lg">
              From bridal blouses to custom designer wear, every outfit is shaped with care,
              precision, and an understanding of the occasion you are dressing for.
            </p>

            <div className="grid gap-4 sm:grid-cols-3">
              {stats.map((stat) => (
                <div key={stat.label} className="rounded-2xl border border-sky-100 bg-white/90 p-5 shadow-sm backdrop-blur">
                  <p className="mb-1 text-3xl font-extrabold text-[#0f172a]">{stat.value}</p>
                  <p className="text-sm leading-6 text-[#64748b]">{stat.label}</p>
                </div>
              ))}
            </div>
          </motion.div>
        </div>

        <div className="mt-12 grid grid-cols-1 gap-6 sm:grid-cols-2 xl:grid-cols-4">
          {features.map((f, i) => (
            <motion.div
              key={f.title}
              className="rounded-3xl border border-sky-100 bg-white/90 p-6 text-left shadow-sm backdrop-blur"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-40px" }}
              transition={{ delay: i * 0.1 }}
            >
              <span className="mb-4 inline-flex rounded-full border border-sky-100 bg-gradient-to-r from-[#cffafe] to-[#fee2e2] px-3 py-1 text-xs font-bold tracking-[0.25em] text-[#0369a1]">
                {f.label}
              </span>
              <h3 className="mb-2 text-lg font-bold text-[#0f172a]">{f.title}</h3>
              <p className="text-sm leading-6 text-[#64748b]">{f.desc}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}

function Works({ onSelect }) {
  return (
    <section id="works" className="py-20 overflow-hidden"
      style={{ background: "linear-gradient(180deg, #eff8ff 0%, #f8fdff 100%)" }}>
      <div className="text-center mb-12 px-5">
        <p className="text-xs font-bold uppercase tracking-widest text-[#0ea5e9] mb-2">Portfolio</p>
        <h2 className="text-4xl font-extrabold text-[#0f172a] mb-3">Our Works</h2>
        <p className="text-[#64748b] text-base max-w-md mx-auto">
          Hover to preview. Click to explore the full collection.
        </p>
      </div>

      <InfiniteCarousel onSelect={onSelect} />
    </section>
  );
}

/* ─── CONTACT ─── */
function Contact() {
  const [sent, setSent] = useState(false);

  return (
    <section id="contact" className="py-20 px-5 bg-[linear-gradient(180deg,#fdfbff_0%,#eef8ff_100%)]">
      <div className="max-w-xl mx-auto text-center">
        <p className="text-xs font-bold uppercase tracking-widest text-[#0ea5e9] mb-2">Get In Touch</p>
        <h2 className="text-4xl font-extrabold text-[#0f172a] mb-3">Contact Us</h2>
        <p className="text-[#64748b] mb-10">We'd love to work with you. Send us a message!</p>

        {sent ? (
          <motion.div
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            className="bg-green-50 border border-green-200 rounded-2xl p-8 text-green-700 font-semibold"
          >
            ✅ Message sent! We'll get back to you soon.
          </motion.div>
        ) : (
          <motion.div
            className="rounded-3xl border border-white bg-white/85 p-8 text-left flex flex-col gap-4 shadow-sm backdrop-blur"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            <input
              type="text"
              placeholder="Your Name"
              className="w-full !bg-white border border-sky-100 rounded-xl px-4 py-3 text-sm text-[#0f172a] placeholder:text-[#94a3b8] focus:outline-none focus:ring-2 focus:ring-[#38bdf8]"
            />
            <input
              type="tel"
              placeholder="Phone Number"
              className="w-full !bg-white border border-sky-100 !outline-none rounded-xl px-4 py-3 text-sm text-[#0f172a] placeholder:text-[#94a3b8] focus:outline-none focus:ring-2 focus:ring-[#38bdf8]"
            />
            <textarea
              rows={4}
              placeholder="Describe your requirement..."
              className="w-full !bg-white border border-sky-100 rounded-xl px-4 py-3 text-sm text-[#0f172a] placeholder:text-[#94a3b8] focus:outline-none focus:ring-2 focus:ring-[#38bdf8] resize-none"
            />
            <motion.button
              className="bg-gradient-to-r from-[#22d3ee] via-[#3b82f6] to-[#fb7185] text-white font-semibold px-6 py-3 rounded-full transition-colors shadow-lg"
              whileHover={{ scale: 1.03 }}
              whileTap={{ scale: 0.97 }}
              onClick={() => setSent(true)}
            >
              Send Message
            </motion.button>
          </motion.div>
        )}
      </div>
    </section>
  );
}

/* ─── FOOTER ─── */
function Footer() {
  return (
    <footer className="bg-[#08101d] text-[#c8d8ea] py-10 px-5 text-center">
      <p className="text-2xl font-bold text-white mb-1">
        <span className="text-[#8be9ff]">Arri</span> Designs
      </p>
      <p className="text-sm mb-4">Handcrafted garments, crafted with love in Salem, Tamil Nadu.</p>
      <p className="text-xs text-[#8f7a67]">© {new Date().getFullYear()} Arri Designs. All rights reserved.</p>
    </footer>
  );
}

/* ─── ROOT APP ─── */
export default function Portfolio() {
  const [selected, setSelected] = useState(null);

  return (
    <div className="font-sans antialiased">
      <Header />
      <Home />
      <AboutSection />
      <Works onSelect={setSelected} />
      <Contact />
      <Footer />

      <AnimatePresence>
        {selected && <Modal item={selected} onClose={() => setSelected(null)} />}
      </AnimatePresence>

      <style>{`
        * { box-sizing: border-box; }
        html { scroll-behavior: smooth; }
        ::-webkit-scrollbar { display: none; }
      `}</style>
    </div>
  );
}
