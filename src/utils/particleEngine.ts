// Canvas Particle Engine for Star-Bursts, Line Blasts, and Sprinkle Explosions

export type ParticleType = 'star' | 'circle' | 'spark' | 'ring' | 'sprinkle';

export interface Particle {
  x: number;
  y: number;
  vx: number;
  vy: number;
  size: number;
  width?: number;
  height?: number;
  color: string;
  alpha: number;
  decay: number;
  gravity: number;
  rotation: number;
  vRot: number;
  oscillation?: number;
  vOsc?: number;
  type: ParticleType;
}

const COLOR_MAP: Record<string, string[]> = {
  red: ['#f43f5e', '#ff2a55', '#fb7185', '#ffe4e6', '#fda4af'],
  blue: ['#0ea5e9', '#38bdf8', '#7dd3fc', '#ffffff', '#0284c7'],
  yellow: ['#facc15', '#fde047', '#fef08a', '#ffffff', '#fbbf24'],
  green: ['#22c55e', '#4ade80', '#86efac', '#ffffff', '#16a34a'],
  purple: ['#a855f7', '#c084fc', '#e9d5ff', '#ffffff', '#9333ea'],
  orange: ['#fb923c', '#ea580c', '#fdba74', '#ffffff', '#c2410c'],
  cyan: ['#22d3ee', '#06b6d4', '#67e8f9', '#ffffff', '#0e7490'],
  pink: ['#f472b6', '#ec4899', '#fbcfe8', '#ffffff', '#be185d'],
  lime: ['#a3e635', '#84cc16', '#d9f99d', '#ffffff', '#4d7c0f'],
  rainbow: [
    '#f43f5e',
    '#fb923c',
    '#facc15',
    '#22c55e',
    '#0ea5e9',
    '#a855f7',
    '#f472b6',
    '#22d3ee',
    '#a3e635',
    '#ffffff',
  ],
  bomb: ['#f97316', '#ef4444', '#fbbf24', '#78716c', '#ffffff'],
  rocket: ['#38bdf8', '#fbbf24', '#f97316', '#ffffff'],
};

class ParticleEngine {
  private canvas: HTMLCanvasElement | null = null;
  private ctx: CanvasRenderingContext2D | null = null;
  private particles: Particle[] = [];
  private animationFrameId: number | null = null;
  private isRunning: boolean = false;

  public init(canvas: HTMLCanvasElement) {
    this.canvas = canvas;
    this.ctx = canvas.getContext('2d', { alpha: true });
    this.resize();
  }

  public resize() {
    if (!this.canvas) return;
    const rect = this.canvas.getBoundingClientRect();
    if (rect.width === 0 || rect.height === 0) return;
    const dpr = Math.min(window.devicePixelRatio || 1, 2);
    this.canvas.width = Math.round(rect.width * dpr);
    this.canvas.height = Math.round(rect.height * dpr);
    if (this.ctx) {
      this.ctx.setTransform(1, 0, 0, 1, 0, 0);
      this.ctx.scale(dpr, dpr);
    }
  }

  // Trigger burst at (x, y) relative to canvas
  public emitBurst(
    x: number,
    y: number,
    colorKey: string = 'yellow',
    count: number = 24,
    power: number = 1
  ) {
    const palette = COLOR_MAP[colorKey] || COLOR_MAP.rainbow;

    // 1. Star-bursts
    for (let i = 0; i < Math.floor(count * 0.4); i++) {
      const angle = Math.random() * Math.PI * 2;
      const speed = (2 + Math.random() * 5.5) * power;
      this.particles.push({
        x,
        y,
        vx: Math.cos(angle) * speed,
        vy: Math.sin(angle) * speed - 1.2,
        size: 7 + Math.random() * 6,
        color: palette[Math.floor(Math.random() * palette.length)],
        alpha: 1,
        decay: 0.016 + Math.random() * 0.015,
        gravity: 0.12,
        rotation: Math.random() * Math.PI * 2,
        vRot: (Math.random() - 0.5) * 0.25,
        type: 'star',
      });
    }

    // 2. High-speed circular sparks
    for (let i = 0; i < count; i++) {
      const angle = Math.random() * Math.PI * 2;
      const speed = (1.5 + Math.random() * 6) * power;
      this.particles.push({
        x,
        y,
        vx: Math.cos(angle) * speed,
        vy: Math.sin(angle) * speed - 0.8,
        size: 3 + Math.random() * 4,
        color: palette[Math.floor(Math.random() * palette.length)],
        alpha: 1,
        decay: 0.02 + Math.random() * 0.02,
        gravity: 0.1,
        rotation: 0,
        vRot: 0,
        type: 'circle',
      });
    }

    // 3. Shockwave Ring
    this.particles.push({
      x,
      y,
      vx: 0,
      vy: 0,
      size: 8,
      color: palette[0],
      alpha: 0.85,
      decay: 0.05,
      gravity: 0,
      rotation: 0,
      vRot: 0,
      type: 'ring',
    });

    this.startLoop();
  }

  // Celebratory Rainbow Sprinkle Blast for Completed Lines
  public emitSprinkleLineBlast(cells: { x: number; y: number; color?: string }[]) {
    const rainbowColors = COLOR_MAP.rainbow;

    for (const cell of cells) {
      // 1. Festive Candy Sprinkles (Rectangular tumbling rods)
      for (let i = 0; i < 6; i++) {
        const angle = Math.random() * Math.PI * 2;
        const speed = 2.5 + Math.random() * 6.5;
        this.particles.push({
          x: cell.x + (Math.random() - 0.5) * 16,
          y: cell.y + (Math.random() - 0.5) * 16,
          vx: Math.cos(angle) * speed,
          vy: Math.sin(angle) * speed - 2.5,
          size: 7 + Math.random() * 5,
          width: 8 + Math.random() * 6,
          height: 3 + Math.random() * 2,
          color: rainbowColors[Math.floor(Math.random() * rainbowColors.length)],
          alpha: 1,
          decay: 0.014 + Math.random() * 0.014,
          gravity: 0.15,
          rotation: Math.random() * Math.PI * 2,
          vRot: (Math.random() - 0.5) * 0.35,
          oscillation: Math.random() * Math.PI,
          vOsc: 0.15 + Math.random() * 0.1,
          type: 'sprinkle',
        });
      }

      // 2. Bright twinkling stars
      for (let i = 0; i < 3; i++) {
        const angle = Math.random() * Math.PI * 2;
        const speed = 1.5 + Math.random() * 4.5;
        this.particles.push({
          x: cell.x,
          y: cell.y,
          vx: Math.cos(angle) * speed,
          vy: Math.sin(angle) * speed - 1.8,
          size: 6 + Math.random() * 5,
          color: rainbowColors[Math.floor(Math.random() * rainbowColors.length)],
          alpha: 1,
          decay: 0.016 + Math.random() * 0.012,
          gravity: 0.1,
          rotation: Math.random() * Math.PI * 2,
          vRot: (Math.random() - 0.5) * 0.25,
          type: 'star',
        });
      }

      // 3. Glitter dots
      for (let i = 0; i < 4; i++) {
        const angle = Math.random() * Math.PI * 2;
        const speed = 1.2 + Math.random() * 3.5;
        this.particles.push({
          x: cell.x,
          y: cell.y,
          vx: Math.cos(angle) * speed,
          vy: Math.sin(angle) * speed - 0.8,
          size: 2.5 + Math.random() * 3,
          color: '#ffffff',
          alpha: 1,
          decay: 0.025,
          gravity: 0.08,
          rotation: 0,
          vRot: 0,
          type: 'circle',
        });
      }

      // 4. Expanding shock ring
      this.particles.push({
        x: cell.x,
        y: cell.y,
        vx: 0,
        vy: 0,
        size: 5,
        color: cell.color ? (COLOR_MAP[cell.color]?.[0] || '#38bdf8') : '#facc15',
        alpha: 0.9,
        decay: 0.06,
        gravity: 0,
        rotation: 0,
        vRot: 0,
        type: 'ring',
      });
    }

    this.startLoop();
  }

  // Mega bomb explosion burst
  public emitBombExplosion(x: number, y: number) {
    this.emitBurst(x, y, 'bomb', 45, 1.6);
    for (let i = 0; i < 2; i++) {
      this.particles.push({
        x,
        y,
        vx: 0,
        vy: 0,
        size: 12 + i * 8,
        color: i === 0 ? '#ef4444' : '#f59e0b',
        alpha: 0.9,
        decay: 0.035,
        gravity: 0,
        rotation: 0,
        vRot: 0,
        type: 'ring',
      });
    }
  }

  private startLoop() {
    if (this.canvas && this.canvas.width === 0) {
      this.resize();
    }
    if (this.isRunning) return;
    this.isRunning = true;
    const animate = () => {
      this.update();
      this.draw();
      if (this.particles.length > 0) {
        this.animationFrameId = requestAnimationFrame(animate);
      } else {
        this.isRunning = false;
        if (this.ctx && this.canvas) {
          const rect = this.canvas.getBoundingClientRect();
          this.ctx.clearRect(0, 0, rect.width, rect.height);
        }
      }
    };
    this.animationFrameId = requestAnimationFrame(animate);
  }

  private update() {
    for (let i = this.particles.length - 1; i >= 0; i--) {
      const p = this.particles[i];
      p.x += p.vx;
      p.y += p.vy;
      p.vy += p.gravity;
      p.vx *= 0.975;
      p.vy *= 0.975;
      p.rotation += p.vRot;
      p.alpha -= p.decay;

      if (p.oscillation !== undefined && p.vOsc !== undefined) {
        p.oscillation += p.vOsc;
      }

      if (p.type === 'ring') {
        p.size += 4.5;
      }

      if (p.alpha <= 0) {
        this.particles.splice(i, 1);
      }
    }
  }

  private drawStar(
    ctx: CanvasRenderingContext2D,
    cx: number,
    cy: number,
    spikes: number,
    outerRadius: number,
    innerRadius: number
  ) {
    let rot = (Math.PI / 2) * 3;
    let x = cx;
    let y = cy;
    const step = Math.PI / spikes;

    ctx.beginPath();
    ctx.moveTo(cx, cy - outerRadius);
    for (let i = 0; i < spikes; i++) {
      x = cx + Math.cos(rot) * outerRadius;
      y = cy + Math.sin(rot) * outerRadius;
      ctx.lineTo(x, y);
      rot += step;

      x = cx + Math.cos(rot) * innerRadius;
      y = cy + Math.sin(rot) * innerRadius;
      ctx.lineTo(x, y);
      rot += step;
    }
    ctx.lineTo(cx, cy - outerRadius);
    ctx.closePath();
    ctx.fill();
  }

  private draw() {
    if (!this.ctx || !this.canvas) return;
    const rect = this.canvas.getBoundingClientRect();
    this.ctx.clearRect(0, 0, rect.width, rect.height);

    for (const p of this.particles) {
      this.ctx.save();
      this.ctx.globalAlpha = Math.max(0, p.alpha);

      if (p.type === 'sprinkle') {
        // Tumbling 3D rectangular candy sprinkle!
        this.ctx.fillStyle = p.color;
        this.ctx.translate(p.x, p.y);
        this.ctx.rotate(p.rotation);
        const scaleY = p.oscillation ? Math.cos(p.oscillation) : 1;
        this.ctx.scale(1, scaleY);

        const w = p.width || 8;
        const h = p.height || 3;
        this.ctx.beginPath();
        // Rounded capsule sprinkle shape
        this.ctx.roundRect(-w / 2, -h / 2, w, h, 2);
        this.ctx.fill();
      } else if (p.type === 'star') {
        this.ctx.fillStyle = p.color;
        this.ctx.translate(p.x, p.y);
        this.ctx.rotate(p.rotation);
        this.drawStar(this.ctx, 0, 0, 5, p.size, p.size * 0.45);
      } else if (p.type === 'ring') {
        this.ctx.strokeStyle = p.color;
        this.ctx.lineWidth = 2.5;
        this.ctx.beginPath();
        this.ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
        this.ctx.stroke();
      } else {
        // Circle spark
        this.ctx.fillStyle = p.color;
        this.ctx.beginPath();
        this.ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
        this.ctx.fill();
      }

      this.ctx.restore();
    }
  }

  public destroy() {
    if (this.animationFrameId) {
      cancelAnimationFrame(this.animationFrameId);
    }
    this.particles = [];
    this.isRunning = false;
  }
}

export const particleEngine = new ParticleEngine();
