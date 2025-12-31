const { Ledger } = require('../../db/models');
const dayjs = require('dayjs');

async function detectRecurringExpenses(userId) {
  const rows = await Ledger.findAll({
    where: { userId, type: 'out' },
    order: [['date', 'ASC']],
    raw: true,
  });

  console.log("All ledgers:", rows);

  const grouped = {};
  for (const r of rows) {
    if (!grouped[r.categoryId]) grouped[r.categoryId] = [];
    grouped[r.categoryId].push(r);
  }

  console.log("Grouped by category:", grouped);

  const results = [];

  for (const [catId, expenses] of Object.entries(grouped)) {
    console.log("\nCategory:", catId);
    console.log("Expenses:", expenses);

    if (expenses.length < 3) {
      console.log("⚠️ Yetarli xarajat yo‘q (<3)");
      continue;
    }

    const intervals = [];
    for (let i = 1; i < expenses.length; i++) {
      const days = Math.abs(dayjs(expenses[i].date).diff(expenses[i - 1].date, 'day'));
      intervals.push(days);
    }

    console.log("Intervals:", intervals);

    const avgInterval = avg(intervals);
    console.log("Avg interval:", avgInterval);

    let interval = null;

    if (avgInterval >= 25 && avgInterval <= 35) interval = 'monthly';
    else if (avgInterval >= 5 && avgInterval <= 10) interval = 'weekly';
    else if (avgInterval >= 350 && avgInterval <= 380) interval = 'yearly';

    console.log("Detected interval:", interval);

    // Amount stability check
    const stableAmount =
      Math.abs(expenses[0].amount - expenses[1].amount) <= expenses[0].amount * 0.2;

    console.log("Stable amount:", stableAmount);

    if (interval && stableAmount) {
      results.push({
        categoryId: Number(catId),
        interval,
        avgAmount: avg(expenses.map(e => Number(e.amount))),
        lastPaymentAt: expenses[expenses.length - 1].date,
        lastLedgerId: expenses[expenses.length - 1].id,
      });
    } else {
      console.log("❌ Reject: interval or stability mismatch");
    }
  }

  return results;
}


function avg(arr) {
  return arr.reduce((a, b) => a + b, 0) / arr.length;
}

detectRecurringExpenses(2).then(res => {
  console.log("res", res);
});