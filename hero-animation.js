document.addEventListener('DOMContentLoaded', function() {
  const heroSection = document.querySelector('.hero');
  if (!heroSection) return;

  const sketch = function(p) {
    // Настройки тора
    const torus = {
      radius: 300,
      tubeRadius: 60,
      segments: 20,
      points: [],
      position: { x: 0, y: 0 }
    };

    // Настройки эффектов
    const effects = {
      breathingSpeed: 0.008,
      breathingSize: 1.3,
      twinkleChance: 0.15,
      baseAlpha: 80
    };

    // Взаимодействие с курсором
    const interaction = {
      strength: 0.00008,
      maxDistance: 100,
      smoothRotation: 0.00001,
      currentRotX: 45,
      currentRotY: 0
    };

    // Инициализация
    p.setup = function() {
      const canvas = p.createCanvas(heroSection.offsetWidth, heroSection.offsetHeight, p.WEBGL);
      canvas.parent('hero-animation');
      p.noStroke();

      // Создание точек тора
      for (let i = 0; i < torus.segments; i++) {
        const angle = p.map(i, 0, torus.segments, 0, p.TWO_PI);
        for (let j = 0; j < torus.segments; j++) {
          torus.points.push({
            baseAngle: angle,
            tubeAngle: p.map(j, 0, torus.segments, 0, p.TWO_PI),
            baseSize: p.random(1, 2.5),
            speed: p.random(0.003, 0.01),
            isTwinkling: p.random() < effects.twinkleChance,
            twinkleSpeed: p.random(0.02, 0.05),
            twinklePhase: p.random(p.TWO_PI)
          });
        }
      }
    };

    // Основной цикл отрисовки
    p.draw = function() {
      p.background(0);
      
      // Эффект "дыхания"
      const breathingOffset = p.sin(p.frameCount * effects.breathingSpeed) * effects.breathingSize;
      
      // Позиционирование тора
      p.translate(
        -p.width * torus.position.x,
        -p.height * torus.position.y,
        0
      );
      
      // Плавное вращение к курсору
      if (p.mouseX > 0 && p.mouseY > 0) {
        const targetRotY = p.map(p.mouseX, 0, p.width, -0.3, 0.3);
        const targetRotX = p.map(p.mouseY, 0, p.height, 0.2, -0.2);
        
        interaction.currentRotY = p.lerp(interaction.currentRotY, targetRotY, interaction.smoothRotation);
        interaction.currentRotX = p.lerp(interaction.currentRotX, targetRotX, interaction.smoothRotation);
      }
      
      p.rotateY(interaction.currentRotY);
      p.rotateX(interaction.currentRotX);

      // Отрисовка точек
      torus.points.forEach(point => {
        point.tubeAngle += point.speed;
        
        // 3D позиция точки
        const x = (torus.radius + torus.tubeRadius * p.cos(point.tubeAngle)) * p.cos(point.baseAngle);
        const y = (torus.radius + torus.tubeRadius * p.cos(point.tubeAngle)) * p.sin(point.baseAngle);
        const z = torus.tubeRadius * p.sin(point.tubeAngle);
        
        // Взаимодействие с курсором
        if (p.mouseX > 0 && p.mouseY > 0) {
          const screenX = p.width/2 + x - p.width*torus.position.x;
          const screenY = p.height/2 + y - p.height*torus.position.y;
          const distToMouse = p.dist(p.mouseX, p.mouseY, screenX, screenY);
          
          if (distToMouse < interaction.maxDistance) {
            const force = interaction.strength * (interaction.maxDistance - distToMouse);
            const angle = p.atan2(p.mouseY - screenY, p.mouseX - screenX);
            
            point.baseAngle += p.cos(angle) * force * 0.5;
            point.tubeAngle += p.sin(angle) * force * 0.3;
          }
        }

        // Размер и прозрачность
        let size = point.baseSize + breathingOffset;
        let alpha = effects.baseAlpha;
        
        // Мерцание
        if (point.isTwinkling) {
          point.twinklePhase += point.twinkleSpeed;
          alpha += p.map(p.sin(point.twinklePhase), -1, 1, 20, 60);
        }

        // Рисуем точку
        p.push();
        p.translate(x, y, z);
        p.fill(255, alpha);
        p.circle(0, 0, size);
        p.pop();
      });
    };

    // Реакция на изменение размера
    p.windowResized = function() {
      p.resizeCanvas(heroSection.offsetWidth, heroSection.offsetHeight);
      interaction.maxDistance = Math.max(p.width, p.height) * 0.6;
    };

    // Функция для изменения положения тора
    window.moveTorus = function(xPercent, yPercent) {
      torus.position.x = xPercent;
      torus.position.y = yPercent;
    };
  };

  new p5(sketch, 'hero-animation');
});