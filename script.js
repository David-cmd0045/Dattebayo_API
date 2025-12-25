
// Theme changer logic
document.addEventListener('DOMContentLoaded', function() {
    const body = document.body;
    document.getElementById('theme-light').onclick = function() {
        body.classList.remove('dark-theme', 'color-theme');
    };
    document.getElementById('theme-dark').onclick = function() {
        body.classList.add('dark-theme');
        body.classList.remove('color-theme');
    };
    document.getElementById('theme-color').onclick = function() {
        body.classList.add('color-theme');
        body.classList.remove('dark-theme');
    };
});

const API_BASE = 'https://dattebayo-api.onrender.com';

const categorySelect = document.getElementById('categorySelect');
const searchInput = document.getElementById('searchInput');


const resultsContainer = document.getElementById('results');
const loadingIndicator = document.getElementById('loading');
const errorIndicator = document.getElementById('error');
const favoritesContainer = document.getElementById('favorites');
const loadMoreBtn = document.getElementById('loadMoreBtn');

// --- PAGINATION LOGIC ---
let paginatedItems = [];
let currentPage = 1;
const PAGE_SIZE = 12;

function resetPagination() {
    currentPage = 1;
    paginatedItems = [];
}

function getCurrentPageItems(items) {
    return items.slice(0, currentPage * PAGE_SIZE);
}

function showLoadMore(items) {
    if (items.length > currentPage * PAGE_SIZE) {
        loadMoreBtn.style.display = 'inline-block';
    } else {
        loadMoreBtn.style.display = 'none';
    }
}

loadMoreBtn.onclick = function() {
    currentPage++;
    filterAndDisplay();
};

// --- FAVORITES LOGIC ---
function getFavorites() {
    return JSON.parse(localStorage.getItem('favorites') || '[]');
}

function saveFavorite(item) {
    const favorites = getFavorites();
    if (!favorites.find(f => f.id === item.id)) {
        favorites.push(item);
        localStorage.setItem('favorites', JSON.stringify(favorites));
        renderFavorites();
    }
}

function removeFavorite(id) {
    let favorites = getFavorites();
    favorites = favorites.filter(f => String(f.id) !== String(id));
    localStorage.setItem('favorites', JSON.stringify(favorites));
    renderFavorites();
}

function renderFavorites() {
    const favorites = getFavorites();
    favoritesContainer.innerHTML = favorites.length ? '<h2 style="grid-column: 1/-1;">Favorites</h2>' : '';
    favorites.forEach(item => {
        const card = document.createElement('div');
        card.className = 'card';
        card.innerHTML = `
            <img src="${item.image}" alt="${item.name}" class="card-image">
            <div class="card-name-overlay">${item.name}</div>
            <button class="remove-fav" data-id="${item.id}" style="position:absolute;top:10px;right:10px;z-index:2;">Remove</button>
        `;
        favoritesContainer.appendChild(card);
    });
    // Remove favorite event
    document.querySelectorAll('.remove-fav').forEach(btn => {
        btn.onclick = function(e) {
            e.stopPropagation();
            removeFavorite(this.dataset.id);
        };
    });
}

document.addEventListener('DOMContentLoaded', renderFavorites);

// Cache for current category data
let currentCategoryData = [];

// Modal Elements
const modal = document.getElementById('characterModal');
const modalImage = document.getElementById('modalImage');
const modalTitle = document.getElementById('modalTitle');
const modalInfo = document.getElementById('modalInfo');
const closeBtn = document.querySelector('.close-btn');

// Close Modal Event
if (closeBtn) {
    closeBtn.onclick = function() {
        modal.style.display = "none";
    }
}

window.onclick = function(event) {
    if (event.target == modal) {
        modal.style.display = "none";
    }
}

// Manual Image Overrides for missing API images
const imageOverrides = {
    "Jiraiya": "https://static.wikia.nocookie.net/naruto/images/2/21/Profile_Jiraiya.png",
    "Kurama": "https://static.wikia.nocookie.net/naruto/images/b/b8/Kurama_Part_II.png",
    "Hagoromo Ōtsutsuki": "https://static.wikia.nocookie.net/naruto/images/0/0e/Hagoromo_Otsutsuki.png",
    "Naruto Uzumaki": "https://static.wikia.nocookie.net/naruto/images/d/d6/Naruto_Part_I.png",
    "Sasuke Uchiha": "https://static.wikia.nocookie.net/naruto/images/2/21/Sasuke_Part_1.png",
    "Madara Uchiha": "https://static.wikia.nocookie.net/naruto/images/f/fd/Madara.png",
    "Kakashi Hatake": "https://static.wikia.nocookie.net/naruto/images/2/27/Kakashi_Hatake.png",
    "Orochimaru": "https://static.wikia.nocookie.net/naruto/images/1/14/Orochimaru_Infobox.png",
    "Obito Uchiha": "https://static.wikia.nocookie.net/naruto/images/4/4a/Obito_Uchiha.png",
    "Gaara": "https://static.wikia.nocookie.net/naruto/images/2/20/Gaara_in_Part_I.png",
    "Kabuto Yakushi": "https://static.wikia.nocookie.net/naruto/images/c/c9/Kabuto_Part_1.png",
    "Yamato": "https://static.wikia.nocookie.net/naruto/images/f/f7/Yamato_newshot.png",
    "Might Guy": "https://static.wikia.nocookie.net/naruto/images/3/31/Might_Guy.png",
    "Konohamaru Sarutobi": "https://static.wikia.nocookie.net/naruto/images/8/89/Konohamaru_p1.png",
    "Mitsuki": "https://static.wikia.nocookie.net/naruto/images/5/5c/Mitsuki.png",
    "Minato Namikaze": "https://static.wikia.nocookie.net/naruto/images/7/71/Minato_Namikaze.png",
    "Boruto Uzumaki": "https://static.wikia.nocookie.net/naruto/images/d/de/Boruto_Infobox.png",
    "Itachi Uchiha": "https://static.wikia.nocookie.net/naruto/images/b/bb/Itachi.png",
    "Hashirama Senju": "https://static.wikia.nocookie.net/naruto/images/7/7e/Hashirama_Senju.png",
    "Tsunade": "https://static.wikia.nocookie.net/naruto/images/b/b3/Tsunade_infobox2.png",
    "Rock Lee": "https://static.wikia.nocookie.net/naruto/images/9/97/Rock_Lee_Part_I.png",
    "Koji Kashin": "https://static.wikia.nocookie.net/naruto/images/f/f2/Koji.png",
    "Sakura Haruno": "https://static.wikia.nocookie.net/naruto/images/6/64/Sakura_Part_1.png",
    "Hinata Hyuga": "https://static.wikia.nocookie.net/naruto/images/9/97/Hinata_Part_II.png",
    "Shikamaru Nara": "https://static.wikia.nocookie.net/naruto/images/6/6b/Shikamaru_Part_II.png",
    "Ino Yamanaka": "https://static.wikia.nocookie.net/naruto/images/d/d3/Ino_Part_II.png",
    "Choji Akimichi": "https://static.wikia.nocookie.net/naruto/images/e/ec/Choji_Part_II.png"
};

// Default images for categories
const categoryDefaults = {
    "clans": "https://wallpapers.com/images/hd/anime-symbols-naruto-akatsuki-clan-collage-0n6fam4xdag244x3.jpg",
    "villages": "https://wallpapers.com/images/hd/hokage-rock-naruto-h5kpble91apym4hd.jpg",
    "kekkei-genkai": "https://wallpapers.com/images/hd/naruto-eyes-0q7rml9d9zh6sfn3.jpg",
    "teams": "https://images.wallpapersden.com/image/download/naruto-naruto-shippuden-konoha_ZmZnZ2eUmZqaraWkpJRmbmdlrWZlbWU.jpg",
    "kara": "https://static.wikia.nocookie.net/naruto/images/6/6b/Kara_Symbol.svg",
    "tailed-beasts": "https://static.wikia.nocookie.net/naruto/images/e/e8/Tailed_Beasts.png",
    "akatsuki": "https://static.wikia.nocookie.net/naruto/images/0/04/Akatsuki_Symbol.svg"
};

// Event Listeners
categorySelect.addEventListener('change', loadCategoryData);
searchInput.addEventListener('input', filterAndDisplay);

// Initial Load
document.addEventListener('DOMContentLoaded', loadCategoryData);

async function loadCategoryData() {
    const category = categorySelect.value;
    // Request a large limit to get all items. 
    resetPagination();
    // Note: Some APIs might cap the limit. If 1000 fails or returns empty, we might need to handle pagination properly.
    const url = `${API_BASE}/${category}?limit=500`;

    // UI State: Loading
    loadingIndicator.style.display = 'block';
    errorIndicator.style.display = 'none';
    resultsContainer.innerHTML = '';
    currentCategoryData = []; // Clear cache

    try {
        const response = await fetch(url);
        
        if (!response.ok) {
            throw new Error(`HTTP Error: ${response.status}`);
        }

        const data = await response.json();
        
        // The API structure varies. Sometimes it returns an array directly, 
        // sometimes an object with a key matching the category.
        let items = [];
        if (Array.isArray(data)) {
            items = data;
        } else if (data[category]) {
            items = data[category];
        } else if (data.characters) {
            // Fallback for endpoints that might return 'characters' key
            items = data.characters;
        } else if (data.items) {
             items = data.items;
        } else {
            // If we can't find the array, try to find the first array value in the object
            const keys = Object.keys(data);
            for(const key of keys) {
                if(Array.isArray(data[key])) {
                    items = data[key];
                    break;
                }
            }
        }
        
        currentCategoryData = items;
        filterAndDisplay();

    } catch (err) {
        console.error(err);
        errorIndicator.textContent = `Failed to fetch data: ${err.message}. Please try again later.`;
        errorIndicator.style.display = 'block';
    } finally {
        loadingIndicator.style.display = 'none';
    }
}

function filterAndDisplay() {
    const category = categorySelect.value;
    let items = currentCategoryData;

    // Filter if search term exists
    const searchTerm = searchInput.value.toLowerCase().trim();
    if (searchTerm) {
        items = items.filter(item => item.name.toLowerCase().includes(searchTerm));
    }

    // Pagination
    paginatedItems = getCurrentPageItems(items);
    displayResults(paginatedItems, category);
    showLoadMore(items);
}

function displayResults(items, category) {
    // Categories that should use a default image if individual images are missing
    const categoriesWithDefaults = ['clans', 'villages', 'kekkei-genkai', 'teams', 'kara', 'tailed-beasts', 'akatsuki'];
    
    // Filter logic:
    // If category is NOT in categoriesWithDefaults (e.g. 'characters'), 
    // we filter out items that don't have an image (API or Override).
    if (!categoriesWithDefaults.includes(category)) {
        items = items.filter(item => {
            const hasOverride = imageOverrides[item.name];
            const hasApiImage = item.images && item.images.length > 0;
            return hasOverride || hasApiImage;
        });
    }

    // Clear previous results
    resultsContainer.innerHTML = '';

    if (!items || items.length === 0) {
        resultsContainer.innerHTML = '<p style="grid-column: 1/-1; text-align: center;">No results found.</p>';
        resultsContainer.classList.remove('single-result');
        return;
    }

    // Check for single result to toggle layout
    if (items.length === 1) {
        resultsContainer.classList.add('single-result');
    } else {
        resultsContainer.classList.remove('single-result');
    }

    items.forEach(item => {
        const card = document.createElement('div');
        card.className = 'card';
        
        let imgHtml = '';
        let imageUrl = null;
        
        // 1. Check Overrides
        if (imageOverrides[item.name]) {
            imageUrl = imageOverrides[item.name];
        } 
        // 2. Check API Images
        else if (item.images && item.images.length > 0) {
            imageUrl = item.images[0];
        }
        // 3. Check Category Default
        else if (categoryDefaults[category]) {
            imageUrl = categoryDefaults[category];
        }
        
        if (imageUrl) {
            imgHtml = `<img src="${imageUrl}" alt="${item.name}" class="card-image" onerror="this.onerror=null; this.outerHTML='<div class='card-image placeholder'>?</div>'">`;
        } else {
            imgHtml = `<div class="card-image placeholder">?</div>`;
        }

        // Build Content based on Category
        // For the card view, we only want the name overlay, no details.
        // Details are now exclusive to the modal.
        
        card.innerHTML = `
            ${imgHtml}
            <div class="card-name-overlay">
                ${item.name}
            </div>
            <button class="add-fav" data-id="${item.id}" style="position:absolute;top:10px;right:10px;z-index:2;">Favorite</button>
        `;

        // Add Click Event for Modal
        const nonClickableCategories = ['clans', 'kekkei-genkai', 'teams', 'villages'];
        if (!nonClickableCategories.includes(category)) {
            card.addEventListener('click', () => openModal(item, category, imageUrl));
            card.style.cursor = 'pointer';
        } else {
            card.style.cursor = 'default';
        }

        // Add favorite button event
        card.querySelector('.add-fav').onclick = function(e) {
            e.stopPropagation();
            // Save minimal info for favorite
            saveFavorite({
                id: item.id,
                name: item.name,
                image: imageUrl || ''
            });
        };

        resultsContainer.appendChild(card);
    });
}

function openModal(item, category, imageUrl) {
    modalTitle.textContent = item.name;
    
    // Set Image
    if (imageUrl) {
        modalImage.src = imageUrl;
        modalImage.style.display = 'block';
        document.querySelector('.modal-image-container').style.display = 'flex';
    } else {
        modalImage.style.display = 'none';
        // Optional: hide container or show placeholder
        // document.querySelector('.modal-image-container').style.display = 'none';
        modalImage.src = ''; 
    }

    // Build Detailed Info
    let detailsHtml = '';
    
    if (category === 'characters') {
        detailsHtml = buildFullCharacterDetails(item);
    } else if (category === 'tailed-beasts') {
        detailsHtml = buildFullTailedBeastDetails(item);
    } else {
        detailsHtml = buildGenericDetails(item); // Reuse generic for now or expand
        // Add JSON dump for other properties if needed
        // detailsHtml += `<pre>${JSON.stringify(item, null, 2)}</pre>`;
    }

    modalInfo.innerHTML = detailsHtml;
    modal.style.display = "block";
}

function buildFullCharacterDetails(char) {
    let html = '';
    const p = char.personal || {};
    const f = char.family || {};
    const v = char.voiceActors || {};
    const j = char.jutsu || [];
    const n = char.natureType || [];

    // Personal Info
    html += `<div class="detail-section"><h3>Personal Info</h3>`;
    if (p.birthdate) html += `<p><strong>Birthdate:</strong> ${p.birthdate}</p>`;
    if (p.sex) html += `<p><strong>Sex:</strong> ${p.sex}</p>`;
    if (p.age) html += `<p><strong>Age:</strong> ${typeof p.age === 'object' ? Object.values(p.age).join(', ') : p.age}</p>`;
    if (p.status) html += `<p><strong>Status:</strong> ${p.status}</p>`;
    if (p.bloodType) html += `<p><strong>Blood Type:</strong> ${p.bloodType}</p>`;
    if (p.clan) html += `<p><strong>Clan:</strong> ${formatList(p.clan)}</p>`;
    if (p.affiliation) html += `<p><strong>Affiliation:</strong> ${formatList(p.affiliation)}</p>`;
    if (p.team) html += `<p><strong>Team:</strong> ${formatList(p.team)}</p>`;
    html += `</div>`;

    // Family
    if (Object.keys(f).length > 0) {
        html += `<div class="detail-section"><h3>Family</h3>`;
        for (const [relation, name] of Object.entries(f)) {
            html += `<p><strong>${relation}:</strong> ${name}</p>`;
        }
        html += `</div>`;
    }

    // Nature Type
    if (n.length > 0) {
        html += `<div class="detail-section"><h3>Nature Type</h3>`;
        n.forEach(type => {
            html += `<span class="tag">${type}</span>`;
        });
        html += `</div>`;
    }

    // Jutsu
    if (j.length > 0) {
        html += `<div class="detail-section"><h3>Jutsu</h3>`;
        // Limit to first 10 to avoid overcrowding
        const displayJutsu = j.slice(0, 15);
        displayJutsu.forEach(jutsu => {
            html += `<span class="tag">${jutsu}</span>`;
        });
        if (j.length > 15) html += `<span>...and ${j.length - 15} more</span>`;
        html += `</div>`;
    }
    
    // Voice Actors
    if (Object.keys(v).length > 0) {
        html += `<div class="detail-section"><h3>Voice Actors</h3>`;
        if (v.japanese) html += `<p><strong>Japanese:</strong> ${formatList(v.japanese)}</p>`;
        if (v.english) html += `<p><strong>English:</strong> ${formatList(v.english)}</p>`;
        html += `</div>`;
    }

    return html;
}

function buildFullTailedBeastDetails(beast) {
    let html = '';
    const p = beast.personal || {};
    const f = beast.family || {};
    
    html += `<div class="detail-section"><h3>Details</h3>`;
    if (p.classification) html += `<p><strong>Classification:</strong> ${formatList(p.classification)}</p>`;
    if (p.jinchuriki) html += `<p><strong>Jinchūriki:</strong> ${formatList(p.jinchuriki)}</p>`;
    if (beast.uniqueTraits) html += `<p><strong>Unique Traits:</strong> ${formatList(beast.uniqueTraits)}</p>`;
    html += `</div>`;
    
    if (Object.keys(f).length > 0) {
        html += `<div class="detail-section"><h3>Family</h3>`;
        for (const [relation, name] of Object.entries(f)) {
            html += `<p><strong>${relation}:</strong> ${name}</p>`;
        }
        html += `</div>`;
    }

    return html;
}


// Helper to format arrays or missing values
function formatList(list) {
    if (!list) return 'None';
    if (Array.isArray(list)) {
        return list.length > 0 ? list.join(', ') : 'None';
    }
    return list;
}

function buildCharacterDetails(char) {
    const p = char.personal || {};
    
    // Safely access nested properties
    const clan = p.clan ? formatList(p.clan) : 'Unknown';
    const village = p.affiliation ? formatList(p.affiliation) : 'Unknown';
    const team = p.team ? formatList(p.team) : 'None';
    const kg = p.kekkeiGenkai ? formatList(p.kekkeiGenkai) : 'None';
    
    return `
        <div class="card-detail"><strong>Clan:</strong> ${clan}</div>
        <div class="card-detail"><strong>Village:</strong> ${village}</div>
        <div class="card-detail"><strong>Team:</strong> ${team}</div>
        <div class="card-detail"><strong>Kekkei Genkai:</strong> ${kg}</div>
    `;
}

function buildTailedBeastDetails(beast) {
    const p = beast.personal || {};
    const jinchuriki = p.jinchuriki ? formatList(p.jinchuriki) : 'None';
    const classification = p.classification ? formatList(p.classification) : 'Unknown';
    const traits = beast.uniqueTraits ? formatList(beast.uniqueTraits) : 'None';
    
    return `
        <div class="card-detail"><strong>Classification:</strong> ${classification}</div>
        <div class="card-detail"><strong>Jinchūriki:</strong> ${jinchuriki}</div>
        <div class="card-detail"><strong>Unique Traits:</strong> ${traits}</div>
    `;
}

function buildGenericDetails(item) {
    let html = '';
    
    // If it has members/characters list
    if (item.characters && Array.isArray(item.characters)) {
        // Sometimes it's an array of objects with IDs, sometimes names. 
        // We'll try to display a count or a few names if they are strings.
        const count = item.characters.length;
        html += `<div class="card-detail"><strong>Members:</strong> ${count} registered</div>`;
    }

    // Description fallback if available directly
    if (item.description) {
            // Truncate description if too long
            const desc = item.description.length > 100 ? item.description.substring(0, 100) + '...' : item.description;
            html += `<div class="card-detail"><strong>Description:</strong> ${desc}</div>`;
    }

    return html;
}