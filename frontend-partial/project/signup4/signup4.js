document.addEventListener('DOMContentLoaded', function() {
    // Get form elements
    const form = document.querySelector('.preferences-form');
    const prevButton = document.querySelector('.prev-button');
    const nextButton = document.querySelector('.next-button');
    const yesButton = document.getElementById('yes-button');
    const noButton = document.getElementById('no-button');
    
    // Track selected team option
    let teamOption = null;
    
    // Add event listeners to the option buttons
    yesButton.addEventListener('click', function() {
        yesButton.classList.add('selected');
        noButton.classList.remove('selected');
        teamOption = 'yes';
    });
    
    noButton.addEventListener('click', function() {
        noButton.classList.add('selected');
        yesButton.classList.remove('selected');
        teamOption = 'no';
    });
    
    // Add event listener to the next button
    nextButton.addEventListener('click', function() {
        // Get form data
        const formData = {
            lookingForTeam: yesButton.classList.contains('selected') ? 'yes' : 
                           noButton.classList.contains('selected') ? 'no' : null
        };

        // Basic validation
        if (!formData.lookingForTeam) {
            alert('Please select whether you are looking for a team');
            return;
        }

        // Store the form data
        localStorage.setItem('preferencesData', JSON.stringify(formData));

        // Navigate to signupfinal
        window.location.href = '../signupfinal/signupfinal.html';
    });
    
    // Add event listener to the prev button
    prevButton.addEventListener('click', function() {
        window.location.href = '../signup3/signup3.html';
    });
    
    // Optional: Add form validation
    form.addEventListener('submit', function(event) {
        event.preventDefault();
        // Validate form fields here
    });
});