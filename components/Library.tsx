"use client";
import { useEffect, useMemo, useState } from "react";
import {
  automations,
  departments,
  estimateNote,
  featuredAutomationIds,
} from "@/content/automations";
import { industries } from "@/content/industries";
import { track, book } from "@/lib/analytics";
import { Icon } from "./Icon";
import { interfaceCopy } from "@/content/interface";
const copy = interfaceCopy.Library;

export function Library({ industry = "all" }: { industry?: string }) {
  const [department, setDepartment] = useState<string>(copy.all_work);
  const [selected, setSelected] = useState(industry);
  const [query, setQuery] = useState("");
  const [expanded, setExpanded] = useState(false);
  const [open, setOpen] = useState<string | null>(null);
  useEffect(() => {
    const reveal = () => {
      let id = "";
      try {
        id = decodeURIComponent(location.hash.slice(1));
      } catch {
        return;
      }
      if (automations.some((a) => a.id === id)) {
        setDepartment(copy.all_work);
        setSelected("all");
        setQuery("");
        setExpanded(true);
        setOpen(id);
        requestAnimationFrame(() =>
          requestAnimationFrame(() => {
            const el = document.getElementById(id);
            el?.scrollIntoView({ block: "center", behavior: "instant" });
            el?.querySelector("button")?.focus({ preventScroll: true });
          }),
        );
      }
    };
    reveal();
    window.addEventListener("hashchange", reveal);
    return () => window.removeEventListener("hashchange", reveal);
  }, []);
  const filtered = useMemo(
    () =>
      automations.filter(
        (a) =>
          (department === copy.all_work || a.department === department) &&
          (selected === "all" ||
            a.industries.length === 0 ||
            a.industries.includes(selected)) &&
          a.title.toLowerCase().includes(query.toLowerCase()),
      ),
    [department, selected, query],
  );
  const ordered =
    selected === "all" && department === copy.all_work && !query
      ? [...filtered].sort((a, b) => {
          const first = featuredAutomationIds.indexOf(a.id);
          const second = featuredAutomationIds.indexOf(b.id);
          return (first < 0 ? 99 : first) - (second < 0 ? 99 : second);
        })
      : filtered;
  const items = expanded ? ordered : ordered.slice(0, 9);
  return (
    <section id="library" className="library-section paper">
      <div className="container">
        <div className="section-top">
          <span className="section-note">
            <span className="small-line" />{" "}
            {copy.familiar_work_a_different_way_to}
          </span>
          <span className="mono quiet">
            {automations.length} {copy.possibilities}
          </span>
        </div>
        <div className="library-heading">
          <h2>
            {copy.find_your}
            <br />
            {copy.every_single_week}
          </h2>
          <p>
            {copy.the_calls_the_chasing_the_copying}
            <br />
            {copy.start_with_something_you_wish_would}
          </p>
        </div>
        <div className="library-tools">
          <div
            className="department-tabs"
            role="group"
            aria-label={copy.filter_by_department}
          >
            {[copy.all_work, ...departments].map((d) => (
              <button
                key={d}
                aria-pressed={department === d}
                className={department === d ? "active" : ""}
                onClick={() => {
                  setDepartment(d);
                  setExpanded(false);
                  track("library_filtered", {
                    department: d,
                    filterIndustry: selected,
                  });
                }}
              >
                {d}
              </button>
            ))}
          </div>
          <div className="library-search">
            <label className="search-field">
              <Icon name="search" size={17} />
              <input
                aria-label={copy.search_automations}
                placeholder={copy.find_a_task}
                value={query}
                onChange={(e) => setQuery(e.target.value)}
              />
            </label>
            <select
              aria-label={copy.filter_by_industry}
              value={selected}
              onChange={(e) => {
                setSelected(e.target.value);
                setExpanded(false);
                track("library_filtered", {
                  department,
                  filterIndustry: e.target.value,
                });
              }}
            >
              <option value="all">{copy.every_industry}</option>
              {industries.map((i) => (
                <option key={i.slug} value={i.slug}>
                  {i.shortName}
                </option>
              ))}
            </select>
          </div>
        </div>
        <div className="automation-grid">
          {items.map((a, i) => (
            <article
              id={a.id}
              className={`automation-item ${open === a.id ? "expanded" : ""}`}
              key={a.id}
            >
              <button
                className="automation-toggle"
                aria-expanded={open === a.id}
                aria-controls={`${a.id}-detail`}
                onClick={() => {
                  setOpen(open === a.id ? null : a.id);
                  if (open !== a.id) {
                    track("library_item_opened", { automation: a.id });
                    history.replaceState(null, "", `#${a.id}`);
                  }
                }}
              >
                <span className="automation-icon">
                  <Icon
                    name={
                      ["mail", "file", "clock", "calendar", "copy", "spark"][
                        i % 6
                      ]
                    }
                  />
                </span>
                <span className="automation-title">{a.title}</span>
                <span className="automation-meta">
                  <span>
                    <strong className="mono">
                      {a.hours[0]}
                      {copy.text}
                      {a.hours[1]}
                    </strong>{" "}
                    {copy.hrs_week}
                  </span>
                  <Icon name={open === a.id ? "close" : "plus"} size={17} />
                </span>
              </button>
              <div
                className="automation-detail"
                id={`${a.id}-detail`}
                hidden={open !== a.id}
              >
                <dl>
                  <dt>{copy.what_comes_in}</dt>
                  <dd>{a.input}</dd>
                  <dt>{copy.what_gets_done}</dt>
                  <dd>{a.output}</dd>
                </dl>
                <p>{a.review}</p>
                <button className="text-button" onClick={() => book(a.title)}>
                  {copy.book_a_call_about_this}
                </button>
              </div>
            </article>
          ))}
        </div>
        {filtered.length === 0 && (
          <div className="empty-state">
            <h3>{copy.no_matching_tasks_yet}</h3>
            <p>{copy.try_a_broader_search_or_choose}</p>
            <button
              className="button button-dark"
              onClick={() => {
                setQuery("");
                setSelected("all");
                setDepartment(copy.all_work);
              }}
            >
              {copy.show_all_work}
            </button>
          </div>
        )}
        <div className="library-bottom">
          <p>{estimateNote}</p>
          <button
            className="text-button"
            onClick={() => setExpanded(!expanded)}
            disabled={filtered.length <= 9}
          >
            {expanded
              ? copy.show_fewer_tasks
              : `Explore all ${filtered.length} tasks`}{" "}
            <Icon name="plus" size={16} />
          </button>
        </div>
      </div>
    </section>
  );
}
