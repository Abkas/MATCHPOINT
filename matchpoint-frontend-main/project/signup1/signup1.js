document.addEventListener('DOMContentLoaded', function() {
    const form = document.getElementById('loginForm');
    const createAccountBtn = document.getElementById('createAccount');
    const messageContainer = document.getElementById('message-container');

    createAccountBtn.addEventListener('click', async function(e) {
        e.preventDefault(); // Prevent form submission

        const email = form.querySelector('#email').value;
        const password = form.querySelector('#password').value;
        const username = form.querySelector('#username').value;
        const role = form.querySelector('input[name="role"]:checked').value;
        const termsChecked = form.querySelector('#terms').checked;

        // Clear previous messages
        messageContainer.textContent = '';

        if (!email || !password || !username) {
            messageContainer.textContent = 'Please fill in all fields.';
            return;
        }
        if (!termsChecked) {
            messageContainer.textContent = 'You must agree to the Terms of Service.';
            return;
        }

        try {
            const res = await fetch('http://localhost:8000/api/v1/users/sign-up', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ email, password, username, role })
            });
            console.log(res)


            const data = await res.json();
            if (res.ok) {
                // Signup successful, redirect to next step
                window.location.href = '../signup2/signup2.html';
            } else {
                // Show error and DO NOT redirect
                messageContainer.textContent = data.message || 'Signup failed. Please try again.';
            }
        } catch (err) {
            messageContainer.textContent = 'Network error. Please try again.';
        }
    });

    // Social login buttons functionality (optional)
    const socialButtons = document.querySelectorAll('.social-icon');
    socialButtons.forEach(button => {
        button.addEventListener('click', function(e) {
            e.preventDefault();
            const platform = this.classList.contains('facebook') ? 'Facebook' :
                            this.classList.contains('twitter') ? 'Twitter' : 'Google';
            alert(`${platform} login functionality will be implemented here`);
        });
    });
});