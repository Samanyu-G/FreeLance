const API_URL = 'http://localhost:3000';
let currentUser = null;

const PAGES = {
    dashboard: `
        <div class="dashboard">
            <div class="stats-container">
                <div class="stat-card">
                    <i class="fas fa-briefcase"></i>
                    <div class="stat-info">
                        <h3>Active Gigs</h3>
                        <p id="activeGigs">0</p>
                    </div>
                </div>
                <div class="stat-card">
                    <i class="fas fa-users"></i>
                    <div class="stat-info">
                        <h3>Total Freelancers</h3>
                        <p id="totalFreelancers">0</p>
                    </div>
                </div>
                <div class="stat-card">
                    <i class="fas fa-star"></i>
                    <div class="stat-info">
                        <h3>Average Rating</h3>
                        <p>4.8</p>
                    </div>
                </div>
                <div class="stat-card">
                    <i class="fas fa-clock"></i>
                    <div class="stat-info">
                        <h3>Hours Worked</h3>
                        <p>124</p>
                    </div>
                </div>
            </div>
            <h2 class="section-title">Latest Gigs</h2>
            <div id="gigs" class="gigs-container"></div>
        </div>
    `,
    myGigs: `
        <div class="my-gigs">
            <h2 class="section-title">My Gigs</h2>
            <div id="myGigsList" class="gigs-container"></div>
        </div>
    `,
    messages: `
        <div class="messages-page">
            <h2 class="section-title">Messages</h2>
            <div class="messages-container">
                <div class="no-messages">
                    <i class="fas fa-envelope"></i>
                    <p>No messages yet</p>
                </div>
            </div>
        </div>
    `,
    settings: `
        <div class="settings-page">
            <h2 class="section-title">Account Settings</h2>
            <form id="settingsForm" class="settings-form">
                <div class="input-group">
                    <i class="fas fa-user"></i>
                    <input type="text" id="settingsName" placeholder="Full Name">
                </div>
                <div class="input-group">
                    <i class="fas fa-envelope"></i>
                    <input type="email" id="settingsEmail" placeholder="Email">
                </div>
                <div class="input-group">
                    <i class="fas fa-lock"></i>
                    <input type="password" id="settingsPassword" placeholder="New Password">
                </div>
                <button type="submit" class="submit-btn">Save Changes</button>
            </form>
        </div>
    `
};

// Add this function to switch between pages
function switchPage(pageName) {
    const mainContent = document.querySelector('main .dashboard');
    if (PAGES[pageName]) {
        mainContent.innerHTML = PAGES[pageName];
        if (pageName === 'dashboard') {
            updateDashboardStats();
            loadGigs();
        } else if (pageName === 'myGigs') {
            loadMyGigs();
        }
    }
}

// Add this function to load user's own gigs
async function loadMyGigs() {
    try {
        const response = await fetch(`${API_URL}/gigs/my-gigs`, {
            headers: {
                'Authorization': `Bearer ${localStorage.getItem('token')}`
            }
        });
        const gigs = await response.json();
        
        const myGigsList = document.getElementById('myGigsList');
        if (gigs.length === 0) {
            myGigsList.innerHTML = `
                <div class="no-gigs">
                    <i class="fas fa-briefcase"></i>
                    <p>You haven't created any gigs yet</p>
                    <button onclick="toggleGigForm()" class="submit-btn">
                        <i class="fas fa-plus"></i> Create Your First Gig
                    </button>
                </div>
            `;
            return;
        }
        
        myGigsList.innerHTML = gigs.map(gig => `
            <div class="gig-card">
                ${gig.image ? 
                    `<img src="${API_URL}${gig.image}" alt="${gig.title}" class="gig-image">` :
                    `<div class="gig-image" style="background: #e2e8f0; display: flex; align-items: center; justify-content: center;">
                        <i class="fas fa-image" style="font-size: 3rem; color: #94a3b8;"></i>
                    </div>`
                }
                <div class="gig-content">
                    <h3 class="gig-title">${gig.title}</h3>
                    <div class="gig-meta">
                        <i class="fas fa-dollar-sign"></i> ${gig.price}/hr
                    </div>
                    <p class="gig-description">${gig.description}</p>
                    <div class="gig-skills">
                        ${gig.skills.split(',').map(skill => 
                            `<span class="skill-tag">${skill.trim()}</span>`
                        ).join('')}
                    </div>
                    <div class="gig-actions">
                        <button onclick="editGig('${gig._id}')" class="edit-btn">
                            <i class="fas fa-edit"></i> Edit
                        </button>
                        <button onclick="deleteGig('${gig._id}')" class="delete-btn">
                            <i class="fas fa-trash"></i> Delete
                        </button>
                    </div>
                </div>
            </div>
        `).join('');
    } catch (error) {
        console.error('Error loading my gigs:', error);
    }
}

function switchTab(tab) {
    document.querySelectorAll('.auth-tab').forEach(t => t.classList.remove('active'));
    document.querySelectorAll('.auth-form').forEach(f => f.classList.add('hidden'));
    
    document.querySelector(`.auth-tab[onclick="switchTab('${tab}')"]`).classList.add('active');
    document.getElementById(`${tab}Form`).classList.remove('hidden');
}

async function login(email, password, userType) {
    try {
        const response = await fetch(`${API_URL}/login`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ email, password, userType })
        });
        const data = await response.json();
        if (response.ok) {
            localStorage.setItem('token', data.token);
            currentUser = data.user;
            showMainPage();
        } else {
            alert(data.message);
        }
    } catch (error) {
        console.error('Login error:', error);
        alert('Login failed');
    }
}

async function register(name, email, password, userType) {
    try {
        const response = await fetch(`${API_URL}/register`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ name, email, password, userType })
        });
        const data = await response.json();
        if (response.ok) {
            alert('Registration successful! Please login.');
            switchTab('login');
        } else {
            alert(data.message);
        }
    } catch (error) {
        console.error('Registration error:', error);
        alert('Registration failed');
    }
}

function logout() {
    localStorage.removeItem('token');
    currentUser = null;
    document.getElementById('loginPage').classList.remove('hidden');
    document.getElementById('mainPage').classList.add('hidden');
}

function showMainPage() {
    document.getElementById('loginPage').classList.add('hidden');
    document.getElementById('mainPage').classList.remove('hidden');
    
    document.getElementById('userInfo').textContent = currentUser.name;
    document.getElementById('userType').textContent = 
        currentUser.userType.charAt(0).toUpperCase() + currentUser.userType.slice(1);
    
    if (currentUser.userType === 'freelancer') {
        document.getElementById('newGigBtn').classList.remove('hidden');
    }
    
    updateDashboardStats();
    loadGigs();
}

async function updateDashboardStats() {
    try {
        const response = await fetch(`${API_URL}/stats`, {
            headers: { 'Authorization': `Bearer ${localStorage.getItem('token')}` }
        });
        const stats = await response.json();
        
        document.getElementById('activeGigs').textContent = stats.activeGigs || 0;
        document.getElementById('totalFreelancers').textContent = stats.totalFreelancers || 0;
    } catch (error) {
        console.error('Error loading stats:', error);
    }
}

function toggleGigForm() {
    const form = document.getElementById('gigForm');
    const createGigForm = document.getElementById('createGigForm');
    if (form.classList.contains('hidden')) {
        form.classList.remove('hidden');
        createGigForm.reset();
    } else {
        form.classList.add('hidden');
    }
}

async function loadGigs() {
    try {
        const response = await fetch(`${API_URL}/gigs`, {
            headers: { 'Authorization': `Bearer ${localStorage.getItem('token')}` }
        });
        const gigs = await response.json();
        
        const gigsContainer = document.getElementById('gigs');
        gigsContainer.innerHTML = gigs.map(gig => {
            const gigImageSection = gig.image 
                ? `<img src="${API_URL}${gig.image}" alt="${gig.title}" class="gig-image">`
                : `<div class="gig-image" style="background: #e2e8f0; display: flex; align-items: center; justify-content: center;">
                     <i class="fas fa-image" style="font-size: 3rem; color: #94a3b8;"></i>
                   </div>`;

            const skillsSection = gig.skills
                .split(',')
                .map(skill => `<span class="skill-tag">${skill.trim()}</span>`)
                .join('');

            return `
                <div class="gig-card">
                    ${gigImageSection}
                    <div class="gig-content">
                        <h3 class="gig-title">${gig.title}</h3>
                        <div class="gig-meta">
                            <i class="fas fa-user"></i> ${gig.freelancerName}
                            <i class="fas fa-dollar-sign"></i> ${gig.price}/hr
                        </div>
                        <p class="gig-description">${gig.description}</p>
                        <div class="gig-skills">
                            ${skillsSection}
                        </div>
                    </div>
                </div>
            `;
        }).join('');
    } catch (error) {
        console.error('Error loading gigs:', error);
    }
}

function setSubmitButtonLoading(isLoading) {
    const submitBtn = document.getElementById('submitGigBtn');
    if (isLoading) {
        submitBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Creating...';
        submitBtn.disabled = true;
    } else {
        submitBtn.innerHTML = 'Publish Gig';
        submitBtn.disabled = false;
    }
}

function logFormData(formData) {
    console.log('Form data contents:');
    for (let pair of formData.entries()) {
        console.log(pair[0] + ': ' + pair[1]);
    }
}

document.getElementById('loginForm').addEventListener('submit', async (e) => {
    e.preventDefault();
    const email = document.getElementById('loginEmail').value;
    const password = document.getElementById('loginPassword').value;
    const userType = document.getElementById('loginUserType').value;
    await login(email, password, userType);
});

document.getElementById('registerForm').addEventListener('submit', async (e) => {
    e.preventDefault();
    const name = document.getElementById('registerName').value;
    const email = document.getElementById('registerEmail').value;
    const password = document.getElementById('registerPassword').value;
    const userType = document.getElementById('registerUserType').value;
    await register(name, email, password, userType);
});

document.getElementById('createGigForm').addEventListener('submit', async function(e) {
    e.preventDefault();
    console.log('Form submission started');
    setSubmitButtonLoading(true);

    try {
        // Create FormData object
        const formData = new FormData();
        
        // Add form fields
        formData.append('title', document.getElementById('title').value);
        formData.append('description', document.getElementById('description').value);
        formData.append('price', document.getElementById('price').value);
        formData.append('skills', document.getElementById('skills').value);
        
        // Add image if selected
        const imageFile = document.getElementById('image').files[0];
        if (imageFile) {
            formData.append('image', imageFile);
        }

        // Log form data for debugging
        console.log('Preparing to send form data:');
        logFormData(formData);

        // Get token
        const token = localStorage.getItem('token');
        console.log('Token available:', !!token);

        // Send request
        console.log('Sending request to:', `${API_URL}/gigs`);
        const response = await fetch(`${API_URL}/gigs`, {
            method: 'POST',
            headers: {
                'Authorization': `Bearer ${token}`
            },
            body: formData
        });

        console.log('Response status:', response.status);
        const result = await response.json();
        console.log('Server response:', result);

        if (response.ok) {
            alert('Gig created successfully!');
            this.reset();
            toggleGigForm();
            loadGigs();
        } else {
            throw new Error(result.message || 'Failed to create gig');
        }
    } catch (error) {
        console.error('Error creating gig:', error);
        alert(`Failed to create gig: ${error.message}`);
    } finally {
        setSubmitButtonLoading(false);
    }
});

document.querySelector('.search-bar input').addEventListener('input', (e) => {
    const searchTerm = e.target.value.toLowerCase();
    const gigCards = document.querySelectorAll('.gig-card');
    
    gigCards.forEach(card => {
        const title = card.querySelector('.gig-title').textContent.toLowerCase();
        const description = card.querySelector('.gig-description').textContent.toLowerCase();
        const skills = card.querySelector('.gig-skills').textContent.toLowerCase();
        
        if (title.includes(searchTerm) || 
            description.includes(searchTerm) || 
            skills.includes(searchTerm)) {
            card.style.display = '';
        } else {
            card.style.display = 'none';
        }
    });
});

document.querySelectorAll('.sidebar-menu li').forEach(item => {
    item.addEventListener('click', function() {
        const pageName = this.querySelector('span').textContent.toLowerCase();
        if (pageName === 'logout') {
            logout();
            return;
        }
        
        document.querySelectorAll('.sidebar-menu li').forEach(i => i.classList.remove('active'));
        this.classList.add('active');
        switchPage(pageName);
    });
});

const token = localStorage.getItem('token');
if (token) {
    fetch(`${API_URL}/verify`, {
        headers: { 'Authorization': `Bearer ${token}` }
    })
    .then(response => response.json())
    .then(data => {
        if (data.user) {
            currentUser = data.user;
            showMainPage();
        }
    })
    .catch(() => localStorage.removeItem('token'));
}

function debugFormData(formData) {
    for (let pair of formData.entries()) {
        console.log(pair[0] + ': ' + pair[1]);
    }
}

document.getElementById('createGigForm').addEventListener('submit', async (e) => {
    e.preventDefault();
    setSubmitButtonLoading(true);
    
    try {
        const formData = new FormData();
        formData.append('title', document.getElementById('title').value);
        formData.append('description', document.getElementById('description').value);
        formData.append('price', document.getElementById('price').value);
        formData.append('skills', document.getElementById('skills').value);
        
        const imageFile = document.getElementById('image').files[0];
        if (imageFile) {
            formData.append('image', imageFile);
        }

        // Debug log
        console.log('Sending gig data:');
        debugFormData(formData);
        console.log('Token:', localStorage.getItem('token'));

        const response = await fetch(`${API_URL}/gigs`, {
            method: 'POST',
            headers: {
                'Authorization': `Bearer ${localStorage.getItem('token')}`
            },
            body: formData  // Don't set Content-Type header when using FormData
        });

        console.log('Response status:', response.status);
        const result = await response.json();
        console.log('Response data:', result);

        if (response.ok) {
            alert('Gig created successfully!');
            document.getElementById('createGigForm').reset();
            toggleGigForm();
            loadGigs();
        } else {
            throw new Error(result.message || 'Failed to create gig');
        }
    } catch (error) {
        console.error('Error creating gig:', error);
        alert(error.message);
    } finally {
        setSubmitButtonLoading(false);
    }
});