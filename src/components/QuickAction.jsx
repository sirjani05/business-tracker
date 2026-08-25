import { ArrowUpRight } from "lucide-react";
import { NavLink } from "react-router-dom";

function QuickAction({ icon: Icon, title, text, to }) {
  return (
    <NavLink to={to} className="quick-action">
      <span className="quick-icon">
        <Icon size={18} />
      </span>
      <span>
        <strong>{title}</strong>
        <small>{text}</small>
      </span>
      <ArrowUpRight size={17} />
    </NavLink>
  );
}

export default QuickAction;
