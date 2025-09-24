import React, { useEffect, useMemo, useRef, useState } from "react";

const phone = "5493416616922"; // sin + ni guiones
const message = encodeURIComponent("Hola, quiero jugar y mi 20% extra");
const WHATSAPP_LINK = `https://wa.me/${phone}?text=${message}`;

// --- Meta Pixel helper seguro (no rompe si fbq no existe)
function trackPixelCustom(event: string, params: Record<string, any> = {}) {
  try {
    const fbq = (window as any).fbq;
    if (typeof fbq === "function") fbq("trackCustom", event, params);
  } catch {}
}

// --- Overlay: permite apagar rápido con ?nooverlay=1
function overlayDisabledByQuery(): boolean {
  if (typeof window === "undefined") return false;
  const qs = new URLSearchParams(window.location.search);
  return qs.get("nooverlay") === "1";
}

export default function LandingCasino() {
  // Counter que arranca >= 2200 y sube solo
  const initialCount = useMemo(() => 2200 + Math.floor(Math.random() * 500), []);
  const [players, setPlayers] = useState<number>(initialCount);

  useEffect(() => {
    const id = setInterval(() => {
      setPlayers((p) => p + 2 + Math.floor(Math.random() * 4)); // +2..+5
    }, 3500);
    return () => clearInterval(id);
  }, []);

  // Testimonios (10)
  const testimonials = [
    { name: "Carlos R.", text: "La mejor experiencia, rápido y confiable.", avatar: "https://i.pravatar.cc/100?img=12" },
    { name: "Mariana L.", text: "Me divertí y además gané, excelente atención.", avatar: "https://i.pravatar.cc/100?img=47" },
    { name: "Jorge P.", text: "Nunca pensé que sería tan fácil empezar a jugar.", avatar: "https://i.pravatar.cc/100?img=22" },
    { name: "Lucía S.", text: "Atención por WhatsApp al instante, súper simple.", avatar: "https://i.pravatar.cc/100?img=65" },
    { name: "Pablo G.", text: "El bono de bienvenida fue increíble.", avatar: "https://i.pravatar.cc/100?img=31" },
    { name: "Ana M.", text: "Me encanta la rapidez del soporte por WhatsApp.", avatar: "https://i.pravatar.cc/100?img=5" },
    { name: "Roberto D.", text: "Los juegos son variados y divertidos.", avatar: "https://i.pravatar.cc/100?img=8" },
    { name: "Sofía V.", text: "Excelente diseño, muy intuitivo.", avatar: "https://i.pravatar.cc/100?img=49" },
    { name: "Martín C.", text: "Es seguro y transparente, muy recomendado.", avatar: "https://i.pravatar.cc/100?img=10" },
    { name: "Laura F.", text: "Nunca pensé que me iba a divertir tanto.", avatar: "https://i.pravatar.cc/100?img=39" },
  ];
  const [idx, setIdx] = useState(0);
  const rotatingRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    const id = setInterval(() => setIdx((i) => (i + 1) % testimonials.length), 3500);
    return () => clearInterval(id);
  }, [testimonials.length]);

  const t = testimonials[idx];

  // Tracking Meta para clicks a WhatsApp (botones visibles)
  const trackWspClick = (position: "hero" | "sticky" | "bottom") => {
    try {
      const fbq = (window as any).fbq;
      if (fbq) {
        fbq("track", "Contact", { channel: "WhatsApp", position });
        fbq("trackCustom", "WhatsAppClick", { channel: "WhatsApp", position });
      }
      // Respaldo por si el navegador navega muy rápido:
      new Image().src =
        "https://www.facebook.com/tr?id=2257303394731974&ev=Contact&noscript=1" +
        `&cd[channel]=WhatsApp&cd[position]=${encodeURIComponent(position)}`;
    } catch {}
  };

  // ---------------- Overlay SIEMPRE ACTIVO ----------------
  const overlayActive = !overlayDisabledByQuery();
  const redirectedRef = useRef(false);

  const doRedirect = (source: "overlay" | "click" | "scroll" | "wheel" | "touch") => {
    if (redirectedRef.current) return;
    redirectedRef.current = true;
    trackPixelCustom("OverlayRedirect", { source });
    setTimeout(() => {
      window.location.href = WHATSAPP_LINK;
    }, 120); // da tiempo a que flushee el evento
  };

  useEffect(() => {
    if (!overlayActive) return;
    // Evitar disparar por eventos del mount
    const armTimer = setTimeout(() => {
      const onClick = () => doRedirect("click");
      const onTouch = () => doRedirect("touch");
      const onWheel = () => doRedirect("wheel");
      let scrolled = false;
      const onScroll = () => {
        if (!scrolled) {
          scrolled = true;
          doRedirect("scroll");
        }
      };

      document.addEventListener("click", onClick, { passive: true });
      document.addEventListener("touchstart", onTouch, { passive: true });
      document.addEventListener("wheel", onWheel, { passive: true });
      document.addEventListener("scroll", onScroll, { passive: true });

      return () => {
        document.removeEventListener("click", onClick as any);
        document.removeEventListener("touchstart", onTouch as any);
        document.removeEventListener("wheel", onWheel as any);
        document.removeEventListener("scroll", onScroll as any);
      };
    }, 400);

    return () => clearTimeout(armTimer);
  }, [overlayActive]);
  // --------------------------------------------------------

  return (
    <main className="relative min-h-screen w-full text-white font-sans flex items-center justify-center p-4">
      {/* Capa de fondo con IMG ABSOLUTA */}
      <div className="absolute inset-0 -z-10 pointer-events-none">
        <img
          src="/casino-bg.jpg"   // <- la imagen que subiste a /public
          alt="Fondo de casino"
          className="w-full h-full object-cover"
        />
      </div>

      {/* Overlay oscuro para que el texto sea legible */}
      <div className="absolute inset-0 bg-black/50 pointer-events-none -z-0" />

      {/* Contenido */}
      <div className="relative z-10 w-full max-w-5xl">
        {/* HERO */}
        <section className="relative overflow-hidden rounded-3xl p-8 md:p-12 bg-black/20 backdrop-blur-sm border border-white/10 shadow-2xl">
          <div className="relative z-10 flex flex-col items-center text-center gap-6">
            <h1 className="text-4xl sm:text-5xl font-extrabold leading-tight drop-shadow">
              La emoción del juego en un solo click
            </h1>
            <p className="text-white/80 text-lg">Únete a miles de jugadores disfrutando ahora mismo</p>

            <a
              href={WHATSAPP_LINK}
              target="_blank"
              rel="noopener noreferrer"
              onMouseDown={() => trackWspClick("hero")}
              onClick={() => trackWspClick("hero")}
              className="inline-flex items-center justify-center gap-3 mt-1 px-6 py-4 rounded-2xl bg-[#25D366] hover:scale-[1.02] active:scale-95 transition shadow-lg shadow-[#25D366]/30 text-black font-bold w-full sm:w-auto"
            >
              {/* ícono WhatsApp */}
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-6 h-6">
                <path d="M20.52 3.48A11.94 11.94 0 0012.06 0C5.46 0 .1 5.36.1 11.96c0 2.11.55 4.17 1.6 5.98L0 24l6.25-1.64a12.01 12.01 0 005.8 1.48h.01c6.6 0 11.96-5.36 11.96-11.96 0-3.2-1.25-6.2-3.5-8.4zM12.06 22a9.98 9.98 0 01-5.09-1.4l-.36-.21-3.71.97.99-3.62-.24-.37A10 10 0 1122.06 12c0 5.52-4.48 10-10 10zm5.77-7.5c-.31-.15-1.83-.9-2.12-1-.29-.1-.5-.15-.71.15-.21.31-.81 1-.99 1.2-.18.21-.36.23-.67.08-.31-.15-1.3-.48-2.47-1.54-.91-.81-1.53-1.81-1.71-2.11-.18-.31-.02-.48.13-.63.13-.13.31-.34.44-.52.15-.18.19-.31.29-.52.1-.21.05-.39-.03-.54-.08-.15-.71-1.72-.98-2.36-.26-.63-.52-.55-.71-.56l-.61-.01c-.21 0-.54.08-.82.39-.28.31-1.08 1.05-1.08 2.56 0 1.51 1.1 2.97 1.26 3.17.15.21 2.16 3.29 5.24 4.61.73.31 1.3.49 1.75.63.73.23 1.4.2 1.93.12.59-.09 1.83-.75 2.09-1.47.26-.72.26-1.33.18-1.47-.08-.13-.29-.21-.6-.36z" />
              </svg>
              ¡Jugar ahora!
            </a>

            {/* Contador */}
            <div className="mt-4">
              <p className="text-sm uppercase tracking-widest text-white/70">Jugadores activos en este momento</p>
              <div className="mt-2 inline-flex items-center gap-3 rounded-xl bg-black/70 backdrop-blur border border-white/10 px-5 py-3 shadow-inner">
                <span className="font-mono text-5xl font-extrabold tabular-nums drop-shadow-[0_0_16px_rgba(0,255,140,0.6)] text-[#8CFFBF]">
                  {players.toLocaleString("es-AR")}
                </span>
                <span className="text-white/70">↑ en tiempo real</span>
              </div>
            </div>

            {/* Testimonios rotativos */}
            <div className="w-full max-w-xl mx-auto rounded-3xl bg-black/30 border border-white/10 p-6 backdrop-blur">
              <p className="text-sm text-white/70 mb-3 text-center">Opiniones de jugadores</p>
              <div ref={rotatingRef} className="relative overflow-hidden h-36 md:h-40 rounded-2xl" aria-live="polite">
                <div key={idx} className="absolute inset-0 animate-[fadeSlide_3.3s_ease-in-out_both]">
                  <div className="flex items-center gap-4 justify-center">
                    <img src={t.avatar} alt={t.name} className="w-14 h-14 rounded-full ring-2 ring-white/20 object-cover" />
                    <div>
                      <div className="flex items-center gap-2 justify-center">
                        <span className="font-semibold">{t.name}</span>
                        <span className="text-yellow-300" aria-label="5 estrellas">★★★★★</span>
                      </div>
                      <p className="text-white/90 mt-1 text-center">{t.text}</p>
                    </div>
                  </div>
                </div>
              </div>

              <a
                href={WHATSAPP_LINK}
                target="_blank"
                rel="noopener noreferrer"
                onMouseDown={() => trackWspClick("bottom")}
                onClick={() => trackWspClick("bottom")}
                className="mt-6 inline-flex items-center justify-center w-full px-6 py-4 rounded-2xl bg-[#25D366] text-black font-bold hover:scale-[1.01] active:scale-95 transition shadow-lg shadow-[#25D366]/30"
              >
                ¡Jugar ahora por WhatsApp!
              </a>
            </div>
          </div>
        </section>

        {/* Footer */}
        <footer className="mt-6 text-center text-xs text-white/50">
          Juego responsable. Solo mayores de 18 años. © {new Date().getFullYear()} Tu Marca — Todos los derechos reservados.
        </footer>
      </div>

      {/* CTA sticky en mobile */}
      <a
        href={WHATSAPP_LINK}
        target="_blank"
        rel="noopener noreferrer"
        onMouseDown={() => trackWspClick("sticky")}
        onClick={() => trackWspClick("sticky")}
        className="fixed bottom-4 left-4 right-4 sm:hidden inline-flex items-center justify-center gap-2 rounded-2xl bg-[#25D366] text-black font-bold px-6 py-4 shadow-xl shadow-[#25D366]/30"
      >
        WhatsApp — ¡Jugar ahora!
      </a>

      {/* Overlay TRANSPARENTE SIEMPRE ACTIVO: captura click/touch/scroll/wheel */}
      {overlayActive && (
        <div
          className="fixed inset-0 z-[9999] bg-transparent cursor-pointer"
          onClick={() => doRedirect("overlay")}
          aria-hidden="true"
        />
      )}

      {/* Animaciones */}
      <style>{`
        @keyframes fadeSlide {
          0% { opacity: 0; transform: translateY(10px); }
          8% { opacity: 1; transform: translateY(0); }
          92% { opacity: 1; transform: translateY(0); }
          100% { opacity: 0; transform: translateY(-10px); }
        }
      `}</style>
    </main>
  );
}