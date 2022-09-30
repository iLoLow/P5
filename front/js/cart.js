let arrayCart = JSON.parse(localStorage.getItem("productCart"));
console.log(arrayCart);

function generateCart() {
  arrayCart.forEach(function (test) {
    let recup = test.productId;
    async function fetchProduct() {
      return fetch(`http://localhost:3000/api/products/${recup}`)
        .then(function (response) {
          if (response.ok) {
            console.log(response);
            return response.json();
          }
        })
        .then(function (data) {
          return data;
        });
    }
    console.log(fetchProduct);
    console.log(recup);
  });
  for (let index = 0; index < arrayCart.length; index++) {
    const sectionCartItem = document.querySelector("#cart__items");

    const article = document.createElement("article");
    article.classList.add("cart__item");
    sectionCartItem.appendChild(article);

    const divImg = document.createElement("div");
    divImg.classList.add("cart__item__img");
    article.appendChild(divImg);

    const img = document.createElement("img");
    img.src = arrayCart.imageUrl;
    img.alt = arrayCart.altTxt;
    divImg.appendChild(img);
  }
}

async function main() {
  const product = await fetchProduct();
  generateCart(product);
}
main();
