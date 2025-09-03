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
import { FILE_LIMITS, SUPPORTED_FORMATS } from "../constants";

function PDFStudio() {
  const navigate = useNavigate();

  // State management
  const [currentStep, setCurrentStep] = useState(1);
  const [totalSteps, setTotalSteps] = useState(5); // Base steps
  const [selectedAction, setSelectedAction] = useState(null);
  const [uploadedFiles, setUploadedFiles] = useState([]);
  const [selectedPages, setSelectedPages] = useState([]);
  const [pageOrder, setPageOrder] = useState([]);
  const [isProcessing, setIsProcessing] = useState(false);
  const [processingProgress, setProcessingProgress] = useState(0);
  const [processedFile, setProcessedFile] = useState(null);
  const [animatingOut, setAnimatingOut] = useState(false);
  const [animatingIn, setAnimatingIn] = useState(true);
  const [pageLoaded, setPageLoaded] = useState(false);

  // Conditional steps
  const [hasPageSelection, setHasPageSelection] = useState(false);

  // Initial page load animation
  useEffect(() => {
    setTimeout(() => {
      setPageLoaded(true);
      setAnimatingIn(false);
    }, 500);
  }, []);

  // Update total steps based on selected action
  useEffect(() => {
    let steps = 4; // Base: Action, Upload, Review, Success

    if (selectedAction === "extract" || selectedAction === "split") {
      steps = 5; // Add page selection step
      setHasPageSelection(true);
    } else if (selectedAction === "combine" || selectedAction === "merge") {
      if (uploadedFiles.length > 1) {
        steps = 5; // Add reorder step
        setHasPageSelection(true);
      } else {
        setHasPageSelection(false);
      }
    } else {
      setHasPageSelection(false);
    }

    setTotalSteps(steps);
  }, [selectedAction, uploadedFiles]);

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

  // Handle action selection
  const handleActionSelect = (action) => {
    setSelectedAction(action);
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

  // Check if we need page selection/reorder step
  const checkForPageStep = () => {
    if (selectedAction === "extract" || selectedAction === "split") {
      // Need page selection
      preparePageSelection();
      goToStep(3);
    } else if (
      (selectedAction === "combine" || selectedAction === "merge") &&
      uploadedFiles.length > 1
    ) {
      // Need reorder
      prepareReorderStep();
      goToStep(3);
    } else {
      // Skip to review
      goToStep(totalSteps - 1);
    }
  };

  // Prepare page selection for extract/split
  const preparePageSelection = () => {
    // Simulate PDF page count (in real app, this would come from PDF analysis)
    const pageCount = 10;
    const pages = [];
    for (let i = 1; i <= pageCount; i++) {
      pages.push(i);
    }
    setPageOrder(pages);
    setSelectedPages([]);
  };

  // Prepare reorder step
  const prepareReorderStep = () => {
    // Initialize page order based on uploaded files
    const order = uploadedFiles.map((_, index) => index);
    setPageOrder(order);
  };

  // Toggle page selection
  const togglePageSelection = (pageNum) => {
    setSelectedPages((prev) => {
      if (prev.includes(pageNum)) {
        return prev.filter((p) => p !== pageNum);
      } else {
        return [...prev, pageNum].sort((a, b) => a - b);
      }
    });
  };

  // Select all pages
  const selectAllPages = () => {
    setSelectedPages(pageOrder);
  };

  // Clear page selection
  const clearPageSelection = () => {
    setSelectedPages([]);
  };

  // Start processing
  const startProcessing = () => {
    setIsProcessing(true);
    goToStep(totalSteps);

    // Simulate processing
    const steps = [
      { progress: 25, message: "Analyzing your files..." },
      { progress: 50, message: "Processing PDF operations..." },
      { progress: 75, message: "Optimizing output..." },
      { progress: 100, message: "Complete!" },
    ];

    let stepIndex = 0;
    const interval = setInterval(() => {
      if (stepIndex < steps.length) {
        setProcessingProgress(steps[stepIndex].progress);
        stepIndex++;
      } else {
        clearInterval(interval);
        // Simulate processed file
        setProcessedFile({
          name: getOutputFileName(),
          size: "12.3 MB",
          pages: selectedPages.length || uploadedFiles.length || 1,
        });
        setIsProcessing(false);
      }
    }, 1000);
  };

  // Get output file name based on action
  const getOutputFileName = () => {
    switch (selectedAction) {
      case "combine":
        return "combined-images.pdf";
      case "merge":
        return "merged-document.pdf";
      case "extract":
        return "extracted-images.zip";
      case "split":
        return "split-pages.pdf";
      default:
        return "processed.pdf";
    }
  };

  // Get step name for progress bar
  const getStepName = () => {
    switch (currentStep) {
      case 1:
        return "Choose Action";
      case 2:
        return "Upload Files";
      case 3:
        if (selectedAction === "extract" || selectedAction === "split") {
          return "Select Pages";
        } else if (selectedAction === "combine" || selectedAction === "merge") {
          return "Arrange Pages";
        }
        return "Configure";
      case 4:
        return isProcessing ? "Processing" : "Review";
      case 5:
        return isProcessing
          ? "Processing"
          : totalSteps === 5
          ? "Complete!"
          : "Review";
      default:
        return "";
    }
  };

  // Get review metrics
  const getReviewMetrics = () => {
    const actionNames = {
      combine: "Combine Images to PDF",
      extract: "Extract Images from PDF",
      merge: "Merge PDFs",
      split: "Split PDF",
    };

    const metrics = {
      Action: actionNames[selectedAction] || "-",
      Files: `${uploadedFiles.length} ${
        uploadedFiles.length === 1 ? "file" : "files"
      }`,
      Output:
        selectedAction === "extract"
          ? "Individual images (ZIP)"
          : "1 PDF document",
    };

    if (selectedAction === "extract" || selectedAction === "split") {
      metrics["Pages selected"] = `${selectedPages.length} pages`;
    }

    if (selectedAction === "combine" || selectedAction === "merge") {
      metrics["Total pages"] = `${uploadedFiles.length} pages`;
    }

    metrics["Processing"] = "Convert to images internally";

    return metrics;
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
          {/* Step 1: Action Selection */}
          {currentStep === 1 && (
            <>
              <StepHeader
                title="What do you need to do?"
                subtitle="Choose your PDF operation"
              />

              <div
                style={{
                  display: "grid",
                  gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))",
                  gap: "var(--space-md)",
                  marginBottom: "var(--space-xl)",
                }}
              >
                {/* Combine Images to PDF */}
                <div
                  className={`action-card ${
                    selectedAction === "combine" ? "selected" : ""
                  }`}
                  onClick={() => handleActionSelect("combine")}
                  style={{
                    padding: "var(--space-lg)",
                    background:
                      selectedAction === "combine"
                        ? "rgba(0, 240, 255, 0.05)"
                        : "var(--glass-medium)",
                    border:
                      selectedAction === "combine"
                        ? "2px solid var(--color-cyan)"
                        : "1px solid var(--glass-border)",
                    borderRadius: "var(--radius-lg)",
                    cursor: "pointer",
                    transition: "all var(--duration-normal)",
                    position: "relative",
                    overflow: "hidden",
                  }}
                  onMouseEnter={(e) => {
                    if (selectedAction !== "combine") {
                      e.currentTarget.style.transform = "translateY(-4px)";
                      e.currentTarget.style.borderColor =
                        "rgba(0, 240, 255, 0.3)";
                    }
                  }}
                  onMouseLeave={(e) => {
                    if (selectedAction !== "combine") {
                      e.currentTarget.style.transform = "translateY(0)";
                      e.currentTarget.style.borderColor = "var(--glass-border)";
                    }
                  }}
                >
                  {selectedAction === "combine" && (
                    <div
                      style={{
                        position: "absolute",
                        top: "var(--space-md)",
                        right: "var(--space-md)",
                        width: "24px",
                        height: "24px",
                        background:
                          "linear-gradient(135deg, rgba(0, 240, 255, 0.2), rgba(147, 51, 234, 0.2))",
                        border: "1px solid var(--color-cyan)",
                        borderRadius: "var(--radius-full)",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
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
                      width: "48px",
                      height: "48px",
                      background:
                        "linear-gradient(135deg, rgba(0, 240, 255, 0.2), rgba(147, 51, 234, 0.2))",
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
                        color: "var(--color-cyan)",
                      }}
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="1.5"
                    >
                      <rect x="3" y="3" width="7" height="7"></rect>
                      <rect x="14" y="3" width="7" height="7"></rect>
                      <rect x="3" y="14" width="7" height="7"></rect>
                      <rect x="14" y="14" width="7" height="7"></rect>
                    </svg>
                  </div>

                  <h3
                    className="text-md"
                    style={{
                      marginBottom: "var(--space-sm)",
                      fontWeight: "400",
                    }}
                  >
                    Combine Images to PDF
                  </h3>
                  <p
                    className="text-sm"
                    style={{
                      color: "var(--text-secondary)",
                      marginBottom: "var(--space-sm)",
                    }}
                  >
                    Turn multiple images into one PDF
                  </p>
                  <p
                    className="text-xs"
                    style={{ color: "var(--text-tertiary)" }}
                  >
                    Perfect for presentations and portfolios
                  </p>
                </div>

                {/* Extract Images from PDF */}
                <div
                  className={`action-card ${
                    selectedAction === "extract" ? "selected" : ""
                  }`}
                  onClick={() => handleActionSelect("extract")}
                  style={{
                    padding: "var(--space-lg)",
                    background:
                      selectedAction === "extract"
                        ? "rgba(0, 240, 255, 0.05)"
                        : "var(--glass-medium)",
                    border:
                      selectedAction === "extract"
                        ? "2px solid var(--color-cyan)"
                        : "1px solid var(--glass-border)",
                    borderRadius: "var(--radius-lg)",
                    cursor: "pointer",
                    transition: "all var(--duration-normal)",
                    position: "relative",
                    overflow: "hidden",
                  }}
                  onMouseEnter={(e) => {
                    if (selectedAction !== "extract") {
                      e.currentTarget.style.transform = "translateY(-4px)";
                      e.currentTarget.style.borderColor =
                        "rgba(0, 240, 255, 0.3)";
                    }
                  }}
                  onMouseLeave={(e) => {
                    if (selectedAction !== "extract") {
                      e.currentTarget.style.transform = "translateY(0)";
                      e.currentTarget.style.borderColor = "var(--glass-border)";
                    }
                  }}
                >
                  {selectedAction === "extract" && (
                    <div
                      style={{
                        position: "absolute",
                        top: "var(--space-md)",
                        right: "var(--space-md)",
                        width: "24px",
                        height: "24px",
                        background:
                          "linear-gradient(135deg, rgba(0, 240, 255, 0.2), rgba(147, 51, 234, 0.2))",
                        border: "1px solid var(--color-cyan)",
                        borderRadius: "var(--radius-full)",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
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
                      width: "48px",
                      height: "48px",
                      background:
                        "linear-gradient(135deg, rgba(0, 240, 255, 0.2), rgba(147, 51, 234, 0.2))",
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
                        color: "var(--color-cyan)",
                      }}
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="1.5"
                    >
                      <rect x="8" y="2" width="8" height="11"></rect>
                      <path d="M8 13 L3 18 M16 13 L21 18"></path>
                      <rect x="2" y="17" width="5" height="5"></rect>
                      <rect x="17" y="17" width="5" height="5"></rect>
                    </svg>
                  </div>

                  <h3
                    className="text-md"
                    style={{
                      marginBottom: "var(--space-sm)",
                      fontWeight: "400",
                    }}
                  >
                    Extract Images from PDF
                  </h3>
                  <p
                    className="text-sm"
                    style={{
                      color: "var(--text-secondary)",
                      marginBottom: "var(--space-sm)",
                    }}
                  >
                    Save PDF pages as individual images
                  </p>
                  <p
                    className="text-xs"
                    style={{ color: "var(--text-tertiary)" }}
                  >
                    Great for reusing content
                  </p>
                </div>

                {/* Merge PDFs */}
                <div
                  className={`action-card ${
                    selectedAction === "merge" ? "selected" : ""
                  }`}
                  onClick={() => handleActionSelect("merge")}
                  style={{
                    padding: "var(--space-lg)",
                    background:
                      selectedAction === "merge"
                        ? "rgba(0, 240, 255, 0.05)"
                        : "var(--glass-medium)",
                    border:
                      selectedAction === "merge"
                        ? "2px solid var(--color-cyan)"
                        : "1px solid var(--glass-border)",
                    borderRadius: "var(--radius-lg)",
                    cursor: "pointer",
                    transition: "all var(--duration-normal)",
                    position: "relative",
                    overflow: "hidden",
                  }}
                  onMouseEnter={(e) => {
                    if (selectedAction !== "merge") {
                      e.currentTarget.style.transform = "translateY(-4px)";
                      e.currentTarget.style.borderColor =
                        "rgba(0, 240, 255, 0.3)";
                    }
                  }}
                  onMouseLeave={(e) => {
                    if (selectedAction !== "merge") {
                      e.currentTarget.style.transform = "translateY(0)";
                      e.currentTarget.style.borderColor = "var(--glass-border)";
                    }
                  }}
                >
                  {selectedAction === "merge" && (
                    <div
                      style={{
                        position: "absolute",
                        top: "var(--space-md)",
                        right: "var(--space-md)",
                        width: "24px",
                        height: "24px",
                        background:
                          "linear-gradient(135deg, rgba(0, 240, 255, 0.2), rgba(147, 51, 234, 0.2))",
                        border: "1px solid var(--color-cyan)",
                        borderRadius: "var(--radius-full)",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
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
                      width: "48px",
                      height: "48px",
                      background:
                        "linear-gradient(135deg, rgba(0, 240, 255, 0.2), rgba(147, 51, 234, 0.2))",
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
                        color: "var(--color-cyan)",
                      }}
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="1.5"
                    >
                      <path d="M5 12H19M12 5L19 12L12 19"></path>
                    </svg>
                  </div>

                  <h3
                    className="text-md"
                    style={{
                      marginBottom: "var(--space-sm)",
                      fontWeight: "400",
                    }}
                  >
                    Merge PDFs
                  </h3>
                  <p
                    className="text-sm"
                    style={{
                      color: "var(--text-secondary)",
                      marginBottom: "var(--space-sm)",
                    }}
                  >
                    Combine multiple PDFs into one
                  </p>
                  <p
                    className="text-xs"
                    style={{ color: "var(--text-tertiary)" }}
                  >
                    Ideal for document consolidation
                  </p>
                </div>

                {/* Split PDF */}
                <div
                  className={`action-card ${
                    selectedAction === "split" ? "selected" : ""
                  }`}
                  onClick={() => handleActionSelect("split")}
                  style={{
                    padding: "var(--space-lg)",
                    background:
                      selectedAction === "split"
                        ? "rgba(0, 240, 255, 0.05)"
                        : "var(--glass-medium)",
                    border:
                      selectedAction === "split"
                        ? "2px solid var(--color-cyan)"
                        : "1px solid var(--glass-border)",
                    borderRadius: "var(--radius-lg)",
                    cursor: "pointer",
                    transition: "all var(--duration-normal)",
                    position: "relative",
                    overflow: "hidden",
                  }}
                  onMouseEnter={(e) => {
                    if (selectedAction !== "split") {
                      e.currentTarget.style.transform = "translateY(-4px)";
                      e.currentTarget.style.borderColor =
                        "rgba(0, 240, 255, 0.3)";
                    }
                  }}
                  onMouseLeave={(e) => {
                    if (selectedAction !== "split") {
                      e.currentTarget.style.transform = "translateY(0)";
                      e.currentTarget.style.borderColor = "var(--glass-border)";
                    }
                  }}
                >
                  {selectedAction === "split" && (
                    <div
                      style={{
                        position: "absolute",
                        top: "var(--space-md)",
                        right: "var(--space-md)",
                        width: "24px",
                        height: "24px",
                        background:
                          "linear-gradient(135deg, rgba(0, 240, 255, 0.2), rgba(147, 51, 234, 0.2))",
                        border: "1px solid var(--color-cyan)",
                        borderRadius: "var(--radius-full)",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
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
                      width: "48px",
                      height: "48px",
                      background:
                        "linear-gradient(135deg, rgba(0, 240, 255, 0.2), rgba(147, 51, 234, 0.2))",
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
                        color: "var(--color-cyan)",
                      }}
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="1.5"
                    >
                      <path d="M16 3H21V8M4 21H9V16M21 3L12 12M9 16L4 21"></path>
                    </svg>
                  </div>

                  <h3
                    className="text-md"
                    style={{
                      marginBottom: "var(--space-sm)",
                      fontWeight: "400",
                    }}
                  >
                    Split PDF
                  </h3>
                  <p
                    className="text-sm"
                    style={{
                      color: "var(--text-secondary)",
                      marginBottom: "var(--space-sm)",
                    }}
                  >
                    Extract specific pages from a PDF
                  </p>
                  <p
                    className="text-xs"
                    style={{ color: "var(--text-tertiary)" }}
                  >
                    Perfect for sharing portions
                  </p>
                </div>
              </div>

              <NavigationButtons
                onBack={() => {
                  setAnimatingOut(true);
                  setTimeout(() => navigate("/"), 300);
                }}
                onContinue={() => goToStep(2)}
                continueDisabled={!selectedAction}
              />
            </>
          )}

          {/* Step 2: Upload Files */}
          {currentStep === 2 && (
            <>
              <StepHeader
                title={
                  selectedAction === "combine"
                    ? "Upload your images"
                    : selectedAction === "merge"
                    ? "Upload your PDFs"
                    : selectedAction === "extract" || selectedAction === "split"
                    ? "Upload your PDF"
                    : "Upload your files"
                }
                subtitle={
                  selectedAction === "combine" || selectedAction === "merge"
                    ? "Drag to reorder pages after uploading"
                    : selectedAction === "extract" || selectedAction === "split"
                    ? "You'll select pages in the next step"
                    : "Upload files to process"
                }
              />

              {uploadedFiles.length === 0 ? (
                <FileUpload
                  onFilesSelected={handleFilesSelected}
                  maxFiles={
                    selectedAction === "extract" || selectedAction === "split"
                      ? 1
                      : selectedAction === "merge"
                      ? 20
                      : 50
                  }
                  accept={
                    selectedAction === "combine"
                      ? "image/*"
                      : selectedAction === "merge" ||
                        selectedAction === "extract" ||
                        selectedAction === "split"
                      ? ".pdf"
                      : "*"
                  }
                  multiple={
                    selectedAction !== "extract" && selectedAction !== "split"
                  }
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
                    Total: {uploadedFiles.length}{" "}
                    {uploadedFiles.length === 1 ? "file" : "files"} •{" "}
                    {(
                      uploadedFiles.reduce((sum, f) => sum + f.size, 0) /
                      1024 /
                      1024
                    ).toFixed(1)}{" "}
                    MB
                  </div>

                  {(selectedAction === "combine" ||
                    (selectedAction === "merge" &&
                      uploadedFiles.length < 20)) && (
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
                        e.currentTarget.style.borderColor =
                          "var(--glass-border)";
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
                  )}
                  <input
                    id="hiddenFileInput"
                    type="file"
                    multiple={
                      selectedAction !== "extract" && selectedAction !== "split"
                    }
                    accept={
                      selectedAction === "combine"
                        ? "image/*"
                        : selectedAction === "merge" ||
                          selectedAction === "extract" ||
                          selectedAction === "split"
                        ? ".pdf"
                        : "*"
                    }
                    style={{ display: "none" }}
                    onChange={(e) =>
                      handleFilesSelected(Array.from(e.target.files))
                    }
                  />
                </>
              )}

              {selectedAction === "merge" && uploadedFiles.length === 1 && (
                <div
                  style={{
                    padding: "var(--space-md)",
                    background: "rgba(255, 215, 0, 0.1)",
                    border: "1px solid rgba(255, 215, 0, 0.3)",
                    borderRadius: "var(--radius-md)",
                    color: "var(--color-yellow)",
                    display: "flex",
                    alignItems: "center",
                    gap: "var(--space-sm)",
                    marginTop: "var(--space-md)",
                  }}
                >
                  <span>⚠️</span>
                  <span>
                    Please upload at least 2 PDFs to merge into one document
                  </span>
                </div>
              )}

              <NavigationButtons
                onBack={() => goToStep(1)}
                onContinue={checkForPageStep}
                continueDisabled={
                  uploadedFiles.length === 0 ||
                  (selectedAction === "merge" && uploadedFiles.length < 2)
                }
              />
            </>
          )}

          {/* Step 3: Page Selection / Reorder (CONDITIONAL) */}
          {currentStep === 3 && hasPageSelection && (
            <>
              {selectedAction === "extract" || selectedAction === "split" ? (
                // Page selection for extract/split
                <>
                  <StepHeader
                    title="Select pages to extract"
                    subtitle="Click to select • Shift-click for range"
                  />

                  <div
                    style={{
                      display: "flex",
                      justifyContent: "space-between",
                      alignItems: "center",
                      marginBottom: "var(--space-lg)",
                    }}
                  >
                    <div />
                    <div style={{ display: "flex", gap: "var(--space-sm)" }}>
                      <button
                        className="btn btn-secondary"
                        onClick={selectAllPages}
                        style={{
                          padding: "8px 16px",
                          minWidth: "auto",
                          fontSize: "var(--font-size-sm)",
                        }}
                      >
                        Select All
                      </button>
                      <button
                        className="btn btn-secondary"
                        onClick={clearPageSelection}
                        style={{
                          padding: "8px 16px",
                          minWidth: "auto",
                          fontSize: "var(--font-size-sm)",
                        }}
                      >
                        Clear Selection
                      </button>
                    </div>
                  </div>

                  <div
                    style={{
                      display: "grid",
                      gridTemplateColumns:
                        "repeat(auto-fill, minmax(120px, 1fr))",
                      gap: "var(--space-md)",
                      marginBottom: "var(--space-lg)",
                    }}
                  >
                    {pageOrder.map((pageNum) => (
                      <div
                        key={pageNum}
                        onClick={() => togglePageSelection(pageNum)}
                        style={{
                          cursor: "pointer",
                          transition: "all var(--duration-normal)",
                        }}
                      >
                        <div
                          style={{
                            aspectRatio: "3/4",
                            background: selectedPages.includes(pageNum)
                              ? "var(--glass-heavy)"
                              : "var(--glass-medium)",
                            border: selectedPages.includes(pageNum)
                              ? "2px solid var(--color-cyan)"
                              : "2px solid var(--glass-border)",
                            borderRadius: "var(--radius-md)",
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "center",
                            position: "relative",
                            overflow: "hidden",
                            transition: "all var(--duration-normal)",
                            boxShadow: selectedPages.includes(pageNum)
                              ? "0 0 20px rgba(0, 240, 255, 0.2)"
                              : "none",
                          }}
                          onMouseEnter={(e) => {
                            if (!selectedPages.includes(pageNum)) {
                              e.currentTarget.style.borderColor =
                                "rgba(0, 240, 255, 0.3)";
                              e.currentTarget.style.background =
                                "var(--glass-heavy)";
                            }
                          }}
                          onMouseLeave={(e) => {
                            if (!selectedPages.includes(pageNum)) {
                              e.currentTarget.style.borderColor =
                                "var(--glass-border)";
                              e.currentTarget.style.background =
                                "var(--glass-medium)";
                            }
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
                            <rect x="4" y="2" width="16" height="20"></rect>
                            <line x1="8" y1="6" x2="16" y2="6"></line>
                            <line x1="8" y1="10" x2="16" y2="10"></line>
                            <line x1="8" y1="14" x2="12" y2="14"></line>
                          </svg>

                          {selectedPages.includes(pageNum) && (
                            <div
                              style={{
                                position: "absolute",
                                top: "var(--space-xs)",
                                right: "var(--space-xs)",
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
                                  width: "16px",
                                  height: "16px",
                                  color: "var(--color-bg-dark)",
                                  strokeWidth: 3,
                                }}
                                viewBox="0 0 24 24"
                                fill="none"
                                stroke="currentColor"
                              >
                                <polyline points="20 6 9 17 4 12"></polyline>
                              </svg>
                            </div>
                          )}
                        </div>
                        <div
                          className="text-sm"
                          style={{
                            textAlign: "center",
                            marginTop: "var(--space-sm)",
                            color: selectedPages.includes(pageNum)
                              ? "var(--color-cyan)"
                              : "var(--text-secondary)",
                          }}
                        >
                          Page {pageNum}
                        </div>
                      </div>
                    ))}
                  </div>

                  <div
                    style={{
                      paddingTop: "var(--space-lg)",
                      borderTop: "1px solid var(--glass-border)",
                      display: "flex",
                      justifyContent: "space-between",
                      alignItems: "center",
                      marginBottom: "var(--space-xl)",
                    }}
                  >
                    <span
                      className="text-base"
                      style={{ color: "var(--text-secondary)" }}
                    >
                      Selected:{" "}
                      <strong style={{ color: "var(--color-cyan)" }}>
                        {selectedPages.length} of {pageOrder.length} pages
                      </strong>
                    </span>
                  </div>
                </>
              ) : (
                // Reorder for combine/merge
                <>
                  <StepHeader
                    title="Arrange your pages"
                    subtitle="Drag to reorder • Click to preview"
                  />

                  <div
                    className="text-base"
                    style={{
                      padding: "var(--space-md)",
                      background: "var(--glass-light)",
                      border: "1px solid var(--glass-border)",
                      borderRadius: "var(--radius-md)",
                      marginBottom: "var(--space-lg)",
                      textAlign: "center",
                      color: "var(--text-secondary)",
                    }}
                  >
                    💡 Pages will appear in this exact order in your PDF
                  </div>

                  <div
                    style={{
                      display: "grid",
                      gridTemplateColumns:
                        "repeat(auto-fill, minmax(150px, 1fr))",
                      gap: "var(--space-md)",
                      marginBottom: "var(--space-lg)",
                    }}
                  >
                    {uploadedFiles.map((file, index) => (
                      <div
                        key={index}
                        style={{
                          cursor: "move",
                          transition: "all var(--duration-normal)",
                        }}
                      >
                        <div
                          style={{
                            aspectRatio: "3/4",
                            background: "var(--glass-medium)",
                            border: "2px solid var(--glass-border)",
                            borderRadius: "var(--radius-md)",
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "center",
                            position: "relative",
                            overflow: "hidden",
                          }}
                        >
                          <div
                            style={{
                              position: "absolute",
                              top: "var(--space-sm)",
                              left: "var(--space-sm)",
                              background: "var(--glass-heavy)",
                              padding: "4px 8px",
                              borderRadius: "var(--radius-sm)",
                              fontSize: "11px",
                              color: "var(--color-cyan)",
                            }}
                          >
                            {index + 1}
                          </div>

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
                        </div>
                        <div
                          className="text-sm"
                          style={{
                            textAlign: "center",
                            marginTop: "var(--space-sm)",
                            color: "var(--text-secondary)",
                            overflow: "hidden",
                            textOverflow: "ellipsis",
                            whiteSpace: "nowrap",
                          }}
                        >
                          {file.name}
                        </div>
                      </div>
                    ))}
                  </div>
                </>
              )}

              <NavigationButtons
                onBack={() => goToStep(2)}
                onContinue={() => goToStep(totalSteps - 1)}
                continueDisabled={
                  (selectedAction === "extract" ||
                    selectedAction === "split") &&
                  selectedPages.length === 0
                }
              />
            </>
          )}

          {/* Review Step (always second to last) */}
          {currentStep === totalSteps - 1 && !isProcessing && (
            <>
              <StepHeader
                title="Review your PDF operation"
                subtitle="Ready to process"
              />

              <ReviewCard metrics={getReviewMetrics()} />

              <div
                style={{
                  background: "rgba(0, 240, 255, 0.05)",
                  border: "1px solid rgba(0, 240, 255, 0.2)",
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
                    color: "var(--color-cyan)",
                  }}
                >
                  <svg
                    style={{ width: "16px", height: "16px" }}
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="1.5"
                  >
                    <circle cx="12" cy="12" r="10"></circle>
                    <line x1="12" y1="16" x2="12" y2="12"></line>
                    <line x1="12" y1="8" x2="12.01" y2="8"></line>
                  </svg>
                  <strong>Note:</strong> All PDF operations convert to images
                  internally for simplified processing
                </div>
              </div>

              <NavigationButtons
                onBack={() => goToStep(hasPageSelection ? 3 : 2)}
                onContinue={startProcessing}
                continueText="Process PDF"
              />
            </>
          )}

          {/* Processing Step */}
          {currentStep === totalSteps && isProcessing && (
            <div style={{ textAlign: "center", padding: "var(--space-3xl)" }}>
              <ProcessingSpinner
                message={
                  processingProgress < 50
                    ? "Analyzing your files..."
                    : processingProgress < 75
                    ? "Processing PDF operations..."
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

          {/* Success Step */}
          {currentStep === totalSteps && !isProcessing && processedFile && (
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
                Your PDF is ready!
              </h2>

              <p
                className="text-base"
                style={{
                  color: "var(--text-secondary)",
                  marginBottom: "var(--space-xl)",
                }}
              >
                Optimized for your needs
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
                  Download ready
                </div>

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
                      <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path>
                      <polyline points="14 2 14 8 20 8"></polyline>
                      <line x1="16" y1="13" x2="8" y2="13"></line>
                      <line x1="16" y1="17" x2="8" y2="17"></line>
                    </svg>
                  </div>

                  <div style={{ flex: 1, textAlign: "left" }}>
                    <div className="text-base" style={{ marginBottom: "2px" }}>
                      {processedFile.name}
                    </div>
                    <div
                      className="text-sm"
                      style={{ color: "var(--text-secondary)" }}
                    >
                      {processedFile.size} • {processedFile.pages} pages
                    </div>
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
                Download PDF
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
                    // Reset for another operation
                    setSelectedAction(null);
                    setUploadedFiles([]);
                    setSelectedPages([]);
                    setPageOrder([]);
                    setProcessedFile(null);
                    setCurrentStep(1);
                  }}
                >
                  Create Another PDF
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </>
  );
}

export default PDFStudio;
