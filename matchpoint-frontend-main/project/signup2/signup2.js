document.addEventListener('DOMContentLoaded', function() {
    // Get form elements
    const form = document.querySelector('.profile-form');
    const nextButton = document.querySelector('.next-button');
    
    // Add event listener to the next button
    nextButton.addEventListener('click', function() {
        // Get form data
        const formData = {
            name: document.getElementById('name').value,
            middleName: document.getElementById('middle-name').value,
            lastName: document.getElementById('last-name').value,
            nickname: document.getElementById('nickname').value,
            bio: document.getElementById('bio').value,
            tags: document.getElementById('tags').value
        };
        
        // Basic validation
        if (!formData.name || !formData.lastName) {
            alert('Please fill in at least your first and last name');
            return;
        }
        
        // Store the form data
        localStorage.setItem('profileData', JSON.stringify(formData));
        
        // Navigate to signup3
        window.location.href = '../signup3/signup3.html';
    });
    
    // Optional: Add form validation
    form.addEventListener('submit', function(event) {
        event.preventDefault();
        // Validate form fields here
    });
});