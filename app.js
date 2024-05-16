document.addEventListener("DOMContentLoaded", () => {
  const cart = document.querySelector(".nav-bar .cart");
  const cartSidebar = document.querySelector(".cart-sidebar");
  const closeCart = document.querySelector(".close-cart");
  const burger = document.querySelector(".burger");
  const menuSidebar = document.querySelector(".menu-sidebar");
  const closeMenu = document.querySelector(".close-menu");
  const cartItemsTotal = document.querySelector(".cart-items-total");
  const cartUi = document.querySelector(".cart-sidebar .cart");
  const totalDiv = document.querySelector(".total-sum");
  const clearBtn = document.querySelector(".clear-cart-btn");
  const cartContent = document.querySelector(".cart-content");

  let Cart = [];
  let buttonsDOM = [];

  cart.addEventListener("click", function() {
    cartSidebar.style.transform = "translate(0%)";
    const bodyOverlay = document.createElement("div");
    bodyOverlay.classList.add("overlay");
    setTimeout(function() {
      document.querySelector("body").append(bodyOverlay);
    });
  });

  closeCart.addEventListener("click", function() {
    cartSidebar.style.transform = "translateX(100%)";
    const bodyOverlay = document.querySelector(".overlay");
    if (bodyOverlay) {
      document.querySelector("body").removeChild(bodyOverlay);
    }
  });

  burger.addEventListener("click", function() {
    menuSidebar.style.transform = "translate(0%)";
  });

  closeMenu.addEventListener("click", () => {
    menuSidebar.style.transform = "translateX(-100%)";
  });

  class Product {
    async getProducts() {
      const response = await fetch("blogs.json");
      const data = await response.json();
      let products = data.blogs;
      products = products.map(item => {
        const { title, price } = item.fields;
        const { id } = item.sys;
        const image = item.fields.image.fields.file.url;
        return { title, price, id, image };
      });
      return products;
    }
  }

  class UI {
    displayProducts(products) {
      let result = "";
      products.forEach(product => {
        const productDiv = document.createElement("div");
        productDiv.classList.add("product-card");
        productDiv.innerHTML = `
          <img src="${product.image}" alt="product">
          <span class="add-to-cart" data-id="${product.id}">
            <i class="fa fa-cart-plus fa-1x" style="margin-right:0.1em; font-size: 1em;"></i>
            Add to cart
          </span>
          <div class="product-name">${product.title}</div>
          <div class="product-pricing">${product.price}</div>`;
        const p = document.querySelector(".each-blog");
        p.append(productDiv);
      });
    }

    getButtons() {
      const btns = document.querySelectorAll(".add-to-cart");
      buttonsDOM = Array.from(btns);
      btns.forEach(btn => {
        let id = btn.dataset.id;
        let inCart = Cart.find(item => item.id === id);
        if (inCart) {
          btn.innerHTML = "In cart";
          btn.disabled = true;
        }
        btn.addEventListener("click", (e) => {
          e.currentTarget.innerHTML = "In cart ";
          e.currentTarget.style.color = "white";
          e.currentTarget.style.pointerEvents = "none";
          let cartItem = { ...Storage.getStorageProducts(id), 'amount': 1 };
          Cart.push(cartItem);
          Storage.saveCart(Cart);
          this.setCartValues(Cart);
          this.addCartItem(cartItem);
        });
      });
    }

    setCartValues(cart) {
      let tempTotal = 0;
      let itemsTotal = 0;
      cart.map(item => {
        tempTotal += (item.price * item.amount);
        itemsTotal += item.amount;
      });
      tempTotal = parseFloat(tempTotal.toFixed(2));
      cartItemsTotal.innerHTML = itemsTotal;
      totalDiv.querySelector(".total-amount").innerHTML = tempTotal;
    }

    addCartItem(cartItem) {
      let cartItemUi = document.createElement("div");
      cartItemUi.classList.add("cart-product");
      cartItemUi.innerHTML = `
        <div class="product-image">
          <img src="${cartItem.image}" alt="product">
        </div>
        <div class="cart-product-content">
          <div class="cart-product-name"><h3>${cartItem.title}</h3></div>
          <div class="cart-product-price"><h3>$${cartItem.price}</h3></div>
        </div>`;
      cartContent.append(cartItemUi);
    }
  }

  class Storage {
    static getStorageProducts(id) {
      let products = JSON.parse(localStorage.getItem('products'));
      return products.find(product => product.id === id);
    }

    static saveCart(cart) {
      localStorage.setItem('cart', JSON.stringify(cart));
    }
  }

  const ui = new UI();
  const products = new Product();

  products.getProducts().then(products => {
    ui.displayProducts(products);
    Storage.saveProducts(products);
  }).then(() => {
    ui.getButtons();
  });
});
