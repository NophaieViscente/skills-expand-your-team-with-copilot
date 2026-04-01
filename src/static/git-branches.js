/**
 * Animated Git-style branch lines background.
 * Draws slowly-moving commit nodes connected by branch lines on a canvas,
 * resembling a git graph, using the school's lime-green color palette.
 */
(function () {
  const canvas = document.getElementById("git-branches-bg");
  if (!canvas) return;

  const ctx = canvas.getContext("2d");

  // School lime-green palette
  const COLORS = ["#3a7d44", "#5aab5e", "#76c442", "#a3e06a", "#1e5928"];

  // Number of branch lanes
  const LANE_COUNT = 6;
  // Pixels between lanes — chosen to spread lanes visually across a wide viewport
  const LANE_SPACING = 120;
  // Fractional offset within a lane so nodes don't sit exactly on the lane guide line
  const LANE_NODE_OFFSET = 0.8;

  // Commit node velocity bounds (pixels per frame, controls how slowly nodes drift down)
  const MIN_NODE_VELOCITY = 0.3;
  const VELOCITY_RANGE = 0.5;

  // Commit node radius bounds (pixels)
  const MIN_NODE_RADIUS = 4;
  const RADIUS_VARIANCE = 3;

  // History trail length bounds (frames kept for the branch line behind each node)
  const MIN_TRAIL_LENGTH = 80;
  const TRAIL_VARIANCE = 60;

  // Merge connector velocity bounds (pixels per frame)
  const MIN_MERGE_VELOCITY = 0.35;
  const MERGE_VELOCITY_RANGE = 0.4;

  // Vertical curvature of merge connector bezier arcs (pixels)
  const MERGE_ARC_HEIGHT = 40;

  // A commit node moving along a lane
  function createNode(laneIndex, canvasHeight) {
    const x = LANE_SPACING * (laneIndex + LANE_NODE_OFFSET);
    return {
      x,
      y: Math.random() * canvasHeight,
      vy: MIN_NODE_VELOCITY + Math.random() * VELOCITY_RANGE,
      radius: MIN_NODE_RADIUS + Math.random() * RADIUS_VARIANCE,
      color: COLORS[laneIndex % COLORS.length],
      lane: laneIndex,
      // Each node carries a tail of previous positions for the line
      history: [],
      maxHistory: MIN_TRAIL_LENGTH + Math.floor(Math.random() * TRAIL_VARIANCE),
    };
  }

  // Merge connector between two lanes (decorative arc)
  function createMerge(fromLane, toLane, canvasHeight) {
    return {
      fromX: LANE_SPACING * (fromLane + LANE_NODE_OFFSET),
      toX: LANE_SPACING * (toLane + LANE_NODE_OFFSET),
      y: Math.random() * canvasHeight,
      vy: MIN_MERGE_VELOCITY + Math.random() * MERGE_VELOCITY_RANGE,
      color: COLORS[fromLane % COLORS.length],
      alpha: 0.7,
    };
  }

  let nodes = [];
  let merges = [];

  function resize() {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
    // Rebuild nodes on resize
    nodes = [];
    merges = [];
    for (let i = 0; i < LANE_COUNT; i++) {
      nodes.push(createNode(i, canvas.height));
    }
    // A few cross-lane merge lines
    for (let m = 0; m < 3; m++) {
      const from = Math.floor(Math.random() * LANE_COUNT);
      const to = (from + 1 + Math.floor(Math.random() * (LANE_COUNT - 1))) % LANE_COUNT;
      merges.push(createMerge(from, to, canvas.height));
    }
  }

  function drawBranchLine(node) {
    if (node.history.length < 2) return;
    ctx.beginPath();
    ctx.strokeStyle = node.color;
    ctx.lineWidth = 2;
    ctx.globalAlpha = 0.6;
    ctx.moveTo(node.history[0].x, node.history[0].y);
    for (let i = 1; i < node.history.length; i++) {
      ctx.lineTo(node.history[i].x, node.history[i].y);
    }
    ctx.stroke();
    ctx.globalAlpha = 1;
  }

  function drawNode(node) {
    ctx.beginPath();
    ctx.arc(node.x, node.y, node.radius, 0, Math.PI * 2);
    ctx.fillStyle = node.color;
    ctx.globalAlpha = 0.85;
    ctx.fill();
    // White center dot
    ctx.beginPath();
    ctx.arc(node.x, node.y, node.radius * 0.4, 0, Math.PI * 2);
    ctx.fillStyle = "#ffffff";
    ctx.globalAlpha = 0.9;
    ctx.fill();
    ctx.globalAlpha = 1;
  }

  function drawMerge(merge) {
    const midX = (merge.fromX + merge.toX) / 2;
    ctx.beginPath();
    ctx.moveTo(merge.fromX, merge.y);
    ctx.bezierCurveTo(midX, merge.y - MERGE_ARC_HEIGHT, midX, merge.y - MERGE_ARC_HEIGHT, merge.toX, merge.y);
    ctx.strokeStyle = merge.color;
    ctx.lineWidth = 1.5;
    ctx.globalAlpha = merge.alpha * 0.5;
    ctx.stroke();
    ctx.globalAlpha = 1;
  }

  function animate() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // Draw vertical lane guides (very faint)
    for (let i = 0; i < LANE_COUNT; i++) {
      const x = LANE_SPACING * (i + LANE_NODE_OFFSET);
      ctx.beginPath();
      ctx.moveTo(x, 0);
      ctx.lineTo(x, canvas.height);
      ctx.strokeStyle = COLORS[i % COLORS.length];
      ctx.lineWidth = 1;
      ctx.globalAlpha = 0.12;
      ctx.stroke();
      ctx.globalAlpha = 1;
    }

    // Update and draw merge connectors
    merges.forEach((merge) => {
      merge.y += merge.vy;
      if (merge.y > canvas.height + 60) {
        merge.y = -60;
      }
      drawMerge(merge);
    });

    // Update and draw nodes
    nodes.forEach((node) => {
      // Save position to history
      node.history.push({ x: node.x, y: node.y });
      if (node.history.length > node.maxHistory) {
        node.history.shift();
      }

      node.y += node.vy;

      // Loop back to top when off-screen
      if (node.y > canvas.height + 20) {
        node.y = -20;
        node.history = [];
      }

      drawBranchLine(node);
      drawNode(node);
    });

    requestAnimationFrame(animate);
  }

  resize();
  window.addEventListener("resize", resize);
  animate();
})();
