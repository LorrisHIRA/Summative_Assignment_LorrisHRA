import { loadRecords, saveRecords, loadCap, saveCap } from "./storage.js";
import { descRegex, amountRegex, dateRegex, categoryRegex, duplicateRegex } from "./validators.js";
import { compileRegex, highlight } from "./search.js";
import { calculateStats } from "./stats.js";

let records = loadRecords();
let cap = loadCap();
let editId = null;

const table = document.getElementById("recordsTable");
const form = document.getElementById("recordForm");
const message = document.getElementById("formMessage");

function render() {
  table.innerHTML = "";

  const searchValue = document.getElementById("searchInput").value;
  const regex = compileRegex(searchValue);

  records.forEach(record => {
    const row = document.createElement("tr");

    row.innerHTML = `
      <td>${highlight(record.description, regex)}</td>
      <td>${record.amount}</td>
      <td>${record.category}</td>
      <td>${record.date}</td>
      <td>
        <button data-id="${record.id}" class="edit">Edit</button>
        <button data-id="${record.id}" class="delete">Delete</button>
      </td>
    `;

    table.appendChild(row);
  });

  const stats = calculateStats(records);
  document.getElementById("totalCount").textContent = stats.totalCount;
  document.getElementById("totalSpent").textContent = stats.totalSpent.toFixed(2);
  document.getElementById("topCategory").textContent = stats.topCategory;

  const capStatus = document.getElementById("capStatus");

  if (cap > 0) {
    if (stats.totalSpent > cap) {
      capStatus.textContent = "Budget exceeded.";
      capStatus.setAttribute("aria-live", "assertive");
    } else {
      capStatus.textContent = "Within budget.";
      capStatus.setAttribute("aria-live", "polite");
    }
  }
}

form.addEventListener("submit", e => {
  e.preventDefault();

  const description = descriptionInput.value.trim();
  const amount = amountInput.value;
  const category = categoryInput.value.trim();
  const date = dateInput.value;

  if (!descRegex.test(description) ||
      !amountRegex.test(amount) ||
      !dateRegex.test(date) ||
      !categoryRegex.test(category)) {
    message.textContent = "Invalid input.";
    return;
  }

  if (duplicateRegex.test(description)) {
    message.textContent = "Duplicate word detected.";
    return;
  }

  message.textContent = "";

  if (editId) {
    const record = records.find(r => r.id === editId);
    record.description = description;
    record.amount = amount;
    record.category = category;
    record.date = date;
    record.updatedAt = new Date().toISOString();
    editId = null;
  } else {
    records.push({
      id: "txn_" + Date.now(),
      description,
      amount,
      category,
      date,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    });
  }

  saveRecords(records);
  form.reset();
  render();
});

table.addEventListener("click", e => {
  const id = e.target.dataset.id;

  if (e.target.classList.contains("delete")) {
    records = records.filter(r => r.id !== id);
    saveRecords(records);
    render();
  }

  if (e.target.classList.contains("edit")) {
    const record = records.find(r => r.id === id);
    descriptionInput.value = record.description;
    amountInput.value = record.amount;
    categoryInput.value = record.category;
    dateInput.value = record.date;
    editId = id;
  }
});

document.getElementById("searchInput").addEventListener("input", render);

document.getElementById("sortSelect").addEventListener("change", e => {
  const value = e.target.value;

  if (value === "amount") {
    records.sort((a,b) => a.amount - b.amount);
  }
  if (value === "date") {
    records.sort((a,b) => new Date(a.date) - new Date(b.date));
  }
  if (value === "description") {
    records.sort((a,b) => a.description.localeCompare(b.description));
  }

  render();
});

document.getElementById("saveCap").addEventListener("click", () => {
  cap = Number(document.getElementById("budgetCap").value);
  saveCap(cap);
  render();
});

document.getElementById("exportBtn").addEventListener("click", () => {
  const blob = new Blob([JSON.stringify(records, null, 2)], {type: "application/json"});
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = "finance_data.json";
  a.click();
});

document.getElementById("importFile").addEventListener("change", e => {
  const file = e.target.files[0];
  const reader = new FileReader();

  reader.onload = function() {
    try {
      const data = JSON.parse(reader.result);
      if (Array.isArray(data)) {
        records = data;
        saveRecords(records);
        render();
      }
    } catch {
      alert("Invalid JSON file.");
    }
  };

  reader.readAsText(file);
});

render();
