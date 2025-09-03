import { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import {
  AnimatedBackground,
  ProgressBar,
  FileUpload,
  FileList,
  PlatformCard,
  NavigationButtons,
  ProcessingSpinner,
  SuccessScreen,
  StepHeader,
  ReviewCard,
  DownloadSection,
} from "../components/SharedComponents";
import { PLATFORM_LIMITS } from "../constants";

function SmartEmail() {
  const navigate = useNavigate();

  // State management
  const [currentStep, setCurrentStep] = useState(1);
  const [totalSteps, setTotalSteps] = useState(5);
  const [selectedPlatform, setSelectedPlatform] = useState(null);
  const [uploadedFiles, setUploadedFiles] = useState([]);
  const [distributionMethod, setDistributionMethod] = useState(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [processingProgress, setProcessingProgress] = useState(0);
  const [processedFiles, setProcessedFiles] = useState([]);
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

  // Platform data with better descriptions
  const platforms = [
    // Email Platforms
    {
      id: "gmail",
      name: "Gmail",
      limit: "25MB",
      category: "email",
      note: "Most popular • Drive backup for larger files",
      compression: "Smart compression to 24MB",
    },
    {
      id: "outlook",
      name: "Outlook",
      limit: "20MB",
      category: "email",
      note: "Business standard • OneDrive integration",
      compression: "Optimize to 19MB safely",
    },
    {
      id: "yahoo",
      name: "Yahoo Mail",
      limit: "25MB",
      category: "email",
      note: "No cloud backup • Direct attachments only",
      compression: "Compress to fit 24MB",
    },
    {
      id: "icloud",
      name: "iCloud Mail",
      limit: "20MB",
      category: "email",
      note: "Apple ecosystem • Mail Drop for 5GB files",
      compression: "Reduce to 19MB maximum",
    },
    // Messaging Apps
    {
      id: "discord",
      name: "Discord",
      limit: "8MB",
      category: "messaging",
      note: "Gaming & communities • Nitro: 100MB",
      compression: "Heavy optimization to 7.5MB",
    },
    {
      id: "whatsapp",
      name: "WhatsApp",
      limit: "16MB",
      category: "messaging",
      note: "Most used globally • 100MB for documents",
      compression: "Balance quality at 15MB",
    },
    {
      id: "slack",
      name: "Slack",
      limit: "5MB",
      category: "messaging",
      note: "Workplace chat • Paid: 1GB uploads",
      compression: "Maximum compression to 4.5MB",
    },
    {
      id: "messenger",
      name: "Messenger",
      limit: "25MB",
      category: "messaging",
      note: "Facebook integration • Video calls",
      compression: "Optimize to 24MB",
    },
    {
      id: "teams",
      name: "Teams",
      limit: "20MB",
      category: "messaging",
      note: "Microsoft suite • SharePoint backup",
      compression: "Professional quality at 19MB",
    },
  ];

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

  // Handle platform selection with auto-advance
  const handlePlatformSelect = (platform) => {
    setSelectedPlatform(platform);
    // Auto-advance after visual feedback
    setTimeout(() => {
      goToStep(2, true);
    }, 400);
  };

  // Handle file upload
  const handleFilesSelected = (files) => {
    setUploadedFiles((prev) => [...prev, ...files]);
  };

  // Remove file
  const handleRemoveFile = (index) => {
    setUploadedFiles((prev) => prev.filter((_, i) => i !== index));
  };

  // Check if distribution method step is needed
  const checkDistributionMethod = () => {
    if (uploadedFiles.length > 1) {
      setTotalSteps(6);
      goToStep(3.5);
    } else {
      setTotalSteps(5);
      setDistributionMethod("single");
      goToStep(4);
    }
  };

  // Handle distribution selection with auto-advance
  const handleDistributionSelect = (method) => {
    setDistributionMethod(method);
    setTimeout(() => {
      goToStep(4, true);
    }, 400);
  };

  // Start processing
  const startProcessing = () => {
    setIsProcessing(true);
    goToStep(5);

    // Simulate processing
    const steps = [33, 66, 95, 100];
    let stepIndex = 0;

    const interval = setInterval(() => {
      if (stepIndex < steps.length) {
        setProcessingProgress(steps[stepIndex]);
        stepIndex++;
      } else {
        clearInterval(interval);
        // Simulate processed files
        const processed = uploadedFiles.map((file) => ({
          ...file,
          compressed: true,
          size: `${((file.size * 0.75) / 1024 / 1024).toFixed(1)}MB`,
        }));
        setProcessedFiles(processed);
        setIsProcessing(false);
        goToStep(6);
      }
    }, 1000);
  };

  // Get step name for progress bar
  const getStepName = () => {
    switch (currentStep) {
      case 1:
        return "Select Platform";
      case 2:
        return "Upload Files";
      case 3.5:
        return "Distribution Method";
      case 4:
        return "Review Settings";
      case 5:
        return "Processing";
      case 6:
        return "Complete!";
      default:
        return "";
    }
  };

  // Calculate metrics for review
  const getMetrics = () => {
    const totalSize = uploadedFiles.reduce((sum, file) => sum + file.size, 0);
    const platformLimit =
      parseInt(selectedPlatform?.limit) * 1024 * 1024 || 25 * 1024 * 1024;
    const optimizedSize = Math.min(totalSize, platformLimit * 0.95);
    const spaceSaved = totalSize - optimizedSize;

    return {
      "Original size": `${(totalSize / 1024 / 1024).toFixed(1)} MB`,
      "Platform limit": selectedPlatform?.limit || "25MB",
      "Optimized size": `< ${selectedPlatform?.limit || "25MB"}`,
      "Space saved": `${(spaceSaved / 1024 / 1024).toFixed(1)} MB`,
      Files: uploadedFiles.length,
      Distribution:
        distributionMethod === "single"
          ? "Single message"
          : "Separate messages",
    };
  };

  // Handle download
  const handleDownload = (file, index) => {
    console.log("Download file:", file.name);
  };

  const handleDownloadAll = () => {
    console.log("Download all files");
  };

  return (
    <>
      {/* Use the new AnimatedBackground component */}
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
          currentStep={currentStep === 3.5 ? 3.5 : currentStep}
          totalSteps={totalSteps}
          stepName={getStepName()}
        />

        {/* Step Container with proper animations */}
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
          {/* Step 1: Platform Selection */}
          {currentStep === 1 && (
            <>
              <StepHeader
                title="Where are you sending these?"
                subtitle="Each platform has different size limits"
              />

              <div style={{ marginBottom: "var(--space-xl)" }}>
                <div
                  className="text-sm"
                  style={{
                    textTransform: "uppercase",
                    letterSpacing: "var(--letter-spacing-widest)",
                    color: "var(--text-tertiary)",
                    marginBottom: "var(--space-lg)",
                    paddingBottom: "var(--space-md)",
                    borderBottom: "1px solid var(--glass-border)",
                  }}
                >
                  EMAIL PLATFORMS
                </div>

                <div
                  style={{
                    display: "grid",
                    gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))",
                    gap: "var(--space-md)",
                    marginBottom: "var(--space-xl)",
                  }}
                >
                  {platforms
                    .filter((p) => p.category === "email")
                    .map((platform) => (
                      <PlatformCard
                        key={platform.id}
                        platform={platform}
                        selected={selectedPlatform?.id === platform.id}
                        onClick={() => handlePlatformSelect(platform)}
                      />
                    ))}
                </div>

                <div
                  className="text-sm"
                  style={{
                    textTransform: "uppercase",
                    letterSpacing: "var(--letter-spacing-widest)",
                    color: "var(--text-tertiary)",
                    marginBottom: "var(--space-lg)",
                    paddingBottom: "var(--space-md)",
                    borderBottom: "1px solid var(--glass-border)",
                  }}
                >
                  MESSAGING APPS
                </div>

                <div
                  style={{
                    display: "grid",
                    gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))",
                    gap: "var(--space-md)",
                  }}
                >
                  {platforms
                    .filter((p) => p.category === "messaging")
                    .map((platform) => (
                      <PlatformCard
                        key={platform.id}
                        platform={platform}
                        selected={selectedPlatform?.id === platform.id}
                        onClick={() => handlePlatformSelect(platform)}
                      />
                    ))}
                </div>
              </div>

              <NavigationButtons
                onBack={() => {
                  setAnimatingOut(true);
                  setTimeout(() => navigate("/"), 300);
                }}
                onContinue={() => goToStep(2)}
                continueDisabled={!selectedPlatform}
              />
            </>
          )}

          {/* Step 2: Upload Files */}
          {currentStep === 2 && (
            <>
              <StepHeader
                title="Upload your attachments"
                subtitle={`We'll optimize them for ${
                  selectedPlatform?.name || "your platform"
                }`}
              />

              {uploadedFiles.length === 0 ? (
                <FileUpload
                  onFilesSelected={handleFilesSelected}
                  maxFiles={50}
                  accept="*"
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
                    Total: {uploadedFiles.length} files •{" "}
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
                    Add more files
                  </button>
                  <input
                    id="hiddenFileInput"
                    type="file"
                    multiple
                    style={{ display: "none" }}
                    onChange={(e) =>
                      handleFilesSelected(Array.from(e.target.files))
                    }
                  />
                </>
              )}

              <NavigationButtons
                onBack={() => goToStep(1)}
                onContinue={checkDistributionMethod}
                continueDisabled={uploadedFiles.length === 0}
              />
            </>
          )}

          {/* Step 3.5: Distribution Method (Conditional) */}
          {currentStep === 3.5 && (
            <>
              <StepHeader
                title="How will you send these files?"
                subtitle="This helps us optimize compression for your needs"
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
                  onClick={() => handleDistributionSelect("single")}
                  onMouseEnter={(e) => {
                    if (distributionMethod !== "single") {
                      e.currentTarget.style.borderColor =
                        "rgba(0, 240, 255, 0.2)";
                      e.currentTarget.style.background = "var(--glass-medium)";
                    }
                  }}
                  onMouseLeave={(e) => {
                    if (distributionMethod !== "single") {
                      e.currentTarget.style.borderColor = "var(--glass-border)";
                      e.currentTarget.style.background = "var(--glass-light)";
                    }
                  }}
                  style={{
                    background:
                      distributionMethod === "single"
                        ? "rgba(0, 240, 255, 0.05)"
                        : "var(--glass-light)",
                    border:
                      distributionMethod === "single"
                        ? "2px solid var(--color-cyan)"
                        : "2px solid var(--glass-border)",
                    borderRadius: "var(--radius-lg)",
                    padding: "var(--space-lg)",
                    cursor: "pointer",
                    transition: "all var(--duration-normal)",
                    position: "relative",
                    backdropFilter: "blur(20px)",
                  }}
                >
                  <div
                    style={{
                      position: "absolute",
                      top: "var(--space-lg)",
                      left: "var(--space-lg)",
                      width: "20px",
                      height: "20px",
                      border: "2px solid",
                      borderColor:
                        distributionMethod === "single"
                          ? "var(--color-cyan)"
                          : "var(--glass-border)",
                      borderRadius: "var(--radius-full)",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                    }}
                  >
                    {distributionMethod === "single" && (
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
                  <div style={{ marginLeft: "var(--space-xl)" }}>
                    <div
                      className="text-md"
                      style={{
                        marginBottom: "var(--space-xs)",
                      }}
                    >
                      One message
                    </div>
                    <div
                      className="text-base"
                      style={{
                        color: "var(--text-secondary)",
                        marginBottom: "var(--space-md)",
                      }}
                    >
                      All files in a single email
                    </div>
                    <div
                      className="text-sm"
                      style={{
                        padding: "var(--space-sm)",
                        background: "var(--glass-medium)",
                        border: "1px solid var(--glass-border)",
                        borderRadius: "var(--radius-sm)",
                      }}
                    >
                      We'll compress everything to fit together
                    </div>
                  </div>
                </div>

                <div
                  onClick={() => handleDistributionSelect("separate")}
                  onMouseEnter={(e) => {
                    if (distributionMethod !== "separate") {
                      e.currentTarget.style.borderColor =
                        "rgba(0, 240, 255, 0.2)";
                      e.currentTarget.style.background = "var(--glass-medium)";
                    }
                  }}
                  onMouseLeave={(e) => {
                    if (distributionMethod !== "separate") {
                      e.currentTarget.style.borderColor = "var(--glass-border)";
                      e.currentTarget.style.background = "var(--glass-light)";
                    }
                  }}
                  style={{
                    background:
                      distributionMethod === "separate"
                        ? "rgba(0, 240, 255, 0.05)"
                        : "var(--glass-light)",
                    border:
                      distributionMethod === "separate"
                        ? "2px solid var(--color-cyan)"
                        : "2px solid var(--glass-border)",
                    borderRadius: "var(--radius-lg)",
                    padding: "var(--space-lg)",
                    cursor: "pointer",
                    transition: "all var(--duration-normal)",
                    position: "relative",
                    backdropFilter: "blur(20px)",
                  }}
                >
                  <div
                    style={{
                      position: "absolute",
                      top: "var(--space-lg)",
                      left: "var(--space-lg)",
                      width: "20px",
                      height: "20px",
                      border: "2px solid",
                      borderColor:
                        distributionMethod === "separate"
                          ? "var(--color-cyan)"
                          : "var(--glass-border)",
                      borderRadius: "var(--radius-full)",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                    }}
                  >
                    {distributionMethod === "separate" && (
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
                  <div style={{ marginLeft: "var(--space-xl)" }}>
                    <div
                      className="text-md"
                      style={{
                        marginBottom: "var(--space-xs)",
                      }}
                    >
                      Separate messages
                    </div>
                    <div
                      className="text-base"
                      style={{
                        color: "var(--text-secondary)",
                        marginBottom: "var(--space-md)",
                      }}
                    >
                      Each file in its own email
                    </div>
                    <div
                      className="text-sm"
                      style={{
                        padding: "var(--space-sm)",
                        background: "var(--glass-medium)",
                        border: "1px solid var(--glass-border)",
                        borderRadius: "var(--radius-sm)",
                      }}
                    >
                      Each file gets maximum quality within the limit
                    </div>
                  </div>
                </div>
              </div>

              <NavigationButtons
                onBack={() => goToStep(2)}
                onContinue={() => goToStep(4)}
                continueDisabled={!distributionMethod}
              />
            </>
          )}

          {/* Step 4: Review */}
          {currentStep === 4 && (
            <>
              <StepHeader
                title="Here's your optimization plan"
                subtitle="Review how we'll prepare your files"
              />

              <ReviewCard metrics={getMetrics()} />

              <div
                style={{
                  marginTop: "var(--space-md)",
                  padding: "var(--space-lg)",
                  background: "var(--glass-light)",
                  borderRadius: "var(--radius-lg)",
                  border: "1px solid var(--glass-border)",
                  backdropFilter: "blur(20px)",
                }}
              >
                <div
                  className="text-sm"
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: "var(--space-sm)",
                    color: "var(--text-secondary)",
                  }}
                >
                  <span>✨</span>
                  Smart compression maintains visual quality while reducing file
                  size
                </div>
                <div
                  className="text-sm"
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: "var(--space-sm)",
                    color: "var(--text-secondary)",
                    marginTop: "var(--space-sm)",
                  }}
                >
                  <span>💡</span>
                  We'll compress your files to 95% of the limit to ensure
                  successful delivery
                </div>
              </div>

              <NavigationButtons
                onBack={() => (totalSteps === 6 ? goToStep(3.5) : goToStep(2))}
                onContinue={startProcessing}
                continueText="Optimize My Files"
              />
            </>
          )}

          {/* Step 5: Processing */}
          {currentStep === 5 && (
            <div
              style={{
                textAlign: "center",
                padding: "var(--space-3xl)",
              }}
            >
              <ProcessingSpinner
                message={
                  processingProgress < 50
                    ? "Analyzing your files..."
                    : processingProgress < 90
                    ? `Optimizing for ${selectedPlatform?.name}...`
                    : "Finalizing..."
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

          {/* Step 6: Success */}
          {currentStep === 6 && (
            <>
              <SuccessScreen
                title="Your files are ready!"
                message={`Optimized for ${selectedPlatform?.name}`}
                files={processedFiles}
              />

              <DownloadSection
                files={processedFiles}
                onDownload={handleDownload}
                onDownloadAll={handleDownloadAll}
              />

              <div
                style={{
                  display: "flex",
                  justifyContent: "center",
                  gap: "var(--space-md)",
                  marginTop: "var(--space-xl)",
                }}
              >
                <button
                  className="btn btn-secondary"
                  onClick={() => {
                    setCurrentStep(1);
                    setUploadedFiles([]);
                    setSelectedPlatform(null);
                    setDistributionMethod(null);
                    setTotalSteps(5);
                    setProcessedFiles([]);
                  }}
                >
                  Optimize More Files
                </button>
              </div>
            </>
          )}
        </div>
      </div>
    </>
  );
}

export default SmartEmail;
