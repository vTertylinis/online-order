// Utility for validating delivery hours based on Europe/Athens time
// Delivery hours: 09:00 to 23:59 (inclusive)

export function getGreekCurrentDate(): Date {
  // Create a Date object from a localized string in the Athens timezone
  const greekTime = new Date().toLocaleString('en-US', {
    timeZone: 'Europe/Athens',
    hour12: false,
  });
  return new Date(greekTime);
}

export function getGreekCurrentHour(): number {
  return getGreekCurrentDate().getHours();
}

export function isWithinDeliveryHours(): boolean {
  const hour = getGreekCurrentHour();
  return hour >= 9 && hour <= 23;
}
