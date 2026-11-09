// Builds embed/atpl-planner-embed.html from index.html.
// Run after any change to the planner: npm run build:embed
const fs = require("fs");

const path = require("path");
const SRC = path.join(__dirname, "..", "index.html");
const OUT = path.join(__dirname, "..", "embed", "atpl-planner-embed.html");

let src = fs.readFileSync(SRC, "utf8");
let css = src.match(/<style>([\s\S]*?)<\/style>/)[1];
let body = src.slice(src.indexOf('<div class="wrap">'), src.indexOf("<script>"));
let js = src.match(/<script>([\s\S]*?)<\/script>/)[1];

// ---- headings one level down so the block sits inside an article section
css = css.replace(/\.sit h3/g, ".sit h4").replace(/(^|\n)h2\{/g, "$1h3{").replace(/\.disclaimer h2/g, ".disclaimer h3");
js = js.replace('<div class="sit"><h3>Sitting ${i+1}<span>${label(examIdx[i])}</span></h3>', '<div class="sit"><h4>Sitting ${i+1}<span>${label(examIdx[i])}</span></h4>');

// ---- CSS for a shadow root: :root -> :host, page body rule -> :host
css = css.replace(/body\{[\s\S]*?\}\n/, "").replace(/:root\{color-scheme:light\}\n/, "");
css = css.replace(/:root\{/g, ":host{").replace(/--sans:[^;]+;/, "--sans:inherit;");
css = `:host{display:block;background:#fff;color:var(--fg);font-family:inherit;line-height:1.5;color-scheme:light;max-width:960px;margin:32px auto;text-align:left}
p{margin-top:0}
button,input{font-family:inherit}
.wrap{display:grid;gap:28px}
` + css;

// ---- HTML: keep questions, plan and disclaimer; replace the page header
const sections = body.match(/<section>[\s\S]*?<\/section>/g);
const aside = body.match(/<aside[\s\S]*?<\/aside>/)[0];
let html = `<div class="wrap">
<header>
  <p class="eyebrow">Interactive planner</p>
  <h3>Build your own ATPL study plan</h3>
  <p class="sub">Answer a few questions to get a sitting plan with dates, hours a day and the 18-month clock.</p>
</header>
${sections[0]}
${sections[1]}
${aside}
</div>`;
html = html.replace(/<h2/g, "<h3").replace(/<\/h2>/g, "</h3>");

// ---- JS: keep planner logic only, look elements up inside the shadow root
js = js.slice(0, js.indexOf("/* decision flow SVG */"));
js = js.replace(/document\.getElementById\(/g, "$(");
js = js.replace('document.querySelectorAll(".opts[data-key]")', 'ROOT.querySelectorAll(".opts[data-key]")');

const out = `<!--
  AVIATIONEXAM · ATPL STUDY PLANNER (embeddable block)
  Paste this whole block, unchanged, where [INTERACTIVE PLANNER] appears in the article.
  - Self-contained: no external files, fonts or libraries. It uses the page's own font.
  - Isolated with Shadow DOM: the blog's CSS cannot change it and its CSS cannot change the blog.
  - Needs the CMS to keep the inline <script>. If the editor strips scripts, leave the block out:
    the article text already includes the four plans as static content.
-->
<div id="avex-atpl-planner"><noscript>The interactive planner needs JavaScript. The four study plans are listed in the article.</noscript></div>
<script>
(function(){
var HOST = document.getElementById("avex-atpl-planner");
if (!HOST || HOST.shadowRoot) return;
var ROOT = HOST.attachShadow({mode: "open"});
ROOT.innerHTML = "<style>" + ${JSON.stringify(css)} + "</style>" + ${JSON.stringify(html)};
function $(id){ return ROOT.getElementById(id); }
${js}
})();
</script>
`;
fs.writeFileSync(OUT, out);
console.log("written", out.length, "bytes");
