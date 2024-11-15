// GALLERY VARIABLES
let thumbnailsContainer;
let thumbnails;
let preview;

// CART MANAGING BUTTONS
let cart;
let bag;
let countInput;
let sizeBtns; //Size Btns Container
let incrementBtn; 
let decrementBtn;

let productCategory; //Product Category
let productId ; // Product ID
let productRef; // Product Data

// CART VARIABLES
let addToCartBtn;
let cartCount;
let cartValue;

function fetchData() {
    fetch('data.json')
        .then(response => {
            if (!response.ok) {
                throw new Error('Network response was not ok');
            }
            return response.json();
        })
        .then(data => {
            fetchProduct(data);
        })
        .catch(error => {
            console.error('There was a problem with the fetch operation:', error);
        });
}

function fetchProduct(data) {
    // GET PRODUCT ID AND CATEGORY FROM THE URL
    const myUrl = new URL(window.location.href);
    productCategory = myUrl.searchParams.get('category');
    productId = myUrl.searchParams.get('id');

    const productsList = data.products[0][productCategory];
    productsList.forEach(product => {
        if(product['id'] == productId) {
            productRef = product;
        }
    });

    // START CREATING GALLERY
    createGallery();
}

function createGallery() {

    // INITIALIZE THUMBNAIL CONTAINER AND PREVIEW CONTAINER
    thumbnailsContainer = document.querySelector('.thumbnails');

    // CREATE THUMBNAILS
    createThumbnails();

    // INITIALIZE ALL THUMBNAILS AND PREVIEW CONTAINER
    thumbnails = document.getElementsByClassName('thumbnail');
    preview = document.querySelector('.preview');

    // SET DEFAULT PREVIEW IMAGE AND SELECTION FOR FIRST THUMBNAIL
    Array.from(thumbnails)[0].classList.add('selected');
    const previewImg = Array.from(thumbnails)[0].querySelector('img').getAttribute('src');
    preview.querySelector('img').setAttribute('src', previewImg);

    // CLICK EVENT TO CLOSE ALERTBOX
    document.querySelector('.close-alertbox').addEventListener('click', () => {
        document.getElementById('alertbox').classList.add('hide-alertbox')
        document.getElementById('overlay').classList.add('close-overlay');
        document.body.classList.remove('no-scroll');
    })

    // CREATE GALLERY FUNCTIONALITY
    createFunctionality();

    // CREATE CART FUNCTIONALITY
    addProductDetails();

}

function createThumbnails() {
    console.log('Inside Create Thumbnail');
    const imgArr = productRef.images;

    imgArr.forEach((imgSrc) => {
        const item =   `<div class="thumbnail">
                                <img src=${imgSrc}>
                            </div>`;
        thumbnailsContainer.innerHTML += item;
    });
}

function createFunctionality() {
    Array.from(thumbnails).forEach((item) => {
        item.addEventListener('click', () => {
            removeSelection(thumbnails);
            item.classList.add('selected');
            const source = item.querySelector('img').getAttribute('src');
            preview.querySelector('img').setAttribute('src', source);
        });
    });
}

// REMOVES SELECTION FROM LIST OF ELEMENTS

function removeSelection(element) {
    Array.from(element).forEach((item) => {
        item.classList.remove('selected');
    });
}

// CREATE CART
function addProductDetails() {

    // ADD PRODUCT TITLE
    document.querySelector('.product-name').innerHTML = productRef.title;

    // ADD PRODUCT PRICE AND DESCRIPTION
    document.querySelector('.product-value').innerHTML = 'RS. ' + productRef.price;
    document.querySelector('.product-text').innerHTML = productRef.description;

    // ADD CLICK EVENTS TO SIZING BUTTONS
    setSizeEvents();

    // ADD INCREMENTOR AND DECREMENTOR FUNCTIONALITY
    countInput = document.querySelector('.product-count');
    incrementor();
    decrementor();

    // IF PRODUCT COUNT IS ZERO DISABLE ADD BUTTON
    addToCartBtn = document.getElementById('add-product');
    if(productRef.stock === 0) {
        addToCartBtn.disabled = true;
    }
    
    // CREATE CART FUNCTIONALITY
    createCart();
}

// ADDING CLICK EVENT ON SIZE BUTTONS
function setSizeEvents() {
    sizeBtns = document.querySelectorAll('.sizing-btn');

    Array.from(sizeBtns).forEach((item) => {
        item.addEventListener('click', () => {
            console.log('sizeEvents');
            
            removeSelection(sizeBtns);
            item.classList.add('selected');
        });
    });
}

// INITIALISE INCREMENTOR
function incrementor() {
    incrementBtn = document.querySelector('.incrementor');

    incrementBtn.addEventListener('click', () => {
        countInput.value++
    });
}

// CART DECREMENTOR
function decrementor() {
    decrementBtn = document.querySelector('.decrementor');

    decrementBtn.addEventListener('click', () => {
        let temp = countInput.value - 1;
        if(temp >= 0) {
            countInput.value = temp;
        }
        
    });
}

// CREATE CART
function createCart() {
    // UPDATE CART COUNT ON LOAD BY CHECKING LOCAL STORAGE
    bag = document.querySelector('.counter');
    // cartCount = updateCart();

    // ADD CLICK EVENT ON ADD BUTTON
    addToCartBtn.addEventListener('click', addToCart);

    updateUIOnLoad();

}

function addToCart() {
    // INITIALIZE cartCOUNT VARIABLE
    cartCount = Number(countInput.value);
    
    // INITIALIZE cartValue VARIABLE
    cartValue = cartCount * Number(productRef.price);

    // IF itemCount IS ZERO EXIT THE FUNCTION
    let itemCount = Number(countInput.value);
    if (itemCount === 0) return;

    // GET CART FROM LS
    let cart = getCartFromLS();

    // UPDATE totalItems IN LS
    if (cart.totalItem == undefined) {
        console.log("Undefined AAYA")
        cart.totalItem = cartCount;
    } else {
        cart.totalItem = Number(cart.totalItem) + cartCount; 
    }

    // UPDATE totalValue IN LS
    if (cart.totalValue == undefined) {
        cart.totalValue = cartValue;
    } else {
        cart.totalValue = Number(cart.totalValue) + cartValue; 
    }

    // SET ITEM IN CART
    if (cart.items == undefined) {
        cart.items = {};
    }

    if (cart.items[productRef.title] == undefined) {
        cart.items[productRef.title] = {};
    }

    if(cart.items[productRef.title].count == undefined) {
        cart.items[productRef.title].count = cartCount;
    } else {
        cart.items[productRef.title].count = Number(cart.items[productRef.title].count) + cartCount;
    }
    
    cart.items[productRef.title].value = productRef.price;
    cart.items[productRef.title].image = productRef.thumbnail;
    // cart.items[productRef.title].image = productRef.id;

    // UPDATE LS
    localStorage.setItem('cart', JSON.stringify(cart));

    // UPDATE CART COUNT
    setCartCount(cart.totalItem);
    
    // RESET
    reset();

    sendAlert("Item has been added to cart");
}

function sendAlert(message) {
    const alertbox = document.getElementById('alertbox');
    document.body.scrollTop = 0;
    document.documentElement.scrollTop = 0;
    document.body.classList.add('no-scroll');
    const overlay = document.getElementById('overlay');
    alertbox.querySelector('.message').innerHTML = message;
    alertbox.classList.remove('hide-alertbox');
    overlay.classList.remove('close-overlay');
}

function setCartCount(value) {
    bag.innerHTML = value;
}

function reset() {
    countInput.value = 0;
    removeSelection(sizeBtns);
    cartCount = 0;
    cartValue = 0;
}

function getCartFromLS() {
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
    let cart = getCartFromLS();

    if(cart.totalItem == undefined) {
        setCartCount(0);
    } else {
        setCartCount(cart.totalItem);
    }
}

// initialiseGallery();
fetchData();