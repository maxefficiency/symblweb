// Modal functionality и весь остальной код
document.addEventListener('DOMContentLoaded', function() {
  // 1. Модальные окна
  const modal = document.getElementById('contact-modal');
  const openModalButtons = document.querySelectorAll('.open-modal');
  const closeModal = document.querySelector('.close-modal');

  document.querySelectorAll('.custom-select').forEach(select => {
    const header = select.querySelector('.select-header');
    const options = select.querySelector('.select-options');
    const hiddenInput = select.querySelector('input[type="hidden"]');
    
    header.addEventListener('click', () => {
      options.style.display = options.style.display === 'block' ? 'none' : 'block';
    });
    
    options.querySelectorAll('li').forEach(option => {
      option.addEventListener('click', () => {
        select.querySelector('.selected-value').textContent = option.textContent;
        hiddenInput.value = option.dataset.value;
        options.style.display = 'none';
      });
    });
  });
  
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
  form.addEventListener('submit', async function(e) {
    e.preventDefault();

    // Визуальный фидбэк
    const submitBtn = form.querySelector('button[type="submit"]');
    const originalBtnText = submitBtn.innerHTML;
    submitBtn.innerHTML = '<div class="loading"></div>';
    submitBtn.disabled = true;

    try {
      // Собираем данные
      const formData = new FormData(form);
      const response = await fetch('https://script.google.com/macros/s/AKfycbwDGUKAbIEfSC5Rx7HEet562hGM4MKdHVMehylncMAUWi1XotaLr7VhYmU7lphYHJ-9/exec', {
        method: 'POST',
        body: new URLSearchParams(formData)
      });

      if (response.ok) {
        alert('Данные отправлены!');
        form.reset();
        modal.style.display = 'none';
      } else {
        throw new Error('Ошибка сервера');
      }
    } catch (error) {
      alert('Ошибка: ' + error.message);
    } finally {
      submitBtn.innerHTML = originalBtnText;
      submitBtn.disabled = false;
    }
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