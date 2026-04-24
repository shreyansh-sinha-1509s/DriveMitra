const API_BASE = "http://localhost:3000/api";

document.addEventListener("DOMContentLoaded", () => {
  const slipForm = document.getElementById("slipForm");
  const slipResult = document.getElementById("slipResult");
  const qrContainer = document.getElementById("qrcode");

  // If page opened through QR like slip.html?id=SLIP-123
  const params = new URLSearchParams(window.location.search);
  const slipIdFromUrl = params.get("id");

  if (slipIdFromUrl) {
    fetchSlipById(slipIdFromUrl);
  }

  if (slipForm) {
    slipForm.addEventListener("submit", async (e) => {
      e.preventDefault();

      const driverName = document.getElementById("driverName")?.value.trim();
      const vehicleNumber = document.getElementById("vehicleNumber")?.value.trim();
      const customerName = document.getElementById("customerName")?.value.trim();
      const itemType = document.getElementById("itemType")?.value.trim();
      const quantity = document.getElementById("quantity")?.value.trim();
      const location = document.getElementById("location")?.value.trim();

      if (!driverName || !vehicleNumber || !customerName || !itemType || !quantity || !location) {
        showMessage("Please fill all fields.", "red");
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
          showMessage(data.message || "Slip generation failed.", "red");
          return;
        }

        renderSlip(data);
      } catch (error) {
        console.error(error);
        showMessage("Server not running or backend connection failed.", "red");
      }
    });
  }

  async function fetchSlipById(slipId) {
    try {
      const res = await fetch(`${API_BASE}/slips/${encodeURIComponent(slipId)}`);
      const data = await res.json();

      if (!res.ok) {
        showMessage(data.message || "Slip not found.", "red");
        return;
      }

      renderSlip(data);
    } catch (error) {
      console.error(error);
      showMessage("Unable to open slip from QR.", "red");
    }
  }

  function renderSlip(data) {
    if (!slipResult) return;

    const {
      slipId,
      driverName,
      vehicleNumber,
      customerName,
      itemType,
      quantity,
      location
    } = data;

    slipResult.innerHTML = `
      <h2>Slip Generated Successfully</h2>
      <p><strong>Slip ID:</strong> ${slipId}</p>
      <p><strong>Driver:</strong> ${driverName}</p>
      <p><strong>Vehicle:</strong> ${vehicleNumber}</p>
      <p><strong>Customer:</strong> ${customerName}</p>
      <p><strong>Item:</strong> ${itemType}</p>
      <p><strong>Quantity:</strong> ${quantity}</p>
      <p><strong>Location:</strong> ${location}</p>
      <div id="qrcode"></div>
    `;

    const qrDiv = document.getElementById("qrcode");
    qrDiv.innerHTML = "";

    // Makes QR point to current site origin automatically
    const qrUrl = `${window.location.origin}/slip.html?id=${encodeURIComponent(slipId)}`;

    new QRCode(qrDiv, {
      text: qrUrl,
      width: 220,
      height: 220
    });
  }

  function showMessage(message, color) {
    if (slipResult) {
      slipResult.innerHTML = `<p style="color:${color}; font-weight:bold;">${message}</p>`;
    }
  }
});