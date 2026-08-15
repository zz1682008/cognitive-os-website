"use client";

import { useEffect } from "react";

const wait = (ms: number) => new Promise<void>((resolve) => setTimeout(resolve, ms));

/**
 * 逐段移植自设计稿 massos-site-v4.html 的内联脚本：
 * 平台文案、紧凑导航、滚动显现、移动菜单、产品菜单悬停、
 * 首屏字母信号场、页脚 0/1 字标、各产品演示动画。
 */
export function SiteRuntime() {
  useEffect(() => {
    const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const cleanups: Array<() => void> = [];
    const on = (
      target: EventTarget,
      type: string,
      listener: EventListener,
      options?: AddEventListenerOptions,
    ) => {
      target.addEventListener(type, listener, options);
      cleanups.push(() => target.removeEventListener(type, listener, options));
    };
    const watch = (observer: IntersectionObserver | ResizeObserver) => {
      cleanups.push(() => observer.disconnect());
    };

    /* ---------- 平台文案 ---------- */
    const uaData = (navigator as { userAgentData?: { platform?: string } }).userAgentData;
    const platformName = String(uaData?.platform || navigator.platform || navigator.userAgent).toLowerCase();
    let platformShort = "桌面版";
    let platformCopy = "桌面版本准备中";
    let platformState = "桌面版本准备中";
    if (platformName.includes("mac")) {
      platformShort = "Mac";
      platformCopy = "macOS 下载准备中";
      platformState = "macOS 版本准备中";
    } else if (platformName.includes("win")) {
      platformShort = "Windows";
      platformCopy = "Windows 下载准备中";
      platformState = "Windows 版本准备中";
    } else if (platformName.includes("linux")) {
      platformShort = "Linux";
      platformCopy = "Linux 下载准备中";
      platformState = "Linux 版本准备中";
    }
    document.querySelectorAll("[data-platform-short]").forEach((element) => {
      element.textContent = platformShort;
    });
    document.querySelectorAll("[data-platform-copy]").forEach((element) => {
      element.textContent = platformCopy;
    });
    document.querySelectorAll("[data-platform-state]").forEach((element) => {
      element.textContent = platformState;
    });

    /* ---------- 紧凑导航与滚动方向显隐 ---------- */
    const header = document.getElementById("site-header");
    const topAnchor = document.getElementById("top");
    if (header && topAnchor) {
      const headerObserver = new IntersectionObserver(
        ([entry]) => {
          header.classList.toggle("is-compact", !entry.isIntersecting);
        },
        { rootMargin: "-72px 0px 0px 0px" },
      );
      headerObserver.observe(topAnchor);
      watch(headerObserver);

      let previousScrollY = Math.max(0, window.scrollY);
      let directionStartY = previousScrollY;
      let previousDirection: "up" | "down" | null = null;
      let headerFrame = 0;

      const showHeader = () => header.classList.remove("is-hidden");
      const updateHeaderVisibility = () => {
        headerFrame = 0;
        const currentScrollY = Math.max(0, window.scrollY);
        const delta = currentScrollY - previousScrollY;
        const direction = delta > 0 ? "down" : delta < 0 ? "up" : previousDirection;

        if (direction !== previousDirection) {
          previousDirection = direction;
          directionStartY = previousScrollY;
        }

        const menuIsOpen = document.body.classList.contains("menu-open");
        const productMenuIsOpen = Boolean(header.querySelector<HTMLDetailsElement>(".product-menu")?.open);
        const focusIsInside = header.contains(document.activeElement);

        if (currentScrollY <= 24 || menuIsOpen || productMenuIsOpen || focusIsInside) {
          showHeader();
        } else if (direction === "down" && currentScrollY > 96 && currentScrollY - directionStartY >= 10) {
          header.classList.add("is-hidden");
        } else if (direction === "up" && directionStartY - currentScrollY >= 6) {
          showHeader();
        }

        previousScrollY = currentScrollY;
      };

      const scheduleHeaderUpdate = () => {
        if (headerFrame) return;
        headerFrame = window.requestAnimationFrame(updateHeaderVisibility);
      };

      on(document, "scroll", scheduleHeaderUpdate, { passive: true });
      on(header, "focusin", showHeader);
      cleanups.push(() => {
        if (headerFrame) window.cancelAnimationFrame(headerFrame);
      });
    }

    /* ---------- 滚动显现 ---------- */
    const revealObserver = new IntersectionObserver(
      (entries, observer) => {
        entries.forEach((entry) => {
          if (!entry.isIntersecting) return;
          entry.target.classList.add("is-visible");
          observer.unobserve(entry.target);
        });
      },
      { threshold: 0.14, rootMargin: "0px 0px -8% 0px" },
    );
    document
      .querySelectorAll("main > section:not([hidden]) .reveal, footer .reveal")
      .forEach((element) => revealObserver.observe(element));
    watch(revealObserver);

    /* ---------- 移动菜单 ---------- */
    const menuButton = document.querySelector<HTMLButtonElement>(".mobile-menu-button");
    const mobilePanel = document.getElementById("mobile-panel");
    if (menuButton && mobilePanel) {
      const closeMobileMenu = () => {
        menuButton.setAttribute("aria-expanded", "false");
        menuButton.setAttribute("aria-label", "打开导航");
        mobilePanel.classList.remove("is-open");
        mobilePanel.setAttribute("aria-hidden", "true");
        document.body.classList.remove("menu-open");
      };
      on(menuButton, "click", () => {
        const open = menuButton.getAttribute("aria-expanded") === "true";
        if (open) {
          closeMobileMenu();
          return;
        }
        menuButton.setAttribute("aria-expanded", "true");
        menuButton.setAttribute("aria-label", "关闭导航");
        mobilePanel.classList.add("is-open");
        mobilePanel.setAttribute("aria-hidden", "false");
        document.body.classList.add("menu-open");
      });
      mobilePanel.querySelectorAll("a").forEach((link) =>
        on(link, "click", closeMobileMenu),
      );
      on(document, "keydown", ((event: KeyboardEvent) => {
        if (event.key === "Escape") closeMobileMenu();
      }) as EventListener);
    }

    /* ---------- 产品菜单：悬停即展开，移出即收起（无需点击） ---------- */
    const productMenu = document.querySelector<HTMLDetailsElement>(".product-menu");
    if (productMenu) {
      on(document, "click", ((event: MouseEvent) => {
        if (productMenu.open && !productMenu.contains(event.target as Node)) {
          productMenu.removeAttribute("open");
        }
      }) as EventListener);
      on(productMenu, "pointerenter", () => productMenu.setAttribute("open", ""));
      on(productMenu, "pointerleave", () => productMenu.removeAttribute("open"));
    }

    /* ---------- 首屏：MASSOS 字母信号场 ---------- */
    const canvas = document.getElementById("signal-field") as HTMLCanvasElement | null;
    const hero = canvas?.closest(".hero");
    if (canvas && hero) {
      const context = canvas.getContext("2d");
      if (context) {
        const pointer = { x: -1000, y: -1000, active: false };
        let width = 0;
        let height = 0;
        let swarm: Array<Record<string, number | string | boolean>> = [];
        let wordPts: number[][] = [];
        let wordScale = 1;
        let rafId = 0;
        let disposed = false;

        const letters = "MASSOS";
        const tri = ["#3d84c6", "#3f8f8a", "#55a06e"];

        // 离屏采样 MASSOS 字形，得到品牌字的笔画点集（相对中心坐标）
        const buildWord = () => {
          const w = 520;
          const h = 150;
          const off = document.createElement("canvas");
          off.width = w;
          off.height = h;
          const c = off.getContext("2d");
          if (!c) return;
          c.font = '800 118px "Avenir Next", -apple-system, sans-serif';
          c.textAlign = "center";
          c.textBaseline = "middle";
          c.fillStyle = "#000";
          c.fillText("MASSOS", w / 2, h / 2);
          const data = c.getImageData(0, 0, w, h).data;
          wordPts = [];
          for (let y = 0; y < h; y += 6) {
            for (let x = 0; x < w; x += 6) {
              if (data[(y * w + x) * 4 + 3] > 128) wordPts.push([x - w / 2, y - h / 2]);
            }
          }
          wordScale = (Math.min(width, height) * 0.3 * 1.75) / w;
        };

        // 字母铺在横向波带上，默认整片向右流动（脑电波）
        // sx/sy：开场散落点；wx/wy：品牌字笔画目标点（环内聚合用）
        const makeBee = (rowY: number, i: number) => {
          const hx = Math.random() * width;
          const scatterA = Math.random() * Math.PI * 2;
          const scatterR = 90 + Math.random() * 220;
          const target = wordPts.length ? wordPts[(i * 7) % wordPts.length] : [0, 0];
          return {
            fx: hx,
            wp: Math.random() * Math.PI * 2,
            rowY,
            amp: 10 + Math.random() * 12,
            flow: 14 + Math.random() * 14,
            speedF: 1,
            form: 0, // 聚字程度：0=自由流动，1=归位品牌字（逐字母缓动）
            wx: target[0],
            wy: target[1],
            sx: hx + Math.cos(scatterA) * scatterR,
            sy: rowY + Math.sin(scatterA) * scatterR,
            size: 8 + Math.random() * 4,
            ch: letters[Math.floor(Math.random() * letters.length)],
            tint: tri[Math.floor(Math.random() * 3)],
            phase: Math.random() * Math.PI * 2,
            keepTint: Math.random() < 0.15,
            born: 0.2 + Math.random() * 1.3,
          };
        };

        const resizeCanvas = () => {
          const bounds = canvas.getBoundingClientRect();
          width = bounds.width;
          height = bounds.height;
          const ratio = Math.min(window.devicePixelRatio || 1, 2);
          canvas.width = Math.floor(width * ratio);
          canvas.height = Math.floor(height * ratio);
          context.setTransform(ratio, 0, 0, ratio, 0, 0);
          buildWord();
          // 脑电波带：整幅首屏横向铺 N 条波带
          const rows = Math.max(8, Math.min(12, Math.floor(height / 72)));
          swarm = [];
          for (let r = 0; r < rows; r++) {
            const rowY = (height * (r + 0.5)) / rows + (Math.random() - 0.5) * 10;
            const perRow = Math.floor(width / 32);
            for (let i = 0; i < perRow; i++) swarm.push(makeBee(rowY, swarm.length));
          }
        };

        const resizeObserver = new ResizeObserver(resizeCanvas);
        resizeObserver.observe(canvas);
        watch(resizeObserver);

        if (!reduceMotion) {
          on(hero, "pointermove", ((event: PointerEvent) => {
            const bounds = canvas.getBoundingClientRect();
            pointer.x = event.clientX - bounds.left;
            pointer.y = event.clientY - bounds.top;
            pointer.active = true;
          }) as EventListener);
          on(hero, "pointerleave", () => {
            pointer.active = false;
          });
        }

        // 呼吸环：慵懒跟随指针；指针不在时自己游走
        let ringX = 0;
        let ringY = 0;
        let ringInit = false;
        let lastTick = 0;

        const draw = (time: number) => {
          if (disposed) return;
          context.clearRect(0, 0, width, height);
          const tick = time * 0.001;
          const dt = Math.min(0.05, Math.max(0, tick - lastTick));
          lastTick = tick;

          // 环的目标位置：有指针跟指针，没指针自主漂移
          let targetX: number;
          let targetY: number;
          if (pointer.active) {
            targetX = pointer.x;
            targetY = pointer.y;
          } else {
            targetX = width / 2 + Math.sin(tick * 0.5) * width * 0.28 + Math.sin(tick * 0.83 + 1.7) * 50;
            targetY = height / 2 + Math.cos(tick * 0.42) * height * 0.2 + Math.cos(tick * 0.71) * 30;
          }
          if (!ringInit) {
            ringX = targetX;
            ringY = targetY;
            ringInit = true;
          }
          const ease = pointer.active ? 0.07 : 0.012;
          ringX += (targetX - ringX) * ease;
          ringY += (targetY - ringY) * ease;

          // 环半径自主呼吸
          const ringR = Math.min(width, height) * 0.3 + Math.sin(tick) * 24 + Math.cos(tick * 3) * 14;

          context.textAlign = "center";
          context.textBaseline = "middle";
          swarm.forEach((bee) => {
            const num = (key: string) => bee[key] as number;
            // 流动中的位置：沿波带向右滑行 + 正弦起伏
            const x = ((num("fx") % (width + 40)) + width + 40) % (width + 40) - 20;
            const wave = Math.sin(x * 0.012 + num("wp") + num("phase"));

            // 入场：从散落点聚合到流动队伍中（easeOutCubic）
            const enterT = reduceMotion ? 1 : Math.max(0, Math.min(1, (tick - num("born")) / 1.2));
            const easeIn = 1 - Math.pow(1 - enterT, 3);
            let px = num("sx") + (x - num("sx")) * easeIn;
            let py = num("sy") + (num("rowY") + wave * num("amp") - num("sy")) * easeIn;

            // 环域影响：smoothstep 圆域，越靠圆心越强
            const dx = px - ringX;
            const dy = py - ringY;
            const d = Math.hypot(dx, dy) || 1;
            const disc = Math.max(0, 1 - d / ringR);
            const target = disc * disc * (3 - 2 * disc);

            // 聚字：每个字母的 form 独立缓动，渐聚渐散，绝不瞬跳
            bee.form = num("form") + (target - num("form")) * 0.07;
            const f = num("form");
            if (f > 0.001) {
              px += (ringX + num("wx") * wordScale - px) * f;
              py += (ringY + num("wy") * wordScale - py) * f;
            }

            // 束缚：聚字的字母流速被按住，环外照常流动
            bee.speedF = num("speedF") + (1 - f * 0.9 - num("speedF")) * 0.08;
            bee.fx = num("fx") + num("flow") * num("speedF") * dt;
            bee.wp = num("wp") + 1.1 * num("speedF") * dt;

            // 波峰淡亮；聚字字母点亮为三色并微放大
            const crest = (wave + 1) / 2;
            const flicker = 0.8 + Math.sin(tick * 6 + num("phase") * 5) * 0.2;
            const lit = f > 0.3 || crest > 0.62;
            context.font =
              "600 " +
              (num("size") * (1 + f * 0.3)).toFixed(1) +
              'px "Avenir Next", -apple-system, "PingFang SC", sans-serif';
            context.globalAlpha = Math.min(1, (0.1 + crest * 0.3) * flicker * easeIn + f * 0.5);
            context.fillStyle = lit || (bee.keepTint as boolean) ? (bee.tint as string) : "#a8b1ba";
            context.fillText(bee.ch as string, px, py);
          });

          context.globalAlpha = 1;
          if (!reduceMotion) rafId = window.requestAnimationFrame(draw);
        };

        rafId = window.requestAnimationFrame(draw);
        cleanups.push(() => {
          disposed = true;
          window.cancelAnimationFrame(rafId);
        });
      }
    }

    /* ---------- 页脚：MASSOS 粒子流场，滚入聚字、鼠标爆散 ---------- */
    const bitsCanvas = document.getElementById("footer-bits") as HTMLCanvasElement | null;
    if (bitsCanvas) {
      const bitsCtx = bitsCanvas.getContext("2d");
      if (bitsCtx) {
        type Bit = {
          hx: number;
          hy: number;
          x: number;
          y: number;
          vx: number;
          vy: number;
          ch: string;
          color: string;
          size: number;
          phase: number;
          seed: number;
        };
        const bitsPointer = { x: -9999, y: -9999, active: false };
        const bitsPalette = ["#eef7f4", "#b9e5df", "#83c7d9", "#71a9e0", "#6bb78e"];
        let bits: Bit[] = [];
        let bitsRunning = false;
        let bitsWidth = 0;
        let bitsHeight = 0;
        let bitsDisposed = false;
        let bitsIntroAt = 0;
        let bitsFrame = 0;

        const drawBits = (time: number) => {
          const tick = time * 0.001;
          const intro = reduceMotion ? 1 : Math.min(1, Math.max(0, (tick - bitsIntroAt) / 2.4));
          const settle = 1 - Math.pow(1 - intro, 3);
          bitsCtx.clearRect(0, 0, bitsWidth, bitsHeight);
          bitsCtx.textAlign = "center";
          bitsCtx.textBaseline = "middle";
          const R = Math.min(170, Math.max(105, bitsWidth * 0.12));
          const R2 = R * R;
          bits.forEach((p) => {
            const dx = p.x - bitsPointer.x;
            const dy = p.y - bitsPointer.y;
            const d2 = dx * dx + dy * dy;
            if (d2 < R2) {
              const d = Math.sqrt(d2) || 1;
              const f = Math.pow((R - d) / R, 2) * 5.2;
              p.vx += (dx / d) * f;
              p.vy += (dy / d) * f;
            }
            const fieldX = Math.sin(p.y * 0.018 + tick * 1.35 + p.seed) * 0.12;
            const fieldY = Math.cos(p.x * 0.014 - tick * 1.1 + p.seed) * 0.12;
            p.vx += fieldX + (p.hx - p.x) * (0.016 + settle * 0.022);
            p.vy += fieldY + (p.hy - p.y) * (0.016 + settle * 0.022);
            p.vx *= 0.88;
            p.vy *= 0.88;
            p.x += p.vx;
            p.y += p.vy;
            const localDistance = Math.sqrt(d2);
            const glow = bitsPointer.active && localDistance < R * 1.25;
            const shimmer = 0.68 + Math.sin(tick * 4 + p.phase) * 0.22;
            bitsCtx.globalAlpha = Math.min(1, shimmer + (glow ? 0.24 : 0));
            bitsCtx.font = "700 " + p.size + "px ui-monospace, Menlo, monospace";
            bitsCtx.fillStyle = p.color;
            bitsCtx.fillText(Math.sin(tick * 2.2 + p.phase) > 0 ? p.ch : p.ch === "0" ? "1" : "0", p.x, p.y);
          });
          bitsCtx.globalAlpha = 1;
        };

        const buildBits = () => {
          bitsWidth = bitsCanvas.clientWidth;
          bitsHeight = bitsCanvas.clientHeight;
          if (!bitsWidth || !bitsHeight) return;
          const r = Math.min(window.devicePixelRatio || 1, 2);
          bitsCanvas.width = Math.floor(bitsWidth * r);
          bitsCanvas.height = Math.floor(bitsHeight * r);
          bitsCtx.setTransform(r, 0, 0, r, 0, 0);

          const off = document.createElement("canvas");
          off.width = bitsWidth;
          off.height = bitsHeight;
          const offCtx = off.getContext("2d");
          if (!offCtx) return;
          const word = "MASSOS";
          let fontSize = Math.min(bitsWidth / 4.6, bitsHeight * 0.92);
          const setWordFont = () => {
            offCtx.font = '800 ' + fontSize + 'px "Avenir Next", -apple-system, sans-serif';
          };
          setWordFont();
          let metrics = offCtx.measureText(word);
          const measuredHeight =
            (metrics.actualBoundingBoxAscent || fontSize * 0.74) +
            (metrics.actualBoundingBoxDescent || fontSize * 0.18);
          const fitScale = Math.min(
            1,
            (bitsWidth * 0.96) / Math.max(metrics.width, 1),
            (bitsHeight * 0.84) / Math.max(measuredHeight, 1),
          );
          fontSize *= fitScale;
          setWordFont();
          metrics = offCtx.measureText(word);
          const ascent = metrics.actualBoundingBoxAscent || fontSize * 0.74;
          const descent = metrics.actualBoundingBoxDescent || fontSize * 0.18;
          const baselineY = (bitsHeight - ascent - descent) / 2 + ascent;
          offCtx.textAlign = "center";
          offCtx.textBaseline = "alphabetic";
          offCtx.fillStyle = "#000";
          offCtx.fillText(word, bitsWidth / 2, baselineY);

          const data = offCtx.getImageData(0, 0, bitsWidth, bitsHeight).data;
          const gap = Math.max(6, Math.round(bitsWidth / 190));
          bits = [];
          for (let y = 0; y < bitsHeight; y += gap) {
            for (let x = 0; x < bitsWidth; x += gap) {
              if (data[(y * bitsWidth + x) * 4 + 3] > 128) {
                const angle = Math.random() * Math.PI * 2;
                const distance = Math.min(bitsWidth, bitsHeight) * (0.2 + Math.random() * 0.62);
                bits.push({
                  hx: x,
                  hy: y,
                  x: bitsWidth / 2 + Math.cos(angle) * distance,
                  y: bitsHeight / 2 + Math.sin(angle) * distance,
                  vx: (Math.random() - 0.5) * 2,
                  vy: (Math.random() - 0.5) * 2,
                  ch: Math.random() < 0.5 ? "0" : "1",
                  color: bitsPalette[Math.floor(Math.random() * bitsPalette.length)],
                  size: gap * (1.1 + Math.random() * 0.55),
                  phase: Math.random() * Math.PI * 2,
                  seed: Math.random() * 100,
                });
              }
            }
          }
          if (reduceMotion) drawBits(performance.now());
        };

        const bitsLoop = () => {
          if (bitsDisposed) return;
          drawBits(performance.now());
          if (bitsRunning && !reduceMotion) bitsFrame = window.requestAnimationFrame(bitsLoop);
        };

        // 只在滚进视口时运行动画，离开即暂停
        const bitsObserver = new IntersectionObserver(
          (entries) => {
            entries.forEach((entry) => {
              if (entry.isIntersecting && !bitsRunning) {
                bitsRunning = true;
                bitsIntroAt = performance.now() * 0.001;
                bitsLoop();
              } else if (!entry.isIntersecting) {
                bitsRunning = false;
                window.cancelAnimationFrame(bitsFrame);
              }
            });
          },
          { threshold: 0.05 },
        );
        bitsObserver.observe(bitsCanvas);
        watch(bitsObserver);

        on(bitsCanvas, "pointermove", ((event: PointerEvent) => {
          const bounds = bitsCanvas.getBoundingClientRect();
          bitsPointer.x = event.clientX - bounds.left;
          bitsPointer.y = event.clientY - bounds.top;
          bitsPointer.active = true;
        }) as EventListener);
        on(bitsCanvas, "pointerleave", () => {
          bitsPointer.x = -9999;
          bitsPointer.y = -9999;
          bitsPointer.active = false;
        });
        on(bitsCanvas, "pointerdown", () => {
          bits.forEach((p) => {
            const dx = p.x - bitsPointer.x;
            const dy = p.y - bitsPointer.y;
            const d = Math.hypot(dx, dy) || 1;
            if (d < 240) {
              const force = ((240 - d) / 240) * 7;
              p.vx += (dx / d) * force;
              p.vy += (dy / d) * force;
            }
          });
        });

        let bitsResizeTimer: ReturnType<typeof setTimeout> | undefined;
        on(window, "resize", () => {
          clearTimeout(bitsResizeTimer);
          bitsResizeTimer = setTimeout(buildBits, 150);
        });
        cleanups.push(() => {
          bitsDisposed = true;
          clearTimeout(bitsResizeTimer);
          window.cancelAnimationFrame(bitsFrame);
        });

        buildBits();
      }
    }

    /* ---------- 流程演示：所有 data-demo mock 自动播放（打字 → 推演 → 结论 → 留意） ---------- */
    document
      .querySelectorAll<HTMLElement>("main > section:not([hidden]) [data-demo]")
      .forEach((root) => {
        const text = root.getAttribute("data-demo") || "";
        const typingEl = root.querySelector<HTMLElement>(".dm-typing");
        const sendEl = root.querySelector<HTMLElement>(".dm-send");
        const thinkingEl = root.querySelector<HTMLElement>(".dm-thinking");
        const userBubble = root.querySelector<HTMLElement>(".dm-user");
        const userText = root.querySelector<HTMLElement>(".dm-user-text");
        const cards = Array.from(root.querySelectorAll<HTMLElement>(".dm-card"));
        const lines = Array.from(root.querySelectorAll<HTMLElement>(".dm-line"));
        const popups = Array.from(root.querySelectorAll<HTMLElement>(".dm-att, .dm-alert"));

        const showAll = () => {
          if (typingEl) typingEl.textContent = text;
          if (userText && text) {
            userText.textContent = text;
            if (userBubble) userBubble.classList.add("on");
            if (typingEl) typingEl.textContent = "";
          }
          cards.forEach((el) => el.classList.add("on"));
          lines.forEach((el) => el.classList.add("on"));
          popups.forEach((el) => el.classList.add("on"));
        };
        if (reduceMotion) {
          showAll();
          return;
        }

        let runToken = 0;
        let running = false;
        const resetState = () => {
          if (typingEl) typingEl.textContent = "";
          if (userBubble) userBubble.classList.remove("on");
          cards.forEach((el) => el.classList.remove("on"));
          lines.forEach((el) => el.classList.remove("on"));
          popups.forEach((el) => el.classList.remove("on"));
          if (thinkingEl) thinkingEl.classList.remove("on");
        };
        const io = new IntersectionObserver(
          (entries) => {
            entries.forEach((entry) => {
              if (!entry.isIntersecting) {
                // 滚出视口：作废当前播放并复位，下次进入重新来
                runToken++;
                running = false;
                resetState();
                return;
              }
              if (running) return;
              running = true;
              const token = ++runToken;
              void (async () => {
                const playOnce = root.hasAttribute("data-demo-once");
                do {
                  if (token !== runToken) break;
                  resetState();
                  await wait(700);
                  if (token !== runToken) break;

                  if (typingEl && text) {
                    for (const ch of text) {
                      typingEl.textContent += ch;
                      await wait(85);
                      if (token !== runToken) break;
                    }
                    if (token !== runToken) break;
                    await wait(500);
                    if (sendEl) {
                      sendEl.classList.add("go");
                      await wait(260);
                      sendEl.classList.remove("go");
                    }
                    typingEl.textContent = "";
                    // 输入完毕：转入用户气泡，成为对话的"我说的话"
                    if (userText) {
                      userText.textContent = text;
                      if (userBubble) {
                        userBubble.classList.add("on");
                        await wait(320);
                      }
                    }
                  }
                  if (token !== runToken) break;
                  if (thinkingEl) {
                    thinkingEl.classList.add("on");
                    await wait(1400);
                    thinkingEl.classList.remove("on");
                  }
                  if (token !== runToken) break;

                  cards.forEach((el) => el.classList.add("on"));
                  const playLines = async () => {
                    for (const el of lines) {
                      el.classList.add("on");
                      await wait(520);
                      if (token !== runToken) return;
                    }
                  };
                  const playPopups = async () => {
                    for (const el of popups) {
                      el.classList.add("on");
                      await wait(400);
                      if (token !== runToken) return;
                    }
                  };
                  if (root.hasAttribute("data-popups-first")) {
                    await playPopups();
                    if (token !== runToken) break;
                    await wait(400);
                    await playLines();
                  } else {
                    await playLines();
                    if (token !== runToken) break;
                    await wait(500);
                    await playPopups();
                  }
                  if (token !== runToken) break;
                  await wait(3800);
                } while (!playOnce && token === runToken);
                running = false;
              })();
            });
          },
          { threshold: 0.2 },
        );
        io.observe(root);
        watch(io);
        cleanups.push(() => {
          runToken++;
        });
      });

    /* ---------- 风险推演演示：选中目标 → 路径浮现 → 选中风险点 → 右侧依次展开（播一遍定格） ---------- */
    document.querySelectorAll<HTMLElement>("[data-risk-demo]").forEach((root) => {
      const goal = root.querySelector<HTMLElement>(".rd-goal");
      const riskNode = root.querySelector<HTMLElement>(".rd-risknode");
      const items = Array.from(root.querySelectorAll<HTMLElement>(".rd-item"));
      const cursor = root.querySelector<HTMLElement>(".rd-cursor");
      const main = root.querySelector<HTMLElement>(".wbm-main");

      const resetCursor = () => {
        if (!cursor) return;
        cursor.style.transition = "none";
        cursor.style.left = "62%";
        cursor.style.top = "88%";
        cursor.style.opacity = "0";
        cursor.classList.remove("press");
        // 强制 reflow，下次播放时过渡才生效
        void cursor.offsetWidth;
        cursor.style.transition = "";
      };

      const showAll = () => {
        if (goal) goal.classList.add("on");
        if (riskNode) riskNode.classList.add("on");
        items.forEach((el) => el.classList.add("show"));
        if (cursor) cursor.style.opacity = "0";
      };
      if (reduceMotion) {
        showAll();
        return;
      }

      let playToken = 0;
      const resetState = () => {
        if (riskNode) riskNode.classList.remove("on");
        items.forEach((el) => el.classList.remove("show"));
        resetCursor();
      };
      const io = new IntersectionObserver(
        (entries) => {
          entries.forEach((entry) => {
            if (!entry.isIntersecting) {
              // 滚出视口：复位，下次进入重新播
              playToken++;
              resetState();
              return;
            }
            const token = ++playToken;
            resetState();
            void (async () => {
              // 鼠标箭头出现，滑向目标节点
              if (cursor && riskNode && main) {
                const mainRect = main.getBoundingClientRect();
                const nodeRect = riskNode.getBoundingClientRect();
                cursor.style.opacity = "1";
                await wait(160);
                if (token !== playToken) return;
                cursor.style.left = nodeRect.left - mainRect.left + nodeRect.width * 0.42 + "px";
                cursor.style.top = nodeRect.top - mainRect.top + nodeRect.height * 0.55 + "px";
                await wait(760);
                if (token !== playToken) return;
                // 按下
                cursor.classList.add("press");
                await wait(180);
                if (token !== playToken) return;
              } else {
                await wait(500);
                if (token !== playToken) return;
              }
              if (riskNode) riskNode.classList.add("on"); // 点击：选中脉冲
              await wait(220);
              if (cursor) {
                cursor.classList.remove("press");
                cursor.style.opacity = "0";
              }
              await wait(520);
              if (token !== playToken) return;
              for (const el of items) {
                // 右侧依次展开
                el.classList.add("show");
                await wait(420);
                if (token !== playToken) return;
              }
            })();
          });
        },
        { threshold: 0.25 },
      );
      io.observe(root);
      watch(io);
      cleanups.push(() => {
        playToken++;
      });
    });

    /* ---------- 企业数字孪生：推演流 → 生成 PRD/视频脚本 → 沉淀公司文件夹 ---------- */
    document.querySelectorAll<HTMLElement>("[data-gen-demo]").forEach((root) => {
      const nodes = Array.from(root.querySelectorAll<HTMLElement>(".rd-twin-node"));
      const links = Array.from(root.querySelectorAll<HTMLElement>(".rd-twin-link"));
      const buttons = Array.from(root.querySelectorAll<HTMLButtonElement>("[data-twin-output]"));
      const artifacts = Array.from(root.querySelectorAll<HTMLElement>("[data-twin-artifact]"));
      const folderFiles = Array.from(root.querySelectorAll<HTMLElement>("[data-twin-folder-file]"));
      const folderPanel = root.querySelector<HTMLElement>(".twin-folder-panel");
      const folderStatus = root.querySelector<HTMLElement>(".twin-folder-status");
      const cursor = root.querySelector<HTMLElement>(".rd-cursor");
      const main = root.querySelector<HTMLElement>(".twin-main");

      const resetCursor = () => {
        if (!cursor) return;
        cursor.style.transition = "none";
        cursor.style.left = "48%";
        cursor.style.top = "92%";
        cursor.style.opacity = "0";
        cursor.classList.remove("press");
        void cursor.offsetWidth;
        cursor.style.transition = "";
      };

      const resetState = () => {
        nodes.forEach((element) => element.classList.remove("is-active"));
        links.forEach((element) => element.classList.remove("is-active"));
        buttons.forEach((element) => element.classList.remove("is-busy", "is-complete"));
        artifacts.forEach((element) => element.classList.remove("is-created", "is-filed"));
        folderFiles.forEach((element) => element.classList.remove("is-stored"));
        folderPanel?.classList.remove("is-receiving", "is-complete");
        if (folderStatus) folderStatus.textContent = "等待生成";
        resetCursor();
      };

      const showFinalState = () => {
        nodes.forEach((element) => element.classList.add("is-active"));
        links.forEach((element) => element.classList.add("is-active"));
        buttons.forEach((element) => element.classList.add("is-complete"));
        artifacts.forEach((element) => element.classList.add("is-created", "is-filed"));
        folderFiles.forEach((element) => element.classList.add("is-stored"));
        folderPanel?.classList.add("is-complete");
        if (folderStatus) folderStatus.textContent = "已沉淀 2 项企业成果";
      };

      if (reduceMotion) {
        showFinalState();
        return;
      }

      let playToken = 0;
      const clickOutput = async (output: string, token: number) => {
        const button = buttons.find((element) => element.dataset.twinOutput === output);
        const artifact = artifacts.find((element) => element.dataset.twinArtifact === output);
        if (!button || !artifact) return;

        if (cursor && main) {
          const mainRect = main.getBoundingClientRect();
          const buttonRect = button.getBoundingClientRect();
          cursor.style.opacity = "1";
          await wait(120);
          if (token !== playToken) return;
          cursor.style.left = buttonRect.left - mainRect.left + buttonRect.width * .54 + "px";
          cursor.style.top = buttonRect.top - mainRect.top + buttonRect.height * .6 + "px";
          await wait(620);
          if (token !== playToken) return;
          cursor.classList.add("press");
          await wait(150);
          if (token !== playToken) return;
        }

        button.classList.add("is-busy");
        if (cursor) cursor.classList.remove("press");
        await wait(620);
        if (token !== playToken) return;
        button.classList.remove("is-busy");
        button.classList.add("is-complete");
        artifact.classList.add("is-created");
        if (cursor) cursor.style.opacity = "0";
        await wait(420);
      };

      const io = new IntersectionObserver(
        (entries) => {
          entries.forEach((entry) => {
            if (!entry.isIntersecting) {
              playToken++;
              resetState();
              return;
            }
            const token = ++playToken;
            resetState();
            void (async () => {
              for (let index = 0; index < nodes.length; index++) {
                nodes[index].classList.add("is-active");
                if (index > 0) links[index - 1]?.classList.add("is-active");
                await wait(360);
                if (token !== playToken) return;
              }

              await wait(320);
              await clickOutput("prd", token);
              if (token !== playToken) return;
              await clickOutput("video", token);
              if (token !== playToken) return;

              await wait(460);
              folderPanel?.classList.add("is-receiving");
              artifacts.forEach((element) => element.classList.add("is-filed"));
              await wait(620);
              if (token !== playToken) return;

              for (const element of folderFiles) {
                element.classList.add("is-stored");
                await wait(300);
                if (token !== playToken) return;
              }
              folderPanel?.classList.remove("is-receiving");
              folderPanel?.classList.add("is-complete");
              if (folderStatus) folderStatus.textContent = "已沉淀 2 项企业成果";
            })();
          });
        },
        { threshold: 0.25 },
      );
      io.observe(root);
      watch(io);
      cleanups.push(() => {
        playToken++;
      });
    });

    return () => {
      cleanups.forEach((cleanup) => cleanup());
    };
  }, []);

  return null;
}
