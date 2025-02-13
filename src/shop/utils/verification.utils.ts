export function getVerificationCode(): number {
  return Math.floor(100000 + Math.random() * 900000);
}

export function getCodeExpiryTime(minute: number = 5): Date {
  const expiry = new Date();
  expiry.setMinutes(expiry.getMinutes() + minute);
  return expiry;
}
