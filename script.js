// Функции для блокировки/разблокировки скролла
function disablePageScroll() {
  document.body.style.overflow = 'hidden';
  document.documentElement.style.overflow = 'hidden'; // На всякий случай
}

function enablePageScroll() {
  document.body.style.overflow = 'auto';
  document.documentElement.style.overflow = 'auto';
}

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

    // Показ/скрытие поля комментария
  document.querySelector('input[name="task"]').addEventListener('change', function() {
  const commentField = document.getElementById('comment-field');
  commentField.style.display = this.value === 'Другое' ? 'block' : 'none';
});


    header.addEventListener('click', () => {
      options.style.display = options.style.display === 'block' ? 'none' : 'block';
    });
    
    options.querySelectorAll('li').forEach(option => {
      option.addEventListener('click', () => {
        select.querySelector('.selected-value').textContent = option.textContent;
        hiddenInput.value = option.dataset.value;
        options.style.display = 'none';

         // Показываем поле комментария только для "Другое"
        document.getElementById('comment-field').style.display = 
          option.dataset.value === 'Другое' ? 'block' : 'none';
      });
    });
  });

  // Открытие модалки
  openModalButtons.forEach(button => {
    button.addEventListener('click', function(e) {
      e.preventDefault();
      modal.style.display = 'block';
      disablePageScroll(); // Используем новую функцию. ВМЕСТО document.body.style.overflow = 'hidden';
    });
  });

  // Закрытие модалки
  closeModal.addEventListener('click', function() {
    modal.style.display = 'none';
    enablePageScroll(); // Используем новую функцию. ВМЕСТО document.body.style.overflow = 'auto';
  });

  // Закрытие по клику снаружи
  window.addEventListener('click', function(e) {
    if (e.target === modal) {
      modal.style.display = 'none';
      enablePageScroll(); // Новая функция включения скролла
    }
  });

  
// Отправка формы
const form = document.getElementById('contact-form');
if (form) {
  form.addEventListener('submit', async function(e) {
    e.preventDefault();

      // Валидация (добавьте в самое начало)
  if (!form.checkValidity()) {
    // Показывает браузерные подсказки обязательных полей
    form.reportValidity();
    return; // Прерываем отправку
  }

    // Визуальный фидбэк (лоадер)
    const submitBtn = form.querySelector('button[type="submit"]');
    const originalBtnText = submitBtn.innerHTML;
    submitBtn.innerHTML = '<div class="loading"></div>';
    submitBtn.disabled = true;

    // Функция уведомлений (добавьте в начало script.js)
function showNotification(message) {
  const notification = document.getElementById('notification');
  notification.textContent = message;
  notification.style.display = 'block';
  
  setTimeout(() => {
    notification.style.opacity = '0';
    setTimeout(() => {
      notification.style.display = 'none';
      notification.style.opacity = '1';
    }, 300);
  }, 3000);
}
    try {
      // Собираем данные
      const formData = new FormData(form);
      const response = await fetch('https://script.google.com/macros/s/AKfycbwDGUKAbIEfSC5Rx7HEet562hGM4MKdHVMehylncMAUWi1XotaLr7VhYmU7lphYHJ-9/exec', {
        method: 'POST',
        body: new URLSearchParams(formData)
      });

      if (response.ok) {
        showNotification('✅ Данные отправлены!'); // Замена первого alert
        form.reset();
        modal.style.display = 'none';
        enablePageScroll(); // Важно: разблокируем скролл здесь!
      } else {
        throw new Error('Ошибка сервера');
      }
    } catch (error) {
      showNotification('❌ ' + error.message); // Замена второго alert
      enablePageScroll(); // И здесь на случай ошибки!
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