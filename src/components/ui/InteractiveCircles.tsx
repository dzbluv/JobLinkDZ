import React, { useEffect, useRef } from 'react';

const InteractiveCircles: React.FC = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const c = canvas.getContext('2d');
    if (!c) return;

    let animationFrameId: number;
    let circleArray: Circle[] = [];
    const mouse = { x: undefined as number | undefined, y: undefined as number | undefined };
    const maxRadius = 40;
    const colorArray = ["#233656", "#415B76", "#7B9BA6", "#CDD6D5", "#EEF4F2"];

    const handleMouseMove = (event: MouseEvent) => {
      if (!canvas) return;
      const rect = canvas.getBoundingClientRect();
      mouse.x = event.clientX - rect.left;
      mouse.y = event.clientY - rect.top;
    };

    const handleResize = () => {
      if (!canvas || !canvas.parentElement) return;
      canvas.width = canvas.parentElement.clientWidth;
      canvas.height = canvas.parentElement.clientHeight;
      init();
    };

    window.addEventListener('mousemove', handleMouseMove);
    window.addEventListener('resize', handleResize);

    class Circle {
      x: number;
      y: number;
      dx: number;
      dy: number;
      radius: number;
      minRadius: number;
      color: string;

      constructor(x: number, y: number, dx: number, dy: number, radius: number) {
        this.x = x;
        this.y = y;
        this.dx = dx;
        this.dy = dy;
        this.radius = radius;
        this.minRadius = radius;
        this.color = colorArray[Math.floor(Math.random() * colorArray.length)];
      }

      draw() {
        if (!c) return;
        c.beginPath();
        c.arc(this.x, this.y, this.radius, 0, Math.PI * 2, false);
        c.fillStyle = this.color;
        c.fill();
      }

      update() {
        if (!canvas) return;
        if (this.x + this.radius > canvas.width || this.x - this.radius < 0) {
          this.dx = -this.dx;
        }
        if (this.y + this.radius > canvas.height || this.y - this.radius < 0) {
          this.dy = -this.dy;
        }

        this.x += this.dx;
        this.y += this.dy;

        // Interactivity
        if (
          mouse.x !== undefined &&
          mouse.y !== undefined &&
          mouse.x - this.x < 50 &&
          mouse.x - this.x > -50 &&
          mouse.y - this.y < 50 &&
          mouse.y - this.y > -50
        ) {
          if (this.radius < maxRadius) {
            this.radius += 1;
          }
        } else if (this.radius > this.minRadius) {
          this.radius -= 1;
        }

        this.draw();
      }
    }

    const init = () => {
      if (!canvas || !canvas.parentElement) return;
      canvas.width = canvas.parentElement.clientWidth;
      canvas.height = canvas.parentElement.clientHeight;
      circleArray = [];
      for (let i = 0; i < 400; i++) { // Reduced count for performance in React
        const radius = Math.random() * 3 + 1;
        const x = Math.random() * (canvas.width - radius * 2) + radius;
        const y = Math.random() * (canvas.height - radius * 2) + radius;
        const dx = (Math.random() - 0.5) * 2;
        const dy = (Math.random() - 0.5) * 2;
        circleArray.push(new Circle(x, y, dx, dy, radius));
      }
    };

    const animate = () => {
      if (!canvas) return;
      animationFrameId = requestAnimationFrame(animate);
      c.clearRect(0, 0, canvas.width, canvas.height);
      for (let i = 0; i < circleArray.length; i++) {
        circleArray[i].update();
      }
    };

    init();
    animate();

    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('resize', handleResize);
      cancelAnimationFrame(animationFrameId);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      id="interactive-circles"
      className="absolute inset-0 w-full h-full pointer-events-none opacity-50 dark:opacity-30"
      style={{ background: 'transparent', zIndex: 0 }}
    />
  );
};

export default InteractiveCircles;
