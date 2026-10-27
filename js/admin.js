
/* ==========================================
   CELLARTGEN ADMIN PANEL
   Complete Admin JavaScript
   ========================================== */

let adminAuthenticated = false;
let cmsType = 'expertise';
let cmsItems = [];
let cmsEditingItem = null;
let cmsImageData = '';

const getEl = id => document.getElementById(id);

const authGate = getEl('authGate');
const loginForm = getEl('loginForm');
const cmsList = getEl('cmsList');
const cmsNotice = getEl('cmsNotice');
const cmsModal = getEl('cmsModal');
const cmsEditorForm = getEl('cmsEditorForm');

const cmsNames = {
    expertise: 'Our Expertise',
    pages: 'Website Pages',
    blogs: 'Blogs',
    media: 'Media Library',
    settings: 'Site Settings',
    enquiries: 'Enquiries'
};

/* ---------- API REQUEST ---------- */

async function apiRequest(url, options = {}) {
    const response = await fetch(url, {
        credentials: 'same-origin',
        headers: { 'Content-Type': 'application/json' },
        ...options
    });

    const data = await response.json().catch(() => ({}));

    if (!response.ok) {
        throw new Error(data.error || 'Request failed');
    }

    return data;
}

const authRequest = apiRequest;
const cmsRequest = apiRequest;

/* ---------- NOTIFICATIONS ---------- */

function cmsMessage(message) {
    if (cmsNotice) cmsNotice.textContent = message;
}

/* ---------- LOGIN / LOGOUT ---------- */

function showLogin(message = '') {
    if (authGate) authGate.style.display = 'grid';

    const error = getEl('loginError');
    if (error) error.textContent = message;
}

function unlockAdmin() {
    if (adminAuthenticated) return;

    adminAuthenticated = true;

    if (authGate) authGate.style.display = 'none';

    cmsLoad();
    refreshDashboardStats();
}

if (loginForm) {
    loginForm.addEventListener('submit', async event => {
        event.preventDefault();

        const button = getEl('loginSubmit');

        if (button) {
            button.disabled = true;
            button.textContent = 'Signing in…';
        }

        try {
            await authRequest('/api/auth/login', {
                method: 'POST',
                body: JSON.stringify({
                    user: getEl('adminUser')?.value || '',
                    pass: getEl('adminPass')?.value || ''
                })
            });

            if (getEl('adminPass')) {
                getEl('adminPass').value = '';
            }

            unlockAdmin();

        } catch (error) {
            showLogin(error.message);

        } finally {
            if (button) {
                button.disabled = false;
                button.textContent = 'Sign In';
            }
        }
    });
}

getEl('logoutBtn')?.addEventListener('click', async () => {
    try {
        await authRequest('/api/auth/logout', {
            method: 'POST'
        });
    } catch (error) {
        // Continue to show login screen.
    }

    adminAuthenticated = false;
    showLogin('You have been signed out.');
});

authRequest('/api/auth/session')
    .then(unlockAdmin)
    .catch(() => showLogin());

/* ---------- DASHBOARD DATE ---------- */

const dateEl = getEl('today');

if (dateEl) {
    dateEl.textContent = new Date().toLocaleDateString('en-GB', {
        day: 'numeric',
        month: 'long',
        year: 'numeric'
    });
}

/* ---------- THEME ---------- */

getEl('themeBtn')?.addEventListener('click', () => {
    document.body.classList.toggle('light');
});

/* ---------- DASHBOARD CHART ---------- */

const chartCanvas = getEl('activityChart');

if (chartCanvas && window.Chart) {
    new Chart(chartCanvas, {
        type: 'line',

        data: {
            labels: [
                'Jan', 'Feb', 'Mar', 'Apr',
                'May', 'Jun', 'Jul', 'Aug',
                'Sep', 'Oct', 'Nov', 'Dec'
            ],

            datasets: [
                {
                    label: 'Published',
                    data: [2, 2, 1, 1, 3, 3, 5, 6, 4, 3, 2, 3],
                    borderColor: '#9564c9',
                    backgroundColor: 'transparent',
                    tension: 0.35,
                    pointRadius: 0,
                    borderWidth: 1.5
                },
                {
                    label: 'Draft',
                    data: [4, 4, 2, 2, 1, 1, 1, 3, 4, 4, 3, 3],
                    borderColor: '#c4a078',
                    backgroundColor: 'transparent',
                    tension: 0.35,
                    pointRadius: 0,
                    borderWidth: 1.5
                }
            ]
        },

        options: {
            responsive: true,
            maintainAspectRatio: false,

            plugins: {
                legend: { display: false }
            },

            scales: {
                x: {
                    grid: { display: false },
                    ticks: { color: '#81796e', font: { size: 9 } }
                },

                y: {
                    min: 0,
                    max: 8,
                    ticks: {
                        stepSize: 2,
                        color: '#81796e',
                        font: { size: 9 }
                    },
                    grid: { color: '#29231d' }
                }
            }
        }
    });
}

/* ---------- CALENDAR ---------- */

let month = new Date();

function drawCalendar() {
    const calendar = getEl('calendar');
    if (!calendar) return;

    calendar.innerHTML = '';

    const label = getEl('monthLabel');

    if (label) {
        label.textContent = month.toLocaleDateString('en-US', {
            month: 'short',
            year: 'numeric'
        });
    }

    ['Su', 'Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa'].forEach(day => {
        const span = document.createElement('span');
        span.className = 'day';
        span.textContent = day;
        calendar.appendChild(span);
    });

    const firstDay = new Date(
        month.getFullYear(),
        month.getMonth(),
        1
    ).getDay();

    const totalDays = new Date(
        month.getFullYear(),
        month.getMonth() + 1,
        0
    ).getDate();

    for (let i = 0; i < firstDay; i++) {
        calendar.appendChild(document.createElement('span'));
    }

    for (let day = 1; day <= totalDays; day++) {
        const span = document.createElement('span');
        span.textContent = day;

        const today = new Date();

        if (
            day === today.getDate() &&
            month.getMonth() === today.getMonth() &&
            month.getFullYear() === today.getFullYear()
        ) {
            span.className = 'today';
        }

        calendar.appendChild(span);
    }
}

getEl('prevMonth')?.addEventListener('click', () => {
    month.setMonth(month.getMonth() - 1);
    drawCalendar();
});

getEl('nextMonth')?.addEventListener('click', () => {
    month.setMonth(month.getMonth() + 1);
    drawCalendar();
});

drawCalendar();

/* ---------- DASHBOARD TASKS ---------- */

function addTask() {
    const title = prompt('Enter new task:');

    if (!title || !title.trim()) return;

    const taskList = getEl('taskList');
    if (!taskList) return;

    const item = document.createElement('div');

    item.className = 'task';

    const heading = document.createElement('b');
    heading.textContent = title.trim();

    const description = document.createElement('small');
    description.textContent = 'New admin task';

    const footer = document.createElement('footer');
    footer.innerHTML = '<span>Today</span><span class="todo">To Do</span>';

    item.append(heading, description, footer);
    taskList.prepend(item);
}

getEl('addTask')?.addEventListener('click', addTask);
getEl('addTask2')?.addEventListener('click', addTask);

/* ---------- DASHBOARD SEARCH ---------- */

getEl('search')?.addEventListener('input', event => {
    const query = event.target.value.toLowerCase();

    document.querySelectorAll('.panel').forEach(panel => {
        panel.style.opacity =
            !query || panel.innerText.toLowerCase().includes(query)
                ? '1'
                : '.28';
    });
});

/* ==========================================
   MONGODB CMS MANAGER
   ========================================== */

/* ---------- HTML ESCAPE ---------- */

function cmsEscape(value = '') {
    return String(value).replace(/[&<>"']/g, char => ({
        '&': '&amp;',
        '<': '&lt;',
        '>': '&gt;',
        '"': '&quot;',
        "'": '&#39;'
    }[char]));
}

/* ---------- DASHBOARD COUNTS ---------- */

async function refreshDashboardStats() {
    if (!adminAuthenticated) return;

    try {
        const types = [
            'expertise',
            'blogs',
            'media',
            'enquiries',
            'pages'
        ];

        const results = await Promise.all(
            types.map(type => cmsRequest('/api/cms/' + type))
        );

        if (getEl('expertiseCount')) {
            getEl('expertiseCount').textContent = results[0].length;
        }

        if (getEl('mediaCount')) {
            getEl('mediaCount').textContent = results[2].length;
        }

        if (getEl('enquiryCount')) {
            getEl('enquiryCount').textContent = results[3].length;
        }

        if (getEl('pageCount')) {
            getEl('pageCount').textContent = results[4].length;
        }

    } catch (error) {
        console.error('Dashboard stats:', error);
    }
}

/* ---------- LOAD CMS CONTENT ---------- */

async function cmsLoad() {
    if (!adminAuthenticated || !cmsList) return;

    if (getEl('cmsTitle')) {
        getEl('cmsTitle').textContent =
            cmsNames[cmsType] + ' Manager';
    }

    cmsList.innerHTML = '<p class="muted">Loading…</p>';

    try {
        cmsItems = await cmsRequest('/api/cms/' + cmsType);

        cmsRender();

    } catch (error) {
        cmsList.innerHTML =
            '<p class="cms-empty">' +
            cmsEscape(error.message) +
            '</p>';
    }
}

/* ---------- DISPLAY CONTENT ---------- */

function cmsRender() {
    if (!cmsList) return;

    if (!cmsItems.length) {
        cmsList.innerHTML =
            '<div class="cms-empty">No ' +
            cmsEscape(cmsNames[cmsType]) +
            ' added yet. Click Add New to create your first entry.</div>';

        return;
    }

    cmsList.innerHTML = cmsItems.map(item => `
    <div class="cms-row">
      <div>
        <h4>${cmsEscape(
        item.title ||
        item.name ||
        item.label ||
        item.subject ||
        'Untitled'
    )}</h4>

        <p>${cmsEscape(
        item.shortDescription ||
        item.description ||
        item.slug ||
        item.email ||
        ''
    )}</p>

        <small>${cmsEscape(item.status || 'Saved in MongoDB')}</small>
      </div>

      <div class="cms-actions">
        <button class="cms-action" data-edit="${cmsEscape(item._id)}">
          Edit
        </button>

        <button class="cms-action" data-delete="${cmsEscape(item._id)}">
          Delete
        </button>
      </div>
    </div>
  `).join('');
}

/* ---------- FORM FIELD HELPER ---------- */

function setField(id, value) {
    const field = getEl(id);

    if (field) {
        field.value = value ?? '';
    }
}

/* ---------- OPEN PRODUCT FORM ---------- */

function openCmsForm(item = null) {
    if (!cmsModal || !cmsEditorForm) {
        cmsMessage('Product form HTML is missing. Please update admin.html.');
        return;
    }

    cmsEditingItem = item;
    cmsImageData = '';

    cmsEditorForm.reset();

    if (getEl('cmsFormTitle')) {
        getEl('cmsFormTitle').textContent =
            (item ? 'Edit ' : 'Add ') + cmsNames[cmsType];
    }

    setField('fTitle', item?.title || item?.name || item?.label || '');
    setField('fCategory', item?.category || '');
    setField('fShort', item?.shortDescription || '');
    setField('fDescription', item?.description || item?.content || '');

    setField(
        'fBenefits',
        Array.isArray(item?.benefits)
            ? item.benefits.join('\n')
            : item?.benefits || ''
    );

    setField(
        'fDosage',
        Array.isArray(item?.dosageForms)
            ? item.dosageForms.join(', ')
            : item?.dosageForms || ''
    );

    setField('fManufacturing', item?.manufacturingDetails || '');
    setField('fImageUrl', item?.image || '');
    setField('fStatus', item?.status || 'draft');
    setField('fSeoTitle', item?.seoTitle || '');

    setField(
        'fKeywords',
        Array.isArray(item?.keywords)
            ? item.keywords.join(', ')
            : item?.keywords || ''
    );

    setField('fMeta', item?.metaDescription || '');
    setField('fSlug', item?.slug || '');
    setField('fHeroTitle', item?.heroTitle || '');
    setField('fHeroSubtitle', item?.heroSubtitle || '');
    setField('fSections', item?.sections || '');

    const preview = getEl('fImagePreview');

    if (preview) {
        preview.hidden = !item?.image;
        preview.src = item?.image || '';
    }

    const productMode = cmsType === 'expertise';
    const pageMode = cmsType === 'pages';

    [
        'categoryField',
        'benefitsField',
        'dosageField',
        'manufacturingField'
    ].forEach(id => {
        const field = getEl(id);
        if (field) {
            field.style.display = productMode ? 'flex' : 'none';
        }
    });

    [
        'pageSlugField',
        'fHeroTitle',
        'fHeroSubtitle',
        'fSections'
    ].forEach(id => {
        const field = getEl(id);
        if (field) {
            const wrapper = field.closest('label');
            if (wrapper) {
                wrapper.style.display = pageMode ? 'flex' : 'none';
            }
        }
    });

    cmsModal.classList.add('open');
    cmsModal.setAttribute('aria-hidden', 'false');

    getEl('fTitle')?.focus();
}

/* ---------- CLOSE PRODUCT FORM ---------- */

function closeCmsForm() {
    if (!cmsModal) return;

    cmsModal.classList.remove('open');
    cmsModal.setAttribute('aria-hidden', 'true');

    cmsImageData = '';
    cmsEditingItem = null;
}

getEl('cmsClose')?.addEventListener('click', closeCmsForm);
getEl('cmsCancel')?.addEventListener('click', closeCmsForm);

cmsModal?.addEventListener('click', event => {
    if (event.target === cmsModal) {
        closeCmsForm();
    }
});

document.addEventListener('keydown', event => {
    if (
        event.key === 'Escape' &&
        cmsModal?.classList.contains('open')
    ) {
        closeCmsForm();
    }
});

/* ---------- IMAGE UPLOAD PREVIEW ---------- */

getEl('fImageFile')?.addEventListener('change', event => {
    const file = event.target.files[0];

    if (!file) return;

    if (!file.type.startsWith('image/')) {
        cmsMessage('Please select a valid image.');
        event.target.value = '';
        return;
    }

    if (file.size > 1024 * 1024) {
        cmsMessage('Image must be 1 MB or smaller.');
        event.target.value = '';
        return;
    }

    const reader = new FileReader();

    reader.onload = () => {
        cmsImageData = String(reader.result);

        const preview = getEl('fImagePreview');

        if (preview) {
            preview.src = cmsImageData;
            preview.hidden = false;
        }
    };

    reader.readAsDataURL(file);
});

/* ---------- ADD NEW BUTTON ---------- */

getEl('cmsAdd')?.addEventListener('click', () => {
    if (cmsType === 'enquiries') {
        cmsMessage('Enquiries cannot be added manually.');
        return;
    }

    openCmsForm();
});

/* ---------- SAVE / UPDATE CONTENT ---------- */

cmsEditorForm?.addEventListener('submit', async event => {
    event.preventDefault();

    const title = getEl('fTitle')?.value.trim();

    if (!title) {
        cmsMessage('Please enter a title.');
        return;
    }

    const image =
        cmsImageData ||
        getEl('fImageUrl')?.value.trim() ||
        '';

    const description =
        getEl('fDescription')?.value.trim() || '';

    const data = {
        title,
        name: title,
        label: title,

        category: getEl('fCategory')?.value.trim() || '',

        shortDescription:
            getEl('fShort')?.value.trim() || '',

        description,
        content: description,

        heroTitle: getEl('fHeroTitle')?.value.trim() || '',
        heroSubtitle: getEl('fHeroSubtitle')?.value.trim() || '',
        sections: getEl('fSections')?.value.trim() || '',

        benefits:
            (getEl('fBenefits')?.value || '')
                .split('\n')
                .map(value => value.trim())
                .filter(Boolean),

        dosageForms:
            (getEl('fDosage')?.value || '')
                .split(',')
                .map(value => value.trim())
                .filter(Boolean),

        manufacturingDetails:
            getEl('fManufacturing')?.value.trim() || '',

        image,

        status:
            getEl('fStatus')?.value || 'draft',

        seoTitle:
            getEl('fSeoTitle')?.value.trim() || '',

        keywords:
            (getEl('fKeywords')?.value || '')
                .split(',')
                .map(value => value.trim())
                .filter(Boolean),

        metaDescription:
            getEl('fMeta')?.value.trim() || '',

        slug:
            getEl('fSlug')?.value.trim() ||
            cmsEditingItem?.slug ||
            title.toLowerCase()
                .trim()
                .replace(/[^a-z0-9]+/g, '-')
                .replace(/(^-|-$)/g, '')
    };

    const saveButton = getEl('cmsSave');

    if (saveButton) {
        saveButton.disabled = true;
        saveButton.textContent = 'Saving…';
    }

    try {
        const editing = !!cmsEditingItem;

        const url =
            '/api/cms/' +
            cmsType +
            (editing ? '/' + cmsEditingItem._id : '');

        await cmsRequest(url, {
            method: editing ? 'PUT' : 'POST',
            body: JSON.stringify(data)
        });

        closeCmsForm();

        cmsMessage(
            editing
                ? 'Changes saved to MongoDB.'
                : 'Saved successfully to MongoDB.'
        );

        await cmsLoad();
        await refreshDashboardStats();

    } catch (error) {
        cmsMessage(error.message);

    } finally {
        if (saveButton) {
            saveButton.disabled = false;
            saveButton.textContent = 'Save to MongoDB';
        }
    }
});

/* ---------- CMS TABS ---------- */

getEl('cmsTabs')?.addEventListener('click', event => {
    const button = event.target.closest('button[data-type]');

    if (!button) return;

    document.querySelectorAll('#cmsTabs button').forEach(tab => {
        tab.classList.toggle('selected', tab === button);
    });

    cmsType = button.dataset.type;

    cmsMessage('');

    const addButton = getEl('cmsAdd');

    if (addButton) {
        addButton.style.display =
            cmsType === 'enquiries' ? 'none' : '';
    }

    cmsLoad();
});

/* ---------- EDIT / DELETE CONTENT ---------- */

cmsList?.addEventListener('click', async event => {
    const editButton = event.target.closest('[data-edit]');
    const deleteButton = event.target.closest('[data-delete]');

    try {
        if (editButton) {
            const item = cmsItems.find(
                value => value._id === editButton.dataset.edit
            );

            if (item) openCmsForm(item);
        }

        if (deleteButton) {
            const confirmed = confirm(
                'Delete this entry permanently?'
            );

            if (!confirmed) return;

            await cmsRequest(
                '/api/cms/' +
                cmsType +
                '/' +
                deleteButton.dataset.delete,
                { method: 'DELETE' }
            );

            cmsMessage('Entry deleted.');

            await cmsLoad();
            await refreshDashboardStats();
        }

    } catch (error) {
        cmsMessage(error.message);
    }
});

/* ---------- INITIAL LOAD ---------- */

if (adminAuthenticated) {
    cmsLoad();
    refreshDashboardStats();
}
