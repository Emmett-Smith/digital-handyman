export type DemoResult = {
  fields: { label: string; value: string }[];
  summary: string;
  reply: string;
};
export type DemoExample = {
  id: string;
  label: string;
  input: string;
  result: DemoResult;
};
export const demoExamples: DemoExample[] = [
  {
    id: "quote",
    label: "A messy quote request",
    input:
      "Hi — can you quote 40 aluminum brackets, same spec as last time? Need them by Friday if possible. Deliver to our north warehouse. Please send the quote to Sam. Thanks!",
    result: {
      fields: [
        { label: "Request", value: "Price quote" },
        { label: "Item", value: "Aluminum brackets" },
        { label: "Quantity", value: "40" },
        { label: "Requested delivery", value: "Friday — confirm date" },
        { label: "Delivery location", value: "North warehouse" },
        { label: "Contact", value: "Sam" },
        {
          label: "Needs checking",
          value: "Previous specification and delivery address",
        },
      ],
      summary:
        "A quote for 40 aluminum brackets, requested by Friday. Confirm the previous specification, exact date, and delivery address before pricing.",
      reply:
        "Hi Sam, thanks for the request. We’ll put together a quote for 40 aluminum brackets. Could you confirm the previous order reference and the north warehouse address? We’ll check whether Friday delivery is possible.",
    },
  },
  {
    id: "dental",
    label: "A patient message",
    input:
      "Hello, I need to move my cleaning from Tuesday morning to sometime next week. After 3 works best. Also my insurance changed so I need to give you the new details. — Alex",
    result: {
      fields: [
        { label: "Request", value: "Reschedule cleaning" },
        { label: "Patient", value: "Alex" },
        { label: "Current appointment", value: "Tuesday morning" },
        { label: "Preferred time", value: "Next week, after 3 pm" },
        {
          label: "Follow-up",
          value: "Collect updated insurance details securely",
        },
      ],
      summary:
        "Alex wants to reschedule a cleaning and update insurance. Staff should check available appointments and send the approved secure intake link.",
      reply:
        "Hi Alex, we can help you find a time next week after 3 pm. Our front desk will check availability and send you the secure way to update your insurance details.",
    },
  },
  {
    id: "invoice",
    label: "A supplier invoice",
    input:
      "Invoice 1048 from North Supply. 12 boxes of fasteners at $24 each. Shipping $18. Total $306. Due 30 days from receipt. Please reference PO-209 on payment.",
    result: {
      fields: [
        { label: "Supplier", value: "North Supply" },
        { label: "Invoice", value: "1048" },
        { label: "Purchase order", value: "PO-209" },
        { label: "Items", value: "12 boxes of fasteners × $24" },
        { label: "Shipping", value: "$18" },
        { label: "Total", value: "$306" },
        { label: "Payment terms", value: "30 days from receipt" },
      ],
      summary:
        "Invoice 1048 totals $306 against PO-209. The item and shipping amounts add up. Confirm receipt date and match the purchase order before payment.",
      reply:
        "Thank you for invoice 1048. We’ve recorded the $306 total against PO-209 and will check it against the purchase order before scheduling payment.",
    },
  },
];
