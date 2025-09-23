
# Text Simplifier

✨ Text Genie is your smart writing buddy that instantly simplifies or summarizes any text right where you are. Just highlight your text, choose your goal — shorter, clearer, or simpler — and let the genie do the magic. Quick, effortless, and smart — reading and writing made easy for everyone.


## Images

Text Simplification

![Simplify Demo](/project1.png)

Text Summarization

![Recipe Genie Demo](/project2.png)






## Features

✨ Simplify & Summarize – Instantly simplify or summarize any selected text.

⚡ One-Click Magic – Just highlight, right-click, and get results in seconds.

📝 Smart & Clear – Turns complex text into easy-to-read content instantly.

🎯 Accurate & Reliable – Keeps the meaning intact while simplifying.

🌟 For Everyone – Perfect for students, professionals, or casual readers.

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


