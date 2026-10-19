
const URL_APPS_SCRIPT = "https://script.google.com/macros/s/AKfycbxIXeQ9hKeGVoCidgr7DiHg7j8mllGADoweY1ZYyHJ3S7Gm5qjon5EKEp9Fhkn1WYHNAw/exec";

const form = document.getElementById("search-form");
const input = document.getElementById("member-name");
const result = document.getElementById("result");
const clearButton = document.getElementById("clear-button");

function tampilkanHasil(data, nama) {
  result.hidden = false;
  result.className = "result " + (data.ditemukan ? "success" : "failure");

  const judul = data.ditemukan ? "TERDAFTAR" : "TIDAK TERDAFTAR";
  const namaHasil = data.ditemukan ? data.nama : nama;
  const aman = String(namaHasil).replace(/[&<>"']/g, karakter => ({
    "&": "&amp;", "<": "&lt;", ">": "&gt;",
    '"': "&quot;", "'": "&#39;"
  })[karakter]);

  result.innerHTML = `
    <div class="result-title">${judul}</div>
    <div class="result-name"><strong>Nama:</strong> ${aman}</div>
    <div class="result-caption">${
      data.ditemukan
        ? "Nama ditemukan dalam data anggota."
        : "Nama tidak ditemukan dalam data anggota."
    }</div>`;
}

form.addEventListener("submit", function(event) {
  event.preventDefault();

  const nama = input.value.trim().replace(/\s+/g, " ");
  if (!nama) return;

  result.hidden = false;
  result.className = "result";
  result.textContent = "Sedang memeriksa data...";

  const callback = "hasilCekAnggota";
  const parameter = new URLSearchParams({
    nama: nama,
    callback: callback
  });

  const script = document.createElement("script");
  script.src = URL_APPS_SCRIPT + "?" + parameter.toString();

  window[callback] = function(data) {
    tampilkanHasil(data, nama);
    delete window[callback];
    script.remove();
  };

  script.onerror = function() {
    result.hidden = false;
    result.className = "result failure";
    result.textContent =
      "Data gagal diperiksa. Periksa URL dan penerapan aplikasi.";
    delete window[callback];
    script.remove();
  };

  document.body.appendChild(script);
});

input.addEventListener("input", function() {
  clearButton.hidden = input.value.length === 0;
});

clearButton.addEventListener("click", function() {
  input.value = "";
  result.hidden = true;
  clearButton.hidden = true;
  input.focus();
});
