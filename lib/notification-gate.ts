export function createNotificationGate() {
  let claimed = false;
  return {
    reset() {
      claimed = false;
    },
    claim() {
      if (claimed) return false;
      claimed = true;
      return true;
    },
  };
}
