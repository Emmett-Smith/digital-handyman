export type CalculatorDefaults = {
  people: number;
  hours: number;
  rate: number;
  share: number;
};
export type Industry = {
  slug: string;
  name: string;
  shortName: string;
  audience: string;
  headline: string;
  description: string;
  hooks: Record<string, string>;
  examples: string[];
  weeklyHours: number[];
  calculator: CalculatorDefaults;
};
const make = (
  slug: string,
  name: string,
  shortName: string,
  audience: string,
  headline: string,
  examples: string[],
  weeklyHours: number[],
  rate: number,
  hooks: Record<string, string>,
): Industry => ({
  slug,
  name,
  shortName,
  audience,
  headline,
  examples,
  weeklyHours,
  hooks,
  description: `Practical digital help for ${name.toLowerCase()}. Spend less time on ${examples[0].toLowerCase()} and more time on your business. Fixed-price Business Tune-Up: $2,500.`,
  calculator: { people: 3, hours: 12, rate, share: 65 },
});
export const industries: Industry[] = [
  make(
    "dental",
    "Dental and medical practices",
    "Dental & medical",
    "practices",
    "Your front desk has more to do than recall calls.",
    ["Recall calls", "Insurance verification", "Post-op follow-ups"],
    [6, 8, 4],
    38,
    {
      recall: "Recall calls are taking over your front desk.",
      insurance: "Get insurance checked before the patient arrives.",
      followup: "Every patient followed up. Less time on the phone.",
    },
  ),
  make(
    "legal",
    "Law firms",
    "Law firms",
    "law firms",
    "More time for cases. Less time chasing paperwork.",
    ["Client intake", "Document requests", "Time-entry reminders"],
    [7, 6, 3],
    75,
    {
      intake: "The next case should not start with a pile of retyping.",
      documents: "Stop chasing the same missing documents.",
      billing: "Capture the time your team forgets to bill.",
    },
  ),
  make(
    "accounting",
    "Accounting firms",
    "Accounting",
    "accounting firms",
    "The books need you. The document chasing does not.",
    ["Client document collection", "Invoice coding", "Deadline reminders"],
    [8, 5, 3],
    58,
    {
      documents: "Spend tax season on the numbers, not missing documents.",
      invoices: "Give every invoice a place without retyping it.",
      deadlines: "Keep client deadlines moving without the reminder list.",
    },
  ),
  make(
    "manufacturing",
    "Machine shops and manufacturers",
    "Manufacturing",
    "shops",
    "Your shop runs on precision. Your paperwork should too.",
    ["RFQ intake", "Material certs", "Job traveler paperwork"],
    [7, 4, 6],
    48,
    {
      rfq: "Get the RFQ off the inbox and onto the shop floor.",
      certs: "Find the material cert without the paper chase.",
      paperwork: "Your best machinist should not be moving paperwork.",
    },
  ),
  make(
    "construction",
    "Construction and trades",
    "Construction",
    "contractors",
    "The job is on site. The second shift is paperwork.",
    ["Quotes from site notes", "Job scheduling", "Subcontractor follow-ups"],
    [6, 5, 4],
    48,
    {
      quotes: "Turn the site visit into a quote before the next job.",
      scheduling: "Keep the crew schedule out of your evening.",
      followup: "Follow up on every quote without another late night.",
    },
  ),
  make(
    "property-management",
    "Property management",
    "Property management",
    "property teams",
    "More properties should not mean more paperwork.",
    ["Maintenance request routing", "Rent reminders", "Lease renewals"],
    [7, 4, 5],
    40,
    {
      maintenance: "Get the repair request to the right person, first time.",
      rent: "Follow up on late rent without working through a list.",
      leases: "Keep renewals moving before the lease runs out.",
    },
  ),
  make(
    "staffing",
    "Staffing and recruiting",
    "Staffing",
    "recruiting teams",
    "Your recruiters should be talking to people.",
    ["Candidate intake", "Interview scheduling", "Timesheet reminders"],
    [6, 7, 3],
    45,
    {
      intake: "Less copying résumés. More conversations.",
      scheduling: "Book the interview without the back-and-forth.",
      timesheets: "Chase the timesheet without chasing your own tail.",
    },
  ),
  make(
    "insurance",
    "Insurance agencies",
    "Insurance",
    "agencies",
    "Spend more time advising. Less time following up.",
    ["Renewal reminders", "Application intake", "Certificate requests"],
    [5, 7, 4],
    48,
    {
      renewals: "Start every renewal before the last-minute scramble.",
      intake: "Stop typing the same application twice.",
      certificates: "Get certificates out without a queue of emails.",
    },
  ),
  make(
    "distribution",
    "Distributors and wholesalers",
    "Distribution",
    "distributors",
    "Keep orders moving. Get the retyping out of the way.",
    ["Purchase order entry", "Supplier follow-ups", "Delivery updates"],
    [8, 5, 4],
    42,
    {
      orders: "A customer email should not need three rounds of retyping.",
      suppliers: "Know where the order stands without chasing the supplier.",
      delivery: "Keep customers updated before they call you.",
    },
  ),
  make(
    "automotive",
    "Auto dealers and repair",
    "Automotive",
    "automotive teams",
    "Keep the bays full. Keep the paperwork moving.",
    ["Service reminders", "Estimate follow-ups", "Parts order entry"],
    [5, 6, 4],
    40,
    {
      service: "Bring the customer back without another reminder list.",
      estimates:
        "Follow up on the repair estimate before the customer forgets.",
      parts: "Order the part without retyping the same details.",
    },
  ),
  make(
    "ecommerce",
    "E-commerce brands",
    "E-commerce",
    "brands",
    "More orders. Fewer repetitive support emails.",
    ["Order status replies", "Return requests", "Stock alerts"],
    [9, 5, 3],
    38,
    {
      orders: "Answer where-is-my-order before it fills the inbox.",
      returns: "Move returns along without a chain of emails.",
      inventory: "Know what is running low before the customer does.",
    },
  ),
  make(
    "marketing",
    "Marketing agencies",
    "Marketing agencies",
    "agencies",
    "Keep your team creating. Let the reporting run.",
    ["Client reporting", "Lead intake", "Approval reminders"],
    [7, 4, 4],
    55,
    {
      reports: "Get the weekly report out without losing a morning.",
      leads: "Route every new lead without watching the inbox.",
      approvals: "Keep client approvals from holding up the work.",
    },
  ),
];
export const defaultCalculator: CalculatorDefaults = {
  people: 3,
  hours: 12,
  rate: 45,
  share: 65,
};
export const getIndustry = (slug?: string) =>
  industries.find((i) => i.slug === slug);
