"use client";

import { createContext, useContext, useEffect, useRef, useState, type ReactNode } from "react";

const PageMotionPaused = createContext(false);
export function usePageMotionPaused() { return useContext(PageMotionPaused); }

export function XelitiMotion({ children }: { children: ReactNode }) {
  const scope = useRef<HTMLDivElement>(null);
  const [paused, setPaused] = useState(false);
  const pausedRef = useRef(false);
  const controllers = useRef<Array<() => void>>([]);

  useEffect(() => {
    pausedRef.current = paused;
    controllers.current.forEach(sync => sync());
  }, [paused]);

  useEffect(() => {
    const query = window.matchMedia("(min-width: 768px) and (pointer: fine) and (prefers-reduced-motion: no-preference)");
    const element = scope.current;
    if (element) element.dataset.jsReady = "true";
    let cancelled = false;
    let generation = 0;
    let cleanup: (() => void) | undefined;

    async function syncMotion() {
      const version = ++generation;
      cleanup?.();
      cleanup = undefined;
      if (!query.matches || cancelled) return;
      const [{ gsap }, { ScrollTrigger }] = await Promise.all([import("gsap"), import("gsap/ScrollTrigger")]);
      if (cancelled || !query.matches || version !== generation) return;
      gsap.registerPlugin(ScrollTrigger);
      const disposers: Array<() => void> = [];
      const context = gsap.context(() => {
        const intro = gsap.from("[data-hero-reveal]", { y: 14, duration: .6, stagger: .06, ease: "power2.out", clearProps: "all" });
        controllers.current.push(() => { if (pausedRef.current) intro.progress(1); });
        gsap.utils.toArray<HTMLElement>("[data-scene]").forEach(scene => {
          const select = gsap.utils.selector(scene);
          let inView = false;
          let started = false;
          let complete = false;
          const workInput = scene.querySelector<HTMLTextAreaElement>("[data-work-input]");
          const sendButton = scene.querySelector<HTMLButtonElement>("[data-work-send],[data-service-replay]");
          const preset = workInput?.dataset.preset ?? "";
          const originalNumbers = [...scene.querySelectorAll<HTMLElement>("[data-count]")].map(el => [el, el.textContent] as const);
          const timeline = gsap.timeline({
            paused: true,
            defaults: { ease: "power3.out" },
            onComplete: () => { complete = true; scene.dataset.sceneState = "complete"; },
          });
          const counts = (at: number, duration = .85) => originalNumbers.forEach(([el]) => {
            const end = Number(el.dataset.count);
            const counter = { value: 0 };
            const decimals = Number.isInteger(end) ? 0 : 1;
            timeline.fromTo(counter, { value: 0 }, {
              value: end, duration, ease: "power1.out",
              onUpdate: () => { el.textContent = counter.value.toFixed(decimals); },
            }, at);
          });

          switch (scene.dataset.scene) {
            case "decision":
              timeline.from(select("[data-window]"), { x: 85, y: 12, rotation: -1.3, duration: .8 }, 0)
                .from(select("[data-request]"), { x: 22, autoAlpha: 0, duration: .45 }, .3)
                .from(select("[data-goal]"), { y: 18, autoAlpha: 0, duration: .5 }, .8)
                .from(select("[data-risk]"), { x: 35, autoAlpha: 0, stagger: .5, duration: .65 }, 1.4)
                .from(select("[data-solution]"), { x: 65, autoAlpha: 0, stagger: .65, duration: .75 }, 2.8);
              counts(3.25);
              break;
            case "work-voucher":
            case "work-reports":
            case "work-review":
            case "work-draft": {
              const reviewing = scene.dataset.scene === "work-review";
              const drafting = scene.dataset.scene === "work-draft";
              timeline.call(() => { if (workInput) workInput.value = preset; }, [], 0)
                .from(select("[data-window]"), { x: reviewing || drafting ? 0 : 55, y: reviewing || drafting ? 24 : 0, duration: .65 }, 0)
                .to(select("[data-work-send]"), { scale: .93, duration: .13 }, .55)
                .to(select("[data-work-send]"), { scale: 1, duration: .16 }, .68)
                .call(() => { if (workInput) workInput.value = ""; }, [], .72)
                .from(select("[data-work-message]"), { y: 36, autoAlpha: 0, duration: .5 }, .72)
                .from(select("[data-work-reply]"), { y: 14, autoAlpha: 0, duration: .5 }, 1.15)
                .from(select("[data-work-result]"), { x: reviewing ? 0 : 55, y: reviewing ? 35 : 14, rotation: drafting ? -1.3 : 0, autoAlpha: 0, stagger: .3, duration: .7 }, 1.45)
                .from(select("[data-work-row]"), { y: 14, autoAlpha: 0, stagger: .32, duration: .5 }, reviewing ? 2.4 : 1.9);
              if (reviewing) timeline.from(select("[data-highlight]"), { scaleX: 0, transformOrigin: "left center", stagger: .65, duration: .6 }, 2);
              if (scene.dataset.scene === "work-reports") {
                timeline.from(select("[data-work-download]"), { y: 8, autoAlpha: 0, stagger: .2, duration: .4 }, 2.25);
                counts(1.9);
              }
              break;
            }
            case "service-explore":
              timeline.from(select("[data-phone-question]"), { y: 26, autoAlpha: 0, duration: .5 }, .1)
                .from(select("[data-template-match]"), { y: 8, autoAlpha: 0, duration: .4 }, .75)
                .from(select("[data-robot-answer]"), { y: 15, autoAlpha: 0, duration: .45 }, 1.15)
                .from(select(".service-upgrade"), { x: -18, autoAlpha: 0, duration: .8 }, 1.5)
                .from(select("[data-intent-mark]"), { scaleX: 0, transformOrigin: "left center", stagger: .45, duration: .65 }, 1.5)
                .from(select("[data-thought-signal]"), { scaleY: .12, autoAlpha: 0, stagger: .025, duration: .6 }, 1.6)
                .to(select("[data-thought-signal]"), { scaleY: .35, stagger: .025, duration: .45, repeat: 5, yoyo: true, ease: "sine.inOut" }, 2.4)
                .from(select("[data-service-intent]"), { y: 20, autoAlpha: 0, duration: .65 }, 2.05)
                .from(select("[data-service-sources]"), { y: 18, autoAlpha: 0, duration: .6 }, 3.2)
                .from(select("[data-service-source]"), { y: 20, rotationX: -55, transformOrigin: "top center", autoAlpha: 0, stagger: .8, duration: .6 }, 3.4)
                .fromTo(select("[data-source-scan]"), { scaleX: 0, autoAlpha: 0 }, { scaleX: 1, autoAlpha: .7, transformOrigin: "left center", stagger: .8, duration: .7, ease: "power1.inOut" }, 3.75)
                .to(select("[data-source-scan]"), { autoAlpha: 0, duration: .5 }, 6.2)
                .from(select("[data-service-plan]"), { y: 18, autoAlpha: 0, duration: .6 }, 6.3)
                .from(select("[data-plan-route]"), { scaleX: 0, transformOrigin: "left center", duration: .8 }, 6.65)
                .from(select("[data-plan-part]"), { y: 10, autoAlpha: 0, stagger: .65, duration: .55 }, 6.8)
                .from(select("[data-ai-answer]"), { y: 20, autoAlpha: 0, duration: .65 }, 8.7);
              break;
            case "secretary":
              timeline.from(select("[data-upload]"), { y: -65, rotation: -4, autoAlpha: 0, stagger: .3, duration: .65 }, 0)
                .from(select("[data-alert]"), { x: 65, autoAlpha: 0, stagger: .75, duration: .6 }, 1.5);
              counts(1.5, 2.2);
              break;
          }

          scene.dataset.motion = "ready";
          scene.dataset.sceneState = "ready";
          const sync = () => {
            if (sendButton) sendButton.disabled = pausedRef.current;
            if (complete) return;
            if (pausedRef.current) {
              if (!started) timeline.progress(1);
              else { timeline.pause(); scene.dataset.sceneState = "paused"; }
              return;
            }
            if (!inView || document.hidden) { timeline.pause(); return; }
            started = true;
            timeline.play();
            scene.dataset.sceneState = "playing";
          };
          controllers.current.push(sync);
          const sendPreset = () => {
            if (pausedRef.current || document.hidden) return;
            complete = false;
            started = true;
            timeline.restart();
            scene.dataset.sceneState = "playing";
          };
          if (sendButton) {
            sendButton.disabled = pausedRef.current;
            sendButton.addEventListener("click", sendPreset);
          }
          const visibleRatio = Math.min(.55, (window.innerHeight * .65) / scene.offsetHeight);
          const observer = new IntersectionObserver(entries => {
            inView = entries[0].isIntersecting && entries[0].intersectionRatio >= visibleRatio;
            sync();
          }, { threshold: visibleRatio });
          observer.observe(scene);
          document.addEventListener("visibilitychange", sync);
          if (pausedRef.current) sync();
          disposers.push(() => {
            observer.disconnect();
            document.removeEventListener("visibilitychange", sync);
            delete scene.dataset.motion;
            delete scene.dataset.sceneState;
            originalNumbers.forEach(([el, text]) => { el.textContent = text; });
            if (workInput) workInput.value = "";
            if (sendButton) { sendButton.removeEventListener("click", sendPreset); sendButton.disabled = true; }
          });
        });

        ScrollTrigger.batch("[data-section-reveal]", {
          start: "top 93%", once: true,
          onEnter: elements => {
            if (!pausedRef.current) {
              const reveal = gsap.from(elements, { y: 20, duration: .6, stagger: .08, clearProps: "all" });
              controllers.current.push(() => { if (pausedRef.current) reveal.progress(1); });
            }
          },
        });
        ScrollTrigger.create({
          trigger: "[data-brand-finale]", start: "top 88%", once: true,
          onEnter: () => {
            if (!pausedRef.current) {
              const logo = gsap.from("[data-logo-letter]", { yPercent: 75, rotationX: -35, duration: 1.05, stagger: .07, ease: "power3.out" });
              controllers.current.push(() => { if (pausedRef.current) logo.progress(1); });
            }
          },
        });
      }, scope);
      cleanup = () => {
        context.revert();
        disposers.forEach(dispose => dispose());
        controllers.current = [];
      };
    }
    void syncMotion().catch(() => { /* Server-rendered content is the fallback. */ });
    const onChange = () => { void syncMotion().catch(() => {}); };
    query.addEventListener("change", onChange);
    return () => {
      cancelled = true;
      generation++;
      if (element) delete element.dataset.jsReady;
      query.removeEventListener("change", onChange);
      cleanup?.();
    };
  }, []);

  return <PageMotionPaused.Provider value={paused}><div ref={scope}>{children}<button className="page-motion-toggle" type="button" onClick={() => setPaused(value => !value)} aria-pressed={paused} aria-label={paused ? "播放页面动效" : "暂停页面动效"} title={paused ? "播放页面动效" : "暂停页面动效"}><span aria-hidden="true">{paused ? "▷" : "Ⅱ"}</span></button></div></PageMotionPaused.Provider>;
}
