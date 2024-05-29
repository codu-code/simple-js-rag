import {
  VectorStoreIndex,
  OpenAI,
  Settings,
  RouterQueryEngine,
} from "llamaindex";
import { TextFileReader } from "llamaindex/readers/TextFileReader";

Settings.llm = new OpenAI({ model: "gpt-3.5-turbo" });

export async function POST(request: Request) {
  try {
    const { query } = await request.json();

    if (!query) {
      throw new Error("Input is required");
    }

    // Get data from multiple files
    const irelandDoc = await new TextFileReader().loadData(
      "./src/data/ireland.txt"
    );
    const irishLangDoc = await new TextFileReader().loadData(
      "./src/data/irish-language.txt"
    );
    const irishMythDoc = await new TextFileReader().loadData(
      "./src/data/irish-mythology.txt"
    );

    // Create seperate VectorStoreIndex from documents
    const irelandIndex = await VectorStoreIndex.fromDocuments(irelandDoc);
    const irishLangIndex = await VectorStoreIndex.fromDocuments(irishLangDoc);
    const irishMythIndex = await VectorStoreIndex.fromDocuments(irishMythDoc);

    // Query engine convenience function
    const irelandQueryEngine = irelandIndex.asQueryEngine();
    const irishLangQueryEngine = irishLangIndex.asQueryEngine();
    const irishMythQueryEngine = irishMythIndex.asQueryEngine();

    const routerQueryEngine = await RouterQueryEngine.fromDefaults({
      queryEngineTools: [
        {
          queryEngine: irelandQueryEngine,
          description: "Information realted to the country of Ireland",
        },
        {
          queryEngine: irishLangQueryEngine,
          description: "Information about the Irish language",
        },
        {
          queryEngine: irishMythQueryEngine,
          description:
            "Information about Irish mythology and folklore or stories",
        },
      ],
    });

    const { response } = await routerQueryEngine.query({ query });

    return Response.json({ response });
  } catch (e) {
    console.log(e);
    return new Response(`Something went wrong.`, { status: 400 });
  }
}
