document.addEventListener('DOMContentLoaded', function() {
    // Get elements
    const photoUpload = document.querySelector('.photo-upload');
    const avatarOptions = document.querySelectorAll('.avatar-option');
    const addFriendButtons = document.querySelectorAll('.add-friend-btn');
    const prevButton = document.querySelector('.prev-button');
    const launchButton = document.querySelector('.launch-button');
    
    // Photo upload functionality
    photoUpload.addEventListener('click', function() {
        // In a real application, this would open a file picker
        console.log('Opening file picker for photo upload...');
    });
    
    // Avatar selection functionality
    avatarOptions.forEach(function(option) {
        option.addEventListener('click', function() {
            // Remove selected class from all options
            avatarOptions.forEach(opt => opt.classList.remove('selected'));
            // Add selected class to clicked option
            this.classList.add('selected');
            console.log('Avatar selected');
        });
    });
    
    // Add friend functionality
    addFriendButtons.forEach(function(button) {
        button.addEventListener('click', function() {
            if (this.textContent === 'Add Friend') {
                this.textContent = 'Added';
                this.style.backgroundColor = '#4CAF50';
            } else {
                this.textContent = 'Add Friend';
                this.style.backgroundColor = '#4DB6AC';
            }
        });
    });
    
    // Navigation buttons
    prevButton.addEventListener('click', function() {
        window.location.href = '../signup4/signup4.html';
    });
    
    launchButton.addEventListener('click', function() {
        // Store any final data if needed
        localStorage.setItem('signupComplete', 'true');
        // Navigate to dashboard
        window.location.href = '../Dashboard/dashboard.html';
    });
});