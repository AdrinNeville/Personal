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

document.addEventListener("DOMContentLoaded", function () {
    const form = document.querySelector(".contact-form form");

    form.addEventListener("submit", function (e) {
        let valid = true;

        // Name validation (letters only, min 6 characters)
        const nameInput = form.querySelector('input[name="name"]');
        const nameValue = nameInput.value.trim();
        const nameRegex = /^[A-Za-z]{6,}$/; 
        if (!nameRegex.test(nameValue)) {
            alert("Name must be at least 6 letters long and contain only alphabets.");
            valid = false;
        }

        // Email validation
        const emailInput = form.querySelector('input[name="email"]');
        const emailValue = emailInput.value.trim();
        const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/; 
        if (!emailRegex.test(emailValue)) {
            alert("Please enter a valid email address.");
            valid = false;
        }

        if (!valid) {
            e.preventDefault(); // stop submission
        }
    });
});