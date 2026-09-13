import { useRef, useEffect, useState, useCallback } from "react";

const DraggableIDCard = ({
  name        = "DEVENDRA SAINI",
  role        = "Web Developer",
  description = "I build beautiful, responsive and user-friendly websites.",
  photoUrl    = "/Devendra_Saini.png",
  linkedin    = "#",
  github      = "#",
  instagram   = "#",
}) => {
  const containerRef = useRef(null);
  const isDrag = useRef(false);
  const ds     = useRef({ mx: 0, my: 0 });
  const posR   = useRef({ x: 0, y: 0, r: 0 });
  const velR   = useRef({ x: 0, y: 0 });

  const [pos,  setPos]  = useState({ x: 0, y: 0, r: 0 });
  const [drag, setDrag] = useState(false);
  const [dim,  setDim]  = useState({ w: 1200, h: 800 }); // Default fallback

  // Update dimensions to match parent container (Hero section)
  useEffect(() => {
    const update = () => {
      if (containerRef.current) {
        setDim({ w: containerRef.current.offsetWidth, h: containerRef.current.offsetHeight });
      }
    };
    update();
    window.addEventListener("resize", update);
    return () => window.removeEventListener("resize", update);
  }, []);

  // Physics & Animation Loop (JS driven so ribbons stretch in sync with card float)
  useEffect(() => {
    let raf;
    let startTime = Date.now();
    const tick = () => {
      const t = (Date.now() - startTime) / 1000;

      if (!isDrag.current) {
        const dist = Math.hypot(posR.current.x, posR.current.y);
        const v = Math.hypot(velR.current.x, velR.current.y);

        if (dist > 15 || v > 0.5) {
          // Spring physics back to center
          velR.current.x = (velR.current.x - 0.08 * posR.current.x) * 0.70;
          velR.current.y = (velR.current.y - 0.08 * posR.current.y) * 0.70;
          posR.current.x += velR.current.x;
          posR.current.y += velR.current.y;
          posR.current.r = velR.current.x * 0.12; // tilt based on velocity
        } else {
          // Smooth idle float animation
          const floatY = Math.sin(t * 1.5) * 8; 
          const floatR = Math.sin(t * 1.2) * 1.5;
          posR.current.x += (0 - posR.current.x) * 0.1;
          posR.current.y += (floatY - posR.current.y) * 0.1;
          posR.current.r += (floatR - posR.current.r) * 0.1;
        }
        setPos({ x: posR.current.x, y: posR.current.y, r: posR.current.r });
      }
      raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, []);

  const down = useCallback((e) => {
    e.preventDefault();
    isDrag.current = true; setDrag(true);
    e.target.setPointerCapture(e.pointerId);
    ds.current = { mx: e.clientX - posR.current.x, my: e.clientY - posR.current.y };
    velR.current = { x: 0, y: 0 };
  }, []);

  const move = useCallback((e) => {
    if (!isDrag.current) return;
    const newX = e.clientX - ds.current.mx;
    const newY = e.clientY - ds.current.my;
    velR.current = { x: newX - posR.current.x, y: newY - posR.current.y };
    posR.current = { x: newX, y: newY, r: velR.current.x * 0.15 };
    setPos({ x: posR.current.x, y: posR.current.y, r: posR.current.r });
  }, []);

  const up = useCallback((e) => {
    if (!isDrag.current) return;
    isDrag.current = false; setDrag(false);
    e.target.releasePointerCapture(e.pointerId);
    velR.current.x = Math.max(-20, Math.min(20, velR.current.x));
    velR.current.y = Math.max(-20, Math.min(20, velR.current.y));
  }, []);

  const { x: dx, y: dy, r: dr } = pos;

  /* Scene Geometry */
  const SW = dim.w, SH = dim.h;
  const isTablet = dim.w <= 1024;
  const isMobile = dim.w <= 768;
  const isSmallMobile = dim.w <= 420;
  const CW = isMobile ? 250 : (isTablet ? 280 : 320);
  const CH = isMobile ? 155 : (isTablet ? 175 : 200);

  // Global scale for the whole widget (card + ribbons)
  let cardScale = 1;
  if (isSmallMobile) cardScale = 0.9;
  else if (isMobile) cardScale = 1;
  
  const CX = (SW - CW) / 2;
  // Push card higher on mobile, but on tablet lower it a bit
  const CY = isMobile ? Math.max(60, SH * 0.15) : (isTablet ? Math.max(130, SH * 0.28) : (SH - CH) / 2 + 10);
  

  const centerX = CX + CW / 2;
  const centerY = CY + CH / 2;

  // Offset distance from center to hooks (original distances unscaled)
  const offsetX = CW / 2 - 65;
  const offsetY = CH / 2 - 12;

  const LHX = centerX - offsetX * cardScale;
  const RHX = centerX + offsetX * cardScale;
  const baseHookY = centerY - offsetY * cardScale;

  // Ribbon top anchors — connected to top of hero (y=0)
  // Spread outside the card bounds for a nice V shape
  const spread = isTablet ? SW * 0.25 : SW * 0.15;
  const LTX = Math.max(0, centerX - spread); 
  const RTX = Math.min(SW, centerX + spread);

  // Dynamic card hook endpoints (moving with dx, dy)
  // When dragging, ribbons stretch elastically from top fixed points!
  const endLX = LHX + dx;
  const endLY = baseHookY + dy;
  const endRX = RHX + dx;
  const endRY = baseHookY + dy;

  // Straight line ribbons as requested, starting above the screen (-40) to hide stroke corners
  // Calculate top X proportionally so the angle remains the same
  // (though just starting at LTX, -40 is visually fine)
  const L_PATH = `M${LTX},-40 L${endLX},${endLY}`;
  const R_PATH = `M${RTX},-40 L${endRX},${endRY}`;

  /* Ribbon width changes slightly when dragged for elastic feel */
  const dist = Math.hypot(dx, dy);
  const rw   = Math.max(14, 26 - dist * 0.015);
  const ro   = Math.min(1, Math.max(0.75, 1 - dist * 0.0004));

  // Prevent drag when clicking social links
  const stopDrag = (e) => e.stopPropagation();

  return (
    <div
      ref={containerRef}
      style={{
        width: "100%", height: "100%",
        position: "absolute",
        top: 0, left: 0,
        pointerEvents: "none",
        overflow: "visible",
      }}
    >
      {/* ═══ Layer 1: RIBBONS (z-index 1, behind card) ═══ */}
      <svg
        width={SW} height={SH}
        style={{
          position: "absolute", inset: 0,
          pointerEvents: "none",
          zIndex: 1,
        }}
      >
        <defs>
          <linearGradient id="ribLG" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%"   stopColor="#4235fb"/>
            <stop offset="100%" stopColor="#4235fb"/>
          </linearGradient>
          <linearGradient id="ribRG" x1="100%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%"   stopColor="#4235fb"/>
            <stop offset="100%" stopColor="#4235fb"/>
          </linearGradient>
          <pattern id="weave" patternUnits="userSpaceOnUse" width="6" height="6" patternTransform="rotate(42)">
            <line x1="0" y1="0" x2="0" y2="6" stroke="rgba(255,255,255,0.08)" strokeWidth="2.5"/>
          </pattern>
          <filter id="ribSh" x="-30%" y="-30%" width="160%" height="160%">
            <feDropShadow dx="0" dy="5" stdDeviation="6" floodColor="rgba(79,70,229,0.6)"/>
          </filter>
        </defs>

        {/* ─── LEFT RIBBON ─── */}
        <path d={L_PATH} fill="none"
              stroke="rgba(0,0,0,0.45)" strokeWidth={rw * 1.3}
              strokeLinecap="butt" opacity={ro}/>
        <path d={L_PATH} fill="none"
              stroke="url(#ribLG)" strokeWidth={rw}
              strokeLinecap="butt" opacity={ro}
              filter="url(#ribSh)"/>
        <path d={L_PATH} fill="none"
              stroke="url(#weave)" strokeWidth={rw * 0.88}
              strokeLinecap="butt" opacity={ro}/>
        <path d={L_PATH} fill="none"
              stroke="rgba(255,255,255,0.28)" strokeWidth={rw * 0.2}
              strokeLinecap="butt" opacity={ro}/>
        <path d={L_PATH} fill="none"
              stroke="rgba(0,0,0,0.15)" strokeWidth="2"
              strokeLinecap="butt" opacity={ro}
              strokeDasharray="0"/>

        <path id="ltxt" d={L_PATH} fill="none"/>
        <text fontSize="7" fill="rgba(255,255,255,0.72)"
              fontFamily="monospace" fontWeight="700" letterSpacing="3.5">
          <textPath href="#ltxt" startOffset="35%">CREATIVE {"</>"}  </textPath>
        </text>

        {/* ─── RIGHT RIBBON ─── */}
        <path d={R_PATH} fill="none"
              stroke="rgba(0,0,0,0.45)" strokeWidth={rw * 1.3}
              strokeLinecap="butt" opacity={ro}/>
        <path d={R_PATH} fill="none"
              stroke="url(#ribRG)" strokeWidth={rw}
              strokeLinecap="butt" opacity={ro}
              filter="url(#ribSh)"/>
        <path d={R_PATH} fill="none"
              stroke="url(#weave)" strokeWidth={rw * 0.88}
              strokeLinecap="butt" opacity={ro}/>
        <path d={R_PATH} fill="none"
              stroke="rgba(255,255,255,0.28)" strokeWidth={rw * 0.2}
              strokeLinecap="butt" opacity={ro}/>

        <path id="rtxt" d={R_PATH} fill="none"/>
        <text fontSize="7" fill="rgba(255,255,255,0.72)"
              fontFamily="monospace" fontWeight="700" letterSpacing="3.5">
          <textPath href="#rtxt" startOffset="35%">{"★"} DEVELOPER  </textPath>
        </text>
      </svg>

      {/* ═══ Layer 2: ID CARD & RINGS ═══ */}
      <div
        className="id-card-wrapper"
        style={{
          position: "absolute",
          left: CX, top: CY,
          width: CW, height: CH,
          transform: `translate(${dx}px, ${dy}px) rotate(${dr}deg) scale(${cardScale})`,
          transformOrigin: "center center",
          cursor: drag ? "grabbing" : "grab",
          touchAction: "none",
          pointerEvents: "auto",
          zIndex: isMobile ? 9999 : 10,
        }}
        onPointerDown={down}
        onPointerMove={move}
        onPointerUp={up}
        onPointerCancel={up}
      >
        <div className="idb-glass">
          <div className="idb-inner">
            <div className="idb-left">
              <span className="idb-hello">HELLO, I'M</span>
              <div className="idb-name">{name}</div>
              <div className="idb-role">{role.toUpperCase()}</div>
              <div className="idb-hr"/>
              <p className="idb-desc">{description}</p>
              <div className="idb-socs">
                <a href={linkedin} className="idb-soc" aria-label="LinkedIn" target="_blank" rel="noopener noreferrer" onPointerDown={stopDrag}>
                  <svg viewBox="0 0 24 24" fill="currentColor">
                    <path d="M19 3a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h14m-.5 15.5v-5.3a3.26 3.26 0 0 0-3.26-3.26c-.85 0-1.84.52-2.32 1.3v-1.11h-2.79v8.37h2.79v-4.93c0-.77.62-1.4 1.39-1.4a1.4 1.4 0 0 1 1.4 1.4v4.93h2.79M6.88 8.56a1.68 1.68 0 0 0 1.68-1.68c0-.93-.75-1.69-1.68-1.69a1.69 1.69 0 0 0-1.69 1.69c0 .93.76 1.68 1.69 1.68m1.39 9.94v-8.37H5.5v8.37h2.77z"/>
                  </svg>
                </a>
                <a href={github} className="idb-soc" aria-label="GitHub" target="_blank" rel="noopener noreferrer" onPointerDown={stopDrag}>
                  <svg viewBox="0 0 24 24" fill="currentColor">
                    <path d="M12 2A10 10 0 0 0 2 12c0 4.42 2.87 8.17 6.84 9.5.5.08.66-.23.66-.5v-1.69c-2.77.6-3.36-1.34-3.36-1.34-.46-1.16-1.11-1.47-1.11-1.47-.91-.62.07-.6.07-.6 1 .07 1.53 1.03 1.53 1.03.87 1.52 2.34 1.07 2.91.83.09-.65.35-1.09.63-1.34-2.22-.25-4.55-1.11-4.55-4.92 0-1.11.38-2 1.03-2.71-.1-.25-.45-1.29.1-2.64 0 0 .84-.27 2.75 1.02.79-.22 1.65-.33 2.5-.33.85 0 1.71.11 2.5.33 1.91-1.29 2.75-1.02 2.75-1.02.55 1.35.2 2.39.1 2.64.65.71 1.03 1.6 1.03 2.71 0 3.82-2.34 4.66-4.57 4.91.36.31.69.92.69 1.85V21c0 .27.16.59.67.5C19.14 20.16 22 16.42 22 12A10 10 0 0 0 12 2z"/>
                  </svg>
                </a>
                <a href={instagram} className="idb-soc" aria-label="Instagram" target="_blank" rel="noopener noreferrer" onPointerDown={stopDrag}>
                  <svg viewBox="0 0 24 24" fill="currentColor">
                    <path d="M7.8 2h8.4C19.4 2 22 4.6 22 7.8v8.4a5.8 5.8 0 0 1-5.8 5.8H7.8C4.6 22 2 19.4 2 16.2V7.8A5.8 5.8 0 0 1 7.8 2m-.2 2A3.6 3.6 0 0 0 4 7.6v8.8C4 18.39 5.61 20 7.6 20h8.8a3.6 3.6 0 0 0 3.6-3.6V7.6C20 5.61 18.39 4 16.4 4H7.6m9.65 1.5a1.25 1.25 0 0 1 1.25 1.25A1.25 1.25 0 0 1 17.25 8 1.25 1.25 0 0 1 16 6.75a1.25 1.25 0 0 1 1.25-1.25M12 7a5 5 0 0 1 5 5 5 5 0 0 1-5 5 5 5 0 0 1-5-5 5 5 0 0 1 5-5m0 2a3 3 0 0 0-3 3 3 3 0 0 0 3 3 3 3 0 0 0 3-3 3 3 0 0 0-3-3z"/>
                  </svg>
                </a>
              </div>
            </div>

            <div className="idb-right">
              <div className="idb-photo-bg">
                <img src={photoUrl} alt={name} className="idb-photo" draggable={false} onError={(e) => { e.target.onerror = null; e.target.src = '/Devendra_Saini.png'; }}/>
              </div>
            </div>
          </div>

          <div className="idb-footer">
            <div className="idb-bars">
              {[...Array(26)].map((_,i) => (
                <div key={i} className="idb-bar" style={{
                  width:  i%4===0 ? "3px" : i%2===0 ? "1.8px" : "1px",
                  height: i%3===0 ? "18px" : "12px",
                }}/>
              ))}
            </div>
            <span className="idb-barnum">DevXByte-2026-FS</span>
          </div>
        </div>

        {/* Left Metal Ring */}
        <div style={{
          position: "absolute", left: 65 - 14, top: -2,
          width: 28, height: 28, zIndex: 4, pointerEvents: "none"
        }}>
          <div className="idb-ring">
            <div className="idb-ring-glare"/>
          </div>
        </div>

        {/* Right Metal Ring */}
        <div style={{
          position: "absolute", left: CW - 65 - 14, top: -2,
          width: 28, height: 28, zIndex: 4, pointerEvents: "none"
        }}>
          <div className="idb-ring">
            <div className="idb-ring-glare"/>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DraggableIDCard;
