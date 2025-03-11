import { useEffect, useRef } from "react";

const FoodBackground = () => {
  const canvasRef = useRef(null);

  const foodEmojis = [
    "🍕",
    "🌮",
    "🍔",
    "🥗",
    "🥘",
    "🍝",
    "🥪",
    "🥨",
    "🥐",
    "🧀",
    "🥩",
    "🥑",
    "🍅",
    "🥕",
    "🥦",
  ];

  useEffect(() => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext("2d");
    let animationFrameId;
    let foods = [];

    const resizeCanvas = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };

    window.addEventListener("resize", resizeCanvas);
    resizeCanvas();

    class FoodItem {
      constructor() {
        this.emoji = foodEmojis[Math.floor(Math.random() * foodEmojis.length)];
        this.x = Math.random() * canvas.width;
        this.y = Math.random() * canvas.height;
        this.size = Math.random() * 20 + 25;
        this.baseSize = this.size;
        this.speedX = (Math.random() - 0.5) * 1;
        this.speedY = (Math.random() - 0.5) * 1;
        this.rotation = Math.random() * Math.PI * 2;
        this.rotationSpeed = (Math.random() - 0.5) * 0.03;
        this.bounceOffset = Math.random() * Math.PI * 2;
        this.opacity = 0;
        this.targetOpacity = Math.random() * 0.4 + 0.2;
        this.hovered = false;
      }

      draw() {
        ctx.save();
        ctx.translate(this.x, this.y);
        ctx.rotate(this.rotation);
        ctx.globalAlpha = this.opacity;

        //Emoji rajzolása
        ctx.font = `${this.size}px Arial`;
        ctx.textAlign = "center";
        ctx.textBaseline = "middle";
        ctx.fillText(this.emoji, 0, 0);

        ctx.restore();
      }

      update(mouseX, mouseY) {
        //Mozgás és forgás
        this.x += this.speedX;
        this.y += this.speedY;
        this.rotation += this.rotationSpeed;

        //Pattogó animáció
        this.size =
          this.baseSize + Math.sin(Date.now() / 1000 + this.bounceOffset) * 2;

        //Opacity fade in
        if (this.opacity < this.targetOpacity) {
          this.opacity += 0.01;
        }

        //Egér interakció
        const dx = mouseX - this.x;
        const dy = mouseY - this.y;
        const distance = Math.sqrt(dx * dx + dy * dy);

        if (distance < 100) {
          const angle = Math.atan2(dy, dx);
          const force = (100 - distance) / 100;
          this.x -= Math.cos(angle) * force * 2;
          this.y -= Math.sin(angle) * force * 2;
          this.rotation += force * 0.1;
          this.hovered = true;
        } else if (this.hovered) {
          this.hovered = false;
          this.speedX = (Math.random() - 0.5) * 1;
          this.speedY = (Math.random() - 0.5) * 1;
        }

        //Képernyő széleinél visszapattanás
        if (this.x < 0 || this.x > canvas.width) {
          this.speedX *= -1;
          this.rotationSpeed = (Math.random() - 0.5) * 0.03;
        }
        if (this.y < 0 || this.y > canvas.height) {
          this.speedY *= -1;
          this.rotationSpeed = (Math.random() - 0.5) * 0.03;
        }
      }
    }

    //Ételek inicializálása
    const init = () => {
      foods = [];
      const numberOfFoods = Math.min(
        (canvas.width * canvas.height) / 40000,
        30
      );
      for (let i = 0; i < numberOfFoods; i++) {
        foods.push(new FoodItem());
      }
    };

    //Egér pozíció követése
    let mouseX = 0;
    let mouseY = 0;
    canvas.addEventListener("mousemove", (e) => {
      const rect = canvas.getBoundingClientRect();
      mouseX = e.clientX - rect.left;
      mouseY = e.clientY - rect.top;
    });

    //Animációs ciklus
    const animate = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      foods.forEach((food) => {
        food.update(mouseX, mouseY);
        food.draw();
      });

      //Vonalak rajzolása közeli ételek között
      for (let i = 0; i < foods.length; i++) {
        for (let j = i + 1; j < foods.length; j++) {
          const dx = foods[i].x - foods[j].x;
          const dy = foods[i].y - foods[j].y;
          const distance = Math.sqrt(dx * dx + dy * dy);

          if (distance < 150) {
            ctx.beginPath();
            ctx.strokeStyle = `rgba(249, 115, 22, ${
              0.15 * (1 - distance / 150)
            })`;
            ctx.lineWidth = 1;
            ctx.moveTo(foods[i].x, foods[i].y);
            ctx.lineTo(foods[j].x, foods[j].y);
            ctx.stroke();
          }
        }
      }

      animationFrameId = requestAnimationFrame(animate);
    };

    init();
    animate();

    return () => {
      window.removeEventListener("resize", resizeCanvas);
      cancelAnimationFrame(animationFrameId);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      className="fixed top-0 left-0 w-full h-full pointer-events-auto"
      style={{ background: "transparent" }}
    />
  );
};

export default FoodBackground;
