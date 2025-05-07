// Modal functionality и весь остальной код
document.addEventListener('DOMContentLoaded', function() {
  // 1. Модальные окна
  const modal = document.getElementById('contact-modal');
  const openModalButtons = document.querySelectorAll('.open-modal');
  const closeModal = document.querySelector('.close-modal');

  // Открытие модалки
  openModalButtons.forEach(button => {
    button.addEventListener('click', function(e) {
      e.preventDefault();
      modal.style.display = 'block';
      document.body.style.overflow = 'hidden';
    });
  });

  // Закрытие модалки
  closeModal.addEventListener('click', function() {
    modal.style.display = 'none';
    document.body.style.overflow = 'auto';
  });

  // Закрытие по клику снаружи
  window.addEventListener('click', function(e) {
    if (e.target === modal) {
      modal.style.display = 'none';
      document.body.style.overflow = 'auto';
    }
  });

  // Отправка формы
  const form = document.getElementById('contact-form');
  if (form) {
    form.addEventListener('submit', function(e) {
      e.preventDefault();
      alert('Заявка отправлена! Мы свяжемся с вами в ближайшее время.');
      form.reset();
      modal.style.display = 'none';
      document.body.style.overflow = 'auto';
    });
  }

  // Плавный скролл
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function(e) {
      if (this.classList.contains('open-modal')) return;
      
      e.preventDefault();
      const target = document.querySelector(this.getAttribute('href'));
      if (target) {
        target.scrollIntoView({ behavior: 'smooth' });
      }
    });
  });
});

// 2. Анимация для hero-секции (отдельный обработчик)
document.addEventListener('DOMContentLoaded', function() {
  // Убедимся, что элемент существует
  const heroSection = document.querySelector('.hero');
  if (!heroSection) return;

  const sketch = function(p) {
    p.setup = function() {
      const canvas = p.createCanvas(heroSection.offsetWidth, heroSection.offsetHeight);
      canvas.parent('hero-animation');
      p.noStroke();
    };

    p.draw = function() {
      p.background(0);
      p.fill(255);
      p.ellipse(p.mouseX, p.mouseY, 50, 50);
    };
  };

  new p5(sketch, 'hero-animation');
});