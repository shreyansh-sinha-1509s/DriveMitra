const API_BASE = "https://drivemitra-1.onrender.com/api";

const PROTECTED_PAGES = ["dashboard.html", "slip.html", "route.html"];

function currentPage() {
  return window.location.pathname.split("/").pop() || "index.html";
}

document.addEventListener("DOMContentLoaded", () => {
  loadTheme();
  autoFillFeedbackFromUrl();
  setupAuthUI();
  protectPage();
  prefillDriverDetails();
  loadDashboard();
  loadTrafficStatus();
});

/* ---------------- THEME ---------------- */

function toggleTheme() {
  document.body.classList.toggle("dark-theme");
  const isDark = document.body.classList.contains("dark-theme");
  localStorage.setItem("theme", isDark ? "dark" : "light");

  const icon = document.getElementById("themeIcon");
  if (icon) icon.textContent = isDark ? "☀️" : "🌙";
}

function loadTheme() {
  const savedTheme = localStorage.getItem("theme");
  const icon = document.getElementById("themeIcon");

  if (savedTheme === "dark") {
    document.body.classList.add("dark-theme");
    if (icon) icon.textContent = "☀️";
  } else {
    document.body.classList.remove("dark-theme");
    if (icon) icon.textContent = "🌙";
  }
}

/* ---------------- AUTH ---------------- */

function isLoggedIn() {
  return !!(localStorage.getItem("driverName") && localStorage.getItem("vehicleNo"));
}

function setFormMessage(message, isError = true) {
  const box = document.getElementById("formMessage");
  if (!box) {
    alert(message);
    return;
  }

  box.textContent = message;
  box.className = isError ? "form-message error" : "form-message success";
}

function clearFormMessage() {
  const box = document.getElementById("formMessage");
  if (!box) return;
  box.textContent = "";
  box.className = "form-message";
}

function logout() {
  localStorage.removeItem("driverName");
  localStorage.removeItem("vehicleNo");
  localStorage.removeItem("mobileNo");
  window.location.href = "index.html";
}

function setupAuthUI() {
  const authLink = document.getElementById("authLink");
  if (authLink) {
    if (isLoggedIn()) {
      authLink.textContent = "Logout";
      authLink.href = "#";
      authLink.onclick = (event) => {
        event.preventDefault();
        logout();
      };
    } else {
      authLink.textContent = "Login / Signup";
      authLink.href = "login.html";
      authLink.onclick = null;
    }
  }

  if (isLoggedIn() && ["login.html", "register.html"].includes(currentPage())) {
    window.location.href = "dashboard.html";
  }
}

function protectPage() {
  if (PROTECTED_PAGES.includes(currentPage()) && !isLoggedIn()) {
    alert("Please login first to access this page");
    window.location.href = "login.html";
  }
}

function prefillDriverDetails() {
  const name = localStorage.getItem("driverName") || "";
  const vehicle = localStorage.getItem("vehicleNo") || "";

  const driverNameInput = document.getElementById("driverName");
  const vehicleNumberInput = document.getElementById("vehicleNumber");

  if (driverNameInput && !driverNameInput.value) driverNameInput.value = name;
  if (vehicleNumberInput && !vehicleNumberInput.value) vehicleNumberInput.value = vehicle;
}

async function login() {
  clearFormMessage();

  const name = document.getElementById("name")?.value.trim();
  const vehicleNumber = document.getElementById("vehicle")?.value.trim();

  if (!name || !vehicleNumber) {
    setFormMessage("Please enter both name and vehicle number");
    return;
  }

  try {
    const res = await fetch(`${API_BASE}/drivers/login`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({ name, vehicleNumber })
    });

    const data = await res.json();

    if (!res.ok) {
      setFormMessage(data.message || "Login failed");
      return;
    }

    localStorage.setItem("driverName", data.name);
    localStorage.setItem("vehicleNo", data.vehicleNumber);
    if (data.mobile) localStorage.setItem("mobileNo", data.mobile);

    setFormMessage("Login successful", false);
    window.location.href = "dashboard.html";
  } catch (error) {
    setFormMessage("Server not running or backend connection failed");
    console.error(error);
  }
}

async function register() {
  clearFormMessage();

  const name = document.getElementById("name")?.value.trim();
  const vehicleNumber = document.getElementById("vehicle")?.value.trim();
  const mobile = document.getElementById("mobile")?.value.trim();

  if (!name || !vehicleNumber || !mobile) {
    setFormMessage("Please enter name, vehicle number and mobile number");
    return;
  }

  try {
    const res = await fetch(`${API_BASE}/drivers/register`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({ name, vehicleNumber, mobile })
    });

    const data = await res.json();

    if (!res.ok) {
      setFormMessage(data.message || "Registration failed");
      return;
    }

    localStorage.setItem("driverName", data.name);
    localStorage.setItem("vehicleNo", data.vehicleNumber);
    localStorage.setItem("mobileNo", data.mobile);

    setFormMessage("Registration successful", false);
    window.location.href = "dashboard.html";
  } catch (error) {
    setFormMessage("Server not running or backend connection failed");
    console.error(error);
  }
}

/* ---------------- SLIP GENERATION ---------------- */

async function generateSlip() {
  const driverName = document.getElementById("driverName").value.trim();
  const vehicleNumber = document.getElementById("vehicleNumber").value.trim();
  const customerName = document.getElementById("customerName").value.trim();
  const itemType = document.getElementById("itemType").value.trim();
  const quantity = document.getElementById("quantity").value.trim();
  const location = document.getElementById("location").value.trim();

  if (!driverName || !vehicleNumber || !customerName || !itemType || !quantity || !location) {
    alert("Please fill all slip details");
    return;
  }

  try {
    const res = await fetch(`${API_BASE}/slips`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        driverName,
        vehicleNumber,
        customerName,
        itemType,
        quantity,
        location
      })
    });

    const data = await res.json();

    if (!res.ok) {
      alert(data.message || "Slip generation failed");
      return;
    }

    const slipResult = document.getElementById("slipResult");
    if (slipResult) {
      slipResult.innerHTML = `
        <h3>Slip Generated Successfully</h3>
        <p><strong>Slip ID:</strong> ${data.slipId}</p>
        <p><strong>Driver:</strong> ${data.driverName}</p>
        <p><strong>Vehicle:</strong> ${data.vehicleNumber}</p>
        <p><strong>Customer:</strong> ${data.customerName}</p>
        <p><strong>Item:</strong> ${data.itemType}</p>
        <p><strong>Quantity:</strong> ${data.quantity}</p>
        <p><strong>Location:</strong> ${data.location}</p>
      `;
    }

    const qrTarget = document.getElementById("qrCode");
    if (qrTarget) {
      qrTarget.innerHTML = "";
      const feedbackUrl = `${window.location.origin}${window.location.pathname.replace("slip.html", "feedback.html")}?slipId=${data.slipId}`;
      new QRCode(qrTarget, {
        text: feedbackUrl,
        width: 180,
        height: 180
      });
    }
  } catch (error) {
    alert("Server not running or backend connection failed");
    console.error(error);
  }
}

/* ---------------- FEEDBACK ---------------- */

function autoFillFeedbackFromUrl() {
  const params = new URLSearchParams(window.location.search);
  const slipId = params.get("slipId");

  if (slipId && document.getElementById("slipId")) {
    document.getElementById("slipId").value = slipId;
  }
}

async function submitFeedback() {
  const slipId = document.getElementById("slipId").value.trim();
  const customerName = document.getElementById("customerNameFb").value.trim();
  const customerLocation = document.getElementById("customerLocation").value.trim();
  const driverName = document.getElementById("driverNameFb").value.trim();
  const itemType = document.getElementById("itemDelivered").value.trim();
  const quantity = document.getElementById("quantityFb").value.trim();
  const comment = document.getElementById("comment").value.trim();

  const ratingInput = document.querySelector('input[name="rating"]:checked');
  const rating = ratingInput ? Number(ratingInput.value) : 0;

  if (!slipId || !customerName || !customerLocation || !driverName || !itemType || !quantity || !rating) {
    alert("Please fill all feedback details");
    return;
  }

  try {
    const res = await fetch(`${API_BASE}/feedback`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        slipId,
        customerName,
        customerLocation,
        driverName,
        itemType,
        quantity,
        rating,
        comment
      })
    });

    const data = await res.json();

    if (!res.ok) {
      alert(data.message || "Feedback submit failed");
      return;
    }

    alert("Feedback submitted successfully");
    window.location.reload();
  } catch (error) {
    alert("Server not running or backend connection failed");
    console.error(error);
  }
}

/* ---------------- TRAFFIC ---------------- */

async function submitTrafficUpdate() {
  const routeName = document.getElementById("routeName").value.trim();
  const status = document.getElementById("trafficUpdate").value;
  const reportedBy = localStorage.getItem("driverName") || "Anonymous Driver";

  if (!routeName || !status) {
    alert("Please select route and status");
    return;
  }

  try {
    const res = await fetch(`${API_BASE}/traffic`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({ routeName, status, reportedBy })
    });

    const data = await res.json();

    if (!res.ok) {
      alert(data.message || "Traffic update failed");
      return;
    }

    const trafficStatus = document.getElementById("trafficStatus");
    if (trafficStatus) {
      trafficStatus.innerHTML = `
        <strong>Latest Update:</strong> ${data.status}<br>
        <strong>Reported By:</strong> ${data.reportedBy}
      `;
    }

    alert("Traffic update submitted");
  } catch (error) {
    alert("Server not running or backend connection failed");
    console.error(error);
  }
}

async function loadTrafficStatus() {
  const routeField = document.getElementById("routeName");
  const trafficStatus = document.getElementById("trafficStatus");

  if (!routeField || !trafficStatus) return;

  routeField.addEventListener("change", async () => {
    const routeName = routeField.value.trim();
    if (!routeName) return;

    try {
      const res = await fetch(`${API_BASE}/traffic/latest/${encodeURIComponent(routeName)}`);
      const data = await res.json();

      if (data && data.status) {
        trafficStatus.innerHTML = `
          <strong>Latest Update:</strong> ${data.status}<br>
          <strong>Reported By:</strong> ${data.reportedBy}
        `;
      } else {
        trafficStatus.innerHTML = "No updates yet for this route";
      }
    } catch (error) {
      trafficStatus.innerHTML = "Unable to load traffic updates";
    }
  });
}

/* ---------------- DASHBOARD ---------------- */

async function loadDashboard() {
  const driverName = localStorage.getItem("driverName");
  const vehicleNo = localStorage.getItem("vehicleNo");

  const driverInfo = document.getElementById("driverInfo");
  if (driverInfo && driverName && vehicleNo) {
    driverInfo.textContent = `${driverName} (${vehicleNo})`;
  }

  if (!driverName || !vehicleNo) return;

  try {
    const slipRes = await fetch(`${API_BASE}/slips/driver/${encodeURIComponent(vehicleNo)}`);
    const slips = await slipRes.json();

    const feedbackRes = await fetch(`${API_BASE}/feedback/driver/${encodeURIComponent(driverName)}`);
    const feedbacks = await feedbackRes.json();

    const totalSlips = document.getElementById("totalSlips");
    const averageRating = document.getElementById("averageRating");
    const recentFeedback = document.getElementById("recentFeedback");

    if (totalSlips) totalSlips.textContent = Array.isArray(slips) ? slips.length : 0;

    if (averageRating) {
      if (Array.isArray(feedbacks) && feedbacks.length > 0) {
        const sum = feedbacks.reduce((acc, item) => acc + Number(item.rating || 0), 0);
        averageRating.textContent = (sum / feedbacks.length).toFixed(1);
      } else {
        averageRating.textContent = "0.0";
      }
    }

    if (recentFeedback) {
      if (Array.isArray(feedbacks) && feedbacks.length > 0) {
        recentFeedback.innerHTML = feedbacks
          .slice(0, 3)
          .map(
            (f) => `
              <div class="feedback-item">
                <strong>${f.customerName}</strong> - ${f.rating}⭐<br>
                <small>${f.itemType}, Qty: ${f.quantity}</small><br>
                <small>${f.comment || "No comment"}</small>
              </div>
            `
          )
          .join("");
      } else {
        recentFeedback.textContent = "No feedback yet";
      }
    }
  } catch (error) {
    console.error(error);
  }
}
