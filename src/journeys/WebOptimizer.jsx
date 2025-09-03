import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import {
  AnimatedBackground,
  ProgressBar,
  FileUpload,
  FileList,
  NavigationButtons,
  ProcessingSpinner,
  StepHeader,
  ReviewCard,
  DownloadSection,
} from "../components/SharedComponents";
import { FILE_LIMITS, COMPRESSION_QUALITY } from "../constants";

function WebOptimizer() {
  const navigate = useNavigate();

  // State management
  const [currentStep, setCurrentStep] = useState(1);
  const [totalSteps, setTotalSteps] = useState(5); // Base steps
  const [uploadedFiles, setUploadedFiles] = useState([]);
  const [samePage, setSamePage] = useState(null);
  const [selectedPriority, setSelectedPriority] = useState(null);
  const [selectedFormat, setSelectedFormat] = useState(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [processingProgress, setProcessingProgress] = useState(0);
  const [processedFiles, setProcessedFiles] = useState([]);
  const [animatingOut, setAnimatingOut] = useState(false);
  const [animatingIn, setAnimatingIn] = useState(true);
  const [pageLoaded, setPageLoaded] = useState(false);

  // Conditional step
  const [hasSamePageStep, setHasSamePageStep] = useState(false);

  // Initial page load animation
  useEffect(() => {
    setTimeout(() => {
      setPageLoaded(true);
      setAnimatingIn(false);
    }, 500);
  }, []);

  // Update total steps based on file count
  useEffect(() => {
    if (uploadedFiles.length > 1) {
      setTotalSteps(6); // Add same-page question step
      setHasSamePageStep(true);
    } else {
      setTotalSteps(5); // Skip same-page question
      setHasSamePageStep(false);
    }
  }, [uploadedFiles]);

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
  const handleFilesSelected = (files) => {
    setUploadedFiles((prev) => [...prev, ...files]);
  };

  // Remove file
  const handleRemoveFile = (index) => {
    setUploadedFiles((prev) => prev.filter((_, i) => i !== index));
  };

  // Check if we need same-page step
  const checkForSamePageStep = () => {
    if (uploadedFiles.length > 1) {
      goToStep(2);
    } else {
      // Skip to priority selection
      goToStep(3);
    }
  };

  // Handle same page selection
  const handleSamePageSelect = (isSamePage) => {
    setSamePage(isSamePage);
    // Auto-advance
    setTimeout(() => {
      goToStep(3, true);
    }, 400);
  };

  // Handle priority selection
  const handlePrioritySelect = (priority) => {
    setSelectedPriority(priority);
    // Auto-advance
    setTimeout(() => {
      goToStep(4, true);
    }, 400);
  };

  // Handle format selection
  const handleFormatSelect = (format) => {
    setSelectedFormat(format);
    // Auto-advance
    setTimeout(() => {
      goToStep(5, true);
    }, 400);
  };

  // Start processing
  const startProcessing = () => {
    setIsProcessing(true);
    goToStep(6);

    // Simulate processing
    const steps = [
      { progress: 25, message: "Analyzing your images..." },
      { progress: 50, message: "Optimizing for web performance..." },
      { progress: 75, message: "Applying compression..." },
      { progress: 100, message: "Complete!" },
    ];

    let stepIndex = 0;
    const interval = setInterval(() => {
      if (stepIndex < steps.length) {
        setProcessingProgress(steps[stepIndex].progress);
        stepIndex++;
      } else {
        clearInterval(interval);
        // Simulate processed files
        const processed = uploadedFiles.map((file) => {
          const reduction =
            selectedPriority === "speed"
              ? 0.85
              : selectedPriority === "quality"
              ? 0.45
              : 0.75;

          return {
            name: file.name,
            type: file.type,
            originalSize: file.size,
            size: `${((file.size * (1 - reduction)) / 1024 / 1024).toFixed(
              1
            )}MB`,
            reduction: `${Math.round(reduction * 100)}%`,
          };
        });
        setProcessedFiles(processed);
        setIsProcessing(false);
      }
    }, 1000);
  };

  // Get step name for progress bar
  const getStepName = () => {
    const stepMap = {
      1: "Upload Images",
      2: "Page Configuration",
      3: hasSamePageStep ? "Page Configuration" : "Optimization Priority",
      4: hasSamePageStep ? "Optimization Priority" : "Format Selection",
      5: hasSamePageStep ? "Format Selection" : "Review Metrics",
      6: "Review Metrics",
    };

    if (currentStep === totalSteps && isProcessing) {
      return "Processing";
    } else if (currentStep === totalSteps && !isProcessing) {
      return "Complete!";
    }

    return stepMap[currentStep] || "";
  };

  // Calculate metrics
  const calculateMetrics = () => {
    const totalSize = uploadedFiles.reduce((sum, file) => sum + file.size, 0);

    const reduction =
      selectedPriority === "speed"
        ? 0.85
        : selectedPriority === "quality"
        ? 0.45
        : 0.75;

    const newSize = totalSize * (1 - reduction);
    const loadTime = newSize > 2000000 ? "~3 seconds" : "~2 seconds";

    return {
      "Page weight": `${(totalSize / 1024 / 1024).toFixed(1)}MB → ${(
        newSize /
        1024 /
        1024
      ).toFixed(1)}MB`,
      "Load time": `~8s → ${loadTime}`,
      "Core Web Vitals": "PASS",
      Compression: `${Math.round(reduction * 100)}% reduction`,
      Format:
        selectedFormat === "webp"
          ? "WebP (modern)"
          : selectedFormat === "smart"
          ? "Smart optimization"
          : "Original formats",
    };
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
          currentStep={
            currentStep === totalSteps && !isProcessing
              ? totalSteps
              : currentStep === totalSteps && isProcessing
              ? totalSteps - 1
              : currentStep
          }
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
          {/* Step 1: Upload Images */}
          {currentStep === 1 && (
            <>
              <StepHeader
                title="Upload your website images"
                subtitle="We'll optimize them for maximum performance"
              />

              {uploadedFiles.length === 0 ? (
                <FileUpload
                  onFilesSelected={handleFilesSelected}
                  maxFiles={50}
                  accept="image/*"
                  multiple={true}
                />
              ) : (
                <>
                  <FileList files={uploadedFiles} onRemove={handleRemoveFile} />

                  <div
                    className="text-base"
                    style={{
                      textAlign: "center",
                      padding: "var(--space-md)",
                      background: "var(--glass-light)",
                      borderRadius: "var(--radius-md)",
                      marginTop: "var(--space-md)",
                      marginBottom: "var(--space-md)",
                      border: "1px solid var(--glass-border)",
                    }}
                  >
                    Total: {uploadedFiles.length} images •{" "}
                    {(
                      uploadedFiles.reduce((sum, f) => sum + f.size, 0) /
                      1024 /
                      1024
                    ).toFixed(1)}{" "}
                    MB
                  </div>

                  <button
                    onClick={() =>
                      document.getElementById("hiddenFileInput").click()
                    }
                    className="text-sm"
                    style={{
                      width: "100%",
                      padding: "var(--space-md)",
                      background: "transparent",
                      border: "2px dashed var(--glass-border)",
                      borderRadius: "var(--radius-md)",
                      color: "var(--text-secondary)",
                      cursor: "pointer",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      gap: "var(--space-sm)",
                      transition: "all var(--duration-normal)",
                    }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.borderColor =
                        "rgba(0, 240, 255, 0.3)";
                      e.currentTarget.style.background = "var(--glass-light)";
                      e.currentTarget.style.color = "var(--color-cyan)";
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.borderColor = "var(--glass-border)";
                      e.currentTarget.style.background = "transparent";
                      e.currentTarget.style.color = "var(--text-secondary)";
                    }}
                  >
                    <svg
                      style={{ width: "16px", height: "16px" }}
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                    >
                      <line x1="12" y1="5" x2="12" y2="19"></line>
                      <line x1="5" y1="12" x2="19" y2="12"></line>
                    </svg>
                    Add more images
                  </button>
                  <input
                    id="hiddenFileInput"
                    type="file"
                    multiple
                    accept="image/*"
                    style={{ display: "none" }}
                    onChange={(e) =>
                      handleFilesSelected(Array.from(e.target.files))
                    }
                  />
                </>
              )}

              <NavigationButtons
                onBack={() => {
                  setAnimatingOut(true);
                  setTimeout(() => navigate("/"), 300);
                }}
                onContinue={checkForSamePageStep}
                continueDisabled={uploadedFiles.length === 0}
              />
            </>
          )}

          {/* Step 2: Same Page Question (CONDITIONAL) */}
          {currentStep === 2 && hasSamePageStep && (
            <>
              <StepHeader
                title="Will these images load on the same page?"
                subtitle="This helps us optimize total page weight"
              />

              <div
                style={{
                  display: "flex",
                  flexDirection: "column",
                  gap: "var(--space-md)",
                  marginBottom: "var(--space-xl)",
                }}
              >
                <div
                  onClick={() => handleSamePageSelect(true)}
                  style={{
                    background:
                      samePage === true
                        ? "rgba(0, 240, 255, 0.05)"
                        : "var(--glass-light)",
                    border:
                      samePage === true
                        ? "2px solid var(--color-cyan)"
                        : "2px solid var(--glass-border)",
                    borderRadius: "var(--radius-lg)",
                    padding: "var(--space-lg)",
                    cursor: "pointer",
                    transition: "all var(--duration-normal)",
                    position: "relative",
                  }}
                  onMouseEnter={(e) => {
                    if (samePage !== true) {
                      e.currentTarget.style.borderColor =
                        "rgba(0, 240, 255, 0.2)";
                      e.currentTarget.style.background = "var(--glass-medium)";
                    }
                  }}
                  onMouseLeave={(e) => {
                    if (samePage !== true) {
                      e.currentTarget.style.borderColor = "var(--glass-border)";
                      e.currentTarget.style.background = "var(--glass-light)";
                    }
                  }}
                >
                  <div
                    style={{
                      display: "flex",
                      alignItems: "center",
                      gap: "var(--space-lg)",
                    }}
                  >
                    <div
                      style={{
                        width: "20px",
                        height: "20px",
                        border: "2px solid",
                        borderColor:
                          samePage === true
                            ? "var(--color-cyan)"
                            : "var(--glass-border)",
                        borderRadius: "var(--radius-full)",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        transition: "all var(--duration-normal)",
                      }}
                    >
                      {samePage === true && (
                        <div
                          style={{
                            width: "10px",
                            height: "10px",
                            background: "var(--color-cyan)",
                            borderRadius: "var(--radius-full)",
                          }}
                        />
                      )}
                    </div>
                    <div>
                      <div
                        className="text-md"
                        style={{ marginBottom: "var(--space-xs)" }}
                      >
                        Yes, same page
                      </div>
                      <div
                        className="text-sm"
                        style={{ color: "var(--text-secondary)" }}
                      >
                        We'll ensure total load time stays under 3 seconds
                      </div>
                    </div>
                  </div>
                </div>

                <div
                  onClick={() => handleSamePageSelect(false)}
                  style={{
                    background:
                      samePage === false
                        ? "rgba(0, 240, 255, 0.05)"
                        : "var(--glass-light)",
                    border:
                      samePage === false
                        ? "2px solid var(--color-cyan)"
                        : "2px solid var(--glass-border)",
                    borderRadius: "var(--radius-lg)",
                    padding: "var(--space-lg)",
                    cursor: "pointer",
                    transition: "all var(--duration-normal)",
                    position: "relative",
                  }}
                  onMouseEnter={(e) => {
                    if (samePage !== false) {
                      e.currentTarget.style.borderColor =
                        "rgba(0, 240, 255, 0.2)";
                      e.currentTarget.style.background = "var(--glass-medium)";
                    }
                  }}
                  onMouseLeave={(e) => {
                    if (samePage !== false) {
                      e.currentTarget.style.borderColor = "var(--glass-border)";
                      e.currentTarget.style.background = "var(--glass-light)";
                    }
                  }}
                >
                  <div
                    style={{
                      display: "flex",
                      alignItems: "center",
                      gap: "var(--space-lg)",
                    }}
                  >
                    <div
                      style={{
                        width: "20px",
                        height: "20px",
                        border: "2px solid",
                        borderColor:
                          samePage === false
                            ? "var(--color-cyan)"
                            : "var(--glass-border)",
                        borderRadius: "var(--radius-full)",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        transition: "all var(--duration-normal)",
                      }}
                    >
                      {samePage === false && (
                        <div
                          style={{
                            width: "10px",
                            height: "10px",
                            background: "var(--color-cyan)",
                            borderRadius: "var(--radius-full)",
                          }}
                        />
                      )}
                    </div>
                    <div>
                      <div
                        className="text-md"
                        style={{ marginBottom: "var(--space-xs)" }}
                      >
                        No, different pages
                      </div>
                      <div
                        className="text-sm"
                        style={{ color: "var(--text-secondary)" }}
                      >
                        Each image optimized individually for best quality
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              <NavigationButtons
                onBack={() => goToStep(1)}
                onContinue={() => goToStep(3)}
                continueDisabled={samePage === null}
              />
            </>
          )}

          {/* Step 3: Priority Selection */}
          {currentStep === 3 && (
            <>
              <StepHeader
                title="What's your optimization priority?"
                subtitle="Choose based on your website's needs"
              />

              <div
                style={{
                  display: "grid",
                  gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))",
                  gap: "var(--space-md)",
                  marginBottom: "var(--space-xl)",
                }}
              >
                {/* Speed Priority */}
                <div
                  onClick={() => handlePrioritySelect("speed")}
                  style={{
                    padding: "var(--space-lg)",
                    background:
                      selectedPriority === "speed"
                        ? "rgba(0, 240, 255, 0.05)"
                        : "var(--glass-medium)",
                    border:
                      selectedPriority === "speed"
                        ? "2px solid var(--color-cyan)"
                        : "2px solid var(--glass-border)",
                    borderRadius: "var(--radius-lg)",
                    cursor: "pointer",
                    transition: "all var(--duration-normal)",
                    position: "relative",
                  }}
                  onMouseEnter={(e) => {
                    if (selectedPriority !== "speed") {
                      e.currentTarget.style.transform = "translateY(-4px)";
                      e.currentTarget.style.borderColor =
                        "rgba(0, 240, 255, 0.3)";
                    }
                  }}
                  onMouseLeave={(e) => {
                    if (selectedPriority !== "speed") {
                      e.currentTarget.style.transform = "translateY(0)";
                      e.currentTarget.style.borderColor = "var(--glass-border)";
                    }
                  }}
                >
                  <div
                    style={{
                      display: "flex",
                      alignItems: "center",
                      gap: "var(--space-sm)",
                      marginBottom: "var(--space-md)",
                    }}
                  >
                    <span style={{ fontSize: "24px" }}>⚡</span>
                    <h3 className="text-lg" style={{ fontWeight: "400" }}>
                      Load Time Priority
                    </h3>
                  </div>
                  <div
                    className="text-sm"
                    style={{
                      color: "var(--color-cyan)",
                      marginBottom: "var(--space-sm)",
                    }}
                  >
                    Target: Under 2.5s LCP
                  </div>
                  <div
                    className="text-sm"
                    style={{
                      color: "var(--text-secondary)",
                      marginBottom: "var(--space-md)",
                    }}
                  >
                    Aggressive compression
                  </div>
                  <div
                    style={{
                      paddingTop: "var(--space-md)",
                      borderTop: "1px solid var(--glass-border)",
                    }}
                  >
                    <div
                      className="text-xs"
                      style={{ color: "var(--color-green)" }}
                    >
                      Best for: News sites, blogs
                    </div>
                  </div>
                </div>

                {/* Balanced Priority */}
                <div
                  onClick={() => handlePrioritySelect("balanced")}
                  style={{
                    padding: "var(--space-lg)",
                    background:
                      selectedPriority === "balanced"
                        ? "rgba(0, 240, 255, 0.05)"
                        : "var(--glass-medium)",
                    border:
                      selectedPriority === "balanced"
                        ? "2px solid var(--color-cyan)"
                        : "2px solid var(--glass-border)",
                    borderRadius: "var(--radius-lg)",
                    cursor: "pointer",
                    transition: "all var(--duration-normal)",
                    position: "relative",
                  }}
                  onMouseEnter={(e) => {
                    if (selectedPriority !== "balanced") {
                      e.currentTarget.style.transform = "translateY(-4px)";
                      e.currentTarget.style.borderColor =
                        "rgba(0, 240, 255, 0.3)";
                    }
                  }}
                  onMouseLeave={(e) => {
                    if (selectedPriority !== "balanced") {
                      e.currentTarget.style.transform = "translateY(0)";
                      e.currentTarget.style.borderColor = "var(--glass-border)";
                    }
                  }}
                >
                  <div
                    style={{
                      display: "flex",
                      alignItems: "center",
                      gap: "var(--space-sm)",
                      marginBottom: "var(--space-md)",
                    }}
                  >
                    <span style={{ fontSize: "24px" }}>⚖️</span>
                    <h3 className="text-lg" style={{ fontWeight: "400" }}>
                      Balanced
                    </h3>
                  </div>
                  <div
                    className="text-sm"
                    style={{
                      color: "var(--color-cyan)",
                      marginBottom: "var(--space-sm)",
                    }}
                  >
                    Target: Performance + Quality
                  </div>
                  <div
                    className="text-sm"
                    style={{
                      color: "var(--text-secondary)",
                      marginBottom: "var(--space-md)",
                    }}
                  >
                    Smart compression
                  </div>
                  <div
                    style={{
                      paddingTop: "var(--space-md)",
                      borderTop: "1px solid var(--glass-border)",
                    }}
                  >
                    <div
                      className="text-xs"
                      style={{ color: "var(--color-green)" }}
                    >
                      Best for: Most websites
                    </div>
                  </div>
                </div>

                {/* Quality Priority */}
                <div
                  onClick={() => handlePrioritySelect("quality")}
                  style={{
                    padding: "var(--space-lg)",
                    background:
                      selectedPriority === "quality"
                        ? "rgba(0, 240, 255, 0.05)"
                        : "var(--glass-medium)",
                    border:
                      selectedPriority === "quality"
                        ? "2px solid var(--color-cyan)"
                        : "2px solid var(--glass-border)",
                    borderRadius: "var(--radius-lg)",
                    cursor: "pointer",
                    transition: "all var(--duration-normal)",
                    position: "relative",
                  }}
                  onMouseEnter={(e) => {
                    if (selectedPriority !== "quality") {
                      e.currentTarget.style.transform = "translateY(-4px)";
                      e.currentTarget.style.borderColor =
                        "rgba(0, 240, 255, 0.3)";
                    }
                  }}
                  onMouseLeave={(e) => {
                    if (selectedPriority !== "quality") {
                      e.currentTarget.style.transform = "translateY(0)";
                      e.currentTarget.style.borderColor = "var(--glass-border)";
                    }
                  }}
                >
                  <div
                    style={{
                      display: "flex",
                      alignItems: "center",
                      gap: "var(--space-sm)",
                      marginBottom: "var(--space-md)",
                    }}
                  >
                    <span style={{ fontSize: "24px" }}>✨</span>
                    <h3 className="text-lg" style={{ fontWeight: "400" }}>
                      Quality Priority
                    </h3>
                  </div>
                  <div
                    className="text-sm"
                    style={{
                      color: "var(--color-cyan)",
                      marginBottom: "var(--space-sm)",
                    }}
                  >
                    Target: Visual perfection
                  </div>
                  <div
                    className="text-sm"
                    style={{
                      color: "var(--text-secondary)",
                      marginBottom: "var(--space-md)",
                    }}
                  >
                    Minimal compression
                  </div>
                  <div
                    style={{
                      paddingTop: "var(--space-md)",
                      borderTop: "1px solid var(--glass-border)",
                    }}
                  >
                    <div
                      className="text-xs"
                      style={{ color: "var(--color-green)" }}
                    >
                      Best for: Portfolios, galleries
                    </div>
                  </div>
                </div>
              </div>

              <NavigationButtons
                onBack={() => goToStep(hasSamePageStep ? 2 : 1)}
                onContinue={() => goToStep(4)}
                continueDisabled={!selectedPriority}
              />
            </>
          )}

          {/* Step 4: Format Selection */}
          {currentStep === 4 && (
            <>
              <StepHeader
                title="Choose your output format"
                subtitle="Select based on your browser support needs"
              />

              <div
                style={{
                  padding: "var(--space-md)",
                  background: "var(--glass-light)",
                  borderRadius: "var(--radius-md)",
                  marginBottom: "var(--space-lg)",
                  color: "var(--text-secondary)",
                }}
              >
                📌 Have logos or graphics with transparent backgrounds? Options
                1 and 3 preserve transparency.
              </div>

              <div
                style={{
                  display: "grid",
                  gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))",
                  gap: "var(--space-md)",
                  marginBottom: "var(--space-xl)",
                }}
              >
                {/* Smart Optimization */}
                <div
                  onClick={() => handleFormatSelect("smart")}
                  style={{
                    background:
                      selectedFormat === "smart"
                        ? "rgba(0, 240, 255, 0.05)"
                        : "var(--glass-medium)",
                    border:
                      selectedFormat === "smart"
                        ? "2px solid var(--color-cyan)"
                        : "2px solid var(--glass-border)",
                    borderRadius: "var(--radius-lg)",
                    padding: "var(--space-lg)",
                    cursor: "pointer",
                    transition: "all var(--duration-normal)",
                  }}
                  onMouseEnter={(e) => {
                    if (selectedFormat !== "smart") {
                      e.currentTarget.style.transform = "translateY(-2px)";
                      e.currentTarget.style.borderColor =
                        "rgba(0, 240, 255, 0.2)";
                    }
                  }}
                  onMouseLeave={(e) => {
                    if (selectedFormat !== "smart") {
                      e.currentTarget.style.transform = "translateY(0)";
                      e.currentTarget.style.borderColor = "var(--glass-border)";
                    }
                  }}
                >
                  <h3
                    className="text-md"
                    style={{ marginBottom: "var(--space-md)" }}
                  >
                    Smart Optimization
                  </h3>
                  <p
                    className="text-sm"
                    style={{
                      lineHeight: "1.5",
                      marginBottom: "var(--space-md)",
                    }}
                  >
                    <strong style={{ color: "var(--color-cyan)" }}>
                      Preserve Features
                    </strong>
                    <br />
                    • JPEGs stay JPEG (optimized)
                    <br />
                    • PNGs with transparency stay PNG
                    <br />• PNGs without transparency → JPEG
                  </p>
                  <div
                    style={{
                      padding: "var(--space-sm)",
                      background: "var(--glass-light)",
                      borderRadius: "var(--radius-sm)",
                      marginBottom: "var(--space-sm)",
                    }}
                  >
                    <div
                      className="text-xs"
                      style={{
                        color: "var(--color-green)",
                        marginBottom: "2px",
                      }}
                    >
                      ✓ ~40-50% smaller
                    </div>
                    <div
                      className="text-xs"
                      style={{ color: "var(--color-green)" }}
                    >
                      ✓ Works everywhere
                    </div>
                  </div>
                  <p
                    className="text-xs"
                    style={{ color: "var(--color-green)" }}
                  >
                    Best for: Sites needing transparency + compatibility
                  </p>
                </div>

                {/* WebP Format */}
                <div
                  onClick={() => handleFormatSelect("webp")}
                  style={{
                    background:
                      selectedFormat === "webp"
                        ? "rgba(0, 240, 255, 0.05)"
                        : "var(--glass-medium)",
                    border:
                      selectedFormat === "webp"
                        ? "2px solid var(--color-cyan)"
                        : "2px solid var(--glass-border)",
                    borderRadius: "var(--radius-lg)",
                    padding: "var(--space-lg)",
                    cursor: "pointer",
                    transition: "all var(--duration-normal)",
                  }}
                  onMouseEnter={(e) => {
                    if (selectedFormat !== "webp") {
                      e.currentTarget.style.transform = "translateY(-2px)";
                      e.currentTarget.style.borderColor =
                        "rgba(0, 240, 255, 0.2)";
                    }
                  }}
                  onMouseLeave={(e) => {
                    if (selectedFormat !== "webp") {
                      e.currentTarget.style.transform = "translateY(0)";
                      e.currentTarget.style.borderColor = "var(--glass-border)";
                    }
                  }}
                >
                  <h3
                    className="text-md"
                    style={{ marginBottom: "var(--space-md)" }}
                  >
                    Maximum Compression
                  </h3>
                  <p
                    className="text-sm"
                    style={{
                      lineHeight: "1.5",
                      marginBottom: "var(--space-md)",
                    }}
                  >
                    <strong style={{ color: "var(--color-cyan)" }}>
                      WebP Format
                    </strong>
                    <br />
                    • Everything converts to WebP
                    <br />
                    • Preserves transparency
                    <br />• Same quality, smaller files
                  </p>
                  <div
                    style={{
                      padding: "var(--space-sm)",
                      background: "var(--glass-light)",
                      borderRadius: "var(--radius-sm)",
                      marginBottom: "var(--space-sm)",
                    }}
                  >
                    <div
                      className="text-xs"
                      style={{
                        color: "var(--color-green)",
                        marginBottom: "2px",
                      }}
                    >
                      ✓ ~60-70% smaller
                    </div>
                    <div
                      className="text-xs"
                      style={{ color: "var(--color-green)" }}
                    >
                      ✓ Works on all modern browsers
                    </div>
                  </div>
                  <p
                    className="text-xs"
                    style={{ color: "var(--color-green)" }}
                  >
                    Best for: Maximum performance
                  </p>
                </div>

                {/* Original Formats */}
                <div
                  onClick={() => handleFormatSelect("original")}
                  style={{
                    background:
                      selectedFormat === "original"
                        ? "rgba(0, 240, 255, 0.05)"
                        : "var(--glass-medium)",
                    border:
                      selectedFormat === "original"
                        ? "2px solid var(--color-cyan)"
                        : "2px solid var(--glass-border)",
                    borderRadius: "var(--radius-lg)",
                    padding: "var(--space-lg)",
                    cursor: "pointer",
                    transition: "all var(--duration-normal)",
                  }}
                  onMouseEnter={(e) => {
                    if (selectedFormat !== "original") {
                      e.currentTarget.style.transform = "translateY(-2px)";
                      e.currentTarget.style.borderColor =
                        "rgba(0, 240, 255, 0.2)";
                    }
                  }}
                  onMouseLeave={(e) => {
                    if (selectedFormat !== "original") {
                      e.currentTarget.style.transform = "translateY(0)";
                      e.currentTarget.style.borderColor = "var(--glass-border)";
                    }
                  }}
                >
                  <h3
                    className="text-md"
                    style={{ marginBottom: "var(--space-md)" }}
                  >
                    Keep Original Formats
                  </h3>
                  <p
                    className="text-sm"
                    style={{
                      lineHeight: "1.5",
                      marginBottom: "var(--space-md)",
                    }}
                  >
                    <strong style={{ color: "var(--color-cyan)" }}>
                      Safe Choice
                    </strong>
                    <br />
                    • JPEGs stay JPEG (optimized)
                    <br />
                    • PNGs stay PNG (optimized)
                    <br />• All features preserved
                  </p>
                  <div
                    style={{
                      padding: "var(--space-sm)",
                      background: "var(--glass-light)",
                      borderRadius: "var(--radius-sm)",
                      marginBottom: "var(--space-sm)",
                    }}
                  >
                    <div
                      className="text-xs"
                      style={{
                        color: "var(--color-green)",
                        marginBottom: "2px",
                      }}
                    >
                      ✓ ~30-40% smaller
                    </div>
                    <div
                      className="text-xs"
                      style={{ color: "var(--color-green)" }}
                    >
                      ✓ Works everywhere
                    </div>
                  </div>
                  <p
                    className="text-xs"
                    style={{ color: "var(--color-green)" }}
                  >
                    Best for: When unsure about transparency needs
                  </p>
                </div>
              </div>

              <NavigationButtons
                onBack={() => goToStep(3)}
                onContinue={() => goToStep(totalSteps - 1)}
                continueDisabled={!selectedFormat}
              />
            </>
          )}

          {/* Review Step */}
          {currentStep === 5 && !isProcessing && (
            <>
              <StepHeader
                title="Your optimization metrics"
                subtitle="Ready to boost your website performance"
              />

              <ReviewCard metrics={calculateMetrics()} />

              <div
                style={{
                  background: "rgba(16, 185, 129, 0.05)",
                  border: "1px solid rgba(16, 185, 129, 0.2)",
                  borderRadius: "var(--radius-md)",
                  padding: "var(--space-md)",
                  marginTop: "var(--space-lg)",
                  marginBottom: "var(--space-xl)",
                }}
              >
                <div
                  className="text-sm"
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: "var(--space-sm)",
                    color: "var(--color-green)",
                  }}
                >
                  <svg
                    style={{ width: "16px", height: "16px" }}
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="1.5"
                  >
                    <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path>
                    <polyline points="22 4 12 14.01 9 11.01"></polyline>
                  </svg>
                  <strong>Google Core Web Vitals:</strong> Your site will pass
                  with these optimizations
                </div>
              </div>

              <NavigationButtons
                onBack={() => goToStep(4)}
                onContinue={startProcessing}
                continueText="Optimize Images"
              />
            </>
          )}

          {/* Processing Step */}
          {currentStep === 6 && isProcessing && (
            <div style={{ textAlign: "center", padding: "var(--space-3xl)" }}>
              <ProcessingSpinner
                message={
                  processingProgress < 50
                    ? "Analyzing your images..."
                    : processingProgress < 75
                    ? "Optimizing for web performance..."
                    : "Applying compression..."
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

          {/* Success Step */}
          {currentStep === 6 && !isProcessing && processedFiles.length > 0 && (
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
                Your images are optimized!
              </h2>

              <p
                className="text-base"
                style={{
                  color: "var(--text-secondary)",
                  marginBottom: "var(--space-xl)",
                }}
              >
                Ready for lightning-fast loading
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
                  Optimization results
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
                      Files processed:
                    </span>
                    <span className="text-base">
                      {processedFiles.length} images
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
                      Total reduction:
                    </span>
                    <span className="text-base">
                      {processedFiles[0]?.reduction} smaller
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
                      New page weight:
                    </span>
                    <span className="text-base">
                      {processedFiles
                        .reduce((sum, f) => sum + parseFloat(f.size), 0)
                        .toFixed(1)}{" "}
                      MB
                    </span>
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
                      Estimated load time:
                    </span>
                    <span
                      className="text-base"
                      style={{ color: "var(--color-green)" }}
                    >
                      ~2 seconds
                    </span>
                  </div>
                </div>
              </div>

              <button
                className="btn btn-primary"
                style={{
                  width: "100%",
                  maxWidth: "300px",
                  margin: "0 auto var(--space-xl)",
                }}
              >
                Download Optimized Images
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
                    // Reset for another optimization
                    setUploadedFiles([]);
                    setSamePage(null);
                    setSelectedPriority(null);
                    setSelectedFormat(null);
                    setProcessedFiles([]);
                    setCurrentStep(1);
                  }}
                >
                  Optimize More Images
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </>
  );
}

export default WebOptimizer;
