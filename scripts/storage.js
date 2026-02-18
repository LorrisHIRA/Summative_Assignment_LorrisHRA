const KEY = "finance_records";
const CAP_KEY = "finance_cap";

export function loadRecords() {
  const data = localStorage.getItem(KEY);
  return data ? JSON.parse(data) : [];
}

export function saveRecords(records) {
  localStorage.setItem(KEY, JSON.stringify(records));
}

export function saveCap(cap) {
  localStorage.setItem(CAP_KEY, cap);
}

export function loadCap() {
  return Number(localStorage.getItem(CAP_KEY)) || 0;
}
