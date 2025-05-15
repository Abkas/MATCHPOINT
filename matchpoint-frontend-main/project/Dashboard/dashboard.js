document.addEventListener('DOMContentLoaded', function() {
    // Toggle active class for sidebar menu items
    const sidebarItems = document.querySelectorAll('.sidebar-menu li');
    
    sidebarItems.forEach(item => {
        item.addEventListener('click', function() {
            // Remove active class from all items
            sidebarItems.forEach(i => i.classList.remove('active'));
            // Add active class to clicked item
            this.classList.add('active');
            
            // Check if this is the profile menu item
            const link = this.querySelector('a');
            if (link && link.textContent === 'Profile') {
                window.location.href = '../profile/profile.html';
            }
        });
    });
    
    // Show more badges functionality
    const showMoreBtn = document.querySelector('.show-more-btn');
    
    showMoreBtn.addEventListener('click', function() {
        alert('Loading more badges...');
        // In a real application, this would load more badges
    });
    
    // Notification icon click
    const notificationIcon = document.querySelector('.notification-icon');
    
    notificationIcon.addEventListener('click', function() {
        alert('Notifications panel would open here');
    });
    
    // Profile icon click
    const profileIcon = document.querySelector('.profile-icon');
    
    profileIcon.addEventListener('click', function() {
        window.location.href = '../profile/profile.html';
    });
    
    // Make table rows clickable
    const tableRows = document.querySelectorAll('.matches-table tbody tr');
    
    tableRows.forEach(row => {
        row.addEventListener('click', function() {
            const date = this.cells[0].textContent;
            const time = this.cells[1].textContent;
            alert(`You clicked on match played on ${date} at ${time}`);
            // In a real application, this would navigate to match details
        });
        
        // Add hover effect
        row.style.cursor = 'pointer';
        row.addEventListener('mouseenter', function() {
            this.style.backgroundColor = '#f9f9f9';
        });
        row.addEventListener('mouseleave', function() {
            this.style.backgroundColor = '';
        });
    });
});
