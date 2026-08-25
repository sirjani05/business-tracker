import { ChevronDown } from "lucide-react";
import {
  Area,
  AreaChart,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";

const salesData = [
  { day: "Mon", sales: 1200 },
  { day: "Tue", sales: 1850 },
  { day: "Wed", sales: 1420 },
  { day: "Thu", sales: 2240 },
  { day: "Fri", sales: 1980 },
  { day: "Sat", sales: 3040 },
  { day: "Sun", sales: 2650 },
];

function SalesChart({ currency }) {
  const symbol = currency === "USD" ? "$" : "ZiG ";
  return (
    <section className="panel chart-panel">
      <div className="panel-heading">
        <div>
          <h3>Sales overview</h3>
          <p>Revenue for the last 7 days</p>
        </div>
        <button className="select-button">
          This week <ChevronDown size={14} />
        </button>
      </div>
      <div className="chart-legend">
        <span>
          <i className="legend-sales" />
          Sales
        </span>
        <strong>
          {symbol}14,380.50 <small>+18.2%</small>
        </strong>
      </div>
      <div className="chart-wrap">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart
            data={salesData}
            margin={{ top: 12, right: 5, left: -22, bottom: 0 }}
          >
            <defs>
              <linearGradient id="salesFill" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="#ee8067" stopOpacity={0.26} />
                <stop offset="100%" stopColor="#ee8067" stopOpacity={0.02} />
              </linearGradient>
            </defs>
            <CartesianGrid
              vertical={false}
              stroke="#eee8e2"
              strokeDasharray="3 3"
            />
            <XAxis
              dataKey="day"
              axisLine={false}
              tickLine={false}
              tick={{ fill: "#a39a91", fontSize: 11 }}
              dy={10}
            />
            <YAxis
              axisLine={false}
              tickLine={false}
              tick={{ fill: "#a39a91", fontSize: 11 }}
              tickFormatter={(value) => `$${value / 1000}k`}
            />
            <Tooltip
              contentStyle={{
                border: "0",
                borderRadius: 8,
                boxShadow: "0 8px 24px #382c2118",
              }}
              formatter={(value) => [`$${value.toLocaleString()}`, "Sales"]}
            />
            <Area
              type="monotone"
              dataKey="sales"
              stroke="#e76f58"
              strokeWidth={2.5}
              fill="url(#salesFill)"
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>
    </section>
  );
}

export default SalesChart;
