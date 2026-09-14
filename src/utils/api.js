export async function generateDeckStream(settings, params, onChunk) {
  const { apiKey, baseUrl, modelName } = settings;
  const { targetLanguage, nativeLanguage, nicheTopic, numCards } = params;

  if (!apiKey) {
    throw new Error("API Key is missing. Please configure settings.");
  }

  const systemPrompt = `You are an expert language teacher and curriculum designer. 
Generate a flashcard deck for learning ${targetLanguage} (native language: ${nativeLanguage}).
The deck must focus on the specific niche topic: "${nicheTopic}".
You must generate exactly ${numCards} cards.
You must output ONLY a valid JSON array of objects. Do not wrap it in a json code block or add any extra text. 
Start immediately with [ and end with ].
Each object must follow this exact schema:
{
  "target_word": "string",
  "pronunciation": "string",
  "native_translation": "string",
  "context_sentence_target": "string",
  "context_sentence_native": "string"
}
`;

  const response = await fetch(baseUrl, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "Authorization": `Bearer ${apiKey}`
    },
    body: JSON.stringify({
      model: modelName,
      messages: [
        { role: "system", content: systemPrompt },
        { role: "user", content: `Generate the ${numCards} flashcards on "${nicheTopic}" as a JSON array.` }
      ],
      temperature: 0.7,
      stream: true
    })
  });

  if (!response.ok) {
    const errorData = await response.text();
    throw new Error(`API Error (${response.status}): ${errorData}`);
  }

  const reader = response.body.getReader();
  const decoder = new TextDecoder("utf-8");
  let fullText = "";
  let buffer = "";

  while (true) {
    const { done, value } = await reader.read();
    if (done) break;
    
    buffer += decoder.decode(value, { stream: true });
    const lines = buffer.split('\n');
    buffer = lines.pop() || "";
    
    let chunkContent = "";
    for (const line of lines) {
      if (line.startsWith('data: ') && line !== 'data: [DONE]') {
        try {
          const data = JSON.parse(line.slice(6));
          const content = data.choices[0]?.delta?.content || "";
          chunkContent += content;
        } catch (e) {
          // ignore parse errors for partial chunks
        }
      }
    }

    if (chunkContent) {
      fullText += chunkContent;
      if (onChunk) onChunk(fullText, chunkContent);
    }
  }
  
  // Try to parse the complete text
  let jsonString = fullText.trim();
  
  // Attempt to extract JSON if LLM added markdown formatting
  const match = jsonString.match(/\[[\s\S]*\]/);
  if (match) {
    jsonString = match[0];
  }

  try {
    const parsed = JSON.parse(jsonString);
    return parsed.cards || parsed; 
  } catch (err) {
    console.error("Failed to parse JSON:", jsonString);
    throw new Error("Failed to parse LLM response as JSON. See console for details.");
  }
}
