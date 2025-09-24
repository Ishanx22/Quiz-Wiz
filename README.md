
# Quiz Wiz

✨ QuizWiz Text Genie is your smart quiz-making buddy. Highlight any text or use the entire page, choose your goal — shorter, clearer, or simpler — and instantly turn it into a quiz. Quick, effortless, and smart — learning and testing made easy!


## Images

Starting a  Quiz

![Quiz start](/project1.png)

Quiz

![Quiz](/project2.png)

Quiz Result

![Quiz Result](/project3.png)









## Features

✨ Simplify & Quiz-ify – Instantly simplify, summarize, or turn any selected text or page into a quiz.

⚡ One-Click Magic – Highlight text or use the whole page, right-click, and get quizzes in seconds.

📝 Smart & Clear – Converts complex text into clear, easy-to-understand questions.

🎯 Accurate & Reliable – Keeps the original meaning intact while creating quizzes.

🌟 For Everyone – Perfect for students, learners, or anyone who wants quick quizzes.

## Deployment

To deploy this project run

1) Setup Api Key

2) **Load Extension in Chrome**  
   - Open Chrome and go to `chrome://extensions/`  
   - Enable **Developer mode** (top-right)  
   - Click **Load unpacked** and select the project folder 




## Tech Stack

Html,Css,js




## API Reference

### Setup: API Key

1. Get your DeepSeek (R1 Free) API key:  
   [https://openrouter.ai/deepseek/deepseek-r1:free/api](https://openrouter.ai/deepseek/deepseek-r1:free/api)

2. Open `text-simplifier-chrome-extension/text-simplifier-extension
/background.js
` and replace line 133,167 with your key:

```javascript
"Authorization": "Bearer [Your API Key]";


