exports.handler = async (event, context) => {
  // Get the data the user sent
  const { name, scenario, tarot } = JSON.parse(event.body);

  // This is the corrected line to securely get your API key
  const apiKey = process.env.OPENAI_API_KEY;

  let prompt = `You are "Loyalty Test AI," a sassy, slightly dramatic, and fun AI that simulates relationship loyalty tests in the style of a TikTok or YouTube skit. A user wants to test their partner named "${name}". The scenario is: "${scenario}". Generate a short, spicy, and plausible "fake DM" chat script... Verdict: [Your sassy conclusion]`;

  if (tarot) {
    prompt += `\n\n🔮 Tarot Twist: Pull one symbolic tarot card and give a one-sentence interpretation.`;
  }

  try {
    const response = await fetch("https://api.openai.com/v1/chat/completions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${apiKey}`,
      },
      body: JSON.stringify({
        model: "gpt-4o",
        messages: [{ role: "user", content: prompt }],
        temperature: 0.8,
        max_tokens: 250,
      }),
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.error.message);
    }

    const data = await response.json();
    const reply = data.choices[0].message.content;

    // Send the successful reply back to the user
    return {
      statusCode: 200,
      body: JSON.stringify({ reply }),
    };

  } catch (error) {
    // Send an error message back if something goes wrong
    return {
      statusCode: 500,
      body: JSON.stringify({ error: error.message }),
    };
  }
};
