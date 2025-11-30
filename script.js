// --- MOCK DATABASE INITIALIZATION ---
if (!localStorage.getItem("packages")) {
  const initialPackages = [
    {
      id: 1,
      title: "Paris Getaway",
      price: 1200,
      image: "https://via.placeholder.com/400x300?text=Paris",
      desc: "Experience 5 magical days in the City of Light. This package includes 4-star hotel accommodations in the heart of Paris, guided tours of iconic landmarks including the Eiffel Tower and Louvre Museum, fine dining experiences, and river cruises along the Seine.",
    },
    {
      id: 2,
      title: "Bali Beach Retreat",
      price: 800,
      image: "https://via.placeholder.com/400x300?text=Bali",
      desc: "Escape to paradise with 7 days in Bali. Relax on pristine sandy beaches, enjoy luxury spa treatments, explore ancient temples, visit rice terraces, and experience vibrant local culture. All-inclusive package with beachfront resort stay.",
    },
    {
      id: 3,
      title: "Swiss Alps Hiking",
      price: 1500,
      image: "https://via.placeholder.com/400x300?text=Alps",
      desc: "Adventure seekers, rejoice! 6 days of guided hiking through breathtaking mountain scenery. Includes stays in charming alpine lodges, expert mountain guides, meals featuring local Swiss cuisine, and unforgettable views at every turn.",
    },
  ]
  localStorage.setItem("packages", JSON.stringify(initialPackages))
}

if (!localStorage.getItem("bookings")) {
  localStorage.setItem("bookings", JSON.stringify([]))
}

// --- FRONTEND FUNCTIONS ---

function loadPackagesFrontend() {
  const packages = JSON.parse(localStorage.getItem("packages"))
  const grid = document.getElementById("package-grid")

  if (grid) {
    grid.innerHTML = packages
      .map(
        (pkg) => `
            <div class="card">
                <img src="${pkg.image}" alt="${pkg.title}">
                <div class="card-body">
                    <h3>${pkg.title}</h3>
                    <p class="card-price">$${pkg.price}</p>
                    <p>${pkg.desc.substring(0, 100)}...</p>
                    <a href="details.html?id=${pkg.id}" class="btn btn-primary">View Details</a>
                </div>
            </div>
        `,
      )
      .join("")
  }
}

function loadPackageDetails() {
  const params = new URLSearchParams(window.location.search)
  const id = params.get("id")
  const packages = JSON.parse(localStorage.getItem("packages"))
  const pkg = packages.find((p) => p.id == id)

  const container = document.getElementById("detail-container")

  if (pkg) {
    container.innerHTML = `
            <div class="package-detail-view">
                <h1>${pkg.title}</h1>
                <img src="${pkg.image}" alt="${pkg.title}">
                <h2>$${pkg.price}</h2>
                <p>${pkg.desc}</p>
                <br>
                <a href="booking.html?dest=${encodeURIComponent(pkg.title)}" class="btn btn-primary btn-large">Book This Package</a>
            </div>
        `
  } else {
    container.innerHTML = '<div class="form-wrapper"><p>Package not found.</p></div>'
  }
}

function handleBookingSubmit(e) {
  e.preventDefault()

  const formData = {
    id: Date.now(),
    destination: document.getElementById("destination").value,
    name: document.getElementById("name").value,
    email: document.getElementById("email").value,
    phone: document.getElementById("phone").value,
    date: document.getElementById("date").value,
    persons: document.getElementById("persons").value,
    message: document.getElementById("message").value,
  }

  const bookings = JSON.parse(localStorage.getItem("bookings"))
  bookings.push(formData)
  localStorage.setItem("bookings", JSON.stringify(bookings))

  alert("✅ Booking Enquiry Sent Successfully! We will contact you soon.")
  window.location.href = "index.html"
}

// --- ADMIN FUNCTIONS ---

function adminLogin(e) {
  e.preventDefault()
  const user = document.getElementById("adminUser").value
  const pass = document.getElementById("adminPass").value

  if (user === "admin" && pass === "admin123") {
    sessionStorage.setItem("admin_logged_in", "true")
    checkSession()
  } else {
    alert("❌ Invalid Credentials!")
  }
}

function checkSession() {
  const isLoggedIn = sessionStorage.getItem("admin_logged_in")
  const loginSec = document.getElementById("login-section")
  const dashSec = document.getElementById("dashboard-section")

  if (loginSec && dashSec) {
    if (isLoggedIn) {
      loginSec.classList.add("hidden")
      dashSec.classList.remove("hidden")
      loadAdminData()
    } else {
      loginSec.classList.remove("hidden")
      dashSec.classList.add("hidden")
    }
  }
}

function logoutAdmin() {
  sessionStorage.removeItem("admin_logged_in")
  window.location.href = "admin.html"
}

function showTab(tabId) {
  document.querySelectorAll(".admin-tab-content").forEach((el) => el.classList.add("hidden"))
  document.getElementById(tabId).classList.remove("hidden")

  document.querySelectorAll(".admin-tab-btn").forEach((btn) => btn.classList.remove("active"))
  event.target.classList.add("active")
}

function loadAdminData() {
  const packages = JSON.parse(localStorage.getItem("packages"))
  const pkgTable = document.querySelector("#packagesTable tbody")
  pkgTable.innerHTML = packages
    .map(
      (pkg) => `
        <tr>
            <td>${pkg.title}</td>
            <td>$${pkg.price}</td>
            <td><button onclick="deletePackage(${pkg.id})">Delete</button></td>
        </tr>
    `,
    )
    .join("")

  const bookings = JSON.parse(localStorage.getItem("bookings"))
  const bookTable = document.querySelector("#bookingsTable tbody")
  bookTable.innerHTML = bookings
    .map(
      (b) => `
        <tr>
            <td>${b.name}</td>
            <td>${b.destination}</td>
            <td>${b.date}</td>
            <td>${b.phone}</td>
        </tr>
    `,
    )
    .join("")
}

function addPackage(e) {
  e.preventDefault()
  const packages = JSON.parse(localStorage.getItem("packages"))

  const newPkg = {
    id: Date.now(),
    title: document.getElementById("pkgTitle").value,
    image: document.getElementById("pkgImage").value,
    price: document.getElementById("pkgPrice").value,
    desc: document.getElementById("pkgDesc").value,
  }

  packages.push(newPkg)
  localStorage.setItem("packages", JSON.stringify(packages))
  e.target.reset()
  loadAdminData()
  alert("✅ Package Added!")
}

function deletePackage(id) {
  if (confirm("Are you sure you want to delete this package?")) {
    let packages = JSON.parse(localStorage.getItem("packages"))
    packages = packages.filter((p) => p.id !== id)
    localStorage.setItem("packages", JSON.stringify(packages))
    loadAdminData()
    alert("✅ Package Deleted!")
  }
}
