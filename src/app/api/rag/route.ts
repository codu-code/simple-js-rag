import fs from "node:fs/promises";
import { Document, VectorStoreIndex, OpenAI, Settings } from "llamaindex";

Settings.llm = new OpenAI({ model: "gpt-3.5-turbo" });

export async function POST(request: Request) {
  try {
    const { query } = await request.json();
    if (!query) {
      throw new Error("Input is required");
    }

    // Load essay from abramov.txt in Node
    const path = "./node_modules/llamaindex/examples/abramov.txt";

    const essay = await fs.readFile(path, "utf-8");
    // // Create Document object with essay
    const document = new Document({ text: essay, id_: path });

    // Split text and create embeddings. Store them in a VectorStoreIndex
    const index = await VectorStoreIndex.fromDocuments([document]);

    // Query engine convenience function
    // This convenience function combines several components:
    // - Retriever
    // - Postprocessing
    // - Synthesizer
    const queryEngine = index.asQueryEngine();
    const { response } = await queryEngine.query({
      query,
    });

    return Response.json({ response });
  } catch (err) {
    console.log(err);
    return new Response(`Something went wrong.`, { status: 400 });
  }
}
