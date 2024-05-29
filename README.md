# Simple RAG Demo

This code is to supplement a talk given by [Niall Maher](https://x.com/nialljoemaher).

## Getting Started

To run the code, you will need 2 API keys, which you should update your `.env` to include.
They are: 
- `OPENAI_API_KEY` to interact with OpenAI, which can be got at [https://platform.openai.com/api-keys](https://platform.openai.com/api-keys) 
- `LLAMA_CLOUD_API_KEY` for using a document parser, which can be got at [https://cloud.llamaindex.ai/api-key](https://cloud.llamaindex.ai/api-key).

Install the dependencies with:
```bash
npm i
```
First, run the development server:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.
