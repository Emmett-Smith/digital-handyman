import { offers } from "@/content/site";
import { Icon } from "./Icon";
import "./trust-section.css";

const commitments = [
  {
    title: "Agree on what done means.",
    description:
      "The workflow, deliverables, success measures, software costs, and build price are agreed in writing before work begins.",
  },
  {
    title: "Test the work. Keep a person in control.",
    description:
      "Review real examples, missing information, and failure cases together. Agree where your team needs to check or approve a result.",
  },
  {
    title: "Leave your team ready to run it.",
    description:
      "Get the build, documentation, and training in accounts you control, including how to pause a workflow and handle an exception.",
  },
];

const audit = offers[0];
const sprint = offers[1];
const support = offers[2];

const questions = [
  {
    question: "Will this work with the tools we already use?",
    answer:
      "That is the starting point. The Business Tune-Up checks your existing tools, available connections, and access requirements. If a system has limits or needs another subscription, you see that in the scope before choosing a build.",
  },
  {
    question: "What happens to our business data?",
    answer:
      "Before connecting anything, we agree what data the workflow needs, which services will process it, and who should have access. Permissions are scoped to the work, and any retention or handling requirements are part of the build discussion.",
  },
  {
    question: "How long does an engagement take?",
    answer: `The ${audit.price} Business Tune-Up takes ${audit.time.toLowerCase()}. A Get-It-Done Build starts at ${sprint.price} and is scoped for ${sprint.time.toLowerCase()}. Your quote sets out the work, access needed, milestones, and acceptance checks. The Tune-Up is credited in full against any build.`,
  },
  {
    question: "What do we own, and what happens after launch?",
    answer: `Everything we build belongs to your business, with documentation and team training included. Keep-It-Running Service is optional, from ${support.price} per month with a three-month minimum. Maintenance, notice, and handoff terms are agreed in writing before that engagement starts.`,
  },
];

export function TrustSection() {
  return (
    <section
      id="questions"
      className="trust-section paper"
      aria-labelledby="trust-heading"
    >
      <div className="container">
        <div className="trust-heading">
          <div>
            <span className="section-note">
              <span className="small-line" aria-hidden="true" />
              Confidence comes from the details.
            </span>
            <h2 id="trust-heading">
              Clear expectations.
              <br />
              Confident handoff.
            </h2>
          </div>
          <p>
            You should know what you are buying, how we will check it, and who
            owns it when the work is done.
          </p>
        </div>

        <div className="trust-layout">
          <div className="trust-delivery">
            <div className="trust-delivery-heading">
              <Icon name="file" size={20} />
              <h3>Our delivery commitments</h3>
            </div>
            <ol className="trust-commitments">
              {commitments.map((commitment, index) => (
                <li key={commitment.title}>
                  <span className="trust-number mono" aria-hidden="true">
                    {String(index + 1).padStart(2, "0")}
                  </span>
                  <div>
                    <h4>{commitment.title}</h4>
                    <p>{commitment.description}</p>
                  </div>
                </li>
              ))}
            </ol>
            <div className="trust-delivery-note">
              <Icon name="check" size={16} />
              <span>Agreed scope. Shared checks. Your ownership.</span>
            </div>
          </div>

          <div className="trust-questions" aria-labelledby="trust-faq-heading">
            <h3 id="trust-faq-heading">Good questions to ask.</h3>
            {questions.map(({ question, answer }) => (
              <details className="trust-question" key={question}>
                <summary>
                  <span>{question}</span>
                  <span className="trust-question-toggle" aria-hidden="true">
                    <Icon name="plus" size={18} />
                  </span>
                </summary>
                <p>{answer}</p>
              </details>
            ))}
            <a href="#booking" className="trust-contact">
              Talk through your workflow
              <Icon name="chevron" size={17} />
            </a>
          </div>
        </div>
      </div>
    </section>
  );
}
