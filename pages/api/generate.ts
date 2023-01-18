import type { NextRequest } from "next/server";

export const config = {
  runtime: "edge",
};

const handler = async (req: NextRequest): Promise<Response> => {
  if (req.method !== "POST")
    return new Response(null, { status: 404, statusText: "Not Found" });

  try {
    const { prompt } = (await req.json()) as { prompt: string };

    if (!prompt) {
      return new Response("No prompt in the request", { status: 400 });
    }

    const payload = {
      model: "text-davinci-003",
      prompt,
      temperature: 0.7,
      top_p: 1,
      frequency_penalty: 0,
      presence_penalty: 0,
      max_tokens: 200,
      stream: true,
      n: 1,
    };

    const res = await fetch("https://api.openai.com/v1/completions", {
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${process.env.OPENAI_API_KEY ?? ""}`,
      },
      method: "POST",
      body: JSON.stringify(payload),
    });

    const data = res.body;

    return new Response(data, {
      headers: { "Content-Type": "application/json; charset=utf-8" },
    });
  } catch (e) {
    return new Response(JSON.stringify({ message: e }), {
      status: 400,
      statusText: "Bad Request",
    });
  }
};

export default handler;
