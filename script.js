const api = "https://video-game-sales-production.up.railway.app/";

// -------------------------------
// HTML ELEMENTS
// -------------------------------
const region = document.getElementById("region");
const platform = document.getElementById("platform");
const genre = document.getElementById("genre");
const update = document.getElementById("updates");

let salesChart;

// -------------------------------
// API HELPERS
// -------------------------------
async function getJSON(url) {
    const response = await fetch(url);
    return response.json();
}

// -------------------------------
// POPULATE FILTERS (DROPDOWNS + AUTOFILL)
// -------------------------------
async function loadFilters() {

    // ---- Regions dropdown ----
    const regionList = ["NA", "EU", "JP", "Other"];
    regionList.forEach(r => {
        region.innerHTML += `<option value="${r}">${r}</option>`;
    });

    // ---- Genres dropdown ----
    const genres = ["Action", "Sports", "Misc", "Role-Playing", "Shooter", "Simulation", "Racing", "Fighting", "Adventure", "Platform", "Puzzle", "Strategy"];
    genre.innerHTML += genres.map(g =>
        `<option value="${g}">${g}</option>`
    ).join("");

    // ---- Platforms autocomplete ----
    const platforms = await getJSON(`${api}/platforms`);

    new TomSelect("#platform", {
        options: platforms.map(p => ({ value: p, text: p })),
        maxItems: 1,
        create: false
    });
}

// -------------------------------
// FETCH SALES DATA FOR CHART
// -------------------------------
async function loadSalesData() {
    const params = new URLSearchParams({
        region: region.value,
        platform: platform.value,
        genre: genre.value,
    });

    return await getJSON(`${api}/sales?${params.toString()}`);
}

// -------------------------------
// CHART CREATION
// -------------------------------
function renderChart(data) {
    const ctx = document.getElementById("salesChart");

    if (salesChart) salesChart.destroy();

    salesChart = new Chart(ctx, {
        type: "bar",
        data: {
            labels: data.map(d => d.name),
            datasets: [{
                label: "Sales",
                data: data.map(d => d.salesValue),
                backgroundColor: "rgba(54, 162, 235, 0.6)"
            }]
        },
        options: {
            responsive: true,
            scales: {
                y: { beginAtZero: true }
            }
        }
    });
}

// -------------------------------
// HANDLE UPDATE BUTTON
// -------------------------------
async function updateDashboard() {
    const data = await loadSalesData();
    renderChart(data);
}

// -------------------------------
// ON LOAD
// -------------------------------
window.onload = async () => {
    await loadFilters();
    updateDashboard(); // initial
};

update.addEventListener("click", updateDashboard);
