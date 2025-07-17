document.addEventListener('DOMContentLoaded', function() {
  const heroSection = document.querySelector('.hero');
  if (!heroSection) return;

  const sketch = function(p) {
    // Настройки тора (фиксированные для мобильных)
    const torus = {
      radius: window.innerWidth < 768 ? 80 : 250,
      tubeRadius: window.innerWidth < 768 ? 25 : 80,
      segments: window.innerWidth < 768 ? 10 : 20,
      points: [],
      position: { x: 0.125, y: 0.1 }
    };

    // Фиксированные настройки взаимодействия
    const interaction = {
      strength: window.innerWidth < 768 ? 0 : 0.00008, // На мобильных отключаем
      maxDistance: 200, // Фиксированное значение
      smoothRotation: 0.0001,
      currentRotX: p.radians(45),
      currentRotY: 0
    };

    // Настройки эффектов
    const effects = {
      breathingSpeed: 0.02,
      breathingSize: 1,
      twinkleChance: 0.15,
      baseAlpha: 80,
      highlightDistance: 300,
      autoRotateSpeed: window.innerWidth < 768 ? 0.002 : 0 // Автовращение только на мобильных
    };

    p.setup = function() {
      const canvas = p.createCanvas(heroSection.offsetWidth, heroSection.offsetHeight, p.WEBGL);
      canvas.parent('hero-animation');
      p.noStroke();

      // Инициализация точек
      initTorusPoints();
    };

    function initTorusPoints() {
      torus.points = [];
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
    }

    p.draw = function() {
      p.background(0);
      
      const breathingOffset = p.sin(p.frameCount * effects.breathingSpeed) * effects.breathingSize;
      
      p.translate(
        -p.width * torus.position.x,
        -p.height * torus.position.y,
        0
      );
      
      // Автовращение на мобильных
      if (effects.autoRotateSpeed > 0) {
        interaction.currentRotY += effects.autoRotateSpeed;
      }
      
      p.rotateX(interaction.currentRotX);
      p.rotateY(interaction.currentRotY);

      // Взаимодействие только для десктопа
      if (!window.innerWidth < 768 && p.mouseX > 0 && p.mouseY > 0) {
        const targetRotY = p.map(p.mouseX, 0, p.width, -0.3, 0.3);
        const targetRotX = p.map(p.mouseY, 0, p.height, 0.2, -0.2);
        
        interaction.currentRotY = p.lerp(interaction.currentRotY, targetRotY, interaction.smoothRotation);
        interaction.currentRotX = p.lerp(interaction.currentRotX, targetRotX, interaction.smoothRotation);
      }

      // Отрисовка точек
      torus.points.forEach(point => {
        point.tubeAngle += point.speed;
        
        const x = (torus.radius + torus.tubeRadius * p.cos(point.tubeAngle)) * p.cos(point.baseAngle);
        const y = (torus.radius + torus.tubeRadius * p.cos(point.tubeAngle)) * p.sin(point.baseAngle);
        const z = torus.tubeRadius * p.sin(point.tubeAngle);
        
        let alpha = effects.baseAlpha;
        
        // Взаимодействие с курсором (только для десктопа)
        if (!window.innerWidth < 768 && p.mouseX > 0 && p.mouseY > 0) {
          const screenX = p.width/2 + x - p.width*torus.position.x;
          const screenY = p.height/2 + y - p.height*torus.position.y;
          const distToMouse = p.dist(p.mouseX, p.mouseY, screenX, screenY);
          
          if (distToMouse < interaction.maxDistance) {
            const force = interaction.strength * (interaction.maxDistance - distToMouse);
            const angle = p.atan2(p.mouseY - screenY, p.mouseX - screenX);
            point.baseAngle += p.cos(angle) * force * 0.5;
            point.tubeAngle += p.sin(angle) * force * 0.3;
            alpha += p.map(distToMouse, 0, interaction.maxDistance, 100, 0);
          }
        }

        // Мерцание
        if (point.isTwinkling) {
          point.twinklePhase += point.twinkleSpeed;
          alpha += p.map(p.sin(point.twinklePhase), -1, 1, -20, 20);
        }

        p.push();
        p.translate(x, y, z);
        p.fill(255, alpha);
        p.circle(0, 0, point.baseSize + breathingOffset);
        p.pop();
      });
    };

    p.windowResized = function() {
      // Фиксированные размеры при ресайзе
      torus.radius = window.innerWidth < 768 ? 80 : 120;
      torus.tubeRadius = window.innerWidth < 768 ? 25 : 40;
      
      p.resizeCanvas(heroSection.offsetWidth, heroSection.offsetHeight);
      
      // Переинициализация точек при значительном изменении размера
      if (Math.abs(p.width - p.height) > 100) {
        initTorusPoints();
      }
    };
  };

  new p5(sketch, 'hero-animation');
});