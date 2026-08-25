import { Sparkles } from "lucide-react";
import { Outlet } from "react-router-dom";

function AuthLayout() {
  return (
    <main className="auth-layout">
      <div className="auth-brand">
        <span className="brand-mark">
          <Sparkles size={18} />
        </span>
        <span>
          Vamwe <b>Biz OS</b>
        </span>
      </div>
      <Outlet />
    </main>
  );
}

export default AuthLayout;
