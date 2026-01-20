import { openai } from "@/configs/openai";
import authSeller from "@/middlewares/authSeller";
import { getAuth } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";




export async function OPTIONS() {
  return new Response(null, {
    status: 200,
    headers: {
      "Access-Control-Allow-Origin": "*",
      "Access-Control-Allow-Methods": "POST, OPTIONS",
      "Access-Control-Allow-Headers": "Content-Type, Authorization",
    },
  });
}


async function main(base64Image, mimeType) {

    
    console.log("hello")

    const response = await openai.responses.create({

        model: "gpt-4.1-mini",
        input: [
            {
            role: "user",
            content: [
                { type: "input_text", text: "Analyze this product image and return JSON with name and description only." },
                {
                type: "input_image",
                image_url: `data:${mimeType};base64,${base64Image}`,
                },
            ],
            },
        ],
        max_output_tokens: 300,

        });


        const raw = response.output[0].content[0].text;
        const parsed = JSON.parse(raw);
        return parsed;

}


export async function POST(request) {
    try {
        const { userId } = getAuth(request)
        const isAdmin = await authSeller(userId);
        if (!isAdmin) {
            return NextResponse.json({ error: 'not authorized' }, { status: 401 })
        }
        const { base64Image, mimeType } = await request.json();
        const result = await main(base64Image, mimeType);
        return NextResponse.json({ ...result });
    } catch (error) {
        console.error(error);
        return NextResponse.json({ error: error.code || error.message }, { status: 400 });
    }
}
