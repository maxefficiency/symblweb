// Modal functionality
document.addEventListener('DOMContentLoaded', function() {
  // Modal elements
  const modal = document.getElementById('contact-modal');
  const openModalButtons = document.querySelectorAll('.open-modal');
  const closeModal = document.querySelector('.close-modal');

  // Open modal
  openModalButtons.forEach(button => {
    button.addEventListener('click', function(e) {
      e.preventDefault();
      modal.style.display = 'block';
      document.body.style.overflow = 'hidden';
    });
  });

  // Close modal
  closeModal.addEventListener('click', function() {
    modal.style.display = 'none';
    document.body.style.overflow = 'auto';
  });

  // Close when clicking outside
  window.addEventListener('click', function(e) {
    if (e.target === modal) {
      modal.style.display = 'none';
      document.body.style.overflow = 'auto';
    }
  });

  // Form submission
  const form = document.getElementById('contact-form');
  if (form) {
    form.addEventListener('submit', function(e) {
      e.preventDefault();
      
      // Here you would normally send data to server
      alert('Заявка отправлена! Мы свяжемся с вами в ближайшее время.');
      
      // Reset form and close modal
      form.reset();
      modal.style.display = 'none';
      document.body.style.overflow = 'auto';
    });
  }

  // Smooth scrolling for anchor links
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function(e) {
      if (this.classList.contains('open-modal')) return;
      
      e.preventDefault();
      const target = document.querySelector(this.getAttribute('href'));
      if (target) {
        target.scrollIntoView({
          behavior: 'smooth'
        });
      }
    });
  });
});