//recuperation de la list des produits
async function getProducts(url) {
  return await fetch(url)
    .then(function (response) {
      return response.json();
    })
    .then(function (products) {
      return products;
    });
}
//fonction pour générer les produits
function generateproducts(products) {
  //selection de la balise section avec l'id item
  const section = document.querySelector("#items");
  //boucle creation des produits sur page index
  for (let index = 0; index < products.length; index++) {
    //Création balise a
    const link = document.createElement("a");
    //Ajout du href dans la balise a (id prodeuit)
    link.href = "product.html?id=" + products[index]._id;
    //création balise article
    const contener = document.createElement("article");
    //Balise article a l'interieur de la balise a
    link.appendChild(contener);
    //Creation de la balise img
    const img = document.createElement("img");
    //Ajout du lien de l'image (src) dans la balise img
    img.src = products[index].imageUrl;
    //Ajout de la description de l'image(alt) dans la balise a
    img.alt = products[index].altTxt;
    //Balise img a l'interieur de la balise article
    contener.appendChild(img);
    //Création de la balise h3
    const title = document.createElement("h3");
    //Ajout de la class productName dans la balise h3
    title.classList.add("productName");
    //Injection du nom du produit entre les balise h3
    title.innerHTML = products[index].name;
    //Balise title a l'interieur de la balise article
    contener.appendChild(title);

    const card = document.createElement("p");
    card.classList.add("productDescription");
    card.innerHTML = products[index].description;
    contener.appendChild(card);

    //Balise section a l'interieur de la balise a
    section.appendChild(link);
  }
}

async function main() {
  const products = await getProducts("http://localhost:3000/api/products");
  generateproducts(products);
}
main();
