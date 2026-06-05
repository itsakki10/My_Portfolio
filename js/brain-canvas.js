/**
 * 3D Projected Neural Brain Canvas Renderer
 * Supports:
 *  - 3D Lobe Point-Sphere distribution representation.
 *  - 3D orbiting emoji/icon vectors.
 *  - Drag & hover mouse coordinate parallax pitch/yaw rotations.
 *  - Flight-forward camera zoom transition animations.
 */

(function () {
  let canvas, ctx;
  let W, H;
  let nodes = [];
  let backgroundNodes = [];
  let orbits = [];

  // Projection and dynamic rotation physics variables
  let pitch = 0.2;
  let yaw = -0.4;

  let autoYaw = 0;
  let autoPitch = 0;
  let parallaxYaw = 0;
  let parallaxPitch = 0;
  let dragYaw = -0.4;
  let dragPitch = 0.2;

  let scale3D = 3.0; // Overall 3D scale
  let zoomFactor = 1.0;
  let isZooming = false;
  let isDragging = false;
  let fadeAlpha = 1.0;

  // Orbiting elements profile (upgraded to professional monospaced HUD tags)
  const orbitItems = [
    {
      text: "[ 燃料.caffeine ]",
      name: "Caffeine",
      r: 140,
      speed: 0.009,
      phase: 0,
      color: "#e9cb25",
    },
    {
      text: "[ Vision_Vox ]",
      name: "AI Agents",
      r: 165,
      speed: -0.007,
      phase: 1.5,
      color: "#22d3ee",
    },
    {
      text: "[ 将棋.Anime_ai ]",
      name: "Chess & Shogi AI",
      r: 185,
      speed: 0.005,
      phase: 3.0,
      color: "#a78bfa",
    },
    {
      text: "[ Python.py ]",
      name: "Flask",
      r: 140,
      speed: 0.009,
      phase: 1,
      color: "#fbbf24",
    },
    {
      text: "[ エージェント.synapse ]",
      name: "AI Agents",
      r: 165,
      speed: -0.007,
      phase: 1.5,
      color: "#22d3ee",
    },
    {
      text: "[ 将棋.shogi_ai ]",
      name: "Chess & Shogi AI",
      r: 185,
      speed: 0.005,
      phase: 3.5,
      color: "#a78bfa",
    },
    {
      text: "[ Computer Vision ]",
      name: "Computer Vision",
      r: 150,
      speed: -0.008,
      phase: 0.5,
      color: "#22d3ee",
    },
    {
      text: "[ bias.weights ]",
      name: "Deep Learning",
      r: 185,
      speed: 0.007,
      phase: 2.2,
      color: "#fbbf24",
    },
    {
      text: "[ hackathon.勝利 ]",
      name: "Competitions",
      r: 210,
      speed: -0.004,
      phase: 4.5,
      color: "#a78bfa",
    },
    {
      text: "[ 規律.discipline ]",
      name: "Athletics",
      r: 130,
      speed: 0.011,
      phase: 1.0,
      color: "#faf7f2",
    },
    {
      text: "[ 展開.deployment ]",
      name: "System Design",
      r: 190,
      speed: -0.006,
      phase: 3.8,
      color: "#22d3ee",
    },
  ];

  window.addEventListener("DOMContentLoaded", () => {
    canvas = $("brain-canvas");
    if (!canvas) return;

    ctx = canvas.getContext("2d");

    // Set size
    rs();
    window.addEventListener("resize", rs);

    // Create brain nodes
    buildBrainNodes();

    // Create orbits
    buildOrbitItems();

    // Mouse drag rotation & hover parallax listeners
    let startX = 0,
      startY = 0;
    let startDragYaw = 0,
      startDragPitch = 0;

    canvas.addEventListener("mousedown", (e) => {
      if (isZooming) return;
      isDragging = true;
      startX = e.clientX;
      startY = e.clientY;
      startDragYaw = dragYaw;
      startDragPitch = dragPitch;
    });

    document.addEventListener("mousemove", (e) => {
      if (isZooming) return;

      const mx = e.clientX - W / 2;
      const my = e.clientY - H / 2;

      if (isDragging) {
        const dx = e.clientX - startX;
        const dy = e.clientY - startY;
        dragYaw = startDragYaw + dx * 0.006;
        dragPitch = startDragPitch + dy * 0.006;
        dragPitch = Math.max(-Math.PI / 3, Math.min(Math.PI / 3, dragPitch));
      } else {
        // Subtle background cursor parallax
        parallaxYaw = (mx / (W / 2)) * 0.25;
        parallaxPitch = (my / (H / 2)) * 0.25;
      }
    });

    document.addEventListener("mouseup", () => {
      isDragging = false;
    });

    // Touch support for swipe rotations on mobile
    canvas.addEventListener("touchstart", (e) => {
      if (isZooming) return;
      if (e.touches.length === 1) {
        isDragging = true;
        startX = e.touches[0].clientX;
        startY = e.touches[0].clientY;
        startDragYaw = dragYaw;
        startDragPitch = dragPitch;
      }
    });

    document.addEventListener("touchmove", (e) => {
      if (isZooming) return;
      if (isDragging && e.touches.length === 1) {
        const dx = e.touches[0].clientX - startX;
        const dy = e.touches[0].clientY - startY;
        dragYaw = startDragYaw + dx * 0.006;
        dragPitch = startDragPitch + dy * 0.006;
        dragPitch = Math.max(-Math.PI / 3, Math.min(Math.PI / 3, dragPitch));
      }
    });

    document.addEventListener("touchend", () => {
      isDragging = false;
    });

    // Start rendering loops
    draw();
  });

  function rs() {
    W = canvas.width = window.innerWidth;
    H = canvas.height = window.innerHeight;
  }

  // Construct dual-hemisphere brain point clouds & background neuron structures
  function buildBrainNodes() {
    nodes = [];
    backgroundNodes = [];
    const count = 280; // Upgraded particle density

    for (let i = 0; i < count; i++) {
      // Choose left or right lobe
      const isLeft = Math.random() > 0.5;
      const ox = isLeft ? -18 : 18;

      const theta = Math.random() * Math.PI * 2;
      const phi = Math.acos(Math.random() * 2 - 1);

      // Ellipsoidal shape parameters
      const rx = 24 + Math.random() * 6;
      const ry = 28 + Math.random() * 6;
      const rz = 24 + Math.random() * 6;

      const px = ox + rx * Math.sin(phi) * Math.cos(theta);
      const py = ry * Math.sin(phi) * Math.sin(theta) * 0.8;
      const pz = rz * Math.cos(phi);

      // Varying sizes and high-aesthetic color ratios
      const sizeMult = 0.6 + Math.random() * 1.0;
      const randColor = Math.random();
      let colorPrefix;
      if (randColor > 0.3) {
        colorPrefix = "rgba(255, 42, 133, "; // Sakura Pink (70%)
      } else if (randColor > 0.5) {
        colorPrefix = "rgba(0, 240, 255, "; // Cyber neon cyan (15%)
      } else {
        colorPrefix = "rgba(167, 139, 250, "; // Neural violet glow (15%)
      }

      nodes.push({
        x: px,
        y: py,
        z: pz,
        colorPrefix: colorPrefix,
        sizeMult: sizeMult,
        phase: Math.random() * Math.PI * 2,
      });
    }

    // Build background neural dust nodes
    const bgCount = 100;
    for (let i = 0; i < bgCount; i++) {
      const randColor = Math.random();
      const colorPrefix =
        randColor > 0.5 ? "rgba(255, 42, 133, " : "rgba(0, 240, 255, ";
      backgroundNodes.push({
        x: (Math.random() - 0.5) * 500,
        y: (Math.random() - 0.5) * 500,
        z: (Math.random() - 0.5) * 500,
        size: 0.5 + Math.random() * 1.5,
        speed: 0.05 + Math.random() * 0.08,
        colorPrefix: colorPrefix,
      });
    }
  }

  function buildOrbitItems() {
    orbits = orbitItems.map((item) => ({
      ...item,
      theta: item.phase,
    }));
  }

  // Linear projection engine mapping 3D to 2D (supports responsive right-side positioning)
  function project(x, y, z) {
    // Apply Y-axis rotation (Yaw)
    const cosY = Math.cos(yaw),
      sinY = Math.sin(yaw);
    let x1 = x * cosY - z * sinY;
    let z1 = x * sinY + z * cosY;

    // Apply X-axis rotation (Pitch)
    const cosX = Math.cos(pitch),
      sinX = Math.sin(pitch);
    let y2 = y * cosX - z1 * sinX;
    let z2 = y * sinX + z1 * cosX;

    // Camera perspective settings
    const dist = 320;
    const isDesktop = W > 768;
    const currentScale3D = isDesktop ? 4.2 : 3.0; // Responsive brain scale
    const scale =
      (dist / (dist + z2 * zoomFactor)) * currentScale3D * zoomFactor;

    // Shift brain to the right side on desktop, center on mobile
    const centerX = isDesktop ? W * 0.62 : W / 2;
    const centerY = H / 2;

    return {
      x: centerX + x1 * scale,
      y: centerY + y2 * scale,
      z: z2,
      scale: scale,
    };
  }

  // Zoom flight sequence triggered by CTA
  window.triggerBrainZoom = function () {
    isZooming = true;
  };

  window.resetBrainZoom = function () {
    isZooming = false;
    zoomFactor = 1.0;
    fadeAlpha = 1.0;
  };

  // Helper to map brain colors depending on active theme
  function getBrainColor(prefix, opacity) {
    const isLight = document.body.classList.contains("light-mode");
    if (isLight) {
      return `rgba(18, 18, 18, ${opacity * 0.85})`; // Sketchbook charcoal black ink
    }
    return prefix + opacity + ")";
  }

  function getOrbitColor(color) {
    const isLight = document.body.classList.contains("light-mode");
    if (isLight) {
      return "#121212"; // Sketchbook ink
    }
    if (color === "#fbbf24") return "#ff2a85"; // Map warm amber to neon Sakura Pink in dark mode
    if (color === "#22d3ee") return "#00f0ff"; // Map cyan
    return color;
  }

  function draw() {
    ctx.clearRect(0, 0, W, H);

    // Constant slow auto-orbit if not actively dragging
    if (!isDragging) {
      autoYaw += 0.001;
    }

    // Combine auto-spin, cursor parallax, and drag offsets
    const targetYaw = autoYaw + parallaxYaw + dragYaw;
    const targetPitch = autoPitch + parallaxPitch + dragPitch;

    // Smoothly lerp towards target pitch and yaw rotations
    yaw += (targetYaw - yaw) * 0.08;
    pitch += (targetPitch - pitch) * 0.08;

    // Handle zoom animation physics
    if (isZooming) {
      zoomFactor = zoomFactor * 1.08 + 0.04;
      fadeAlpha = Math.max(0, fadeAlpha - 0.06);
    }

    // Render background slow-drifting neural dust
    backgroundNodes.forEach((n) => {
      n.z -= n.speed;
      if (n.z < -250) n.z = 250; // loop back

      const proj = project(n.x, n.y, n.z);
      if (proj.z > -200) {
        ctx.beginPath();
        const r = Math.max(0.3, n.size * proj.scale * 0.3);
        ctx.arc(proj.x, proj.y, r, 0, Math.PI * 2);
        ctx.fillStyle = n.colorPrefix + 0.12 * fadeAlpha + ")";
        ctx.fill();
      }
    });

    // Sort nodes back-to-front (Z-sorting)
    const projectedNodes = nodes
      .map((n) => ({
        ...n,
        proj: project(n.x, n.y, n.z),
      }))
      .sort((a, b) => b.proj.z - a.proj.z);

    // Draw connecting lines between close nodes
    ctx.lineWidth = 0.4;
    for (let i = 0; i < projectedNodes.length; i++) {
      for (let j = i + 1; j < projectedNodes.length; j++) {
        const a = projectedNodes[i];
        const b = projectedNodes[j];

        const dx = a.x - b.x;
        const dy = a.y - b.y;
        const dz = a.z - b.z;
        const dist = Math.sqrt(dx * dx + dy * dy + dz * dz);

        // Connections threshold limit
        if (dist < 26) {
          const alpha = (1 - dist / 26) * 0.15 * fadeAlpha;
          ctx.beginPath();
          ctx.moveTo(a.proj.x, a.proj.y);
          ctx.lineTo(b.proj.x, b.proj.y);
          ctx.strokeStyle = getBrainColor("rgba(255, 42, 133, ", alpha);
          ctx.stroke();
        }
      }
    }

    // Draw brain particles (with organic twinkle/pulse simulation)
    const tVal = Date.now();
    projectedNodes.forEach((n) => {
      const { x, y, scale } = n.proj;
      const pulseSize = 0.85 + 0.25 * Math.sin(tVal * 0.003 + n.phase);
      const pulseAlpha = 0.55 + 0.35 * Math.sin(tVal * 0.003 + n.phase);
      const r = Math.max(0.5, 1.3 * scale * n.sizeMult * pulseSize);

      ctx.beginPath();
      ctx.arc(x, y, r, 0, Math.PI * 2);
      ctx.fillStyle = getBrainColor(n.colorPrefix, pulseAlpha * fadeAlpha);
      ctx.fill();
    });

    // Render orbiting elements (monospaced HUD labels with Z-depth shading)
    orbits.forEach((item) => {
      // Increase orbits speed if caffeine mode is active
      const speedMult = window.caffeineOverdrive ? 3.0 : 1.0;
      item.theta += item.speed * speedMult;

      // Compute 3D orbit coordinate
      const ox = Math.cos(item.theta) * item.r;
      const oy = Math.sin(item.theta * 0.5) * 15; // Subtle vertical float sway wave
      const oz = Math.sin(item.theta) * item.r;

      const proj = project(ox, oy, oz);

      // Render text elements with Z-depth scaling
      if (proj.z > -150) {
        // filter extreme back-clipping
        ctx.save();
        const size = Math.max(8, Math.round(11 * proj.scale));
        ctx.font = `600 ${size}px 'Space Mono', monospace`;

        // Fade out labels that are behind the brain
        const depthAlpha = proj.z > 0 ? 0.25 : 0.85;
        ctx.globalAlpha = Math.max(0.05, fadeAlpha * depthAlpha);
        ctx.textAlign = "center";
        ctx.textBaseline = "middle";

        // Draw text with glow
        const itemColor = getOrbitColor(item.color);
        ctx.fillStyle = itemColor;
        ctx.shadowBlur = 6;
        ctx.shadowColor = itemColor;
        ctx.fillText(item.text, proj.x, proj.y);
        ctx.restore();
      }
    });

    // Loop
    requestAnimationFrame(draw);
  }
})();
