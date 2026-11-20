import Chart from 'chart.js/auto';

function readings(sheet, metric) {
  const points = sheet[metric] ?? [];
  return points
    .filter(point => point.date)
    .map(({ date, value }) => ({
      date,
      value: Number.isFinite(value) ? value : null,
    }));
}

function draw(id, type, unit, datasets) {
  new Chart(document.getElementById(id), {
    type,
    data: { datasets },
    options: {
      parsing: { xAxisKey: 'date', yAxisKey: 'value' },
      scales: { y: { beginAtZero: true, title: { display: true, text: unit } } },
    },
  });
}
function participantDatasets(sheets, metric) {
  const dates = new Set();
  const participants = sheets.map(sheet => {
    const byDate = new Map();
    for (const { date, value } of readings(sheet, metric)) {
      dates.add(date);
      byDate.set(date, value);
    }
    return { name: sheet.name, byDate };
  });

  const calendar = [...dates].sort();
  return participants.map(({ name, byDate }, index) => ({
    label: name,
    data: calendar.map(date => ({ date, value: byDate.get(date) ?? null })),
    borderColor: `hsl(${index * 137.508 % 360}, 65%, 40%)`,
    backgroundColor: `hsl(${index * 137.508 % 360}, 65%, 40%)`,
    spanGaps: false,
  }));
}

async function drawCharts() {
  const response = await fetch('/api/data');
  const sheets = await response.json();
  if (!response.ok) throw new Error(sheets.error);

  const first = sheets[0];
  console.log(first.name, first.steps_count);

  const steps = readings(first, 'steps_count');
  draw('steps', 'bar', 'Steps', [
    { label: first.name, data: steps },
  ]);

  const minutes = readings(first, 'screen_total_min');
  draw('minutes', 'line', 'Minutes', [
    { label: first.name, data: minutes },
  ]);

  draw('all-steps', 'line', 'Steps', participantDatasets(sheets, 'steps_count'));
  draw('all-minutes', 'line', 'Minutes', participantDatasets(sheets, 'screen_total_min'));
}

drawCharts().catch(error => {
  document.querySelector('#error').textContent = error.message;
});
