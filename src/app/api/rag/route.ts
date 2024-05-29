import { VectorStoreIndex, OpenAI, Settings } from "llamaindex";
import { LlamaParseReader } from "llamaindex/readers/LlamaParseReader";

Settings.llm = new OpenAI({ model: "gpt-3.5-turbo" });

export async function POST(request: Request) {
  try {
    const { query } = await request.json();
    if (!query) {
      throw new Error("Input is required");
    }

    const reader = new LlamaParseReader({ resultType: "markdown" });

    const documents = await reader.loadData(
      "./src/data/writing-effectively.pdf"
    );

    // Split text and create embeddings. Store them in a VectorStoreIndex
    const index = await VectorStoreIndex.fromDocuments(documents);

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
