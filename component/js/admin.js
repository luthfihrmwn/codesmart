// State Management
let isEditing = false;
let editingRow = null;
let userToDelete = null;

// Utility Functions
const getElement = (id) => document.getElementById(id);

// Modal Management
const closeModal = (modalId) => {
  const modal = getElement(modalId);
  modal.style.display = 'none';

  if (modalId === 'userModal') {
    getElement('userForm').reset();
    resetEditingState();
  }
};

const openModal = (modalId) => {
  const modal = getElement(modalId);
  modal.style.display = 'flex';
};

// Reset Editing State
const resetEditingState = () => {
  isEditing = false;
  editingRow = null;
};

// Event Listeners
getElement('addBtn').addEventListener('click', () => openModal('userModal'));
getElement('importBtn').addEventListener('click', () => openModal('importModal'));
getElement('toggleDark').addEventListener('click', () => document.body.classList.toggle('dark'));

// Open Edit User Modal
const openEditModal = (username, email, role, status) => {
  openModal('userModal');

  getElement('username').value = username;
  getElement('email').value = email;
  getElement('role').value = role;
  getElement('status').value = status;

  // Clear password for security
  getElement('password').value = '';

  // Find the row that matches the user data
  const rows = document.querySelectorAll('#userTableBody tr');
  editingRow = Array.from(rows).find(row =>
    row.cells[0].textContent === username &&
    row.cells[1].textContent === email
  );

  isEditing = true;
};

// Validate Form Inputs
const validateUserForm = () => {
  const username = getElement('username').value.trim();
  const email = getElement('email').value.trim();
  const role = getElement('role').value;
  const status = getElement('status').value;
  const password = getElement('password').value.trim();

  if (!username || !email || !role || !status || (!isEditing && !password)) {
    alert('Please fill all required fields.');
    return false;
  }

  return true;
};

// Save or Update User
const saveUser = () => {
  if (!validateUserForm()) return;

  const username = getElement('username').value.trim();
  const email = getElement('email').value.trim();
  const password = getElement('password').value.trim();
  const role = getElement('role').value;
  const status = getElement('status').value;

  if (isEditing && editingRow) {
    updateTableRow(editingRow, { username, email, role, status });
  } else {
    addNewUser({ username, email, role, status });
  }

  closeModal('userModal');
};

// Add a New User Row
const addNewUser = ({ username, email, role, status }) => {
  const tbody = getElement('userTableBody');
  const row = document.createElement('tr');
  row.innerHTML = createUserRowHTML({ username, email, role, status });
  tbody.appendChild(row);
};

// Update Existing Row
const updateTableRow = (row, { username, email, role, status }) => {
  row.cells[0].textContent = username;
  row.cells[1].textContent = email;
  row.cells[2].textContent = role;
  row.cells[3].textContent = status;
  row.cells[4].innerHTML = createUserActionsHTML({ username, email, role, status });
};

// Delete User Logic
const openDeleteModal = (username) => {
  userToDelete = username;
  openModal('deleteModal');
};

const deleteUser = () => {
  const rows = document.querySelectorAll('#userTableBody tr');
  rows.forEach(row => {
    if (row.cells[0].textContent === userToDelete) {
      row.remove();
    }
  });

  closeModal('deleteModal');
};

// Generate Row HTML
const createUserRowHTML = ({ username, email, role, status }) => `
  <td>${username}</td>
  <td>${email}</td>
  <td>${role}</td>
  <td>${status}</td>
  <td>
    ${createUserActionsHTML({ username, email, role, status })}
  </td>
`;

// Generate User Actions HTML
const createUserActionsHTML = ({ username, email, role, status }) => `
  <button class="edit-btn" onclick="openEditModal('${username}', '${email}', '${role}', '${status}')">Edit</button>
  <button class="delete-btn" onclick="openDeleteModal('${username}')">Delete</button>
`;

// Import CSV Logic
const handleCSVUpload = () => {
  const fileInput = getElement('importFile');
  if (fileInput.files.length === 0) {
    alert('Please select a file to upload.');
    return;
  }

  const file = fileInput.files[0];
  const reader = new FileReader();

  reader.onload = (e) => {
    const content = e.target.result;
    alert('CSV File read successfully:\n' + content.split('\n').slice(0, 3).join('\n') + '\n\n(Parsing not implemented)');
  };

  reader.readAsText(file);
  closeModal('importModal');
};

// Event Listener for CSV Import
document.querySelector('.save-btn').addEventListener('click', handleCSVUpload);

