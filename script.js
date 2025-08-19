document.addEventListener("DOMContentLoaded", () => {
    const form = document.getElementById("contactForm");
    const nameInput = document.getElementById("name");
    const emailInput = document.getElementById("email");
    const subjectInput = document.getElementById("subject");
    const messageInput = document.getElementById("message");

    const errorContainer = document.createElement("div");
    errorContainer.id = "error-message";
    errorContainer.classList.add("error-messages");
    form.appendChild(errorContainer);

    // Sanitizer: strips < >
    const sanitizeInput = (input) => input.replace(/</g, "&lt;").replace(/>/g, "&gt;");

    // Regex rules
    const nameRegex = /^[A-Za-z\s]+$/; 
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    // Validation helpers
    const validateName = () => {
        let errors = [];
        if (!nameRegex.test(nameInput.value.trim())) {
            errors.push("❌ Name must only contain letters and spaces.");
        }
        if (nameInput.value.trim().length < 6) {
            errors.push("❌ Name must be at least 6 characters long.");
        }
        return errors;
    };

    const validateEmail = () => {
        return emailRegex.test(emailInput.value.trim())
            ? []
            : ["❌ Please enter a valid email address."];
    };

    const validateSubject = () => {
        return subjectInput.value.trim().length >= 3
            ? []
            : ["❌ Subject must be at least 3 characters long."];
    };

    const validateMessage = () => {
        return messageInput.value.trim().length >= 10
            ? []
            : ["❌ Message must be at least 10 characters long."];
    };

    const showErrors = (errors) => {
        if (errors.length > 0) {
            errorContainer.innerHTML = errors.join("<br>");
            errorContainer.style.color = "red";
            errorContainer.style.opacity = "1";
        } else {
            errorContainer.innerHTML = "";
            errorContainer.style.opacity = "0";
        }
    };

    const showSuccess = () => {
        errorContainer.innerHTML = "✅ Form submitted successfully!";
        errorContainer.style.color = "green";
        errorContainer.style.opacity = "1";

        setTimeout(() => {
            errorContainer.style.transition = "opacity 0.5s ease-out";
            errorContainer.style.opacity = "0";
        }, 3000);
    };

    // Live validation
    nameInput.addEventListener("input", () => showErrors(validateName()));
    emailInput.addEventListener("input", () => showErrors(validateEmail()));

    // Submit handler
    form.addEventListener("submit", (e) => {
        e.preventDefault();

        let errors = [
            ...validateName(),
            ...validateEmail(),
            ...validateSubject(),
            ...validateMessage(),
        ];

        if (errors.length > 0) {
            showErrors(errors);
            form.classList.add("shake");
            setTimeout(() => form.classList.remove("shake"), 500);
        } else {
            const sanitizedData = {
                name: nameInput.value.trim(),
                email: emailInput.value.trim(),
                subject: sanitizeInput(subjectInput.value.trim()),
                message: sanitizeInput(messageInput.value.trim()),
            };

            console.log(sanitizedData);
            showSuccess();

            // Reset form after success
            form.reset();
            [nameInput, emailInput, subjectInput, messageInput].forEach((input) =>
                input.classList.remove("valid", "invalid")
            );
        }
    });
});