/* ================================================
   Lilikoi Care - Main JavaScript
   ================================================ */

document.addEventListener('DOMContentLoaded', () => {
  initHeader();
  initMobileNav();
  initScrollAnimations();
  initSmoothScroll();
  initContactForm();
  initCareerForm();
});

/* --- Header Scroll Effect --- */
function initHeader() {
  const header = document.querySelector('.header');
  if (!header) return;

  const onScroll = () => {
    if (window.scrollY > 50) {
      header.classList.add('header--scrolled');
    } else {
      header.classList.remove('header--scrolled');
    }
  };

  window.addEventListener('scroll', onScroll, { passive: true });
  onScroll();
}

/* --- Mobile Navigation --- */
function initMobileNav() {
  const toggle = document.querySelector('.nav__toggle');
  const links = document.querySelector('.nav__links');
  const overlay = document.querySelector('.nav__overlay');

  if (!toggle || !links) return;

  toggle.addEventListener('click', () => {
    const isOpen = links.classList.contains('nav__links--open');

    if (isOpen) {
      closeNav();
    } else {
      openNav();
    }
  });

  if (overlay) {
    overlay.addEventListener('click', closeNav);
  }

  // Close on link click
  links.querySelectorAll('.nav__link').forEach(link => {
    link.addEventListener('click', closeNav);
  });

  // Close on escape
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') closeNav();
  });

  function openNav() {
    links.classList.add('nav__links--open');
    toggle.classList.add('nav__toggle--active');
    if (overlay) overlay.classList.add('nav__overlay--visible');
    document.body.style.overflow = 'hidden';
  }

  function closeNav() {
    links.classList.remove('nav__links--open');
    toggle.classList.remove('nav__toggle--active');
    if (overlay) overlay.classList.remove('nav__overlay--visible');
    document.body.style.overflow = '';
  }
}

/* --- Scroll Animations --- */
function initScrollAnimations() {
  const elements = document.querySelectorAll('.fade-in, .fade-in-left, .fade-in-right');

  if (!elements.length) return;

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const el = entry.target;
        const delay = el.dataset.delay || 0;

        setTimeout(() => {
          if (el.classList.contains('fade-in')) {
            el.classList.add('fade-in--visible');
          } else if (el.classList.contains('fade-in-left')) {
            el.classList.add('fade-in-left--visible');
          } else if (el.classList.contains('fade-in-right')) {
            el.classList.add('fade-in-right--visible');
          }
        }, delay);

        observer.unobserve(el);
      }
    });
  }, {
    threshold: 0.15,
    rootMargin: '0px 0px -50px 0px'
  });

  elements.forEach(el => observer.observe(el));
}

/* --- Smooth Scroll --- */
function initSmoothScroll() {
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', (e) => {
      const targetId = anchor.getAttribute('href');
      if (targetId === '#') return;

      const target = document.querySelector(targetId);
      if (!target) return;

      e.preventDefault();
      const headerHeight = document.querySelector('.header')?.offsetHeight || 80;
      const targetPosition = target.getBoundingClientRect().top + window.scrollY - headerHeight;

      window.scrollTo({
        top: targetPosition,
        behavior: 'smooth'
      });
    });
  });
}

/* --- Contact Form --- */
function initContactForm() {
  const form = document.getElementById('contactForm');
  if (!form) return;

  form.addEventListener('submit', (e) => {
    e.preventDefault();

    const formData = new FormData(form);
    const data = Object.fromEntries(formData.entries());

    // Basic validation
    const required = ['name', 'email', 'phone', 'message'];
    const missing = required.filter(field => !data[field]?.trim());

    if (missing.length) {
      showFormMessage(form, 'Please fill in all required fields.', 'error');
      return;
    }

    if (!isValidEmail(data.email)) {
      showFormMessage(form, 'Please enter a valid email address.', 'error');
      return;
    }

    // Send via mailto
    const subject = encodeURIComponent(`New Contact from ${data.name} - ${data.service || 'General Inquiry'}`);
    const body = encodeURIComponent(
      `Name: ${data.name}\nEmail: ${data.email}\nPhone: ${data.phone}\nService: ${data.service || 'Not specified'}\n\nMessage:\n${data.message}`
    );
    window.location.href = `mailto:lilikoicare@gmail.com?subject=${subject}&body=${body}`;

    showFormMessage(form, 'Thank you for reaching out! Your email client should open shortly. We will get back to you within 24 hours.', 'success');
  });
}

/* --- Career Form --- */
function initCareerForm() {
  const form = document.getElementById('careerForm');
  if (!form) return;

  form.addEventListener('submit', (e) => {
    e.preventDefault();

    const formData = new FormData(form);
    const data = Object.fromEntries(formData.entries());

    const required = ['name', 'email', 'phone'];
    const missing = required.filter(field => !data[field]?.trim());

    if (missing.length) {
      showFormMessage(form, 'Please fill in all required fields.', 'error');
      return;
    }

    if (!isValidEmail(data.email)) {
      showFormMessage(form, 'Please enter a valid email address.', 'error');
      return;
    }

    // Send via mailto
    const subject = encodeURIComponent(`Career Application from ${data.name}`);
    const body = encodeURIComponent(
      `Name: ${data.name}\nEmail: ${data.email}\nPhone: ${data.phone}\nPreferred Location: ${data.location || 'Not specified'}\nSchedule Preference: ${data.schedule || 'Not specified'}\n\nExperience:\n${data.experience || 'Not provided'}`
    );
    window.location.href = `mailto:lilikoicare@gmail.com?subject=${subject}&body=${body}`;

    showFormMessage(form, 'Thank you for your interest in joining our team! Your email client should open shortly.', 'success');
  });
}

/* --- Utilities --- */
function isValidEmail(email) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

function showFormMessage(form, message, type) {
  let msgEl = form.querySelector('.form__message');
  if (!msgEl) {
    msgEl = document.createElement('div');
    msgEl.className = 'form__message';
    form.appendChild(msgEl);
  }

  msgEl.className = `form__message form__message--${type}`;
  msgEl.textContent = message;
  msgEl.style.display = 'block';

  if (type === 'success') {
    setTimeout(() => {
      msgEl.style.display = 'none';
    }, 6000);
  }
}
