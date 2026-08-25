import { ArrowUpRight } from "lucide-react";

function Metric({ label, value, change, note, icon: Icon, tone }) {
  return (
    <div className="metric-card">
      <div className={`metric-icon ${tone}`}>
        <Icon size={19} />
      </div>
      <div className="metric-copy">
        <span>{label}</span>
        <strong>{value}</strong>
        <small>
          <b>{change}</b> {note}
        </small>
      </div>
      <ArrowUpRight className="metric-arrow" size={17} />
    </div>
  );
}

export default Metric;
