// Checks every study plan against the rules explained in the article.
// Reads the plans from index.html, the embed block and content/blog-article.txt,
// so all three must agree. Run: npm run check
const fs = require("fs");
const path = require("path");
const root = path.join(__dirname, "..");
const read = f => fs.readFileSync(path.join(root, f), "utf8");

const WORKLOAD = { pof: "heavy", agk: "heavy", ins: "med", mb: "light", perf: "heavy", fp: "heavy", hpl: "light",
  met: "heavy", gnav: "heavy", rnav: "med", ops: "med", law: "med", com: "light" };
const CODE = { "010": "law", "021": "agk", "022": "ins", "031": "mb", "032": "perf", "033": "fp", "040": "hpl",
  "050": "met", "061": "gnav", "062": "rnav", "070": "ops", "081": "pof", "090": "com" };
const HEAVY_CALC = ["gnav", "perf", "fp"];
// "X builds on Y": Y must be in the same sitting as X or earlier (article, section 02)
const BUILDS_ON = { perf: ["pof", "agk"], ins: ["agk"], rnav: ["gnav"], ops: ["law", "met", "hpl"], com: ["law"],
  fp: ["perf", "mb", "gnav", "rnav", "met", "ops"] };
const SPREAD_CALC = ["B", "D"]; // plans that promise one heavy calculation subject per sitting

function rules(id, sits) {
  const errs = [], at = {};
  sits.forEach((s, i) => s.forEach(k => { if (k in at) errs.push(`${k} appears twice`); at[k] = i; }));
  Object.keys(WORKLOAD).forEach(k => { if (!(k in at)) errs.push(`${k} missing`); });
  for (const [x, ys] of Object.entries(BUILDS_ON))
    ys.forEach(y => { if (at[y] > at[x]) errs.push(`${x} (sitting ${at[x] + 1}) comes before ${y} (sitting ${at[y] + 1})`); });
  if (!["pof", "agk"].every(k => at[k] === 0)) errs.push("Principles of Flight and AGK must be in sitting 1");
  if (at.fp !== sits.length - 1) errs.push("Flight Planning must be in the last sitting");
  if (!sits.at(-1).some(k => WORKLOAD[k] === "light")) errs.push("last sitting needs a light subject");
  if (sits.length > 4) errs.push("more than 4 sittings");
  if (SPREAD_CALC.includes(id))
    sits.forEach((s, i) => { const n = s.filter(k => HEAVY_CALC.includes(k)).length; if (n > 1) errs.push(`sitting ${i + 1} has ${n} heavy calculation subjects`); });
  return errs;
}

function plansFromJs(src) {
  const m = src.match(/const PLANS = (\{[\s\S]*?\n\});/);
  if (!m) throw new Error("PLANS not found");
  const obj = Function(`return (${m[1]})`)();
  const ids = { "full-easy": "A", "full-hard": "B", "job-easy": "C", "job-hard": "D" };
  return Object.fromEntries(Object.entries(obj).map(([k, v]) => [ids[k], v.sits]));
}
function plansFromText(src) {
  const out = {};
  for (const id of "ABCD") {
    const sec = src.split(`### Plan ${id}`)[1].split("###")[0];
    out[id] = [...sec.matchAll(/\*\*Sitting \d\*\* \(month \d+\): (.*)/g)]
      .map(m => [...m[1].matchAll(/\b(\d{3})\b/g)].map(x => CODE[x[1]]));
  }
  return out;
}

const sources = {
  "index.html": plansFromJs(read("index.html")),
  "embed/atpl-planner-embed.html": plansFromJs(read("embed/atpl-planner-embed.html")),
  "content/blog-article.txt": plansFromText(read("content/blog-article.txt")),
};
let failed = 0;
const ref = JSON.stringify(sources["index.html"]);
for (const [file, plans] of Object.entries(sources)) {
  if (JSON.stringify(plans) !== ref) { console.log(`FAIL ${file}: plans differ from index.html`); failed++; }
  for (const id of "ABCD") {
    const errs = rules(id, plans[id]);
    console.log(`${errs.length ? "FAIL" : "OK  "} ${file} Plan ${id}${errs.length ? "\n       " + errs.join("\n       ") : ""}`);
    failed += errs.length;
  }
}
console.log(failed ? `\n${failed} problem(s) found.` : "\nAll plans pass.");
process.exit(failed ? 1 : 0);
