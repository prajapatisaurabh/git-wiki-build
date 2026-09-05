import { OpenAIEmbeddings } from "@langchain/openai";
import { PineconeStore } from "@langchain/pinecone";
import { Pinecone } from "@pinecone-database/pinecone";

const pinecone = new Pinecone({ apiKey: process.env.PINECONE_API_KEY });

const embeddings = new OpenAIEmbeddings({
    apiKey: process.env.OPENAI_API_KEY,
    model: "text-embedding-3-small",
});

function getPineconeIndex() {
    return pinecone.Index(process.env.PINECONE_INDEX);
}

export async function storeDocuments(documents) {
    const pineconeIndex = getPineconeIndex();

    return PineconeStore.fromDocuments(documents, embeddings, {
        pineconeIndex,
    });
}

export async function getVectorStore() {
    const pineconeIndex = getPineconeIndex();

    return PineconeStore.fromExistingIndex(embeddings, {
        pineconeIndex,
    });
}
