document.addEventListener('DOMContentLoaded', function() {
    // Get form elements
    const form = document.querySelector('.verification-form');
    const prevButton = document.querySelector('.prev-button');
    const nextButton = document.querySelector('.next-button');
    const dobInput = document.getElementById('dob');
    
    // Add event listener to the next button
    nextButton.addEventListener('click', function() {
        // Get form data
        const formData = {
            phone: document.getElementById('phone').value,
            dob: document.getElementById('dob').value,
            location: document.getElementById('location').value
        };

        // Basic validation
        if (!formData.phone || !formData.dob || !formData.location) {
            alert('Please fill in all fields');
            return;
        }

        // Store the form data
        localStorage.setItem('verificationData', JSON.stringify(formData));

        // Navigate to signup4
        window.location.href = '../signup4/signup4.html';
    });
    
    // ✅ Add event listener to the prev button (now with navigation)
    prevButton.addEventListener('click', function() {
        // Navigate back to signup2
        window.location.href = '../signup2/signup2.html';
    });
    
    // Format date input as DD/MM/YYYY
    dobInput.addEventListener('input', function(e) {
        let value = e.target.value.replace(/\D/g, '');
        if (value.length > 8) value = value.substr(0, 8);
        if (value.length >= 4) {
            value = value.substr(0, 2) + '/' + value.substr(2, 2) + '/' + value.substr(4);
        } else if (value.length >= 2) {
            value = value.substr(0, 2) + '/' + value.substr(2);
        }
        e.target.value = value;
    });

    // Optional: Add form validation
    form.addEventListener('submit', function(event) {
        event.preventDefault();
        // Validate form fields here
    });
});
