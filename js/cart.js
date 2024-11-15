let cart;
let bag = document.querySelector('.counter');
let totalBill = document.querySelector('.total-cart-value');
const cartBody = document.querySelector('.cart-body');
const cartCount = document.querySelector('.cart-count');
const checkout = document.getElementById('checkout');
const userForm = document.getElementById('submit-form');
const overlay = document.getElementById('overlay');

// Modified to avoid recursive call conflict
function initializeCart() {
    cart = getData();
    if (cart == null) {
        loadEmptyCart();
    } else {
        renderCart(cart);
    }
}

// GET DATA FROM LOCAL STORAGE
function getData() {
    // Check if 'cart' exists in localStorage
    let cart;
    if (localStorage.getItem('cart') === null) {
        cart = null;
    } else {
        cart = JSON.parse(localStorage.getItem('cart'));
    }
    return cart;
}

// Load this UI if no item is in the cart
function loadEmptyCart() {
    cartBody.classList.add('empty');
    cartBody.innerHTML = `
        <p class="msg">EMPTY CART, AAACCKKK</p>
        <a href="index.html#shop" class="btn">See All Products</a>`;
    bag.innerHTML = '0';
    cartCount.innerHTML = '0';
}

// Render cart items
function renderCart(data) {
    bag.innerHTML = data.totalItem;
    const listUI = `<div class="item-list"></div>`;
    const checkoutUI = `
        <div class="cart-checkout">
            <div>Total RS. <span class="total-cart-value">${data.totalValue}</span></div>
        </div>
        <div class="confirm-checkout">
            <button id="checkout" href="#" class="btn">Confirm Checkout</button>
        </div>`;

    // Insert initial UI
    cartCount.innerHTML = `${data.totalItem}`;
    cartBody.innerHTML = listUI;
    cartBody.innerHTML += checkoutUI;

    const listContainer = document.querySelector('.item-list');
    const itemArr = Object.keys(data.items);

    itemArr.forEach((item) => {
        const itemData = data.items[item];
        const itemTotalCost = itemData.count * itemData.value;

        listContainer.innerHTML += `
            <div class="cart-item">
                <div data-item="${item}" class="delete-item">
                    <i class="fa-solid fa-xmark fa-lg"></i>
                </div>
                <div class="item-description">
                    <div class="left-section">
                        <img src="${itemData.image}" alt="${item}">
                    </div>
                    <div class="right-section">
                        <div class="item-title">${item}</div>
                        <div class="item-price">Rs. <span class="item-price">${itemData.value}</span></div>
                        <div class="item-count"><span>${itemData.count}</span>X</div>
                    </div>
                </div>
                <div class="item-cost">
                    <div>Rs. <span class="total-item-value">${itemTotalCost}</span></div>
                </div>
            </div>`;
    });

    document.getElementById('checkout').addEventListener('click', userDataForm);

    document.body.addEventListener('click', (event) => {
        if (!userForm.contains(event.target)) {
            closeForm();
        }
    });

    document.querySelector('#reg-form').addEventListener('submit', submitData);

    addDeleteEvent();
}

function addDeleteEvent() {
    const deleteBtns = document.getElementsByClassName('delete-item');

    Array.from(deleteBtns).forEach((item) => {
        item.addEventListener('click', () => {
            item.parentElement.remove();
            const title = item.getAttribute('data-item');
            deleteItemFromLS(title);
        })
    });
}

function deleteItemFromLS(title) {
    cart.totalItem = Number(cart.totalItem) - cart.items[title].count;
    cart.totalValue = Number(cart.totalValue) - (cart.items[title].value * cart.items[title].count);
    delete cart.items[title];

    localStorage.setItem('cart', JSON.stringify(cart));
    if(cart.totalItem == 0) {
        loadEmptyCart();
        localStorage.removeItem('cart');
    }
    initializeCart();
}

// function userDataForm() {
//     overlay.classList.remove('close-overlay');
//     userForm.classList.remove('close-form');
//     // document.body.scrollTop = 0;
//     // document.documentElement.scrollTop = 0;
//     document.body.classList.add('no-scroll');
// }

// function closeForm() {
//     overlay.classList.add('close-overlay');
//     userForm.classList.add('close-form');
//     document.body.classList.remove('no-scroll');
// }

function userDataForm() {
    overlay.classList.remove('close-overlay');
    userForm.classList.remove('close-form');
    document.body.classList.add('no-scroll');

    // Prevent clicks inside the form from closing it
    userForm.addEventListener('click', (event) => {
        event.stopPropagation();
    });

    // Close the form when clicking on the overlay (outside the form)
    overlay.addEventListener('click', closeForm);
}

function closeForm() {
    overlay.classList.add('close-overlay');
    userForm.classList.add('close-form');
    document.body.classList.remove('no-scroll');
}


function submitData(e) {
    console.log(gdgd)
    e.preventDefault();
}

// Initialize the cart on page load
initializeCart();
