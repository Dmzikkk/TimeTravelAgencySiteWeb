import { useState, useEffect, useRef } from "react";
import { MessageCircle, X, Send, Clock, MapPin, Star, ChevronDown, Compass, Sparkles, Calendar, Users, ArrowRight, Menu, XCircle } from "lucide-react";

const DESTINATIONS = [
  {
    id: "paris",
    name: "Paris 1889",
    epoch: "La Belle Époque",
    year: "1889",
    tagline: "Assistez à la naissance de la Tour Eiffel",
    description:
      "Plongez dans l'effervescence de l'Exposition Universelle de 1889. Découvrez Paris à son apogée culturelle, entre boulevards haussmanniens, cafés littéraires et l'inauguration de la Tour Eiffel. Une époque d'innovation et d'élégance.",
    highlights: ["Exposition Universelle", "Tour Eiffel", "Moulin Rouge", "Cafés de Montmartre"],
    price: "12 500",
    duration: "3 jours",
    difficulty: "Facile",
    color: "#D4AF37",
    gradient: "from-amber-900/80 to-amber-950/90",
    image: "/images/Paris1889_format169.png",
  },
  {
    id: "cretace",
    name: "Crétacé -65M",
    epoch: "Ère Mésozoïque",
    year: "-65 000 000",
    tagline: "Face à face avec les dinosaures",
    description:
      "Voyagez 65 millions d'années dans le passé pour observer les derniers dinosaures dans leur habitat naturel. Une aventure unique au cœur de forêts primordiales et de paysages volcaniques à couper le souffle.",
    highlights: ["Tyrannosaure Rex", "Forêts primordiales", "Volcans actifs", "Ptéranodons"],
    price: "28 900",
    duration: "2 jours",
    difficulty: "Extrême",
    color: "#2ECC71",
    gradient: "from-emerald-900/80 to-emerald-950/90",
    image: "/images/Cretace_format169.png",
  },
  {
    id: "florence",
    name: "Florence 1504",
    epoch: "La Renaissance",
    year: "1504",
    tagline: "Dans l'atelier de Michel-Ange",
    description:
      "Visitez Florence à l'apogée de la Renaissance italienne. Assistez au dévoilement du David de Michel-Ange, rencontrez Léonard de Vinci et explorez les ateliers des plus grands artistes de l'Histoire.",
    highlights: ["David de Michel-Ange", "Léonard de Vinci", "Palais Médicis", "Duomo"],
    price: "15 800",
    duration: "4 jours",
    difficulty: "Modéré",
    color: "#E74C3C",
    gradient: "from-red-900/80 to-red-950/90",
    image: "/images/RennaissanceFlorence_format169.png",
  },
];

const QUIZ_QUESTIONS = [
  {
    question: "Quel type d'expérience recherchez-vous ?",
    options: [
      { text: "Culturelle et artistique", scores: { paris: 2, florence: 3, cretace: 0 } },
      { text: "Aventure et nature", scores: { paris: 0, florence: 0, cretace: 3 } },
      { text: "Élégance et raffinement", scores: { paris: 3, florence: 2, cretace: 0 } },
    ],
  },
  {
    question: "Votre période préférée ?",
    options: [
      { text: "Histoire moderne (XIXe siècle)", scores: { paris: 3, florence: 0, cretace: 0 } },
      { text: "Temps anciens et origines", scores: { paris: 0, florence: 0, cretace: 3 } },
      { text: "Renaissance et classicisme", scores: { paris: 0, florence: 3, cretace: 0 } },
    ],
  },
  {
    question: "Vous préférez :",
    options: [
      { text: "L'effervescence urbaine", scores: { paris: 3, florence: 1, cretace: 0 } },
      { text: "La nature sauvage", scores: { paris: 0, florence: 0, cretace: 3 } },
      { text: "L'art et l'architecture", scores: { paris: 1, florence: 3, cretace: 0 } },
    ],
  },
  {
    question: "Votre activité idéale :",
    options: [
      { text: "Visiter des monuments", scores: { paris: 3, florence: 2, cretace: 0 } },
      { text: "Observer la faune", scores: { paris: 0, florence: 0, cretace: 3 } },
      { text: "Explorer des musées", scores: { paris: 1, florence: 3, cretace: 0 } },
    ],
  },
];

/* ——— Chatbot System Prompt ——— */
const CHATBOT_SYSTEM = `Tu es l'assistant virtuel de TimeTravel Agency, une agence de voyage temporel de luxe.
Ton rôle : conseiller les clients sur les meilleures destinations temporelles.

Ton ton :
- Professionnel mais chaleureux
- Passionné d'histoire
- Toujours enthousiaste sans être trop familier
- Expertise en voyage temporel (fictif mais crédible)

Tu connais parfaitement :
- Paris 1889 (Belle Époque, Tour Eiffel, Exposition Universelle) — 12 500€ pour 3 jours
- Crétacé -65M (dinosaures, nature préhistorique) — 28 900€ pour 2 jours
- Florence 1504 (Renaissance, art, Michel-Ange) — 15 800€ pour 4 jours

Équipements fournis : combinaison temporelle, traducteur universel, kit de survie adapté.
Réponds de manière concise (2-4 phrases max). Tu peux suggérer des destinations selon les intérêts du client.`;

/* ——— Utility: Animated Counter ——— */
function AnimatedNumber({ target, suffix = "", duration = 2000 }) {
  const [val, setVal] = useState(0);
  const ref = useRef(null);
  const started = useRef(false);

  useEffect(() => {
    const obs = new IntersectionObserver(
      ([e]) => {
        if (e.isIntersecting && !started.current) {
          started.current = true;
          const start = performance.now();
          const step = (now) => {
            const p = Math.min((now - start) / duration, 1);
            setVal(Math.floor(p * target));
            if (p < 1) requestAnimationFrame(step);
          };
          requestAnimationFrame(step);
        }
      },
      { threshold: 0.5 }
    );
    if (ref.current) obs.observe(ref.current);
    return () => obs.disconnect();
  }, [target, duration]);

  return (
    <span ref={ref}>
      {val.toLocaleString()}
      {suffix}
    </span>
  );
}

/* ——— Scroll‑reveal wrapper ——— */
function Reveal({ children, className = "", delay = 0 }) {
  const ref = useRef(null);
  const [visible, setVisible] = useState(false);
  useEffect(() => {
    const obs = new IntersectionObserver(([e]) => e.isIntersecting && setVisible(true), { threshold: 0.15 });
    if (ref.current) obs.observe(ref.current);
    return () => obs.disconnect();
  }, []);
  return (
    <div
      ref={ref}
      className={className}
      style={{
        opacity: visible ? 1 : 0,
        transform: visible ? "translateY(0)" : "translateY(40px)",
        transition: `opacity 0.8s ease ${delay}s, transform 0.8s ease ${delay}s`,
      }}
    >
      {children}
    </div>
  );
}

/* ——— Particle Background ——— */
function Particles() {
  const canvasRef = useRef(null);
  useEffect(() => {
    const c = canvasRef.current;
    if (!c) return;
    const ctx = c.getContext("2d");
    let raf;
    const particles = Array.from({ length: 60 }, () => ({
      x: Math.random() * window.innerWidth,
      y: Math.random() * window.innerHeight,
      r: Math.random() * 2 + 0.5,
      dx: (Math.random() - 0.5) * 0.4,
      dy: (Math.random() - 0.5) * 0.4,
      o: Math.random() * 0.5 + 0.1,
    }));
    const resize = () => { c.width = window.innerWidth; c.height = window.innerHeight; };
    resize();
    window.addEventListener("resize", resize);
    const draw = () => {
      ctx.clearRect(0, 0, c.width, c.height);
      particles.forEach((p) => {
        p.x += p.dx; p.y += p.dy;
        if (p.x < 0) p.x = c.width;
        if (p.x > c.width) p.x = 0;
        if (p.y < 0) p.y = c.height;
        if (p.y > c.height) p.y = 0;
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(212,175,55,${p.o})`;
        ctx.fill();
      });
      raf = requestAnimationFrame(draw);
    };
    draw();
    return () => { cancelAnimationFrame(raf); window.removeEventListener("resize", resize); };
  }, []);
  return <canvas ref={canvasRef} style={{ position: "absolute", inset: 0, pointerEvents: "none" }} />;
}

/* ——— MAIN APP ——— */
export default function TimeTravelAgency() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [selectedDest, setSelectedDest] = useState(null);
  const [chatOpen, setChatOpen] = useState(false);
  const [chatMessages, setChatMessages] = useState([
    { role: "assistant", content: "Bienvenue chez TimeTravel Agency ! ✨ Je suis votre guide temporel. Comment puis-je vous aider à planifier votre prochain voyage dans le temps ?" },
  ]);
  const [chatInput, setChatInput] = useState("");
  const [chatLoading, setChatLoading] = useState(false);
  const chatEndRef = useRef(null);

  /* Quiz state */
  const [quizStep, setQuizStep] = useState(-1); // -1 = not started
  const [quizScores, setQuizScores] = useState({ paris: 0, florence: 0, cretace: 0 });
  const [quizResult, setQuizResult] = useState(null);

  /* Scroll to chat end */
  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [chatMessages, chatLoading]);

  /* ——— Chat handler using Groq API ——— */
  const GROQ_API_KEY = import.meta.env.VITE_GROQ_API_KEY || "";

  const sendChat = async () => {
    if (!chatInput.trim() || chatLoading) return;
    const userMsg = chatInput.trim();
    setChatInput("");
    setChatMessages((prev) => [...prev, { role: "user", content: userMsg }]);
    setChatLoading(true);

    try {
      const history = [...chatMessages.filter((m) => m.role !== "system"), { role: "user", content: userMsg }];
      const response = await fetch("https://api.groq.com/openai/v1/chat/completions", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${GROQ_API_KEY}`,
        },
        body: JSON.stringify({
          model: "llama-3.3-70b-versatile",
          max_tokens: 1000,
          messages: [
            { role: "system", content: CHATBOT_SYSTEM },
            ...history.map((m) => ({ role: m.role, content: m.content })),
          ],
        }),
      });
      const data = await response.json();
      const reply = data.choices?.[0]?.message?.content || "Désolé, je rencontre un problème technique. Réessayez dans un instant.";
      setChatMessages((prev) => [...prev, { role: "assistant", content: reply }]);
    } catch {
      setChatMessages((prev) => [
        ...prev,
        { role: "assistant", content: "Oups, une perturbation temporelle ! Veuillez réessayer." },
      ]);
    }
    setChatLoading(false);
  };

  /* ——— Quiz handler ——— */
  const handleQuizAnswer = (option) => {
    const newScores = { ...quizScores };
    Object.keys(option.scores).forEach((k) => (newScores[k] += option.scores[k]));
    setQuizScores(newScores);

    if (quizStep < QUIZ_QUESTIONS.length - 1) {
      setQuizStep(quizStep + 1);
    } else {
      const winner = Object.entries(newScores).sort((a, b) => b[1] - a[1])[0][0];
      setQuizResult(DESTINATIONS.find((d) => d.id === winner));
    }
  };

  const resetQuiz = () => {
    setQuizStep(-1);
    setQuizScores({ paris: 0, florence: 0, cretace: 0 });
    setQuizResult(null);
  };

  const scrollTo = (id) => {
    document.getElementById(id)?.scrollIntoView({ behavior: "smooth" });
    setMenuOpen(false);
  };

  /* ————————————— RENDER ————————————— */
  return (
    <div style={{ fontFamily: "'Cormorant Garamond', Georgia, serif", background: "#0a0a0f", color: "#e8e0d0", minHeight: "100vh" }}>
      {/* Google Fonts */}
      <link href="https://fonts.googleapis.com/css2?family=Cormorant+Garamond:wght@300;400;500;600;700&family=Outfit:wght@300;400;500;600&display=swap" rel="stylesheet" />

      <style>{`
        * { margin: 0; padding: 0; box-sizing: border-box; }
        ::-webkit-scrollbar { width: 6px; }
        ::-webkit-scrollbar-track { background: #0a0a0f; }
        ::-webkit-scrollbar-thumb { background: #D4AF37; border-radius: 3px; }
        .font-sans { font-family: 'Outfit', sans-serif; }
        .gold { color: #D4AF37; }
        .bg-gold { background: #D4AF37; }
        .border-gold { border-color: #D4AF37; }
        .glow { box-shadow: 0 0 30px rgba(212,175,55,0.15); }
        .card-hover { transition: all 0.5s cubic-bezier(0.23,1,0.32,1); }
        .card-hover:hover { transform: translateY(-8px) scale(1.02); box-shadow: 0 20px 60px rgba(212,175,55,0.2); }
        .btn-gold { background: linear-gradient(135deg, #D4AF37, #B8960C); color: #0a0a0f; font-weight: 600; border: none; cursor: pointer; transition: all 0.3s; }
        .btn-gold:hover { background: linear-gradient(135deg, #E8C547, #D4AF37); transform: translateY(-2px); box-shadow: 0 8px 25px rgba(212,175,55,0.3); }
        .btn-outline { border: 1px solid #D4AF37; color: #D4AF37; background: transparent; cursor: pointer; transition: all 0.3s; }
        .btn-outline:hover { background: rgba(212,175,55,0.1); }
        .shimmer { background: linear-gradient(110deg, transparent 30%, rgba(212,175,55,0.08) 50%, transparent 70%); background-size: 200% 100%; animation: shimmer 3s infinite; }
        @keyframes shimmer { 0% { background-position: 200% 0; } 100% { background-position: -200% 0; } }
        @keyframes float { 0%,100% { transform: translateY(0); } 50% { transform: translateY(-10px); } }
        @keyframes pulse-ring { 0% { transform: scale(1); opacity: 0.6; } 100% { transform: scale(1.5); opacity: 0; } }
        .pulse-ring::before { content: ''; position: absolute; inset: -4px; border-radius: 50%; border: 2px solid #D4AF37; animation: pulse-ring 2s infinite; }
        .text-gradient { background: linear-gradient(135deg, #D4AF37, #F0D060, #D4AF37); -webkit-background-clip: text; -webkit-text-fill-color: transparent; background-clip: text; }
        .hero-overlay { background: linear-gradient(180deg, rgba(10,10,15,0.3) 0%, rgba(10,10,15,0.7) 50%, rgba(10,10,15,1) 100%); }
        .line-decor { width: 60px; height: 2px; background: linear-gradient(90deg, #D4AF37, transparent); }
        @keyframes typing { 0% { opacity: 0.3; } 50% { opacity: 1; } 100% { opacity: 0.3; } }
        .typing-dot { animation: typing 1.4s infinite; }
        .typing-dot:nth-child(2) { animation-delay: 0.2s; }
        .typing-dot:nth-child(3) { animation-delay: 0.4s; }
        .modal-backdrop { backdrop-filter: blur(8px); background: rgba(10,10,15,0.85); }
      `}</style>

      {/* ———— NAVBAR ———— */}
      <nav style={{ position: "fixed", top: 0, left: 0, right: 0, zIndex: 50, background: "rgba(10,10,15,0.85)", backdropFilter: "blur(12px)", borderBottom: "1px solid rgba(212,175,55,0.15)" }}>
        <div style={{ maxWidth: 1200, margin: "0 auto", padding: "16px 24px", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
          <div style={{ display: "flex", alignItems: "center", gap: 10, cursor: "pointer" }} onClick={() => scrollTo("hero")}>
            <Clock size={22} color="#D4AF37" />
            <span style={{ fontSize: 20, fontWeight: 600, letterSpacing: 2 }} className="text-gradient">TIMETRAVEL</span>
          </div>
          {/* Desktop Nav */}
          <div className="font-sans" style={{ display: "flex", gap: 32, alignItems: "center", fontSize: 14, letterSpacing: 1 }}>
            {[["Destinations", "destinations"], ["Quiz", "quiz"], ["Contact", "footer"]].map(([label, id]) => (
              <span key={id} onClick={() => scrollTo(id)} style={{ cursor: "pointer", color: "#a89e8c", transition: "color 0.3s" }} onMouseEnter={(e) => (e.target.style.color = "#D4AF37")} onMouseLeave={(e) => (e.target.style.color = "#a89e8c")}>
                {label.toUpperCase()}
              </span>
            ))}
            <button className="btn-gold font-sans" style={{ padding: "8px 20px", borderRadius: 6, fontSize: 13, letterSpacing: 1 }} onClick={() => setChatOpen(true)}>
              RÉSERVER
            </button>
          </div>
        </div>
      </nav>

      {/* ———— HERO ———— */}
      <section id="hero" style={{ position: "relative", minHeight: "100vh", display: "flex", alignItems: "center", justifyContent: "center", overflow: "hidden" }}>
        <Particles />
        <div style={{ position: "absolute", inset: 0, background: "radial-gradient(ellipse at 50% 30%, rgba(212,175,55,0.06) 0%, transparent 70%)" }} />
        <div style={{ position: "relative", zIndex: 10, textAlign: "center", padding: "0 24px", maxWidth: 900 }}>
          <Reveal>
            <div className="font-sans" style={{ display: "inline-flex", alignItems: "center", gap: 8, padding: "8px 20px", border: "1px solid rgba(212,175,55,0.3)", borderRadius: 30, fontSize: 12, letterSpacing: 3, color: "#D4AF37", marginBottom: 32, textTransform: "uppercase" }}>
              <Sparkles size={14} /> Voyages Temporels de Luxe
            </div>
          </Reveal>
          <Reveal delay={0.15}>
            <h1 style={{ fontSize: "clamp(40px, 8vw, 80px)", fontWeight: 300, lineHeight: 1.1, marginBottom: 24, letterSpacing: -1 }}>
              Explorez le <span className="text-gradient" style={{ fontWeight: 600 }}>Temps</span>
              <br />
              <span style={{ fontSize: "0.6em", fontWeight: 400, color: "#a89e8c" }}>comme jamais auparavant</span>
            </h1>
          </Reveal>
          <Reveal delay={0.3}>
            <p className="font-sans" style={{ fontSize: 17, color: "#a89e8c", maxWidth: 560, margin: "0 auto 40px", lineHeight: 1.7 }}>
              Trois destinations extraordinaires à travers les âges. Des voyages sur-mesure encadrés par nos experts temporels.
            </p>
          </Reveal>
          <Reveal delay={0.45}>
            <div style={{ display: "flex", gap: 16, justifyContent: "center", flexWrap: "wrap" }}>
              <button className="btn-gold font-sans" style={{ padding: "14px 36px", borderRadius: 8, fontSize: 14, letterSpacing: 1 }} onClick={() => scrollTo("destinations")}>
                DÉCOUVRIR LES DESTINATIONS
              </button>
              <button className="btn-outline font-sans" style={{ padding: "14px 36px", borderRadius: 8, fontSize: 14, letterSpacing: 1 }} onClick={() => scrollTo("quiz")}>
                TROUVER MON VOYAGE
              </button>
            </div>
          </Reveal>

          {/* Stats */}
          <Reveal delay={0.6}>
            <div style={{ display: "flex", justifyContent: "center", gap: 48, marginTop: 80, flexWrap: "wrap" }}>
              {[
                ["2 847", "Voyageurs satisfaits"],
                ["3", "Époques disponibles"],
                ["100%", "Retour garanti"],
              ].map(([num, label], i) => (
                <div key={i} style={{ textAlign: "center" }}>
                  <div className="text-gradient" style={{ fontSize: 32, fontWeight: 600 }}>{num}</div>
                  <div className="font-sans" style={{ fontSize: 12, color: "#a89e8c", letterSpacing: 2, textTransform: "uppercase", marginTop: 4 }}>{label}</div>
                </div>
              ))}
            </div>
          </Reveal>
        </div>

        {/* Scroll indicator */}
        <div style={{ position: "absolute", bottom: 32, left: "50%", transform: "translateX(-50%)", animation: "float 2s infinite" }}>
          <ChevronDown size={24} color="#D4AF37" style={{ opacity: 0.6 }} />
        </div>
      </section>

      {/* ———— DESTINATIONS ———— */}
      <section id="destinations" style={{ padding: "120px 24px", maxWidth: 1200, margin: "0 auto" }}>
        <Reveal>
          <div style={{ textAlign: "center", marginBottom: 64 }}>
            <div className="font-sans" style={{ fontSize: 12, letterSpacing: 4, color: "#D4AF37", textTransform: "uppercase", marginBottom: 16 }}>Nos Destinations</div>
            <h2 style={{ fontSize: "clamp(32px, 5vw, 52px)", fontWeight: 400, lineHeight: 1.2 }}>
              Trois Époques,<br />
              <span className="text-gradient" style={{ fontWeight: 600 }}>Mille Merveilles</span>
            </h2>
          </div>
        </Reveal>

        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(320px, 1fr))", gap: 28 }}>
          {DESTINATIONS.map((dest, i) => (
            <Reveal key={dest.id} delay={i * 0.15}>
              <div
                className="card-hover"
                style={{
                  position: "relative",
                  borderRadius: 16,
                  overflow: "hidden",
                  background: "#111118",
                  border: "1px solid rgba(212,175,55,0.12)",
                  cursor: "pointer",
                }}
                onClick={() => setSelectedDest(dest)}
              >
                {/* Image */}
                <div style={{ position: "relative", height: 220, overflow: "hidden" }}>
                  <img
                    src={dest.image}
                    alt={dest.name}
                    style={{ width: "100%", height: "100%", objectFit: "cover", transition: "transform 0.6s" }}
                    onMouseEnter={(e) => (e.target.style.transform = "scale(1.1)")}
                    onMouseLeave={(e) => (e.target.style.transform = "scale(1)")}
                  />
                  <div style={{ position: "absolute", inset: 0, background: `linear-gradient(180deg, transparent 40%, #111118 100%)` }} />
                  <div className="font-sans" style={{ position: "absolute", top: 16, right: 16, background: "rgba(10,10,15,0.8)", padding: "6px 14px", borderRadius: 20, fontSize: 12, color: "#D4AF37", letterSpacing: 1, backdropFilter: "blur(4px)" }}>
                    {dest.year}
                  </div>
                </div>

                {/* Content */}
                <div style={{ padding: "20px 24px 24px" }}>
                  <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 8 }}>
                    <div className="line-decor" />
                    <span className="font-sans" style={{ fontSize: 11, color: "#D4AF37", letterSpacing: 2, textTransform: "uppercase" }}>{dest.epoch}</span>
                  </div>
                  <h3 style={{ fontSize: 26, fontWeight: 600, marginBottom: 8, color: "#f0e8d8" }}>{dest.name}</h3>
                  <p className="font-sans" style={{ fontSize: 14, color: "#8a8070", lineHeight: 1.6, marginBottom: 20 }}>{dest.tagline}</p>
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                    <div>
                      <span className="font-sans" style={{ fontSize: 22, fontWeight: 600, color: "#D4AF37" }}>{dest.price}€</span>
                      <span className="font-sans" style={{ fontSize: 12, color: "#6a6050", marginLeft: 6 }}>/ personne</span>
                    </div>
                    <div style={{ display: "flex", alignItems: "center", gap: 6, color: "#D4AF37", fontSize: 13 }} className="font-sans">
                      Découvrir <ArrowRight size={14} />
                    </div>
                  </div>
                </div>
              </div>
            </Reveal>
          ))}
        </div>
      </section>

      {/* ———— DESTINATION MODAL ———— */}
      {selectedDest && (
        <div className="modal-backdrop" style={{ position: "fixed", inset: 0, zIndex: 60, display: "flex", alignItems: "center", justifyContent: "center", padding: 24 }} onClick={() => setSelectedDest(null)}>
          <div style={{ background: "#13131a", borderRadius: 20, maxWidth: 600, width: "100%", maxHeight: "85vh", overflow: "auto", border: "1px solid rgba(212,175,55,0.2)", position: "relative" }} onClick={(e) => e.stopPropagation()}>
            <img src={selectedDest.image} alt={selectedDest.name} style={{ width: "100%", height: 240, objectFit: "cover", borderRadius: "20px 20px 0 0" }} />
            <button onClick={() => setSelectedDest(null)} style={{ position: "absolute", top: 16, right: 16, background: "rgba(10,10,15,0.7)", border: "none", borderRadius: "50%", width: 36, height: 36, display: "flex", alignItems: "center", justifyContent: "center", cursor: "pointer", backdropFilter: "blur(4px)" }}>
              <X size={18} color="#e8e0d0" />
            </button>
            <div style={{ padding: 32 }}>
              <div className="font-sans" style={{ fontSize: 11, color: "#D4AF37", letterSpacing: 3, textTransform: "uppercase", marginBottom: 8 }}>{selectedDest.epoch}</div>
              <h2 style={{ fontSize: 36, fontWeight: 600, marginBottom: 16, color: "#f0e8d8" }}>{selectedDest.name}</h2>
              <p className="font-sans" style={{ fontSize: 15, color: "#a89e8c", lineHeight: 1.8, marginBottom: 24 }}>{selectedDest.description}</p>

              <div style={{ display: "flex", gap: 20, marginBottom: 24, flexWrap: "wrap" }}>
                {[
                  [Calendar, `${selectedDest.duration}`],
                  [MapPin, selectedDest.difficulty],
                  [Star, "4.9/5"],
                ].map(([Icon, text], i) => (
                  <div key={i} className="font-sans" style={{ display: "flex", alignItems: "center", gap: 8, fontSize: 13, color: "#a89e8c" }}>
                    <Icon size={16} color="#D4AF37" /> {text}
                  </div>
                ))}
              </div>

              <div style={{ marginBottom: 28 }}>
                <div className="font-sans" style={{ fontSize: 12, letterSpacing: 2, color: "#D4AF37", textTransform: "uppercase", marginBottom: 12 }}>Points forts</div>
                <div style={{ display: "flex", flexWrap: "wrap", gap: 8 }}>
                  {selectedDest.highlights.map((h) => (
                    <span key={h} className="font-sans" style={{ padding: "6px 14px", borderRadius: 20, background: "rgba(212,175,55,0.1)", border: "1px solid rgba(212,175,55,0.2)", fontSize: 13, color: "#D4AF37" }}>
                      {h}
                    </span>
                  ))}
                </div>
              </div>

              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "20px 0", borderTop: "1px solid rgba(212,175,55,0.12)" }}>
                <div>
                  <span className="font-sans" style={{ fontSize: 28, fontWeight: 600, color: "#D4AF37" }}>{selectedDest.price}€</span>
                  <span className="font-sans" style={{ fontSize: 13, color: "#6a6050", marginLeft: 8 }}>par personne</span>
                </div>
                <button className="btn-gold font-sans" style={{ padding: "12px 28px", borderRadius: 8, fontSize: 14 }} onClick={() => { setSelectedDest(null); setChatOpen(true); }}>
                  Réserver
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ———— QUIZ SECTION ———— */}
      <section id="quiz" style={{ padding: "100px 24px", background: "linear-gradient(180deg, #0a0a0f 0%, #0f0f18 50%, #0a0a0f 100%)" }}>
        <div style={{ maxWidth: 700, margin: "0 auto" }}>
          <Reveal>
            <div style={{ textAlign: "center", marginBottom: 48 }}>
              <div className="font-sans" style={{ fontSize: 12, letterSpacing: 4, color: "#D4AF37", textTransform: "uppercase", marginBottom: 16 }}>
                <Compass size={14} style={{ display: "inline", verticalAlign: -2, marginRight: 8 }} />
                Recommandation Personnalisée
              </div>
              <h2 style={{ fontSize: "clamp(28px, 4vw, 44px)", fontWeight: 400, lineHeight: 1.3 }}>
                Quelle époque est <span className="text-gradient" style={{ fontWeight: 600 }}>faite pour vous</span> ?
              </h2>
            </div>
          </Reveal>

          <Reveal delay={0.15}>
            <div style={{ background: "#111118", borderRadius: 20, border: "1px solid rgba(212,175,55,0.12)", padding: "40px 32px", position: "relative", overflow: "hidden" }}>
              <div className="shimmer" style={{ position: "absolute", inset: 0, pointerEvents: "none" }} />

              {quizStep === -1 && !quizResult && (
                <div style={{ textAlign: "center", position: "relative" }}>
                  <div style={{ fontSize: 48, marginBottom: 20 }}>🕰️</div>
                  <h3 style={{ fontSize: 24, fontWeight: 500, marginBottom: 12 }}>Quiz Temporel</h3>
                  <p className="font-sans" style={{ color: "#a89e8c", fontSize: 15, marginBottom: 28, lineHeight: 1.6 }}>
                    Répondez à 4 questions pour découvrir la destination idéale pour votre prochain voyage dans le temps.
                  </p>
                  <button className="btn-gold font-sans" style={{ padding: "14px 40px", borderRadius: 8, fontSize: 14, letterSpacing: 1 }} onClick={() => setQuizStep(0)}>
                    COMMENCER LE QUIZ
                  </button>
                </div>
              )}

              {quizStep >= 0 && !quizResult && (
                <div style={{ position: "relative" }}>
                  {/* Progress */}
                  <div style={{ display: "flex", gap: 8, marginBottom: 32 }}>
                    {QUIZ_QUESTIONS.map((_, i) => (
                      <div key={i} style={{ flex: 1, height: 3, borderRadius: 2, background: i <= quizStep ? "#D4AF37" : "rgba(212,175,55,0.15)", transition: "background 0.4s" }} />
                    ))}
                  </div>
                  <div className="font-sans" style={{ fontSize: 12, color: "#D4AF37", letterSpacing: 2, marginBottom: 8 }}>
                    QUESTION {quizStep + 1}/{QUIZ_QUESTIONS.length}
                  </div>
                  <h3 style={{ fontSize: 22, fontWeight: 500, marginBottom: 24, color: "#f0e8d8" }}>{QUIZ_QUESTIONS[quizStep].question}</h3>
                  <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
                    {QUIZ_QUESTIONS[quizStep].options.map((opt, i) => (
                      <button
                        key={i}
                        className="font-sans"
                        style={{
                          padding: "16px 20px",
                          borderRadius: 12,
                          border: "1px solid rgba(212,175,55,0.2)",
                          background: "rgba(212,175,55,0.04)",
                          color: "#e8e0d0",
                          fontSize: 15,
                          cursor: "pointer",
                          transition: "all 0.3s",
                          textAlign: "left",
                        }}
                        onMouseEnter={(e) => { e.target.style.background = "rgba(212,175,55,0.12)"; e.target.style.borderColor = "#D4AF37"; }}
                        onMouseLeave={(e) => { e.target.style.background = "rgba(212,175,55,0.04)"; e.target.style.borderColor = "rgba(212,175,55,0.2)"; }}
                        onClick={() => handleQuizAnswer(opt)}
                      >
                        {opt.text}
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {quizResult && (
                <div style={{ textAlign: "center", position: "relative" }}>
                  <div style={{ fontSize: 14, color: "#D4AF37", letterSpacing: 3, marginBottom: 16 }} className="font-sans">VOTRE DESTINATION IDÉALE</div>
                  <div style={{ width: 100, height: 100, borderRadius: "50%", overflow: "hidden", margin: "0 auto 20px", border: "3px solid #D4AF37" }}>
                    <img src={quizResult.image} alt={quizResult.name} style={{ width: "100%", height: "100%", objectFit: "cover" }} />
                  </div>
                  <h3 className="text-gradient" style={{ fontSize: 32, fontWeight: 600, marginBottom: 8 }}>{quizResult.name}</h3>
                  <p style={{ fontSize: 16, color: "#a89e8c", marginBottom: 8 }}>{quizResult.epoch}</p>
                  <p className="font-sans" style={{ fontSize: 14, color: "#8a8070", lineHeight: 1.7, marginBottom: 28, maxWidth: 480, margin: "0 auto 28px" }}>
                    {quizResult.description}
                  </p>
                  <div style={{ display: "flex", gap: 12, justifyContent: "center", flexWrap: "wrap" }}>
                    <button className="btn-gold font-sans" style={{ padding: "12px 28px", borderRadius: 8, fontSize: 14 }} onClick={() => { setSelectedDest(quizResult); }}>
                      Voir les détails
                    </button>
                    <button className="btn-outline font-sans" style={{ padding: "12px 28px", borderRadius: 8, fontSize: 14 }} onClick={resetQuiz}>
                      Refaire le quiz
                    </button>
                  </div>
                </div>
              )}
            </div>
          </Reveal>
        </div>
      </section>

      {/* ———— FOOTER ———— */}
      <footer id="footer" style={{ padding: "80px 24px 40px", borderTop: "1px solid rgba(212,175,55,0.1)" }}>
        <div style={{ maxWidth: 1200, margin: "0 auto" }}>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))", gap: 48, marginBottom: 60 }}>
            <div>
              <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 16 }}>
                <Clock size={20} color="#D4AF37" />
                <span style={{ fontSize: 18, fontWeight: 600, letterSpacing: 2 }} className="text-gradient">TIMETRAVEL</span>
              </div>
              <p className="font-sans" style={{ fontSize: 13, color: "#6a6050", lineHeight: 1.7 }}>
                L'agence pionnière du voyage temporel de luxe. Explorez les époques les plus fascinantes de l'Histoire en toute sécurité.
              </p>
            </div>
            <div>
              <h4 className="font-sans" style={{ fontSize: 12, letterSpacing: 3, color: "#D4AF37", textTransform: "uppercase", marginBottom: 16 }}>Destinations</h4>
              {DESTINATIONS.map((d) => (
                <p key={d.id} className="font-sans" style={{ fontSize: 14, color: "#8a8070", marginBottom: 10, cursor: "pointer" }} onClick={() => setSelectedDest(d)}>
                  {d.name}
                </p>
              ))}
            </div>
            <div>
              <h4 className="font-sans" style={{ fontSize: 12, letterSpacing: 3, color: "#D4AF37", textTransform: "uppercase", marginBottom: 16 }}>Contact</h4>
              <p className="font-sans" style={{ fontSize: 14, color: "#8a8070", marginBottom: 10 }}>contact@timetravel.agency</p>
              <p className="font-sans" style={{ fontSize: 14, color: "#8a8070", marginBottom: 10 }}>+33 1 88 00 2089</p>
              <p className="font-sans" style={{ fontSize: 14, color: "#8a8070" }}>42 Rue du Temps, Paris</p>
            </div>
          </div>
          <div style={{ textAlign: "center", paddingTop: 24, borderTop: "1px solid rgba(212,175,55,0.08)" }}>
            <p className="font-sans" style={{ fontSize: 12, color: "#4a4040", letterSpacing: 1 }}>
              © 2026 TimeTravel Agency — Projet pédagogique M1/M2 Digital & IA
            </p>
          </div>
        </div>
      </footer>

      {/* ———— CHATBOT FAB ———— */}
      {!chatOpen && (
        <button
          onClick={() => setChatOpen(true)}
          className="pulse-ring"
          style={{
            position: "fixed", bottom: 24, right: 24, zIndex: 50, width: 56, height: 56,
            borderRadius: "50%", background: "linear-gradient(135deg, #D4AF37, #B8960C)",
            border: "none", cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center",
            boxShadow: "0 4px 20px rgba(212,175,55,0.4)", transition: "transform 0.3s",
          }}
          onMouseEnter={(e) => (e.currentTarget.style.transform = "scale(1.1)")}
          onMouseLeave={(e) => (e.currentTarget.style.transform = "scale(1)")}
        >
          <MessageCircle size={24} color="#0a0a0f" />
        </button>
      )}

      {/* ———— CHATBOT WINDOW ———— */}
      {chatOpen && (
        <div style={{
          position: "fixed", bottom: 24, right: 24, zIndex: 50, width: 380, maxWidth: "calc(100vw - 48px)",
          height: 520, maxHeight: "calc(100vh - 100px)", borderRadius: 20, overflow: "hidden",
          background: "#111118", border: "1px solid rgba(212,175,55,0.2)",
          display: "flex", flexDirection: "column", boxShadow: "0 12px 48px rgba(0,0,0,0.5)",
        }}>
          {/* Header */}
          <div style={{ padding: "16px 20px", background: "linear-gradient(135deg, rgba(212,175,55,0.15), rgba(212,175,55,0.05))", borderBottom: "1px solid rgba(212,175,55,0.12)", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
            <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
              <div style={{ width: 36, height: 36, borderRadius: "50%", background: "linear-gradient(135deg, #D4AF37, #B8960C)", display: "flex", alignItems: "center", justifyContent: "center" }}>
                <Clock size={18} color="#0a0a0f" />
              </div>
              <div>
                <div style={{ fontSize: 14, fontWeight: 600, color: "#f0e8d8" }}>Guide Temporel</div>
                <div className="font-sans" style={{ fontSize: 11, color: "#6a6050" }}>En ligne</div>
              </div>
            </div>
            <button onClick={() => setChatOpen(false)} style={{ background: "none", border: "none", cursor: "pointer", padding: 4 }}>
              <X size={20} color="#a89e8c" />
            </button>
          </div>

          {/* Messages */}
          <div style={{ flex: 1, overflow: "auto", padding: 16, display: "flex", flexDirection: "column", gap: 12 }}>
            {chatMessages.map((msg, i) => (
              <div key={i} style={{ display: "flex", justifyContent: msg.role === "user" ? "flex-end" : "flex-start" }}>
                <div
                  className="font-sans"
                  style={{
                    maxWidth: "80%", padding: "10px 14px", borderRadius: 14, fontSize: 14, lineHeight: 1.6,
                    ...(msg.role === "user"
                      ? { background: "linear-gradient(135deg, #D4AF37, #B8960C)", color: "#0a0a0f", borderBottomRightRadius: 4 }
                      : { background: "rgba(255,255,255,0.05)", color: "#d0c8b8", borderBottomLeftRadius: 4 }),
                  }}
                >
                  {msg.content}
                </div>
              </div>
            ))}
            {chatLoading && (
              <div style={{ display: "flex", gap: 6, padding: "10px 14px" }}>
                {[0, 1, 2].map((i) => (
                  <div key={i} className="typing-dot" style={{ width: 8, height: 8, borderRadius: "50%", background: "#D4AF37" }} />
                ))}
              </div>
            )}
            <div ref={chatEndRef} />
          </div>

          {/* Input */}
          <div style={{ padding: "12px 16px", borderTop: "1px solid rgba(212,175,55,0.1)", display: "flex", gap: 8 }}>
            <input
              className="font-sans"
              value={chatInput}
              onChange={(e) => setChatInput(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && sendChat()}
              placeholder="Posez-moi vos questions..."
              style={{
                flex: 1, padding: "10px 14px", borderRadius: 10, border: "1px solid rgba(212,175,55,0.15)",
                background: "rgba(255,255,255,0.03)", color: "#e8e0d0", fontSize: 14, outline: "none",
              }}
              onFocus={(e) => (e.target.style.borderColor = "#D4AF37")}
              onBlur={(e) => (e.target.style.borderColor = "rgba(212,175,55,0.15)")}
            />
            <button onClick={sendChat} className="btn-gold" style={{ width: 40, height: 40, borderRadius: 10, display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
              <Send size={16} />
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
