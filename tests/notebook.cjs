const fs = require("node:fs");
const vm = require("node:vm");
const assert = require("node:assert/strict");
class El {
  constructor() {
    this.value = "";
    this.checked = false;
    this.disabled = false;
    this.textContent = "";
    this.innerHTML = "";
    this.style = {};
    this.attrs = {};
    this.events = {};
    this.children = [];
    this.dataset = {};
    this.className = "";
    this.returnValue = "";
  }
  setAttribute(k, v) {
    this.attrs[k] = String(v);
  }
  addEventListener(k, f) {
    (this.events[k] ??= []).push(f);
  }
  trigger(k, extra = {}) {
    for (const f of this.events[k] || []) f(extra);
  }
  append(...x) {
    this.children.push(...x);
  }
  replaceChildren(...x) {
    this.children = x;
  }
  remove() {}
  focus() {}
  scrollIntoView() {}
  click() {
    this.trigger("click");
  }
  showModal() {
    this.open = true;
  }
}
const els = {};
const get = (id) => (els[id] ??= new El());
get("progress-fill").parentElement = new El();
const tabs = ["money", "relations", "attention"].map((id) => {
  const e = new El();
  e.dataset.route = id;
  return e;
});
const book = new El(),
  dayList = new El(),
  menu = new El();
const stored = new Map();
const downloads = [];
const context = {
  console,
  setTimeout: (f) => f(),
  Blob,
  URL: {
    createObjectURL: (b) => {
      downloads.push(b);
      return "blob:test";
    },
    revokeObjectURL: () => {},
  },
  matchMedia: () => ({ matches: true }),
  localStorage: {
    getItem: (k) => stored.get(k) || null,
    setItem: (k, v) => stored.set(k, v),
    removeItem: (k) => stored.delete(k),
  },
  document: {
    getElementById: get,
    createElement: () => new El(),
    body: new El(),
    querySelector: (s) =>
      s === ".editorial-book" ? book : s === ".day-list" ? dayList : menu,
    querySelectorAll: (s) => (s === "[data-route]" ? tabs : []),
  },
};
vm.createContext(context);
const code = fs.readFileSync(
  require("node:path").join(__dirname, "../src/notebook.js"),
  "utf8",
);
vm.runInContext(code, context);
const read = (s) => vm.runInContext(s, context);
assert.equal(dayList.children.length, 7);
assert.equal(get("prev-day").disabled, true);
get("note").value = "Mi compra <script> literal";
get("note").trigger("input");
assert.equal(stored.size, 0);
get("next-day").click();
assert.equal(read("state.day"), 1);
assert.equal(get("note").value, "");
get("note").value = "Día dos";
get("note").trigger("input");
get("prev-day").click();
assert.equal(get("note").value, "Mi compra <script> literal");
get("complete").checked = true;
get("complete").trigger("change");
assert.equal(get("progress-label").textContent, "1 de 7 días marcados");
tabs[1].click();
assert.equal(get("book-author").textContent, "EMILY NAGOSKI");
assert.equal(tabs[1].attrs["aria-selected"], "true");
get("use-route").click();
assert.equal(get("topic").value, "relations");
assert.equal(get("note").value, "");
get("note").value = "Una pregunta privada";
get("note").trigger("input");
get("topic").value = "money";
get("topic").trigger("change");
assert.equal(get("note").value, "Mi compra <script> literal");
get("remember").checked = true;
get("remember").trigger("change");
assert.equal(stored.size, 1);
assert.equal(
  JSON.parse([...stored.values()][0]).notes["relations-0"],
  "Una pregunta privada",
);
get("export").click();
assert.equal(downloads.length, 1);
get("reset").click();
assert.equal(get("reset-dialog").returnValue, "cancel");
get("reset-dialog").trigger("close");
assert.equal(get("note").value, "Mi compra <script> literal");
get("reset-dialog").returnValue = "erase";
get("reset-dialog").trigger("close");
assert.equal(get("note").value, "");
assert.equal(stored.size, 0);
assert.equal(get("progress-label").textContent, "0 de 7 días marcados");
get("reset").click();
assert.equal(get("reset-dialog").returnValue, "cancel");
get("remember").checked = true;
get("remember").trigger("change");
get("note").value = "Persistencia";
get("note").trigger("input");
const els2 = {};
const get2 = (id) => (els2[id] ??= new El());
get2("progress-fill").parentElement = new El();
const doc2 = { ...context.document, getElementById: get2 };
const restored = { ...context, document: doc2 };
vm.createContext(restored);
vm.runInContext(code, restored);
assert.equal(get2("note").value, "Persistencia");
get("remember").checked = false;
get("remember").trigger("change");
assert.equal(stored.size, 0);
get("topic").value = "attention";
get("topic").trigger("change");
for (let i = 0; i < 6; i++) get("next-day").click();
get("next-day").click();
assert.match(get("workbook-status").textContent, /0 de 7/);
Promise.all(downloads.map((b) => b.text())).then((texts) => {
  assert.match(texts[0], /Una pregunta privada/);
  assert.match(texts[0], /Mi compra <script> literal/);
  console.log(
    "PASS: route switching, separate notes, 7-day navigation, progress, opt-in persistence, restore, export, reset/cancel, end-of-route summary. DOM simulation; visual/browser QA not covered.",
  );
});
