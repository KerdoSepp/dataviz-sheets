# From Google Sheets to Chart.js

Start with the class workbook. In Lesson 1 you’ll open its data as JSON and follow one measurement through the prewritten server. In Lesson 2 you’ll create the HTML, CSS, and JavaScript for your first chart. Each lesson adds to the page, from one participant’s steps and screen time to comparisons across participants and daily class totals and averages.

## Start here

Fork this repository, clone your fork in VS Code, and use Node.js **22.12 or newer**. In the repository root, duplicate `.env.example` and name the copy `.env.local`. Fill in `SHEET_ID` with your workbook ID and `TAB_GIDS` with comma-separated participant tab IDs. Then run:

```bash
npm install
npm run dev
```

Append `/api/data` to the local address Vite prints (usually `http://127.0.0.1:5173/api/data`). The response lists each configured tab’s name, ID, and dated measurements from column A. [Lesson 1 walkthrough](lessons/01-class-workbook/walkthrough.md)

## Lessons

Each lesson is about 90 minutes. The charts share one API request per page load. The five core lessons build six charts. Lesson 5 offers bonus exercises on the median and mode.

| Lesson | What you’ll do | Code along |
| --- | --- | --- |
| [1. Read the class workbook](lessons/01-class-workbook/README.md) | Match a real cell to a JSON record and trace how the server produced it | [Walkthrough](lessons/01-class-workbook/walkthrough.md) |
| [2. Set up Chart.js](lessons/02-first-chart/README.md) | Create three browser files and plot daily steps with Chart.js | [Walkthrough](lessons/02-first-chart/walkthrough.md) |
| [3. Chart screen time](lessons/03-screen-time/README.md) | Add a screen-time line chart below the steps chart | [Walkthrough](lessons/03-screen-time/walkthrough.md) |
| [4. Chart every participant](lessons/04-all-participants/README.md) | Add steps and screen-time comparisons using every configured tab | [Walkthrough](lessons/04-all-participants/walkthrough.md) |
| [5. Calculate class totals and averages](lessons/05-class-summary/README.md) | Chart the daily total and mean steps per reporting participant | [Walkthrough](lessons/05-class-summary/walkthrough.md) |
| [6. Independent data visualization](https://github.com/kuressaareametikool/dataviz-sheets/tree/main/lessons/06-independent-dataviz) | Investigate completeness of steps and screen-time records | See the project below |

## Independent project: how complete are our activity records?

Three questions considered were whether steps relate to screen time on paired days, whether activity differs between weekdays and weekends, and how complete the two measurement series are. This project chooses completeness because gaps affect how confidently we can compare participants and dates.

The lesson 6 section follows the earlier charts and uses the same plain headings, canvases, and `draw()` helper. It has a short summary, a bar chart comparing the percentage of available step and screen-time records, a line chart showing daily reporting percentages, and a short interpretation.

The calculation uses `steps_count`, `screen_total_min`, and their dates. `summarizeCoverage()` in `completeness.js` counts numeric readings over every calendar day in the workbook period. Coverage = valid readings ÷ (configured participants × days) × 100. It also counts how often both readings exist for the same participant and day. Recorded zeros count; missing rows, blank cells, text, and non-finite values do not. Invalid or missing dates are excluded. Empty or future dates within the workbook period remain in the denominator. Duplicate dates use the last entry, matching the participant comparison charts. All views share the original API request.

Findings are calculated from the current response and displayed below the charts. During verification, the configured workbook had 11 participants over 15 dates (2026-11-13 through 2026-11-27): 129 of 165 possible step records (78.2%), 120 screen-time records (72.7%), and 116 paired records. These are a dated check; edits to the workbook change the page. Coverage measures availability and cannot explain why data is missing.

For a manual check, count numeric cells for one date across the configured tabs and divide by the number of participants. At verification, 2026-11-13 had 10 step readings out of 11 participants (90.9%); compare this with the daily chart and recount if the workbook has changed. `npm test` checks the calculations, chart data, empty responses, and API errors using synthetic data.

AI reflection: Codex selected the completeness question, implemented the calculations and interface, and added automated checks. It also read aggregate counts from the configured workbook to verify a result. The implementation adds coverage and same-day pairing beyond the previous lessons, and keeps zeros distinct from missing records. The student should review and explain `summarizeCoverage()` in their own words; partner feedback and the 3–5 minute presentation remain classroom activities.

## For the instructor

- Keep the starter and its matching walkthroughs in the same commit. Students can read the latest lessons in the instructor’s repository. For code updates, have students commit and push their work, choose **Sync fork → Update branch** on their fork’s `main` branch, then run `git pull --ff-only` on their local `main`. [GitHub’s fork sync guide](https://docs.github.com/en/pull-requests/how-tos/work-with-forks/syncing-a-fork)
- Select participant tabs with readings for the dates you want to discuss. Only tabs listed in `TAB_GIDS` appear in the response. A tab whose ID is `0` is selected by including the literal `0`. Keep `.env.local` and copies of participant data out of Git. [Class workbook](https://docs.google.com/spreadsheets/d/1s4nyFtn0ek-uU156tPIC8pK1U8ytPmTOExY4d-ImGNk/edit)
- The server needs a workbook that permits CSV export without a browser login. Restart Vite after changing settings. Ordinary sheet edits only need a browser refresh once Google updates its export.
- Use the API guide during Lesson 1 to walk through the route, tab names, and CSV rows with the files open beside it. [How the API works](API.md)
