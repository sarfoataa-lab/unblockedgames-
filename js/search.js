/**
 * Akwasi Unblocked Games - Search & Filtering Engine
 * Real-time instant search across websites and gaming titles with safe null checking.
 */

import { WEBSITES_LIST, renderWebsites } from "./websites.js";

export function initSearch() {
  try {
    const searchInput = document.querySelector('#search-input');
    const searchForm = document.querySelector('#search-form');
    const clearBtn = document.querySelector('#search-clear-btn');
    const categoryTabs = document.querySelectorAll('.cat-pill');

    let currentCategory = 'all';
    let currentQuery = '';

    function filterAndRender() {
      const q = currentQuery.trim().toLowerCase();
      const filtered = WEBSITES_LIST.filter(item => {
        const matchesCat = currentCategory === 'all' || item.category === currentCategory;
        const matchesQuery = !q ||
          item.name.toLowerCase().includes(q) ||
          item.description.toLowerCase().includes(q) ||
          item.badge.toLowerCase().includes(q);
        return matchesCat && matchesQuery;
      });

      renderWebsites(filtered);

      if (clearBtn) {
        clearBtn.style.display = q ? 'inline-flex' : 'none';
      }
    }

    if (searchInput) {
      searchInput.addEventListener('input', (e) => {
        const target = e.target;
        currentQuery = (target && target.value) ? target.value : '';
        filterAndRender();
      });
    }

    if (clearBtn) {
      clearBtn.addEventListener('click', () => {
        if (searchInput) {
          searchInput.value = '';
          currentQuery = '';
          searchInput.focus();
        }
        filterAndRender();
      });
    }

    if (searchForm) {
      searchForm.addEventListener('submit', (e) => {
        e.preventDefault();
        const q = searchInput ? searchInput.value.trim() : '';
        if (!q) return;

        // If user enters a full domain or URL, open directly
        if (/^(https?:\/\/|[a-z0-9-]+\.[a-z]{2,})/i.test(q)) {
          const url = q.startsWith('http') ? q : `https://${q}`;
          window.open(url, '_blank', 'noopener,noreferrer');
        } else {
          // Otherwise search on Google
          window.open(`https://www.google.com/search?q=${encodeURIComponent(q)}`, '_blank', 'noopener,noreferrer');
        }
      });
    }

    categoryTabs.forEach(tab => {
      tab.addEventListener('click', () => {
        categoryTabs.forEach(t => t.classList.remove('active'));
        tab.classList.add('active');
        const cat = tab.getAttribute('data-category');
        currentCategory = cat || 'all';
        filterAndRender();
      });
    });

  } catch (err) {
    console.error('Error initializing search engine:', err);
  }
}
