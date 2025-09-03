import { useState, useRef, useEffect } from "react";

// ============================================
// ANIMATED BACKGROUND COMPONENT (NEW)
// ============================================
export function AnimatedBackground() {
  return (
    <div className="animated-background">
      <div className="animated-grid" />
      <div className="gradient-overlay" />
    </div>
  );
}

// ============================================
// PROGRESS BAR COMPONENT
// ============================================
export function ProgressBar({ currentStep, totalSteps, stepName }) {
  const progress = (currentStep / totalSteps) * 100;

  return (
    <div
      className="progress-container"
      style={{
        background: "var(--glass-light)",
        borderRadius: "var(--radius-lg)",
        padding: "var(--space-md)",
        border: "1px solid var(--glass-border)",
        marginBottom: "var(--space-xl)",
        backdropFilter: "blur(20px)",
      }}
    >
      <div
        style={{
          height: "8px",
          background: "var(--glass-light)",
          border: "1px solid var(--glass-border)",
          borderRadius: "var(--radius-full)",
          overflow: "hidden",
          position: "relative",
          marginBottom: "var(--space-md)",
        }}
      >
        <div
          className="shimmer"
          style={{
            height: "100%",
            background:
              "linear-gradient(90deg, var(--color-cyan), var(--color-purple))",
            transition: "width var(--duration-slow) var(--ease-out)",
            width: `${progress}%`,
            position: "relative",
            overflow: "hidden",
          }}
        />
      </div>
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
        }}
      >
        <span
          className="text-base"
          style={{
            color: "var(--color-cyan)",
            fontWeight: "400",
          }}
        >
          Step {currentStep} of {totalSteps}
        </span>
        {stepName && (
          <span
            className="text-sm"
            style={{
              textTransform: "uppercase",
              letterSpacing: "var(--letter-spacing-wider)",
              color: "var(--text-secondary)",
            }}
          >
            {stepName}
          </span>
        )}
      </div>
    </div>
  );
}

// ============================================
// FILE UPLOAD COMPONENT
// ============================================
export function FileUpload({
  onFilesSelected,
  maxFiles = 10,
  accept = "*",
  multiple = true,
}) {
  const [isDragging, setIsDragging] = useState(false);
  const [isHovering, setIsHovering] = useState(false);
  const fileInputRef = useRef(null);

  const handleDragOver = (e) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = (e) => {
    e.preventDefault();
    setIsDragging(false);
  };

  const handleDrop = (e) => {
    e.preventDefault();
    setIsDragging(false);
    const files = Array.from(e.dataTransfer.files);
    if (files.length > 0) {
      onFilesSelected(files.slice(0, maxFiles));
    }
  };

  const handleFileSelect = (e) => {
    const files = Array.from(e.target.files);
    if (files.length > 0) {
      onFilesSelected(files.slice(0, maxFiles));
    }
  };

  return (
    <div
      className={isDragging ? "upload-zone-active" : ""}
      style={{
        border: "2px dashed",
        borderColor: isDragging
          ? "var(--color-cyan)"
          : isHovering
          ? "rgba(0, 240, 255, 0.3)"
          : "var(--glass-border)",
        borderRadius: "var(--radius-lg)",
        padding: "var(--space-3xl)",
        background: isDragging
          ? "rgba(0, 240, 255, 0.05)"
          : isHovering
          ? "var(--glass-medium)"
          : "var(--glass-light)",
        transition: "all var(--duration-normal) var(--ease-out)",
        cursor: "pointer",
        position: "relative",
        overflow: "hidden",
        transform: isDragging ? "scale(1.02)" : "scale(1)",
        backdropFilter: "blur(20px)",
      }}
      onDragOver={handleDragOver}
      onDragLeave={handleDragLeave}
      onDrop={handleDrop}
      onClick={() => fileInputRef.current?.click()}
      onMouseEnter={() => setIsHovering(true)}
      onMouseLeave={() => setIsHovering(false)}
    >
      <div style={{ textAlign: "center", position: "relative", zIndex: 1 }}>
        <svg
          style={{
            width: "48px",
            height: "48px",
            margin: "0 auto var(--space-md)",
            color: "var(--color-cyan)",
          }}
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="1.5"
        >
          <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path>
          <polyline points="17 8 12 3 7 8"></polyline>
          <line x1="12" y1="3" x2="12" y2="15"></line>
        </svg>

        <div
          className="text-lg"
          style={{
            marginBottom: "var(--space-sm)",
            color: "var(--text-primary)",
          }}
        >
          Drop files here or click to browse
        </div>

        <div
          style={{
            display: "flex",
            gap: "var(--space-sm)",
            justifyContent: "center",
            marginBottom: "var(--space-md)",
            flexWrap: "wrap",
          }}
        >
          {["JPG", "PNG", "WebP", "PDF"].map((format) => (
            <span
              key={format}
              className="text-sm"
              style={{
                background: "var(--glass-heavy)",
                border: "1px solid var(--glass-border)",
                padding: "6px 12px",
                borderRadius: "var(--radius-sm)",
                textTransform: "uppercase",
                letterSpacing: "var(--letter-spacing-wide)",
              }}
            >
              {format}
            </span>
          ))}
        </div>

        <div
          className="text-base"
          style={{
            display: "flex",
            gap: "var(--space-lg)",
            justifyContent: "center",
            color: "var(--text-secondary)",
          }}
        >
          <span>Max {maxFiles} files</span>
          <span>•</span>
          <span>Up to 50MB each</span>
        </div>

        <div
          className="text-sm"
          style={{
            marginTop: "var(--space-md)",
            paddingTop: "var(--space-md)",
            borderTop: "1px solid var(--glass-border)",
            color: "var(--color-green)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            gap: "var(--space-sm)",
          }}
        >
          <svg
            style={{ width: "16px", height: "16px" }}
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.5"
          >
            <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"></path>
          </svg>
          Browser-only processing - files never leave your device
        </div>
      </div>

      <input
        ref={fileInputRef}
        type="file"
        accept={accept}
        multiple={multiple}
        onChange={handleFileSelect}
        style={{ display: "none" }}
      />
    </div>
  );
}

// ============================================
// FILE LIST COMPONENT
// ============================================
export function FileList({ files, onRemove }) {
  const [thumbnails, setThumbnails] = useState({});

  useEffect(() => {
    // Load thumbnails for image files
    files.forEach((file, index) => {
      if (file.type && file.type.startsWith("image/")) {
        const reader = new FileReader();
        reader.onload = (e) => {
          setThumbnails((prev) => ({
            ...prev,
            [index]: e.target.result,
          }));
        };
        reader.readAsDataURL(file);
      }
    });
  }, [files]);

  if (!files || files.length === 0) {
    return (
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          gap: "var(--space-lg)",
          padding: "var(--space-3xl)",
          textAlign: "center",
        }}
      >
        <svg
          style={{
            width: "64px",
            height: "64px",
            color: "var(--text-tertiary)",
            opacity: "0.5",
          }}
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="1.5"
        >
          <path d="M13 2L3 14h9l-1 8 10-12h-9l1-8z"></path>
        </svg>
        <div
          className="text-lg"
          style={{
            fontWeight: "300",
            color: "var(--text-primary)",
          }}
        >
          No files uploaded yet
        </div>
        <div
          className="text-base"
          style={{
            color: "var(--text-secondary)",
            maxWidth: "400px",
          }}
        >
          Drop your files above or click to browse
        </div>
      </div>
    );
  }

  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        gap: "var(--space-sm)",
      }}
    >
      {files.map((file, index) => (
        <div
          key={index}
          style={{
            display: "flex",
            alignItems: "center",
            gap: "var(--space-md)",
            padding: "var(--space-md)",
            background: "var(--glass-medium)",
            border: "1px solid var(--glass-border)",
            borderRadius: "var(--radius-md)",
            transition: "all var(--duration-normal)",
            backdropFilter: "blur(20px)",
          }}
        >
          <div
            style={{
              width: "60px",
              height: "60px",
              background: thumbnails[index]
                ? "transparent"
                : "var(--glass-light)",
              border: "1px solid var(--glass-border)",
              borderRadius: "var(--radius-sm)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              overflow: "hidden",
              flexShrink: 0,
            }}
          >
            {thumbnails[index] ? (
              <img
                src={thumbnails[index]}
                alt={file.name}
                style={{
                  width: "100%",
                  height: "100%",
                  objectFit: "cover",
                }}
              />
            ) : (
              <svg
                style={{
                  width: "24px",
                  height: "24px",
                  color: "var(--text-tertiary)",
                }}
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="1.5"
              >
                {file.type === "application/pdf" ||
                file.name?.toLowerCase().endsWith(".pdf") ? (
                  <>
                    <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path>
                    <polyline points="14 2 14 8 20 8"></polyline>
                    <line x1="16" y1="13" x2="8" y2="13"></line>
                    <line x1="16" y1="17" x2="8" y2="17"></line>
                  </>
                ) : (
                  <>
                    <rect
                      x="3"
                      y="3"
                      width="18"
                      height="18"
                      rx="2"
                      ry="2"
                    ></rect>
                    <circle cx="8.5" cy="8.5" r="1.5"></circle>
                    <polyline points="21 15 16 10 5 21"></polyline>
                  </>
                )}
              </svg>
            )}
          </div>

          <div style={{ flex: 1 }}>
            <div className="text-base" style={{ marginBottom: "2px" }}>
              {file.name}
            </div>
            <div className="text-sm" style={{ color: "var(--text-secondary)" }}>
              {(file.size / 1024 / 1024).toFixed(2)} MB
            </div>
          </div>

          {onRemove && (
            <button
              onClick={() => onRemove(index)}
              className="btn-icon"
              style={{
                width: "36px",
                height: "36px",
                padding: "0",
                background: "transparent",
                border: "1px solid var(--glass-border)",
                borderRadius: "var(--radius-sm)",
                color: "var(--text-tertiary)",
                cursor: "pointer",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                transition: "all var(--duration-normal)",
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.background = "rgba(239, 68, 68, 0.1)";
                e.currentTarget.style.borderColor = "#ef4444";
                e.currentTarget.style.color = "#ef4444";
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.background = "transparent";
                e.currentTarget.style.borderColor = "var(--glass-border)";
                e.currentTarget.style.color = "var(--text-tertiary)";
              }}
            >
              <svg
                style={{ width: "16px", height: "16px" }}
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="1.5"
              >
                <line x1="18" y1="6" x2="6" y2="18"></line>
                <line x1="6" y1="6" x2="18" y2="18"></line>
              </svg>
            </button>
          )}
        </div>
      ))}
    </div>
  );
}

// ============================================
// PLATFORM CARD COMPONENT (ENHANCED)
// ============================================
export function PlatformCard({
  platform,
  selected,
  onClick,
  showCompression = false,
  originalSize = 0,
}) {
  const platformIcons = {
    gmail: (
      <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"></path>
    ),
    discord: (
      <>
        <path d="M21 8c0-2-1-3-3-3-1.5 0-2.5 1-3 2-.5-1-1.5-2-3-2-2 0-3 1-3 3 0 4 6 9 6 9s6-5 6-9z"></path>
      </>
    ),
    whatsapp: (
      <path d="M21 11.5a8.38 8.38 0 0 1-.9 3.8 8.5 8.5 0 0 1-7.6 4.7 8.38 8.38 0 0 1-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 0 1-.9-3.8 8.5 8.5 0 0 1 4.7-7.6 8.38 8.38 0 0 1 3.8-.9h.5a8.48 8.48 0 0 1 8 8v.5z"></path>
    ),
    slack: (
      <>
        <rect x="3" y="3" width="18" height="18" rx="2" ry="2"></rect>
        <line x1="9" y1="9" x2="15" y2="9"></line>
        <line x1="9" y1="15" x2="15" y2="15"></line>
      </>
    ),
    outlook: (
      <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"></path>
    ),
    telegram: <path d="M22 2L11 13M22 2l-7 20-4-9-9-4 20-7z"></path>,
    yahoo: (
      <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"></path>
    ),
    icloud: (
      <>
        <path d="M18 10h-1.26A8 8 0 1 0 9 20h9a5 5 0 0 0 0-10z"></path>
      </>
    ),
    messenger: (
      <path d="M21 11.5a8.38 8.38 0 0 1-.9 3.8 8.5 8.5 0 0 1-7.6 4.7 8.38 8.38 0 0 1-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 0 1-.9-3.8 8.5 8.5 0 0 1 4.7-7.6 8.38 8.38 0 0 1 3.8-.9h.5a8.48 8.48 0 0 1 8 8v.5z"></path>
    ),
    teams: (
      <>
        <rect x="3" y="3" width="18" height="18" rx="2" ry="2"></rect>
        <path d="M9 9h6v6H9z"></path>
      </>
    ),
  };

  const icon = platformIcons[platform.id] || platformIcons.gmail;

  return (
    <div
      onClick={onClick}
      style={{
        background: selected ? "rgba(0, 240, 255, 0.05)" : "var(--glass-light)",
        border: selected
          ? "2px solid var(--color-cyan)"
          : "2px solid var(--glass-border)",
        borderRadius: "var(--radius-lg)",
        cursor: "pointer",
        transition: "all var(--duration-normal) var(--ease-out)",
        position: "relative",
        overflow: "hidden",
        padding: "var(--space-lg)",
        backdropFilter: "blur(20px)",
        boxShadow: selected
          ? "0 0 30px rgba(0, 240, 255, 0.2), inset 0 0 20px rgba(0, 240, 255, 0.05)"
          : "none",
      }}
      onMouseEnter={(e) => {
        if (!selected) {
          e.currentTarget.style.transform = "translateY(-4px)";
          e.currentTarget.style.borderColor = "rgba(0, 240, 255, 0.2)";
          e.currentTarget.style.background = "var(--glass-medium)";
        }
      }}
      onMouseLeave={(e) => {
        if (!selected) {
          e.currentTarget.style.transform = "translateY(0)";
          e.currentTarget.style.borderColor = "var(--glass-border)";
          e.currentTarget.style.background = "var(--glass-light)";
        }
      }}
    >
      {selected && (
        <div
          style={{
            position: "absolute",
            top: "var(--space-sm)",
            right: "var(--space-sm)",
            width: "24px",
            height: "24px",
            background:
              "linear-gradient(135deg, rgba(0, 240, 255, 0.2), rgba(147, 51, 234, 0.2))",
            border: "1px solid var(--color-cyan)",
            borderRadius: "var(--radius-full)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            animation: "checkmarkPop 0.4s var(--ease-out)",
          }}
        >
          <svg
            style={{
              width: "14px",
              height: "14px",
              stroke: "var(--color-cyan)",
              strokeWidth: 2,
            }}
            viewBox="0 0 24 24"
            fill="none"
          >
            <polyline points="20 6 9 17 4 12"></polyline>
          </svg>
        </div>
      )}

      <div
        style={{
          display: "flex",
          alignItems: "center",
          gap: "var(--space-md)",
          marginBottom: "var(--space-md)",
        }}
      >
        <div
          style={{
            width: "40px",
            height: "40px",
            padding: "10px",
            background: selected
              ? "linear-gradient(135deg, rgba(0, 240, 255, 0.2), rgba(147, 51, 234, 0.2))"
              : "var(--glass-medium)",
            border: "1px solid",
            borderColor: selected
              ? "rgba(0, 240, 255, 0.3)"
              : "var(--glass-border)",
            borderRadius: "var(--radius-md)",
            color: selected ? "var(--color-cyan)" : "var(--text-primary)",
            transition: "all var(--duration-normal)",
          }}
        >
          <svg
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.5"
          >
            {icon}
          </svg>
        </div>

        <div style={{ flex: 1 }}>
          <div
            className="text-md"
            style={{ fontWeight: "400", marginBottom: "2px" }}
          >
            {platform.name}
          </div>
          <div className="text-base" style={{ color: "var(--text-secondary)" }}>
            Limit:{" "}
            <strong style={{ color: "var(--color-cyan)", fontWeight: "500" }}>
              {platform.limit}
            </strong>
          </div>
        </div>
      </div>

      {platform.compression && (
        <div
          style={{
            padding: "var(--space-sm) var(--space-md)",
            background: "var(--glass-medium)",
            border: "1px solid var(--glass-border)",
            borderRadius: "var(--radius-sm)",
            marginBottom: "var(--space-sm)",
          }}
        >
          <div
            className="text-xs"
            style={{
              textTransform: "uppercase",
              letterSpacing: "var(--letter-spacing-wider)",
              color: "var(--text-tertiary)",
              marginBottom: "var(--space-xs)",
            }}
          >
            What we'll do
          </div>
          <div className="text-base" style={{ color: "var(--text-primary)" }}>
            {platform.compression}
          </div>
        </div>
      )}

      {platform.note && (
        <div
          className="text-sm"
          style={{
            color: "var(--text-secondary)",
            paddingTop: "var(--space-sm)",
            borderTop: "1px solid var(--glass-border)",
          }}
        >
          {platform.note}
        </div>
      )}
    </div>
  );
}

// ============================================
// FORMAT CARD COMPONENT
// ============================================
export function FormatCard({ format, selected, onClick }) {
  return (
    <div
      onClick={onClick}
      style={{
        background: selected
          ? "rgba(0, 240, 255, 0.05)"
          : "var(--glass-medium)",
        border: selected
          ? "2px solid var(--color-cyan)"
          : "2px solid var(--glass-border)",
        borderRadius: "var(--radius-lg)",
        padding: "var(--space-lg)",
        transition: "all var(--duration-normal) var(--ease-out)",
        cursor: "pointer",
        backdropFilter: "blur(20px)",
        boxShadow: selected ? "0 0 30px rgba(0, 240, 255, 0.1)" : "none",
      }}
      onMouseEnter={(e) => {
        if (!selected) {
          e.currentTarget.style.transform = "translateY(-2px)";
          e.currentTarget.style.borderColor = "rgba(0, 240, 255, 0.2)";
        }
      }}
      onMouseLeave={(e) => {
        if (!selected) {
          e.currentTarget.style.transform = "translateY(0)";
          e.currentTarget.style.borderColor = "var(--glass-border)";
        }
      }}
    >
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "start",
          marginBottom: "var(--space-md)",
        }}
      >
        <h3
          className="text-xl"
          style={{
            fontWeight: "400",
            color: "var(--text-primary)",
          }}
        >
          {format.name}
        </h3>
        <span
          className="text-sm"
          style={{
            color: "var(--text-secondary)",
            background: "var(--glass-heavy)",
            padding: "6px 10px",
            borderRadius: "var(--radius-sm)",
          }}
        >
          {format.size}
        </span>
      </div>

      <div
        style={{
          display: "grid",
          gridTemplateColumns: "1fr 1fr",
          gap: "var(--space-md)",
          marginBottom: "var(--space-md)",
        }}
      >
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            gap: "var(--space-sm)",
          }}
        >
          <div
            className="text-sm"
            style={{
              textTransform: "uppercase",
              letterSpacing: "var(--letter-spacing-wider)",
              color: "var(--color-green)",
              marginBottom: "var(--space-xs)",
            }}
          >
            Pros
          </div>
          {format.pros.map((pro, index) => (
            <div
              key={index}
              className="text-sm"
              style={{
                display: "flex",
                alignItems: "start",
                gap: "var(--space-xs)",
                lineHeight: "1.4",
              }}
            >
              <span
                style={{
                  color: "var(--color-green)",
                  flexShrink: 0,
                  marginTop: "2px",
                }}
              >
                ✓
              </span>
              <span>{pro}</span>
            </div>
          ))}
        </div>

        <div
          style={{
            display: "flex",
            flexDirection: "column",
            gap: "var(--space-sm)",
          }}
        >
          <div
            className="text-sm"
            style={{
              textTransform: "uppercase",
              letterSpacing: "var(--letter-spacing-wider)",
              color: "var(--color-red)",
              marginBottom: "var(--space-xs)",
            }}
          >
            Cons
          </div>
          {format.cons.map((con, index) => (
            <div
              key={index}
              className="text-sm"
              style={{
                display: "flex",
                alignItems: "start",
                gap: "var(--space-xs)",
                lineHeight: "1.4",
              }}
            >
              <span
                style={{
                  color: "var(--color-red)",
                  flexShrink: 0,
                  marginTop: "2px",
                }}
              >
                ✗
              </span>
              <span>{con}</span>
            </div>
          ))}
        </div>
      </div>

      <div
        className="text-sm"
        style={{
          paddingTop: "var(--space-md)",
          borderTop: "1px solid var(--glass-border)",
          color: "var(--text-secondary)",
        }}
      >
        <strong style={{ color: "var(--color-cyan)", fontWeight: "400" }}>
          Best for:
        </strong>{" "}
        {format.bestFor}
      </div>
    </div>
  );
}

// ============================================
// NAVIGATION BUTTONS COMPONENT
// ============================================
export function NavigationButtons({
  onBack,
  onContinue,
  backDisabled = false,
  continueDisabled = false,
  continueText = "Continue",
}) {
  return (
    <div
      style={{
        display: "flex",
        gap: "var(--space-md)",
        justifyContent: "space-between",
        marginTop: "var(--space-xl)",
        paddingTop: "var(--space-xl)",
        borderTop: "1px solid var(--glass-border)",
      }}
    >
      <button
        className="btn btn-secondary"
        onClick={onBack}
        disabled={backDisabled}
      >
        Back
      </button>
      <button
        className="btn btn-primary"
        onClick={onContinue}
        disabled={continueDisabled}
      >
        {continueText}
      </button>
    </div>
  );
}

// ============================================
// PROCESSING SPINNER COMPONENT
// ============================================
export function ProcessingSpinner({ message = "Processing..." }) {
  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        gap: "var(--space-md)",
        padding: "var(--space-2xl)",
      }}
    >
      <div
        style={{
          width: "48px",
          height: "48px",
          border: "3px solid var(--glass-border)",
          borderTopColor: "var(--color-cyan)",
          borderRightColor: "var(--color-purple)",
          borderRadius: "50%",
        }}
        className="processing-spin"
      />
      <div
        className="text-base"
        style={{
          color: "var(--text-secondary)",
          textAlign: "center",
        }}
      >
        {message}
      </div>
    </div>
  );
}

// ============================================
// SUCCESS SCREEN COMPONENT
// ============================================
export function SuccessScreen({ title = "Success!", message, files = [] }) {
  return (
    <div
      className="success-pop"
      style={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        gap: "var(--space-lg)",
        padding: "var(--space-2xl)",
        textAlign: "center",
      }}
    >
      <div
        style={{
          width: "64px",
          height: "64px",
          background:
            "linear-gradient(135deg, rgba(16, 185, 129, 0.2), rgba(5, 150, 105, 0.2))",
          border: "2px solid var(--color-green)",
          borderRadius: "var(--radius-full)",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <svg
          style={{
            width: "32px",
            height: "32px",
            stroke: "var(--color-green)",
            strokeWidth: 3,
          }}
          viewBox="0 0 24 24"
          fill="none"
        >
          <polyline points="20 6 9 17 4 12"></polyline>
        </svg>
      </div>

      <h2
        className="text-2xl"
        style={{
          fontWeight: "300",
          color: "var(--text-primary)",
        }}
      >
        {title}
      </h2>

      {message && (
        <p
          className="text-base"
          style={{
            color: "var(--text-secondary)",
            maxWidth: "400px",
          }}
        >
          {message}
        </p>
      )}

      {files.length > 0 && (
        <div
          style={{
            background: "var(--glass-medium)",
            border: "1px solid var(--glass-border)",
            borderRadius: "var(--radius-lg)",
            padding: "var(--space-lg)",
            width: "100%",
            maxWidth: "500px",
            backdropFilter: "blur(20px)",
          }}
        >
          <div
            className="text-sm"
            style={{
              textTransform: "uppercase",
              letterSpacing: "var(--letter-spacing-wider)",
              color: "var(--text-tertiary)",
              marginBottom: "var(--space-md)",
            }}
          >
            Ready for download
          </div>
          <FileList files={files} />
        </div>
      )}
    </div>
  );
}

// ============================================
// STEP HEADER COMPONENT
// ============================================
export function StepHeader({ title, subtitle }) {
  return (
    <div
      style={{
        marginBottom: "var(--space-xl)",
        textAlign: "center",
      }}
    >
      <h2
        className="text-2xl"
        style={{
          fontWeight: "300",
          marginBottom: "var(--space-sm)",
          background:
            "linear-gradient(135deg, var(--color-cyan), var(--color-purple))",
          WebkitBackgroundClip: "text",
          WebkitTextFillColor: "transparent",
          letterSpacing: "var(--letter-spacing-wide)",
        }}
      >
        {title}
      </h2>
      {subtitle && (
        <p
          className="text-base"
          style={{
            color: "var(--text-secondary)",
          }}
        >
          {subtitle}
        </p>
      )}
    </div>
  );
}

// ============================================
// REVIEW CARD COMPONENT
// ============================================
export function ReviewCard({ metrics }) {
  return (
    <div
      style={{
        background: "var(--glass-medium)",
        border: "1px solid var(--glass-border)",
        borderRadius: "var(--radius-lg)",
        padding: "var(--space-lg)",
        backdropFilter: "blur(20px)",
      }}
    >
      <h4
        className="text-md"
        style={{
          marginBottom: "var(--space-md)",
          color: "var(--text-primary)",
        }}
      >
        Optimization Summary
      </h4>

      {Object.entries(metrics).map(([key, value], index) => (
        <div
          key={index}
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            padding: "var(--space-sm) 0",
            borderBottom:
              index < Object.keys(metrics).length - 1
                ? "1px solid var(--glass-border)"
                : "none",
          }}
        >
          <span className="text-sm" style={{ color: "var(--text-secondary)" }}>
            {key}
          </span>
          <span
            className="text-base"
            style={{
              fontWeight: "400",
              color: "var(--text-primary)",
              display: "flex",
              alignItems: "center",
              gap: "var(--space-sm)",
            }}
          >
            {value}
          </span>
        </div>
      ))}
    </div>
  );
}

// ============================================
// DOWNLOAD SECTION COMPONENT
// ============================================
export function DownloadSection({ files, onDownload, onDownloadAll }) {
  const [thumbnails, setThumbnails] = useState({});

  useEffect(() => {
    // Load thumbnails for image files
    files.forEach((file, index) => {
      if (file.type && file.type.startsWith("image/")) {
        const reader = new FileReader();
        reader.onload = (e) => {
          setThumbnails((prev) => ({
            ...prev,
            [index]: e.target.result,
          }));
        };
        reader.readAsDataURL(file);
      }
    });
  }, [files]);

  // Calculate total size
  const totalSize = files.reduce((sum, file) => {
    const size =
      file.compressed && file.size
        ? parseFloat(file.size)
        : file.size / (1024 * 1024);
    return sum + size;
  }, 0);

  return (
    <div
      style={{
        background: "var(--glass-light)",
        border: "1px solid var(--glass-border)",
        borderRadius: "var(--radius-lg)",
        padding: "var(--space-lg)",
        backdropFilter: "blur(20px)",
      }}
    >
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          marginBottom: "var(--space-lg)",
        }}
      >
        <div>
          <h3
            className="text-md"
            style={{
              fontWeight: "400",
              marginBottom: "var(--space-xs)",
            }}
          >
            Ready for Download
          </h3>
          <p
            className="text-sm"
            style={{
              color: "var(--text-secondary)",
            }}
          >
            Total size: {totalSize.toFixed(1)} MB
            {files.length > 1 && " • Perfect for a single email"}
          </p>
        </div>
        {files.length > 1 && onDownloadAll && (
          <button
            className="btn btn-primary"
            onClick={onDownloadAll}
            style={{ padding: "10px 20px", minWidth: "auto" }}
          >
            Download All as ZIP
          </button>
        )}
      </div>

      <div
        style={{
          display: "flex",
          flexDirection: "column",
          gap: "var(--space-sm)",
        }}
      >
        {files.map((file, index) => (
          <div
            key={index}
            style={{
              display: "flex",
              alignItems: "center",
              gap: "var(--space-md)",
              padding: "var(--space-md)",
              background: "var(--glass-medium)",
              border: "1px solid var(--glass-border)",
              borderRadius: "var(--radius-md)",
              backdropFilter: "blur(20px)",
            }}
          >
            <div
              style={{
                width: "50px",
                height: "50px",
                background: thumbnails[index]
                  ? "transparent"
                  : "var(--glass-light)",
                border: "1px solid var(--glass-border)",
                borderRadius: "var(--radius-sm)",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                overflow: "hidden",
                flexShrink: 0,
              }}
            >
              {thumbnails[index] ? (
                <img
                  src={thumbnails[index]}
                  alt={file.name}
                  style={{
                    width: "100%",
                    height: "100%",
                    objectFit: "cover",
                  }}
                />
              ) : (
                <svg
                  style={{
                    width: "20px",
                    height: "20px",
                    color: "var(--text-tertiary)",
                  }}
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="1.5"
                >
                  {file.type === "application/pdf" ||
                  file.name?.toLowerCase().endsWith(".pdf") ? (
                    <>
                      <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path>
                      <polyline points="14 2 14 8 20 8"></polyline>
                      <line x1="16" y1="13" x2="8" y2="13"></line>
                      <line x1="16" y1="17" x2="8" y2="17"></line>
                    </>
                  ) : (
                    <>
                      <rect
                        x="3"
                        y="3"
                        width="18"
                        height="18"
                        rx="2"
                        ry="2"
                      ></rect>
                      <circle cx="8.5" cy="8.5" r="1.5"></circle>
                      <polyline points="21 15 16 10 5 21"></polyline>
                    </>
                  )}
                </svg>
              )}
            </div>

            <div style={{ flex: 1 }}>
              <div className="text-base" style={{ marginBottom: "2px" }}>
                {file.name}
              </div>
              <div
                className="text-sm"
                style={{ color: "var(--text-secondary)" }}
              >
                {file.size || "Optimized"}
              </div>
            </div>

            <button
              onClick={() => onDownload(file, index)}
              className="btn btn-ghost"
              style={{
                padding: "10px 20px",
                minWidth: "auto",
              }}
            >
              Download
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}
