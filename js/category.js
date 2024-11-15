const cardContainer = document.querySelector('.category-wrapper');

function fetchData() {
    fetch('data.json')
        .then(response => {
            if (!response.ok) {
                throw new Error('Network response was not ok');
            }
            return response.json();
        })
        .then(data => {
            displayData(data);
        })
        .catch(error => {
            console.error('There was a problem with the fetch operation:', error);
        });
}

function displayData(data) {
    // console.log(data);
    // console.log(data.products[0][category]);
    const myUrl = new URL(window.location.href);
    const category = myUrl.searchParams.get('category');

    const itemsToDisplay = data.products[0][category];

    itemsToDisplay.forEach(item => {
        const card =   `<div class="card">
                            <div class="category-img">
                                <a href="https://cjmax10.github.io/the-figma-store/product.html?category=${category}&id=${item.id}">
                                    <img src=${item.thumbnail} alt="Mens">
                                </a>
                            </div>
                            <div class="card-data">
                                <div class="left-section">
                                    <div>NEW</div>
                                    <div class="item-description">${item.title}</div>
                                </div>
                                <div class="right-section">
                                    <div class="item-amount">Rs. ${item.price}</div>
                                </div>
                            </div>
                        </div>`;
        cardContainer.innerHTML += card;
    });
}


fetchData();