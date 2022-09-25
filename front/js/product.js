const getProductId = window.location.search;

const urlSearch = new URLSearchParams(getProductId);

const productId = urlSearch.get("id");

async function fetchProduct() {
  return await fetch(`http://localhost:3000/api/products/${productId}`)
    .then(function (response) {
      return response.json();
    })
    .then(function (data) {
      return data;
    });
}

function generateproduct(productData) {
  const div = document.querySelector(".item__img");

  const img = document.createElement("img");
  img.src = productData.imageUrl;
  div.appendChild(img);

  const title = document.querySelector("#title");
  title.innerHTML = productData.name;

  const price = document.querySelector("#price");
  price.innerHTML = productData.price;

  const description = document.querySelector("#description");
  description.innerHTML = productData.description;

  for (let index = 0; index < productData.colors.length; index++) {
    const colors = document.querySelector("#colors");
    const option = document.createElement("option");
    option.innerHTML = productData.colors[index];
    option.value = productData.colors[index];
    colors.appendChild(option);
  }
}

async function main() {
  const product = await fetchProduct();

  generateproduct(product);
}
main();
