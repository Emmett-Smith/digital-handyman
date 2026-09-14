"use client";
import { useState, useEffect, useRef, lazy, Suspense } from "react";
import { questions } from "@/content/scorecard";
import { automations } from "@/content/automations";
import { track, book } from "@/lib/analytics";
import { EmailCopy } from "./EmailCopy";
import { Icon } from "./Icon";
import { interfaceCopy } from "@/content/interface";
const copy = interfaceCopy.Scorecard;
const QuestionTransition=lazy(()=>import('./QuestionTransition'));

export function Scorecard({ industry }: { industry?: string }) {
  const [started, setStarted] = useState(false);
  const [answers, setAnswers] = useState<number[]>([]);
  const [step, setStep] = useState(0);
  const [reduced,setReduced]=useState(false);
  useEffect(()=>{const media=matchMedia('(prefers-reduced-motion: reduce)');const update=()=>setReduced(media.matches);update();media.addEventListener('change',update);return()=>media.removeEventListener('change',update);},[]);
  const section = useRef<HTMLElement>(null);
  useEffect(() => {
    if (!started) return;
    const timer = setTimeout(
      () =>
        section.current
          ?.querySelector<HTMLElement>(".scorecard-panel h3")
          ?.focus({ preventScroll: true }),
      reduced ? 0 : 180,
    );
    return () => clearTimeout(timer);
  }, [started, step, reduced]);
  useEffect(() => {
    const launch = () => {
      setStarted(true);
      setAnswers([]);
      setStep(0);
      track("scorecard_start");
    };
    window.addEventListener("throughline:scorecard", launch);
    return () => window.removeEventListener("throughline:scorecard", launch);
  }, []);
  const done = step === questions.length;
  const eligible = automations.filter(
    (a) =>
      !industry || a.industries.length === 0 || a.industries.includes(industry),
  );
  const candidates = questions
    .flatMap((q, i) =>
      q.ids.map((id) => ({ id, weight: 2 - (answers[i] ?? 2) })),
    )
    .filter((a) => a.weight > 0)
    .sort((a, b) => b.weight - a.weight);
  const ranked = [
    ...new Set([
      ...candidates
        .filter((c) => eligible.some((a) => a.id === c.id))
        .map((c) => c.id),
      ...eligible.map((a) => a.id),
    ]),
  ]
    .slice(0, 3)
    .map((id) => automations.find((a) => a.id === id)!);
  const score = Math.round(
    (answers.reduce((n, a) => n + (2 - a), 0) / 16) * 100,
  );
  const weekly = ranked.reduce((n, a) => n + a.hours[0], 0);
  const start = () => {
    setStarted(true);
    setAnswers([]);
    setStep(0);
    track("scorecard_start");
  };
  const choose = (answer: number) => {
    const next = [...answers];
    next[step] = answer;
    setAnswers(next);
    setStep(step + 1);
    if (step === questions.length - 1) {
      track("scorecard_complete", {
        score: Math.round((next.reduce((n, a) => n + 2 - a, 0) / 16) * 100),
      });
      try {
        sessionStorage.setItem(
          "throughline.scorecard",
          JSON.stringify({
            answers: next,
            score: Math.round((next.reduce((n, a) => n + 2 - a, 0) / 16) * 100),
          }),
        );
      } catch {}
    }
  };
  return (
    <section id="scorecard" className="scorecard-section paper" ref={section}>
      <div className="container scorecard-layout">
        <div className="scorecard-intro">
          <span className="section-note">
            <span className="small-line" /> {copy.a_useful_place_to_start}
          </span>
          <h2>
            {copy.not_sure_what}
            <br />
            {copy.to_automate}
            <br />
            {copy.start_here}
          </h2>
          <p>
            {copy.eight_questions_about_an_ordinary_week}
            <br />
            {copy.three_places_you_could_get_time}
          </p>
          <span className="scorecard-promise">
            <Icon name="clock" size={17} />{" "}
            {copy.about_two_minutes_results_right_away}
          </span>
        </div>
        <div className="scorecard-panel">
          {!started ? (
            <div className="scorecard-start">
              <div className="scorecard-illustration" aria-hidden="true">
                <div className="scorecard-sheet">
                  {[
                    copy.quotes_followups,
                    copy.invoices_paperwork,
                    copy.calls_customer_requests,
                    copy.the_work_only_you_know,
                  ].map((s, i) => (
                    <div key={s}>
                      <span className={i < 2 ? "checked" : ""}>
                        {i < 2 && <Icon name="check" size={12} />}
                      </span>
                      {s}
                    </div>
                  ))}
                </div>
                <span className="scorecard-count mono">{copy["8"]}</span>
              </div>
              <h3 tabIndex={-1}>{copy.a_clearer_picture_of_your_week}</h3>
              <p>
                {copy.no_email_gate_no_technical_questions}
                <br />
                {copy.just_the_work_your_team_knows}
              </p>
              <button className="button button-dark" onClick={start}>
                {copy.find_my_starting_point}
              </button>
            </div>
          ) : done ? (
            <div className="scorecard-results">
              <span className="result-label">
                {copy.your_automation_opportunity_score}
              </span>
              <div className="score-number mono">
                {score}
                <small>{copy["100"]}</small>
              </div>
              <h3 tabIndex={-1}>
                {score > 60
                  ? copy.there_is_room_to_get_time
                  : score > 25
                    ? "A few repeat tasks are worth a look."
                    : copy.you_already_have_a_good_head}
              </h3>
              <p>
                {score > 25
                  ? copy.these_are_three_starting_points_to
                  : copy.these_are_areas_to_check_rather}
              </p>
              <ul>
                {ranked.map((a) => (
                  <li key={a.id}>
                    <Icon name="check" size={16} />
                    <a href={`#${a.id}`}>{a.title}</a>
                    <span className="mono">
                      {a.hours[0]}
                      {copy.text}
                      {a.hours[1]}
                      {copy.h}
                    </span>
                  </li>
                ))}
              </ul>
              <p className="quiet small">
                {copy.up_to_roughly}
                {weekly} {copy.hours_per_week_at_the_low}
              </p>
              <button
                className="button button-dark"
                onClick={() => book(ranked.map((a) => a.title).join(" "))}
              >
                {copy.talk_about_my_starting_point}
              </button>
              <EmailCopy
                label="Send me the written plan"
                text={`Throughline AI — your starting point\nOpportunity score: ${score}/100\n\n${ranked.map((a) => `${a.title} Illustrative estimate: ${a.hours[0]}–${a.hours[1]} hours/week.`).join("\n")}\n\nThese tasks may overlap. An Audit checks the actual hours and gives you a fixed build quote. Automation Audit: $2,500, credited in full against any build.`}
              />
              <button className="text-button" onClick={start}>
                {copy.start_again}
              </button>
            </div>
          ) : (
            <div className="scorecard-question">
              <div className="question-progress">
                <span>{copy.about_your_week}</span>
                <span className="mono">
                  {step + 1} {copy.text_1}
                  {questions.length}
                </span>
                <div>
                  <span
                    style={{ width: `${(step / questions.length) * 100}%` }}
                  />
                </div>
              </div>
              <Suspense fallback={null}>
                <QuestionTransition step={step} reduced={reduced}>
                  <h3 tabIndex={-1}>{questions[step].question}</h3>
                  <div className="question-answers">
                    {questions[step].answers.map((a, i) => (
                      <button key={a} onClick={() => choose(i)}>
                        <span className="answer-radio" />
                        {a}
                      </button>
                    ))}
                  </div>
                </QuestionTransition>
              </Suspense>
              <button
                className="text-button"
                disabled={step === 0}
                onClick={() => setStep(step - 1)}
              >
                {copy.previous_question}
              </button>
              <p className="quiet small">
                {copy.choose_what_happens_most_often}
              </p>
            </div>
          )}
        </div>
      </div>
    </section>
  );
}
