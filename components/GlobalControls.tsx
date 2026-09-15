"use client";
import { useEffect, useRef, useState } from "react";
import { automations } from "@/content/automations";
import { industries } from "@/content/industries";
import { site } from "@/content/site";
import { attribution, book, track } from "@/lib/analytics";
import { Icon, Logo } from "./Icon";
import { interfaceCopy } from "@/content/interface";
const copy = interfaceCopy.GlobalControls;

export function GlobalControls() {
  const [pastHero, setPastHero] = useState(false);
  const [menu, setMenu] = useState(false);
  const [palette, setPalette] = useState(false);
  const [query, setQuery] = useState("");
  const [index, setIndex] = useState(0);
  const [exit, setExit] = useState(false);
  const dialog = useRef<HTMLDialogElement>(null);
  const exitDialog = useRef<HTMLDialogElement>(null);
  const menuTrigger = useRef<HTMLButtonElement>(null);
  useEffect(() => {
    if (!menu) return;
    const closeMenu = (event: KeyboardEvent) => {
      if (event.key !== "Escape") return;
      setMenu(false);
      menuTrigger.current?.focus();
    };
    document.addEventListener("keydown", closeMenu);
    return () => document.removeEventListener("keydown", closeMenu);
  }, [menu]);
  useEffect(() => {
    if (palette)
      document
        .getElementById(`command-${index}`)
        ?.scrollIntoView({ block: "nearest", behavior: "instant" });
  }, [palette, index, query]);
  useEffect(() => {
    attribution();
    const hero = document.getElementById("hero");
    const observer = new IntersectionObserver(
      ([e]) => setPastHero(!e.isIntersecting),
      { threshold: 0, rootMargin: "-90px 0px 0px 0px" },
    );
    if (hero) observer.observe(hero);
    else setPastHero(true);
    const keyboard = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === "k") {
        e.preventDefault();
        setPalette((p) => !p);
        setQuery("");
        setIndex(0);
      }
    };
    const leave = (e: MouseEvent) => {
      if (
        e.clientY > 0 ||
        scrollY < 900 ||
        matchMedia("(max-width: 1023px)").matches ||
        document.querySelector("dialog[open]")
      )
        return;
      try {
        if (
          sessionStorage.getItem("digital-handyman.exit") ||
          sessionStorage.getItem("digital-handyman.scorecard")
        )
          return;
        sessionStorage.setItem("digital-handyman.exit", "1");
        setExit(true);
      } catch {}
    };
    document.addEventListener("keydown", keyboard);
    document.addEventListener("mouseout", leave);
    return () => {
      observer.disconnect();
      document.removeEventListener("keydown", keyboard);
      document.removeEventListener("mouseout", leave);
    };
  }, []);
  useEffect(() => {
    if (palette) dialog.current?.showModal();
    else dialog.current?.close();
  }, [palette]);
  useEffect(() => {
    if (exit) exitDialog.current?.showModal();
    else exitDialog.current?.close();
  }, [exit]);
  const links = [
    { label: "See how it works", id: "workflows" },
    { label: copy.what_we_automate, id: "library" },
    { label: copy.how_it_works, id: "process" },
    { label: copy.try_the_demo, id: "demo" },
    { label: copy.calculate_your_time, id: "calculator" },
    { label: copy.find_your_starting_point, id: "scorecard" },
    { label: copy.pricing, id: "pricing" },
    { label: copy.meet_the_studio, id: "studio" },
    { label: "Delivery & common questions", id: "questions" },
    { label: copy.book_a_call, id: "booking" },
  ];
  const results = [
    ...links.map((l) => ({ ...l, type: copy.go_to })),
    ...automations.map((a) => ({
      label: a.title,
      id: a.id,
      type: copy.automation,
    })),
  ]
    .filter((r) => r.label.toLowerCase().includes(query.toLowerCase()))
    .slice(0, 12);
  const go = (id: string) => {
    setPalette(false);
    setMenu(false);
    if (id === "booking") {
      book();
      return;
    }
    if (id === "scorecard")
      window.dispatchEvent(new Event("digital-handyman:scorecard"));
    location.hash = id;
  };
  return (
    <>
      <header className={`site-header ${pastHero ? "scrolled" : ""}`}>
        <div className="header-inner">
          <a href="/" aria-label={copy.digital_handyman_home}>
            <Logo />
          </a>
          <nav aria-label={copy.main_navigation}>
            <a href="#library">{copy.what_we_automate}</a>
            <a href="#process">{copy.how_it_works}</a>
            <a href="#pricing">{copy.pricing}</a>
            <a href="#studio">{copy.who_we_are}</a>
          </nav>
          <div className="header-actions">
            <button
              className="command-trigger"
              onClick={() => {
                setPalette(true);
                setQuery("");
                setIndex(0);
              }}
              aria-label={copy.search_the_website}
            >
              <Icon name="search" size={16} />
              <kbd>{copy.k}</kbd>
            </button>
            <button
              className={`button button-white nav-cta ${pastHero ? "visible" : ""}`}
              onClick={() => book()}
            >
              {copy.book_a_call}
            </button>
            <button
              className="menu-trigger"
              ref={menuTrigger}
              onClick={() => setMenu(!menu)}
              aria-expanded={menu}
              aria-label={menu ? copy.close_navigation : copy.open_navigation}
            >
              <Icon name={menu ? "close" : "plus"} />
            </button>
          </div>
        </div>
        {menu && (
          <div className="mobile-menu">
            {links.map((l) => (
              <button key={l.id} onClick={() => go(l.id)}>
                {l.label}
              </button>
            ))}
            <label>
              {copy.your_industry}
              <select
                defaultValue=""
                onChange={(e) => {
                  location.href = `/for/${e.target.value}`;
                }}
              >
                <option disabled value="">
                  {copy.choose_your_industry}
                </option>
                {industries.map((i) => (
                  <option key={i.slug} value={i.slug}>
                    {i.shortName}
                  </option>
                ))}
              </select>
            </label>
          </div>
        )}
      </header>
      <div className={`mobile-booking ${pastHero ? "visible" : ""}`}>
        <button className="button button-signal" onClick={() => book()}>
          {copy.book_a_call}
        </button>
        {site.contact.phone && (
          <a
            href={`tel:${site.contact.phone.replace(/[^+\d]/g, "")}`}
            className="mobile-phone"
            aria-label={copy.call_digital_handyman}
            onClick={() => track("phone_clicked")}
          >
            <Icon name="phone" />
          </a>
        )}
      </div>
      <dialog
        className="command-dialog"
        aria-label={copy.search_the_website}
        ref={dialog}
        onCancel={() => setPalette(false)}
        onClick={(e) => {
          if (e.target === e.currentTarget) setPalette(false);
        }}
      >
        <div
          className="command-inner"
          onKeyDown={(e) => {
            if (e.key === copy.arrowdown) {
              e.preventDefault();
              setIndex((n) => (n + 1) % Math.max(results.length, 1));
            }
            if (e.key === copy.arrowup) {
              e.preventDefault();
              setIndex(
                (n) => (n + results.length - 1) % Math.max(results.length, 1),
              );
            }
            if (e.key === copy.enter && results[index]) {
              e.preventDefault();
              go(results[index].id);
            }
          }}
        >
          <div className="command-input">
            <Icon name="search" />
            <input
              autoFocus
              placeholder={copy.find_a_task_or_jump_to}
              aria-label={copy.search_tasks_and_sections}
              aria-controls="command-results"
              aria-activedescendant={
                results[index] ? `command-${index}` : undefined
              }
              role="combobox"
              aria-expanded="true"
              autoComplete="off"
              value={query}
              onChange={(e) => {
                setQuery(e.target.value);
                setIndex(0);
              }}
            />
            <button
              onClick={() => setPalette(false)}
              aria-label={copy.close_search}
            >
              <kbd>{copy.esc}</kbd>
            </button>
          </div>
          <div
            className="command-results"
            id="command-results"
            role="listbox"
            aria-label={copy.search_results}
          >
            {results.map((r, i) => (
              <button
                id={`command-${i}`}
                key={r.id}
                role="option"
                tabIndex={-1}
                aria-selected={i === index}
                className={i === index ? "active" : ""}
                onClick={() => go(r.id)}
                onPointerMove={() => setIndex(i)}
              >
                <span>{r.label}</span>
                <small>{r.type}</small>
              </button>
            ))}
            {!results.length && <p>{copy.no_matching_work_try_invoice_or}</p>}
          </div>
          <div className="command-footer">
            {copy.use_to_choose_enter_to_open}
          </div>
        </div>
      </dialog>
      <dialog
        ref={exitDialog}
        className="exit-dialog"
        aria-label={copy.find_your_starting_point}
        onCancel={() => setExit(false)}
      >
        <button
          className="dialog-close"
          onClick={() => setExit(false)}
          aria-label={copy.close_suggestion}
        >
          <Icon name="close" />
        </button>
        <Icon name="clock" size={28} />
        <h2>
          {copy.leave_with_a}
          <br />
          {copy.starting_point}
        </h2>
        <p>{copy.eight_questions_about_your_week_three}</p>
        <button
          className="button button-dark"
          onClick={() => {
            setExit(false);
            window.dispatchEvent(new Event("digital-handyman:scorecard"));
            location.hash = "scorecard";
          }}
        >
          {copy.find_my_starting_point}
        </button>
        <button className="text-button" onClick={() => setExit(false)}>
          {copy.keep_exploring}
        </button>
      </dialog>
    </>
  );
}
export function HeroActions() {
  return (
    <div className="hero-actions">
      <button
        className="button button-white"
        onClick={() => book(undefined, "hero_cta")}
      >
        {copy.book_a_30minute_call}
      </button>
      <a
        className="hero-secondary"
        href="#library"
        onClick={() => track("hero_cta", { action: "library" })}
      >
        {copy.see_what_wed_automate}{" "}
        <span className="round-icon">
          <Icon name="down" size={14} />
        </span>
      </a>
    </div>
  );
}
export function BookButton({
  children = copy.book_a_call,
  className = "button button-dark",
  opportunity,
}: {
  children?: React.ReactNode;
  className?: string;
  opportunity?: string;
}) {
  return (
    <button className={className} onClick={() => book(opportunity)}>
      {children}
    </button>
  );
}
