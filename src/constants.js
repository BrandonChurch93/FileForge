// File handling limits
export const FILE_LIMITS = {
  maxCount: 10,
  maxSize: 50 * 1024 * 1024, // 50MB per file
  maxTotal: 100 * 1024 * 1024, // 100MB total
};

// Platform size limits (in bytes)
export const PLATFORM_LIMITS = {
  gmail: 25 * 1024 * 1024, // 25MB
  outlook: 20 * 1024 * 1024, // 20MB
  discord: 8 * 1024 * 1024, // 8MB
  slack: 25 * 1024 * 1024, // 25MB
  whatsapp: 16 * 1024 * 1024, // 16MB
  telegram: 50 * 1024 * 1024, // 50MB
  wetransfer: 2 * 1024 * 1024 * 1024, // 2GB
  custom: 10 * 1024 * 1024, // 10MB default
};

// Supported file formats
export const SUPPORTED_FORMATS = {
  input: ["jpg", "jpeg", "png", "webp", "pdf"],
  output: ["jpg", "png", "webp"],
};

// Icon generation sizes (in pixels)
export const ICON_SIZES = {
  web: [16, 32, 192, 512],
  apple: 180,
  android: [48, 72, 96, 144, 192],
};

// Compression quality presets
export const COMPRESSION_QUALITY = {
  speed: 0.6, // 60% quality - fast processing
  balanced: 0.8, // 80% quality - good balance
  quality: 0.92, // 92% quality - minimal loss
};

// Error messages
export const ERROR_MESSAGES = {
  fileTooLarge: "File exceeds maximum size of 50MB",
  tooManyFiles: "Maximum 10 files allowed",
  unsupportedFormat: "File format not supported",
  processingFailed: "Failed to process file. Please try again.",
  browserNotSupported: "Your browser does not support this feature",
  noFilesSelected: "Please select at least one file",
  webpNotSupported: "WebP format is not supported in your browser",
};

// Success messages
export const SUCCESS_MESSAGES = {
  filesCompressed: "Files compressed successfully!",
  filesConverted: "Files converted successfully!",
  pdfCreated: "PDF created successfully!",
  iconsGenerated: "Icons generated successfully!",
  optimizationComplete: "Optimization complete!",
};

// Journey metadata for landing page
export const JOURNEY_META = {
  email: {
    title: "Smart Email",
    description: "Compress attachments to fit any email platform",
    icon: "📧",
    route: "/email",
    color: "blue",
  },
  convert: {
    title: "File Converter",
    description: "Convert images between formats instantly",
    icon: "🔄",
    route: "/convert",
    color: "purple",
  },
  pdf: {
    title: "PDF Studio",
    description: "Combine, split, and manage PDF files",
    icon: "📄",
    route: "/pdf",
    color: "red",
  },
  optimize: {
    title: "Web Optimizer",
    description: "Optimize images for faster web performance",
    icon: "⚡",
    route: "/optimize",
    color: "green",
  },
  icons: {
    title: "Icon Generator",
    description: "Create favicons and app icons in all sizes",
    icon: "🎨",
    route: "/icons",
    color: "orange",
  },
};
