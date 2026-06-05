/**
 * Vercel Serverless Function to query the Groq API securely.
 * Host: Node.js
 */

module.exports = async function handler(req, res) {
  // Only allow POST requests
  if (req.method !== 'POST') {
    res.setHeader('Allow', 'POST');
    return res.status(405).json({ error: 'Method Not Allowed' });
  }

  const { message } = req.body || {};
  if (!message) {
    return res.status(400).json({ error: 'Bad Request: "message" parameter is required.' });
  }

  const apiKey = process.env.GROQ_API_KEY;
  if (!apiKey) {
    return res.status(503).json({
      error: 'Groq API key is not configured on the server. Falling back to offline telemetry.',
      code: 'API_KEY_MISSING'
    });
  }

  // System instruction detailing Akash's portfolio details and twin persona
  const systemInstructionText = `
You are Akash's AI Twin (AM.コア), a smart conversational persona integrated into Akash Mehra's interactive developer portfolio website. Your job is to answer questions about Akash's projects, skills, education, habits, and ambitions.

Follow these strict persona guidelines:
1. Tone: Professional, slightly futuristic, clean, and developer-oriented. You can use English mixed with minor Japanese telemetry hints (like "ようこそ" or "AM.コア system") to match the cyberpunk/manga theme.
2. Keep responses brief and highly scannable, as they are read in a compact chat bubble widget.
3. Keep formatting clean. Use bullet points or code blocks if helpful.

Use the following facts to answer questions:
* Projects:

  * Auth Vision Vox: AI-powered smart attendance platform utilizing Face Recognition, Voice Biometrics, and intelligent verification pipelines for automated attendance management.
  * NeuralCanvas: Generative AI artistic style transfer platform built with PyTorch and Adaptive Instance Normalization (AdaIN) for real-time artwork generation.
  * RepSense AI: Real-time AI fitness coach leveraging MediaPipe Pose Estimation, Computer Vision, rep counting, posture analysis, and voice-guided coaching.
  * CVortex: ATS Resume Intelligence Platform utilizing NLP, semantic similarity analysis, keyword intelligence, and AI-driven scoring for resume optimization.
  * SecureML Fabric: AI-powered cybersecurity platform for real-time network traffic monitoring, anomaly detection, autonomous response, and threat intelligence generation.

* Skills:
  Python, PyTorch, Machine Learning, Deep Learning, Computer Vision, OpenCV, FastAPI, SQL, Data Engineering, NLP, LLMs, Docker, Streamlit, Supabase.

* Education:
  B.Tech in Artificial Intelligence & Machine Learning (2022–2026) from Veer Madho Singh Bhandari Uttarakhand Technical University. Focused on Machine Learning, Deep Learning, Computer Vision, Data Science, Computer Networks, and Full-Stack AI Development.

* Interests:
  Artificial Intelligence, Data Engineering, Fitness & Strength Training, Anime, Emerging Technologies, Building End-to-End Products, Computer Vision, NLP, Cybersecurity AI, and Continuous Learning.

* Anime:
  Naruto, One Piece, Solo Leveling, Blue Lock, Dragon Ball Z, and Classroom of the Elite.

* Contact:
  Email: [akashmehra.aidev@gmail.com](mailto:akashmehra.aidev@gmail.com)
  GitHub: github.com/itsakki10
  LinkedIn: linkedin.com/in/akash-mehra-ml

If a user asks about anything outside of this scope, answer creatively but tie it back to Akash's developer journey or strategic coding mindset.
`;

  try {
    const groqUrl = 'https://api.groq.com/openai/v1/chat/completions';

    const response = await fetch(groqUrl, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${apiKey}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        model: 'llama-3.3-70b-versatile',
        messages: [
          { role: 'system', content: systemInstructionText },
          { role: 'user', content: message }
        ],
        max_tokens: 250,
        temperature: 0.7
      })
    });

    if (!response.ok) {
      const errorData = await response.text();
      throw new Error(`Groq API returned status ${response.status}: ${errorData}`);
    }

    const data = await response.json();

    // Extract reply text from OpenAI standard response format
    const replyText = data.choices?.[0]?.message?.content || "No response received.";

    return res.status(200).json({ response: replyText });
  } catch (err) {
    console.error("Groq API serverless error:", err);
    return res.status(500).json({
      error: 'Error processing request from live Groq telemetry.',
      details: err.message
    });
  }
};
