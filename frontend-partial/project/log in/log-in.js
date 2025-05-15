document.addEventListener('DOMContentLoaded', function() {
    const form = document.querySelector('form');
    
    form.addEventListener('submit', function(e) {
        e.preventDefault();
        
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
        
        // In a real application, you would send this data to a server
        console.log('Form submitted:', { email, password, termsChecked });
        alert('Account created successfully!');
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