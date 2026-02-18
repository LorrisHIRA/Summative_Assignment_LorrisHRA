export function calculateStats(records) {
  let total = 0;
  const categoryCount = {};

  records.forEach(r => {
    total += Number(r.amount);
    categoryCount[r.category] = (categoryCount[r.category] || 0) + 1;
  });

  let top = "-";
  let max = 0;

  for (let cat in categoryCount) {
    if (categoryCount[cat] > max) {
      max = categoryCount[cat];
      top = cat;
    }
  }

  return {
    totalCount: records.length,
    totalSpent: total,
    topCategory: top
  };
}
