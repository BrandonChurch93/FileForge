import { useNavigate } from "react-router-dom";
import { JOURNEY_META } from "./constants";

function Landing() {
  const navigate = useNavigate();

  return (
    <div style={{ padding: "2rem", textAlign: "center" }}>
      <h1>FileForge</h1>
      <p>Select a journey to begin</p>
      <div
        style={{
          display: "flex",
          flexWrap: "wrap",
          gap: "1rem",
          justifyContent: "center",
          marginTop: "2rem",
        }}
      >
        {Object.entries(JOURNEY_META).map(([key, journey]) => (
          <div
            key={key}
            onClick={() => navigate(journey.route)}
            style={{
              padding: "1rem",
              border: "1px solid #ccc",
              borderRadius: "8px",
              cursor: "pointer",
              width: "200px",
            }}
          >
            <div style={{ fontSize: "2rem" }}>{journey.icon}</div>
            <h3>{journey.title}</h3>
            <p style={{ fontSize: "0.875rem" }}>{journey.description}</p>
          </div>
        ))}
      </div>
    </div>
  );
}

export default Landing;
