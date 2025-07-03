exports.handler = async (event, context) => {
  console.log("Function invoked!"); // Clue #1: Check if the function starts

  try {
    const body = JSON.parse(event.body);
    const { name, scenario, tarot } = body;
    console.log("Received data:", { name, scenario, tarot }); // Clue #2: Check the data received

    const apiKey = process.env.OPENAI_API_KEY;
    if (!apiKey) {
      console.error("OpenAI API Key is not set!");
      throw new Error("API Key is missing.");
    }

    let prompt = `You are "Loyalty Test AI," a sassy, slightly dramatic, and fun AI that simulates relationship loyalty tests...`; // Shortened for clarity
    
    if (tarot) {
      prompt += `\n\n🔮 Tarot Twist: Pull one symbolic tarot card and give a one-sentence interpretation.`;
    }

    console.log("Sending prompt to OpenAI..."); // Clue #3: Check before sending

    const response = await fetch("https://api.openai.com/v1/chat/completions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${apiKey}`,
      },
      body: JSON.stringify({
        model: "gpt-4o",
        messages: [{ role: "user", content: prompt.replace('{name}', name).replace('{scenario}', scenario) }], // Simplified prompt building
        temperature: 0.8,
        max_tokens: 250,
      }),
    });
    
    console.log("Received response from OpenAI with status:", response.status); // Clue #4: Check OpenAI's response

    if (!response.ok) {
      const errorText = await response.text();
      console.error("OpenAI API Error:", errorText);
      throw new Error(`OpenAI error: ${errorText}`);
    }

    const data = await response.json();
    console.log("OpenAI data received:", data); // Clue #5: See the full data from OpenAI
    
    const reply = data.choices[0].message.content;

    return {
      statusCode: 200,
      body: JSON.stringify({ reply }),
    };

  } catch (error) {
    console.error("Caught an error in the function:", error.message); // Clue #6: Catch any other errors
    return {
      statusCode: 500,
      body: JSON.stringify({ error: error.message }),
    };
  }
};
