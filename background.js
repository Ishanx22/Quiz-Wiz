// Background service worker for QuizWiz extension
chrome.runtime.onInstalled.addListener((details) => {
  console.log('QuizWiz extension installed/updated:', details.reason);
});

// Handle extension startup
chrome.runtime.onStartup.addListener(() => {
  console.log('QuizWiz extension started');
});

// Optional: Handle messages from content script or popup if needed
chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  // Handle any background processing if needed in the future
  return false; // Not handling async responses for now
});
