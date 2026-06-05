/**
 * Interactive Terminal Command Line Interface.
 * Handles commands: help, connect, skills, focus, coffee, system, chess, rubik, matrix, clear.
 * Added: Tab-autocomplete, history log traversal (up/down arrow), and rich ASCII commands.
 */

(function () {
  const termInput = document.getElementById("term-input");
  const termBody = document.getElementById("term-body");

  let commandHistory = [];
  let historyIndex = -1;
  const availableCmds = [
    "help",
    "connect",
    "skills",
    "focus",
    "coffee",
    "clear",
    "system",
    "diagnostics",
    "chess",
    "shogi",
    "rubik",
    "matrix",
    "anime",
    "manga",
    "github",
  ];

  // Simple HTML escaping helper
  function escapeHtml(str) {
    return str
      .replace(/&/g, "&amp;")
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;")
      .replace(/"/g, "&quot;")
      .replace(/'/g, "&#039;");
  }

  // Print raw output div into terminal stdout
  function printOutput(text, isHtml = false) {
    if (!termBody) return;
    const inputLine = termBody.querySelector(".term-input-line");

    const div = document.createElement("div");
    div.className = "term-output";
    if (isHtml) {
      div.innerHTML = text;
    } else {
      div.textContent = text;
    }

    if (inputLine) {
      termBody.insertBefore(div, inputLine);
    } else {
      termBody.appendChild(div);
    }

    // Auto-scroll to bottom
    termBody.scrollTop = termBody.scrollHeight;
  }

  // Print guest@mind prompt prefix
  function printPromptEcho(cmd) {
    printOutput(
      `<span class="term-prompt">guest@mind:~$</span> ${escapeHtml(cmd)}`,
      true,
    );
  }

  // Global command executor function
  window.runTermCommand = async function (inputStr) {
    const trimmed = inputStr.trim();
    if (!trimmed) return;

    // Save to history
    if (
      commandHistory.length === 0 ||
      commandHistory[commandHistory.length - 1] !== trimmed
    ) {
      commandHistory.push(trimmed);
    }
    historyIndex = -1;

    // Echo input prompt first
    printPromptEcho(trimmed);

    // Command parser
    const args = trimmed.split(/\s+/);
    const cmd = args[0].toLowerCase();

    switch (cmd) {
      case "help":
        printOutput(
          `<pre style="font-family: inherit; margin: 0; white-space: pre-wrap; color: var(--text2)">` +
          `Available commands:\n` +
          `  <span style="color: var(--amber)">connect</span>     - Fetch contact details and profile links.\n` +
          `  <span style="color: var(--amber)">skills</span>      - Display ASCII skill core tree.\n` +
          `  <span style="color: var(--amber)">focus</span>       - Toggle Focus/Chaos physics layout mode.\n` +
          `  <span style="color: var(--amber)">coffee</span>      - Overclock canvas vector speeds.\n` +
          `  <span style="color: var(--amber)">system</span>      - Run model diagnostics & core telemetry.\n` +
          `  <span style="color: var(--amber)">github</span>      - Query dynamic live GitHub user telemetry.\n` +
          `  <span style="color: var(--amber)">chess</span>       - Print strategic chess position board.\n` +
          `  <span style="color: var(--amber)">shogi</span>       - Print strategic Japanese shogi board.\n` +
          `  <span style="color: var(--amber)">rubik</span>       - Renders a flattened unfolded Rubik's cube.\n` +
          `  <span style="color: var(--amber)">matrix</span>      - Trigger digital code rain simulation.\n` +
          `  <span style="color: var(--amber)">anime</span>       - Fetch classic cyber-manga terminal telemetry.\n` +
          `  <span style="color: var(--amber)">clear</span>       - Purge terminal stdout buffer.` +
          `</pre>`,
          true,
        );
        break;

      case "connect":
        printOutput(
          `<div style="color: var(--text2); line-height: 1.7;">` +
          `<span style="color: var(--cyan)">[LINKING] Establishing secure neural sockets... SUCCESS.</span><br>` +
          `==================================================<br>` +
          `• <b>Email:</b>     <a href="mailto:akashmehra.aidev@gmail.com" class="hoverable" style="color: var(--amber); text-decoration: none;">akashmehra.aidev@gmail.com</a><br>` +
          `• <b>Phone:</b>     +91 7248740615<br>` +
          `• <b>GitHub:</b>    <a href="https://github.com/itsakki10" target="_blank" class="hoverable" style="color: var(--amber); text-decoration: none;">https://github.com/itsakki10</a><br>` +
          `• <b>LinkedIn:</b>  <a href="https://www.linkedin.com/in/akash-mehra-ml" target="_blank" class="hoverable" style="color: var(--amber); text-decoration: none;">www.linkedin.com/in/akash-mehra-ml</a><br>` +
          `• <b>Resume:</b>   <a href="public/resume/Akash_Mehra_Resume.pdf"
   target="_blank"
   class="hoverable"
   style="color: var(--cyan); text-decoration: none;">
   [VIEW]
</a>
&nbsp;
<a href="public/resume/Akash_Mehra_Resume.pdf"
   download="Akash_Mehra_Resume.pdf"
   class="hoverable"
   style="color: var(--lime); text-decoration: none;">
   [DOWNLOAD]
</a><br>` +
          `==================================================` +
          `</div>`,
          true,
        );
        if (window.unlockAchievement) {
          window.unlockAchievement(
            "contact_view",
            "📞 Secure Channel Socket Connected!",
          );
        }
        break;

      case "skills":
        printOutput(
          `<pre style="font-family: inherit; margin: 0; white-space: pre; color: var(--v); line-height: 1.4;">` +
          `AI/ML Core Architecture Tree:\n` +
          `==================================================\n` +
          `├── [AI & ML]           ────── Python, PyTorch, Scikit-Learn, Deep Learning\n` +
          `├── [Computer Vision]   ────── OpenCV, MediaPipe, Face Recognition, Biometrics\n` +
          `├── [NLP & LLMs]        ────── LLMs, NLP, Semantic Search, Prompt Engineering\n` +
          `├── [Data Engineering]  ────── SQL, Analytics, ETL, Feature Engineering\n` +
          `└── [Full-Stack AI]     ────── FastAPI, Docker, Supabase, Streamlit\n` +
          `==================================================\n` +
          `<span style="color: var(--text3); font-size: 11px;">(Tip: Type 'focus' to visualize how these systems connect across projects.)</span>` +
          `</pre>`,
          true,
        );
        break;

      case "focus":
        if (window.toggleFocusMode) {
          window.toggleFocusMode();
          const stateStr = window.focusModeActive
            ? "STRUCTURED FOCUS (Snapped)"
            : "CONTROLLED CHAOS (Floating)";
          const color = window.focusModeActive ? "var(--cyan)" : "var(--amber)";
          printOutput(
            `[SYSTEM] Snapping physics updated. State transition initialized.<br>` +
            `Layout Mode set to: <span style="color: ${color}; font-weight: bold;">${stateStr}</span>`,
            true,
          );
        } else {
          printOutput(
            `[ERROR] State manager toggleFocusMode not loaded.`,
            false,
          );
        }
        break;

      case "coffee":
        if (window.triggerCaffeineOverdrive) {
          window.triggerCaffeineOverdrive();
          const stateStr = window.caffeineOverdrive
            ? "CAFFEINE OVERDRIVE ACTIVE (4.0GHz)"
            : "NORMAL SPEED LIMIT";
          const color = window.caffeineOverdrive
            ? "var(--amber)"
            : "var(--text3)";

          if (window.caffeineOverdrive) {
            printOutput(
              `<span style="color: var(--amber)">>> Injecting double espresso shots...</span><br>` +
              `>> Overclocking neural canvas speed vectors by 3.5x...<br>` +
              `System Status: <span style="color: ${color}; font-weight: bold;">${stateStr}</span>`,
              true,
            );
          } else {
            printOutput(
              `>> Flushed caffeine from thread buffers.<br>` +
              `System Status: <span style="color: ${color}; font-weight: bold;">${stateStr}</span>`,
              true,
            );
          }
        } else {
          printOutput(
            `[ERROR] State manager triggerCaffeineOverdrive not loaded.`,
            false,
          );
        }
        break;

      case "system":
      case "diagnostics":
        printOutput(
          `<pre style="font-family: inherit; margin: 0; color: var(--lime); line-height: 1.3;">` +
          `================= NEURAL CORE DIAGNOSTICS =================\n` +
          `• Identity: Akash Mehra (AI/ML Engineer)\n` +
          `• Education: B.Tech Artificial Intelligence & Machine Learning\n` +
          `• Core Domains: AI/ML | Computer Vision | NLP | Data Engineering\n` +
          `• Active Projects: 5 Production Systems Online\n` +
          `• CVortex Engine: ATS Intelligence Module (ACTIVE)\n` +
          `• RepSense Core: Pose Estimation & AI Coaching (ACTIVE)\n` +
          `• NeuralCanvas: Generative AI Pipeline (ACTIVE)\n` +
          `• Vision Vox: Face & Voice Biometrics (ACTIVE)\n` +
          `• SecureML Fabric: Threat Detection Engine (ACTIVE)\n` +
          `• Deployment Stack: FastAPI | Docker | Streamlit | Supabase\n` +
          `• System Status: ALL SYSTEMS OPERATIONAL\n` +
          `==========================================================` +
          `</pre>`,
          true
        );
        break;

      case "chess":
        printOutput(
          `<pre style="font-family: inherit; margin: 0; color: #a78bfa; line-height: 1.25;">` +
          `   a   b   c   d   e   f   g   h\n` +
          ` 8 [♜] [♞] [♝] [♛] [♚] [♝] [  ] [♜] 8\n` +
          ` 7 [♟] [♟] [♟] [♟] [  ] [♟] [♟] [♟] 7\n` +
          ` 6 [  ] [  ] [  ] [  ] [  ] [♞] [  ] [  ] 6\n` +
          ` 5 [  ] [  ] [  ] [  ] [♟] [  ] [  ] [  ] 5\n` +
          ` 4 [  ] [  ] [  ] [  ] [♙] [  ] [  ] [  ] 4\n` +
          ` 3 [  ] [  ] [♘] [  ] [  ] [  ] [  ] [  ] 3\n` +
          ` 2 [♙] [♙] [♙] [♙] [  ] [♙] [♙] [♙] 2\n` +
          ` 1 [♖] [  ] [♗] [♕] [♔] [♗] [☉] [♖] 1\n` +
          `   a   b   c   d   e   f   g   h\n\n` +
          `<span style="color:var(--text2);font-style:italic">"Strategy represents calculated anticipation. Plan your next move."</span>` +
          `</pre>`,
          true,
        );
        break;

      case "shogi":
        printOutput(
          `<pre style="font-family: inherit; margin: 0; color: var(--amber); line-height: 1.25;">` +
          `   9   8   7   6   5   4   3   2   1\n` +
          ` 1 [香] [桂] [銀] [金] [王] [金] [銀] [桂] [香] 1\n` +
          ` 2 [  ] [飛] [  ] [  ] [  ] [  ] [  ] [角] [  ] 2\n` +
          ` 3 [歩] [歩] [歩] [歩] [歩] [歩] [歩] [歩] [歩] 3\n` +
          ` 4 [  ] [  ] [  ] [  ] [  ] [  ] [  ] [  ] [  ] 4\n` +
          ` 5 [  ] [  ] [  ] [  ] [  ] [  ] [  ] [  ] [  ] 5\n` +
          ` 6 [  ] [  ] [  ] [  ] [  ] [  ] [  ] [  ] [  ] 6\n` +
          ` 7 [歩] [歩] [歩] [歩] [歩] [歩] [歩] [歩] [歩] 7\n` +
          ` 8 [  ] [角] [  ] [  ] [  ] [  ] [  ] [飛] [  ] 8\n` +
          ` 9 [香] [桂] [銀] [金] [玉] [金] [銀] [桂] [香] 9\n` +
          `   9   8   7   6   5   4   3   2   1\n\n` +
          `<span style="color:var(--text2);font-style:italic">"将棋 (Shogi): Every captured piece is a potential resource waiting to be dropped. Recycle your buffers."</span>` +
          `</pre>`,
          true,
        );
        break;

      case "anime":
      case "manga":
        printOutput(
          `<pre style="font-family: inherit; margin: 0; color: var(--cyan); line-height: 1.35;">` +
          `[NEURAL INSPIRATION MATRIX]\n` +
          `==================================================\n` +
          `⚡ Naruto              | Persistence Module\n` +
          `🏴‍☠️ One Piece          | Dream Pursuit Engine\n` +
          `🗡 Solo Leveling       | Self-Evolution Protocol\n` +
          `⚽ Blue Lock           | Competitive Mindset Core\n` +
          `💥 Dragon Ball Z       | Limit Break System\n` +
          `♟ Classroom of the Elite | Strategic Analysis Layer\n` +
          `==================================================\n` +
          `Status: Motivation Levels Stable\n` +
          `Current Objective: Become a World-Class AI Engineer\n` +
          `</pre>`,
          true,
        );
        break;

      case "rubik":
        printOutput(
          `<pre style="font-family: inherit; margin: 0; color: var(--amber); line-height: 1.2;">` +
          `Unfolded 3x3x3 State:\n` +
          `        [O][O][O]\n` +
          `        [O][O][O]\n` +
          `        [O][O][O]\n` +
          ` [G][G][G] [Y][Y][Y] [B][B][B] [R][R][R]\n` +
          ` [G][G][G] [Y][Y][Y] [B][B][B] [R][R][R]\n` +
          ` [G][G][G] [Y][Y][Y] [B][B][B] [R][R][R]\n` +
          `        [W][W][W]\n` +
          `        [W][W][W]\n` +
          `        [W][W][W]\n\n` +
          `<span style="color:var(--text2);font-style:italic">Active State Space: CFOP Phase 3 (OLL Matrix solver initialized)</span>` +
          `</pre>`,
          true,
        );
        break;

      case "matrix":
        printOutput(
          `<span style="color:#22c55e">Initializing stream logic...</span>`,
          true,
        );
        let count = 0;
        const interval = setInterval(() => {
          if (count > 8) {
            clearInterval(interval);
            printOutput(
              `<span style="color:#22c55e">Matrix connection socket closed safely.</span>`,
              true,
            );
            return;
          }
          let line = "";
          for (let i = 0; i < 40; i++) {
            line += Math.random() > 0.5 ? "1" : "0";
          }
          printOutput(
            `<span style="color:#22c55e;font-family:monospace;letter-spacing:2px;">${line}</span>`,
            true,
          );
          count++;
        }, 150);
        break;

      case "github":
        const username = args[1] || "itsakki10";
        printOutput(
          `<span style="color: var(--cyan)">[GITHUB LINK ESTABLISHED] Accessing repository matrix for '${escapeHtml(username)}'...</span>`,
          true,
        );
        try {
          const res = await fetch(
            `https://api.github.com/users/${encodeURIComponent(username)}`,
          );
          if (!res.ok) {
            throw new Error(
              `User not found or rate limited (status ${res.status})`,
            );
          }
          const userData = await res.json();
          const createdDate = new Date(userData.created_at).toLocaleDateString(
            undefined,
            { year: "numeric", month: "long", day: "numeric" },
          );
          printOutput(
            `<pre style="font-family: inherit; margin: 0; color: var(--lime); line-height: 1.45;">` +
            `================== GITHUB DATA PORT ==================\n` +
            `• User Profile:    ${userData.login} (${userData.name || "N/A"})\n` +
            `• Bio:             ${userData.bio || "AI/ML Engineer & Builder"}\n` +
            `• Public Repos:    ${userData.public_repos}\n` +
            `• Followers:       ${userData.followers} / Following: ${userData.following}\n` +
            `• Account Created: ${createdDate}\n` +
            `• Location:        ${userData.location || "India"}\n` +
            `• Git URL:         <a href="${userData.html_url}" target="_blank" style="color: var(--amber); text-decoration: none;">${userData.html_url}</a>\n` +
            `------------------------------------------------------\n` +
            `Core Repository Matrix:\n` +
            `🔐 SecureML Fabric   → Cybersecurity AI\n` +
            `📄 CVortex           → ATS Intelligence Platform\n` +
            `🏋️ RepSense AI      → AI Gym Coach\n` +
            `🎨 NeuralCanvas      → Generative AI Art\n` +
            `🎓 Auth Vision Vox   → Smart Attendance System\n` +
            `------------------------------------------------------\n` +
            `Status: BUILDING IN PUBLIC\n` +
            `======================================================` +
            `</pre>`,
            true,
          );
          if (window.unlockAchievement) {
            window.unlockAchievement(
              "github_sync",
              "🐙 GitHub Live Telemetry Synced!",
            );
          }
        } catch (err) {
          printOutput(
            `[ERROR] Failed to fetch GitHub socket: ${err.message}`,
            false,
          );
        }
        break;

      case "clear":
        if (termBody) {
          const outputs = termBody.querySelectorAll(".term-output");
          outputs.forEach((el) => el.remove());
        }
        break;

      default:
        printOutput(
          `Command not found: '${escapeHtml(cmd)}'. Type 'help' for available commands.`,
          false,
        );
        break;
    }
  };

  // Keyboard navigation & autocomplete logic
  function bindKeyListeners(inputEl) {
    if (!inputEl) return;

    inputEl.addEventListener("keydown", function (e) {
      if (e.key === "Enter") {
        const value = inputEl.value;
        inputEl.value = "";
        window.runTermCommand(value);
      } else if (e.key === "ArrowUp") {
        e.preventDefault();
        if (commandHistory.length > 0) {
          if (historyIndex === -1) {
            historyIndex = commandHistory.length - 1;
          } else if (historyIndex > 0) {
            historyIndex--;
          }
          inputEl.value = commandHistory[historyIndex];
        }
      } else if (e.key === "ArrowDown") {
        e.preventDefault();
        if (historyIndex !== -1) {
          if (historyIndex < commandHistory.length - 1) {
            historyIndex++;
            inputEl.value = commandHistory[historyIndex];
          } else {
            historyIndex = -1;
            inputEl.value = "";
          }
        }
      } else if (e.key === "Tab") {
        e.preventDefault();
        const typed = inputEl.value.trim().toLowerCase();
        if (!typed) {
          // Print all available commands on empty Tab
          printPromptEcho("[Tab]");
          printOutput(`Available Commands: ${availableCmds.join(", ")}`);
          return;
        }

        const matches = availableCmds.filter((c) => c.startsWith(typed));
        if (matches.length === 1) {
          inputEl.value = matches[0];
        } else if (matches.length > 1) {
          printPromptEcho(inputEl.value + " [Tab]");
          printOutput(`Matching Commands: ${matches.join(", ")}`);
        }
      }
    });
  }

  // Bind input listeners
  function initTerminal() {
    const inputEl = document.getElementById("term-input");
    if (inputEl) {
      bindKeyListeners(inputEl);

      const termContainer = document.querySelector(".term-container");
      if (termContainer) {
        termContainer.addEventListener("click", () => {
          inputEl.focus();
        });
      }
    }
  }

  if (
    document.readyState === "complete" ||
    document.readyState === "interactive"
  ) {
    initTerminal();
  } else {
    document.addEventListener("DOMContentLoaded", initTerminal);
  }
})();
