const MONTHS = [
  "JAN",
  "FEB",
  "MAR",
  "APR",
  "MAY",
  "JUN",
  "JUL",
  "AUG",
  "SEP",
  "OCT",
  "NOV",
  "DEC",
];

export default function osdDate(date = new Date()) {
  const day = String(date.getDate()).padStart(2, "0");
  return `${MONTHS[date.getMonth()]} ${day} ${date.getFullYear()}`;
}
