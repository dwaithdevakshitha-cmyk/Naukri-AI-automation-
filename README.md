# Naukri AI Automation

AI-powered automation tool for searching and downloading resumes from Naukri Resdex.

## Features

- 🤖 **AI-Powered DOM Analysis**: Uses OpenAI GPT-4 to intelligently find elements on the page
- 📊 **Excel Export**: Automatically exports candidate data to Excel
- 📥 **Resume Download**: Batch download resumes from search results
- 💬 **WhatsApp Notifications**: Optional notifications for automation status
- 🔍 **Smart Extraction**: AI-based job description and resume parsing
- 💾 **Selector Caching**: Caches discovered selectors for faster execution

## Project Structure

```
naukri-ai-automation/
│
├── config/
│   ├── env.js                 # Environment configuration
│   ├── antigravity.json       # Selectors and timeouts config
│
├── ai/
│   ├── openaiClient.js        # OpenAI API client
│   ├── domAnalyzer.js         # AI-powered DOM analysis
│   ├── jdExtractor.js         # Job description parser
│
├── automation/
│   ├── browser.js             # Browser automation wrapper
│   ├── login.js               # Naukri login automation
│   ├── resdexSearch.js        # Resdex search automation
│   ├── resumeDownload.js      # Resume download automation
│
├── data/
│   ├── resumes/               # Downloaded resumes folder
│   ├── output.xlsx            # Candidate data export
│
├── whatsapp/
│   ├── aiCall.js              # WhatsApp notifications
│
├── utils/
│   ├── excelWriter.js         # Excel file operations
│   ├── selectorCache.js       # Selector caching system
│
├── main.js                    # Main orchestration file
└── .env                       # Environment variables
```

## Installation

1. Install dependencies:
```bash
npm install
```

2. Configure environment variables in `.env`:
```env
OPENAI_API_KEY=your_openai_api_key_here
NAUKRI_EMAIL=your_email@example.com
NAUKRI_PASSWORD=your_password_here
WHATSAPP_ENABLED=false
```

## Usage

Run the automation:
```bash
npm start
```

For development with auto-reload:
```bash
npm run dev
```

## Configuration

Edit `config/antigravity.json` to customize:
- Selectors for different page elements
- Timeout values
- Retry configuration

## How It Works

1. **Login**: Authenticates with Naukri using provided credentials
2. **Navigate**: Goes to Resdex search page
3. **Search**: Enters search criteria (skills, experience, location)
4. **Download**: Downloads resumes from search results
5. **Extract**: Uses AI to extract candidate information
6. **Export**: Saves data to Excel file
7. **Notify**: Sends WhatsApp notifications (if enabled)

## AI Features

- **DOM Analysis**: Automatically finds elements even when selectors change
- **Data Extraction**: Extracts structured data from job descriptions and resumes
- **Candidate Matching**: Scores candidates against job requirements

## Requirements

- Node.js 16+
- OpenAI API key
- Naukri account with Resdex access

## License

ISC
