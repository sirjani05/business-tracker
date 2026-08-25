const ACCOUNTS_KEY = "vanzwe-accounts";

export function getAccounts() {
  try {
    return JSON.parse(localStorage.getItem(ACCOUNTS_KEY) || "[]");
  } catch {
    return [];
  }
}

export function saveAccount(account) {
  const accounts = getAccounts();
  const nextAccounts = [...accounts, account];
  localStorage.setItem(ACCOUNTS_KEY, JSON.stringify(nextAccounts));
  return account;
}

export function findAccount({ role, username, phone, secret }) {
  return getAccounts().find(
    (account) =>
      account.role === role &&
      account.username.toLowerCase() === username.trim().toLowerCase() &&
      account.phone.replace(/\s/g, "") === phone.trim().replace(/\s/g, "") &&
      account.secret === secret,
  );
}
