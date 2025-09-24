// Inject quiz sidebar
function showQuizSidebar(questionsCount, sourceText) {
  let sidebar = document.getElementById("quiz-sidebar");
  if (sidebar) return; // already exists

  sidebar = document.createElement("div");
  sidebar.id = "quiz-sidebar";
  sidebar.style.position = "fixed";
  sidebar.style.top = "0";
  sidebar.style.right = "0";
  sidebar.style.width = "350px";
  sidebar.style.height = "100%";
  sidebar.style.backgroundColor = "white";
  sidebar.style.color = "black";
  sidebar.style.borderLeft = "2px solid #ccc";
  sidebar.style.zIndex = "999999";
  sidebar.style.overflowY = "auto";
  sidebar.style.fontSize = "16px";
  sidebar.style.display = "flex";
  sidebar.style.flexDirection = "column";

  // Header with close button
  const header = document.createElement("div");
  header.style.position = "relative";
  header.style.flex = "0 0 auto";
  header.style.padding = "10px 20px";
  header.style.borderBottom = "1px solid #ccc";
  header.style.background = "#f9f9f9";

  const title = document.createElement("h2");
  title.textContent = "Quiz Wiz";
  title.style.margin = "0";
  title.style.fontSize = "18px";

  const closeBtn = document.createElement("button");
  closeBtn.textContent = "✖";
  closeBtn.style.position = "absolute";
  closeBtn.style.top = "10px";
  closeBtn.style.right = "10px";
  closeBtn.style.background = "#ff4444";
  closeBtn.style.color = "white";
  closeBtn.style.border = "none";
  closeBtn.style.borderRadius = "5px";
  closeBtn.style.padding = "5px 10px";
  closeBtn.style.cursor = "pointer";
  closeBtn.style.transition = "all 0.2s ease";

  closeBtn.addEventListener("mouseenter", () => {
    closeBtn.style.background = "#ff2222";
    closeBtn.style.transform = "scale(1.1)";
  });
  closeBtn.addEventListener("mouseleave", () => {
    closeBtn.style.background = "#ff4444";
    closeBtn.style.transform = "scale(1)";
  });
  closeBtn.addEventListener("click", () => sidebar.remove());

  header.appendChild(title);
  header.appendChild(closeBtn);
  sidebar.appendChild(header);

  // Content area (questions/results will go here)
  const quizContent = document.createElement("div");
  quizContent.id = "quiz-content";
  quizContent.style.flex = "1 1 auto";
  quizContent.style.overflowY = "auto";
  quizContent.style.padding = "20px";
  quizContent.style.background="linear-gradient(135deg, #003366, #0f52ba)";
  quizContent.style.color="white"
  sidebar.appendChild(quizContent);

  quizContent.innerHTML = "<p>Loading quiz...</p>";

  document.body.appendChild(sidebar);

  fetchQuizQuestions(questionsCount, sourceText);
}

// Fetch questions from API
async function fetchQuizQuestions(questionsCount, sourceText) {
  const quizContent = document.getElementById("quiz-content");

  const apiKey = "[Your api Key]";

  try {
    const response = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash-latest:generateContent?key=${apiKey}`,
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          contents: [
            {
              parts: [
                {
                  text: `Generate exactly ${questionsCount} multiple-choice quiz questions from the following text:\n\n"${sourceText}"\n\nIMPORTANT: Use EXACTLY this format for each question:
<question>Question text here</question>
<option>Option A</option>
<option>Option B</option>
<option>Option C</option>
<option>Option D</option>
<answer>Option A</answer>`,
                },
              ],
            },
          ],
          generationConfig: {
            temperature: 0.7,
            topK: 40,
            topP: 0.95,
            maxOutputTokens: 2048,
          },
        }),
      }
    );

    if (!response.ok) {
      const errorText = await response.text();
      quizContent.innerHTML = `<p>⚠️ Gemini API Error (${response.status}): ${response.statusText}</p>`;
      console.error("Gemini API Error:", response.status, response.statusText, errorText);
      return;
    }

    const data = await response.json();
    console.log("Gemini API Response:", data);

    const rawContent = data.candidates?.[0]?.content?.parts?.[0]?.text || "";
    const questions = rawContent.match(/<question>.*?<\/answer>/gs);

    if (!questions) {
      quizContent.innerHTML = `<p>⚠️ Could not parse quiz.</p>`;
      console.error("Parsing failed:", rawContent);
      return;
    }

    const quizData = questions.map((block) => {
      const qMatch = /<question>(.*?)<\/question>/s.exec(block);
      const opts = [...block.matchAll(/<option>(.*?)<\/option>/g)].map((m) => m[1].trim());
      const aMatch = /<answer>(.*?)<\/answer>/s.exec(block);
      let answer = aMatch?.[1]?.trim() || "";

      // If answer is "Option A", "Option B", etc., map to actual option text
      const optionMatch = answer.match(/^Option ([A-D])$/i);
      if (optionMatch) {
        const idx = "ABCD".indexOf(optionMatch[1].toUpperCase());
        if (idx !== -1 && opts[idx]) {
          answer = opts[idx];
        }
      }

      return {
        question: qMatch?.[1]?.trim() || "",
        options: opts.slice(0, 4),
        answer,
      };
    });

    renderQuizOneByOne(quizData);
  } catch (err) {
    console.error("Error fetching quiz:", err);
    document.getElementById("quiz-content").innerHTML = "<p>⚠️ Error fetching quiz.</p>";
  }
}

// Render quiz one question at a time
function renderQuizOneByOne(questions) {
  const quizContent = document.getElementById("quiz-content");
  let currentIndex = 0;
  const userAnswers = [];

  function showQuestion(index) {
    quizContent.innerHTML = "";

    const q = questions[index];
    const div = document.createElement("div");

    const question = document.createElement("p");
    question.textContent = `${index + 1}. ${q.question}`;
    div.appendChild(question);

    q.options.forEach((opt) => {
      const label = document.createElement("label");
      label.style.display = "block";

      const input = document.createElement("input");
      input.type = "radio";
      input.name = `q${index}`;
      input.value = opt;

      label.appendChild(input);
      label.appendChild(document.createTextNode(opt));
      div.appendChild(label);
    });

    quizContent.appendChild(div);


    

    const nextBtn = document.createElement("button");
    nextBtn.textContent = index === questions.length - 1 ? "Submit Quiz" : "Next";
    nextBtn.style.marginTop = "10px";
    quizContent.appendChild(nextBtn);

    nextBtn.addEventListener("click", () => {
      const selected = div.querySelector(`input[name="q${index}"]:checked`);
      userAnswers[index] = selected ? selected.value : null;

      if (index === questions.length - 1) {
        renderResults(questions, userAnswers);
      } else {
        currentIndex++;
        showQuestion(currentIndex);
      }
    });
  }

  showQuestion(currentIndex);
}

// Render results
function renderResults(questions, userAnswers) {
  const quizContent = document.getElementById("quiz-content");
  let score = 0;
  let resultHtml = `<h2>Results</h2>`;

  questions.forEach((q, i) => {
    const userAnswer = userAnswers[i] || "Not answered";
    const correctAnswer = q.answer;
    const isCorrect = userAnswer.trim().toLowerCase() === correctAnswer.trim().toLowerCase();
    if (isCorrect) score++;

    resultHtml += `
      <div style="margin-bottom: 10px; padding: 8px; border: 1px solid #ddd; border-radius: 5px;">
        <p><strong>Q${i + 1}:</strong> ${q.question}</p>
        <p>Your Answer: <span style="color:${isCorrect ? "green" : "red"}">${userAnswer}</span></p>
        <p>Correct Answer: <span style="color:green">${correctAnswer}</span></p>
      </div>
    `;
  });

  resultHtml += `<h3>Final Score: ${score}/${questions.length}</h3>`;
  quizContent.innerHTML = resultHtml;
}

// Listen for messages from extension
chrome.runtime.onMessage.addListener((request) => {
  if (request.action === "startQuiz") {
    let sourceText = "";

    if (request.textSource === "selected") {
      sourceText = window.getSelection().toString().trim();
      if (!sourceText) sourceText = document.body.innerText || "No content available";
    } else {
      sourceText = document.body.innerText || "No content available";
    }

    showQuizSidebar(request.questions, sourceText);
  }
});
