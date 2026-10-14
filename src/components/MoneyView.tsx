"use client";

import React, { useState, useMemo } from "react";
import { useStore } from "@/context/StoreContext";
import { MoneyRecord } from "@/types/app";
import { 
  Wallet, 
  ArrowUpRight, 
  Plus, 
  Trash2, 
  Filter, 
  Edit2, 
  Check, 
  X,
  CreditCard,
  ShoppingBag,
  TrendingDown,
  TrendingUp,
  Printer,
  Banknote,
  Smartphone
} from "lucide-react";
import { Modal, ConfirmDialog } from "@/components/Modal";

export const MoneyView: React.FC = () => {
  const { 
    store, 
    addMoneyRecord, 
    deleteMoneyRecord, 
    updateMonthlyAllowance, 
    searchQuery 
  } = useStore();

  const [filterType, setFilterType] = useState<string>("All");
  const [filterMode, setFilterMode] = useState<string>("All");
  const [filterPurpose, setFilterPurpose] = useState<string>("All");
  const [paymentMode, setPaymentMode] = useState<"Online" | "Cash">("Online");

  // Inline allowance edit
  const [isEditingAllowance, setIsEditingAllowance] = useState(false);
  const [allowanceInput, setAllowanceInput] = useState(String(store.monthlyAllowance));

  // Custom Add Modal State
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [deleteTargetId, setDeleteTargetId] = useState<string | null>(null);

  // Form fields inside modal
  const [title, setTitle] = useState("");
  const [amount, setAmount] = useState<number | "">("");
  const [type, setType] = useState<MoneyRecord["type"]>("Expense");
  const [purpose, setPurpose] = useState<MoneyRecord["purpose"]>("Food & Dining");
  const [date, setDate] = useState(new Date().toISOString().split("T")[0]);
  const [notes, setNotes] = useState("");

  const handleSaveAllowance = () => {
    const val = parseFloat(allowanceInput);
    if (!isNaN(val) && val >= 0) {
      updateMonthlyAllowance(val);
      setIsEditingAllowance(false);
    }
  };

  const handleAddTransaction = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim() || !amount || Number(amount) <= 0) return;

    addMoneyRecord({
      title: title.trim(),
      amount: Number(amount),
      type,
      paymentMode,
      purpose: type === "Income" ? "Other" : purpose,
      date,
      notes: notes.trim() || undefined,
    });

    setTitle("");
    setAmount("");
    setNotes("");
    setIsAddModalOpen(false);
  };

  // Calculations: Cash vs Online balances
  const records = store.moneyRecords || [];

  const totalIncome = records
    .filter((r) => r.type === "Income")
    .reduce((sum, r) => sum + r.amount, 0);

  const totalExpense = records
    .filter((r) => r.type === "Expense")
    .reduce((sum, r) => sum + r.amount, 0);

  // Cash breakdown
  const cashIncome = records
    .filter((r) => r.type === "Income" && r.paymentMode === "Cash")
    .reduce((sum, r) => sum + r.amount, 0);
  const cashExpense = records
    .filter((r) => r.type === "Expense" && r.paymentMode === "Cash")
    .reduce((sum, r) => sum + r.amount, 0);
  const cashBalance = cashIncome - cashExpense;

  // Online breakdown (base monthly allowance is counted as initial online/bank balance)
  const onlineIncome = records
    .filter((r) => r.type === "Income" && (r.paymentMode === "Online" || !r.paymentMode))
    .reduce((sum, r) => sum + r.amount, 0);
  const onlineExpense = records
    .filter((r) => r.type === "Expense" && (r.paymentMode === "Online" || !r.paymentMode))
    .reduce((sum, r) => sum + r.amount, 0);
  const onlineBalance = store.monthlyAllowance + onlineIncome - onlineExpense;

  // Total Combined Net Balance
  const remainingBudget = store.monthlyAllowance + totalIncome - totalExpense;
  const budgetUtilizationPct = store.monthlyAllowance > 0 
    ? Math.min(100, Math.round((totalExpense / store.monthlyAllowance) * 100))
    : 0;

  // Purpose breakdown
  const purposeBreakdown = useMemo(() => {
    const map: Record<string, number> = {};
    records
      .filter((r) => r.type === "Expense")
      .forEach((r) => {
        map[r.purpose] = (map[r.purpose] || 0) + r.amount;
      });
    return Object.entries(map).sort((a, b) => b[1] - a[1]);
  }, [records]);

  // Filtered transactions
  const filteredRecords = records
    .filter((r) => {
      if (filterType !== "All" && r.type !== filterType) return false;
      if (filterMode !== "All") {
        const itemMode = r.paymentMode || "Online";
        if (itemMode !== filterMode) return false;
      }
      if (filterPurpose !== "All" && r.purpose !== filterPurpose) return false;
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase();
        return (
          r.title.toLowerCase().includes(q) ||
          r.purpose.toLowerCase().includes(q) ||
          (r.notes && r.notes.toLowerCase().includes(q))
        );
      }
      return true;
    })
    .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());

  const purposesList: MoneyRecord["purpose"][] = [
    "Food & Dining",
    "Books & Courses",
    "Tech & Software",
    "Transport",
    "Entertainment",
    "Personal & Health",
    "Other",
  ];

  return (
    <div className="space-y-6">
      {/* Print-Only Custom Statement Layout */}
      <div className="hidden print:block space-y-6 text-black bg-white p-8 font-sans">
        <div className="border-b-2 border-slate-900 pb-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <img src="/logo.png" alt="Edu Command" className="w-10 h-10 object-contain rounded" />
            <div>
              <h1 className="text-xl font-bold tracking-tight text-slate-900">Edu Command | Financial Ledger Statement</h1>
              <p className="text-xs text-slate-600">Monthly Pocket Money & Expense Operations Audit</p>
            </div>
          </div>
          <div className="text-right text-xs">
            <div className="font-bold">Statement Date: {new Date().toLocaleDateString("en-US", { year: "numeric", month: "long", day: "numeric" })}</div>
            <div className="text-slate-600 font-mono">Ledger ID: EXP-REC-MONTHLY</div>
          </div>
        </div>

        {/* Executive Summary Grid for Print */}
        <div className="grid grid-cols-4 gap-4 border border-slate-300 p-4 rounded text-xs">
          <div>
            <div className="text-slate-500 uppercase font-semibold text-[10px]">Monthly Allowance</div>
            <div className="text-base font-bold font-mono mt-0.5">₹{store.monthlyAllowance}</div>
          </div>
          <div>
            <div className="text-slate-500 uppercase font-semibold text-[10px]">Total Inflows (Ins)</div>
            <div className="text-base font-bold font-mono text-emerald-800 mt-0.5">+₹{totalIncome}</div>
          </div>
          <div>
            <div className="text-slate-500 uppercase font-semibold text-[10px]">Total Outflows (Outs)</div>
            <div className="text-base font-bold font-mono text-rose-800 mt-0.5">-₹{totalExpense}</div>
          </div>
          <div>
            <div className="text-slate-500 uppercase font-semibold text-[10px]">Net Cash & Bank Balance</div>
            <div className="text-base font-bold font-mono text-slate-900 mt-0.5">₹{remainingBudget}</div>
          </div>
        </div>

        {/* Payment Mode Audit for Print */}
        <div className="grid grid-cols-2 gap-4 text-xs">
          <div className="p-3 border border-slate-300 rounded">
            <div className="font-bold text-slate-900 mb-1">Physical Cash In Hand</div>
            <div className="flex justify-between text-slate-600">
              <span>Cash Inflows: +₹{cashIncome}</span>
              <span>Cash Outflows: -₹{cashExpense}</span>
              <span className="font-bold text-slate-900">Net Cash: ₹{cashBalance}</span>
            </div>
          </div>
          <div className="p-3 border border-slate-300 rounded">
            <div className="font-bold text-slate-900 mb-1">Online / UPI / Bank Account</div>
            <div className="flex justify-between text-slate-600">
              <span>Online Inflows: +₹{onlineIncome}</span>
              <span>Online Outflows: -₹{onlineExpense}</span>
              <span className="font-bold text-slate-900">Net Online: ₹{onlineBalance}</span>
            </div>
          </div>
        </div>

        {/* Print Transactions Table */}
        <div>
          <h2 className="text-xs font-bold uppercase tracking-wider text-slate-700 mb-2">Itemized Transaction Audit Log</h2>
          <table className="w-full text-left border-collapse text-xs border border-slate-300">
            <thead>
              <tr className="bg-slate-100 border-b border-slate-300 font-mono text-[11px] text-slate-800">
                <th className="p-2 border-r border-slate-300">ID</th>
                <th className="p-2 border-r border-slate-300">Type</th>
                <th className="p-2 border-r border-slate-300">Mode</th>
                <th className="p-2 border-r border-slate-300">Description</th>
                <th className="p-2 border-r border-slate-300">Category</th>
                <th className="p-2 border-r border-slate-300">Date</th>
                <th className="p-2 text-right">Amount</th>
              </tr>
            </thead>
            <tbody>
              {records.map((item) => (
                <tr key={item.id} className="border-b border-slate-200">
                  <td className="p-2 font-mono border-r border-slate-200 text-slate-600">{item.id}</td>
                  <td className="p-2 border-r border-slate-200 font-semibold">{item.type}</td>
                  <td className="p-2 border-r border-slate-200">{item.paymentMode || "Online"}</td>
                  <td className="p-2 border-r border-slate-200">
                    <div className="font-semibold text-slate-900">{item.title}</div>
                    {item.notes && <div className="text-[10px] text-slate-500">{item.notes}</div>}
                  </td>
                  <td className="p-2 border-r border-slate-200">{item.purpose}</td>
                  <td className="p-2 font-mono border-r border-slate-200 text-slate-600">{item.date}</td>
                  <td className={`p-2 text-right font-mono font-bold ${item.type === "Income" ? "text-emerald-800" : "text-slate-900"}`}>
                    {item.type === "Income" ? `+₹${item.amount}` : `-₹${item.amount}`}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <div className="pt-6 border-t border-slate-300 flex justify-between text-[10px] text-slate-500 font-mono">
          <span>Edu Command Offline-First Financial Tracker</span>
          <span>Verified Local Record Audit</span>
        </div>
      </div>

      {/* Screen-Only Views (Hidden on Print) */}
      <div className="space-y-6 print:hidden">
      {/* Top Banner with Action Button & Print */}
      <div className="bg-white border border-[#E5E7EB] rounded-xl p-4 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <span className="sub-label">Financial Control</span>
          <h2 className="text-base font-bold text-[#09090B] mt-0.5">
            Pocket Money & Expense Allocations
          </h2>
          <p className="text-xs text-[#71717A] mt-0.5">
            Track combined net wealth, Cash in Hand, and Online account balances with instant print reports.
          </p>
        </div>

        <div className="flex items-center gap-2 self-start md:self-auto shrink-0">
          <button
            onClick={() => window.print()}
            className="h-8 px-3.5 bg-white border border-[#D1D5DB] text-[#374151] hover:bg-slate-50 text-xs font-semibold rounded-lg flex items-center gap-1.5 transition-colors shadow-xs"
            title="Print Monthly Expenses & Inflows Statement"
          >
            <Printer className="w-3.5 h-3.5 text-slate-600" />
            <span>Print Monthly Report</span>
          </button>

          <button
            onClick={() => setIsAddModalOpen(true)}
            className="h-8 px-3.5 bg-[#18181B] text-white text-xs font-medium hover:bg-[#27272A] rounded-lg flex items-center gap-1.5 transition-colors shadow-xs"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>Record Transaction</span>
          </button>
        </div>
      </div>

      {/* Cash + Online Combined Multi-Mode Balance Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3.5">
        {/* Card 1: Combined Net Balance */}
        <div className="bg-gradient-to-br from-slate-900 to-slate-800 text-white rounded-xl p-4 shadow-sm border border-slate-700">
          <div className="flex items-center justify-between opacity-80">
            <span className="text-[11px] font-bold uppercase tracking-wider">Total Combined Balance</span>
            <Wallet className="w-4 h-4 text-emerald-400" />
          </div>
          <div className="mt-2">
            <span className={`text-2xl font-bold font-mono tracking-tight tabular-nums ${
              remainingBudget < 0 ? "text-rose-400" : "text-white"
            }`}>
              ₹{remainingBudget}
            </span>
          </div>
          <div className="mt-2 text-[11px] text-slate-300 flex items-center justify-between border-t border-slate-700 pt-2">
            <span>Cash + Online Net</span>
            <span className="font-mono text-emerald-400 font-semibold">Active Fund</span>
          </div>
        </div>

        {/* Card 2: Cash In Hand Balance */}
        <div className="bg-white border border-amber-200 rounded-xl p-4 shadow-xs">
          <div className="flex items-center justify-between text-amber-700">
            <span className="sub-label text-amber-800">Cash in Hand</span>
            <Banknote className="w-4 h-4 text-amber-600" />
          </div>
          <div className="mt-2 flex items-baseline gap-2">
            <span className={`text-2xl font-bold font-mono tracking-tight tabular-nums ${
              cashBalance < 0 ? "text-rose-600" : "text-amber-800"
            }`}>
              ₹{cashBalance}
            </span>
          </div>
          <div className="mt-2 text-xs text-slate-500 flex items-center justify-between border-t border-slate-100 pt-2">
            <span>Physical cash purse</span>
            <span className="text-amber-700 font-medium font-mono">Cash Mode</span>
          </div>
        </div>

        {/* Card 3: Online / Bank / UPI Balance */}
        <div className="bg-white border border-blue-200 rounded-xl p-4 shadow-xs">
          <div className="flex items-center justify-between text-blue-700">
            <span className="sub-label text-blue-800">Online / Bank Account</span>
            <Smartphone className="w-4 h-4 text-blue-600" />
          </div>
          <div className="mt-2 flex items-baseline gap-2">
            <span className={`text-2xl font-bold font-mono tracking-tight tabular-nums ${
              onlineBalance < 0 ? "text-rose-600" : "text-blue-800"
            }`}>
              ₹{onlineBalance}
            </span>
          </div>
          <div className="mt-2 text-xs text-slate-500 flex items-center justify-between border-t border-slate-100 pt-2">
            <span>UPI / Card / Digital</span>
            <span className="text-blue-700 font-medium font-mono">Online Mode</span>
          </div>
        </div>

        {/* Card 4: Total Month Inflow vs Outflow */}
        <div className="bg-white border border-slate-200/80 rounded-xl p-4 shadow-xs">
          <div className="flex items-center justify-between text-slate-500">
            <span className="sub-label">Month Total Outflow</span>
            <TrendingDown className="w-4 h-4 text-rose-600" />
          </div>
          <div className="mt-2 flex items-baseline gap-2">
            <span className="text-2xl font-bold font-mono tracking-tight text-slate-900 tabular-nums">
              ₹{totalExpense}
            </span>
            <span className="text-xs text-slate-500 font-mono">
              ({budgetUtilizationPct}% of base)
            </span>
          </div>
          <div className="mt-2 text-xs text-slate-500 flex items-center justify-between border-t border-slate-100 pt-2">
            <span className="text-emerald-700 font-mono">+₹{totalIncome} ins</span>
            <span className="text-rose-600 font-medium font-mono">-₹{totalExpense} outs</span>
          </div>
        </div>
      </div>

      {/* Purpose Allocation Bar Breakdown */}
      <div className="bg-white border border-[#E4E4E7] p-5">
        <div className="flex items-center justify-between border-b border-[#E4E4E7] pb-3 mb-4">
          <div>
            <span className="sub-label">Expense Purpose Allocation</span>
            <h3 className="text-sm font-semibold text-[#09090B] mt-0.5">
              Where Pocket Money & Monthly Funds Are Allocated
            </h3>
          </div>
          <span className="text-xs font-mono text-[#71717A]">Category Breakdown</span>
        </div>

        {purposeBreakdown.length === 0 ? (
          <div className="p-4 text-center text-xs text-[#71717A]">
            No expenses logged yet. Click "Record Transaction" to add your first expense.
          </div>
        ) : (
          <div className="space-y-3">
            {purposeBreakdown.map(([purp, amt]) => {
              const pct = totalExpense > 0 ? Math.round((amt / totalExpense) * 100) : 0;
              return (
                <div key={purp} className="space-y-1">
                  <div className="flex items-center justify-between text-xs">
                    <span className="font-medium text-[#09090B]">{purp}</span>
                    <span className="font-mono text-[#71717A] tabular-nums">
                      ₹{amt} ({pct}%)
                    </span>
                  </div>
                  <div className="w-full bg-[#F4F4F5] h-2">
                    <div
                      style={{ width: `${pct}%` }}
                      className="bg-[#18181B] h-2 transition-all duration-150"
                    />
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* Filter and Transaction Table */}
      <div className="bg-white border border-[#E4E4E7]">
        <div className="h-10 border-b border-[#E4E4E7] px-4 flex flex-wrap items-center justify-between bg-[#FAFAFA] text-xs">
          <div className="flex items-center gap-3">
            <div className="flex items-center gap-1.5 text-[#71717A]">
              <Filter className="w-3.5 h-3.5" />
              <span className="sub-label">Filter:</span>
            </div>

            <div className="flex items-center gap-1.5">
              <span className="text-[#71717A]">Type:</span>
              <select
                value={filterType}
                onChange={(e) => setFilterType(e.target.value)}
                className="h-7 border border-[#E4E4E7] rounded-md px-2 bg-white text-[#09090B]"
              >
                <option value="All">All Types</option>
                <option value="Expense">Expense Only</option>
                <option value="Income">Income Only</option>
              </select>
            </div>

            <div className="flex items-center gap-1.5">
              <span className="text-[#71717A]">Mode:</span>
              <select
                value={filterMode}
                onChange={(e) => setFilterMode(e.target.value)}
                className="h-7 border border-[#E4E4E7] rounded-md px-2 bg-white text-[#09090B]"
              >
                <option value="All">All Modes</option>
                <option value="Cash">Cash in Hand</option>
                <option value="Online">Online / UPI</option>
              </select>
            </div>

            <div className="flex items-center gap-1.5">
              <span className="text-[#71717A]">Purpose:</span>
              <select
                value={filterPurpose}
                onChange={(e) => setFilterPurpose(e.target.value)}
                className="h-7 border border-[#E4E4E7] rounded-md px-2 bg-white text-[#09090B]"
              >
                <option value="All">All Purposes</option>
                {purposesList.map((p) => (
                  <option key={p} value={p}>
                    {p}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <span className="text-xs font-mono text-[#71717A]">
            {filteredRecords.length} Transactions Found
          </span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse text-xs">
            <thead>
              <tr className="border-b border-[#E4E4E7] bg-white text-[#71717A] font-mono">
                <th className="p-3 w-16 uppercase tracking-wider text-[11px]">ID</th>
                <th className="p-3 w-20 uppercase tracking-wider text-[11px]">Type</th>
                <th className="p-3 w-24 uppercase tracking-wider text-[11px]">Mode</th>
                <th className="p-3 uppercase tracking-wider text-[11px]">Description & Notes</th>
                <th className="p-3 w-36 uppercase tracking-wider text-[11px]">Purpose Category</th>
                <th className="p-3 w-28 uppercase tracking-wider text-[11px]">Date</th>
                <th className="p-3 w-28 text-right uppercase tracking-wider text-[11px]">Amount</th>
                <th className="p-3 w-14 text-right uppercase tracking-wider text-[11px]">Act</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#E4E4E7]">
              {filteredRecords.length === 0 ? (
                <tr>
                  <td colSpan={8} className="p-8 text-center text-[#71717A]">
                    No transactions match the specified filter criteria.
                  </td>
                </tr>
              ) : (
                filteredRecords.map((item) => (
                  <tr key={item.id} className="hover:bg-[#FAFAFA] transition-colors">
                    <td className="p-3 font-mono text-[11px] text-[#71717A]">{item.id}</td>
                    <td className="p-3">
                      <span
                        className={`font-mono text-[10px] uppercase px-1.5 py-0.5 rounded border ${
                          item.type === "Income"
                            ? "border-emerald-300 bg-emerald-50 text-emerald-800 font-bold"
                            : "border-slate-200 text-slate-600"
                        }`}
                      >
                        {item.type}
                      </span>
                    </td>
                    <td className="p-3">
                      <span
                        className={`font-mono text-[10px] uppercase px-1.5 py-0.5 rounded border flex items-center gap-1 w-fit ${
                          item.paymentMode === "Cash"
                            ? "border-amber-200 bg-amber-50 text-amber-800 font-semibold"
                            : "border-blue-200 bg-blue-50 text-blue-800 font-semibold"
                        }`}
                      >
                        {item.paymentMode === "Cash" ? (
                          <>
                            <Banknote className="w-3 h-3 text-amber-600" />
                            <span>Cash</span>
                          </>
                        ) : (
                          <>
                            <Smartphone className="w-3 h-3 text-blue-600" />
                            <span>Online</span>
                          </>
                        )}
                      </span>
                    </td>
                    <td className="p-3">
                      <div className="font-medium text-[#09090B]">{item.title}</div>
                      {item.notes && (
                        <div className="text-[11px] text-[#71717A] mt-0.5">{item.notes}</div>
                      )}
                    </td>
                    <td className="p-3 font-mono text-[11px] text-[#71717A]">
                      {item.purpose}
                    </td>
                    <td className="p-3 font-mono text-[11px] text-[#71717A]">{item.date}</td>
                    <td
                      className={`p-3 text-right font-mono font-bold tabular-nums text-xs ${
                        item.type === "Income" ? "text-emerald-700" : "text-slate-800"
                      }`}
                    >
                      {item.type === "Income" ? `+₹${item.amount}` : `-₹${item.amount}`}
                    </td>
                    <td className="p-3 text-right">
                      <button
                        onClick={() => setDeleteTargetId(item.id)}
                        className="p-1 text-[#71717A] hover:text-[#18181B] border border-transparent hover:border-[#E4E4E7] rounded"
                        title="Delete record"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Custom Modal for Adding Transaction */}
      <Modal
        isOpen={isAddModalOpen}
        onClose={() => setIsAddModalOpen(false)}
        title="Record Financial Transaction"
      >
        <form onSubmit={handleAddTransaction} className="space-y-4 text-xs">
          <div className="grid grid-cols-3 gap-3">
            <div>
              <label className="sub-label block mb-1">Transaction Type</label>
              <select
                value={type}
                onChange={(e) => setType(e.target.value as any)}
                className="w-full h-8 px-2 border border-[#E4E4E7] rounded-lg bg-white text-[#09090B]"
              >
                <option value="Expense">Expense (Spent)</option>
                <option value="Income">Income (Pocket Money Deposit)</option>
              </select>
            </div>
            <div>
              <label className="sub-label block mb-1">Payment Mode</label>
              <select
                value={paymentMode}
                onChange={(e) => setPaymentMode(e.target.value as any)}
                className="w-full h-8 px-2 border border-[#E4E4E7] rounded-lg bg-white text-[#09090B]"
              >
                <option value="Online">Online / UPI / Card</option>
                <option value="Cash">Cash in Hand</option>
              </select>
            </div>
            <div>
              <label className="sub-label block mb-1">Amount (₹)</label>
              <input
                type="number"
                step="0.01"
                min="0.01"
                required
                value={amount}
                onChange={(e) => setAmount(e.target.value === "" ? "" : Number(e.target.value))}
                placeholder="0.00"
                className="w-full h-8 px-2.5 border border-[#E4E4E7] bg-white text-[#09090B] font-mono"
                autoFocus
              />
            </div>
          </div>

          <div>
            <label className="sub-label block mb-1">Item / Purpose Description</label>
            <input
              type="text"
              required
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="e.g. Course subscription, Dining, Metro pass"
              className="w-full h-8 px-2.5 border border-[#E4E4E7] bg-white text-[#09090B]"
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="sub-label block mb-1">Purpose Category</label>
              <select
                disabled={type === "Income"}
                value={purpose}
                onChange={(e) => setPurpose(e.target.value as any)}
                className="w-full h-8 px-2 border border-[#E4E4E7] bg-white text-[#09090B] disabled:opacity-50"
              >
                {purposesList.map((p) => (
                  <option key={p} value={p}>
                    {p}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label className="sub-label block mb-1">Date</label>
              <input
                type="date"
                required
                value={date}
                onChange={(e) => setDate(e.target.value)}
                className="w-full h-8 px-2 border border-[#E4E4E7] bg-white text-[#09090B] font-mono"
              />
            </div>
          </div>

          <div>
            <label className="sub-label block mb-1">Notes (Optional)</label>
            <input
              type="text"
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder="Additional details..."
              className="w-full h-8 px-2.5 border border-[#E4E4E7] bg-white text-[#09090B]"
            />
          </div>

          <div className="flex items-center justify-end gap-2 pt-3 border-t border-[#E4E4E7]">
            <button
              type="button"
              onClick={() => setIsAddModalOpen(false)}
              className="h-8 px-3 border border-[#E4E4E7] text-xs font-medium text-[#71717A] hover:text-[#09090B] hover:bg-[#FAFAFA]"
            >
              Cancel (Esc)
            </button>
            <button
              type="submit"
              className="h-8 px-4 bg-[#18181B] text-white text-xs font-medium hover:bg-[#27272A]"
            >
              Save Record
            </button>
          </div>
        </form>
      </Modal>

      {/* Delete Confirmation */}
      <ConfirmDialog
        isOpen={Boolean(deleteTargetId)}
        title="Delete Transaction Record"
        description="Are you sure you want to permanently delete this financial record?"
        confirmLabel="Confirm Delete"
        onConfirm={() => {
          if (deleteTargetId) deleteMoneyRecord(deleteTargetId);
        }}
        onClose={() => setDeleteTargetId(null)}
      />
      </div>
    </div>
  );
};
