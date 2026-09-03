const WEEK_MS = 7 * 24 * 60 * 60 * 1000;

export function getCreditBalance(entry, today = new Date()) {
  const principal = Number(entry.originalAmount ?? entry.amount ?? 0);
  const due = new Date(`${entry.dueDate}T00:00:00`);
  if (Number.isNaN(due.getTime()) || today <= due) return principal;
  const overdueWeeks = Math.floor((today.getTime() - due.getTime()) / WEEK_MS);
  return principal * 1.1 ** overdueWeeks;
}

export function getOverdueWeeks(entry, today = new Date()) {
  const due = new Date(`${entry.dueDate}T00:00:00`);
  if (Number.isNaN(due.getTime()) || today <= due) return 0;
  return Math.floor((today.getTime() - due.getTime()) / WEEK_MS);
}
