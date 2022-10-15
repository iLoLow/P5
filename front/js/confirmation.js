const getOrderId = window.location.search;

const urlSearch = new URLSearchParams(getOrderId);

const findOrderId = urlSearch.get("orderId");
function generateOrderId() {
  const orderId = document.querySelector("#orderId");
  orderId.innerHTML = findOrderId;
}
generateOrderId();
