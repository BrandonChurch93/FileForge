import { useNavigate } from "react-router-dom";

function FileConverter() {
  const navigate = useNavigate();

  return (
    <div style={{ padding: "2rem", textAlign: "center" }}>
      <h1>File Converter Journey</h1>
      <p>Format conversion coming soon...</p>
      <button
        onClick={() => navigate("/")}
        style={{ marginTop: "1rem", padding: "0.5rem 1rem" }}
      >
        Back to Home
      </button>
    </div>
  );
}

export default FileConverter;
