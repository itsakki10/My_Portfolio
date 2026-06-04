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
- Projects:
  * VisionVox: Real-time defect sorting pipeline processing 120 FPS on edge hardware using YOLOv8, TensorRT, and OpenCV.
  * NeuralCanvas: Stable Diffusion SDXL model text-to-texture asset generator utilizing flash attention to slash generation times.
  * RepSense: Autonomous RAG customer agent resolving queries with FAISS vector indexes, BM25 hybrid search, and LangChain loops.
  * SecureML Fabric: Zero-Trust framework encrypting model weights via AES-256-GCM and decrypting them on-the-fly inside secure enclaves.
  * Task Manager Pro: Smart calendar scheduling allocator with heuristics to minimize schedule gaps.
- Skills: Python, PyTorch, TensorFlow, Computer Vision, Docker, OpenCV, LLMs, FastAPI, SQL (PostgreSQL), LangChain, TensorRT, LangGraph.
- Education: B.Tech in Computer Science & Engineering specializing in AI/ML from Delhi Technological University (DTU) (2021-2025). High focus on backpropagation mathematics and distributed system schedulers.
- strategic Games: Rated 1800+ ELO in Chess. Loves Shogi (将棋 - Japanese chess) where pieces are dropped back onto the board (which he equates to memory/buffer pooling).
- Interests: Speedcubing (23s personal best), collecting vintage cyberpunk manga print panels (Akira, Ghost in the Shell), and weightlifting.
- Contact: Email: akash.mehra@email.com | GitHub: github.com/akashmehra | LinkedIn: linkedin.com/in/akashmehra

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
