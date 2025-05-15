document.addEventListener('DOMContentLoaded', function() {
    const form = document.querySelector('form');
    const createAccountBtn = document.getElementById('createAccount');
    
    createAccountBtn.addEventListener('click', function() {
        const email = form.querySelector('input[type="email"]').value;
        const password = form.querySelector('input[type="password"]').value;
        const termsChecked = form.querySelector('#terms').checked;
        
        if (!email || !password) {
            alert('Please fill in all fields');
            return;
        }
        
        if (!termsChecked) {
            alert('Please agree to the Terms of Service');
            return;
        }
        
        // Store the form data (in a real app, you would send this to a server)
        localStorage.setItem('userEmail', email);
        
        // Navigate to signup2 page
        window.location.href = '../signup2/signup2.html';
    });
    
    // Social login buttons functionality
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