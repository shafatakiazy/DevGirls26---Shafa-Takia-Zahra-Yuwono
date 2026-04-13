/**
 * render.js
 */

function escapeHtml(str) {
  if (str === null || str === undefined) return '';
  return String(str)
    .replace(/&/g,  '&amp;')
    .replace(/</g,  '&lt;')
    .replace(/>/g,  '&gt;')
    .replace(/"/g,  '&quot;')
    .replace(/'/g,  '&#39;');
}

function formatDate(dateStr) {
  if (!dateStr) return '';
  const d = new Date(dateStr + 'T00:00:00');
  if (isNaN(d.getTime())) return dateStr; // fallback jika format tidak valid
  return d.toLocaleDateString('id-ID', {
    day: 'numeric', month: 'short', year: 'numeric'
  });
}

function getToday() {
  return new Date().toISOString().slice(0, 10);
}

function buildTaskItemHTML(task, today) {
  const isOverdue     = task.deadline && task.deadline < today && !task.done;
  const deadlineLabel = task.deadline
    ? (isOverdue ? 'Terlambat: ' : 'Deadline: ') + formatDate(task.deadline)
    : '';

  const badgeDeadline = task.deadline
    ? `<span class="badge ${isOverdue ? 'badge-overdue' : 'badge-deadline'}">${escapeHtml(deadlineLabel)}</span>`
    : '';

  const badgeDone    = task.done
    ? `<span class="badge badge-done">Selesai</span>` : '';

  const badgeCat     = task.category
    ? `<span class="badge badge-cat">${escapeHtml(task.category)}</span>` : '';

  const badgeSubject = task.subject
    ? `<span class="badge badge-cat">${escapeHtml(task.subject)}</span>` : '';

  const descHTML = task.desc
    ? `<p class="task-desc">${escapeHtml(task.desc)}</p>` : '';
  return `
    <article class="task-item ${task.done ? 'done-item' : ''}" data-id="${task.id}">
      <div class="task-check ${task.done ? 'checked' : ''}"
           role="checkbox"
           aria-checked="${task.done}"
           tabindex="0"
           data-action="toggle">
      </div>
      <div class="task-body">
        <p class="task-title">${escapeHtml(task.title)}</p>
        ${descHTML}
        <div class="task-meta">
          ${badgeCat}
          ${badgeSubject}
          ${badgeDone}
          ${badgeDeadline}
        </div>
      </div>
      <div class="task-actions">
        <button class="btn-delete" data-action="delete">Hapus</button>
      </div>
    </article>
  `;
}

function updateStats(allTasks) {
  const today      = getToday();
  const todayTasks = allTasks.filter(t => t.date === today);

  document.getElementById('s-total').textContent   = todayTasks.length;
  document.getElementById('s-done').textContent    = todayTasks.filter(t => t.done).length;
  document.getElementById('s-pending').textContent = todayTasks.filter(t => !t.done).length;
}

function renderTaskList(allTasks, searchQuery, filterStatus, filterCat) {
  const today = getToday();
  const query = (searchQuery || '').toLowerCase().trim();

  const filtered = allTasks.filter(task => {
    const matchSearch =
      !query ||
      (task.title  || '').toLowerCase().includes(query) ||
      (task.desc   || '').toLowerCase().includes(query) ||
      (task.subject|| '').toLowerCase().includes(query);

    const matchStatus =
      !filterStatus ||
      (filterStatus === 'done'    &&  task.done) ||
      (filterStatus === 'pending' && !task.done);

    const matchCat = !filterCat || task.category === filterCat;

    return matchSearch && matchStatus && matchCat;
  });

  const container = document.getElementById('task-list');
  if (!container) return;

  if (filtered.length === 0) {
    container.innerHTML = `
      <div class="empty-state">
        <span class="empty-icon">📭</span>
        Tidak ada tugas yang ditemukan.
      </div>`;
    return;
  }

  container.innerHTML = filtered
    .map(task => buildTaskItemHTML(task, today))
    .join('');
}