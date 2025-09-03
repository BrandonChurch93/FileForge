import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import {
  AnimatedBackground,
  ProgressBar,
  NavigationButtons,
  ProcessingSpinner,
  StepHeader,
  ReviewCard,
} from "../components/SharedComponents";
import { ICON_SIZES } from "../constants";

function IconGenerator() {
  const navigate = useNavigate();

  // State management
  const [currentStep, setCurrentStep] = useState(1);
  const [totalSteps] = useState(4); // Upload, Platform, Review, Success
  const [uploadedFile, setUploadedFile] = useState(null);
  const [previewUrl, setPreviewUrl] = useState(null);
  const [selectedPlatforms, setSelectedPlatforms] = useState([]);
  const [isProcessing, setIsProcessing] = useState(false);
  const [processingProgress, setProcessingProgress] = useState(0);
  const [generatedPackage, setGeneratedPackage] = useState(null);
  const [animatingOut, setAnimatingOut] = useState(false);
  const [animatingIn, setAnimatingIn] = useState(true);
  const [pageLoaded, setPageLoaded] = useState(false);

  // Initial page load animation
  useEffect(() => {
    setTimeout(() => {
      setPageLoaded(true);
      setAnimatingIn(false);
    }, 500);
  }, []);

  // Platform data (simplified per architecture document)
  const platformData = {
    website: {
      name: "Website",
      emoji: "🌐",
      description: "Favicon for browser tabs and bookmarks",
      generates: "All essential web icon sizes",
      files: 6,
      sizes: ["16x16", "32x32", "192x192", "512x512", "apple-touch-icon"],
      formats: ["PNG"],
    },
    ios: {
      name: "iOS App",
      emoji: "📱",
      description: "App icon for iPhone and iPad",
      generates: "App Store required sizes",
      files: 8,
      sizes: ["Various iOS sizes"],
      formats: ["PNG"],
    },
    android: {
      name: "Android App",
      emoji: "🤖",
      description: "App icon for Android devices",
      generates: "Play Store required sizes",
      files: 6,
      sizes: ["Various Android densities"],
      formats: ["PNG"],
    },
  };

  // Auto-advance to next step with animation
  const goToStep = (step, isAutoAdvance = false) => {
    if (isAutoAdvance) {
      setAnimatingOut(true);
      setTimeout(() => {
        setCurrentStep(step);
        setAnimatingOut(false);
        setAnimatingIn(true);
        setTimeout(() => setAnimatingIn(false), 400);
      }, 200);
    } else {
      setAnimatingOut(true);
      setTimeout(() => {
        setCurrentStep(step);
        setAnimatingOut(false);
        setAnimatingIn(true);
        setTimeout(() => setAnimatingIn(false), 500);
      }, 300);
    }
  };

  // Handle file upload
  const handleFileUpload = (e) => {
    const file = e.target.files?.[0] || e.dataTransfer?.files?.[0];
    if (file && file.type.startsWith("image/")) {
      setUploadedFile(file);

      // Create preview
      const reader = new FileReader();
      reader.onload = (event) => {
        setPreviewUrl(event.target.result);
      };
      reader.readAsDataURL(file);
    }
  };

  // Handle drag and drop
  const handleDragOver = (e) => {
    e.preventDefault();
    e.currentTarget.classList.add("drag-over");
  };

  const handleDragLeave = (e) => {
    e.preventDefault();
    e.currentTarget.classList.remove("drag-over");
  };

  const handleDrop = (e) => {
    e.preventDefault();
    e.currentTarget.classList.remove("drag-over");
    handleFileUpload(e);
  };

  // Toggle platform selection
  const togglePlatform = (platform) => {
    setSelectedPlatforms((prev) => {
      if (prev.includes(platform)) {
        return prev.filter((p) => p !== platform);
      } else {
        return [...prev, platform];
      }
    });
  };

  // Calculate package details
  const calculatePackageDetails = () => {
    let totalFiles = 0;
    let formats = new Set();
    let items = [];

    selectedPlatforms.forEach((platform) => {
      const data = platformData[platform];
      totalFiles += data.files;
      data.formats.forEach((f) => formats.add(f));

      items.push({
        type: "header",
        text: `${data.name} Icons`,
      });

      if (platform === "website") {
        items.push({ type: "item", text: "favicon-16x16.png" });
        items.push({ type: "item", text: "favicon-32x32.png" });
        items.push({ type: "item", text: "favicon-192x192.png" });
        items.push({ type: "item", text: "favicon-512x512.png" });
        items.push({ type: "item", text: "apple-touch-icon-180x180.png" });
        items.push({ type: "item", text: "HTML implementation snippet" });
      } else if (platform === "ios") {
        items.push({ type: "item", text: "App Store icon (1024x1024)" });
        items.push({ type: "item", text: "iPhone app icons (all sizes)" });
        items.push({ type: "item", text: "iPad app icons (all sizes)" });
      } else if (platform === "android") {
        items.push({ type: "item", text: "Play Store icon (512x512)" });
        items.push({ type: "item", text: "Launcher icons (all densities)" });
        items.push({ type: "item", text: "Adaptive icon layers" });
      }
    });

    return {
      totalFiles,
      formats: Array.from(formats),
      platformCount: selectedPlatforms.length,
      items,
    };
  };

  // Start processing
  const startProcessing = () => {
    setIsProcessing(true);
    goToStep(4);

    // Simulate processing steps
    const steps = [
      { progress: 25, message: "Analyzing your image..." },
      { progress: 50, message: "Generating icon sizes..." },
      { progress: 75, message: "Optimizing for each platform..." },
      { progress: 100, message: "Creating download package..." },
    ];

    let stepIndex = 0;
    const interval = setInterval(() => {
      if (stepIndex < steps.length) {
        setProcessingProgress(steps[stepIndex].progress);
        stepIndex++;
      } else {
        clearInterval(interval);

        // Simulate generated package
        const details = calculatePackageDetails();
        setGeneratedPackage({
          files: details.totalFiles,
          size: `${((details.totalFiles * 50) / 1024).toFixed(1)} MB`,
          platforms: selectedPlatforms,
        });
        setIsProcessing(false);
      }
    }, 1000);
  };

  // Get step name for progress bar
  const getStepName = () => {
    const stepNames = {
      1: "Upload Icon",
      2: "Select Platforms",
      3: "Review Package",
      4: isProcessing ? "Processing" : "Complete!",
    };
    return stepNames[currentStep] || "";
  };

  return (
    <>
      <AnimatedBackground />

      <div
        style={{
          minHeight: "100vh",
          padding: "var(--space-xl)",
          maxWidth: "1200px",
          margin: "0 auto",
          position: "relative",
          zIndex: 1,
        }}
      >
        {/* Progress Bar */}
        <ProgressBar
          currentStep={currentStep}
          totalSteps={totalSteps}
          stepName={getStepName()}
        />

        {/* Step Container with animations */}
        <div
          className={`step-container ${animatingOut ? "slide-out" : ""} ${
            animatingIn ? "slide-in" : ""
          }`}
          style={{
            opacity: pageLoaded ? (animatingOut ? 0 : 1) : 0,
            transform: pageLoaded
              ? animatingOut
                ? "translateX(-30px)"
                : animatingIn
                ? "translateX(30px)"
                : "translateX(0)"
              : "translateX(30px)",
            transition:
              "opacity 0.3s var(--ease-out), transform 0.3s var(--ease-out)",
          }}
        >
          {/* Step 1: Upload Source Image */}
          {currentStep === 1 && (
            <>
              <StepHeader
                title="Upload your icon source"
                subtitle="Square images work best • Minimum 512×512px recommended"
              />

              <div
                style={{
                  width: "100%",
                  maxWidth: "400px",
                  margin: "0 auto",
                  aspectRatio: "1",
                  border: uploadedFile
                    ? "2px solid var(--color-cyan)"
                    : "2px dashed var(--glass-border)",
                  borderRadius: "var(--radius-lg)",
                  padding: "var(--space-2xl)",
                  background: uploadedFile
                    ? "rgba(0, 240, 255, 0.05)"
                    : "var(--glass-light)",
                  transition: "all var(--duration-normal) var(--ease-out)",
                  cursor: "pointer",
                  position: "relative",
                  overflow: "hidden",
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "center",
                  justifyContent: "center",
                }}
                onClick={() => document.getElementById("fileInput").click()}
                onDragOver={handleDragOver}
                onDragLeave={handleDragLeave}
                onDrop={handleDrop}
              >
                {!uploadedFile ? (
                  <div style={{ textAlign: "center" }}>
                    <svg
                      style={{
                        width: "64px",
                        height: "64px",
                        margin: "0 auto var(--space-md)",
                        color: "var(--color-cyan)",
                      }}
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="1.5"
                    >
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
                    </svg>
                    <div
                      className="text-lg"
                      style={{ marginBottom: "var(--space-sm)" }}
                    >
                      Drop your icon here or click to browse
                    </div>
                    <div
                      className="text-sm"
                      style={{
                        color: "var(--text-secondary)",
                        marginBottom: "var(--space-md)",
                      }}
                    >
                      We'll handle the resizing and formatting
                    </div>
                    <div
                      style={{
                        display: "flex",
                        gap: "var(--space-sm)",
                        justifyContent: "center",
                        flexWrap: "wrap",
                      }}
                    >
                      <span
                        style={{
                          background: "var(--glass-heavy)",
                          border: "1px solid var(--glass-border)",
                          padding: "4px 8px",
                          borderRadius: "var(--radius-sm)",
                          fontSize: "12px",
                          textTransform: "uppercase",
                        }}
                      >
                        PNG
                      </span>
                      <span
                        style={{
                          background: "var(--glass-heavy)",
                          border: "1px solid var(--glass-border)",
                          padding: "4px 8px",
                          borderRadius: "var(--radius-sm)",
                          fontSize: "12px",
                          textTransform: "uppercase",
                        }}
                      >
                        JPG
                      </span>
                      <span
                        style={{
                          background: "var(--glass-heavy)",
                          border: "1px solid var(--glass-border)",
                          padding: "4px 8px",
                          borderRadius: "var(--radius-sm)",
                          fontSize: "12px",
                          textTransform: "uppercase",
                        }}
                      >
                        SVG
                      </span>
                    </div>
                  </div>
                ) : (
                  <div
                    style={{
                      width: "100%",
                      height: "100%",
                      position: "relative",
                    }}
                  >
                    <img
                      src={previewUrl}
                      alt="Icon preview"
                      style={{
                        width: "100%",
                        height: "100%",
                        objectFit: "contain",
                        borderRadius: "var(--radius-md)",
                      }}
                    />
                    <div
                      style={{
                        position: "absolute",
                        bottom: 0,
                        left: 0,
                        right: 0,
                        background:
                          "linear-gradient(to top, rgba(0, 0, 0, 0.8), transparent)",
                        padding: "var(--space-md)",
                        display: "flex",
                        justifyContent: "space-between",
                        alignItems: "center",
                      }}
                    >
                      <span className="text-sm">{uploadedFile.name}</span>
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          document.getElementById("fileInput").click();
                        }}
                        style={{
                          padding: "4px 8px",
                          background: "var(--glass-heavy)",
                          border: "1px solid var(--glass-border)",
                          borderRadius: "var(--radius-sm)",
                          color: "var(--color-cyan)",
                          cursor: "pointer",
                          fontSize: "12px",
                        }}
                      >
                        Change
                      </button>
                    </div>
                  </div>
                )}
                <input
                  id="fileInput"
                  type="file"
                  accept="image/*"
                  style={{ display: "none" }}
                  onChange={(e) => handleFileUpload(e)}
                />
              </div>

              <div
                style={{ marginTop: "var(--space-lg)", textAlign: "center" }}
              >
                <p
                  className="text-sm"
                  style={{ color: "var(--text-secondary)" }}
                >
                  💡 Higher resolution = better quality at all sizes
                </p>
              </div>

              <NavigationButtons
                onBack={() => {
                  setAnimatingOut(true);
                  setTimeout(() => navigate("/"), 300);
                }}
                onContinue={() => goToStep(2)}
                continueDisabled={!uploadedFile}
              />
            </>
          )}

          {/* Step 2: Platform Selection */}
          {currentStep === 2 && (
            <>
              <StepHeader
                title="Where will you use this icon?"
                subtitle="Select all that apply"
              />

              <div
                style={{
                  display: "grid",
                  gridTemplateColumns: "repeat(auto-fit, minmax(300px, 1fr))",
                  gap: "var(--space-md)",
                  marginBottom: "var(--space-xl)",
                }}
              >
                {Object.entries(platformData).map(([key, platform]) => (
                  <div
                    key={key}
                    onClick={() => togglePlatform(key)}
                    style={{
                      background: selectedPlatforms.includes(key)
                        ? "rgba(0, 240, 255, 0.05)"
                        : "var(--glass-medium)",
                      border: selectedPlatforms.includes(key)
                        ? "2px solid var(--color-cyan)"
                        : "2px solid var(--glass-border)",
                      borderRadius: "var(--radius-lg)",
                      padding: "var(--space-lg)",
                      cursor: "pointer",
                      transition: "all var(--duration-normal)",
                      position: "relative",
                    }}
                    onMouseEnter={(e) => {
                      if (!selectedPlatforms.includes(key)) {
                        e.currentTarget.style.transform = "translateY(-2px)";
                        e.currentTarget.style.borderColor =
                          "rgba(0, 240, 255, 0.2)";
                      }
                    }}
                    onMouseLeave={(e) => {
                      if (!selectedPlatforms.includes(key)) {
                        e.currentTarget.style.transform = "translateY(0)";
                        e.currentTarget.style.borderColor =
                          "var(--glass-border)";
                      }
                    }}
                  >
                    {selectedPlatforms.includes(key) && (
                      <div
                        style={{
                          position: "absolute",
                          top: "var(--space-md)",
                          right: "var(--space-md)",
                          width: "24px",
                          height: "24px",
                          background: "var(--color-cyan)",
                          borderRadius: "var(--radius-sm)",
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "center",
                        }}
                      >
                        <svg
                          style={{
                            width: "14px",
                            height: "14px",
                            stroke: "var(--color-bg-dark)",
                            strokeWidth: 3,
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
                      <span style={{ fontSize: "32px" }}>{platform.emoji}</span>
                      <h3 className="text-lg" style={{ fontWeight: "400" }}>
                        {platform.name}
                      </h3>
                    </div>
                    <p
                      className="text-sm"
                      style={{
                        color: "var(--text-secondary)",
                        marginBottom: "var(--space-sm)",
                      }}
                    >
                      {platform.description}
                    </p>
                    <p
                      className="text-xs"
                      style={{ color: "var(--color-cyan)" }}
                    >
                      {platform.generates}
                    </p>
                  </div>
                ))}
              </div>

              <div
                style={{
                  padding: "var(--space-md)",
                  background: "var(--glass-light)",
                  borderRadius: "var(--radius-md)",
                  marginBottom: "var(--space-md)",
                  textAlign: "center",
                }}
              >
                <span
                  className="text-base"
                  style={{ color: "var(--text-secondary)" }}
                >
                  Selected:{" "}
                  <strong style={{ color: "var(--color-cyan)" }}>
                    {selectedPlatforms.length === 0
                      ? "0 platforms"
                      : selectedPlatforms.length === 1
                      ? "1 platform"
                      : `${selectedPlatforms.length} platforms`}
                  </strong>
                </span>
              </div>

              <NavigationButtons
                onBack={() => goToStep(1)}
                onContinue={() => goToStep(3)}
                continueDisabled={selectedPlatforms.length === 0}
              />
            </>
          )}

          {/* Step 3: Review Package */}
          {currentStep === 3 && !isProcessing && (
            <>
              <StepHeader
                title="Your icon package includes"
                subtitle={`${
                  calculatePackageDetails().totalFiles
                } optimized files for all platforms`}
              />

              <div
                style={{
                  background: "var(--glass-medium)",
                  border: "1px solid var(--glass-border)",
                  borderRadius: "var(--radius-lg)",
                  padding: "var(--space-lg)",
                  marginBottom: "var(--space-xl)",
                }}
              >
                <div
                  className="text-sm"
                  style={{
                    textTransform: "uppercase",
                    letterSpacing: "2px",
                    color: "var(--color-cyan)",
                    marginBottom: "var(--space-md)",
                    paddingBottom: "var(--space-md)",
                    borderBottom: "1px solid var(--glass-border)",
                  }}
                >
                  Package Details
                </div>

                <div
                  style={{
                    display: "grid",
                    gridTemplateColumns: "repeat(auto-fit, minmax(150px, 1fr))",
                    gap: "var(--space-md)",
                    marginBottom: "var(--space-lg)",
                  }}
                >
                  <div
                    style={{
                      textAlign: "center",
                      padding: "var(--space-md)",
                      background: "var(--glass-light)",
                      borderRadius: "var(--radius-md)",
                    }}
                  >
                    <div
                      className="text-2xl"
                      style={{
                        color: "var(--color-cyan)",
                        fontWeight: "400",
                        marginBottom: "4px",
                      }}
                    >
                      {calculatePackageDetails().totalFiles}
                    </div>
                    <div
                      className="text-xs"
                      style={{
                        color: "var(--text-secondary)",
                        textTransform: "uppercase",
                        letterSpacing: "1px",
                      }}
                    >
                      Total Files
                    </div>
                  </div>
                  <div
                    style={{
                      textAlign: "center",
                      padding: "var(--space-md)",
                      background: "var(--glass-light)",
                      borderRadius: "var(--radius-md)",
                    }}
                  >
                    <div
                      className="text-2xl"
                      style={{
                        color: "var(--color-cyan)",
                        fontWeight: "400",
                        marginBottom: "4px",
                      }}
                    >
                      {calculatePackageDetails().formats.length}
                    </div>
                    <div
                      className="text-xs"
                      style={{
                        color: "var(--text-secondary)",
                        textTransform: "uppercase",
                        letterSpacing: "1px",
                      }}
                    >
                      Formats
                    </div>
                  </div>
                  <div
                    style={{
                      textAlign: "center",
                      padding: "var(--space-md)",
                      background: "var(--glass-light)",
                      borderRadius: "var(--radius-md)",
                    }}
                  >
                    <div
                      className="text-2xl"
                      style={{
                        color: "var(--color-cyan)",
                        fontWeight: "400",
                        marginBottom: "4px",
                      }}
                    >
                      {calculatePackageDetails().platformCount}
                    </div>
                    <div
                      className="text-xs"
                      style={{
                        color: "var(--text-secondary)",
                        textTransform: "uppercase",
                        letterSpacing: "1px",
                      }}
                    >
                      Platforms
                    </div>
                  </div>
                </div>

                <div style={{ marginTop: "var(--space-lg)" }}>
                  <div
                    className="text-sm"
                    style={{
                      textTransform: "uppercase",
                      letterSpacing: "2px",
                      color: "var(--text-secondary)",
                      marginBottom: "var(--space-md)",
                    }}
                  >
                    Included Items
                  </div>
                  <div
                    style={{
                      display: "flex",
                      flexDirection: "column",
                      gap: "var(--space-sm)",
                    }}
                  >
                    {calculatePackageDetails().items.map((item, index) =>
                      item.type === "header" ? (
                        <div
                          key={index}
                          className="text-xs"
                          style={{
                            textTransform: "uppercase",
                            color: "var(--color-cyan)",
                            marginTop: index > 0 ? "var(--space-md)" : 0,
                            marginBottom: "var(--space-xs)",
                          }}
                        >
                          {item.text}
                        </div>
                      ) : (
                        <div
                          key={index}
                          style={{
                            display: "flex",
                            alignItems: "center",
                            gap: "var(--space-sm)",
                            padding: "var(--space-sm)",
                            background: "var(--glass-light)",
                            borderRadius: "var(--radius-sm)",
                          }}
                        >
                          <svg
                            style={{
                              width: "16px",
                              height: "16px",
                              color: "var(--color-green)",
                            }}
                            viewBox="0 0 24 24"
                            fill="none"
                            stroke="currentColor"
                            strokeWidth="1.5"
                          >
                            <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path>
                            <polyline points="22 4 12 14.01 9 11.01"></polyline>
                          </svg>
                          <span className="text-sm">{item.text}</span>
                        </div>
                      )
                    )}
                  </div>
                </div>
              </div>

              <div
                style={{
                  padding: "var(--space-md)",
                  background: "var(--glass-light)",
                  borderRadius: "var(--radius-md)",
                  textAlign: "center",
                  marginBottom: "var(--space-xl)",
                }}
              >
                <p
                  className="text-sm"
                  style={{ color: "var(--text-secondary)" }}
                >
                  📦 All files will be delivered in a ZIP file with
                  implementation guide
                </p>
              </div>

              <NavigationButtons
                onBack={() => goToStep(2)}
                onContinue={startProcessing}
                continueText="Generate Icons"
              />
            </>
          )}

          {/* Step 4: Processing */}
          {currentStep === 4 && isProcessing && (
            <div style={{ textAlign: "center", padding: "var(--space-3xl)" }}>
              <ProcessingSpinner
                message={
                  processingProgress < 50
                    ? "Analyzing your image..."
                    : processingProgress < 75
                    ? "Generating icon sizes..."
                    : "Creating download package..."
                }
              />
              <div
                style={{
                  maxWidth: "300px",
                  margin: "0 auto",
                  marginTop: "var(--space-lg)",
                }}
              >
                <div
                  style={{
                    height: "4px",
                    background: "var(--glass-light)",
                    borderRadius: "var(--radius-full)",
                    overflow: "hidden",
                    marginBottom: "var(--space-sm)",
                  }}
                >
                  <div
                    style={{
                      height: "100%",
                      background:
                        "linear-gradient(90deg, var(--color-cyan), var(--color-purple))",
                      transition: "width var(--duration-slow)",
                      width: `${processingProgress}%`,
                    }}
                  />
                </div>
                <div
                  className="text-sm"
                  style={{ color: "var(--text-tertiary)" }}
                >
                  {processingProgress}%
                </div>
              </div>
            </div>
          )}

          {/* Step 5: Success */}
          {currentStep === 4 && !isProcessing && generatedPackage && (
            <div style={{ textAlign: "center", padding: "var(--space-2xl)" }}>
              <div
                style={{
                  width: "64px",
                  height: "64px",
                  margin: "0 auto var(--space-lg)",
                  background:
                    "linear-gradient(135deg, rgba(16, 185, 129, 0.2), rgba(5, 150, 105, 0.2))",
                  border: "2px solid var(--color-green)",
                  borderRadius: "var(--radius-full)",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  animation: "successPop 0.5s var(--ease-out)",
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
                  marginBottom: "var(--space-md)",
                }}
              >
                Your icon package is ready!
              </h2>

              <p
                className="text-base"
                style={{
                  color: "var(--text-secondary)",
                  marginBottom: "var(--space-xl)",
                }}
              >
                All sizes and formats have been generated
              </p>

              <div
                style={{
                  background: "var(--glass-medium)",
                  border: "1px solid var(--glass-border)",
                  borderRadius: "var(--radius-lg)",
                  padding: "var(--space-lg)",
                  maxWidth: "500px",
                  margin: "0 auto var(--space-xl)",
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
                  Package contents
                </div>

                <div
                  style={{
                    display: "flex",
                    flexDirection: "column",
                    gap: "var(--space-sm)",
                  }}
                >
                  <div
                    style={{
                      display: "flex",
                      justifyContent: "space-between",
                      padding: "var(--space-sm) 0",
                      borderBottom: "1px solid var(--glass-border)",
                    }}
                  >
                    <span
                      className="text-sm"
                      style={{ color: "var(--text-secondary)" }}
                    >
                      Files generated:
                    </span>
                    <span className="text-base">
                      {generatedPackage.files} icons
                    </span>
                  </div>
                  <div
                    style={{
                      display: "flex",
                      justifyContent: "space-between",
                      padding: "var(--space-sm) 0",
                      borderBottom: "1px solid var(--glass-border)",
                    }}
                  >
                    <span
                      className="text-sm"
                      style={{ color: "var(--text-secondary)" }}
                    >
                      Package size:
                    </span>
                    <span className="text-base">{generatedPackage.size}</span>
                  </div>
                  <div
                    style={{
                      display: "flex",
                      justifyContent: "space-between",
                      padding: "var(--space-sm) 0",
                    }}
                  >
                    <span
                      className="text-sm"
                      style={{ color: "var(--text-secondary)" }}
                    >
                      Includes:
                    </span>
                    <span className="text-base">Implementation guide</span>
                  </div>
                </div>
              </div>

              {selectedPlatforms.includes("website") && (
                <div
                  style={{
                    background: "var(--glass-light)",
                    border: "1px solid var(--glass-border)",
                    borderRadius: "var(--radius-lg)",
                    padding: "var(--space-lg)",
                    maxWidth: "600px",
                    margin: "0 auto var(--space-xl)",
                  }}
                >
                  <h3
                    className="text-md"
                    style={{ marginBottom: "var(--space-md)" }}
                  >
                    HTML Implementation
                  </h3>
                  <pre
                    style={{
                      background: "var(--glass-medium)",
                      border: "1px solid var(--glass-border)",
                      borderRadius: "var(--radius-md)",
                      padding: "var(--space-md)",
                      fontSize: "12px",
                      textAlign: "left",
                      overflow: "auto",
                      color: "var(--color-cyan)",
                    }}
                  >
                    {`<link rel="icon" type="image/png" sizes="32x32" href="/favicon-32x32.png">
<link rel="icon" type="image/png" sizes="16x16" href="/favicon-16x16.png">
<link rel="apple-touch-icon" sizes="180x180" href="/apple-touch-icon.png">`}
                  </pre>
                </div>
              )}

              <button
                className="btn btn-primary"
                style={{
                  width: "100%",
                  maxWidth: "300px",
                  margin: "0 auto var(--space-xl)",
                }}
              >
                Download Icon Package
              </button>

              <div
                style={{
                  display: "flex",
                  justifyContent: "center",
                  gap: "var(--space-md)",
                }}
              >
                <button
                  className="btn btn-secondary"
                  onClick={() => {
                    // Reset for another icon generation
                    setUploadedFile(null);
                    setPreviewUrl(null);
                    setSelectedPlatforms([]);
                    setGeneratedPackage(null);
                    setCurrentStep(1);
                  }}
                >
                  Generate Another Icon Set
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </>
  );
}

export default IconGenerator;
