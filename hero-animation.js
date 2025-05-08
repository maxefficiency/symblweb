document.addEventListener('DOMContentLoaded', function() {
    const heroSection = document.querySelector('.hero');
    if (!heroSection) return;
  
    const sketch = function(p) {
      // Настройки тора
      const torus = {
        radius: 250,
        tubeRadius: 60,
        segments: 22,
        points: [],
        position: { x: 0.3, y: -0.15 }
      };
  
      // Настройки эффектов
      const effects = {
        breathingSpeed: 0.02,
        breathingSize: 1.5,
        twinkleChance: 0.15,
        baseAlpha: 80,
        highlightDistance: 500
      };
  
      // Взаимодействие с курсором
      const interaction = {
        strength: 0.00008,
        maxDistance: 150,
        smoothRotation: 0.003, // Очень плавное вращение
        currentRotX: p.radians(45), // Начальный наклон 45° (переведено в радианы)
        currentRotY: 0
      };
  
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
              baseSize: p.random(1.5, 3),
              speed: p.random(0.003, 0.01),
              isTwinkling: p.random() < effects.twinkleChance,
              twinkleSpeed: p.random(0.02, 0.05),
              twinklePhase: p.random(p.TWO_PI)
            });
          }
        }
      };
  
      p.draw = function() {
        p.background(0);
        
        // Эффект "дыхания"
        const breathingOffset = p.sin(p.frameCount * effects.breathingSpeed) * effects.breathingSize;
        
        // Позиционирование
        p.translate(
          -p.width * torus.position.x,
          -p.height * torus.position.y,
          0
        );
        
        // Применяем текущие углы вращения
        p.rotateX(interaction.currentRotX);
        p.rotateY(interaction.currentRotY);
  
        // Плавное вращение к курсору (если нужно)
        if (p.mouseX > 0 && p.mouseY > 0) {
          const targetRotY = p.map(p.mouseX, 0, p.width, -0.3, 0.3);
          const targetRotX = p.map(p.mouseY, 0, p.height, 0.2, -0.2);
          
          interaction.currentRotY = p.lerp(
            interaction.currentRotY, 
            targetRotY, 
            interaction.smoothRotation
          );
          interaction.currentRotX = p.lerp(
            interaction.currentRotX, 
            targetRotX, 
            interaction.smoothRotation
          );
        }
  
        // Отрисовка точек (остается без изменений)
        torus.points.forEach(point => {
          point.tubeAngle += point.speed;
          
          const x = (torus.radius + torus.tubeRadius * p.cos(point.tubeAngle)) * p.cos(point.baseAngle);
          const y = (torus.radius + torus.tubeRadius * p.cos(point.tubeAngle)) * p.sin(point.baseAngle);
          const z = torus.tubeRadius * p.sin(point.tubeAngle);
          
          let distanceFactor = 0;
          if (p.mouseX > 0 && p.mouseY > 0) {
            const screenX = p.width/2 + x - p.width*torus.position.x;
            const screenY = p.height/2 + y - p.height*torus.position.y;
            const distToMouse = p.dist(p.mouseX, p.mouseY, screenX, screenY);
            
            distanceFactor = p.map(distToMouse, 0, effects.highlightDistance, 1, 0, true);
            
            if (distToMouse < interaction.maxDistance) {
              const force = interaction.strength * (interaction.maxDistance - distToMouse);
              const angle = p.atan2(p.mouseY - screenY, p.mouseX - screenX);
              point.baseAngle += p.cos(angle) * force * 0.5;
              point.tubeAngle += p.sin(angle) * force * 0.3;
            }
          }
  
          let size = point.baseSize + breathingOffset;
          let alpha = effects.baseAlpha + distanceFactor * 140;
          alpha = p.constrain(alpha, 50, 250);
  
          if (point.isTwinkling) {
            point.twinklePhase += point.twinkleSpeed;
            alpha += p.map(p.sin(point.twinklePhase), -1, 1, -20, 20);
          }
  
          p.push();
          p.translate(x, y, z);
          p.fill(255, alpha);
          p.circle(0, 0, size);
          p.pop();
        });
      };
  
      p.windowResized = function() {
        p.resizeCanvas(heroSection.offsetWidth, heroSection.offsetHeight);
        interaction.maxDistance = Math.max(p.width, p.height) * 0.6;
      };
  
      // Функции управления
      window.moveTorus = function(xPercent, yPercent) {
        torus.position.x = xPercent;
        torus.position.y = yPercent;
      };
      
      window.setTorusRotation = function(xDegrees, yDegrees) {
        interaction.currentRotX = p.radians(xDegrees);
        interaction.currentRotY = p.radians(yDegrees);
      };
    };
  
    new p5(sketch, 'hero-animation');
  });