import { OpenAIEmbeddings } from "@langchain/openai";
import { PineconeStore } from "@langchain/pinecone";
import { Pinecone } from "@pinecone-database/pinecone";

let pinecone;
let embeddings;

function getPineconeIndex() {
    if (!pinecone) {
        pinecone = new Pinecone({ apiKey: process.env.PINECONE_API_KEY });
    }
    return pinecone.Index(process.env.PINECONE_INDEX);
}

function getEmbeddings() {
    if (!embeddings) {
        embeddings = new OpenAIEmbeddings({
            apiKey: process.env.OPENAI_API_KEY,
            model: "text-embedding-3-small",
        });
    }
    return embeddings;
}

export async function storeDocuments(documents) {
    const pineconeIndex = getPineconeIndex();

    return PineconeStore.fromDocuments(documents, getEmbeddings(), {
        pineconeIndex,
    });
}

export async function getVectorStore() {
    const pineconeIndex = getPineconeIndex();

    return PineconeStore.fromExistingIndex(getEmbeddings(), {
        pineconeIndex,
    });
}
