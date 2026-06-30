import { useEffect } from 'react';

interface Participant {
  id: string;
  name: string;
  balance: number;
  nextMilestone: number;
  stars: number;
  maxStars: number;
}

function drawStar(ctx: CanvasRenderingContext2D, cx: number, cy: number, r: number, rot: number) {
  const pts = 5;
  ctx.beginPath();
  for (let i = 0; i < pts * 2; i++) {
    const angle = rot + (i * Math.PI) / pts - Math.PI / 2;
    const radius = i % 2 === 0 ? r : r * 0.43;
    const x = cx + Math.cos(angle) * radius;
    const y = cy + Math.sin(angle) * radius;
    if (i === 0) {
      ctx.moveTo(x, y);
    } else {
      ctx.lineTo(x, y);
    }
  }
  ctx.closePath();
}

function useStarfield(canvasId: string) {
  useEffect(() => {
    const canvas = document.getElementById(canvasId) as HTMLCanvasElement;
    if (!canvas) return;
    const ctx = canvas.getContext('2d')!;

    const resize = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };
    resize();
    window.addEventListener('resize', resize);

    const W = () => canvas.width;
    const H = () => canvas.height;

    const positions = [
      [0.04,0.06],[0.18,0.12],[0.88,0.04],[0.96,0.10],[0.52,0.07],
      [0.08,0.32],[0.92,0.28],[0.03,0.55],[0.97,0.50],[0.12,0.78],
      [0.88,0.82],[0.05,0.92],[0.95,0.88],[0.50,0.94],[0.30,0.88],
      [0.70,0.90],[0.25,0.45],[0.75,0.38],[0.40,0.20],[0.62,0.82],
      [0.15,0.60],[0.85,0.60],[0.48,0.55],[0.33,0.70],[0.68,0.15],
      [0.78,0.68],[0.22,0.25],[0.58,0.35],
    ];

    const stars = positions.map((pos, i) => ({
      xRatio: pos[0],
      yRatio: pos[1],
      size: i < 8 ? 2 + Math.random() * 2 : i < 20 ? 4 + Math.random() * 5 : 3 + Math.random() * 3,
      phase: Math.random() * Math.PI * 2 * (i + 1) * 0.618,
      pulseSpeed: 0.002 + Math.random() * 0.004,
      rot: Math.random() * Math.PI * 2,
      rotSpeed: (Math.random() - 0.5) * 0.0008,
      warm: i % 5 !== 0,
    }));

    let raf: number;
    function draw() {
      ctx.clearRect(0, 0, W(), H());

      stars.forEach(s => {
        s.phase += s.pulseSpeed;
        s.rot += s.rotSpeed;
        const alpha = 0.1 + 0.7 * (0.5 + 0.5 * Math.sin(s.phase));
        const x = s.xRatio * W();
        const y = s.yRatio * H();

        const glowColor = s.warm
          ? `rgba(255, 235, 120, ${alpha * 0.45})`
          : `rgba(180, 210, 255, ${alpha * 0.4})`;
        const starColor = s.warm
          ? `rgba(255, 245, 180, ${alpha})`
          : `rgba(200, 220, 255, ${alpha})`;

        const glow = ctx.createRadialGradient(x, y, 0, x, y, s.size * 3.5);
        glow.addColorStop(0, glowColor);
        glow.addColorStop(1, 'rgba(0,0,0,0)');
        ctx.beginPath();
        ctx.arc(x, y, s.size * 3.5, 0, Math.PI * 2);
        ctx.fillStyle = glow;
        ctx.fill();

        drawStar(ctx, x, y, s.size, s.rot);
        ctx.fillStyle = starColor;
        ctx.fill();
      });

      raf = requestAnimationFrame(draw);
    }
    draw();

    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener('resize', resize);
    };
  }, [canvasId]);
}

export function CurrencyDisplay({ participant }: { participant: Participant }) {
  const progressPct = Math.min(
    100,
    Math.round((participant.balance / participant.nextMilestone) * 100)
  );

  useStarfield('result-star-canvas');

  return (
    <div className="currency-display">
      <canvas id="result-star-canvas" className="currency-star-canvas" />
      <div className="currency-content">
        <p className="currency-welcome">Welcome back</p>
        <p className="currency-name">{participant.name}</p>
        <div className="currency-balance">
          <span className="currency-amount">
            {participant.balance.toLocaleString()}
          </span>
        </div>
        <p className="currency-label">Points</p>
        <div className="currency-milestone">
          <div className="currency-progress-track">
            <div
              className="currency-progress-fill"
              style={{ width: `${progressPct}%` }}
            />
          </div>
          <div className="currency-progress-meta">
            <span>{participant.nextMilestone - participant.balance} to next milestone</span>
            <span>Next: {participant.nextMilestone.toLocaleString()}</span>
          </div>
        </div>
        
      </div>
    </div>
  );
}