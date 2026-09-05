export type FinanceEntry = { readonly id: string; readonly label: string; readonly kind: "income" | "cost" | "expense"; readonly amount: number };
export const financeEntries: readonly FinanceEntry[];
export function summarizeFinance(entries?: readonly FinanceEntry[]): { revenue: number; cost: number; expenses: number; spending: number; profit: number };
export const financeVoucher: {
  readonly id: string; readonly date: string; readonly request: string; readonly summary: string;
  readonly debit: { readonly account: string; readonly amount: number };
  readonly credit: { readonly account: string; readonly amount: number };
};
export function financeWorkbook(): { expensesBeforeVoucher: number; bank: number; otherCurrentAssets: number; fixedAssets: number; liabilities: number; capital: number; retainedProfit: number; assets: number; equity: number };
export function financeReportDownload(kind: "balance" | "profit"): { filename: string; href: string };
export type ProcurementExample = { readonly cash: number; readonly budget: number; readonly reserve: number; readonly depositRate: number; readonly contractTotal: number };
export const procurementExample: ProcurementExample;
export function summarizeProcurement(example?: ProcurementExample): { afterFullPayment: number; afterDeposit: number; reserveGap: number; budgetConflict: number; contractReserveGap: number };
export const demoDisclosure: string;
