/*========== Menu Icon Navbar ==========*/
let menuIcon = document.querySelector('#menu-icon');
let navbar = document.querySelector('.navbar');

menuIcon.onclick = () => {
    menuIcon.classList.toggle('bx-x');
    navbar.classList.toggle('active');
};

/*========== Scroll Sections Active Link ==========*/
let sections = document.querySelectorAll('section');
let navLinks = document.querySelectorAll('header nav a');

window.onscroll = () => {
    sections.forEach(sec => {
        let top = window.scrollY;
        let offset = sec.offsetTop - 150;
        let height = sec.offsetHeight;
        let id = sec.getAttribute('id');

        if (top >= offset && top < offset + height) {
            navLinks.forEach(link => {
                link.classList.remove('active');
                document.querySelector(`header nav a[href*="${id}"]`).classList.add('active');
            });
        }
    });

    /*========== Sticky Navbar ==========*/
    let header = document.querySelector('.header');
    header.classList.toggle('sticky', window.scrollY > 100);

    /*========== Remove Menu Icon Navbar When Click Navbar Link ==========*/
    menuIcon.classList.remove('bx-x');
    navbar.classList.remove('active');
};

document.addEventListener("DOMContentLoaded", function () {
    let selectedModule = ""; // Variabel untuk menyimpan halaman tujuan

    // Menampilkan pop-up
    window.showPopup = function (module) {
        selectedModule = module; // Simpan halaman modul yang dipilih
        document.getElementById("popup").style.display = "flex";
    };

    // Menutup pop-up
    window.closePopup = function () {
        document.getElementById("popup").style.display = "none";
    };

    // Konfirmasi dan pindah ke halaman modul yang dipilih
    window.confirmAction = function () {
        if (selectedModule) {
            window.location.href = "component/module/" + selectedModule; // Pastikan path benar
        }
    };
});





/*========== Swiper ==========*/
var swiper = new Swiper(".mySwiper", {
    slidesPerView: 1,
    spaceBetween: 50,
    loop: true,
    grabCursor: true,
    pagination: {
        el: ".swiper-pagination",
        clickable: true,
    },
    navigation: {
        nextEl: ".swiper-button-next",
        prevEl: ".swiper-button-prev",
    },
});

/*========== Dark Light Mode ==========*/
let darkModeIcon = document.querySelector('#darkMode-icon');

darkModeIcon.onclick = () => {
    darkModeIcon.classList.toggle('bx-sun');
    document.body.classList.toggle('dark-mode');
};

/*========== Scroll Reveal ==========*/
ScrollReveal({
    distance: '80px',
    duration: 2000,
    delay: 200
});

ScrollReveal().reveal('.home-content, .heading', { origin: 'top' });
ScrollReveal().reveal('.home-img img, .services-container, .portfolio-box, .testimonial-wrapper, .contact form', { origin: 'bottom' });
ScrollReveal().reveal('.home-content h1, .about-img img', { origin: 'left' });
ScrollReveal().reveal('.home-content h3, .home-content p, .about-content', { origin: 'right' });


    // Ambil elemen-elemen
    const loginBtn = document.getElementById('loginBtn');
    const modal = document.getElementById('loginModal');
    const closeModalBtn = document.getElementById('closeModal');

    // Menampilkan modal login saat tombol login ditekan
    loginBtn.addEventListener('click', () => {
        modal.style.display = 'flex';
    });

    // Menutup modal saat tombol cancel ditekan
    closeModalBtn.addEventListener('click', () => {
        modal.style.display = 'none';
    });

    // Menutup modal jika area luar modal ditekan
    window.addEventListener('click', (event) => {
        if (event.target === modal) {
            modal.style.display = 'none';
        }
    });
