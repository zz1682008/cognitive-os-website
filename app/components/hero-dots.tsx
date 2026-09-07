"use client";

import { useEffect, useRef } from "react";
import { prefersReducedMotion } from "./motion";

type Dot = { ox: number; oy: number; x: number; y: number; vx: number; vy: number; e: number; letter: boolean; ph: number };
type Burst = { x: number; y: number; r: number; power: number; alpha: number };

/**
 * 首屏：点阵拼出 XELITI。鼠标像一颗恒星把点推开，动得越快推得越猛；
 * 按下或空闲一段时间就炸开一次，冲击波一圈圈荡出去。
 */
export function HeroDots() {
  const canvas = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const surface = canvas.current;
    const host = surface?.parentElement;
    const context = surface?.getContext("2d");
    if (!surface || !host || !context) return;

    const reduce = prefersReducedMotion();
    let width = 0;
    let height = 0;
    let frameId = 0;
    let elapsed = 0;
    let previous = 0;
    let lastBurst = 0;
    let dots: Dot[] = [];
    const bursts: Burst[] = [];
    const pointer = { x: -1, y: -1, tx: 0.6, ty: 0.5, vx: 0, vy: 0, seen: 0 };

    function build() {
      const ratio = Math.min(2, window.devicePixelRatio || 1);
      const rect = surface!.getBoundingClientRect();
      width = rect.width;
      height = rect.height;
      if (!width || !height) return;
      surface!.width = Math.round(width * ratio);
      surface!.height = Math.round(height * ratio);
      context!.setTransform(ratio, 0, 0, ratio, 0, 0);

      dots = [];
      const loose = width < 700 ? 40 : 34;
      for (let y = loose * 0.5; y < height + loose; y += loose) {
        for (let x = loose * 0.5; x < width + loose; x += loose) {
          dots.push({ ox: x, oy: y, x, y, vx: 0, vy: 0, e: 0, letter: false, ph: 0 });
        }
      }

      // 把 XELITI 画到离屏画布上，再按网格采样成点。
      const narrow = width < 900;
      const offscreen = document.createElement("canvas");
      offscreen.width = Math.round(width);
      offscreen.height = Math.round(height);
      const off = offscreen.getContext("2d");
      if (!off) return;
      const size = (narrow ? width * 0.92 : width * 0.5) / 3.9;
      off.fillStyle = "#000";
      off.textBaseline = "middle";
      off.textAlign = "center";
      off.font = `650 ${size}px "Avenir Next","Helvetica Neue",Arial,sans-serif`;
      off.fillText("XELITI", narrow ? width * 0.5 : width * 0.72, narrow ? height * 0.78 : height * 0.5);
      const pixels = off.getImageData(0, 0, offscreen.width, offscreen.height).data;
      const gap = narrow ? 7 : 9;
      for (let y = gap * 0.5; y < height; y += gap) {
        for (let x = gap * 0.5; x < width; x += gap) {
          const index = ((y | 0) * offscreen.width + (x | 0)) * 4 + 3;
          if (pixels[index] > 128) {
            dots.push({ ox: x, oy: y, x, y, vx: 0, vy: 0, e: 0, letter: true, ph: Math.random() * 6.2832 });
          }
        }
      }
    }

    const boom = (x: number, y: number, power: number) => bursts.push({ x, y, r: 0, power, alpha: 1 });

    function paint(delta: number) {
      context!.clearRect(0, 0, width, height);
      for (let i = bursts.length - 1; i >= 0; i -= 1) {
        const burst = bursts[i];
        burst.r += (420 + burst.power * 260) * delta;
        burst.alpha -= delta * 0.55;
        if (burst.alpha <= 0) bursts.splice(i, 1);
      }

      const px = pointer.x * width;
      const py = pointer.y * height;
      const sigma = Math.max(width, height) * 0.085;
      const spread = 2 * sigma * sigma;
      const speed = Math.hypot(pointer.vx, pointer.vy);

      for (const dot of dots) {
        const wave = Math.sin((dot.ox / width) * 9.5 - elapsed * 0.5 + (dot.oy / height) * 3) * 0.5
          + Math.sin((dot.oy / height) * 7 + elapsed * 0.2) * 0.3;
        let fx = 0;
        let fy = 0;
        let energy = 0;

        const dx = dot.ox - px;
        const dy = dot.oy - py;
        const distance = Math.hypot(dx, dy) + 0.001;
        const influence = Math.exp(-(distance * distance) / spread);
        const push = influence * (26 + speed * 900);
        fx += (dx / distance) * push;
        fy += (dy / distance) * push;
        energy += influence;

        for (const burst of bursts) {
          const bx = dot.ox - burst.x;
          const by = dot.oy - burst.y;
          const bd = Math.hypot(bx, by) + 0.001;
          const ring = Math.exp(-(((bd - burst.r) / 46) ** 2)) * burst.alpha * burst.power;
          fx += (bx / bd) * ring * 34;
          fy += (by / bd) * ring * 34;
          energy += ring * 0.9;
        }

        dot.e += (Math.min(1, energy) - dot.e) * 0.2;
        const tx = dot.ox + fx;
        const ty = dot.oy + fy + wave * (dot.letter ? 1.5 : 4);
        dot.vx = (dot.vx + (tx - dot.x) * 0.14) * 0.74;
        dot.vy = (dot.vy + (ty - dot.y) * 0.14) * 0.74;
        dot.x += dot.vx;
        dot.y += dot.vy;

        const alpha = dot.letter
          ? 0.34 + 0.14 * Math.sin(elapsed * 1.2 + dot.ph) + dot.e * 0.6
          : 0.07 + 0.05 * (wave * 0.5 + 0.5) + dot.e * 0.6;
        context!.fillStyle = dot.e > 0.06
          ? `rgba(214,87,50,${Math.min(0.95, alpha + 0.15)})`
          : dot.letter ? `rgba(25,28,32,${alpha})` : `rgba(60,70,84,${alpha})`;
        context!.beginPath();
        context!.arc(dot.x, dot.y, (dot.letter ? 1.7 : 1) + dot.e * 1.8, 0, 6.2832);
        context!.fill();

        if (dot.e > 0.35) {
          context!.strokeStyle = `rgba(214,87,50,${dot.e * 0.35})`;
          context!.lineWidth = 1;
          context!.beginPath();
          context!.moveTo(dot.x, dot.y);
          context!.lineTo(dot.x - dot.vx * 2.2, dot.y - dot.vy * 2.2);
          context!.stroke();
        }
      }
    }

    function frame(now: number) {
      frameId = requestAnimationFrame(frame);
      const delta = previous ? Math.min((now - previous) / 1000, 0.08) : 0;
      previous = now;
      elapsed += delta;

      if (now - pointer.seen > 2500) {
        pointer.tx = 0.62 + Math.sin(elapsed * 0.21) * 0.26;
        pointer.ty = 0.5 + Math.cos(elapsed * 0.16) * 0.24;
        if (elapsed - lastBurst > 3.6) {
          lastBurst = elapsed;
          const narrow = width < 900;
          boom(
            (narrow ? 0.2 + Math.random() * 0.6 : 0.52 + Math.random() * 0.4) * width,
            (narrow ? 0.7 + Math.random() * 0.2 : 0.35 + Math.random() * 0.3) * height,
            0.7 + Math.random() * 0.6,
          );
        }
      }
      if (pointer.x < 0) {
        pointer.x = pointer.tx;
        pointer.y = pointer.ty;
      }
      const nx = pointer.x + (pointer.tx - pointer.x) * 0.12;
      const ny = pointer.y + (pointer.ty - pointer.y) * 0.12;
      pointer.vx = nx - pointer.x;
      pointer.vy = ny - pointer.y;
      pointer.x = nx;
      pointer.y = ny;
      paint(delta);
    }

    function start() {
      build();
      cancelAnimationFrame(frameId);
      frameId = 0;
      if (reduce) {
        pointer.x = 0.62;
        pointer.y = 0.5;
        paint(0);
        return;
      }
      previous = 0;
      frame(performance.now());
    }

    const onMove = (event: PointerEvent) => {
      const rect = surface.getBoundingClientRect();
      pointer.tx = (event.clientX - rect.left) / rect.width;
      pointer.ty = (event.clientY - rect.top) / rect.height;
      pointer.seen = performance.now();
    };
    const onDown = (event: PointerEvent) => {
      const rect = surface.getBoundingClientRect();
      boom(event.clientX - rect.left, event.clientY - rect.top, 1.6);
    };
    const onLeave = () => { pointer.seen = 0; };
    host.addEventListener("pointermove", onMove);
    host.addEventListener("pointerdown", onDown);
    host.addEventListener("pointerleave", onLeave);

    let resizeTimer = 0;
    const onResize = () => {
      window.clearTimeout(resizeTimer);
      resizeTimer = window.setTimeout(start, 160);
    };
    window.addEventListener("resize", onResize);

    let visibility: IntersectionObserver | undefined;
    if ("IntersectionObserver" in window && !reduce) {
      visibility = new IntersectionObserver(entries => {
        entries.forEach(entry => {
          if (entry.isIntersecting) {
            if (!frameId) { previous = 0; frame(performance.now()); }
          } else {
            cancelAnimationFrame(frameId);
            frameId = 0;
          }
        });
      }, { threshold: 0 });
      visibility.observe(host);
    }

    start();
    const opening = window.setTimeout(() => {
      boom(width * (width < 900 ? 0.5 : 0.72), height * (width < 900 ? 0.78 : 0.5), 1.4);
    }, 700);

    return () => {
      cancelAnimationFrame(frameId);
      window.clearTimeout(resizeTimer);
      window.clearTimeout(opening);
      window.removeEventListener("resize", onResize);
      host.removeEventListener("pointermove", onMove);
      host.removeEventListener("pointerdown", onDown);
      host.removeEventListener("pointerleave", onLeave);
      visibility?.disconnect();
    };
  }, []);

  return <canvas id="waves" ref={canvas} aria-hidden="true" />;
}
