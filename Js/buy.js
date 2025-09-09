export class PaymentForm {
  constructor(formId, feedbackId) {
    this.form = document.getElementById(formId);
    this.feedback = document.getElementById(feedbackId);

    this.cardNumberRegex = /^\d{16}$/; // 16-digit card number
    this.expDateRegex = /^(0[1-9]|1[0-2])\/\d{2}$/; // MM/YY format
    this.cvCodeRegex = /^\d{3,4}$/; // 3 or 4-digit CV code

    this.init();
  }

  init() {
    this.form.addEventListener("submit", (e) => this.handleSubmit(e));
  }

  handleSubmit(e) {
    e.preventDefault();

    // Get input values
    const cardNumber = document.getElementById("card-number").value.trim();
    const expDate = document.getElementById("exp-date").value.trim();
    const cvCode = document.getElementById("cv-code").value.trim();
    const cardOwner = document.getElementById("card-owner").value.trim();

    // Clear previous feedback
    this.feedback.textContent = "";

    // Validate inputs
    if (!this.validateCardNumber(cardNumber)) return;
    if (!this.validateExpDate(expDate)) return;
    if (!this.validateCvCode(cvCode)) return;
    if (!this.validateCardOwner(cardOwner)) return;

    // Simulate payment processing
    this.processPayment();
  }

  validateCardNumber(cardNumber) {
    if (!this.cardNumberRegex.test(cardNumber)) {
      this.showFeedback("Invalid card number. Please enter 16 digits.", "red");
    }
    return true;
  }
}
