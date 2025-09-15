document.addEventListener("DOMContentLoaded", () => {
  const startBtn = document.getElementById("startQuiz");
  const questionInput = document.getElementById("questionCount"); // match variable

  if (!startBtn) return;

  startBtn.addEventListener("click", () => {
    const questions = Math.min(
      10,
      Math.max(3, parseInt(questionInput.value) || 5)
    );

    // Get selected text source
    const textSource = document.querySelector('input[name="textSource"]:checked').value;

    chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
      if (!tabs[0]) return;

      // First inject content.js (if not already there)
      chrome.scripting.executeScript(
        {
          target: { tabId: tabs[0].id },
          files: ["content.js"],
        },
        () => {
          if (chrome.runtime.lastError) {
            console.error("Injection failed:", chrome.runtime.lastError);
            return;
          }

          // Now send the message including text source
          chrome.tabs.sendMessage(
            tabs[0].id,
            { action: "startQuiz", questions, textSource },
            (response) => {
              if (chrome.runtime.lastError) {
                console.warn("QuizWiz: No content script in this tab.");
              } else {
                console.log("Message delivered:", response);
              }
            }
          );
        }
      );
    });
  });
});
