export const site = {
  name: "Throughline AI",
  bookingLabel: "Book a 30-minute call",
  positioning:
    "We turn repetitive work into reliable workflows. Practical AI, connected to the tools you already use, with your team in control.",
  headline: ["Good people.", "Too much", "repeat work."],
  description:
    "AI consulting, implementation and integration for the work that fills your week. A fixed-price $2,500 Audit, a working build, and a team that gets its time back.",
  guarantee:
    "If the Audit doesn’t identify at least ten hours a week of recoverable time, there’s no charge.",
  contact: {
    phone: process.env.NEXT_PUBLIC_PHONE || "",
    email: process.env.NEXT_PUBLIC_CONTACT_EMAIL || "",
  },
  scheduler: process.env.NEXT_PUBLIC_CALENDLY_URL || "",
  url: process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000",
};
export const offers = [
  {
    name: "Automation Audit",
    time: "One week",
    price: "$2,500",
    unit: "fixed price",
    description: "Find the work worth taking off your plate.",
    items: [
      "A walkthrough of how your business actually works",
      "A ranked list of time and money you could recover",
      "A build quote for the top three opportunities",
    ],
    note: "Credited in full against any build.",
    featured: true,
  },
  {
    name: "Build Sprint",
    time: "Two to three weeks",
    price: "$9,500",
    unit: "starting at",
    description: "One recurring task, taken care of.",
    items: [
      "One workflow built and running in your business",
      "Your team trained and comfortable using it",
      "Documentation and everything built belong to you",
    ],
    note: "A clear scope and price before work begins.",
    featured: false,
  },
  {
    name: "Ongoing Automation",
    time: "Monthly",
    price: "$2,800",
    unit: "from, per month",
    description: "Keep getting time back as your business grows.",
    items: [
      "One new automation shipped each month",
      "Maintenance of everything already built",
      "A continuing queue, prioritized together",
    ],
    note: "Three-month minimum.",
    featured: false,
  },
];
export const stages = [
  {
    name: "A conversation",
    duration: "30 min",
    title: "Start with the work.",
    description:
      "Tell us what keeps coming back to your desk. We’ll tell you whether an Audit makes sense.",
  },
  {
    name: "The Audit",
    duration: "1 week",
    title: "Find the hours.",
    description:
      "We walk through the work with your team, put numbers against it, and quote the top three opportunities.",
  },
  {
    name: "The build",
    duration: "2–3 weeks",
    title: "Make it work.",
    description:
      "We build one agreed workflow in your accounts, using the tools your team already knows.",
  },
  {
    name: "Go live",
    duration: "1 workflow",
    title: "Put it to work.",
    description:
      "Run it on real work, check the exceptions, and make sure the result is useful.",
  },
  {
    name: "The handoff",
    duration: "Your team",
    title: "Make it yours.",
    description:
      "Your people get training. You get the documentation and everything we built.",
  },
];
export const diagnosis = [
  {
    title: "Nobody has time to stop and map the work.",
    body: "The people who know the process best are busy keeping it moving. So the same work gets done the same way, again.",
  },
  {
    title: "The tools still need someone to own them.",
    body: "Signing up is easy. Making it work with your files, your rules, and your team takes someone who can build.",
  },
  {
    title: "The last fix broke. Then its builder disappeared.",
    body: "We document the work, train your people, and build in your accounts. You should never need us just to understand what you own.",
  },
];
export const reassurances = [
  ["You own the work.", "Everything we build belongs to your business."],
  [
    "Your accounts. Your access.",
    "It runs in accounts you control, with documentation you can use.",
  ],
  [
    "Your team knows how.",
    "We train the people who use it and show them how to handle exceptions.",
  ],
  [
    "A clear way to stop.",
    "Keep the completed work and documentation. Ongoing support has a three-month minimum; notice and handoff terms are agreed in writing before you start.",
  ],
];
