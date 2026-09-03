const ACCOUNTS_KEY = "vanzwe-accounts";
const PROFILE_IMAGES_KEY = "vanzwe-profile-images";

function readJson(key, fallback) {
  try {
    return JSON.parse(localStorage.getItem(key) || JSON.stringify(fallback));
  } catch {
    return fallback;
  }
}

export function getAccounts() {
  return readJson(ACCOUNTS_KEY, []);
}

export function saveAccount(account) {
  const accounts = getAccounts();
  const nextAccounts = [...accounts, account].map(
    ({ profile, ...storedAccount }) => ({
      ...storedAccount,
      profile: Object.fromEntries(
        Object.entries(profile || {}).filter(([key]) => key !== "profileImage"),
      ),
    }),
  );
  try {
    localStorage.setItem(ACCOUNTS_KEY, JSON.stringify(nextAccounts));
  } catch (error) {
    if (error?.name !== "QuotaExceededError") throw error;
    localStorage.removeItem(PROFILE_IMAGES_KEY);
    try {
      localStorage.setItem(ACCOUNTS_KEY, JSON.stringify(nextAccounts));
    } catch {
      throw new Error(
        "Storage is full. Remove an old browser record or image and try again.",
      );
    }
  }
  try {
    const images = readJson(PROFILE_IMAGES_KEY, {});
    if (account.profile?.profileImage)
      images[account.id] = account.profile.profileImage;
    localStorage.setItem(PROFILE_IMAGES_KEY, JSON.stringify(images));
  } catch {
    // Account data remains usable if the image cannot be stored.
  }
  return account;
}

export function getAccountProfile(account) {
  const images = readJson(PROFILE_IMAGES_KEY, {});
  return {
    ...account.profile,
    profileImage: images[account.id] || account.profile?.profileImage || "",
  };
}

export function findAccount({ role, username, phone, secret }) {
  const account = getAccounts().find(
    (account) =>
      account.role === role &&
      account.username.toLowerCase() === username.trim().toLowerCase() &&
      account.phone.replace(/\s/g, "") === phone.trim().replace(/\s/g, "") &&
      account.secret === secret,
  );
  return account
    ? { ...account, profile: getAccountProfile(account) }
    : undefined;
}
