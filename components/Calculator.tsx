"use client";
import { useEffect, useRef, useState } from "react";
import {
  type CalculatorDefaults,
  defaultCalculator,
} from "@/content/industries";
import { track } from "@/lib/analytics";
import { calculateCapacity } from "@/lib/calculator";
import { EmailCopy } from "./EmailCopy";
import { interfaceCopy } from "@/content/interface";
const copy = interfaceCopy.Calculator;

const money = (n: number) =>
  new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    maximumFractionDigits: 0,
  }).format(n);
export function Calculator({
  defaults = defaultCalculator,
}: {
  defaults?: CalculatorDefaults;
}) {
  const [values, setValues] = useState(defaults);
  const [display, setDisplay] = useState(
    () => calculateCapacity(defaults).annualValue,
  );
  const once = useRef(false);
  const raf = useRef(0);
  const numberFrame = useRef(0);
  const previous = useRef(display);
  const pending = useRef(defaults);
  const capacity = calculateCapacity(values);
  const annual = capacity.annualValue;
  const hours = capacity.weeklyHours;
  useEffect(() => {
    const from = previous.current;
    if (matchMedia("(prefers-reduced-motion: reduce)").matches) {
      setDisplay(annual);
      previous.current = annual;
      return;
    }
    const start = performance.now();
    const animate = (now: number) => {
      const p = Math.min((now - start) / 450, 1);
      const current = from + (annual - from) * (1 - Math.pow(1 - p, 3));
      previous.current = current;
      setDisplay(current);
      if (p < 1) numberFrame.current = requestAnimationFrame(animate);
    };
    cancelAnimationFrame(numberFrame.current);
    numberFrame.current = requestAnimationFrame(animate);
    return () => cancelAnimationFrame(numberFrame.current);
  }, [annual]);
  useEffect(() => () => cancelAnimationFrame(raf.current), []);
  const update = (key: keyof CalculatorDefaults, value: number) => {
    pending.current = { ...pending.current, [key]: value };
    cancelAnimationFrame(raf.current);
    raf.current = requestAnimationFrame(() => setValues(pending.current));
    if (!once.current) {
      track("calculator_engaged");
      once.current = true;
    }
  };
  const text = `Throughline AI — your estimate\n\n${values.people} people × ${values.hours} hours/week × ${values.share}% recoverable = ${hours.toFixed(1)} hours/week.\nHourly cost including overhead: ${money(values.rate)}.\nEstimated annual value of recovered time: ${money(annual)} (52 weeks).\nAutomation Audit: $2,500, credited in full against a build. Build Sprint: from $9,500.\nAt these assumptions, the starting Sprint price equals ${((9500 / (annual || 1)) * 12).toFixed(1)} months of recovered capacity.\nThis is an estimate of time capacity, not guaranteed cash savings. Subscription, ongoing support, adoption, and other costs are not included. The Audit checks your actual process and assumptions.`;
  return (
    <section id="calculator" className="calculator-section instrument">
      <div className="container">
        <div className="section-top">
          <span className="section-note">
            <span className="small-line" /> {copy.put_a_number_on_your_time}
          </span>
          <span className="quiet">{copy.your_assumptions_your_estimate}</span>
        </div>
        <div className="calculator-layout">
          <div className="calculator-controls">
            <h2>
              {copy.what_is_the}
              <br />
              {copy.busywork_costing}
            </h2>
            <p>
              {copy.a_few_hours_across_a_few}
              <br />
              {copy.move_the_numbers_to_match_your}
            </p>
            <div className="sliders">
              {(
                [
                  {
                    key: "people",
                    label: copy.people_doing_the_work,
                    min: 1,
                    max: 30,
                    step: 1,
                    suffix: "people",
                  },
                  {
                    key: "hours",
                    label: copy.hours_each_spends_per_week,
                    min: 1,
                    max: 40,
                    step: 1,
                    suffix: "hrs",
                  },
                  {
                    key: "rate",
                    label: copy.hourly_cost_including_overhead,
                    min: 15,
                    max: 150,
                    step: 5,
                    suffix: "",
                  },
                  {
                    key: "share",
                    label: copy.share_that_could_be_automated,
                    min: 5,
                    max: 90,
                    step: 5,
                    suffix: "%",
                  },
                ] as const
              ).map((s) => (
                <label className="slider-control" key={s.key}>
                  <span>
                    {s.label}
                    <output className="mono">
                      {s.key === "rate" ? "$" : ""}
                      {values[s.key]}
                      <small>{s.suffix}</small>
                    </output>
                  </span>
                  <input
                    type="range"
                    min={s.min}
                    max={s.max}
                    step={s.step}
                    value={values[s.key]}
                    onChange={(e) => update(s.key, Number(e.target.value))}
                    style={
                      {
                        "--range": `${((values[s.key] - s.min) / (s.max - s.min)) * 100}%`,
                      } as React.CSSProperties
                    }
                  />
                </label>
              ))}
            </div>
          </div>
          <div className="calculator-result">
            <span className="result-label">
              {copy.estimated_value_of_time_recovered_per}
            </span>
            <div
              className="annual-number mono"
              data-long={annual >= 1000000}
              aria-live="off"
            >
              {money(display)}
            </div>
            <div className="recovered-hours">
              <span className="healthy-dot" />
              <strong className="mono">{hours.toFixed(1)}</strong>{" "}
              {copy.hours_back_every_week}
            </div>
            <div className="comparison">
              <div className="comparison-row">
                <span>{copy.recovered_time_year}</span>
                <span className="mono">{money(annual)}</span>
                <div
                  className="comparison-bar recovered"
                  style={{ width: `${capacity.recoveredWidth}%` }}
                />
              </div>
              <div className="comparison-row">
                <span>{copy.automation_audit}</span>
                <span className="mono">{copy["2500"]}</span>
                <div
                  className="comparison-bar cost"
                  style={{
                    width: `${capacity.auditWidth}%`,
                  }}
                />
              </div>
              <div className="comparison-row">
                <span>{copy.build_sprint_starting_at}</span>
                <span className="mono">{copy["9500"]}</span>
                <div
                  className="comparison-bar cost"
                  style={{
                    width: `${capacity.sprintWidth}%`,
                  }}
                />
              </div>
            </div>
            <div className="payback">
              <span className="mono">
                {((9500 / annual) * 12).toFixed(1)} {copy.months}
              </span>
              <span>{copy.of_recovered_time_equals_the_starting}</span>
            </div>
            <p className="calculator-disclaimer">
              {copy.estimated_capacity_not_guaranteed_cash_savings}
            </p>
            <EmailCopy text={text} />
          </div>
        </div>
      </div>
    </section>
  );
}
