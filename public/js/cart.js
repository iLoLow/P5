const totalQuantity = document.querySelector("#totalQuantity");

const totalPrice = document.querySelector("#totalPrice");

let productsInCart = JSON.parse(localStorage.getItem("productCart") || "[]");
//Appel de l'api pour recuperer les produits
async function fetchProduct() {
  return await fetch(`http://localhost:3000/api/products`)
    .then(function (response) {
      if (response.ok) {
        return response.json();
      }
    })
    .then(function (product) {
      return product;
    })
    .catch(function (error) {
      console.error(error);
    });
}

//Affichage des produits dans le panier grace au tableau filtré crée dans le main
function generateCart(arrayCart) {
  for (let index = 0; index < arrayCart.length; index++) {
    const sectionCartItem = document.querySelector("#cart__items");

    const article = document.createElement("article");
    article.classList.add("cart__item");
    article.setAttribute("data-id", arrayCart[index]._id);
    article.setAttribute("data-color", arrayCart[index].color);
    sectionCartItem.appendChild(article);

    const divImg = document.createElement("div");
    divImg.classList.add("cart__item__img");
    article.appendChild(divImg);

    const img = document.createElement("img");
    img.src = arrayCart[index].imageUrl;
    img.alt = arrayCart[index].altTxt;
    divImg.appendChild(img);

    const divItemContent = document.createElement("div");
    divItemContent.classList.add("cart__item__content");

    article.appendChild(divItemContent);

    const divItemContentDescription = document.createElement("div");
    divItemContentDescription.classList.add("cart__item__content__description");
    divItemContent.appendChild(divItemContentDescription);

    const title = document.createElement("h2");
    title.innerHTML = arrayCart[index].name;
    divItemContentDescription.appendChild(title);

    const color = document.createElement("p");
    color.innerHTML = arrayCart[index].color;
    divItemContentDescription.appendChild(color);

    const price = document.createElement("p");
    price.innerHTML = arrayCart[index].price + " €";
    divItemContentDescription.appendChild(price);

    const divSettings = document.createElement("div");
    divSettings.classList.add("cart__item__content__settings");
    divItemContent.appendChild(divSettings);

    const divQuantity = document.createElement("div");
    divQuantity.classList.add("cart__item__content__settings__quantity");
    divSettings.appendChild(divQuantity);

    const pQuantity = document.createElement("p");
    pQuantity.innerHTML = "Qté : ";
    divQuantity.appendChild(pQuantity);

    const input = document.createElement("input");

    input.setAttribute("type", "number");
    input.classList.add("itemQuantity");
    input.setAttribute("name", "itemQuantity");
    input.setAttribute("min", "1");
    input.setAttribute("max", "100");
    input.setAttribute("value", arrayCart[index].quantity);
    divQuantity.appendChild(input);

    const divSettingsDelete = document.createElement("div");
    divSettingsDelete.classList.add("cart__item__content__settings__delete");
    divSettings.appendChild(divSettingsDelete);

    const pDeleteItem = document.createElement("p");
    pDeleteItem.classList.add("deleteItem");
    pDeleteItem.innerHTML = "Supprimer";
    divSettingsDelete.appendChild(pDeleteItem);
  }
}

//Calcul du prix total des articles du panier
function calcTotalPrice(arrayCart) {
  let totalPrice = 0;
  for (let index = 0; index < arrayCart.length; index++) {
    totalPrice += Number(arrayCart[index].quantity * arrayCart[index].price);
  }
  return totalPrice;
}

//Calcul de la quantité total des articles du panier
function calcTotalQuantity(arrayCart) {
  let totalQuantity = 0;
  for (let index = 0; index < arrayCart.length; index++) {
    totalQuantity += Number(arrayCart[index].quantity);
  }
  return totalQuantity;
}

//fonction pour ecouter les changements de quantité et les appliquer dans le localstorage
function addProductQuantity(arrayCart) {
  let buttonsQuantity = document.querySelectorAll(".itemQuantity");

  //boucle pour ecouter l'input quantité et modifier la quantité
  for (let index = 0; index < buttonsQuantity.length; index++) {
    buttonsQuantity[index].addEventListener("change", function (event) {
      event.preventDefault();

      //verification si l'input quantity a un nombre entier entre de 1 à 100.
      if (!Number.isInteger(Number(event.target.value))) {
        return (event.target.value = productsInCart[index].quantity), alert("Veuillez choisir un nombre entier entre 1 et 100.");
      }

      //verification si l'input quantity a une valeur inferieur à 1
      if (event.target.value === 0 || event.target.value < 1 || event.target.value > 100) {
        return (event.target.value = productsInCart[index].quantity), alert("Veuillez choisir une quantité entre 1 et 100.");
      }

      productsInCart = JSON.parse(localStorage.getItem("productCart") || "[]");

      productsInCart[index].quantity = Number(event.target.value);
      arrayCart[index].quantity = Number(event.target.value);
      buttonsQuantity[index].setAttribute("value", event.target.value);

      //mise a jour du local storage
      localStorage.setItem("productCart", JSON.stringify(productsInCart));

      //mise a jour du prix et de la quantité apres modification de la quantité d'un article
      totalPrice.innerHTML = calcTotalPrice(arrayCart);
      totalQuantity.innerHTML = calcTotalQuantity(arrayCart);
    });
  }
}

//fonction pour écouter les boutons supprimer et éffacer l'article dans le local storage
function removeProduct(arrayCart) {
  let buttonsremove = document.querySelectorAll(".deleteItem");

  //boucle pour écouter le bouton supprimer et supprimer le produit correspondant
  for (let index = 0; index < buttonsremove.length; index++) {
    buttonsremove[index].addEventListener("click", function (e) {
      if (!confirm("Voulez-vous supprimez cet article ?")) {
        return;
      }
      productsInCart = JSON.parse(localStorage.getItem("productCart") || "[]");
      //on retire l'index du tableau correspondant au produit sur lequel on clique(bouton supprimer)
      productsInCart.splice(index, 1);
      //mise a jour du local storage suite supression
      localStorage.setItem("productCart", JSON.stringify(productsInCart));
      //reflesh de la page
      window.location.reload();
      //mise a jour du prix et de la quantité apres suppression d'un article
      totalPrice.innerHTML = calcTotalPrice(arrayCart);
      totalQuantity.innerHTML = calcTotalQuantity(arrayCart);
    });
  }
}

function form() {
  //condition pour afficher que le panier et vide et pour retirer le formulaire
  if (productsInCart.length === 0) {
    const sectionCartItem = document.querySelector("#cart__items");
    const h2CartEmpty = document.createElement("h2");
    h2CartEmpty.classList.add("limitedWidthBlockContainer");
    h2CartEmpty.innerHTML = "Le panier est vide.";
    sectionCartItem.appendChild(h2CartEmpty);
    const dysplayNoneForm = document.querySelector(".cart__order__form");
    dysplayNoneForm.innerHTML = "";
  } else {
    let formCart = document.querySelector("#order");

    //Ecoute du bouton commander au clic
    formCart.addEventListener("click", function (e) {
      e.preventDefault();

      const firstName = document.querySelector("#firstName").value;
      const lastName = document.querySelector("#lastName").value;
      const address = document.querySelector("#address").value;
      const city = document.querySelector("#city").value;
      const email = document.querySelector("#email").value;
      //regex pour autoriser lettres minuscules et majuscules et 3 à 30 caractères
      const regexNameLastNameCity = /(^[a-z A-Z]{3,30})+$/g;
      //regex pour autoriser lettres minuscules et majuscules, tous les chiffres,espace et tiret
      const regexAddress = /[a-z A-Z0-9-]+$/g;
      //regex acceptant les lettres, chiffres et un point, tiret maximun d'affilé,un arobase ( tous autres symboles refusé)
      const regexEmail = /[a-z0-9!#$%&'*+/=?^_`{|}~-]+(?:\.[a-z0-9!#$%&'*+/=?^_`{|}~-]+)*@(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?\.)+[a-z0-9](?:[a-z0-9-]*[a-z0-9])?/g;

      let isValid = true;

      //Si un ou plusieurs champs du formulaire de son pas valide
      if (
        !firstName.match(regexNameLastNameCity) ||
        !lastName.match(regexNameLastNameCity) ||
        !address.match(regexAddress) ||
        !city.match(regexNameLastNameCity) ||
        !email.match(regexEmail)
      ) {
        //si le champ firstName et mal remplie, message erreur
        if (!firstName.match(regexNameLastNameCity)) {
          const firstNameErrorMsg = document.querySelector("#firstNameErrorMsg");
          isValid = false;
          firstNameErrorMsg.innerHTML = "Veuillez rentrer un nom entre 3 et 30 caractère (Chiffre(s) et symbole(s) interdit)";
        } else {
          //
          firstName.trim();
          isValid = true;
          firstNameErrorMsg.innerHTML = "";
        }

        //si le champ lastName et mal remplie, message erreur
        if (!lastName.match(regexNameLastNameCity)) {
          const lastNameErrorMsg = document.querySelector("#lastNameErrorMsg");
          isValid = false;
          lastNameErrorMsg.innerHTML = "Veuillez rentrer un prénom entre 3 et 30 caractère (Chiffre(s) et symbole(s) interdit)";
        } else {
          lastName.trim();
          isValid = true;
          lastNameErrorMsg.innerHTML = "";
        }

        //si le champ address et mal remplie, message erreur
        if (!address.match(regexAddress)) {
          const addressErrorMsg = document.querySelector("#addressErrorMsg");
          isValid = false;
          addressErrorMsg.innerHTML = "Veuillez rentrer une adresse correcte (Symbole(s) interdit)";
        } else {
          address.trim();
          isValid = true;
          addressErrorMsg.innerHTML = "";
        }

        ////si le champ city et mal remplie, message erreur
        if (!city.match(regexNameLastNameCity)) {
          const cityErrorMsg = document.querySelector("#cityErrorMsg");
          isValid = false;
          cityErrorMsg.innerHTML = "Veuillez rentrer une ville entre 3 et 30 caractère (Chiffre(s) et symbole(s) interdit)";
        } else {
          city.trim();
          isValid = true;
          cityErrorMsg.innerHTML = "";
        }

        //si le champ email et mal remplie, message erreur
        if (!email.match(regexEmail)) {
          const emailErrorMsg = document.querySelector("#emailErrorMsg");
          isValid = false;
          emailErrorMsg.innerHTML = "Veuillez rentrer un email correct (ex : monemail@mail.fr)";
        } else {
          email.trim();
          isValid = true;
          emailErrorMsg.innerHTML = "";
        }
        isValid = false;
      }

      //Si toutes les information du formulaire sont valide , faire une requete a l'api pour avoir order-Id
      if (isValid) {
        let productsId = [];
        for (let index = 0; index < productsInCart.length; index++) {
          productsId.push(productsInCart[index]._id);
        }
        console.log(productsId);
        fetch("http://localhost:3000/api/products/order", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            contact: {
              firstName: firstName,
              lastName: lastName,
              address: address,
              city: city,
              email: email,
            },
            products: productsId,
          }),
        })
          .then(function (response) {
            return response.json();
          })
          .then(function (order) {
            window.location.href = `confirmation.html?orderId=${order.orderId}`;
          })
          .finally(function () {
            localStorage.clear();
          })
          .catch(function (error) {
            console.error(error);
          });
      }
    });
  }
}

async function main() {
  const products = await fetchProduct();
  //creation d'un tableau vide pour la fusion de tableau
  let filteredProducts = [];
  //Fusion de tableau (tableau des produits de l'api et du tableau local storage)
  productsInCart.forEach(function (productInCart) {
    products.forEach(function (product) {
      if (productInCart._id === product._id) {
        filteredProducts.push({
          _id: productInCart._id,
          name: product.name,
          imageUrl: product.imageUrl,
          altTxt: product.altTxt,
          price: product.price,
          color: productInCart.color,
          quantity: productInCart.quantity,
        });
      }
    });
  });

  generateCart(filteredProducts);
  addProductQuantity(filteredProducts);
  removeProduct();
  totalPrice.innerHTML = calcTotalPrice(filteredProducts);
  totalQuantity.innerHTML = calcTotalQuantity(filteredProducts);
  form();
}
main();
