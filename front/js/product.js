//Récupération de l'id en brut
const getProductId = window.location.search;
console.log(getProductId);

const urlSearch = new URLSearchParams(getProductId);
console.log(urlSearch);
const productId = urlSearch.get("id");
//Section de la balise select avec l'ID colors
const colors = document.querySelector("#colors");
//Selection de la balise input avec l'ID quantity
const quantity = document.querySelector("#quantity");
//Récupération du produit dans l'api grace a id
async function fetchProduct() {
  return await fetch(`http://localhost:3000/api/products/${productId}`)
    .then(function (response) {
      return response.json();
    })
    .then(function (data) {
      return data;
    });
}
//Fonction pour generer un produit grace a id
function generateproduct(productData) {
  //selection de la balise div class item__img
  const div = document.querySelector(".item__img");
  //création de la balise img
  const img = document.createElement("img");
  //Ajout du lien de l'image (src) dans la balise img
  img.src = productData.imageUrl;
  //Balise img est a l'interieur de la balise div
  div.appendChild(img);
  //Selection de la balise h1 avec l'id title
  const title = document.querySelector("#title");
  //injection du nom du produit entre les balises h1
  title.innerHTML = productData.name;
  //Selection de la balise span avec l'id price
  const price = document.querySelector("#price");
  //Injection du prix dans la balise span avec l'id price
  price.innerHTML = productData.price;
  //Selection de la balise p avec l'ID description
  const description = document.querySelector("#description");
  //Injection de la description dans la balise p avec l'ID description
  description.innerHTML = productData.description;
  //Boucle pour generer les couleurs grace au tableau couleur(color)
  for (let index = 0; index < productData.colors.length; index++) {
    //Création de la balise option
    const option = document.createElement("option");
    //Injection de la couleur dans la balise option
    option.innerHTML = productData.colors[index];
    option.value = productData.colors[index];
    //Balise option est à l'interieur de la balise colors
    colors.appendChild(option);
  }
}
//fonction pour ajouter produit dans le local storage
function addcart() {
  //Selection de la balise button avec l'ID addToCart
  let buttoncart = document.querySelector("#addToCart");
  buttoncart.addEventListener("click", function () {
    let productTable = JSON.parse(localStorage.getItem("productCart") || "[]");
    //Declaration de la variable product pour indiquer les valeurs colors et quantité
    let product = {
      productId: productId,
      color: colors.value,
      quantity: Number(quantity.value),
    };
    //condition pour vérifié si une couleur est sectionnée
    if (product.color === "") {
      return alert("Vous n'avez pas choisi de couleur.");
      //Condition pour verifié que la quantité selectionné et bien entre 1 et 100
    } else if (product.quantity === 0 || product.quantity < 1 || product.quantity > 100) {
      return alert("Veuillez choisir une quantité entre 1 et 100.");
    }
    //Condition verification si un produit n'ai pas present, alors envoie dans le localstorage
    if (productTable.length === 0) {
      productTable.push(product);
      localStorage.setItem("productCart", JSON.stringify(productTable));
      //Condition si un produit est present dans le localstorage avec une meme couleur
    } else if (productTable) {
      let productInCart = productTable.find(function (p) {
        return product.productId === p.productId && product.color === p.color;
      });
      //Condition pour additionner les quantités d'un produit avec la même couleur
      if (productInCart) {
        productInCart.quantity = Number(product.quantity) + Number(productInCart.quantity);
        localStorage.setItem("productCart", JSON.stringify(productTable));
      } else {
        productTable.push(product);
        localStorage.setItem("productCart", JSON.stringify(productTable));
      }
    }
    //Redirection dans la page panier
    window.location.href = "../html/cart.html";
  });
}

async function main() {
  const product = await fetchProduct();

  generateproduct(product);
  addcart();
}
main();
