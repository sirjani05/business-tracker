import { useMemo, useState } from "react";
import {
  ArrowDown,
  ArrowUpRight,
  BarChart3,
  Download,
  FileText,
  PackageCheck,
  Wallet,
} from "lucide-react";
import {
  Area,
  AreaChart,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import { formatCurrency } from "../data/currency";

function readRecords(key) {
  try {
    return JSON.parse(localStorage.getItem(key) || "[]");
  } catch {
    return [];
  }
}

function Analytics({ currency }) {
  const [period, setPeriod] = useState(7);
  const sales = readRecords("vanzwe-sales");
  const credit = readRecords("vanzwe-credit");
  const inventory = readRecords("vanzwe-inventory");
  const stats = useMemo(() => {
    const revenue = sales.reduce(
      (sum, sale) => sum + Number(sale.total || 0),
      0,
    );
    const owed = credit.reduce(
      (sum, entry) => sum + Number(entry.amount || 0),
      0,
    );
    const lowStock = inventory.filter(
      (item) => Number(item.quantity) <= Number(item.threshold),
    ).length;
    const methods = sales.reduce((result, sale) => {
      result[sale.method] =
        (result[sale.method] || 0) + Number(sale.total || 0);
      return result;
    }, {});
    const chart = Array.from({ length: period }, (_, index) => {
      const date = new Date();
      date.setDate(date.getDate() - (period - index - 1));
      const label = date.toLocaleDateString("en-GB", {
        day: "2-digit",
        month: "short",
      });
      const dayTotal = sales
        .filter(
          (sale) =>
            new Date(sale.createdAt).toDateString() === date.toDateString(),
        )
        .reduce((sum, sale) => sum + Number(sale.total || 0), 0);
      return { label, revenue: dayTotal };
    });
    return {
      revenue,
      owed,
      lowStock,
      methods,
      chart,
      average: period ? revenue / period : 0,
    };
  }, [credit, inventory, period, sales]);

  function exportCsv() {
    const rows = [
      ["Report", "Value"],
      ["Revenue", formatCurrency(stats.revenue, currency)],
      ["Outstanding credit", formatCurrency(stats.owed, currency)],
      ["Inventory items", inventory.length],
      ["Low stock items", stats.lowStock],
      ...Object.entries(stats.methods).map(([method, total]) => [
        `Sales via ${method}`,
        formatCurrency(total, currency),
      ]),
    ];
    const csv = rows
      .map((row) =>
        row.map((cell) => `"${String(cell).replaceAll('"', '""')}"`).join(","),
      )
      .join("\n");
    const url = URL.createObjectURL(new Blob([csv], { type: "text/csv" }));
    const link = document.createElement("a");
    link.href = url;
    link.download = "vanzwe-business-report.csv";
    link.click();
    URL.revokeObjectURL(url);
  }

  return (
    <div className="analytics-page">
      <section className="welcome-row">
        <div>
          <h2>Business analytics</h2>
          <p>Understand the numbers behind your shop.</p>
        </div>
        <button className="outline-button" onClick={exportCsv}>
          <Download size={16} /> Export CSV
        </button>
      </section>
      <div className="analytics-controls">
        <div>
          <span>Revenue period</span>
          {[7, 30].map((days) => (
            <button
              key={days}
              className={
                period === days ? "period-button active" : "period-button"
              }
              onClick={() => setPeriod(days)}
            >
              {days} days
            </button>
          ))}
        </div>
        <small>Based on records saved on this device</small>
      </div>
      <section className="analytics-stat-grid">
        <AnalyticsStat
          label="Revenue recorded"
          value={formatCurrency(stats.revenue, currency)}
          detail={`${sales.length} sale${sales.length === 1 ? "" : "s"} logged`}
          icon={Wallet}
          tone="peach"
        />
        <AnalyticsStat
          label="Outstanding credit"
          value={formatCurrency(stats.owed, currency)}
          detail={`${credit.length} open account${credit.length === 1 ? "" : "s"}`}
          icon={FileText}
          tone="lilac"
        />
        <AnalyticsStat
          label="Average per day"
          value={formatCurrency(stats.average, currency)}
          detail={`Across the last ${period} days`}
          icon={BarChart3}
          tone="mint"
        />
        <AnalyticsStat
          label="Low-stock items"
          value={stats.lowStock}
          detail={`${inventory.length} total items tracked`}
          icon={PackageCheck}
          tone="amber"
        />
      </section>
      <div className="analytics-grid">
        <section className="panel analytics-chart">
          <div className="panel-heading">
            <div>
              <h3>Revenue trend</h3>
              <p>Recorded sales by day</p>
            </div>
            <span className="chart-total">
              {formatCurrency(stats.revenue, currency)}
            </span>
          </div>
          <div className="analytics-chart-wrap">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart
                data={stats.chart}
                margin={{ top: 12, right: 5, left: -22, bottom: 0 }}
              >
                <defs>
                  <linearGradient
                    id="analyticsFill"
                    x1="0"
                    y1="0"
                    x2="0"
                    y2="1"
                  >
                    <stop offset="0%" stopColor="#e8765e" stopOpacity={0.24} />
                    <stop
                      offset="100%"
                      stopColor="#e8765e"
                      stopOpacity={0.02}
                    />
                  </linearGradient>
                </defs>
                <CartesianGrid
                  vertical={false}
                  stroke="#eee8e2"
                  strokeDasharray="3 3"
                />
                <XAxis
                  dataKey="label"
                  axisLine={false}
                  tickLine={false}
                  tick={{ fill: "#a39a91", fontSize: 10 }}
                  dy={10}
                />
                <YAxis
                  axisLine={false}
                  tickLine={false}
                  tick={{ fill: "#a39a91", fontSize: 10 }}
                  tickFormatter={(value) => formatCurrency(value, currency)}
                />
                <Tooltip
                  contentStyle={{ border: "0", borderRadius: 8 }}
                  formatter={(value) => [
                    formatCurrency(value, currency),
                    "Revenue",
                  ]}
                />
                <Area
                  type="monotone"
                  dataKey="revenue"
                  stroke="#e76f58"
                  strokeWidth={2.5}
                  fill="url(#analyticsFill)"
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </section>
        <section className="panel method-panel">
          <div className="panel-heading">
            <div>
              <h3>Payment methods</h3>
              <p>Where your revenue comes from</p>
            </div>
            <Wallet size={20} className="panel-icon" />
          </div>
          {Object.keys(stats.methods).length === 0 ? (
            <div className="analytics-empty">
              <BarChart3 size={20} />
              <span>No payment data yet.</span>
              <small>Record a sale to see the mix.</small>
            </div>
          ) : (
            <div className="method-list">
              {Object.entries(stats.methods).map(([method, total]) => (
                <div className="method-row" key={method}>
                  <div>
                    <strong>{method}</strong>
                    <small>
                      {sales.filter((sale) => sale.method === method).length}{" "}
                      transaction
                      {sales.filter((sale) => sale.method === method).length ===
                      1
                        ? ""
                        : "s"}
                    </small>
                  </div>
                  <strong>{formatCurrency(total, currency)}</strong>
                  <ArrowUpRight size={15} />
                </div>
              ))}
            </div>
          )}
        </section>
      </div>
      <section className="panel insights-panel">
        <div className="panel-heading">
          <div>
            <h3>Business snapshot</h3>
            <p>Quick signals from your current records.</p>
          </div>
          <BarChart3 size={20} className="panel-icon" />
        </div>
        <div className="insight-grid">
          <Insight
            icon={stats.revenue > 0 ? ArrowUpRight : ArrowDown}
            title={
              stats.revenue > 0
                ? "Revenue is being tracked"
                : "Start recording sales"
            }
            text={
              stats.revenue > 0
                ? "Your sales records are feeding the report."
                : "Your first sale will unlock revenue trends."
            }
            positive={stats.revenue > 0}
          />
          <Insight
            icon={stats.lowStock > 0 ? ArrowDown : PackageCheck}
            title={
              stats.lowStock > 0
                ? `${stats.lowStock} item${stats.lowStock === 1 ? "" : "s"} need restocking`
                : "Stock levels look healthy"
            }
            text={
              stats.lowStock > 0
                ? "Review inventory before your next supplier run."
                : "No items are currently below their threshold."
            }
            positive={stats.lowStock === 0}
          />
        </div>
      </section>
    </div>
  );
}

function AnalyticsStat({ label, value, detail, icon: Icon, tone }) {
  return (
    <div className="analytics-stat">
      <div className={`metric-icon ${tone}`}>
        <Icon size={19} />
      </div>
      <span>{label}</span>
      <strong>{value}</strong>
      <small>{detail}</small>
    </div>
  );
}
function Insight({ icon: Icon, title, text, positive }) {
  return (
    <div className="insight">
      <div
        className={positive ? "insight-icon positive" : "insight-icon warning"}
      >
        <Icon size={16} />
      </div>
      <div>
        <strong>{title}</strong>
        <p>{text}</p>
      </div>
    </div>
  );
}

export default Analytics;
