import { Plus, Sparkles } from "lucide-react";

function SectionPage({ title }) {
  return (
    <div className="empty-page">
      <div className="empty-icon">
        <Sparkles size={24} />
      </div>
      <h2>{title}</h2>
      <p>This workspace is ready for your next business move.</p>
      <button className="primary-button">
        <Plus size={17} /> Create new entry
      </button>
    </div>
  );
}

export default SectionPage;
