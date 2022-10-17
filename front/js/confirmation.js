const getOrderId = window.location.search;

const urlSearch = new URLSearchParams(getOrderId);

const findOrderId = urlSearch.get("orderId");

//prend l'order id pour le mettre dans la page
function generateOrderId() {
  const orderId = document.querySelector("#orderId");
  orderId.innerHTML = findOrderId;
}
generateOrderId();
