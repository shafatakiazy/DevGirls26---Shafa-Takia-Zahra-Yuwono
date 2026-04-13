/**
 * storage.js
 * Modul pengelolaan data ke localStorage.
 */

const STORAGE_KEY = 'studytracker_tasks';
const DARK_KEY    = 'studytracker_dark';

function getTasks() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    const parsed = raw ? JSON.parse(raw) : [];
    // Pastikan hasil selalu array
    return Array.isArray(parsed) ? parsed : [];
  } catch (e) {
    console.error('Gagal membaca data tugas:', e);
    return [];
  }
}

function saveTasks(tasks) {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(tasks));
  } catch (e) {
    console.error('Gagal menyimpan data tugas:', e);
    alert('Gagal menyimpan data. Pastikan browser Anda tidak dalam mode private atau penyimpanan tidak penuh.');
  }
}

function addTask(task) {
  if (!task || !task.id) return;
  const tasks = getTasks();
  tasks.unshift(task);
  saveTasks(tasks);
}

function toggleTaskDone(id) {
  const tasks = getTasks();
  const task  = tasks.find(t => t.id === id);
  if (task) {
    task.done = !task.done;
    saveTasks(tasks);
  }
}

function deleteTask(id) {
  const tasks = getTasks().filter(t => t.id !== id);
  saveTasks(tasks);
}

function getDarkMode() {
  return localStorage.getItem(DARK_KEY) === '1';
}

function saveDarkMode(enabled) {
  localStorage.setItem(DARK_KEY, enabled ? '1' : '0');
}