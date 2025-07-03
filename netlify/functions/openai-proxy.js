exports.handler = async (event, context) => {
  const { name, scenario, tarot } = JSON.parse(event.body);
  
  // This will read your new Google key from Netlify's secure settings.
  const apiKey = process.env.OPENAI_API_KEY;

  let prompt = `You are "Loyalty Test AI," a sassy, slightly dramatic, and fun AI that simulates relationship loyalty tests. A user wants to test their partner named "${name}". The scenario is: "${scenario}". Generate a short, spicy, and plausible "fake DM" chat script... Verdict: [Your sassy conclusion]`;

  if (tarot) {
    prompt += `\n\n🔮 Tarot Twist: Pull one symbolic tarot card and give a one-sentence interpretation.`;
  }
  
  // This is the new URL for Google AI
  const url = `https://generativelanguage.googleapis.com/v1beta/models/gemini-pro:generateContent?key=${apiKey}`;

  try {
    const response = await fetch(url, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      // This is the new request format for Google AI
      body: JSON.stringify({
        contents: [{ parts: [{ text: prompt }] }],
      }),
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(JSON.stringify(errorData));
    }

    const data = await response.json();
    // This is the new way to get the reply from Google AI
    const reply = data.candidates[0].content.parts[0].text;

    return {
      statusCode: 200,
      body: JSON.stringify({ reply }),
    };

  } catch (error) {
    return {
      statusCode: 500,
      body: JSON.stringify({ error: error.message }),
    };
  }
};
