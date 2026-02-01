// ─── PAGE NAVIGATION ───
let pageStack = [];
function showPage(id, pushToStack = true) {
  const current = document.querySelector('.page.active');
  if (pushToStack && current && current.id !== 'page-' + id) {
    const curId = current.id.replace('page-', '');
    pageStack.push(curId);
    if (pageStack.length > 30) pageStack.shift();
  }
  document.querySelectorAll('.page').forEach(p => p.classList.remove('active'));
  const target = document.getElementById('page-' + id);
  if (target) { target.classList.add('active'); window.scrollTo({ top: 0, behavior: 'smooth' }); }
}

function goBack() {
  if (pageStack.length) {
    const prev = pageStack.pop();
    showPage(prev, false); // don't re-push when going back
  } else {
    if (history.length > 1) history.back(); else showPage('home', false);
  }
}

// Delegation for data-driven navigation and handling back/top buttons
document.addEventListener('click', function (e) {
  const nav = e.target.closest('[data-nav]');
  if (nav) { e.preventDefault(); showPage(nav.getAttribute('data-nav')); return; }
});

window.addEventListener('DOMContentLoaded', function () {
  // Inject a small 'Back' button into each page (except home) for direct return
  document.querySelectorAll('.page').forEach(page => {
    if (page.id === 'page-home') return;
    const btn = document.createElement('button');
    btn.type = 'button';
    btn.className = 'back-btn btn btn-outline btn-sm';
    btn.setAttribute('aria-label', 'Go back');
    btn.textContent = '← Back';
    page.insertBefore(btn, page.firstChild);
  });

  // Add floating Back-to-top button
  const topBtn = document.createElement('button');
  topBtn.className = 'back-to-top';
  topBtn.innerHTML = '↑';
  topBtn.title = 'Back to top';
  document.body.appendChild(topBtn);

  window.addEventListener('scroll', function () {
    if (window.scrollY > 300) topBtn.classList.add('visible'); else topBtn.classList.remove('visible');
  });

  // Handle clicks for back/top
  document.addEventListener('click', function (e) {
    const b = e.target.closest('.back-to-top'); if (b) { window.scrollTo({ top: 0, behavior: 'smooth' }); }
    const back = e.target.closest('.back-btn'); if (back) { goBack(); }
  });
});

// ─── SEARCH ───
function handleSearch() {
  const val = document.getElementById('searchBox').value.trim();
  const noRes = document.getElementById('no-results');
  const res = document.getElementById('search-results');
  if (!val || val.toLowerCase() === 'xyz123') { noRes.style.display = 'block'; res.style.display = 'none'; }
  else { noRes.style.display = 'none'; res.style.display = 'block'; }
}
document.getElementById('navSearch').addEventListener('keydown', function (e) {
  if (e.key === 'Enter') {
    document.getElementById('searchBox').value = this.value;
    showPage('search');
    handleSearch();
  }
});

// ─── FILTER CHIPS (toggle) ───
document.querySelectorAll('.filter-chip').forEach(chip => {
  chip.addEventListener('click', function () {
    document.querySelectorAll('.filter-chip').forEach(c => c.classList.remove('active'));
    this.classList.add('active');
  });
});

// ─── WEIGHT OPTIONS (toggle) ───
document.querySelectorAll('.weight-opt').forEach(opt => {
  opt.addEventListener('click', function () {
    document.querySelectorAll('.weight-opt').forEach(o => o.classList.remove('active'));
    this.classList.add('active');
  });
});

// ─── DELIVERY SLOTS (toggle) ───
document.querySelectorAll('.slot').forEach(s => {
  s.addEventListener('click', function () {
    document.querySelectorAll('.slot').forEach(x => x.classList.remove('active'));
    this.classList.add('active');
  });
});

// ─── PAYMENT OPTIONS (toggle) ───
document.querySelectorAll('.pay-opt').forEach(p => {
  p.addEventListener('click', function () {
    document.querySelectorAll('.pay-opt').forEach(x => x.classList.remove('active'));
    this.classList.add('active');
  });
});

// ─── AUTH TABS ───
document.querySelectorAll('.auth-tab').forEach(tab => {
  tab.addEventListener('click', function () {
    document.querySelectorAll('.auth-tab').forEach(t => t.classList.remove('active'));
    this.classList.add('active');
  });
});

// ─── FAQ DATA & RENDERING ───
const faqs = [
  { q: "How long does delivery take?", a: "Most orders are delivered within 60 minutes of placing. Estimated time is shown at checkout based on your location and the delivery slot you choose." },
  { q: "What is the minimum order value?", a: "There is no minimum order value. However, free delivery is available on orders above ₹150." },
  { q: "Can I get a refund?", a: "Yes! If you received a damaged or incorrect item, you can request a refund within 24 hours through the app or by contacting our support team." },
  { q: "Which payment methods are accepted?", a: "We accept UPI (Google Pay, PhonePe, Paytm), credit/debit cards, net banking, and cash on delivery." },
  { q: "How do I track my order?", a: "Once your order is confirmed, you can track it in real-time from the 'Order Tracking' section in your profile or via the notification we send." },
  { q: "Can I modify my order after placing it?", a: "You can modify your order as long as it hasn't been packed yet. Check the app for the status and edit option." },
  { q: "Are the products fresh?", a: "Absolutely! We source produce directly from certified farms and ensure same-day freshness for all perishable items." },
  { q: "Do you deliver to my area?", a: "We currently deliver across major cities in India. Enter your pincode at checkout to confirm availability." },
  { q: "How do I use a coupon code?", a: "Enter your coupon code during checkout in the 'Apply Coupon' field. Valid codes will automatically apply the discount." },
  { q: "How do I contact customer support?", a: "You can reach us at +91 98765 43210 (Mon–Sat, 8 AM–10 PM) or email help@freshnest.in. We typically respond within 1 hour." }
];

(function renderFAQs() {
  const container = document.getElementById('faq-list');
  faqs.forEach((item, i) => {
    container.innerHTML += `
      <div class="faq-item" id="faq-${i}">
        <button class="faq-q" onclick="toggleFAQ(${i})">
          <span>${i + 1}. ${item.q}</span>
          <span class="arrow">▼</span>
        </button>
        <div class="faq-a">${item.a}</div>
      </div>`;
  });
})();

function toggleFAQ(i) {
  const item = document.getElementById('faq-' + i);
  const wasOpen = item.classList.contains('open');
  document.querySelectorAll('.faq-item').forEach(f => f.classList.remove('open'));
  if (!wasOpen) item.classList.add('open');
}

// ─── MOBILE MENU ───
(function mobileMenuSetup() {
  const toggle = document.querySelector('.nav-toggle');
  const mobileMenu = document.getElementById('mobileMenu');
  const mobileSearch = document.getElementById('mobileSearch');

  function openMenu() { mobileMenu.style.display = 'block'; mobileMenu.setAttribute('aria-hidden', 'false'); }
  function closeMenu() { mobileMenu.style.display = 'none'; mobileMenu.setAttribute('aria-hidden', 'true'); }

  if (toggle) {
    toggle.addEventListener('click', function (e) {
      e.stopPropagation();
      if (mobileMenu.style.display === 'block') closeMenu(); else openMenu();
    });
  }

  // close when clicking outside
  document.addEventListener('click', function (e) {
    if (!e.target.closest('.mobile-menu') && !e.target.closest('.nav-toggle')) closeMenu();
  });

  // sync mobile search to main search and perform navigation
  if (mobileSearch) {
    mobileSearch.addEventListener('keydown', function (e) {
      if (e.key === 'Enter') {
        const mainSearch = document.getElementById('searchBox');
        if (mainSearch) mainSearch.value = this.value;
        showPage('search');
        handleSearch();
        closeMenu();
      }
    });
  }

  // Hide mobile menu on resize to desktop
  window.addEventListener('resize', function () { if (window.innerWidth > 900 && mobileMenu) closeMenu(); });
})();
