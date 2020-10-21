const container = document.querySelector(".container");

// Check that we have the order information
if (localStorage.getItem("orderData") && localStorage.getItem("orderPrice")) {
  const orderData = JSON.parse(localStorage.orderData);
  const firstName = Object.values(orderData.contact.firstName).join("");
  const orderId = Object.values(orderData.orderId).join("");
  const price = localStorage.getItem("orderPrice");

  // Create and add a template
  container.innerHTML += `
    <div class="text-center h5">
      <p class="h1 mt-5 mb-5 margin-top">Votre commande à été validé !</p>
      <p class="mb-3">Votre identifiant de commande est le suivant :</p>
      <p class="mb-5"><mark>${orderId}</mark></p>
      <p class="text-warning mb-5">N'oubliez pas de noter votre numéro de commande, il vous sera demandé en cas de problémes.</p>
      <p class="mb-5"> Vous serez bientot débitée de la somme de <mark>${price}</mark> .</p>
      <p><em>Merci de votre confiance ${firstName}, et à bientôt !</em></p>
    </div>
  `;
} else {
  container.innerHTML += `
    <p class="text-center h4 mt-5 margin-top">Vous n'avez rien commandé.</p>
  `;
}