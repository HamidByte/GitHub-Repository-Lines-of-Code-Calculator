// Define common patterns
const commonCommentPatterns = {
  doubleSlash: /(?:\s|^)\/\/\s*(.+)/g, // // comment
  block: /\/\*([\s\S]*?)\*\//g, // /* comment */
  jsx: /\{(\s*\/\*[\s\S]*?\*\/\s*)\}/g, // { /* comment */ }
  hash: /^\s*#(.*)$/gm, // # comment
  pyMultiline: /"""([\s\S]*?)"""/g, // """ comment """
  html: /^\s*<!--\s*([^]*?)\s*-->\s*$/gm // <!-- comment -->
}

// Regular expressions for detecting comments in different languages
const languageCommentPatterns = {
  js: {
    doubleSlash: commonCommentPatterns.doubleSlash,
    block: commonCommentPatterns.block
  },
  jsx: {
    jsx: commonCommentPatterns.jsx
  },
  vue: {
    doubleSlash: commonCommentPatterns.doubleSlash,
    block: commonCommentPatterns.block,
    html: commonCommentPatterns.html
  },
  json: {
    doubleSlash: commonCommentPatterns.doubleSlash,
    block: commonCommentPatterns.block
  },
  cjs: {
    doubleSlash: commonCommentPatterns.doubleSlash,
    block: commonCommentPatterns.block
  },
  html: {
    html: commonCommentPatterns.html
  },
  css: {
    block: commonCommentPatterns.block
  },
  scss: {
    block: commonCommentPatterns.block
  },
  py: {
    hash: commonCommentPatterns.hash,
    pyMultiline: commonCommentPatterns.pyMultiline
  },
  php: {
    hash: commonCommentPatterns.hash,
    doubleSlash: commonCommentPatterns.doubleSlash,
    block: commonCommentPatterns.block
  }
  // Add more patterns for other languages as needed
}

// Function to detect comments in a given code snippet based on language
export function detectComments(code, extension) {
  const allComments = []

  // Get the comment patterns for the specified extension
  const patterns = languageCommentPatterns[extension]

  // If the extension exist in languageCommentPatterns
  if (patterns) {
    // Loop through comment patterns and check for matches
    for (const patternKey in patterns) {
      const pattern = patterns[patternKey]
      const matches = code.match(pattern)

      if (matches) {
        // Add matches to the array of all comments
        allComments.push(...matches.map(comment => comment.trim()))
      }
    }
  } else {
    // If the extension is not in languageCommentPatterns, use common patterns
    for (const patternKey in commonCommentPatterns) {
      const pattern = commonCommentPatterns[patternKey]
      const matches = code.match(pattern)

      if (matches) {
        // Add matches to the array of all comments
        allComments.push(...matches.map(comment => comment.trim()))
      }
    }
  }

  return allComments
}
