/*! Copyright (c) 2026 Color Note contributors.
 * SPDX-License-Identifier: AGPL-3.0-only
 * Additional terms under AGPLv3 Section 7: see LICENSE-ADDITIONAL.
 */
const form = document.querySelector("#note-form");
const input = document.querySelector("#note-text");
const status = document.querySelector("#status");
const button = document.querySelector("#save-note");
const card = document.querySelector("#saved-note");

function display(note) {
  if (typeof note.text !== "string") return;
  input.value = note.text;
  form.elements.namedItem("color").value = note.color;
  card.dataset.color = note.color;
  document.querySelector("#saved-text").textContent = note.text;
  card.hidden = false;
}

async function load() {
  try {
    const response = await fetch("./note", { cache: "no-store" });
    if (!response.ok) throw Error("读取失败，请刷新重试。");
    display(await response.json());
    button.disabled = false;
  } catch (error) { status.textContent = error.message; }
}

form.addEventListener("submit", async event => {
  event.preventDefault();
  const body = { text: input.value, color: form.elements.namedItem("color").value };
  button.disabled = true;
  status.textContent = "";
  try {
    const response = await fetch("./note", {
      method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(body),
    });
    const note = await response.json();
    if (!response.ok) throw Error(note.error || "保存失败，请重试。");
    display(note);
    status.textContent = "已保存";
  } catch (error) { status.textContent = error.message; }
  finally { button.disabled = false; }
});

load();
