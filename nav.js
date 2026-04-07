/*
  KLYP HUB — Shared Navigation
  Инжектится на каждой странице
*/

const CURRENT_PAGE = document.body.dataset.page || 'dashboard';

const NAV_STRUCTURE = [
  { type: 'group', title: 'Dashboard' },
  { page: 'overview', label: 'Overview', href: 'index.html', parent: 'dashboard' },

  { type: 'group', title: 'Документация' },
  { page: 'meetings', label: 'Созвоны', href: 'index.html#meetings', parent: 'dashboard', count: '1' },
  { page: 'meeting-0', label: '06.04 — Онбординг', href: 'index.html#meeting-0', parent: 'dashboard', sub: true },
  { page: 'requirements', label: 'Требования', href: 'index.html#requirements', parent: 'dashboard', count: '14' },
  { page: 'decisions', label: 'Решения', href: 'index.html#decisions', parent: 'dashboard', count: '12' },

  { type: 'group', title: 'Работа' },
  { page: 'actions', label: 'Action Items', href: 'index.html#actions', parent: 'dashboard', count: '17' },
  { page: 'team', label: 'Команда', href: 'index.html#team', parent: 'dashboard', count: '4' },

  { type: 'group', title: 'Дизайн' },
  { page: 'workplan', label: 'Рабочий план', href: 'index.html#workplan', parent: 'dashboard' },
  { page: 'research', label: 'Ресёрч', href: 'index.html#research', parent: 'dashboard' },
  { page: 'refboard', label: 'Reference Board', href: 'index.html#refboard', parent: 'dashboard' },
  { page: 'architecture', label: 'Архитектура', href: 'index.html#architecture', parent: 'dashboard' },
  { page: 'stitch', label: 'Stitch-промпты', href: 'index.html#stitch', parent: 'dashboard' },

  { type: 'divider' },
  { type: 'group', title: 'Исследования' },
  { page: 'pipeline', label: 'AI Drama Pipeline', href: 'pipeline.html' },

  { type: 'divider' },
  { type: 'group', title: 'Документы' },
  { page: 'briefing', label: 'Day 1 Briefing', href: 'briefing.html' },
  { page: 'playbook', label: 'Design Playbook', href: 'playbook.html' },

  { type: 'divider' },
  { type: 'group', title: 'Система' },
  { page: 'howto', label: 'Как это работает', href: 'index.html#howto', parent: 'dashboard' },
];

function buildNav() {
  const sidebar = document.createElement('nav');
  sidebar.className = 'sidebar';
  sidebar.id = 'sidebar';

  // Logo
  sidebar.innerHTML = `
    <div class="sidebar-logo">
      <h1><a href="index.html">Klyp</a></h1>
      <p>Design Lead Hub</p>
    </div>
  `;

  let currentSub = null;

  NAV_STRUCTURE.forEach(item => {
    if (item.type === 'group') {
      currentSub = null;
      const el = document.createElement('div');
      el.className = 'nav-group';
      el.innerHTML = `<div class="nav-group-title">${item.title}</div>`;
      sidebar.appendChild(el);
      return;
    }
    if (item.type === 'divider') {
      currentSub = null;
      const el = document.createElement('div');
      el.className = 'nav-divider';
      sidebar.appendChild(el);
      return;
    }

    const a = document.createElement('a');
    a.className = 'nav-item' + (item.sub ? ' nav-sub-item' : '');
    a.href = item.href;
    a.dataset.navPage = item.page;

    if (item.sub) {
      a.style.cssText = 'font-size:.82rem;padding-left:32px';
    }

    // Active state
    if (CURRENT_PAGE === 'dashboard' && item.parent === 'dashboard') {
      // Hash-based active (handled by SPA router)
    } else if (item.page === CURRENT_PAGE) {
      a.classList.add('active');
    }

    let html = item.label;
    if (item.count) html += `<span class="count">${item.count}</span>`;
    a.innerHTML = html;

    // For dashboard SPA pages, prevent navigation and use hash
    if (item.parent === 'dashboard' && CURRENT_PAGE === 'dashboard') {
      a.href = '#' + item.page;
      a.addEventListener('click', e => {
        e.preventDefault();
        // Use the SPA router
        document.querySelectorAll('.nav-item').forEach(n => n.classList.remove('active'));
        a.classList.add('active');
        const target = document.getElementById('page-' + item.page);
        document.querySelectorAll('.page').forEach(p => p.classList.remove('active'));
        if (target) target.classList.add('active');
        document.querySelector('.main').scrollTo(0, 0);
        // Close mobile sidebar
        sidebar.classList.remove('open');
        document.getElementById('sidebar-overlay')?.classList.remove('open');
      });
    } else {
      // Close mobile sidebar on navigation
      a.addEventListener('click', () => {
        sidebar.classList.remove('open');
      });
    }

    sidebar.appendChild(a);
  });

  // Footer
  const footer = document.createElement('div');
  footer.className = 'sidebar-footer';
  footer.innerHTML = 'Обновлено 7 апр 2026<br>Klyp Design Hub';
  sidebar.appendChild(footer);

  // Desktop collapse button
  const collapseBtn = document.createElement('button');
  collapseBtn.className = 'sidebar-collapse-btn';
  collapseBtn.id = 'sidebar-collapse-btn';
  collapseBtn.setAttribute('aria-label', 'Toggle sidebar');
  collapseBtn.innerHTML = '<svg viewBox="0 0 16 16" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><path d="M10 3L5 8l5 5"/></svg>';

  collapseBtn.addEventListener('click', () => {
    const isCollapsed = document.body.classList.toggle('sidebar-collapsed');
    localStorage.setItem('klyp-sidebar', isCollapsed ? 'collapsed' : 'expanded');
  });

  // Restore saved state
  if (localStorage.getItem('klyp-sidebar') === 'collapsed') {
    document.body.classList.add('sidebar-collapsed');
  }

  // Keyboard shortcut: [ to toggle sidebar
  document.addEventListener('keydown', e => {
    if (e.key === '[' && !e.ctrlKey && !e.metaKey && !['INPUT','TEXTAREA'].includes(e.target.tagName)) {
      collapseBtn.click();
    }
  });

  // Mobile toggle button
  const toggle = document.createElement('button');
  toggle.className = 'sidebar-toggle';
  toggle.id = 'sidebar-toggle';
  toggle.innerHTML = '☰';
  toggle.addEventListener('click', () => {
    sidebar.classList.toggle('open');
    overlay.classList.toggle('open');
  });

  // Mobile overlay
  const overlay = document.createElement('div');
  overlay.className = 'sidebar-overlay';
  overlay.id = 'sidebar-overlay';
  overlay.addEventListener('click', () => {
    sidebar.classList.remove('open');
    overlay.classList.remove('open');
  });

  document.body.prepend(overlay);
  document.body.prepend(toggle);
  document.body.prepend(collapseBtn);
  document.body.prepend(sidebar);
}

// Lightbox
function initLightbox() {
  const lb = document.createElement('div');
  lb.className = 'lightbox';
  lb.id = 'lightbox';
  lb.innerHTML = '<img id="lightbox-img" src="" alt=""><div class="lightbox-caption" id="lightbox-cap"></div>';
  lb.addEventListener('click', () => lb.classList.remove('open'));
  document.body.appendChild(lb);

  document.addEventListener('click', e => {
    const img = e.target.closest('.ref-card img');
    if (!img) return;
    e.stopPropagation();
    document.getElementById('lightbox-img').src = img.src;
    const card = img.closest('.ref-card');
    const title = card?.querySelector('.ref-card-title')?.textContent || '';
    const platform = card?.querySelector('.ref-card-platform')?.textContent || '';
    document.getElementById('lightbox-cap').textContent = title + ' — ' + platform;
    lb.classList.add('open');
  });

  document.addEventListener('keydown', e => {
    if (e.key === 'Escape') document.getElementById('lightbox').classList.remove('open');
  });
}

// Expandable cards
function initExpandables() {
  document.querySelectorAll('.expandable').forEach(el => {
    el.addEventListener('click', () => el.classList.toggle('open'));
  });
}

// Init
document.addEventListener('DOMContentLoaded', () => {
  buildNav();
  initLightbox();
  initExpandables();

  // Handle hash navigation for dashboard
  if (CURRENT_PAGE === 'dashboard') {
    const hash = location.hash.replace('#', '');
    if (hash) {
      const target = document.getElementById('page-' + hash);
      if (target) {
        document.querySelectorAll('.page').forEach(p => p.classList.remove('active'));
        target.classList.add('active');
        document.querySelectorAll('.nav-item').forEach(n => {
          n.classList.toggle('active', n.dataset.navPage === hash);
        });
      }
    }
  }
});
