// languageDetector.js

const detectLanguages = (code) => {
    const detectedLanguages = [];
  
    // Regular expressions and heuristic rules for language detection
    const languageRules = [
      { name: 'HTML', pattern: /<html>|<body>|<\/html>/, confidence: 0.8 },
      { name: 'CSS', pattern: /\.(css)/, confidence: 0.7 },
      { name: 'JavaScript', pattern: /function\s|=>|console\.log|document\.|window\./, confidence: 0.7 },
      { name: 'TypeScript', pattern: /interface\s|type\s|import\s|export\s|=>|console\.log|document\.|window\./, confidence: 0.7 },
      { name: 'Python', pattern: /def\s|import\s|from\s/, confidence: 0.6 },
      { name: 'JSON', pattern: /^[\],:{}\s]*$/, confidence: 0.6 } // Basic JSON detection
      // Add more rules for other languages as needed
    ];
  
    // Detect languages based on rules
    languageRules.forEach(rule => {
      if (rule.pattern.test(code)) {
        detectedLanguages.push({ language: rule.name, confidence: rule.confidence });
      }
    });
  
    return detectedLanguages;
  };
  
 export default detectLanguages
  