import test from "node:test";
import assert from "node:assert/strict";
import { financeEntries, summarizeFinance, procurementExample, summarizeProcurement, financeVoucher, financeWorkbook, financeReportDownload } from "../app/lib/website-demo.mjs";

test("Website finance demonstration keeps vouchers, report and profit consistent", () => {
  assert.deepEqual(summarizeFinance(), { revenue: 1280000, cost: 756000, expenses: 190000, spending: 946000, profit: 334000 });
  assert.deepEqual(summarizeFinance([]), { revenue: 0, cost: 0, expenses: 0, spending: 0, profit: 0 });
  assert.equal(Object.isFrozen(financeEntries), true);
});

test("Website decision and secretary examples use the same procurement arithmetic", () => {
  assert.deepEqual(summarizeProcurement(), { afterFullPayment: 20, afterDeposit: 56, reserveGap: 10, budgetConflict: 8, contractReserveGap: 18 });
  assert.equal(Object.isFrozen(procurementExample), true);
});

test("Website sample calculation keeps losses and does not invent a reserve shortfall", () => {
  assert.equal(summarizeFinance([{ id: "例", label: "成本", kind: "cost", amount: 10 }]).profit, -10);
  assert.equal(summarizeProcurement({ ...procurementExample, cash: 120 }).reserveGap, 0);
});

test("Website two-turn finance example carries a balanced voucher into both reports", () => {
  const workbook = financeWorkbook();
  assert.equal(financeVoucher.debit.amount, financeVoucher.credit.amount);
  assert.equal(workbook.expensesBeforeVoucher + financeVoucher.debit.amount, summarizeFinance().expenses);
  assert.equal(workbook.assets, workbook.liabilities + workbook.equity);
  assert.equal(workbook.retainedProfit, summarizeFinance().profit);
  assert.equal(workbook.assets, 1200000);
  assert.equal(workbook.bank, 814000);
});

test("Website report downloads export the same sample values as the visible reports", () => {
  for (const kind of ["balance", "profit"]) {
    const file = financeReportDownload(kind);
    assert.match(file.filename, /示例\.csv$/);
    assert.match(file.href, /^data:text\/csv;charset=utf-8,/);
    const csv = decodeURIComponent(file.href.split(",")[1]);
    assert.equal(csv.charCodeAt(0), 0xfeff);
    assert.match(csv, /示例/);
    assert.match(csv, /334000/);
    assert.match(csv, kind === "balance" ? /资产合计.*1200000/ : /期间费用.*190000/);
    assert.match(csv, kind === "balance" ? /负债和所有者权益合计.*1200000/ : /利润总额.*334000/);
  }
  assert.throws(() => financeReportDownload("unknown"), /Unknown report/);
});
