// URL API furniture
const url = 'http://localhost:3000/api/furniture/';
// id product
const id = document.location.search.substring(5);
// url product API / furniture/
const urlId = url + id;

// selection container
const container = document.querySelector('.container');

// We try to look for data on API in asynchronous
const fetchProduct = async () => {
    // If it's ok, we get the data back, we send them in JSON format or we send an error message
    try {
        const response = await fetch(urlId); 
        // we get back the ID 
        return await response.json(); // data request json 
    } catch(error) {
        container.innerHTML += `<h4>Désolé une Erreur serveur c'est produit ! Essayer de revenir un peu plus tard. 
        Merci de votre compréhension</h4>`;
    }
    return console.log(error);
};

// We do a treatment with the found data with the results of the fetchproduct
fetchProduct().then(data => {
    const formatter = new Intl.NumberFormat("fr-FR", { style: "currency", currency: "EUR" });

    if(!id) {
        const furnitures = data.map(furniture => `
        <div class="col-sm-6 text-center mb-4">
          <div class="card">
            <img class="card-img-top" src="${furniture.imageUrl}" alt="Meuble ${furniture.name}">
            <div class="card-body">
              <a href="pages/product.html?_id=${furniture._id}" class="text-dark text-decoration-none"><h3 class="card-title stretched-link">${furniture.name}</h3></a>
              <p class="card-text">${furniture.description}</p>
              <p class="btn btn-primary text-monospace mb-0">${formatter.format(furniture.price / 100)}</p> 
                </div>
            </div>
            </div>
        `).join(""); 
        // join the templates
        container.innerHTML += `<div class="d-flex flex-wrap mx-auto products">${furnitures}</div>`;
        // Add the template
    } else {
        container.innerHTML += `
            <div class="card d-flex flex-md-row mt-5 mb-3 mx-auto margin-top product">
            <img class="col col-md-7 card-img-top px-0 product__img" src="${data.imageUrl}" alt="Meuble ${data.name}">
            <div class="col col-md-5 card-body text-center text-md-left">
                <h1 class="h2 py-2">${data.name}</h1>
                <p class="card-text">${data.description}</p>
                <p class="btn btn-primary text-monospace mb-0">${formatter.format(data.price / 100)}</p>   
                <div class="form-group m-0">
                <select class="form-control">${data.varnish.map((varnis) => `<option>${varnis}</option>`)}</select>
                </div>
                <a href="cart.html">
                <button class="btn btn-success mt-2 w-100 add-cart">Ajouter au panier</button>
                </a>
            </div>
            </div>
        `;
        // <p class="btn btn-primary h4 text-center text-monospace mb-4">${formatter.format(data.price / 100)}</p><br></br>
        const addToCart = document.querySelector(".add-cart");
        // Target the button that adds a product in the cart 

        // Event after click
        addToCart.addEventListener("click", () => {
            const cartContent = JSON.parse(localStorage.getItem("cartContent")) || []; 
            // Get back the data of the localstorage on array format if there is some . If there is no data in the localstorage, we create an empty array
            cartContent.push(id); // add a product in array
            localStorage.setItem("cartContent", JSON.stringify(cartContent)); 
            // Save the array on localstorage on string format 
        });  
    } 
}); 