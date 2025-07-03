// This code runs on Netlify's servers, NOT in the user's browser.
exports.handler = async function (event, context) {
    // Get the data the user sent from the browser
    const { name, scenario } = JSON.parse(event.body);
    
    // Get the secret key from Netlify's environment variables
    const OPENAI_API_KEY = process.env.OPENAI_API_KEY;

    // Talk to OpenAI's API
    const response = await fetch('https://api.openai.com/v1/chat/completions', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${OPENAI_API_KEY}`
        },
        body: JSON.stringify({
            model: 'gpt-3.5-turbo',
            messages: [
                {
                    role: 'system',
                    content: `You are the Loyalty Test AI. Your job is to simulate a short, dramatic, and realistic chat conversation based on a scenario. The conversation should be between two people. One person is named ${name}. The other person is the 'tempter'. The conversation should be a few lines long and end on a suspenseful or revealing note. Format the output as a simple chat log, like 'Person 1: Hello', 'Person 2: Hi there'. Do NOT add any extra commentary before or after the chat log.`
                },
                {
                    role: 'user',
                    content: scenario
                }
            ],
            temperature: 0.8
        })
    });

    const data = await response.json();
    const chatResult = data.choices[0].message.content;

    // Send the result back to the user's browser
    return {
        statusCode: 200,
        body: JSON.stringify({ result: chatResult })
    };
};
