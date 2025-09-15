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
  sidebar.style.padding = "20px";
  sidebar.style.fontFamily = "Arial, sans-serif";

  document.body.appendChild(sidebar);

  fetchQuizQuestions(questionsCount, sourceText);
}

// Fetch questions from API
async function fetchQuizQuestions(questionsCount, sourceText) {
  const sidebar = document.getElementById("quiz-sidebar");
  sidebar.innerHTML = "<p>Loading quiz...</p>";

  try {
    const response = await fetch("https://openrouter.ai/api/v1/chat/completions", {
      method: "POST",
      headers: {
        "Authorization": "Bearer sk-or-v1-ba1fbdfd790c42f4ff34451c35659303964f84016ede6f13c6e828",
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        model: "qwen/qwen3-coder:free",
        messages: [
          {
            role: "user",
            content: `Generate ${questionsCount} multiple-choice quiz questions from the following text:\n"${sourceText}"\nUse this format:
<question>Question text</question>
<option>Option 1</option>
<option>Option 2</option>
<option>Option 3</option>
<answer>Correct option text</answer>
Repeat for all questions.`
          }
        ]
      })
    });

    const data = await response.json();
    const rawContent = data.choices?.[0]?.message?.content || data.choices?.[0]?.text || "";
    if (!rawContent) {
      sidebar.innerHTML = "<p>⚠️ API did not return quiz content.</p>";
      console.error("No content in API response:", data);
      return;
    }

    // Parse custom tags
    const quizData = [];
    const questions = rawContent.match(/<question>.*?<\/answer>/gs);
    if (!questions) {
      sidebar.innerHTML = "<p>⚠️ Could not parse quiz from API.</p>";
      console.error("Parsing failed:", rawContent);
      return;
    }

    questions.forEach(block => {
      const qMatch = /<question>(.*?)<\/question>/s.exec(block);
      const opts = [...block.matchAll(/<option>(.*?)<\/option>/g)].map(m => m[1]);
      const aMatch = /<answer>(.*?)<\/answer>/s.exec(block);

      if (qMatch && opts.length && aMatch) {
        quizData.push({
          question: qMatch[1].trim(),
          options: opts,
          answer: aMatch[1].trim()
        });
      }
    });

    renderQuizOneByOne(quizData);
  } catch (error) {
    console.error("Error fetching quiz:", error);
    sidebar.innerHTML = "<p>⚠️ Error fetching quiz. Check console for details.</p>";
  }
}

// Render quiz one question at a time
function renderQuizOneByOne(questions) {
  const sidebar = document.getElementById("quiz-sidebar");
  sidebar.innerHTML = "<h2>Quiz Time</h2>";

  let currentIndex = 0;
  const userAnswers = [];

  function showQuestion(index) {
    sidebar.innerHTML = `<h2>Quiz Time</h2>`;
    const q = questions[index];

    const div = document.createElement("div");
    div.style.marginBottom = "15px";

    const question = document.createElement("p");
    question.textContent = `${index + 1}. ${q.question}`;
    div.appendChild(question);

    q.options.forEach(opt => {
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

    sidebar.appendChild(div);

    const nextBtn = document.createElement("button");
    nextBtn.textContent = index === questions.length - 1 ? "Submit Quiz" : "Next";
    nextBtn.style.marginTop = "10px";
    sidebar.appendChild(nextBtn);

    nextBtn.addEventListener("click", () => {
      const selected = div.querySelector(`input[name="q${index}"]:checked`);
      userAnswers[index] = selected ? selected.value : null;

      if (index === questions.length - 1) {
        // Show score
        let score = 0;
        questions.forEach((q, i) => {
          if (userAnswers[i] === q.answer) score++;
        });
        sidebar.innerHTML = `<h2>Your Score: ${score}/${questions.length}</h2>`;
      } else {
        currentIndex++;
        showQuestion(currentIndex);
      }
    });
  }

  showQuestion(currentIndex);
}

// Listen for messages
chrome.runtime.onMessage.addListener((request) => {
  if (request.action === "startQuiz") {
    let sourceText = "";

    // Get text depending on textSource from popup.js
    if (request.textSource === "selectedText") {
      sourceText = window.getSelection().toString().trim();
      if (!sourceText) sourceText = document.body.innerText || "No content available";
    } else {
      sourceText = document.body.innerText || "No content available";
    }

    showQuizSidebar(request.questions, sourceText);
  }
});
