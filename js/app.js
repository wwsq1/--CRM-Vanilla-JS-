console.log('Mini CRM started');

const STORAGE_KEY = 'mini_crm_clients';

// ===== DATA =====
const clients = [];

let nextClientId = 1;

// ===== DOM =====
const clientList = document.getElementById('clientList');
const addClientForm = document.getElementById('addClientForm');
const clientNameInput = document.getElementById('clientNameInput');
const emptyState = document.getElementById('emptyState');

// ===== STORAGE =====
function saveClients() {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(clients));
}

function loadClients() {
  const data = localStorage.getItem(STORAGE_KEY);
  if (!data) return;

  const parsed = JSON.parse(data);
  if (!Array.isArray(parsed)) return;

  clients.length = 0;
  clients.push(...parsed);
}

function syncNextClientId() {
  let maxId = 0;
  clients.forEach(function (c) {
    if (c.id > maxId) maxId = c.id;
  });
  nextClientId = maxId + 1;
}

// ===== RENDER =====
function renderClients() {
  clientList.innerHTML = '';

  if (clients.length === 0) {
    emptyState.style.display = 'block';
    return;
  } else {
    emptyState.style.display = 'none';
  }

  clients.forEach(function (client) {
    const li = document.createElement('li');
    li.className = 'client-item';
    li.dataset.id = client.id;

    const nameSpan = document.createElement('span');
    nameSpan.className = 'client-name';
    nameSpan.textContent = client.name;

    const statusSpan = document.createElement('span');
    statusSpan.className = 'client-status ' + client.status;
    statusSpan.textContent =
      client.status === 'active' ? 'Активен' : 'Неактивен';

    const deleteBtn = document.createElement('button');
    deleteBtn.className = 'delete-btn';
    deleteBtn.textContent = 'Удалить';
    deleteBtn.type = 'button';

    li.appendChild(nameSpan);
    li.appendChild(statusSpan);
    li.appendChild(deleteBtn);

    clientList.appendChild(li);
  });
}

// ===== EVENTS =====
addClientForm.addEventListener('submit', function (event) {
  event.preventDefault();

  const name = clientNameInput.value.trim();
  if (!name) return;

  clients.push({
    id: nextClientId,
    name: name,
    status: 'active'
  });

  nextClientId += 1;

  saveClients();
  renderClients();

  clientNameInput.value = '';
});

clientList.addEventListener('click', function (event) {
  const item = event.target.closest('.client-item');
  if (!item) return;

  const id = Number(item.dataset.id);
  
  //1) Если нажали на кнопку Удалить - удаляем
  if (event.target.classList.contains('delete-btn')) {
    const index = clients.findIndex(function (c) {
      return c.id === id;
    });
    
    if (index === -1) return;

    const ok = confirm('Удалить клиента');
    if (!ok) return;

    clients.splice(index, 1);
    saveClients();
    renderClients();
    return;
  }

  // 2) Иначе - переключаем статус
  const client = clients.find(function (c) {
    return c.id === id;
  });

  if (!client) return;

  client.status = client.status === 'active' ? 'inactive' : 'active';
  saveClients();
  renderClients();
});

// ===== START =====
loadClients();
syncNextClientId();
renderClients();
