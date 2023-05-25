// const client = contentful.createClient({
//   // This is the space ID. A space is like a project folder in Contentful terms
//   space: "ckejofk7rp4v",
//   // This is the access token for this space. Normally you get both ID and the token in the Contentful web app
//   accessToken: "h5G8nApaBpcOf-JVnsB0qM2hwpwFEVV5SaS-2TRSPvQ",
// });
// console.log(client);

//variables

const cartBtn = document.querySelector(".cart-btn");
const closeCartBtn = document.querySelector(".close-cart");
const clearCartBtn = document.querySelector(".clear-cart");
const cartDOM = document.querySelector(".cart");
const cartOverlay = document.querySelector(".cart-overlay");
const cartItems = document.querySelector(".cart-items");
const cartTotal = document.querySelector(".cart-total");
const cartContent = document.querySelector(".cart-content");
const productsDOM = document.querySelector(".new");
const lowerDOM = document.querySelector(".uppermenu");
const breakfastDOM = document.querySelector(".products-center");
// const btns = document.querySelectorAll(".bag-btn");

//cart
let cart = [];
//buttons
let buttonsDOM = [];
// getting the products
class Products {
  async getProducts() {
    try {
      // let contentful = await client.getEntries({
      //   content_type: "apnacanteen",
      // });
      // console.log(contentful);

      let result = await fetch("./scripts/products.json");
      console.log(result);
      let data = await result.json();
      console.log(data);
      let populars = data.items;
      console.log(data);
      console.log(data.items);
      populars = populars.map((item) => {
        const { title, price } = item.fields;
        const id = item.sys.id;
        const image = item.fields.image.fields.file.url;
        return { title, id, image, price };
      });
      return populars;
    } catch (error) {
      console.log(error);
    }
  }
}

//display products
class UI {
  displayProducts(products) {
    let result = "";
    let para = " ";
    let firsts = [...products.slice(0, 5)];
    let seconds = [...products.slice(5, 17)];
    firsts.forEach((product) => {
      result += `<article class="card-2">
          <img src=${product.image} alt="" />
          <div class="breakfast">${product.title}</div>
          <p>₹${product.price}</p>
          <button class="btn bag-btn" data-id=${product.id}>
         
            Order
         
          </button>
        </article>`;
    });

    seconds.forEach((second) => {
      para += ` <article class="card-3">
              <img src=${second.image} alt="">
              <p class="discount">20%</p>
              <p class="fast">fast</p>
              <div class="down">
                <p>${second.title}</p>
                <div class="star">
                ₹${second.price}
                </div>
                <button class="btn bag-btn" data-id=${second.id}>
                  Add to cart
                </button>
              </div>
            </article>`;
    });
    console.log(products);
    productsDOM.innerHTML = result;
    lowerDOM.innerHTML = para;
  }

  getBagButtons() {
    const buttons = [...document.querySelectorAll(".bag-btn")];
    // console.log(buttons);
    buttonsDOM = buttons;
    buttons.forEach((button) => {
      let id = button.dataset.id;
      // console.log(id);
      let inCart = cart.find((item) => item.id === id);
      if (inCart) {
        button.innerHTML = "In Cart";
        button.disabled = true;
      }
      button.addEventListener("click", (event) => {
        event.target.innerHTML = "In Cart";
        event.target.disabled = true;
        //get product from products
        let cartItem = { ...Storage.getProduct(id), amount: 1 };
        // console.log(cartItem);

        //add product to the cart
        cart = [...cart, cartItem];
        //save cart in local storage
        Storage.saveCart(cart);
        //set cart  values
        this.setCartValues(cart);
        //display cart items
        this.addCartItem(cartItem);
        //show the cart
        this.showCart();
      });
    });
  }

  setCartValues(cart) {
    let tempTotal = 0;
    let itemsTotal = 0;
    cart.map((item) => {
      tempTotal += item.price * item.amount;
      itemsTotal += item.amount;
    });
    cartTotal.innerHTML = parseFloat(tempTotal.toFixed(2));
    cartItems.innerHTML = itemsTotal;
    // console.log(cartTotal, cartItems);
  }

  addCartItem(item) {
    const div = document.createElement("div");
    div.classList.add("cart-item");
    div.innerHTML = `
            <img src=${item.image} alt="product ">
            <div>
              <h4 name="title">${item.title}</h4>
              <h5 name="price">₹${item.price}</h5>
              <span class="remove-item" data-id=${item.id}>remove</span>
            </div>
          <div>
            <i class="fas fa-chevron-up" data-id=${item.id}></i>
            <p class="item-amount" name="amount">${item.amount}</p>
            <i class="fas fa-chevron-down" data-id=${item.id}></i>
          </div>
          `;

    cartContent.appendChild(div);
    // console.log(cartContent);
  }

  showCart() {
    cartOverlay.classList.add("transparentBcg");
    cartDOM.classList.add("showCart");
  }

  setupAPP() {
    cart = Storage.getCart();
    this.setCartValues(cart);
    this.populateCart(cart);
    cartBtn.addEventListener("click", this.showCart);
    closeCartBtn.addEventListener("click", this.hideCart);
  }

  populateCart(cart) {
    cart.forEach((item) => this.addCartItem(item));
  }

  hideCart() {
    cartOverlay.classList.remove("transparentBcg");
    cartDOM.classList.remove("showCart");
  }

  cartLogic() {
    // CLEAR CART BUTTON
    clearCartBtn.addEventListener("click", () => {
      this.clearCart();
    });

    // CART FUNCTIONALITY
    cartContent.addEventListener("click", (event) => {
      if (event.target.classList.contains("remove-item")) {
        let removeItem = event.target;
        // console.log(removeItem);
        let id = removeItem.dataset.id;
        // console.log(removeItem.parentElement.parentElement);

        cartContent.removeChild(removeItem.parentElement.parentElement);
        this.removeItem(id);
      } else if (event.target.classList.contains("fa-chevron-up")) {
        let addAmount = event.target;
        let id = addAmount.dataset.id;
        // console.log(addAmount);
        let tempItem = cart.find((item) => item.id === id);
        tempItem.amount = tempItem.amount + 1;
        Storage.saveCart(cart);
        this.setCartValues(cart);
        addAmount.nextElementSibling.innerHTML = tempItem.amount;
      } else if (event.target.classList.contains("fa-chevron-down")) {
        let lowerAmount = event.target;
        let id = lowerAmount.dataset.id;
        let tempItem = cart.find((item) => item.id === id);
        tempItem.amount = tempItem.amount - 1;
        if (tempItem.amount > 0) {
          Storage.saveCart(cart);
          this.setCartValues(cart);
          lowerAmount.previousElementSibling.innerHTML = tempItem.amount;
        } else {
          cartContent.removeChild(this.removeItem.parentElement.parentElement);
          this.removeItem(id);
        }
      }
    });
  }

  clearCart() {
    // console.log(this);
    let cartItems = cart.map((item) => item.id);
    // console.log(cartItems);
    cartItems.forEach((id) => this.removeItem(id));
    // console.log(cartContent.children);
    while (cartContent.children.length > 0) {
      cartContent.removeChild(cartContent.children[0]);
    }
    this.hideCart();
  }

  removeItem(id) {
    cart = cart.filter((item) => item.id !== id);
    this.setCartValues(cart);
    Storage.saveCart(cart);
    let button = this.getSingleButton(id);
    button.disabled = false;
    button.innerHTML = `Order`;
  }

  getSingleButton(id) {
    return buttonsDOM.find((button) => button.dataset.id === id);
  }
}

// local Storage
class Storage {
  static saveProducts(products) {
    localStorage.setItem("products", JSON.stringify(products));
  }

  static getProduct(id) {
    let products = JSON.parse(localStorage.getItem("products"));
    return products.find((product) => product.id == id);
  }

  static saveCart(cart) {
    localStorage.setItem("cart", JSON.stringify(cart));
  }

  static getCart() {
    return localStorage.getItem("cart")
      ? JSON.parse(localStorage.getItem("cart"))
      : [];
  }
}

document.addEventListener("DOMContentLoaded", () => {
  const ui = new UI();
  const products = new Products();
  // SET UP APPLICATION
  ui.setupAPP();
  //   get all products
  products
    .getProducts()
    .then((products) => {
      ui.displayProducts(products);
      Storage.saveProducts(products);
    })
    .then(() => {
      ui.getBagButtons();
      ui.cartLogic();
    });
});
