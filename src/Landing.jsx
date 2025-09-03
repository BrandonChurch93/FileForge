import { useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";

function Landing() {
  const navigate = useNavigate();
  const [glitchActive, setGlitchActive] = useState(false);
  const [pageAnimating, setPageAnimating] = useState(false);
  const [pageLoaded, setPageLoaded] = useState(false);

  // Initial page load animation
  useEffect(() => {
    setTimeout(() => {
      setPageLoaded(true);
    }, 100);
  }, []);

  // Glitch effect for hero title
  useEffect(() => {
    const triggerGlitch = () => {
      setGlitchActive(true);
      setTimeout(() => {
        setGlitchActive(false);
        // Double glitch effect
        setTimeout(() => {
          setGlitchActive(true);
          setTimeout(() => {
            setGlitchActive(false);
          }, 300);
        }, 150);
      }, 300);
    };

    // Trigger glitch every 3 seconds
    const interval = setInterval(triggerGlitch, 3000);

    // Initial trigger after 1 second
    setTimeout(triggerGlitch, 1000);

    return () => clearInterval(interval);
  }, []);

  const handleJourneySelect = (route) => {
    setPageAnimating(true);
    setTimeout(() => {
      navigate(route);
    }, 300);
  };

  return (
    <>
      {/* Grid Background */}
      <div
        style={{
          position: "fixed",
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          backgroundImage: `linear-gradient(rgba(0, 240, 255, 0.03) 1px, transparent 1px),
                         linear-gradient(90deg, rgba(0, 240, 255, 0.03) 1px, transparent 1px)`,
          backgroundSize: "50px 50px",
          animation: "gridMove 20s linear infinite",
          pointerEvents: "none",
          zIndex: 0,
        }}
      />

      {/* Background gradient effects */}
      <div
        style={{
          position: "fixed",
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          background: `radial-gradient(ellipse at top left, rgba(0, 240, 255, 0.1) 0%, transparent 50%),
                     radial-gradient(ellipse at bottom right, rgba(147, 51, 234, 0.1) 0%, transparent 50%)`,
          pointerEvents: "none",
          zIndex: 0,
        }}
      />

      {/* Main Container with animation */}
      <div
        style={{
          maxWidth: "1200px",
          margin: "0 auto",
          padding: "var(--space-xl)",
          position: "relative",
          zIndex: 1,
          opacity: pageLoaded && !pageAnimating ? 1 : 0,
          transform:
            pageLoaded && !pageAnimating ? "translateY(0)" : "translateY(20px)",
          transition:
            "opacity 0.5s var(--ease-out), transform 0.5s var(--ease-out)",
        }}
      >
        {/* Hero Section */}
        <div
          style={{
            textAlign: "center",
            padding: "var(--space-3xl) 0",
            position: "relative",
          }}
        >
          <h1
            className={glitchActive ? "glitch-active" : ""}
            style={{
              fontSize: "clamp(64px, 8vw, 96px)",
              fontWeight: "100",
              letterSpacing: "8px",
              textTransform: "uppercase",
              marginBottom: "var(--space-md)",
              position: "relative",
              display: "inline-block",
            }}
            data-text="FILEFORGE"
          >
            FILEFORGE
          </h1>

          <p
            style={{
              fontSize: "18px",
              color: "var(--text-secondary)",
              letterSpacing: "2px",
              marginBottom: "var(--space-xl)",
            }}
          >
            Professional file optimization in seconds
          </p>

          <div
            style={{
              display: "flex",
              gap: "var(--space-xl)",
              justifyContent: "center",
              alignItems: "center",
            }}
          >
            <div
              style={{
                display: "flex",
                alignItems: "center",
                gap: "var(--space-sm)",
                padding: "var(--space-sm) var(--space-md)",
                background: "var(--glass-light)",
                border: "1px solid var(--glass-border)",
                borderRadius: "var(--radius-md)",
                fontSize: "14px",
                color: "var(--text-secondary)",
              }}
            >
              <svg
                style={{
                  width: "16px",
                  height: "16px",
                  color: "var(--color-cyan)",
                }}
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
              >
                <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"></path>
              </svg>
              <span>Browser-based processing</span>
            </div>

            <div
              style={{
                display: "flex",
                alignItems: "center",
                gap: "var(--space-sm)",
                padding: "var(--space-sm) var(--space-md)",
                background: "var(--glass-light)",
                border: "1px solid var(--glass-border)",
                borderRadius: "var(--radius-md)",
                fontSize: "14px",
                color: "var(--text-secondary)",
              }}
            >
              <svg
                style={{
                  width: "16px",
                  height: "16px",
                  color: "var(--color-cyan)",
                }}
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
              >
                <circle cx="12" cy="12" r="10"></circle>
                <polyline points="12 6 12 12 16 14"></polyline>
              </svg>
              <span>Under 3 seconds</span>
            </div>
          </div>
        </div>

        {/* Everyday Use Section */}
        <div style={{ marginBottom: "var(--space-3xl)" }}>
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: "var(--space-md)",
              marginBottom: "var(--space-xl)",
            }}
          >
            <span
              style={{
                fontSize: "12px",
                textTransform: "uppercase",
                letterSpacing: "3px",
                color: "var(--text-tertiary)",
              }}
            >
              EVERYDAY USE
            </span>
            <div
              style={{
                flex: 1,
                height: "1px",
                background:
                  "linear-gradient(90deg, var(--glass-border), transparent)",
              }}
            />
          </div>

          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fit, minmax(350px, 1fr))",
              gap: "var(--space-lg)",
              marginBottom: "var(--space-lg)",
            }}
          >
            {/* Smart Email Card */}
            <div
              className="card journey-card"
              onClick={() => handleJourneySelect("/email")}
              style={{
                minHeight: "280px",
                position: "relative",
              }}
            >
              <div
                style={{
                  position: "absolute",
                  top: "var(--space-md)",
                  right: "var(--space-md)",
                  background:
                    "linear-gradient(135deg, rgba(0, 240, 255, 0.2), rgba(147, 51, 234, 0.2))",
                  border: "1px solid rgba(0, 240, 255, 0.3)",
                  borderRadius: "var(--radius-sm)",
                  padding: "4px 8px",
                  fontSize: "11px",
                  textTransform: "uppercase",
                  letterSpacing: "1px",
                  color: "var(--color-cyan)",
                  zIndex: 1,
                }}
              >
                Multi-platform
              </div>

              <div
                style={{
                  display: "flex",
                  flexDirection: "column",
                  height: "100%",
                }}
              >
                <div
                  style={{
                    width: "48px",
                    height: "48px",
                    background: "linear-gradient(135deg, #00f0ff, #0080ff)",
                    borderRadius: "var(--radius-md)",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    marginBottom: "var(--space-md)",
                  }}
                >
                  <svg
                    style={{
                      width: "24px",
                      height: "24px",
                      stroke: "white",
                      strokeWidth: "1.5",
                    }}
                    viewBox="0 0 24 24"
                    fill="none"
                  >
                    <rect x="3" y="4" width="18" height="16" rx="2"></rect>
                    <line x1="8" y1="9" x2="16" y2="9"></line>
                    <line x1="8" y1="13" x2="16" y2="13"></line>
                  </svg>
                </div>

                <h3
                  style={{
                    fontSize: "18px",
                    fontWeight: "300",
                    marginBottom: "var(--space-sm)",
                    letterSpacing: "0.5px",
                  }}
                >
                  Smart Email & Message Attachments
                </h3>

                <p
                  style={{
                    color: "var(--text-secondary)",
                    fontSize: "14px",
                    lineHeight: "1.5",
                    marginBottom: "var(--space-md)",
                    flex: 1,
                  }}
                >
                  Never see "file too large" errors again. Automatically
                  compress files to fit Gmail, Outlook, Discord limits.
                </p>

                <div
                  style={{
                    display: "inline-flex",
                    alignItems: "center",
                    gap: "var(--space-xs)",
                    padding: "8px 12px",
                    background: "rgba(16, 185, 129, 0.1)",
                    border: "1px solid rgba(16, 185, 129, 0.3)",
                    borderRadius: "var(--radius-md)",
                    fontSize: "13px",
                    color: "var(--color-green)",
                    marginTop: "auto",
                  }}
                >
                  <svg
                    style={{ width: "14px", height: "14px" }}
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                  >
                    <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path>
                    <polyline points="22 4 12 14.01 9 11.01"></polyline>
                  </svg>
                  Guaranteed delivery - we handle the limits
                </div>
              </div>
            </div>

            {/* File Converter Card */}
            <div
              className="card journey-card"
              onClick={() => handleJourneySelect("/convert")}
              style={{
                minHeight: "280px",
                position: "relative",
              }}
            >
              <div
                style={{
                  position: "absolute",
                  top: "var(--space-md)",
                  right: "var(--space-md)",
                  background:
                    "linear-gradient(135deg, rgba(0, 240, 255, 0.2), rgba(147, 51, 234, 0.2))",
                  border: "1px solid rgba(0, 240, 255, 0.3)",
                  borderRadius: "var(--radius-sm)",
                  padding: "4px 8px",
                  fontSize: "11px",
                  textTransform: "uppercase",
                  letterSpacing: "1px",
                  color: "var(--color-cyan)",
                  zIndex: 1,
                }}
              >
                Lossless option
              </div>

              <div
                style={{
                  display: "flex",
                  flexDirection: "column",
                  height: "100%",
                }}
              >
                <div
                  style={{
                    width: "48px",
                    height: "48px",
                    background: "linear-gradient(135deg, #9333ea, #c026d3)",
                    borderRadius: "var(--radius-md)",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    marginBottom: "var(--space-md)",
                  }}
                >
                  <svg
                    style={{
                      width: "24px",
                      height: "24px",
                      stroke: "white",
                      strokeWidth: "1.5",
                    }}
                    viewBox="0 0 24 24"
                    fill="none"
                  >
                    <polyline points="23 4 23 10 17 10"></polyline>
                    <polyline points="1 20 1 14 7 14"></polyline>
                    <path d="M3.51 9a9 9 0 0 1 14.85-3.36L23 10M1 14l4.64 4.36A9 9 0 0 0 20.49 15"></path>
                  </svg>
                </div>

                <h3
                  style={{
                    fontSize: "18px",
                    fontWeight: "300",
                    marginBottom: "var(--space-sm)",
                    letterSpacing: "0.5px",
                  }}
                >
                  Universal File Converter
                </h3>

                <p
                  style={{
                    color: "var(--text-secondary)",
                    fontSize: "14px",
                    lineHeight: "1.5",
                    marginBottom: "var(--space-md)",
                    flex: 1,
                  }}
                >
                  Convert images between JPG, PNG, WebP, and more with
                  intelligent quality preservation.
                </p>

                <div
                  style={{
                    display: "inline-flex",
                    alignItems: "center",
                    gap: "var(--space-xs)",
                    padding: "8px 12px",
                    background: "rgba(16, 185, 129, 0.1)",
                    border: "1px solid rgba(16, 185, 129, 0.3)",
                    borderRadius: "var(--radius-md)",
                    fontSize: "13px",
                    color: "var(--color-green)",
                    marginTop: "auto",
                  }}
                >
                  <svg
                    style={{ width: "14px", height: "14px" }}
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                  >
                    <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path>
                    <polyline points="22 4 12 14.01 9 11.01"></polyline>
                  </svg>
                  Zero quality loss available
                </div>
              </div>
            </div>

            {/* PDF Studio Card */}
            <div
              className="card journey-card"
              onClick={() => handleJourneySelect("/pdf")}
              style={{
                minHeight: "280px",
                position: "relative",
              }}
            >
              <div
                style={{
                  position: "absolute",
                  top: "var(--space-md)",
                  right: "var(--space-md)",
                  background:
                    "linear-gradient(135deg, rgba(0, 240, 255, 0.2), rgba(147, 51, 234, 0.2))",
                  border: "1px solid rgba(0, 240, 255, 0.3)",
                  borderRadius: "var(--radius-sm)",
                  padding: "4px 8px",
                  fontSize: "11px",
                  textTransform: "uppercase",
                  letterSpacing: "1px",
                  color: "var(--color-cyan)",
                  zIndex: 1,
                }}
              >
                No software needed
              </div>

              <div
                style={{
                  display: "flex",
                  flexDirection: "column",
                  height: "100%",
                }}
              >
                <div
                  style={{
                    width: "48px",
                    height: "48px",
                    background: "linear-gradient(135deg, #ec4899, #f472b6)",
                    borderRadius: "var(--radius-md)",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    marginBottom: "var(--space-md)",
                  }}
                >
                  <svg
                    style={{
                      width: "24px",
                      height: "24px",
                      stroke: "white",
                      strokeWidth: "1.5",
                    }}
                    viewBox="0 0 24 24"
                    fill="none"
                  >
                    <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path>
                    <polyline points="14 2 14 8 20 8"></polyline>
                    <line x1="16" y1="13" x2="8" y2="13"></line>
                    <line x1="16" y1="17" x2="8" y2="17"></line>
                    <polyline points="10 9 9 9 8 9"></polyline>
                  </svg>
                </div>

                <h3
                  style={{
                    fontSize: "18px",
                    fontWeight: "300",
                    marginBottom: "var(--space-sm)",
                    letterSpacing: "0.5px",
                  }}
                >
                  PDF Document Studio
                </h3>

                <p
                  style={{
                    color: "var(--text-secondary)",
                    fontSize: "14px",
                    lineHeight: "1.5",
                    marginBottom: "var(--space-md)",
                    flex: 1,
                  }}
                >
                  Create, split, merge, and extract PDF documents with
                  professional precision.
                </p>

                <div
                  style={{
                    display: "inline-flex",
                    alignItems: "center",
                    gap: "var(--space-xs)",
                    padding: "8px 12px",
                    background: "rgba(16, 185, 129, 0.1)",
                    border: "1px solid rgba(16, 185, 129, 0.3)",
                    borderRadius: "var(--radius-md)",
                    fontSize: "13px",
                    color: "var(--color-green)",
                    marginTop: "auto",
                  }}
                >
                  <svg
                    style={{ width: "14px", height: "14px" }}
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                  >
                    <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path>
                    <polyline points="22 4 12 14.01 9 11.01"></polyline>
                  </svg>
                  Professional results instantly
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Developer Tools Section */}
        <div style={{ marginBottom: "var(--space-3xl)" }}>
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: "var(--space-md)",
              marginBottom: "var(--space-xl)",
            }}
          >
            <span
              style={{
                fontSize: "12px",
                textTransform: "uppercase",
                letterSpacing: "3px",
                color: "var(--text-tertiary)",
              }}
            >
              DEVELOPER TOOLS
            </span>
            <div
              style={{
                flex: 1,
                height: "1px",
                background:
                  "linear-gradient(90deg, var(--glass-border), transparent)",
              }}
            />
          </div>

          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fit, minmax(350px, 1fr))",
              gap: "var(--space-lg)",
            }}
          >
            {/* Web Optimizer Card */}
            <div
              className="card journey-card"
              onClick={() => handleJourneySelect("/optimize")}
              style={{
                minHeight: "280px",
                position: "relative",
              }}
            >
              <div
                style={{
                  position: "absolute",
                  top: "var(--space-md)",
                  right: "var(--space-md)",
                  background:
                    "linear-gradient(135deg, rgba(0, 240, 255, 0.2), rgba(147, 51, 234, 0.2))",
                  border: "1px solid rgba(0, 240, 255, 0.3)",
                  borderRadius: "var(--radius-sm)",
                  padding: "4px 8px",
                  fontSize: "11px",
                  textTransform: "uppercase",
                  letterSpacing: "1px",
                  color: "var(--color-cyan)",
                  zIndex: 1,
                }}
              >
                Core Web Vitals
              </div>

              <div
                style={{
                  display: "flex",
                  flexDirection: "column",
                  height: "100%",
                }}
              >
                <div
                  style={{
                    width: "48px",
                    height: "48px",
                    background: "linear-gradient(135deg, #10b981, #34d399)",
                    borderRadius: "var(--radius-md)",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    marginBottom: "var(--space-md)",
                  }}
                >
                  <svg
                    style={{
                      width: "24px",
                      height: "24px",
                      stroke: "white",
                      strokeWidth: "1.5",
                    }}
                    viewBox="0 0 24 24"
                    fill="none"
                  >
                    <path d="M13 2L3 14h9l-1 8 10-12h-9l1-8z"></path>
                  </svg>
                </div>

                <h3
                  style={{
                    fontSize: "18px",
                    fontWeight: "300",
                    marginBottom: "var(--space-sm)",
                    letterSpacing: "0.5px",
                  }}
                >
                  Web Performance Optimizer
                </h3>

                <p
                  style={{
                    color: "var(--text-secondary)",
                    fontSize: "14px",
                    lineHeight: "1.5",
                    marginBottom: "var(--space-md)",
                    flex: 1,
                  }}
                >
                  Compress and optimize images for 3x faster website loading.
                </p>

                <div
                  style={{
                    display: "inline-flex",
                    alignItems: "center",
                    gap: "var(--space-xs)",
                    padding: "8px 12px",
                    background: "rgba(16, 185, 129, 0.1)",
                    border: "1px solid rgba(16, 185, 129, 0.3)",
                    borderRadius: "var(--radius-md)",
                    fontSize: "13px",
                    color: "var(--color-green)",
                    marginTop: "auto",
                  }}
                >
                  <svg
                    style={{ width: "14px", height: "14px" }}
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                  >
                    <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path>
                    <polyline points="22 4 12 14.01 9 11.01"></polyline>
                  </svg>
                  Pass Google's metrics automatically
                </div>
              </div>
            </div>

            {/* Icon Generator Card */}
            <div
              className="card journey-card"
              onClick={() => handleJourneySelect("/icons")}
              style={{
                minHeight: "280px",
                position: "relative",
              }}
            >
              <div
                style={{
                  position: "absolute",
                  top: "var(--space-md)",
                  right: "var(--space-md)",
                  background:
                    "linear-gradient(135deg, rgba(0, 240, 255, 0.2), rgba(147, 51, 234, 0.2))",
                  border: "1px solid rgba(0, 240, 255, 0.3)",
                  borderRadius: "var(--radius-sm)",
                  padding: "4px 8px",
                  fontSize: "11px",
                  textTransform: "uppercase",
                  letterSpacing: "1px",
                  color: "var(--color-cyan)",
                  zIndex: 1,
                }}
              >
                All platforms
              </div>

              <div
                style={{
                  display: "flex",
                  flexDirection: "column",
                  height: "100%",
                }}
              >
                <div
                  style={{
                    width: "48px",
                    height: "48px",
                    background: "linear-gradient(135deg, #f59e0b, #fcd34d)",
                    borderRadius: "var(--radius-md)",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    marginBottom: "var(--space-md)",
                  }}
                >
                  <svg
                    style={{
                      width: "24px",
                      height: "24px",
                      stroke: "white",
                      strokeWidth: "1.5",
                    }}
                    viewBox="0 0 24 24"
                    fill="none"
                  >
                    <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"></polygon>
                  </svg>
                </div>

                <h3
                  style={{
                    fontSize: "18px",
                    fontWeight: "300",
                    marginBottom: "var(--space-sm)",
                    letterSpacing: "0.5px",
                  }}
                >
                  Universal Icon Generator
                </h3>

                <p
                  style={{
                    color: "var(--text-secondary)",
                    fontSize: "14px",
                    lineHeight: "1.5",
                    marginBottom: "var(--space-md)",
                    flex: 1,
                  }}
                >
                  Generate every icon size for websites, iOS, Android, and
                  Windows.
                </p>

                <div
                  style={{
                    display: "inline-flex",
                    alignItems: "center",
                    gap: "var(--space-xs)",
                    padding: "8px 12px",
                    background: "rgba(16, 185, 129, 0.1)",
                    border: "1px solid rgba(16, 185, 129, 0.3)",
                    borderRadius: "var(--radius-md)",
                    fontSize: "13px",
                    color: "var(--color-green)",
                    marginTop: "auto",
                  }}
                >
                  <svg
                    style={{ width: "14px", height: "14px" }}
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                  >
                    <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path>
                    <polyline points="22 4 12 14.01 9 11.01"></polyline>
                  </svg>
                  30+ sizes from one image
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Grid animation keyframe */}
      <style>{`
        @keyframes gridMove {
          0% {
            transform: translate(0, 0);
          }
          100% {
            transform: translate(50px, 50px);
          }
        }

        /* Glitch effect styles */
        .glitch-active::before,
        .glitch-active::after {
          content: "FILEFORGE";
          position: absolute;
          top: 0;
          left: 0;
          width: 100%;
          height: 100%;
        }

        .glitch-active::before {
          animation: glitch1 0.3s ease-out;
          color: var(--color-cyan);
          opacity: 0.8;
          clip-path: polygon(0 0, 100% 0, 100% 35%, 0 35%);
          transform: translateX(-2px);
        }

        .glitch-active::after {
          animation: glitch2 0.3s ease-out;
          color: var(--color-pink);
          opacity: 0.8;
          clip-path: polygon(0 65%, 100% 65%, 100% 100%, 0 100%);
          transform: translateX(2px);
        }

        @keyframes glitch1 {
          0%, 100% { transform: translateX(0); }
          20% { transform: translateX(-2px); }
          40% { transform: translateX(2px); }
          60% { transform: translateX(-1px); }
        }

        @keyframes glitch2 {
          0%, 100% { transform: translateX(0); }
          20% { transform: translateX(2px); }
          40% { transform: translateX(-2px); }
          60% { transform: translateX(1px); }
        }
      `}</style>
    </>
  );
}

export default Landing;
