import { useNavigate } from "react-router-dom";

function SmartEmail() {
  const navigate = useNavigate();

  return (
    <div style={{ padding: "2rem", textAlign: "center" }}>
      <h1>Smart Email Journey</h1>
      <p>Email attachment optimization coming soon...</p>
      <button
        onClick={() => navigate("/")}
        style={{ marginTop: "1rem", padding: "0.5rem 1rem" }}
      >
        Back to Home
      </button>
    </div>
  );
}

export default SmartEmail;
