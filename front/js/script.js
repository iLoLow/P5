async function getProducts(url) {
  return await fetch(url)
    .then(function (response) {
      return response.json();
    })
    .then(function (products) {
      return products;
    });
}
function generateproducts(products) {
  const section = document.querySelector("#items");

  for (let index = 0; index < products.length; index++) {
    const link = document.createElement("a");
    link.href = "./product.html?id=" + products[index]._id;

    const contener = document.createElement("article");
    link.appendChild(contener);

    const img = document.createElement("img");
    img.src = products[index].imageUrl;
    img.alt = products[index].altTxt;
    contener.appendChild(img);

    const title = document.createElement("h3");
    title.classList.add("productName");
    title.innerHTML = products[index].name;
    contener.appendChild(title);

    const card = document.createElement("p");
    card.classList.add("productDescription");
    card.innerHTML = products[index].description;
    contener.appendChild(card);

    section.appendChild(link);
  }
}

async function main() {
  const products = await getProducts("http://localhost:3000/api/products");

  generateproducts(products);
}
main();
