"use client";

import { useEffect, useRef } from "react";
import { prefersReducedMotion } from "./motion";

const FEEDS: { text: string; style: Record<string, string> }[] = [
  { text: "采购合同.pdf", style: { left: "6%", top: "10%" } },
  { text: "8 月账 · 报表", style: { left: "1%", top: "46%" } },
  { text: "财务审批权限表", style: { left: "8%", top: "82%" } },
  { text: "续约率 70% → 85%", style: { right: "6%", top: "8%" } },
  { text: "客服记录 216 通", style: { right: "1%", top: "46%" } },
  { text: "合同审核流程", style: { right: "8%", top: "84%" } },
  { text: "经销商回款表", style: { left: "31%", top: "0" } },
  { text: "报销流程 v2", style: { right: "31%", top: "92%" } },
];

type Particle = { hx: number; hy: number; hz: number; ph: number };
type Feed = { x: number; y: number; delay: number; len: number };

/**
 * 企业大脑：一个在呼吸的核。公司的合同、账、制度、目标从核里往外长成一条条流，
 * 长到头标签才浮现并一直留着；鼠标放上去会朝鼠标再长一条。
 */
export function EnterpriseBrain() {
  const wrap = useRef<HTMLDivElement>(null);
  const canvas = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const host = wrap.current;
    const surface = canvas.current;
    const context = surface?.getContext("2d");
    if (!host || !surface || !context) return;

    const reduce = prefersReducedMotion();
    const chips = Array.from(host.querySelectorAll<HTMLElement>(".chips-fly span"));
    let width = 0;
    let height = 0;
    let frameId = 0;
    let elapsed = 0;
    let previous = 0;
    let started = 0;
    let particles: Particle[] = [];
    let feeds: Feed[] = [];
    const mouse = { x: -1, y: -1, on: false, len: 0 };

    function build() {
      const ratio = Math.min(2, window.devicePixelRatio || 1);
      const rect = surface!.getBoundingClientRect();
      width = rect.width;
      height = rect.height;
      if (!width || !height) return;
      surface!.width = Math.round(width * ratio);
      surface!.height = Math.round(height * ratio);
      context!.setTransform(ratio, 0, 0, ratio, 0, 0);

      particles = [];
      const count = width < 700 ? 500 : 1100;
      const golden = Math.PI * (3 - Math.sqrt(5));
      for (let i = 0; i < count; i += 1) {
        const y = 1 - (i / (count - 1)) * 2;
        const radius = Math.sqrt(1 - y * y);
        const theta = golden * i;
        particles.push({ hx: Math.cos(theta) * radius, hy: y, hz: Math.sin(theta) * radius, ph: Math.random() * 6.2832 });
      }

      feeds = chips.map((chip, index) => {
        const box = chip.getBoundingClientRect();
        const inLeftHalf = box.left < rect.left + width / 2;
        return {
          x: box.left - rect.left + (inLeftHalf ? box.width : 0),
          y: box.top - rect.top + box.height / 2,
          delay: index * 0.18,
          len: 0,
        };
      });
    }

    function curve(x0: number, y0: number, x1: number, y1: number, u: number) {
      const mx = (x0 + x1) / 2;
      const my = (y0 + y1) / 2;
      const nx = -(y1 - y0);
      const ny = x1 - x0;
      const length = Math.hypot(nx, ny) || 1;
      const cx = mx + (nx / length) * 42;
      const cy = my + (ny / length) * 42;
      const a = 1 - u;
      return { x: a * a * x0 + 2 * a * u * cx + u * u * x1, y: a * a * y0 + 2 * a * u * cy + u * u * y1 };
    }

    function stream(x0: number, y0: number, x1: number, y1: number, len: number, glow: number) {
      if (len <= 0) return;
      context!.beginPath();
      for (let k = 0; k <= 40; k += 1) {
        const point = curve(x0, y0, x1, y1, (k / 40) * len);
        if (k) context!.lineTo(point.x, point.y);
        else context!.moveTo(point.x, point.y);
      }
      context!.strokeStyle = `rgba(96,102,110,${0.16 + glow * 0.2})`;
      context!.lineWidth = 0.9;
      context!.stroke();
      for (let q = 0; q < 4; q += 1) {
        const u = (elapsed * 0.09 + q / 4) % 1;
        if (u > len) continue;
        const point = curve(x0, y0, x1, y1, u);
        context!.fillStyle = `rgba(214,87,50,${0.35 + 0.55 * Math.sin((u / len) * Math.PI)})`;
        context!.beginPath();
        context!.arc(point.x, point.y, 1.8 + glow, 0, 6.2832);
        context!.fill();
      }
    }

    function paint(delta: number) {
      context!.clearRect(0, 0, width, height);
      const radius = Math.min(width, height) * 0.26;
      const cx = width / 2;
      const cy = height / 2;
      const rotation = elapsed * 0.12;
      const breathe = 0.5 + 0.5 * Math.sin(elapsed * 0.9);

      const glow = context!.createRadialGradient(cx, cy, 0, cx, cy, radius * 1.6);
      glow.addColorStop(0, `rgba(214,87,50,${0.1 + breathe * 0.05})`);
      glow.addColorStop(1, "rgba(214,87,50,0)");
      context!.fillStyle = glow;
      context!.beginPath();
      context!.arc(cx, cy, radius * 1.6, 0, 6.2832);
      context!.fill();

      const lean = mouse.on
        ? { x: ((mouse.x - cx) / width) * 0.35, y: ((mouse.y - cy) / height) * 0.35 }
        : { x: 0, y: 0 };
      for (const particle of particles) {
        const x = particle.hx * Math.cos(rotation) + particle.hz * Math.sin(rotation);
        const z = particle.hz * Math.cos(rotation) - particle.hx * Math.sin(rotation);
        const pulse = 1 + Math.sin(elapsed * 0.9 + particle.hy * 2) * 0.025;
        const px = cx + x * radius * pulse + lean.x * radius * 0.3;
        const py = cy + particle.hy * radius * 0.92 * pulse + lean.y * radius * 0.3;
        const front = (z + 1) / 2;
        const alpha = 0.12 + front * 0.55;
        const hot = Math.sin(elapsed * 1.1 + particle.ph) > 0.965;
        context!.fillStyle = hot ? `rgba(214,87,50,${alpha + 0.2})` : `rgba(60,70,84,${alpha})`;
        context!.beginPath();
        context!.arc(px, py, 0.7 + front * 1.3 + (hot ? 0.6 : 0), 0, 6.2832);
        context!.fill();
      }

      const since = started ? elapsed - started : 0;
      feeds.forEach((feed, index) => {
        const target = Math.max(0, Math.min(1, (since - feed.delay) / 1.1));
        feed.len += (target - feed.len) * Math.min(1, delta * 5);
        const angle = Math.atan2(feed.y - cy, feed.x - cx);
        stream(cx + Math.cos(angle) * radius * 0.95, cy + Math.sin(angle) * radius * 0.88, feed.x, feed.y, feed.len, 0);
        const chip = chips[index];
        if (chip) {
          chip.style.opacity = String(Math.max(0, Math.min(1, (feed.len - 0.7) / 0.25)));
          chip.style.transform = `translateY(${(1 - Math.min(1, feed.len)) * 8}px)`;
        }
      });

      mouse.len += ((mouse.on ? 1 : 0) - mouse.len) * delta * (mouse.on ? 3 : 2);
      if (mouse.len > 0.02 && mouse.x >= 0) {
        const angle = Math.atan2(mouse.y - cy, mouse.x - cx);
        stream(cx + Math.cos(angle) * radius * 0.95, cy + Math.sin(angle) * radius * 0.88, mouse.x, mouse.y, mouse.len, 0.8);
        context!.fillStyle = `rgba(214,87,50,${mouse.len * 0.5})`;
        context!.beginPath();
        context!.arc(mouse.x, mouse.y, 3 + mouse.len * 3, 0, 6.2832);
        context!.fill();
      }
    }

    function frame(now: number) {
      frameId = requestAnimationFrame(frame);
      const delta = previous ? Math.min((now - previous) / 1000, 0.08) : 0;
      previous = now;
      elapsed += delta;
      paint(delta);
    }

    function start() {
      build();
      cancelAnimationFrame(frameId);
      frameId = 0;
      previous = 0;
      if (reduce) {
        started = -100;
        elapsed = 100;
        feeds.forEach(feed => { feed.len = 1; });
        chips.forEach(chip => { chip.style.opacity = "1"; });
        paint(0);
        return;
      }
      frame(performance.now());
    }

    const onMove = (event: PointerEvent) => {
      const rect = surface.getBoundingClientRect();
      mouse.x = event.clientX - rect.left;
      mouse.y = event.clientY - rect.top;
      mouse.on = true;
    };
    const onLeave = () => { mouse.on = false; };
    host.addEventListener("pointermove", onMove);
    host.addEventListener("pointerleave", onLeave);
    window.addEventListener("resize", start);

    let visibility: IntersectionObserver | undefined;
    if ("IntersectionObserver" in window && !reduce) {
      visibility = new IntersectionObserver(entries => {
        entries.forEach(entry => {
          if (entry.isIntersecting) {
            if (!frameId) { previous = 0; frame(performance.now()); }
            if (!started) { started = elapsed + 0.1; feeds.forEach(feed => { feed.len = 0; }); }
          } else {
            cancelAnimationFrame(frameId);
            frameId = 0;
          }
        });
      }, { threshold: 0.2 });
      visibility.observe(host);
    }

    start();
    return () => {
      cancelAnimationFrame(frameId);
      window.removeEventListener("resize", start);
      host.removeEventListener("pointermove", onMove);
      host.removeEventListener("pointerleave", onLeave);
      visibility?.disconnect();
    };
  }, []);

  return (
    <div className="core-wrap" ref={wrap} data-rv>
      <canvas id="core-cv" ref={canvas} aria-hidden="true" />
      <div className="chips-fly" aria-hidden="true">
        {FEEDS.map(feed => (
          <span key={feed.text} style={feed.style as React.CSSProperties}><i />{feed.text}</span>
        ))}
      </div>
    </div>
  );
}
