document.addEventListener("DOMContentLoaded", () => {
    const form = document.querySelector(".contact-form form");
    const nameInput = form.querySelector('input[placeholder="Your Name"]');
    const emailInput = form.querySelector('input[placeholder="Your Email"]');
    const subjectInput = form.querySelector('input[placeholder="Subject"]');
    const messageInput = form.querySelector('textarea[placeholder="Your Message"]');

    const errorContainer = document.createElement("div");
    errorContainer.classList.add("error-messages");
    form.appendChild(errorContainer);

    // Sanitizer: strips < > tags
    const sanitizeInput = (input) => input.replace(/</g, "&lt;").replace(/>/g, "&gt;");

    // Regex checks
    const nameRegex = /^[A-Za-z\s]{6,}$/; // At least 6 letters, no numbers/symbols
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    // Validation function
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

    // Live validation
    nameInput.addEventListener("input", () => {
        validateField(nameInput, nameRegex, "Name must be at least 6 letters, no numbers/symbols.");
    });

    emailInput.addEventListener("input", () => {
        validateField(emailInput, emailRegex, "Please enter a valid email address.");
    });

    // Final submit
    form.addEventListener("submit", (e) => {
        e.preventDefault();

        const nameValid = validateField(nameInput, nameRegex, "Name must be at least 6 letters.");
        const emailValid = validateField(emailInput, emailRegex, "Enter a valid email.");

        if (nameValid && emailValid) {
            const sanitizedData = {
                name: nameInput.value.trim(),
                email: emailInput.value.trim(),
                subject: sanitizeInput(subjectInput.value.trim()),
                message: sanitizeInput(messageInput.value.trim()),
            };

            console.log(sanitizedData);
            alert("Form submitted successfully! Check console for sanitized data.");
        } else {
            form.classList.add("shake");
            setTimeout(() => form.classList.remove("shake"), 500);
        }
    });
});