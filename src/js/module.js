document.addEventListener("DOMContentLoaded", function () {
  const body = document.querySelector("body"),
    sidebar = body.querySelector("nav"),
    toggle = body.querySelector(".toggle"),
    modeSwitch = body.querySelector(".toggle-switch"),
    modeText = body.querySelector(".mode-text"),
    dropdownLinks = document.querySelectorAll(".nav-link.has-dropdown");

  // Fungsi untuk toggle sidebar
  toggle.addEventListener("click", () => {
    sidebar.classList.toggle("close");
  });

  // Fungsi untuk toggle dark mode
  modeSwitch.addEventListener("click", () => {
    body.classList.toggle("dark");
    modeText.innerText = body.classList.contains("dark") ? "Light mode" : "Dark mode";
  });

  // Fungsi untuk dropdown menu
  dropdownLinks.forEach(link => {
    link.addEventListener("click", function (e) {
      e.preventDefault();

      // Jika dropdown yang diklik sudah terbuka, biarkan
      if (this.classList.contains("open")) {
        this.classList.remove("open");
        this.style.marginBottom = "0px"; // Reset margin jika dropdown ditutup
      } else {
        // Tutup semua dropdown lain sebelum membuka yang baru
        dropdownLinks.forEach(item => {
          item.classList.remove("open");
          item.style.marginBottom = "0px"; // Reset margin dropdown lain
        });

        this.classList.add("open");

        // Hitung tinggi submenu untuk menambahkan margin bawah
        const submenu = this.querySelector(".submenu");
        if (submenu) {
          this.style.marginBottom = submenu.scrollHeight + "px"; // Sesuaikan margin agar menu lain turun
        }
      }
    });
  });

  // Menutup dropdown jika klik di luar menu
  document.addEventListener("click", function (event) {
    const isClickInsideDropdown = event.target.closest(".nav-link.has-dropdown");

    if (!isClickInsideDropdown) {
      dropdownLinks.forEach(link => {
        link.classList.remove("open");
        link.style.marginBottom = "0px"; // Reset margin saat semua dropdown ditutup
      });
    }
  });
});
