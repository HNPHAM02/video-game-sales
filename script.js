const api = "https://video-game-sales-production.up.railway.app";

// -------------------------------
// GLOBAL VARIABLES
// -------------------------------
const region = document.getElementById("region");
const platform = document.getElementById("platform");
const genre = document.getElementById("genre");
const update = document.getElementById("updates");

let salesChart;
let selectedGames = [];

let page = 1;
let limit = 50;
let sort = "sales";
let order = "DESC";

// -------------------------------
// API HELPER
// -------------------------------
async function getJSON(url) {
    const res = await fetch(url);
    return res.json();
}

// -------------------------------
// LOAD FILTERS
// -------------------------------
async function loadFilters() {
    // Regions
    const regionList = ["NA", "EU", "JP", "Other"];
    regionList.forEach(r => {
        region.innerHTML += `<option value="${r}">${r}</option>`;
    });

    // Genres
    const genres = ["Action","Sports","Misc","Role-Playing","Shooter",
                    "Simulation","Racing","Fighting","Adventure",
                    "Platform","Puzzle","Strategy"];

    genre.innerHTML += genres.map(g =>
        `<option value="${g}">${g}</option>`
    ).join("");

    // Platforms (TomSelect)
    const platforms = await getJSON(`${api}/platforms`);
    new TomSelect("#platform", {
        options: platforms.map(p => ({ value: p, text: p })),
        maxItems: 1,
        create: false
    });
}

// -------------------------------
// LOAD GAME TABLE (PAGINATED)
// -------------------------------
async function loadGames() {
    const search = document.getElementById("search").value;

    const params = new URLSearchParams({
        page,
        limit,
        sort,
        order,
        search
    });

    const res = await getJSON(`${api}/games?${params.toString()}`);

    const tbody = document.querySelector("#gamesTable tbody");
    tbody.innerHTML = "";

    res.data.forEach(game => {
        const tr = document.createElement("tr");
        tr.innerHTML = `
          <td>${game.name}</td>
          <td>${game.platform}</td>
          <td>${game.genre}</td>
          <td>${game.sales.toFixed(2)}</td>
          <td>
            <button class="addBtn"
              data-name="${game.name}"
              data-sales="${game.sales}">
              + Chart
            </button>
          </td>
        `;
        tbody.appendChild(tr);
    });

    const totalPages = Math.ceil(res.total / limit);
    document.getElementById("pageInfo").textContent =
        `Page ${page} of ${totalPages}`;

    document.getElementById("prevPage").disabled = page <= 1;
    document.getElementById("nextPage").disabled = page >= totalPages;
}

// -------------------------------
// LOAD INITIAL DASHBOARD SALES
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
// RENDER CHART
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
                data: data.map(d => d.sales),
                backgroundColor: "rgba(54, 162, 235, 0.6)"
            }]
        },
        options: {
            responsive: true,
            plugins: {
                legend: {
                    onClick: (evt, item) => {
                        selectedGames.splice(item.index, 1);
                        renderChart(selectedGames);
                    }
                }
            },
            scales: {
                y: { beginAtZero: true }
            }
        }
    });
}

// -------------------------------
// ADD TO CHART
// -------------------------------
document.addEventListener("click", (event) => {
    if (event.target.classList.contains("addBtn")) {
        const name = event.target.dataset.name;
        const sales = parseFloat(event.target.dataset.sales);

        selectedGames.push({ name, sales });
        renderChart(selectedGames);
    }
});

// -------------------------------
// SORTING
// -------------------------------
document.querySelectorAll("#gamesTable th[data-sort]").forEach(th => {
    th.addEventListener("click", () => {
        const s = th.dataset.sort;

        if (sort === s) {
            order = order === "ASC" ? "DESC" : "ASC";
        } else {
            sort = s;
            order = "ASC";
        }

        page = 1;
        loadGames();
    });
});

// -------------------------------
// PAGINATION BUTTONS
// -------------------------------
document.getElementById("prevPage").onclick = () => {
    if (page > 1) {
        page--;
        loadGames();
    }
};

document.getElementById("nextPage").onclick = () => {
    page++;
    loadGames();
};

// -------------------------------
// SEARCH FUNCTIONALITY
// -------------------------------
document.getElementById("search").addEventListener("input", () => {
    page = 1;
    loadGames();
});

// -------------------------------
// INITIALIZATION
// -------------------------------
window.onload = async () => {
    await loadFilters();
    await loadGames();

    const initial = await loadSalesData();
    selectedGames = initial.map(d => ({
        name: d.name,
        sales: d.sales
    }));

    renderChart(selectedGames);
};

update.addEventListener("click", async () => {
    const updated = await loadSalesData();
    selectedGames = updated.map(d => ({
        name: d.name,
        sales: d.sales
    }));
    renderChart(selectedGames);
});
