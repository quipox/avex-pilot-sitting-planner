<img src="assets/brand/aviationexam-logo.png" alt="Aviationexam" width="260">

# ATPL Study Planner

An interactive planner and blog article that help EASA ATPL(A) students organise the 13 theory subjects into sittings, with hours a day and the 18-month exam window.

![Planner screenshot](assets/img/screenshot.png)

The planner asks five questions (time available, comfort with calculations, hours and days a week, start month, strong subjects) and returns a dated plan of three or four sittings, with a warning when the plan runs close to the 18-month limit.

Students can then make the plan their own: drag subjects between sittings (or tap a subject and tap **Move here** on a phone), add or remove sittings up to the limit of six, and mark each sitting as Preparing, Ready or Completed. Live study-order checks flag anything that breaks the rules below, and the plan is saved in the student's own browser. One author's 5 + 5 + 3 split can be loaded as an example.

## What's in the repository

| Path | What it is |
| --- | --- |
| `index.html` | The planner as a standalone page. Open it in a browser or publish it with GitHub Pages. |
| `embed/atpl-planner-embed.html` | The planner as a block to paste into the Aviationexam blog template. Generated from `index.html`. |
| `content/blog-article.txt` | The article "ATPL Study Plan" in plain text, with markers for the web team (see below). It merges Eliška's draft with the planner article. |
| `content/ATPL_Study_Plan_merged.docx` | The same article as a Word file, for review. |
| `content/ATPL_Sitting_Planner.docx` | A static Word version of the planner, with each plan at its reference pace. |
| `assets/img/` | Decision flow, subject dependency map and a screenshot of the planner, as PNG. |
| `assets/brand/` | Aviationexam logos. |
| `scripts/check-plans.js` | Checks that every plan follows the study-order rules and that the page, the embed and the article agree. |
| `scripts/build-embed.js` | Rebuilds the embed block from `index.html`. |

## Using it

**View the planner:** open `index.html` in a browser. Nothing to install.

**Publish with GitHub Pages:** Settings → Pages → Deploy from branch → `main`, folder `/ (root)`.

**Put the article on the blog:** give `content/blog-article.txt` to the person or tool that builds the post. The markers in the text mean:

- `[INTERACTIVE PLANNER]`: paste the full content of `embed/atpl-planner-embed.html` here, unchanged.
- `[IMAGE: file | alt: "..."]`: insert the image from `assets/img/` with that alt text.
- `[BUTTON: ...]`: use the template's standard call-to-action button.
- `[CHECK LINK]`: replace with the correct subject guide URL.

The embed block needs the blog editor to keep an inline `<script>`. If the editor removes it, leave the block out: the four plans are already in the article as tables and lists.

## Editing the plans

The plans live in the `PLANS` object in `index.html`; the 5 + 5 + 3 example lives in `EXAMPLES`. The blocks that go into the embed carry a `data-embed` attribute. After changing them:

```bash
npm run build:embed   # regenerate the embed block
npm run check         # verify the rules and that page, embed and article agree
```

Node.js 18 or later; no dependencies. If you change a plan, update `content/blog-article.txt` (section 04) and the Word file by hand, then run the check again. The check does not read the Word file.

### Rules every plan must follow

1. Each subject is in the same sitting as, or after, the subjects it builds on (Performance after Principles of Flight and AGK, Instrumentation after AGK, Radio Navigation after General Navigation, Operational Procedures after Air Law, Meteorology and Human Performance, Communications after Air Law, Flight Planning after almost everything).
2. Principles of Flight and AGK are in the first sitting, prepared before the 18-month clock starts.
3. Flight Planning is in the last sitting, with at least one light subject.
4. Plans B and D never put two of General Navigation, Performance and Flight Planning in the same sitting.
5. No plan uses more than four sittings.

## Brand

| Use | Colour |
| --- | --- |
| Navigation bar, headings | Navy `#213C6F` (from aviationexam.com) |
| Buttons and selected answers | Blue `#2B78D8` (from aviationexam.com) |
| KSA100, warnings | Red `#BD2026` |
| Memory subjects | Orange `#FF7202` |
| Calculation subjects | Green `#00A650` |
| Concept subjects, map labels | Blue `#0073BF` |
| Warnings (18-month limit exceeded) | Extra red `#FF0000` |
| Secondary text on white | Grey `#58595B` |

Typeface: Open Sans for text, Helvetica for diagrams and figures. Layout follows aviationexam.com: navy rounded navigation bar and sky-blue header, white body.

## Regulatory basis

Exam rules follow EASA Part-FCL (Annex I to Regulation (EU) No 1178/2011): FCL.025 (pass mark, attempts, sittings, 18-month period, validity of the ATO recommendation), GM1 FCL.025 (definition of a sitting), FCL.515 (ATPL subjects), AMC1 FCL.025(a)(2) (Area 100 KSA) and Appendix 3 (minimum instruction hours). Question counts and exam times follow AMC1 ARA.FCL.300(b).

## Disclaimer

Exam rules per EASA Part-FCL as published by Aviationexam. Workload and type labels are the Aviationexam author team's consensus, not an EASA classification. Whether a subject feels easy or hard is personal; move things around once you know yourself.

© Aviationexam. All rights reserved.
