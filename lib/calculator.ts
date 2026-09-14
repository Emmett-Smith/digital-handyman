export function calculateCapacity(values: {
  people: number;
  hours: number;
  rate: number;
  share: number;
}) {
  const weeklyHours = (values.people * values.hours * values.share) / 100;
  const annualValue = weeklyHours * values.rate * 52;
  const comparisonMaximum = Math.max(annualValue, 9500);
  return {
    weeklyHours,
    annualValue,
    sprintMonths: annualValue > 0 ? (9500 / annualValue) * 12 : null,
    recoveredWidth: (annualValue / comparisonMaximum) * 100,
    auditWidth: (2500 / comparisonMaximum) * 100,
    sprintWidth: (9500 / comparisonMaximum) * 100,
  };
}
