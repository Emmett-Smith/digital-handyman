"use client";
import { useEffect, useRef, useState } from "react";
import { stages } from "@/content/site";
import { Icon } from "./Icon";
import { interfaceCopy } from "@/content/interface";
const copy = interfaceCopy.StageFlow;

export function StageFlow() {
  const section = useRef<HTMLElement>(null);
  const [active, setActive] = useState(0);
  useEffect(() => {
    let cleanup = () => {};
    let disposed = false;
    const setup = async () => {
      const { gsap } = await import("gsap");
      const { ScrollTrigger } = await import("gsap/ScrollTrigger");
      if (disposed) return;
      gsap.registerPlugin(ScrollTrigger);
      const mm = gsap.matchMedia();
      mm.add(
        "(min-width: 1024px) and (prefers-reduced-motion: no-preference)",
        () => {
          const ctx = gsap.context(() => {
            const timeline = gsap.timeline({
              scrollTrigger: {
                trigger: section.current,
                start: "top top",
                end: "+=1250",
                scrub: 0.6,
                pin: true,
                anticipatePin: 1,
                onUpdate: (self) =>
                  setActive(Math.min(4, Math.floor(self.progress * 5))),
              },
            });
            timeline.to(
              ".process-progress",
              { scaleX: 1, ease: "none", duration: 1 },
              0,
            );
            timeline.fromTo(
              ".schematic-path",
              { strokeDashoffset: 1 },
              {
                strokeDashoffset: 0,
                stagger: 0.018,
                ease: "none",
                duration: 0.7,
              },
              0,
            );
            timeline.fromTo(
              ".schematic-order",
              { opacity: 0.15 },
              { opacity: 1, duration: 0.2 },
              0.7,
            );
          }, section);
          return () => ctx.revert();
        },
      );
      cleanup = () => mm.revert();
    };
    const observer = new IntersectionObserver(
      ([e]) => {
        if (e.isIntersecting) {
          void setup();
          observer.disconnect();
        }
      },
      { rootMargin: "500px" },
    );
    if (section.current) observer.observe(section.current);
    return () => {
      disposed = true;
      observer.disconnect();
      cleanup();
    };
  }, []);
  return (
    <section id="process" className="process-section instrument" ref={section}>
      <div className="container">
        <div className="section-top">
          <span className="section-note">
            <span className="small-line" /> {copy.from_the_first_call_to_your}
          </span>
          <span className="quiet">
            {copy.a_clear_beginning_a_proper_handoff}
          </span>
        </div>
        <div className="process-heading">
          <h2>
            {copy.less_talk_about_ai}
            <br />
            {copy.more_work_off_your_plate}
          </h2>
          <p>
            {copy.we_start_small_put_a_number}
            <br className="desktop-break" />{" "}
            {copy.and_build_something_your_team_can}
          </p>
        </div>
        <div className="process-track">
          <div className="process-rail">
            <div className="process-progress" />
          </div>
          {stages.map((stage, i) => (
            <button
              type="button"
              key={stage.name}
              className={`process-stage ${i <= active ? "is-active" : ""}`}
              onClick={() => setActive(i)}
              aria-pressed={active === i}
            >
              <span className="stage-node">
                {i < active ? (
                  <Icon name="check" size={14} />
                ) : (
                  <span>{i + 1}</span>
                )}
              </span>
              <span className="stage-name">{stage.name}</span>
              <span className={`stage-duration ${i < 4 ? "mono" : ""}`}>
                {stage.duration}
              </span>
            </button>
          ))}
        </div>
        <div className="process-schematic" aria-hidden="true">
          <div className="schematic-source">
            <span className="schematic-icon">
              <Icon name="mail" size={20} />
            </span>
            <span>{copy.a_supplier_email}</span>
            <small>{copy.details_scattered_across_your_inbox}</small>
          </div>
          <svg
            className="schematic-flow"
            viewBox="0 0 800 170"
            preserveAspectRatio="none"
          >
            <defs>
              <linearGradient id="schematic-gradient">
                <stop stopColor="#7180df" stopOpacity=".18" />
                <stop offset=".65" stopColor="#bbc5ff" />
                <stop offset="1" stopColor="#cdd5ee" stopOpacity=".5" />
              </linearGradient>
            </defs>
            {Array.from({ length: 24 }, (_, i) => (
              <path
                className="schematic-path"
                pathLength="1"
                strokeDasharray="1"
                key={i}
                d={`M0 ${15 + i * 6} C ${170 + i * 5} ${20 + Math.sin(i * 0.25) * 135}, ${430 + i * 3} ${85 + Math.cos(i * 0.2) * 70}, 800 ${63 + i * 2}`}
                fill="none"
                stroke="url(#schematic-gradient)"
                strokeWidth=".8"
              />
            ))}
          </svg>
          <div className="schematic-order">
            <Icon name="file" size={21} />
            <div>
              <span>{copy.a_purchase_order}</span>
              <small>{copy.ready_for_your_team_to_review}</small>
            </div>
            <Icon name="check" size={16} />
          </div>
        </div>
        <div className="stage-detail" key={active}>
          <span className="stage-detail-number mono">
            {String(active + 1).padStart(2, "0")}
          </span>
          <div>
            <h3>{stages[active].title}</h3>
            <p>{stages[active].description}</p>
          </div>
        </div>
        <ol className="mobile-process">
          {stages.map((s, i) => (
            <li key={s.name}>
              <span className="mono">{i + 1}</span>
              <div>
                <h3>
                  {s.name} <small>{s.duration}</small>
                </h3>
                <p>{s.description}</p>
              </div>
            </li>
          ))}
        </ol>
      </div>
    </section>
  );
}
