document.addEventListener("DOMContentLoaded", () => {
  const startBtn = document.getElementById("startQuiz");
  const questionInput = document.getElementById("questionCount");

  if (!startBtn) return;

  startBtn.addEventListener("click", async () => {
    const questions = Math.min(
      10,
      Math.max(3, parseInt(questionInput.value) || 5)
    );

    // Get selected text source
    const textSource = document.querySelector('input[name="textSource"]:checked').value;

    try {
      // Get active tab
      const tabs = await chrome.tabs.query({ active: true, currentWindow: true });
      if (!tabs[0]) return;

      // First inject content.js (if not already there)
      await chrome.scripting.executeScript({
        target: { tabId: tabs[0].id },
        files: ["content.js"],
      });

      // Now send the message including text source
      const response = await chrome.tabs.sendMessage(
        tabs[0].id,
        { action: "startQuiz", questions, textSource }
      );
      console.log("Message delivered:", response);
    } catch (error) {
      console.error("Extension error:", error);
      alert("Failed to start quiz. Please try refreshing the page and try again.");
    }
  });
});
