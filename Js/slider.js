export class Slider {
  constructor({
    type,
    containerSelector,
    itemSelector,
    nextBtnSelector,
    prevBtnSelector,
    visibleItems = 1,
  }) {
    this.type = type; // 'image' or 'card'
    this.container = document.querySelector(containerSelector);
    this.items = this.container.querySelectorAll(itemSelector);
    this.nextBtn = document.querySelector(nextBtnSelector);
    this.prevBtn = document.querySelector(prevBtnSelector);
    this.visibleItems = visibleItems;
    this.currentIndex = 0;
    this.totalItems = this.items.length;
    // Add event listeners
    this.nextBtn.addEventListener("click", () => this.nextSlide());
    this.prevBtn.addEventListener("click", () => this.prevSlide());

    // Initial setup
    this.updateSlider();
  }

  nextSlide() {
    if (this.type === "image") {
      // Loop back to the first slide
      this.currentIndex = (this.currentIndex + 1) % this.totalItems;
    } else if (this.type === "card") {
      if (this.currentIndex < this.totalItems - this.visibleItems) {
        this.currentIndex++;
      }
    }
    this.updateSlider();
  }

  prevSlide() {
    if (this.type === "image") {
      // Loop back to the last slide
      this.currentIndex =
        (this.currentIndex - 1 + this.totalItems) % this.totalItems;
    } else if (this.type === "card") {
      if (this.currentIndex > 0) {
        this.currentIndex--;
      }
    }
    this.updateSlider();
  }

  updateSlider() {
    if (this.type === "image") {
      // Remove 'active' class from all slides
      this.items.forEach((item) => item.classList.remove("active"));
      // Add 'active' class to the current slide
      this.items[this.currentIndex].classList.add("active");
    } else if (this.type === "card") {
      const translateX = -this.currentIndex * this.items[0].offsetWidth;
      this.container.style.transform = `translateX(${translateX}px)`;
    }
  }
}
