// Website-only sample arithmetic. No business engine, input endpoint or persistence.
export const financeEntries = Object.freeze([
  Object.freeze({ id: "记001", label: "营业收款", kind: "income", amount: 1280000 }),
  Object.freeze({ id: "记002", label: "采购成本", kind: "cost", amount: 756000 }),
  Object.freeze({ id: "记003", label: "期间费用", kind: "expense", amount: 190000 }),
]);

export function summarizeFinance(entries = financeEntries) {
  const total = (kind) => entries.filter((entry) => entry.kind === kind).reduce((sum, entry) => sum + entry.amount, 0);
  const revenue = total("income");
  const cost = total("cost");
  const expenses = total("expense");
  return { revenue, cost, expenses, spending: cost + expenses, profit: revenue - cost - expenses };
}

// Fixed, synthetic marketing example; not an accounting engine or company record.
export const financeVoucher = Object.freeze({
  id: "记0087",
  date: "2026-08-31",
  request: "今天用公司银行账户付了 1,200 元办公费，帮我录入凭证。",
  summary: "支付办公费",
  debit: Object.freeze({ account: "管理费用 / 办公费", amount: 1200 }),
  credit: Object.freeze({ account: "银行存款", amount: 1200 }),
});

export function financeWorkbook() {
  const totals = summarizeFinance();
  const bank = 480000 + totals.revenue - totals.spending;
  const otherCurrentAssets = 260000;
  const fixedAssets = 126000;
  const liabilities = 260000;
  const capital = 606000;
  return {
    expensesBeforeVoucher: totals.expenses - financeVoucher.debit.amount,
    bank, otherCurrentAssets, fixedAssets, liabilities, capital,
    retainedProfit: totals.profit,
    assets: bank + otherCurrentAssets + fixedAssets,
    equity: capital + totals.profit,
  };
}

export function financeReportDownload(kind) {
  const f = summarizeFinance();
  const b = financeWorkbook();
  let title;
  let rows;
  if (kind === "balance") {
    title = "资产负债表";
    rows = [
      ["货币资金", b.bank], ["其他流动资产", b.otherCurrentAssets], ["固定资产净额", b.fixedAssets],
      ["资产合计", b.assets], ["负债合计", b.liabilities], ["实收资本", b.capital],
      ["未分配利润", b.retainedProfit], ["所有者权益合计", b.equity],
      ["负债和所有者权益合计", b.liabilities + b.equity],
    ];
  } else if (kind === "profit") {
    title = "利润表";
    rows = [["营业收入", f.revenue], ["营业成本", f.cost], ["期间费用", f.expenses], ["利润总额", f.profit]];
  } else {
    throw new Error("Unknown report");
  }
  const csv = "\uFEFF" + [
    [title + "（示例）", "2026 年 8 月"], ["项目", "金额（元）"], ...rows,
    ["说明", "固定合成数据，仅列主要项目，不是实际企业报表。期间费用含本次办公费 1200 元。"],
  ].map(row => row.map(cell => `"${String(cell).replaceAll('"', '""')}"`).join(",")).join("\r\n");
  return { filename: `${title}-2026-08-示例.csv`, href: `data:text/csv;charset=utf-8,${encodeURIComponent(csv)}` };
}

export const procurementExample = Object.freeze({ cash: 80, budget: 60, reserve: 30, depositRate: 0.4, contractTotal: 68 });

export function summarizeProcurement(example = procurementExample) {
  const afterFullPayment = example.cash - example.budget;
  const afterDeposit = example.cash - example.budget * example.depositRate;
  return {
    afterFullPayment,
    afterDeposit,
    reserveGap: Math.max(0, example.reserve - afterFullPayment),
    budgetConflict: example.contractTotal - example.budget,
    contractReserveGap: Math.max(0, example.reserve - (example.cash - example.contractTotal)),
  };
}

export const demoDisclosure = "产品设计演示，使用示例数据，不连接企业系统。";
