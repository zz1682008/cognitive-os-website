"use client";

import { useEffect, useRef } from "react";
import { usePageMotionPaused } from "./xeliti-motion";

type Point = { x: number; y: number };
type Variant = "hero" | "network";
const TAU = Math.PI * 2;
const endpoints = [
  { x: .16, y: .36, angle: -2.95 },
  { x: .85, y: .25, angle: -.65 },
  { x: .86, y: .65, angle: .55 },
  { x: .21, y: .83, angle: 2.35 },
  { x: .74, y: .9, angle: 1.05 },
];
// Abstract twin-lobe point field, deliberately without anatomical surfaces.
const brainPoints = Array.from({ length: 67 * 51 }, (_, i) => {
  const x = (i % 67 / 66 * 2 - 1) * .2;
  const y = (Math.floor(i / 67) / 50 * 2 - 1) * .215;
  const edge = x * x / .04 + y * y / .046225;
  if (edge > .99 || Math.abs(x) < .005) return [];
  const depth = Math.sqrt(1 - edge);
  const fold = Math.sin(Math.abs(x) * 92 + Math.sin(y * 28) * 1.4) * Math.cos(y * 45);
  return [{ x, y: y * (y > 0 ? .92 : 1), z: depth * (.13 + fold * .025) }];
}).flat();
function brainProjection(point: typeof brainPoints[number], angle: number, tilt = -.15) {
  const x = point.x * Math.cos(angle) + point.z * Math.sin(angle);
  const z = point.z * Math.cos(angle) - point.x * Math.sin(angle);
  return { x: .5 + x, y: .4 + point.y * Math.cos(tilt) - z * Math.sin(tilt), z };
}

function signalPoint(t: number, lane: number, time: number, variant: Variant): Point {
  if (variant === "network") {
    const a = t * TAU;
    const ripple = 1 + .075 * Math.sin(a * 3 + time * .36) + .04 * Math.cos(a * 5 - time * .25);
    return {
      x: .5 + Math.cos(a) * (.255 + lane * .069) * ripple,
      y: .48 + Math.sin(a) * (.245 + lane * .064) * ripple,
    };
  }
  const envelope = Math.pow(Math.sin(Math.PI * t), .75);
  const wave = Math.sin(t * 7.2 - time * .36 + lane * .75) * .17
    + Math.sin(t * 14.2 + time * .22 + lane) * .05;
  return { x: .035 + t * .93, y: .49 + envelope * (wave + lane * .215) };
}

function streamPoint(t: number, index: number, offset: number): Point {
  const end = endpoints[index];
  const start = { x: .5 + Math.cos(end.angle) * .18, y: .4 + Math.sin(end.angle) * .19 };
  const finish = { x: end.x, y: end.y };
  const bend = Math.sin(t * Math.PI) * (offset + .035);
  return {
    x: start.x + (finish.x - start.x) * t + Math.sin(end.angle) * bend,
    y: start.y + (finish.y - start.y) * t - Math.cos(end.angle) * bend,
  };
}

function fallbackPaths(variant: Variant) {
  return Array.from({ length: 25 }, (_, lane) => Array.from({ length: 81 }, (_, i) => {
    const p = signalPoint(i / 80, lane / 12 - 1, 0, variant);
    return `${i ? "L" : "M"}${(p.x * 1000).toFixed(2)},${(p.y * 650).toFixed(2)}`;
  }).join(" "));
}

export function NeuralVisual({ variant = "hero" }: { variant?: Variant }) {
  const root = useRef<HTMLDivElement>(null);
  const canvas = useRef<HTMLCanvasElement>(null);
  const elapsed = useRef(0);
  const pointerState = useRef({ x: .5, y: .5, targetX: .5, targetY: .5, strength: 0, targetStrength: 0 });
  const paused = usePageMotionPaused();

  useEffect(() => {
    const host = root.current;
    const surface = canvas.current;
    if (!host || !surface) return;
    const context = surface.getContext("2d");
    if (!context) return;
    const ctx = context;
    const media = window.matchMedia("(prefers-reduced-motion: reduce)");
    const fine = window.matchMedia("(pointer: fine) and (min-width: 768px)");
    const dark = window.matchMedia("(prefers-color-scheme: dark)");
    let width = 1;
    let height = 1;
    let raf = 0;
    let inView = false;
    let previous = 0;
    let lastPaint = 0;
    let disposed = false;
    const pointer = pointerState.current;
    const interactive = () => !paused && !media.matches && fine.matches;

    function deform(point: Point) {
      const dx = point.x - pointer.x;
      const dy = point.y - pointer.y;
      const influence = Math.exp(-(dx * dx * 13 + dy * dy * 8)) * pointer.strength;
      return {
        x: point.x + dx * influence * .12,
        y: point.y + (pointer.y - .5) * influence * .2,
        influence,
      };
    }

    function paint() {
      ctx.clearRect(0, 0, width, height);
      const ink = dark.matches ? "182,191,201" : "76,87,101";
      const orange = dark.matches ? "237,128,95" : "192,75,41";
      const lines = width < 500 ? 29 : 43;
      const time = elapsed.current;
      if (variant === "network") {
        paintBrain(time, ink, orange);
        return;
      }
      for (let lane = 0; lane < lines; lane++) {
        const level = lane / (lines - 1) * 2 - 1;
        ctx.beginPath();
        for (let i = 0; i <= 100; i++) {
          const p = deform(signalPoint(i / 100, level, time, variant));
          if (!i) ctx.moveTo(p.x * width, p.y * height);
          else ctx.lineTo(p.x * width, p.y * height);
        }
        const accent = lane % 11 === 5;
        ctx.strokeStyle = `rgba(${accent ? orange : ink},${accent ? .48 : .12 + .1 * (1 - Math.abs(level))})`;
        ctx.lineWidth = accent ? 1.15 : .65;
        ctx.stroke();

        for (let i = 0; i < 18; i++) {
          const t = ((i / 18 + lane * .013 + time * .011) % 1);
          const p = deform(signalPoint(t, level, time, variant));
          const strength = .25 + .4 * Math.sin(t * Math.PI) + p.influence * .3;
          ctx.fillStyle = `rgba(${accent || p.influence > .42 ? orange : ink},${strength})`;
          const size = (accent ? 1.6 : .95) + p.influence * 1.25;
          if ((i + lane) % 4 === 0) ctx.fillRect(p.x * width, p.y * height, size * 2.5, .9);
          else {
            ctx.beginPath();
            ctx.arc(p.x * width, p.y * height, size, 0, TAU);
            ctx.fill();
          }
        }
      }
    }

    function paintBrain(time: number, ink: string, orange: string) {
      const angle = -.14 + Math.sin(time * .17) * .18 + (pointer.x - .5) * pointer.strength * .38;
      const tilt = -.15 + (pointer.y - .5) * pointer.strength * .15;
      const scan = Math.sin(time * .7) * .21;
      const dotScale = Math.max(.45, Math.min(1, width / 1100));
      const project = (point: typeof brainPoints[number]) => {
        const p = brainProjection(point, angle, tilt);
        return width < 500 ? { ...p, x: .5 + (p.x - .5) * 1.35, y: .4 + (p.y - .4) * .65 } : p;
      };
      brainPoints.forEach((point, index) => {
        if (width < 500 && index % 3 === 0) return;
        const p = project(point);
        const front = (p.z + .2) / .4;
        const signal = Math.exp(-Math.pow((point.y - scan) * 22, 2));
        ctx.fillStyle = `rgba(${signal > .55 ? orange : ink},${.18 + front * .6 + signal * .18})`;
        const radius = (.85 + front * 1.4 + signal * .5) * dotScale;
        ctx.beginPath();
        ctx.arc(p.x * width, p.y * height, radius, 0, TAU);
        ctx.fill();
        if (index % 7 === 0) {
          const q = project(brainPoints[(index + 68) % brainPoints.length]);
          if (Math.hypot(p.x - q.x, p.y - q.y) < .045) {
            ctx.beginPath(); ctx.moveTo(p.x * width, p.y * height); ctx.lineTo(q.x * width, q.y * height);
            ctx.strokeStyle = `rgba(${ink},.12)`; ctx.lineWidth = .5; ctx.stroke();
          }
        }
      });
      ctx.beginPath();
      ctx.ellipse(width * .5, height * .67, width * .21, height * .035, -.06, 0, TAU);
      ctx.strokeStyle = `rgba(${ink},.15)`; ctx.lineWidth = .7; ctx.stroke();
      host!.style.setProperty("--leaf-turn", `${Math.sin(time * 1.05) * 48 - 20}deg`);
      host!.style.setProperty("--brain-breathe", `${Math.sin(time * .7) * 3}px`);
        endpoints.forEach((_, index) => {
          for (let line = -2; line <= 2; line++) {
            ctx.beginPath();
            for (let i = 0; i <= 40; i++) {
              const p = streamPoint(i / 40, index, line * .009);
              if (!i) ctx.moveTo(p.x * width, p.y * height);
              else ctx.lineTo(p.x * width, p.y * height);
            }
            ctx.strokeStyle = `rgba(${ink},.12)`;
            ctx.lineWidth = .65;
            ctx.stroke();
          }
          for (let dot = 0; dot < 5; dot++) {
            const progress = (time * .14 + dot / 5 + index * .14) % 1;
            const p = streamPoint(index === 0 ? 1 - progress : progress, index, 0);
            ctx.fillStyle = `rgba(${orange},.85)`;
            ctx.beginPath();
            ctx.arc(p.x * width, p.y * height, 1.7 * dotScale, 0, TAU);
            ctx.fill();
          }
        });
    }

    function frame(now: number) {
      raf = 0;
      if (disposed || !inView || document.hidden || !interactive()) return;
      if (now - lastPaint >= 32) {
        const delta = previous ? Math.min((now - previous) / 1000, .08) : 0;
        elapsed.current += delta;
        previous = now;
        lastPaint = now;
        pointer.x += (pointer.targetX - pointer.x) * .12;
        pointer.y += (pointer.targetY - pointer.y) * .12;
        pointer.strength += (pointer.targetStrength - pointer.strength) * .09;
        paint();
      }
      raf = requestAnimationFrame(frame);
    }

    function sync() {
      cancelAnimationFrame(raf);
      raf = 0;
      previous = 0;
      paint();
      if (!disposed && inView && !document.hidden && interactive()) raf = requestAnimationFrame(frame);
    }
    function resize() {
      const bounds = host!.getBoundingClientRect();
      width = bounds.width;
      height = bounds.height;
      const ratio = Math.min(window.devicePixelRatio || 1, width < 500 ? 1.5 : 2);
      surface!.width = Math.round(width * ratio);
      surface!.height = Math.round(height * ratio);
      ctx.setTransform(ratio, 0, 0, ratio, 0, 0);
      host!.dataset.signalReady = "true";
      sync();
    }
    function move(event: PointerEvent) {
      if (!interactive() || event.pointerType === "touch") return;
      const rect = host!.getBoundingClientRect();
      pointer.targetX = Math.max(-.2, Math.min(1.2, (event.clientX - rect.left) / width));
      pointer.targetY = Math.max(.05, Math.min(.95, (event.clientY - rect.top) / height));
      pointer.targetStrength = 1;
    }
    function leave() { pointer.targetStrength = 0; pointer.targetY = .5; }
    const target = host.closest("section") || host;
    target.addEventListener("pointermove", move as EventListener, { passive: true });
    target.addEventListener("pointerleave", leave);
    const resizeObserver = new ResizeObserver(resize);
    resizeObserver.observe(host);
    const observer = new IntersectionObserver(entries => { inView = entries[0].isIntersecting; sync(); }, { threshold: 0 });
    observer.observe(host);
    document.addEventListener("visibilitychange", sync);
    media.addEventListener("change", sync);
    fine.addEventListener("change", sync);
    dark.addEventListener("change", sync);
    resize();
    return () => {
      disposed = true;
      cancelAnimationFrame(raf);
      resizeObserver.disconnect();
      observer.disconnect();
      target.removeEventListener("pointermove", move as EventListener);
      target.removeEventListener("pointerleave", leave);
      document.removeEventListener("visibilitychange", sync);
      media.removeEventListener("change", sync);
      fine.removeEventListener("change", sync);
      dark.removeEventListener("change", sync);
    };
  }, [paused, variant]);

  return <div ref={root} className={`signal-visual signal-${variant}`} role="img" aria-label={variant === "hero" ? "抽象神经信号和科技粒子组成的流动波形，可随鼠标产生形变" : "企业资料汇入同一套企业理解，财务、法务、客服和秘书台围绕交付目标协同"}>
    <svg className="signal-fallback" viewBox="0 0 1000 650" preserveAspectRatio="none" aria-hidden="true">{variant === "hero" ? fallbackPaths(variant).map((d, i) => <path d={d} key={i} />) : brainPoints.filter((_,i)=>i%5===0).map((point,i)=>{const p=brainProjection(point,-.14);return <circle key={i} cx={p.x*1000} cy={p.y*650} r={1.4} />;})}</svg>
    <canvas ref={canvas} aria-hidden="true" />
    {variant === "network" && <>
      <div className="brain-caption"><strong>企业大脑</strong><span>月底完成设备交付</span></div>
      <div className="brain-documents" aria-hidden="true"><div className="brain-sheet sheet-back"><b>公司制度</b><i /><i /><i /></div><div className="brain-sheet sheet-middle"><b>业务数据</b><i /><i /><i /></div><div className="brain-sheet sheet-front"><b>采购合同</b><span>企业文件夹</span><i /><i /><i /><i /></div></div>
      <div className="brain-artifact brain-finance" aria-hidden="true"><span>财务工作台</span><div className="brain-bars"><i /><i /><i /><i /><i /><i /></div><strong>33.4 <small>万元利润</small></strong></div>
      <div className="brain-artifact brain-legal" aria-hidden="true"><span>法务工作台</span><div className="brain-contract"><i /><i /><mark>付款与验收需对齐</mark><i /></div></div>
      <div className="brain-artifact brain-service" aria-hidden="true"><span>智能客服</span><p>可以分批交付。<br />先满足你的安装时间。</p></div>
      <div className="brain-artifact brain-secretary" aria-hidden="true"><span>秘书台</span><div className="brain-alert"><i aria-hidden="true">!</i><div>采购金额不一致<strong>60 万 <span>→</span> 68 万</strong></div></div></div>
    </>}
  </div>;
}
