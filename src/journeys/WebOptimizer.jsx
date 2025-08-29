import { useNavigate } from "react-router-dom";

function WebOptimizer() {
  const navigate = useNavigate();

  return (
    <div style={{ padding: "2rem", textAlign: "center" }}>
      <h1>Web Optimizer Journey</h1>
      <p>Image optimization coming soon...</p>
      <button
        onClick={() => navigate("/")}
        style={{ marginTop: "1rem", padding: "0.5rem 1rem" }}
      >
        Back to Home
      </button>
    </div>
  );
}

export default WebOptimizer;
