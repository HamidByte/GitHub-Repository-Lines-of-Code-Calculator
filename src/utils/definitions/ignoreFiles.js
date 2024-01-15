// Ignore specific filenames and wildcard extensions
export const ignoreFiles = [
  'package-lock.json',
  '*.jpg',
  '*.jpeg',
  '*.png',
  '*.gif',
  // '*.svg',
  '*.webp',
  '*.tiff',
  '*.psd',
  '*.pdf',
  '*.eps',
  '*.ai',
  '*.indd',
  '*.raw'
  // Add more filenames or wildcard extensions as needed
]

// Function to check if a filenames or wildcard extensions should be ignored
export function shouldIgnoreFile(fileName) {
  // Check specific filenames
  if (ignoreFiles.includes(fileName)) {
    return true
  }

  // Check wildcard extensions
  for (const wildcardExtension of ignoreFiles.filter(ext => ext.startsWith('*'))) {
    const extension = wildcardExtension.slice(1) // Remove the '*'
    if (fileName.endsWith(extension)) {
      return true
    }
  }

  return false
}
