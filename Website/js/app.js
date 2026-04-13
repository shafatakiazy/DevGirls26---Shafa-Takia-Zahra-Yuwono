/**
 * app.js
 * Entry point aplikasi Study Tracker.
 */

document.addEventListener('DOMContentLoaded', function () {

  if (getDarkMode()) {
    document.body.classList.add('dark');
    const btn = document.getElementById('dark-btn');
    if (btn) btn.textContent = '☀️ Light Mode';
  }

  refreshUI();

  // Event listener filter & pencarian
  document.getElementById('search').addEventListener('input', refreshUI);
  document.getElementById('filter-status').addEventListener('change', refreshUI);
  document.getElementById('filter-cat').addEventListener('change', refreshUI);

  // Submit dengan Enter di input judul
  document.getElementById('inp-title').addEventListener('keydown', function (e) {
    if (e.key === 'Enter') handleAddTask();
  });

  document.getElementById('task-list').addEventListener('click', function (e) {
    // Cari artikel tugas terdekat dari elemen yang diklik
    const article = e.target.closest('[data-id]');
    if (!article) return;

    const id     = Number(article.getAttribute('data-id'));
    const action = e.target.closest('[data-action]')?.getAttribute('data-action');

    if (action === 'toggle') {
      handleToggle(id);
    } else if (action === 'delete') {
      handleDelete(id);
    }
  });

  // Keyboard accessibility untuk task-check (Enter / Space)
  document.getElementById('task-list').addEventListener('keydown', function (e) {
    if (e.key !== 'Enter' && e.key !== ' ') return;
    const check = e.target.closest('[data-action="toggle"]');
    if (!check) return;
    e.preventDefault();
    const article = check.closest('[data-id]');
    if (article) handleToggle(Number(article.getAttribute('data-id')));
  });

});

/* ===========================
   Fungsi Utama
   =========================== */

function refreshUI() {
  const allTasks = getTasks();

  const searchEl  = document.getElementById('search');
  const statusEl  = document.getElementById('filter-status');
  const catEl     = document.getElementById('filter-cat');

  // Guard: pastikan semua elemen ada sebelum mengambil value
  if (!searchEl || !statusEl || !catEl) return;

  updateStats(allTasks);
  renderTaskList(
    allTasks,
    searchEl.value,
    statusEl.value,
    catEl.value
  );
}

function handleAddTask() {
  const titleEl = document.getElementById('inp-title');
  const title   = titleEl.value.trim();

  if (!title) {
    alert('Nama tugas wajib diisi!');
    titleEl.focus();
    return;
  }

  if (title.length > 200) {
    alert('Nama tugas terlalu panjang (maksimal 200 karakter).');
    titleEl.focus();
    return;
  }

  const newTask = {
    id:       Date.now(),                                         // ID unik berbasis waktu
    title:    title,
    desc:     document.getElementById('inp-desc').value.trim(),
    category: document.getElementById('inp-cat').value,
    subject:  document.getElementById('inp-subject').value.trim(),
    deadline: document.getElementById('inp-deadline').value,
    done:     false,
    date:     getToday()                                          // tanggal pembuatan tugas
  };

  addTask(newTask);
  clearForm();
  refreshUI();
}

function handleToggle(id) {
  if (!id) return;
  toggleTaskDone(id);
  refreshUI();
}

function handleDelete(id) {
  if (!id) return;
  if (!confirm('Yakin ingin menghapus tugas ini?')) return;
  deleteTask(id);
  refreshUI();
}

function toggleDark() {
  const isNowDark = document.body.classList.toggle('dark');
  const btn = document.getElementById('dark-btn');
  if (btn) {
    btn.textContent = isNowDark ? '☀️ Light Mode' : '🌙 Dark Mode';
  }
  saveDarkMode(isNowDark);
}

function clearForm() {
  document.getElementById('inp-title').value    = '';
  document.getElementById('inp-desc').value     = '';
  document.getElementById('inp-cat').value      = '';
  document.getElementById('inp-subject').value  = '';
  document.getElementById('inp-deadline').value = '';
}