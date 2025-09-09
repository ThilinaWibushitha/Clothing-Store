export class Cart {
  constructor(cartContainerId, emptyMessageId, clearButtonId) {
    this.cartContainer = document.getElementById(cartContainerId);
    this.emptyCartMessage = document.getElementById(emptyMessageId);
    this.clearCartButton = document.getElementById(clearButtonId);

    this.cart = JSON.parse(localStorage.getItem("cart")) || [];

    this.init();
  }

  // Initialize the cart
  init() {
    this.renderCartItems();
    this.setupClearCartButton();
  }

  // Render cart items
  renderCartItems() {
    if (this.cart.length === 0) {
      this.emptyCartMessage.style.display = "block";
      this.clearCartButton.style.display = "none";
    } else {
      this.emptyCartMessage.style.display = "none";
      this.clearCartButton.style.display = "block";

      this.cart.forEach((item) => {
        const cartItem = this.createCartItem(item);
        this.cartContainer.appendChild(cartItem);
      });
    }
  }
  calculateTotalPrice() {
    const totalPrice = this.cart.reduce((total, item) => {
      return total + item.price * item.quantity;
    }, 0);

    this.totalPriceEl.textContent = `Total Price: Rs. ${totalPrice.toFixed(2)}`;
  }
  // Create a single cart item element
  createCartItem(item) {
    const cartItem = document.createElement("div");
    cartItem.classList.add("cart-item");

    cartItem.innerHTML = `
      <img src="${item.imgSrc}" alt="${item.title}" class="cart-item-img" />
      <div>
        <h4>${item.title}</h4>
        <p>${item.price}</p>
      </div>
    `;

    return cartItem;
  }

  // Setup clear cart button
  setupClearCartButton() {
    this.clearCartButton.addEventListener("click", () => {
      localStorage.removeItem("cart");
      location.reload();
    });
  }
}
