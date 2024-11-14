const hamburgerButton = document.querySelector('.hamburger-menu-button');
const navbar = document.getElementById('nav-section');
const mobileMenu = document.getElementById('mobile-menu');
const scrollWrapper = document.querySelector('.scroll-wrapper');
const scroller = document.querySelector('.scroller');

let prevScrollValue = 0;

function handleScroll() {
    // NAVBAR ANIMATION
    let curScrollValue = window.scrollY;

    if(curScrollValue === 0) {
        navbar.classList.remove('scroll-up');
        navbar.classList.remove('scroll-down');
        navbar.classList.remove('bg-white');
        navbar.classList.add('bg-transparent');
    } else if(curScrollValue > prevScrollValue) {
        navbar.classList.remove('bg-transparent');
        navbar.classList.remove('scroll-down');
        navbar.classList.add('scroll-up');
    } else {
        navbar.classList.remove('scroll-up');
        navbar.classList.add('scroll-down');
        navbar.classList.add('bg-white');
    }

    prevScrollValue = curScrollValue;
}

function handleMenu() {
    hamburgerButton.classList.toggle('open');
    if(hamburgerButton.classList.contains('open')) {
        navbar.classList.add('bg-white');
        mobileMenu.classList.add('open');
        document.body.classList.add('no-scroll');
    } else {
        mobileMenu.classList.remove('open');
        document.body.classList.remove('no-scroll');
        if(window.scrollY == 0) {
            navbar.classList.remove('bg-white');
        }
    }
}

function duplicateNode() {
    const scrollWrapper = document.querySelector('.scroller-wrapper');
    const scrollItems = document.getElementsByClassName('scroll-content');

    Array.from(scrollItems).forEach(item => {
        const clonedItem = item.cloneNode(true);
        scrollWrapper.appendChild(clonedItem);
    });

    Array.from(scrollItems).forEach(item => {
        const clonedItem = item.cloneNode(true);
        scrollWrapper.appendChild(clonedItem);
    });
}

function getLSData() {
    // IF CART IS PRESENT IN LOCAL STORAGE
    // WE FETCH CART AND RETURN
    // IF NOT WE CREATE A CART ARRAY AND RETURN
    let cart;
    if(localStorage.getItem('cart') === null) {
        cart = {};
    } else {
        cart = JSON.parse(localStorage.getItem('cart'));
    }

    return cart;
}

function updateUIOnLoad() {
    let cart = getLSData();

    if(cart.totalItem == undefined) {
        document.querySelector('.counter').innerHTML = 0;
    } else {
        document.querySelector('.counter').innerHTML = cart.totalItem;
    }
}

// EVENTS
window.addEventListener('scroll', handleScroll);
hamburgerButton.addEventListener('click', handleMenu);
window.onload = duplicateNode;
updateUIOnLoad();