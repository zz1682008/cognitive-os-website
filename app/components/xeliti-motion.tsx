"use client";

import { useEffect, useRef, type ReactNode } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

export function XelitiMotion({ children }: { children: ReactNode }) {
  const scope = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!scope.current) return;

    gsap.registerPlugin(ScrollTrigger);

    const ctx = gsap.context(() => {
      const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
      const mobile = window.matchMedia("(max-width: 767px)").matches;

      if (reduceMotion) {
        gsap.set("[data-hero-reveal], [data-hero-visual], [data-section-reveal], [data-story-step], [data-story-layer]", {
          clearProps: "all",
        });
        return;
      }

      gsap.from("[data-hero-reveal]", {
        autoAlpha: 0,
        y: 28,
        duration: 0.82,
        stagger: 0.09,
        ease: "power3.out",
      });

      gsap.from("[data-hero-visual]", {
        autoAlpha: 0,
        y: 22,
        scale: 0.985,
        duration: 1.05,
        delay: 0.12,
        ease: "power3.out",
      });

      ScrollTrigger.batch("[data-section-reveal]", {
        start: "top 86%",
        once: true,
        onEnter: (elements) => {
          gsap.from(elements, {
            autoAlpha: 0,
            y: 26,
            duration: 0.72,
            stagger: 0.08,
            ease: "power3.out",
            overwrite: true,
          });
        },
      });

      const steps = gsap.utils.toArray<HTMLElement>("[data-story-step]");
      const layerElements = gsap.utils.toArray<HTMLElement>("[data-story-layer]");

      if (mobile) {
        gsap.from(steps, {
          autoAlpha: 0,
          y: 22,
          duration: 0.66,
          stagger: 0.08,
          ease: "power3.out",
          scrollTrigger: {
            trigger: "[data-platform-story]",
            start: "top 78%",
            once: true,
          },
        });
        return;
      }

      const activateLayer = (activeIndex: number) => {
        steps.forEach((step, index) => {
          gsap.to(step, {
            opacity: index === activeIndex ? 1 : 0.34,
            x: index === activeIndex ? 0 : -6,
            duration: 0.36,
            ease: "power2.out",
            overwrite: true,
          });
        });

        layerElements.forEach((layer, index) => {
          gsap.to(layer, {
            opacity: index === activeIndex ? 1 : 0.28,
            scale: index === activeIndex ? 1 : 0.975,
            y: index === activeIndex ? -4 : 0,
            duration: 0.42,
            ease: "power2.out",
            overwrite: true,
          });
        });
      };

      activateLayer(0);
      steps.forEach((step, index) => {
        ScrollTrigger.create({
          trigger: step,
          start: "top 62%",
          end: "bottom 38%",
          onEnter: () => activateLayer(index),
          onEnterBack: () => activateLayer(index),
        });
      });
    }, scope);

    return () => ctx.revert();
  }, []);

  return <div ref={scope}>{children}</div>;
}
