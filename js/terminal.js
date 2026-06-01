/**
 * Interactive Terminal Command Line Interface.
 * Handles commands: help, connect, skills, focus, coffee, system, chess, rubik, matrix, clear.
 * Added: Tab-autocomplete, history log traversal (up/down arrow), and rich ASCII commands.
 */

(function() {
  const termInput = document.getElementById('term-input');
  const termBody = document.getElementById('term-body');

  let commandHistory = [];
  let historyIndex = -1;
  const availableCmds = ['help', 'connect', 'skills', 'focus', 'coffee', 'clear', 'system', 'diagnostics', 'chess', 'rubik', 'matrix'];

  // Simple HTML escaping helper
  function escapeHtml(str) {
    return str
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;')
      .replace(/'/g, '&#039;');
  }

  // Print raw output div into terminal stdout
  function printOutput(text, isHtml = false) {
    if (!termBody) return;
    const inputLine = termBody.querySelector('.term-input-line');
    
    const div = document.createElement('div');
    div.className = 'term-output';
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
    printOutput(`<span class="term-prompt">guest@mind:~$</span> ${escapeHtml(cmd)}`, true);
  }

  // Global command executor function
  window.runTermCommand = function(inputStr) {
    const trimmed = inputStr.trim();
    if (!trimmed) return;

    // Save to history
    if (commandHistory.length === 0 || commandHistory[commandHistory.length - 1] !== trimmed) {
      commandHistory.push(trimmed);
    }
    historyIndex = -1;

    // Echo input prompt first
    printPromptEcho(trimmed);

    // Command parser
    const args = trimmed.split(/\s+/);
    const cmd = args[0].toLowerCase();

    switch (cmd) {
      case 'help':
        printOutput(
          `<pre style="font-family: inherit; margin: 0; white-space: pre-wrap; color: var(--text2)">` +
          `Available commands:\n` +
          `  <span style="color: var(--amber)">connect</span>     - Fetch contact details and profile links.\n` +
          `  <span style="color: var(--amber)">skills</span>      - Display ASCII skill core tree.\n` +
          `  <span style="color: var(--amber)">focus</span>       - Toggle Focus/Chaos physics layout mode.\n` +
          `  <span style="color: var(--amber)">coffee</span>      - Overclock canvas vector speeds.\n` +
          `  <span style="color: var(--amber)">system</span>      - Run model diagnostics & core telemetry.\n` +
          `  <span style="color: var(--amber)">chess</span>       - Print strategic chess position board.\n` +
          `  <span style="color: var(--amber)">rubik</span>       - Renders a flattened unfolded Rubik's cube.\n` +
          `  <span style="color: var(--amber)">matrix</span>      - Trigger digital code rain simulation.\n` +
          `  <span style="color: var(--amber)">clear</span>       - Purge terminal stdout buffer.` +
          `</pre>`,
          true
        );
        break;

      case 'connect':
        printOutput(
          `<div style="color: var(--text2); line-height: 1.7;">` +
          `<span style="color: var(--cyan)">[LINKING] Establishing secure neural sockets... SUCCESS.</span><br>` +
          `==================================================<br>` +
          `• <b>Email:</b>     <a href="mailto:akash.mehra@email.com" class="hoverable" style="color: var(--amber); text-decoration: none;">akash.mehra@email.com</a><br>` +
          `• <b>Phone:</b>     +91 98765 43210<br>` +
          `• <b>GitHub:</b>    <a href="https://github.com" target="_blank" class="hoverable" style="color: var(--amber); text-decoration: none;">github.com/akashmehra</a><br>` +
          `• <b>LinkedIn:</b>  <a href="https://linkedin.com" target="_blank" class="hoverable" style="color: var(--amber); text-decoration: none;">linkedin.com/in/akashmehra</a><br>` +
          `• <b>Resume:</b>    <a href="#" class="hoverable" style="color: var(--lime); text-decoration: underline;">Download PDF resume.pdf</a><br>` +
          `==================================================` +
          `</div>`,
          true
        );
        if (window.unlockAchievement) {
          window.unlockAchievement('contact_view', '📞 Secure Channel Socket Connected!');
        }
        break;

      case 'skills':
        printOutput(
          `<pre style="font-family: inherit; margin: 0; white-space: pre; color: var(--v); line-height: 1.4;">` +
          `AI/ML Core Architecture Tree:\n` +
          `==================================================\n` +
          `├── [Deep Learning]    ────── PyTorch, TensorFlow, CUDA, TensorRT\n` +
          `├── [Computer Vision]  ────── YOLOv8, OpenCV, Image Segmentation\n` +
          `├── [NLP & Agents]     ────── LangChain, FAISS, LLMs, Vector DBs\n` +
          `└── [MLOps & Dev]      ────── Docker, FastAPI, Redis, Git, CI/CD\n` +
          `==================================================\n` +
          `<span style="color: var(--text3); font-size: 11px;">(Tip: Type 'focus' to see how these map onto projects in Focus Mode!)</span>` +
          `</pre>`,
          true
        );
        break;

      case 'focus':
        if (window.toggleFocusMode) {
          window.toggleFocusMode();
          const stateStr = window.focusModeActive ? 'STRUCTURED FOCUS (Snapped)' : 'CONTROLLED CHAOS (Floating)';
          const color = window.focusModeActive ? 'var(--cyan)' : 'var(--amber)';
          printOutput(
            `[SYSTEM] Snapping physics updated. State transition initialized.<br>` +
            `Layout Mode set to: <span style="color: ${color}; font-weight: bold;">${stateStr}</span>`,
            true
          );
        } else {
          printOutput(`[ERROR] State manager toggleFocusMode not loaded.`, false);
        }
        break;

      case 'coffee':
        if (window.triggerCaffeineOverdrive) {
          window.triggerCaffeineOverdrive();
          const stateStr = window.caffeineOverdrive ? 'CAFFEINE OVERDRIVE ACTIVE (4.0GHz)' : 'NORMAL SPEED LIMIT';
          const color = window.caffeineOverdrive ? 'var(--amber)' : 'var(--text3)';
          
          if (window.caffeineOverdrive) {
            printOutput(
              `<span style="color: var(--amber)">>> Injecting double espresso shots...</span><br>` +
              `>> Overclocking neural canvas speed vectors by 3.5x...<br>` +
              `System Status: <span style="color: ${color}; font-weight: bold;">${stateStr}</span>`,
              true
            );
          } else {
            printOutput(
              `>> Flushed caffeine from thread buffers.<br>` +
              `System Status: <span style="color: ${color}; font-weight: bold;">${stateStr}</span>`,
              true
            );
          }
        } else {
          printOutput(`[ERROR] State manager triggerCaffeineOverdrive not loaded.`, false);
        }
        break;

      case 'system':
      case 'diagnostics':
        printOutput(
          `<pre style="font-family: inherit; margin: 0; color: var(--lime); line-height: 1.3;">` +
          `================= MODEL TELEMETRY REPORT =================\n` +
          `• CPU Usage: [|||||||||||||||||||         ] 68.4% (8 Threads Active)\n` +
          `• GPU Memory: [|||||||||||||||||||||||||   ] 8.2GB / 12GB (CUDA 12.1)\n` +
          `• ONNX Model: YOLOv8 FP16 Quantized (Loaded)\n` +
          `• FAISS Index: 10M Semantic Chunk Arrays (Synced)\n` +
          `• Chat Persona Core: AkashAI Active (${window.currentPersona || 'professional'})\n` +
          `• System Status: ALL SYSTEMS OPERATIONAL (Caffeine: ${window.caffeineOverdrive ? 'OVERDRIVE' : 'NORMAL'})\n` +
          `==========================================================` +
          `</pre>`,
          true
        );
        break;

      case 'chess':
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
          true
        );
        break;

      case 'rubik':
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
          true
        );
        break;

      case 'matrix':
        printOutput(`<span style="color:#22c55e">Initializing stream logic...</span>`, true);
        let count = 0;
        const interval = setInterval(() => {
          if (count > 8) {
            clearInterval(interval);
            printOutput(`<span style="color:#22c55e">Matrix connection socket closed safely.</span>`, true);
            return;
          }
          let line = '';
          for (let i = 0; i < 40; i++) {
            line += Math.random() > 0.5 ? '1' : '0';
          }
          printOutput(`<span style="color:#22c55e;font-family:monospace;letter-spacing:2px;">${line}</span>`, true);
          count++;
        }, 150);
        break;

      case 'clear':
        if (termBody) {
          const outputs = termBody.querySelectorAll('.term-output');
          outputs.forEach(el => el.remove());
        }
        break;

      default:
        printOutput(`Command not found: '${escapeHtml(cmd)}'. Type 'help' for available commands.`, false);
        break;
    }
  };

  // Keyboard navigation & autocomplete logic
  function bindKeyListeners(inputEl) {
    if (!inputEl) return;

    inputEl.addEventListener('keydown', function(e) {
      if (e.key === 'Enter') {
        const value = inputEl.value;
        inputEl.value = '';
        window.runTermCommand(value);
      } 
      else if (e.key === 'ArrowUp') {
        e.preventDefault();
        if (commandHistory.length > 0) {
          if (historyIndex === -1) {
            historyIndex = commandHistory.length - 1;
          } else if (historyIndex > 0) {
            historyIndex--;
          }
          inputEl.value = commandHistory[historyIndex];
        }
      } 
      else if (e.key === 'ArrowDown') {
        e.preventDefault();
        if (historyIndex !== -1) {
          if (historyIndex < commandHistory.length - 1) {
            historyIndex++;
            inputEl.value = commandHistory[historyIndex];
          } else {
            historyIndex = -1;
            inputEl.value = '';
          }
        }
      } 
      else if (e.key === 'Tab') {
        e.preventDefault();
        const typed = inputEl.value.trim().toLowerCase();
        if (!typed) {
          // Print all available commands on empty Tab
          printPromptEcho('[Tab]');
          printOutput(`Available Commands: ${availableCmds.join(', ')}`);
          return;
        }

        const matches = availableCmds.filter(c => c.startsWith(typed));
        if (matches.length === 1) {
          inputEl.value = matches[0];
        } else if (matches.length > 1) {
          printPromptEcho(inputEl.value + ' [Tab]');
          printOutput(`Matching Commands: ${matches.join(', ')}`);
        }
      }
    });
  }

  // Bind input listeners
  document.addEventListener('DOMContentLoaded', () => {
    const inputEl = document.getElementById('term-input');
    if (inputEl) {
      bindKeyListeners(inputEl);
      
      const termContainer = document.querySelector('.term-container');
      if (termContainer) {
        termContainer.addEventListener('click', () => {
          inputEl.focus();
        });
      }
    }
  });

  // Fallback binding if DOM loaded already
  const inputEl = document.getElementById('term-input');
  if (inputEl) {
    bindKeyListeners(inputEl);
    const termContainer = document.querySelector('.term-container');
    if (termContainer) {
      termContainer.addEventListener('click', () => {
        inputEl.focus();
      });
    }
  }

})();
