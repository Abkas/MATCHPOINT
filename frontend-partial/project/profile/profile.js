document.addEventListener('DOMContentLoaded', function() {
    // Edit buttons functionality
    const editButtons = document.querySelectorAll('.edit-btn');
    
    editButtons.forEach(button => {
        button.addEventListener('click', function() {
            const section = this.closest('.tags-section, .personal-info-card');
            const sectionName = section.classList.contains('tags-section') ? 'tags' : 'personal info';
            
            alert(`Edit ${sectionName} functionality will be implemented here`);
        });
    });
    
    // Show all friends button
    const showAllBtn = document.querySelector('.show-all-btn');
    
    showAllBtn.addEventListener('click', function() {
        alert('Show all friends functionality will be implemented here');
    });
    
    // Navigation active state
    const navLinks = document.querySelectorAll('nav ul li a');
    
    navLinks.forEach(link => {
        link.addEventListener('click', function() {
            // Remove active class from all nav links
            navLinks.forEach(l => l.classList.remove('active-nav'));
            // Add active class to clicked link
            this.classList.add('active-nav');
        });
    });
    
    // Sidebar active state
    const sidebarLinks = document.querySelectorAll('.sidebar ul li a');
    
    sidebarLinks.forEach(link => {
        link.addEventListener('click', function() {
            // Remove active class from all sidebar links
            sidebarLinks.forEach(l => l.classList.remove('active'));
            // Add active class to clicked link
            this.classList.add('active');
        });
    });
    
    // Responsive menu toggle (for mobile view)
    function createMobileMenu() {
        if (window.innerWidth <= 452 && !document.querySelector('.mobile-menu-toggle')) {
            const header = document.querySelector('header');
            const nav = document.querySelector('nav');
            
            const menuToggle = document.createElement('button');
            menuToggle.className = 'mobile-menu-toggle';
            menuToggle.innerHTML = `
                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                    <line x1="3" y1="12" x2="21" y2="12"></line>
                    <line x1="3" y1="6" x2="21" y2="6"></line>
                    <line x1="3" y1="18" x2="21" y2="18"></line>
                </svg>
            `;
            
            menuToggle.addEventListener('click', function() {
                nav.style.display = nav.style.display === 'block' ? 'none' : 'block';
            });
            
            header.insertBefore(menuToggle, nav);
        }
    }
    
    // Call on load
    createMobileMenu();
    
    // Call on resize
    window.addEventListener('resize', createMobileMenu);
});