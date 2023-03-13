import { ChatOpenAI } from "langchain/chat_models";
import { HumanChatMessage, SystemChatMessage } from "langchain/schema";

const OPENAI_API_KEY = process.env.OPENAI_API_KEY;

export default async function handler(req, res) {
  try {
    res.writeHead(200, { 
      "Content-Type": "application/octet-stream"
    , "Transfer-Encoding": "chunked" });
    
    if (!OPENAI_API_KEY) {
      throw new Error("OPENAI_API_KEY is not defined.");
    }
    
    const chat = new ChatOpenAI({
      openAIApiKey: OPENAI_API_KEY,
      temperature: 0.9,
      streaming: true,
      callbackManager: { handleNewToken },
    });

    function handleNewToken(token) {
      res.write(`${token}`);
    }

    await chat.call([
      new SystemChatMessage(
        "You are a poet like tennyson, kipling, frost. You're famous and enjoyed by many."),
      new HumanChatMessage("Write me a poem that rhymes about traveling from Mississippi to London for the first time.")
    ]);

    res.end();
  } catch (error) {
    console.error(error);
    res.status(500).send("Internal Server Error");
  }
}
