/**
 * Time Study — Zendesk Ticket Lifecycle
 * Tab navigation and dynamic content loading
 */

// Cache loaded tab content so we don't re-fetch
const tabCache = {};

async function showTab(id) {
  // Update active tab button
  document.querySelectorAll('.tab').forEach(t => t.classList.remove('active'));
  const clickedTab = document.querySelector(`.tab[data-tab="${id}"]`);
  if (clickedTab) clickedTab.classList.add('active');

  // Hide all sections
  document.querySelectorAll('.section').forEach(s => s.classList.remove('active'));

  // Check if content is already loaded
  let section = document.getElementById(id);
  if (section) {
    section.classList.add('active');
    return;
  }

  // Fetch the tab content from its HTML fragment
  const contentDiv = document.querySelector('.content');
  
  if (!tabCache[id]) {
    try {
      const response = await fetch(`tabs/${id}.html`);
      if (!response.ok) throw new Error(`Failed to load tab: ${id}`);
      tabCache[id] = await response.text();
    } catch (err) {
      console.error(err);
      tabCache[id] = `<div class="section active" id="${id}">
        <div class="section-title">Error loading content</div>
        <div class="section-desc">Could not load the ${id} tab. Please refresh and try again.</div>
      </div>`;
    }
  }

  // Insert the content
  const wrapper = document.createElement('div');
  wrapper.innerHTML = tabCache[id];
  const newSection = wrapper.firstElementChild;
  contentDiv.appendChild(newSection);
  newSection.classList.add('active');
}

// On page load, the lifecycle tab is already inline — just wire up the tabs
document.addEventListener('DOMContentLoaded', () => {
  document.querySelectorAll('.tab').forEach(tab => {
    tab.addEventListener('click', () => {
      const tabId = tab.getAttribute('data-tab');
      showTab(tabId);
    });
  });
});
