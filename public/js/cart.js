const url = "http://localhost:3000/api/furniture/"; // URL de l'API
const urlPost = "http://localhost:3000/api/furniture/order"; // URL API request POST

const container = document.querySelector(".container");

// Get products
const fetchProducts = async () => {
  try {
    const response = await fetch(url);
    return await response.json(); // Response
  } catch (error) {
    container.innerHTML += `
    <p class="h5 text-center font-weight-bold text-danger margin-top">Erreur !!!</p>
    `;
    return console.log(error);
  }
};

// Use the data of the gotten JSON array 
fetchProducts().then(data => {
  const formatter = new Intl.NumberFormat("fr-FR", { style: "currency", currency: "EUR" });
  // Format a number into currency
  const cartContent = JSON.parse(localStorage.getItem("cartContent")); 
  // Get back data of localstorage in array format
  let priceCounter = 0;
  // Start a counter for the total price

  // Create a template for each element of the array when the cart content is not empty 
  if (!localStorage.getItem("cartContent")) {
    
    container.innerHTML += `<p class="table text-center h4 mt-5 margin-top">Panier vide.</p>`;
  } else {
    const cartItems = cartContent.map(itemId => {
     
      const cartItem = data.find(item => item._id === itemId);
    //  Resend the product details if its ID is equal to the saved ID
      priceCounter += cartItem.price; 
      // Increase the counter of each product's price
      return `
        <tr>
        <th scope="row">
        <a href="product.html?_id:${cartItem._id}" class="text-decoration-none">${cartItem.name}</a>
        </th>
        <td>
          <img class="rounded" width="100" src="${cartItem.imageUrl}" alt="Meuble ${cartItem.name}">
        </td>
          <td class="text-right">${formatter.format(cartItem.price / 100)}</td>
          <td class="text-right">
            <svg width="1em" height="1em" viewBox="0 0 16 16" class="bi bi-trash cursor-pointer delete" fill="currentColor" xmlns="http://www.w3.org/2000/svg">
              <path d="M5.5 5.5A.5.5 0 0 1 6 6v6a.5.5 0 0 1-1 0V6a.5.5 0 0 1 .5-.5zm2.5 0a.5.5 0 0 1 .5.5v6a.5.5 0 0 1-1 0V6a.5.5 0 0 1 .5-.5zm3 .5a.5.5 0 0 0-1 0v6a.5.5 0 0 0 1 0V6z"/>
              <path fill-rule="evenodd" d="M14.5 3a1 1 0 0 1-1 1H13v9a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V4h-.5a1 1 0 0 1-1-1V2a1 1 0 0 1 1-1H6a1 1 0 0 1 1-1h2a1 1 0 0 1 1 1h3.5a1 1 0 0 1 1 1v1zM4.118 4L4 4.059V13a1 1 0 0 0 1 1h6a1 1 0 0 0 1-1V4.059L11.882 4H4.118zM2.5 3V2h11v1h-11z"/>
            </svg>
          </td>
        </tr>
      `;
    }).join(""); // Join the templates 

    // Create and add template
    container.innerHTML += `
      <table class="table mt-5 mb-3 margin-top">
        <thead class="thead-light">
          <tr>
            <th scope="col">Nom du produit</th>
            <th scope="col">Photo du produit</th>
            <th scope="col" class="text-right">Prix</th>
            <th scope="col" class="text-right">Suppimer</th>
          </tr>
        </thead>
        <tbody class="cart">${cartItems}</tbody>
      </table>
    `;

    container.innerHTML += `<p class="text-right font-weight-bold total-price">Total : ${formatter.format(priceCounter / 100)}</p>`; // add total price

     // Form
     container.innerHTML += `
     <form class="mt-5 validation-form">
     <input type="text" class="form-control mb-2" id="lastName" placeholder="Nom de famille" pattern="^[-'a-zA-ZÀ-ÖØ-öø-ÿ ]{2,30}$" title="2 à 30 lettres, sans accents ni caractères spéciaux." required>
     <input type="text" class="form-control mb-2" id="firstName" placeholder="Prénom" pattern="^[-'a-zA-ZÀ-ÖØ-öø-ÿ ]{4,28}$" title=" il faut 4 à 32 lettres, sans accents sans caractères spéciaux." required>
       <input type="text" class="form-control mb-2" id="address" placeholder="Adresse" required>
       <input type="text" class="form-control mb-2" id="city" placeholder="Ville" pattern="^[-'a-zA-ZÀ-ÖØ-öø-ÿ ]{2,30}$" required>
       <input type="email" class="form-control mb-4" id="email" placeholder="Adresse électronique" pattern="[a-z0-9._%+-]+@[a-z0-9.-]+\.[a-z]{2,}$" title="il faut avoir le ce format abc@gmail.com" required>
       <button type="submit" class="btn btn-success w-100">Valider</button>
     </form>
   `;

   // Delete a product in the array
   const cart = document.querySelector(".cart");
   // Target tag where is the array
   const array = Array.from(cart.children); 
   // Array with element children of array

   // When we click delete
   cart.addEventListener("click", event => {
     if (event.target.classList.contains("delete")) {
       const targetTr = event.target.parentElement.parentElement; 
       const index = array.indexOf(targetTr); 

       // If array =< 1 delete array of local storage
       if (array.length === 1) {
         localStorage.removeItem("cartContent");
         window.location.reload();
       } else {
         cartContent.splice(index, 1);
         localStorage.setItem("cartContent", JSON.stringify(cartContent));
         window.location.reload();
       }
     }
   });

       // Send form and list of product
       const form = document.querySelector(".validation-form");
       const { firstName, lastName, address, city, email } = form;
   
       form.addEventListener("submit", event => {
         event.preventDefault();
         const postProducts = async () => {

           try {
             const response = await fetch(urlPost, {
               method: "POST",
               headers: new Headers({
                 "Content-Type": "application/json",
               }),
               body: JSON.stringify({
                 contact: {
                   lastName: lastName.value.trim(),
                   firstName: firstName.value.trim(),
                   address: address.value.trim(),
                   city: city.value.trim(),
                   email: email.value.trim(),
                 },
                 products: cartContent,
               }),
             });
             console.log(response);


             return await response.json();
           } catch (error) {
             container.innerHTML += `<p class="h5 text-center font-weight-bold text-danger mt-4">Un problème commande.</p>`;
             return console.log(error);
           }
         };

         postProducts().then((orderData) => {
          localStorage.clear();
          localStorage.setItem("orderData", JSON.stringify(orderData));
          localStorage.setItem("orderPrice", formatter.format(priceCounter / 100));

          if (localStorage.getItem("orderData") !== "undefined") {
            window.location.href = "confirmation.html";
          }
        });
       });  
  }
});