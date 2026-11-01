// Oak & Ember Furniture: page interactions

// 1. Buttons that scroll to a section (View Products, Shop the Sale)
document.querySelectorAll("[data-scroll]").forEach((button) => {
  button.addEventListener("click", () => {
    const target = document.querySelector(button.dataset.scroll);
    if (target) target.scrollIntoView({ behavior: "smooth" });
  });
});

// 2. "Read More" in the About section shows or hides extra text
const aboutButton = document.getElementById("about-btn");
const aboutMore = document.getElementById("about-more");

aboutButton.addEventListener("click", () => {
  const isOpen = !aboutMore.hidden;
  aboutMore.hidden = isOpen;
  aboutButton.textContent = isOpen ? "Read More" : "Read Less";
  aboutButton.setAttribute("aria-expanded", String(!isOpen));
});

// 3. "Order Now" fills the product into the contact form and jumps there
const productField = document.getElementById("product-field");
const messageField = document.getElementById("message");
const nameField = document.getElementById("name");

document.querySelectorAll(".order-btn").forEach((button) => {
  button.addEventListener("click", () => {
    const product = button.dataset.product;
    productField.value = product;
    if (!messageField.value.trim()) {
      messageField.value = `Hello, I'd like to order the ${product}. Is it available, and when can it be delivered?`;
    }
    document.getElementById("contact").scrollIntoView({ behavior: "smooth" });
    // Wait for the scroll before moving focus, so the page doesn't jump
    setTimeout(() => nameField.focus({ preventScroll: true }), 600);
  });
});

// 4. Search box filters the product cards by name or description
const searchForm = document.getElementById("search-form");
const searchInput = document.getElementById("search-input");
const searchStatus = document.getElementById("search-status");
const productCards = document.querySelectorAll(".product .card-content .row");

function filterProducts(query) {
  const text = query.trim().toLowerCase();
  let matches = 0;

  productCards.forEach((card) => {
    const isMatch = card.textContent.toLowerCase().includes(text);
    card.classList.toggle("is-hidden", !isMatch);
    if (isMatch) matches++;
  });

  if (!text) {
    searchStatus.hidden = true;
    return;
  }
  searchStatus.hidden = false;
  searchStatus.innerHTML = matches
    ? `Showing ${matches} result${matches === 1 ? "" : "s"} for "<strong></strong>". <button type="button" class="clear-search">Show all</button>`
    : `No products match "<strong></strong>". <button type="button" class="clear-search">Show all</button>`;
  // Put the search text in with textContent so it can't inject HTML
  searchStatus.querySelector("strong").textContent = query.trim();
}

searchForm.addEventListener("submit", (event) => {
  event.preventDefault();
  filterProducts(searchInput.value);
  document.getElementById("product").scrollIntoView({ behavior: "smooth" });
});

searchStatus.addEventListener("click", (event) => {
  if (event.target.classList.contains("clear-search")) {
    searchInput.value = "";
    filterProducts("");
  }
});

// 5. Contact form: check the fields, send to Formspree, show a message
const contactForm = document.getElementById("contact-form");
const formStatus = document.getElementById("form-status");

function showStatus(message, type) {
  formStatus.textContent = message;
  formStatus.className = `form-status ${type}`;
}

contactForm.addEventListener("submit", async (event) => {
  event.preventDefault();

  if (!contactForm.checkValidity()) {
    const firstInvalid = contactForm.querySelector(":invalid");
    showStatus(`Please check this field: ${firstInvalid.placeholder}.`, "error");
    firstInvalid.focus();
    return;
  }

  if (contactForm.action.includes("YOUR_FORM_ID")) {
    showStatus("This demo form isn't connected to an inbox yet. See README.md to connect Formspree.", "error");
    return;
  }

  const submitButton = contactForm.querySelector(".submit");
  submitButton.disabled = true;
  submitButton.value = "Sending...";

  try {
    const response = await fetch(contactForm.action, {
      method: "POST",
      body: new FormData(contactForm),
      headers: { Accept: "application/json" },
    });

    if (response.ok) {
      contactForm.reset();
      showStatus("Thank you! Your message has been sent. We'll reply within one working day.", "success");
    } else {
      showStatus("Sorry, your message couldn't be sent. Please try again in a moment.", "error");
    }
  } catch (error) {
    showStatus("No internet connection. Please check your network and try again.", "error");
  } finally {
    submitButton.disabled = false;
    submitButton.value = "Send";
  }
});

// 6. Keep the footer year up to date
document.getElementById("year").textContent = new Date().getFullYear();
