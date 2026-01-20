async function main(base64Image, mimeType) {

  const response = await openai.responses.create({
    model: "gpt-4.1-mini",
    input: [
      {
        role: "user",
        content: [
          {
            type: "input_text",
            text: "Analyze this product image and return JSON with name and description only."
          },
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

  let parsed;
  try {
    parsed = JSON.parse(raw);
  } catch {
    throw new Error("AI did not return valid JSON");
  }

  return parsed;
}
