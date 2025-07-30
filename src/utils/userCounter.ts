const USER_COUNT_KEY = 'app-vault-user-count';
const WEEKLY_INCREMENT_KEY = 'app-vault-weekly-increment';
const LAST_INCREMENT_KEY = 'app-vault-last-increment';

const INITIAL_COUNT = 50;
const WEEKLY_INCREMENT = 1;

export const getUserCount = (): number => {
  const savedCount = localStorage.getItem(USER_COUNT_KEY);
  if (!savedCount) {
    localStorage.setItem(USER_COUNT_KEY, INITIAL_COUNT.toString());
    return INITIAL_COUNT;
  }
  return parseInt(savedCount, 10);
};

export const incrementUserCount = (): void => {
  const currentCount = getUserCount();
  const lastIncrement = localStorage.getItem(LAST_INCREMENT_KEY);
  const now = new Date().getTime();
  
  // Check if it's been at least 24 hours since last increment
  if (!lastIncrement || (now - parseInt(lastIncrement, 10)) > 24 * 60 * 60 * 1000) {
    const newCount = currentCount + WEEKLY_INCREMENT;
    localStorage.setItem(USER_COUNT_KEY, newCount.toString());
    localStorage.setItem(LAST_INCREMENT_KEY, now.toString());
  }
};