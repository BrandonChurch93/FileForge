import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import {
  AnimatedBackground,
  ProgressBar,
  FileUpload,
  FileList,
  FormatCard,
  NavigationButtons,
  ProcessingSpinner,
  SuccessScreen,
  StepHeader,
  ReviewCard,
  DownloadSection,
} from "../components/SharedComponents";
import { SUPPORTED_FORMATS, FILE_LIMITS } from "../constants";

function FileConverter() {
  const navigate = useNavigate();

  // State management
  const [currentStep, setCurrentStep] = useState(1);
  const [totalSteps] = useState(5); // Always 5 steps
  const [selectedFormat, setSelectedFormat] = useState(null);
  const [uploadedFiles, setUploadedFiles] = useState([]);
  const [showTransparencyWarning, setShowTransparencyWarning] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [processingProgress, setProcessingProgress] = useState(0);
  const [processedFiles, setProcessedFiles] = useState([]);
  const [animatingOut, setAnimatingOut] = useState(false);
  const [animatingIn, setAnimatingIn] = useState(true);
  const [pageLoaded, setPageLoaded] = useState(false);
  const [previewMode, setPreviewMode] = useState("before");

  // Initial page load animation
  useEffect(() => {
    setTimeout(() => {
      setPageLoaded(true);
      setAnimatingIn(false);
    }, 500);
  }, []);

  // Format options with pros/cons
  const formats = [
    {
      id: "jpeg",
      name: "JPEG",
      tag: "Photography", // Changed from "Smaller files"
      pros: [
        "Best for photos",
        "Smaller file sizes",
        "Universal compatibility",
      ],
      cons: ["No transparency", "Lossy compression"],
      bestFor: "Photos, web images, email attachments",
    },
    {
      id: "png",
      name: "PNG",
      tag: "Graphics & Logos", // Changed from "Larger files"
      pros: ["Supports transparency", "Lossless quality", "Best for graphics"],
      cons: ["Larger file sizes", "Not ideal for photos"],
      bestFor: "Logos, screenshots, graphics with transparency",
    },
    {
      id: "webp",
      name: "WebP",
      tag: "Modern Web", // Changed from "30% smaller"
      pros: ["30% smaller than JPEG", "Supports transparency", "Modern format"],
      cons: ["Limited software support", "Not all browsers"],
      bestFor: "Modern websites, web applications",
    },
  ];

  // Check for transparency warning when converting to JPEG
  useEffect(() => {
    if (selectedFormat === "jpeg" && uploadedFiles.length > 0) {
      const hasPNGFiles = uploadedFiles.some(
        (file) =>
          file.type === "image/png" || file.name.toLowerCase().endsWith(".png")
      );
      setShowTransparencyWarning(hasPNGFiles);
    } else {
      setShowTransparencyWarning(false);
    }
  }, [selectedFormat, uploadedFiles]);

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

  // Handle format selection with auto-advance
  const handleFormatSelect = (format) => {
    setSelectedFormat(format.id);
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

  // Check if we need to show transparency warning
  const checkNextStep = () => {
    if (
      selectedFormat === "jpeg" &&
      uploadedFiles.some(
        (f) => f.type === "image/png" || f.name.toLowerCase().endsWith(".png")
      )
    ) {
      setShowTransparencyWarning(true);
    } else {
      setShowTransparencyWarning(false);
    }
    goToStep(3); // Always go to step 3
  };

  // Start processing
  const startProcessing = () => {
    setIsProcessing(true);
    // Always go to step 4 for processing
    goToStep(4);

    // Simulate processing
    const steps = [
      { progress: 33, message: "Analyzing your images..." },
      {
        progress: 66,
        message: `Converting to ${
          formats.find((f) => f.id === selectedFormat)?.name
        }...`,
      },
      { progress: 95, message: "Finalizing..." },
      { progress: 100, message: "Complete!" },
    ];

    let stepIndex = 0;
    const interval = setInterval(() => {
      if (stepIndex < steps.length) {
        setProcessingProgress(steps[stepIndex].progress);
        stepIndex++;
      } else {
        clearInterval(interval);
        // Simulate processed files - ensure all properties are preserved
        const processed = uploadedFiles.map((file) => ({
          name: file.name || "untitled", // Ensure name exists
          type: file.type,
          size: file.size,
          converted: true,
          newFormat: selectedFormat,
          sizeText:
            selectedFormat === "jpeg"
              ? `${((file.size * 0.7) / 1024 / 1024).toFixed(1)}MB`
              : selectedFormat === "webp"
              ? `${((file.size * 0.5) / 1024 / 1024).toFixed(1)}MB`
              : `${(file.size / 1024 / 1024).toFixed(1)}MB`,
        }));
        setProcessedFiles(processed);
        setIsProcessing(false);
        // Always go to step 5 for success
        goToStep(5);
      }
    }, 1000);
  };

  // Get step name for progress bar
  const getStepName = () => {
    switch (currentStep) {
      case 1:
        return "Choose Format";
      case 2:
        return "Upload Images";
      case 3:
        return showTransparencyWarning
          ? "Transparency Warning"
          : "Review Conversion";
      case 4:
        return "Processing";
      case 5:
        return "Complete!";
      default:
        return "";
    }
  };

  // Calculate metrics for review
  const getMetrics = () => {
    const totalSize = uploadedFiles.reduce((sum, file) => sum + file.size, 0);
    const formatName =
      formats.find((f) => f.id === selectedFormat)?.name || "JPEG";

    // Get unique file types
    const fileTypes = [
      ...new Set(
        uploadedFiles.map((f) => {
          const ext = f.name.split(".").pop().toUpperCase();
          return ext;
        })
      ),
    ].join("/");

    // Estimate size reduction
    let reduction = 0;
    if (selectedFormat === "jpeg") reduction = 0.3;
    if (selectedFormat === "webp") reduction = 0.5;

    const estimatedSize = totalSize * (1 - reduction);
    const reductionPercent = Math.round(reduction * 100);

    return {
      Input: `${uploadedFiles.length} ${fileTypes} files (${(
        totalSize /
        1024 /
        1024
      ).toFixed(1)} MB)`,
      Output: `${uploadedFiles.length} ${formatName} files`,
      Estimated:
        reduction > 0
          ? `~${(estimatedSize / 1024 / 1024).toFixed(
              1
            )} MB (${reductionPercent}% smaller)`
          : "Similar size (lossless)",
      Resolution: "Original preserved",
      Quality: selectedFormat === "jpeg" ? "Optimized" : "Lossless",
    };
  };

  // Handle download
  const handleDownload = (file, index) => {
    console.log("Download file:", file.name);
  };

  const handleDownloadAll = () => {
    console.log("Download all files");
  };

  // Helper function to get new filename with extension
  const getNewFilename = (originalName, newFormat) => {
    if (!originalName)
      return `converted.${newFormat === "jpeg" ? "jpg" : newFormat}`;

    const lastDotIndex = originalName.lastIndexOf(".");
    const nameWithoutExt =
      lastDotIndex > -1
        ? originalName.substring(0, lastDotIndex)
        : originalName;
    const newExt = newFormat === "jpeg" ? "jpg" : newFormat;
    return `${nameWithoutExt}.${newExt}`;
  };

  return (
    <>
      {/* Use the animated background */}
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
          {/* Step 1: Format Selection */}
          {currentStep === 1 && (
            <>
              <StepHeader
                title="Choose your output format"
                subtitle="Select the best format for your needs"
              />

              <div
                style={{
                  display: "grid",
                  gridTemplateColumns: "repeat(auto-fit, minmax(320px, 1fr))",
                  gap: "var(--space-lg)",
                  marginBottom: "var(--space-xl)",
                }}
              >
                {formats.map((format) => (
                  <FormatCard
                    key={format.id}
                    format={format}
                    selected={selectedFormat === format.id}
                    onClick={() => handleFormatSelect(format)}
                  />
                ))}
              </div>

              <NavigationButtons
                onBack={() => {
                  setAnimatingOut(true);
                  setTimeout(() => navigate("/"), 300);
                }}
                onContinue={() => goToStep(2)}
                continueDisabled={!selectedFormat}
              />
            </>
          )}

          {/* Step 2: Upload Files */}
          {currentStep === 2 && (
            <>
              <StepHeader
                title="Upload images to convert"
                subtitle={`Converting to ${
                  formats.find((f) => f.id === selectedFormat)?.name || "format"
                }`}
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
                onBack={() => goToStep(1)}
                onContinue={checkNextStep}
                continueDisabled={uploadedFiles.length === 0}
              />
            </>
          )}

          {/* Step 3: Transparency Warning or Review */}
          {currentStep === 3 && (
            <>
              {showTransparencyWarning ? (
                // Show transparency warning
                <>
                  <StepHeader
                    title="Transparency Notice"
                    subtitle="Important information about your conversion"
                  />

                  <div
                    style={{
                      maxWidth: "600px",
                      margin: "0 auto",
                      marginBottom: "var(--space-xl)",
                    }}
                  >
                    <div
                      style={{
                        display: "flex",
                        alignItems: "center",
                        gap: "var(--space-md)",
                        padding: "var(--space-lg)",
                        background: "rgba(255, 215, 0, 0.1)",
                        border: "2px solid rgba(255, 215, 0, 0.3)",
                        borderRadius: "var(--radius-lg)",
                        marginBottom: "var(--space-xl)",
                      }}
                    >
                      <svg
                        style={{
                          width: "32px",
                          height: "32px",
                          color: "var(--color-yellow)",
                          flexShrink: 0,
                        }}
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="1.5"
                      >
                        <path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z"></path>
                        <line x1="12" y1="9" x2="12" y2="13"></line>
                        <line x1="12" y1="17" x2="12.01" y2="17"></line>
                      </svg>
                      <div>
                        <div
                          className="text-md"
                          style={{
                            marginBottom: "var(--space-sm)",
                            color: "var(--color-yellow)",
                          }}
                        >
                          Converting PNG to JPEG
                        </div>
                        <div
                          className="text-base"
                          style={{ color: "var(--text-primary)" }}
                        >
                          Transparent areas in your PNG images will be converted
                          to a white background in JPEG format.
                        </div>
                      </div>
                    </div>

                    <div
                      style={{
                        background: "var(--glass-medium)",
                        border: "1px solid var(--glass-border)",
                        borderRadius: "var(--radius-lg)",
                        padding: "var(--space-lg)",
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
                        What this means
                      </div>

                      <div
                        style={{
                          display: "flex",
                          flexDirection: "column",
                          gap: "var(--space-md)",
                        }}
                      >
                        <div
                          style={{ display: "flex", gap: "var(--space-sm)" }}
                        >
                          <span style={{ color: "var(--color-cyan)" }}>→</span>
                          <span className="text-base">
                            Logos with transparent backgrounds will get white
                            backgrounds
                          </span>
                        </div>
                        <div
                          style={{ display: "flex", gap: "var(--space-sm)" }}
                        >
                          <span style={{ color: "var(--color-cyan)" }}>→</span>
                          <span className="text-base">
                            Images with soft edges may appear with white halos
                          </span>
                        </div>
                        <div
                          style={{ display: "flex", gap: "var(--space-sm)" }}
                        >
                          <span style={{ color: "var(--color-cyan)" }}>→</span>
                          <span className="text-base">
                            This is perfect for photos but may affect graphics
                          </span>
                        </div>
                      </div>

                      <div
                        style={{
                          marginTop: "var(--space-lg)",
                          paddingTop: "var(--space-lg)",
                          borderTop: "1px solid var(--glass-border)",
                        }}
                      >
                        <div
                          className="text-sm"
                          style={{ color: "var(--text-secondary)" }}
                        >
                          <strong style={{ color: "var(--color-cyan)" }}>
                            Tip:
                          </strong>{" "}
                          For images requiring transparency, consider using PNG
                          or WebP format instead.
                        </div>
                      </div>
                    </div>
                  </div>

                  <NavigationButtons
                    onBack={() => goToStep(2)}
                    onContinue={() => goToStep(4)}
                    continueText="Understood, Continue"
                  />
                </>
              ) : (
                // Show review directly
                <>
                  <StepHeader
                    title="Ready to convert your images"
                    subtitle={`${
                      uploadedFiles.length
                    } files will be converted to ${
                      formats.find((f) => f.id === selectedFormat)?.name
                    }`}
                  />

                  <ReviewCard metrics={getMetrics()} />

                  {/* Preview Grid */}
                  <div
                    style={{
                      background: "var(--glass-light)",
                      border: "1px solid var(--glass-border)",
                      borderRadius: "var(--radius-lg)",
                      padding: "var(--space-lg)",
                      position: "relative",
                      marginTop: "var(--space-lg)",
                      marginBottom: "var(--space-xl)",
                    }}
                  >
                    <div
                      style={{
                        position: "absolute",
                        top: "var(--space-md)",
                        right: "var(--space-md)",
                        display: "flex",
                        background: "var(--glass-heavy)",
                        border: "1px solid var(--glass-border)",
                        borderRadius: "var(--radius-full)",
                        overflow: "hidden",
                      }}
                    >
                      <button
                        className="text-xs"
                        style={{
                          padding: "6px 12px",
                          background:
                            previewMode === "before"
                              ? "linear-gradient(135deg, rgba(0, 240, 255, 0.2), rgba(147, 51, 234, 0.2))"
                              : "transparent",
                          border: "none",
                          color:
                            previewMode === "before"
                              ? "var(--color-cyan)"
                              : "var(--text-secondary)",
                          cursor: "pointer",
                          textTransform: "uppercase",
                          letterSpacing: "var(--letter-spacing-wider)",
                          transition: "all var(--duration-normal)",
                        }}
                        onClick={() => setPreviewMode("before")}
                      >
                        Before
                      </button>
                      <button
                        className="text-xs"
                        style={{
                          padding: "6px 12px",
                          background:
                            previewMode === "after"
                              ? "linear-gradient(135deg, rgba(0, 240, 255, 0.2), rgba(147, 51, 234, 0.2))"
                              : "transparent",
                          border: "none",
                          color:
                            previewMode === "after"
                              ? "var(--color-cyan)"
                              : "var(--text-secondary)",
                          cursor: "pointer",
                          textTransform: "uppercase",
                          letterSpacing: "var(--letter-spacing-wider)",
                          transition: "all var(--duration-normal)",
                        }}
                        onClick={() => setPreviewMode("after")}
                      >
                        After
                      </button>
                    </div>

                    <div
                      className="text-sm"
                      style={{
                        textTransform: "uppercase",
                        letterSpacing: "var(--letter-spacing-wider)",
                        color: "var(--text-tertiary)",
                        marginBottom: "var(--space-lg)",
                      }}
                    >
                      Preview -{" "}
                      {previewMode === "before" ? "Original" : "Converted"}
                    </div>

                    <div
                      style={{
                        display: "grid",
                        gridTemplateColumns:
                          "repeat(auto-fit, minmax(150px, 1fr))",
                        gap: "var(--space-md)",
                      }}
                    >
                      {uploadedFiles.slice(0, 4).map((file, index) => (
                        <div
                          key={index}
                          style={{
                            aspectRatio: "1",
                            background: "var(--glass-medium)",
                            border: "1px solid var(--glass-border)",
                            borderRadius: "var(--radius-md)",
                            position: "relative",
                            overflow: "hidden",
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "center",
                          }}
                        >
                          <svg
                            style={{
                              width: "32px",
                              height: "32px",
                              color: "var(--text-tertiary)",
                              opacity: 0.5,
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
                            style={{
                              position: "absolute",
                              bottom: "var(--space-sm)",
                              left: "var(--space-sm)",
                              right: "var(--space-sm)",
                              background: "var(--glass-heavy)",
                              backdropFilter: "blur(10px)",
                              padding: "4px 8px",
                              borderRadius: "var(--radius-sm)",
                              fontSize: "11px",
                              textTransform: "uppercase",
                              letterSpacing: "1px",
                              textAlign: "center",
                            }}
                          >
                            {previewMode === "before"
                              ? file.name.split(".").pop()
                              : selectedFormat}
                          </div>
                        </div>
                      ))}
                      {uploadedFiles.length > 4 && (
                        <div
                          style={{
                            aspectRatio: "1",
                            background: "var(--glass-medium)",
                            border: "1px solid var(--glass-border)",
                            borderRadius: "var(--radius-md)",
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "center",
                            color: "var(--text-secondary)",
                          }}
                        >
                          +{uploadedFiles.length - 4} more
                        </div>
                      )}
                    </div>
                  </div>

                  <NavigationButtons
                    onBack={() => goToStep(2)}
                    onContinue={() => startProcessing()}
                    continueText="Convert Files"
                  />
                </>
              )}
            </>
          )}

          {/* Step 4: Processing */}
          {currentStep === 4 && (
            <div style={{ textAlign: "center", padding: "var(--space-3xl)" }}>
              <ProcessingSpinner
                message={
                  processingProgress < 50
                    ? "Analyzing your images..."
                    : processingProgress < 90
                    ? `Converting to ${
                        formats.find((f) => f.id === selectedFormat)?.name
                      }...`
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

          {/* Step 5: Success */}
          {currentStep === 5 && !isProcessing && (
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
                Conversion complete!
              </h2>

              <p
                className="text-base"
                style={{
                  color: "var(--text-secondary)",
                  marginBottom: "var(--space-xl)",
                }}
              >
                {processedFiles.length} files converted to{" "}
                {formats.find((f) => f.id === selectedFormat)?.name}
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
                  Ready for download
                </div>

                {processedFiles.length > 0 && (
                  <div
                    style={{
                      background: "var(--glass-light)",
                      border: "1px solid var(--glass-border)",
                      borderRadius: "var(--radius-md)",
                      padding: "var(--space-md)",
                      display: "flex",
                      alignItems: "center",
                      gap: "var(--space-md)",
                    }}
                  >
                    <div
                      style={{
                        width: "50px",
                        height: "50px",
                        background: "var(--glass-medium)",
                        border: "1px solid var(--glass-border)",
                        borderRadius: "var(--radius-sm)",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        flexShrink: 0,
                      }}
                    >
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
                    </div>

                    <div style={{ flex: 1, textAlign: "left" }}>
                      <div
                        className="text-base"
                        style={{ marginBottom: "2px" }}
                      >
                        {processedFiles.length === 1
                          ? getNewFilename(
                              processedFiles[0].name,
                              selectedFormat
                            )
                          : `${processedFiles.length} files`}
                      </div>
                      <div
                        className="text-sm"
                        style={{ color: "var(--text-secondary)" }}
                      >
                        {processedFiles
                          .reduce((sum, f) => {
                            const sizeNum = parseFloat(f.sizeText) || 0;
                            return sum + sizeNum;
                          }, 0)
                          .toFixed(1)}{" "}
                        MB
                      </div>
                    </div>
                  </div>
                )}
              </div>

              <div
                style={{
                  background: "var(--glass-light)",
                  border: "1px solid var(--glass-border)",
                  borderRadius: "var(--radius-lg)",
                  padding: "var(--space-lg)",
                  maxWidth: "600px",
                  margin: "0 auto var(--space-xl)",
                  backdropFilter: "blur(20px)",
                }}
              >
                <h3
                  className="text-md"
                  style={{
                    fontWeight: "400",
                    marginBottom: "var(--space-md)",
                  }}
                >
                  Ready for Download
                </h3>

                <p
                  className="text-sm"
                  style={{
                    color: "var(--text-secondary)",
                    marginBottom: "var(--space-lg)",
                  }}
                >
                  Total size:{" "}
                  {processedFiles
                    .reduce((sum, f) => {
                      const sizeNum = parseFloat(f.sizeText) || 0;
                      return sum + sizeNum;
                    }, 0)
                    .toFixed(1)}{" "}
                  MB
                </p>

                <div
                  style={{
                    display: "flex",
                    flexDirection: "column",
                    gap: "var(--space-sm)",
                    marginBottom: "var(--space-lg)",
                  }}
                >
                  {processedFiles.slice(0, 5).map((file, index) => (
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
                      }}
                    >
                      <div
                        style={{
                          width: "40px",
                          height: "40px",
                          background: "var(--glass-light)",
                          border: "1px solid var(--glass-border)",
                          borderRadius: "var(--radius-sm)",
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "center",
                          flexShrink: 0,
                        }}
                      >
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
                      </div>

                      <div style={{ flex: 1, textAlign: "left" }}>
                        <div
                          className="text-sm"
                          style={{ marginBottom: "2px" }}
                        >
                          {getNewFilename(file.name, selectedFormat)}
                        </div>
                        <div
                          className="text-xs"
                          style={{ color: "var(--text-secondary)" }}
                        >
                          {file.sizeText}
                        </div>
                      </div>

                      <button
                        onClick={() => handleDownload(file, index)}
                        className="btn btn-ghost"
                        style={{
                          padding: "8px 16px",
                          minWidth: "auto",
                          fontSize: "var(--font-size-sm)",
                        }}
                      >
                        Download
                      </button>
                    </div>
                  ))}
                </div>

                {processedFiles.length > 5 && (
                  <div
                    className="text-sm"
                    style={{
                      color: "var(--text-secondary)",
                      marginBottom: "var(--space-md)",
                    }}
                  >
                    +{processedFiles.length - 5} more files
                  </div>
                )}

                <button
                  className="btn btn-primary"
                  onClick={handleDownloadAll}
                  style={{ width: "100%" }}
                >
                  Download All as ZIP
                </button>
              </div>

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
                    // Reset and go back to upload
                    setUploadedFiles([]);
                    setProcessedFiles([]);
                    setCurrentStep(2);
                  }}
                >
                  Convert More Files
                </button>
                <button
                  className="btn btn-success"
                  onClick={() => {
                    // Reset everything and go to format selection
                    setSelectedFormat(null);
                    setUploadedFiles([]);
                    setProcessedFiles([]);
                    setShowTransparencyWarning(false);
                    setCurrentStep(1);
                  }}
                >
                  Try Different Format
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </>
  );
}

export default FileConverter;
