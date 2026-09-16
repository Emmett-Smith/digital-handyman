"use client";

import { useEffect, useRef, useState } from "react";
import { AmericanFlag, Icon } from "./Icon";
import "./scroll-experience.css";

const chapters = [
  { id: "workflows", label: "See the possibilities" },
  { id: "library", label: "Find your workflow" },
  { id: "process", label: "How we build" },
  { id: "demo", label: "Try it for yourself" },
  { id: "calculator", label: "Work out the value" },
  { id: "pricing", label: "Ways to work together" },
  { id: "studio", label: "Our approach" },
  { id: "questions", label: "The details that matter" },
  { id: "booking", label: "Start a conversation" },
];

export function ScrollExperience() {
  const progress = useRef<HTMLDivElement>(null);
  const menu = useRef<HTMLDetailsElement>(null);
  const [active, setActive] = useState(-1);

  useEffect(() => {
    const motion = matchMedia("(prefers-reduced-motion: reduce)");
    const hero = document.querySelector<HTMLElement>(".hero-field");
    const sections = chapters.map((chapter) => document.getElementById(chapter.id));
    const reveals = Array.from(document.querySelectorAll<HTMLElement>(
      ".section-top, .diagnosis-heading, .pricing-heading, .studio-visual, .reassurances article, .delivery-commitment",
    ));
    let frame = 0;

    const update = () => {
      frame = 0;
      const height = document.documentElement.scrollHeight - innerHeight;
      const fraction = height > 0 ? Math.min(1, Math.max(0, scrollY / height)) : 0;
      if (progress.current) progress.current.style.transform = `scaleX(${fraction})`;
      let current = -1;
      sections.forEach((section, index) => {
        if (section && section.getBoundingClientRect().top <= innerHeight * 0.48) current = index;
      });
      setActive(current);
      if (hero) hero.style.setProperty("--hero-drift", motion.matches ? "0px" : `${Math.min(scrollY, innerHeight) * 0.11}px`);
    };
    const schedule = () => { if (!frame) frame = requestAnimationFrame(update); };
    const observer = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) return;
        entry.target.classList.add("scroll-arrived");
        observer.unobserve(entry.target);
      });
    }, { threshold: 0.12 });
    reveals.forEach((element) => {
      if (element.getBoundingClientRect().top > innerHeight) {
        element.classList.add("scroll-reveal");
        observer.observe(element);
      }
    });
    const resize = new ResizeObserver(schedule);
    resize.observe(document.body);
    window.addEventListener("scroll", schedule, { passive: true });
    window.addEventListener("resize", schedule);
    motion.addEventListener("change", schedule);
    update();
    return () => {
      cancelAnimationFrame(frame);
      observer.disconnect();
      resize.disconnect();
      window.removeEventListener("scroll", schedule);
      window.removeEventListener("resize", schedule);
      motion.removeEventListener("change", schedule);
      hero?.style.removeProperty("--hero-drift");
      reveals.forEach((element) => element.classList.remove("scroll-reveal", "scroll-arrived"));
    };
  }, []);

  useEffect(() => {
    const close = (event: PointerEvent) => {
      if (menu.current && !menu.current.contains(event.target as Node)) menu.current.open = false;
    };
    const escape = (event: KeyboardEvent) => {
      if (event.key === "Escape" && menu.current?.open) {
        menu.current.open = false;
        menu.current.querySelector("summary")?.focus();
      }
    };
    document.addEventListener("pointerdown", close);
    document.addEventListener("keydown", escape);
    return () => {
      document.removeEventListener("pointerdown", close);
      document.removeEventListener("keydown", escape);
    };
  }, []);

  const index = Math.max(0, active);
  return (
    <>
      <div className="reading-progress" aria-hidden="true"><div ref={progress} /></div>
      <aside className={`chapter-dock ${active >= 0 ? "chapter-dock-visible" : ""}`} aria-label="Page chapters" inert={active < 0}>
        <details ref={menu} className="chapter-menu">
          <summary>
            <span className="chapter-count mono">{String(index + 1).padStart(2, "0")}<span> / 09</span></span>
            <span>{chapters[index].label}</span>
            <Icon name="plus" size={14} />
          </summary>
          <nav aria-label="Jump to a section">
            {chapters.map((chapter, i) => (
              <a key={chapter.id} href={`#${chapter.id}`} aria-current={active === i ? "location" : undefined} onClick={() => { if (menu.current) menu.current.open = false; }}>
                <span className="mono">{String(i + 1).padStart(2, "0")}</span>{chapter.label}<span className="chapter-active-dot" />
              </a>
            ))}
          </nav>
        </details>
        <a className="chapter-next" href={index < chapters.length - 1 ? `#${chapters[index + 1].id}` : "#hero"} aria-label={index < chapters.length - 1 ? `Next: ${chapters[index + 1].label}` : "Back to top"}>
          <Icon name="down" size={16} />
        </a>
      </aside>
    </>
  );
}

export function DeliveryStrip() {
  return (
    <div className="delivery-strip instrument">
      <div className="container delivery-strip-inner">
        <p><AmericanFlag className="service-strip-flag" /> We’ll get it done.<br /><span>Proud to serve America’s small businesses.</span></p>
        {[
          ["01", "Find the right work", "A focused audit. A clear business case."],
          ["02", "Connect what you have", "Your tools, your rules, your workflow."],
          ["03", "Put your team in control", "Human review. Training. Full ownership."],
        ].map(([number, title, detail]) => (
          <div className="delivery-commitment" key={number}>
            <span className="mono">{number}</span><div><strong>{title}</strong><span>{detail}</span></div>
          </div>
        ))}
      </div>
    </div>
  );
}
