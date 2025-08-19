document.addEventListener("DOMContentLoaded", function () {
    const form = document.querySelector(".contact-form form");

    // Basic sanitizer: strips HTML tags
    function sanitizeInput(input) {
        return input.replace(/</g, "&lt;").replace(/>/g, "&gt;");
    }

    form.addEventListener("submit", function (event) {
        event.preventDefault(); // stop default form submission

        const name = form.querySelector('input[placeholder="Your Name"]').value.trim();
        const email = form.querySelector('input[placeholder="Your Email"]').value.trim();
        const subject = sanitizeInput(form.querySelector('input[placeholder="Subject"]').value.trim());
        const message = sanitizeInput(form.querySelector('textarea[placeholder="Your Message"]').value.trim());

        // For demo: log to console
        console.log({
            name: name,
            email: email,
            subject: subject,
            message: message
        });

        alert("Form data captured! Check console for sanitized output.");
    });
});

document.addEventListener("DOMContentLoaded", () => {
    const form = document.querySelector("form");
    const nameInput = document.querySelector("#name");
    const emailInput = document.querySelector("#email");
    const errorContainer = document.createElement("div");
    errorContainer.classList.add("error-messages");
    form.appendChild(errorContainer);

    const nameRegex = /^[A-Za-z\s]{6,}$/; // Only letters/spaces, min 6
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/; // Basic email check

    // Validate fields on input
    const validateField = (input, regex, errorMsg) => {
        if (!regex.test(input.value.trim())) {
            input.classList.add("invalid");
            input.classList.remove("valid");
            showError(errorMsg);
            return false;
        } else {
            input.classList.remove("invalid");
            input.classList.add("valid");
            clearError();
            return true;
        }
    };

    const showError = (message) => {
        errorContainer.innerText = message;
        errorContainer.style.opacity = "1";
    };

    const clearError = () => {
        errorContainer.innerText = "";
        errorContainer.style.opacity = "0";
    };

    nameInput.addEventListener("input", () => {
        validateField(nameInput, nameRegex, "Name must be at least 6 letters, no numbers/symbols.");
    });

    emailInput.addEventListener("input", () => {
        validateField(emailInput, emailRegex, "Please enter a valid email address.");
    });

    form.addEventListener("submit", (e) => {
        e.preventDefault();
        const nameValid = validateField(nameInput, nameRegex, "Name must be at least 6 letters.");
        const emailValid = validateField(emailInput, emailRegex, "Enter a valid email.");
        
        if (nameValid && emailValid) {
            form.classList.add("submitted");
            alert("Form submitted successfully!");
        } else {
            form.classList.add("shake");
            setTimeout(() => form.classList.remove("shake"), 500);
        }
    });
});