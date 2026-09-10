document.addEventListener('DOMContentLoaded', () => {
    // 1. Typewriter Animation Effect
    const roles = [
        "Software Development Engineer", 
        "Java & Spring Boot Developer", 
        "Flutter Mobile App Developer", 
        "Problem Solver"
    ];
    let roleIndex = 0;
    let charIndex = 0;
    let isDeleting = false;
    const typewriterElement = document.querySelector('.typewriter-text');

    function typeEffect() {
        if (!typewriterElement) return;

        const currentRole = roles[roleIndex];
        
        if (isDeleting) {
            typewriterElement.textContent = currentRole.substring(0, charIndex - 1);
            charIndex--;
        } else {
            typewriterElement.textContent = currentRole.substring(0, charIndex + 1);
            charIndex++;
        }

        let typeSpeed = isDeleting ? 50 : 100;

        if (!isDeleting && charIndex === currentRole.length) {
            typeSpeed = 2000; // Pause at full word
            isDeleting = true;
        } else if (isDeleting && charIndex === 0) {
            isDeleting = false;
            roleIndex = (roleIndex + 1) % roles.length;
            typeSpeed = 500; // Pause before typing next word
        }

        setTimeout(typeEffect, typeSpeed);
    }

    // Start Typewriter
    typeEffect();

    // 2. Smooth Scrolling for Navigation Links
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            const target = document.querySelector(this.getAttribute('href'));
            if (target) {
                target.scrollIntoView({
                    behavior: 'smooth'
                });
            }
        });
    });

    // 3. Spring Boot Contact Form Handler
    const contactForm = document.getElementById('contactForm');
    const formStatus = document.getElementById('formStatus');

    if (contactForm) {
        contactForm.addEventListener('submit', async (e) => {
            e.preventDefault();

            // UI Feedback: Sending State
            if (formStatus) {
                formStatus.style.color = "#38bdf8";
                formStatus.innerText = "Sending message to Gmail...";
            }

            // Input Data Extraction
            const formData = {
                name: document.getElementById('name').value,
                email: document.getElementById('email').value,
                message: document.getElementById('message').value
            };

            try {
                // REST API Call to Spring Boot Backend
                const response = await fetch('/api/contact', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify(formData)
                });

                const result = await response.json();

                if (response.ok) {
                    // Success State
                    if (formStatus) {
                        formStatus.style.color = "#4ade80"; // Light Green
                        formStatus.innerText = result.message || "Message sent successfully!";
                    }
                    contactForm.reset();
                } else {
                    throw new Error("Server error");
                }
            } catch (error) {
                // Error State
                if (formStatus) {
                    formStatus.style.color = "#f87171"; // Soft Red
                    formStatus.innerText = "Failed to send message. Please try again later.";
                }
            }
        });
    }

    // 4. Fetch Visitor Count on Page Load
    fetch('/api/visitor-count')
        .then(response => response.json())
        .then(data => {
            const countElement = document.getElementById('visitorCount');
            if (countElement && data.totalVisitors) {
                countElement.innerText = data.totalVisitors;
            }
        })
        .catch(err => {
            console.error("Could not fetch visitor count", err);
        });

    console.log("Portfolio JavaScript (Typewriter, Mailer & Visitor Analytics) loaded successfully!");
});