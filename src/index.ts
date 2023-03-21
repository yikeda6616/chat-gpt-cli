import axios from "axios";
import * as dotenv from "dotenv";
import yargs from "yargs";
import { hideBin } from "yargs/helpers";

dotenv.config();

const apiKey = process.env.OPENAI_API_KEY;

if (!apiKey) {
  console.error("APIキーが.envファイルに設定されていません。");
  process.exit(1);
}

async function chatGPT(prompt: string): Promise<string> {
  try {
    const response = await axios.post(
      "https://api.openai.com/v1/engines/text-davinci-002/completions",
      {
        prompt: `Q: ${prompt}\nA: `,
        max_tokens: 100,
        n: 1,
        stop: null,
        temperature: 0.7,
      },
      {
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${apiKey}`,
        },
      }
    );

    const completion = response.data.choices[0].text.trim();
    return completion;
  } catch (error) {
    console.error("Error:", error);
    return "An error occurred.";
  }
}

interface Arguments {
  prompt: string;
  _: (string | number)[];
  $0: string;
}

const argv = (yargs(hideBin(process.argv))
  .option("prompt", {
    alias: "p",
    type: "string",
    demandOption: true,
    description: "プロンプトを指定してください",
  })
  .argv as unknown) as Arguments;

(async () => {
  const prompt = argv.prompt;
  const answer = await chatGPT(prompt);
  console.log(`Prompt: ${prompt}`);
  console.log(`Answer: ${answer}`);
})();
