# GPT Wrapper

A simple, modern, and responsive ChatGPT-like web UI for interacting with OpenAI's GPT models. Built with React and TypeScript, this project allows you to chat with GPT-3.5/4, control model parameters, and manage your OpenAI API key securely in the browser.

## Features

- Clean, ChatGPT.com-inspired UI
- Markdown rendering for AI responses
- Settings modal for:
  - OpenAI API key
  - Model selection (gpt-3.5-turbo, gpt-4)
  - Temperature, max tokens, top_p, and more
  - System message, variables, tools, and output format
- Error handling and loading indicators
- Responsive design for desktop and mobile

## Getting Started

### Prerequisites
- [Node.js](https://nodejs.org/) (v18+ recommended)
- [pnpm](https://pnpm.io/) (or npm/yarn)
- An OpenAI API key ([get one here](https://platform.openai.com/account/api-keys))

### Installation

```bash
pnpm install
# or
npm install
# or
yarn install
```

### Running the App

```bash
pnpm dev
# or
npm run dev
# or
yarn dev
```

Open [http://localhost:5173](http://localhost:5173) in your browser.

## Usage

1. Click the settings (gear) icon in the top right.
2. Enter your OpenAI API key and adjust model/settings as desired.
3. Start chatting! The assistant will respond with Markdown-formatted answers.

## Environment & Security
- **API Key is stored in memory only** (not persisted or sent to any backend).
- For production, consider using a backend proxy for better security.

## Customization
- You can add more models, tweak the UI, or extend the settings modal as needed.
- All settings are passed to the OpenAI API (where supported).

## License

MIT

---

**Made with ❤️ using React, TypeScript, and OpenAI API.**
