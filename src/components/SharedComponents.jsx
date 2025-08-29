// This file will contain ALL reusable UI components
// Currently empty, will be populated in Phase 2

// ProgressBar: Shows step progress
export function ProgressBar({ currentStep, totalSteps }) {
  return null; // To be implemented
}

// FileUpload: Drag-drop zone and file input
export function FileUpload({ onFilesSelected, maxFiles, accept }) {
  return null; // To be implemented
}

// FileList: Display uploaded files with remove
export function FileList({ files, onRemove }) {
  return null; // To be implemented
}

// PlatformCard: Platform selection (Gmail, Discord, etc)
export function PlatformCard({ platform, selected, onClick }) {
  return null; // To be implemented
}

// FormatCard: Format selection with pros/cons
export function FormatCard({ format, selected, onClick }) {
  return null; // To be implemented
}

// NavigationButtons: Back/Continue buttons
export function NavigationButtons({
  onBack,
  onContinue,
  backDisabled,
  continueDisabled,
}) {
  return null; // To be implemented
}

// ProcessingSpinner: Loading animation
export function ProcessingSpinner({ message }) {
  return null; // To be implemented
}

// SuccessScreen: Generic success display
export function SuccessScreen({ title, message, files }) {
  return null; // To be implemented
}

// StepHeader: Title/subtitle for steps
export function StepHeader({ title, subtitle }) {
  return null; // To be implemented
}

// ReviewCard: Metrics display
export function ReviewCard({ metrics }) {
  return null; // To be implemented
}

// DownloadSection: File download UI
export function DownloadSection({ files, onDownload }) {
  return null; // To be implemented
}
