document.addEventListener('DOMContentLoaded', function() {
  const sketch = function(p) {
    // Настройки глаз
    const eyes = [
      { x: 0, y: 0, points: [] }, // Левый глаз
      { x: 0, y: 0, points: [] }  // Правый глаз
    ];
    let ctaButton;

    p.setup = function() {
      const container = document.getElementById('eyes-animation');
      const canvas = p.createCanvas(container.offsetWidth, 200);
      canvas.parent('eyes-animation');
      p.noStroke();
      
      // Инициализация позиций глаз
      eyes[0].x = p.width * 0.3;
      eyes[1].x = p.width * 0.7;
      eyes[0].y = eyes[1].y = 100;
      
      // Создание частиц для глаз
      eyes.forEach(eye => {
        for (let i = 0; i < 15; i++) {
          eye.points.push({
            angle: p.random(p.TWO_PI),
            radius: p.random(3, 6),
            speed: p.random(0.01, 0.03),
            baseX: 0,
            baseY: 0
          });
        }
      });
      
      ctaButton = document.querySelector('.feature .section-cta');
    };

    p.draw = function() {
      p.clear(0, 0, 0, 0); // Прозрачный фон
      
      // Получаем позицию кнопки
      const ctaRect = ctaButton.getBoundingClientRect();
      const ctaX = ctaRect.left + ctaRect.width/2 - p.windowWidth/2 + p.width/2;
      const ctaY = ctaRect.top + ctaRect.height/2 - p.windowHeight/2 + p.height/2;

      eyes.forEach(eye => {
        // Рисуем основу глаза
        p.fill(255, 30);
        p.circle(eye.x, eye.y, 80);
        
        // Рассчитываем направление взгляда
        const dx = ctaX - eye.x;
        const dy = ctaY - eye.y;
        const lookAngle = p.atan2(dy, dx);
        const lookDist = p.min(p.sqrt(dx*dx + dy*dy), 30);
        
        // Рисуем частицы-зрачки
        eye.points.forEach(point => {
          point.angle += point.speed;
          const swayX = p.cos(point.angle) * 15;
          const swayY = p.sin(point.angle) * 10;
          
          const pupilX = eye.x + p.cos(lookAngle) * lookDist + swayX;
          const pupilY = eye.y + p.sin(lookAngle) * lookDist + swayY;
          
          p.fill(255);
          p.circle(pupilX, pupilY, point.radius);
        });
      });
    };

    p.windowResized = function() {
      const container = document.getElementById('eyes-animation');
      p.resizeCanvas(container.offsetWidth, 200);
      eyes[0].x = p.width * 0.3;
      eyes[1].x = p.width * 0.7;
    };
  };

  new p5(sketch);
});