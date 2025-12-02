async function fetchJSON(url, options = {}) {
    const res = await fetch(url, options);
    return await res.json();
}

/* FRONTEND LOAD */

async function loadPackagesFrontend() {
  const grid = document.getElementById("package-grid");
  if (!grid) return;

  try {
    const res = await fetch("get_packages.php");
    const packages = await res.json();

    if (!Array.isArray(packages) || packages.length === 0) {
      grid.innerHTML = "<p>No packages available.</p>";
      return;
    }

    grid.innerHTML = packages
      .map(
        (pkg) => `
        <div class="card">
          <div style="overflow:hidden;">
            <img src="${pkg.image}" alt="${pkg.title}">
          </div>
          <div class="card-body">
            <div style="display:flex; justify-content:space-between; align-items:center;">
              <h3>${pkg.title}</h3>
              <span class="card-price">$${pkg.price}</span>
            </div>
            <p>${(pkg.desc_text || "").substring(0, 90)}...</p>
            <a href="details.html?id=${pkg.id}" class="btn btn-primary" style="width:100%">Explore Details</a>
          </div>
        </div>
      `
      )
      .join("");
  } catch (err) {
    console.error("Error loading packages:", err);
    grid.innerHTML = "<p>Failed to load packages.</p>";
  }
}
async function loadPackageDetails() {
    const params = new URLSearchParams(window.location.search);
    const id = params.get("id");

    const container = document.getElementById("detail-container");
    const relatedContainer = document.getElementById("related-packages");

    try {
        const packages = await fetchJSON("get_packages.php");
        const pkg = packages.find(p => String(p.id) === String(id));

        if (!pkg) {
            container.innerHTML = "<p>Package not found.</p>";
            return;
        }

        // Main detail view
        container.innerHTML = `
            <div class="package-detail-view card" style="padding:0;">
                <img src="${pkg.image}" style="height:400px;width:100%;object-fit:cover">

                <div style="padding:2.5rem">
                    <div style="display:flex;justify-content:space-between;align-items:center;">
                        <h1>${pkg.title}</h1>
                        <span class="card-price">$${pkg.price}</span>
                    </div>

                    <p style="line-height:1.8;">
                        ${pkg.desc_text || pkg.description}
                    </p>

                    <hr style="margin:2rem 0">

                    <a href="booking.html?dest=${encodeURIComponent(pkg.title)}"
                        class="btn btn-primary btn-large">
                        Book This Package
                    </a>
                </div>
            </div>
        `;

        // Related packages
        const related = packages.filter(p => String(p.id) !== String(id)).slice(0,3);

        relatedContainer.innerHTML = related.map(p => `
            <div class="card">
                <img src="${p.image}">
                <div class="card-body">
                    <h3>${p.title}</h3>
                    <p class="card-price">$${p.price}</p>
                    <a href="details.html?id=${p.id}" class="btn btn-primary">View</a>
                </div>
            </div>
        `).join("");

    } catch (err) {
        console.error("Details load failed:", err);
        container.innerHTML = "<p>Failed to load package details.</p>";
    }
}


/* BOOKING */

function handleBookingSubmit(e) {
    e.preventDefault();

    let form = document.getElementById("bookingForm");

    fetch("booking.php", {
        method: "POST",
        body: new FormData(form)
    })
    .then(r => r.json())
    .then(d => {
        if(d.success){
            alert("✅ Booking saved!");
            window.location.href = "index.html";
        }else{
            alert("❌ "+d.message);
        }
    });
}

/* ADMIN */

function adminLogin(e) {
    e.preventDefault();

    const user = document.getElementById("adminUser").value;
    const pass = document.getElementById("adminPass").value;

    if (user === "admin" && pass === "admin123") {
        sessionStorage.setItem("admin_logged_in", "true");
        location.reload();   // refresh to trigger dashboard view
    } else {
        alert("❌ Invalid credentials! use admin credentials ");
    }
}
function checkSession() {
    const isLogged = sessionStorage.getItem("admin_logged_in");

    const login = document.getElementById("login-section");
    const dash  = document.getElementById("dashboard-section");

    if (!login || !dash) return;

    if (isLogged) {
        login.classList.add("hidden");
        dash.classList.remove("hidden");
        loadAdminData();
    } else {
        login.classList.remove("hidden");
        dash.classList.add("hidden");
    }
}
function showTab(tabId) {

    // hide all tab contents
    document.querySelectorAll(".admin-tab-content")
        .forEach(tab => tab.classList.add("hidden"));

    // remove active state
    document.querySelectorAll(".admin-tab-btn")
        .forEach(btn => btn.classList.remove("active"));

    // show selected tab
    document.getElementById(tabId).classList.remove("hidden");

    // highlight active button
    event.target.classList.add("active");
}



async function loadAdminData() {

    const packages = await fetchJSON("get_packages.php");
    const bookings = await fetchJSON("get_bookings.php");

    /* packages table */
    document.querySelector("#packagesTable tbody").innerHTML =
    packages.map(p => `
        <tr>
            <td>${p.title}</td>
            <td>$${p.price}</td>
            <td><button onclick="deletePackage(${p.id})">Delete</button></td>
            <td><button onclick="openEdit(${p.id})">Edit</button></td>
        </tr>
    `).join("");

    /* bookings table */
    document.querySelector("#bookingsTable tbody").innerHTML =
    bookings.map(b => `
        <tr>
            <td>${b.name}</td>
            <td>${b.destination}</td>
            <td>${b.travel_date}</td>
            <td>${b.phone}</td>
        </tr>
    `).join("");
}

async function addPackage(e) {
    e.preventDefault();

    let fd = new FormData();

    fd.append("title", pkgTitle.value);
    fd.append("image", pkgImage.value);
    fd.append("price", pkgPrice.value);
    fd.append("description", pkgDesc.value);

    // EDIT MODE or ADD MODE
    const editId = e.target.dataset.editId;

    if (editId) fd.append("id", editId);

    const url = editId ? "edit_package.php" : "add_package.php";

    let res = await fetchJSON(url, {
        method: "POST",
        body: fd
    });

    if(res.success){
        alert(editId ? "✅ Package Updated" : "✅ Package Added");
        e.target.reset();
        delete e.target.dataset.editId;
        loadAdminData();
    }
}


async function deletePackage(id){
    let fd = new FormData();
    fd.append("id", id);

    await fetchJSON("delete_package.php", {
        method: "POST",
        body: fd
    });

    loadAdminData();
}
function logoutAdmin() {
    sessionStorage.removeItem("admin_logged_in");
    window.location.href = "admin.html";
}
async function openEdit(id) {

    const res = await fetchJSON("get_packages.php");
    const pkg = res.find(p => String(p.id) === String(id));

    document.getElementById("pkgTitle").value = pkg.title;
    document.getElementById("pkgImage").value = pkg.image;
    document.getElementById("pkgPrice").value = pkg.price;
    document.getElementById("pkgDesc").value = pkg.desc_text || pkg.description;

    // switch form to UPDATE mode
    document.querySelector("form").dataset.editId = id;
}
