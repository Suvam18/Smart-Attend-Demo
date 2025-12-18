// Sidebar Menu Functionality
document.addEventListener('DOMContentLoaded', function() {
    const menuToggle = document.getElementById('menu-toggle');
    const sidebarClose = document.getElementById('sidebar-close');
    const sidebar = document.getElementById('sidebar');
    const backdrop = document.getElementById('backdrop');
    const sidebarNavItems = document.querySelectorAll('.sidebar-nav-item');
    
    // Function to open the sidebar
    function openSidebar() {
        sidebar.classList.add('active');
        backdrop.classList.add('active');
    }
    
    // Function to close the sidebar
    function closeSidebar() {
        sidebar.classList.remove('active');
        backdrop.classList.remove('active');
    }
    
    // Toggle sidebar when menu button is clicked
    menuToggle.addEventListener('click', openSidebar);
    
    // Close sidebar when close button is clicked
    sidebarClose.addEventListener('click', closeSidebar);
    
    // Close sidebar when backdrop is clicked
    backdrop.addEventListener('click', closeSidebar);
    
    // Handle navigation item clicks
    sidebarNavItems.forEach(item => {
        item.addEventListener('click', function(e) {
            // Remove active class from all items
            sidebarNavItems.forEach(navItem => {
                navItem.classList.remove('active');
            });
            
            // Add active class to clicked item
            this.classList.add('active');
            
            // Close sidebar after a short delay
            setTimeout(closeSidebar, 300);
        });
    });
    
    // Hero Slider Functionality
    const slides = document.querySelectorAll('.hero-slide');
    const dots = document.querySelectorAll('.hero-dot');
    const prevBtn = document.querySelector('.hero-prev');
    const nextBtn = document.querySelector('.hero-next');
    let currentSlide = 0;
    let slideInterval;
    
    // Function to show a specific slide
    function showSlide(index) {
        // Hide all slides
        slides.forEach(slide => slide.classList.remove('active'));
        dots.forEach(dot => dot.classList.remove('active'));
        
        // Show the current slide
        slides[index].classList.add('active');
        dots[index].classList.add('active');
        currentSlide = index;
    }
    
    // Function to show the next slide
    function nextSlide() {
        let index = (currentSlide + 1) % slides.length;
        showSlide(index);
    }
    
    // Function to show the previous slide
    function prevSlide() {
        let index = (currentSlide - 1 + slides.length) % slides.length;
        showSlide(index);
    }
    
    // Function to start the automatic slide show
    function startSlideShow() {
        slideInterval = setInterval(nextSlide, 5000);
    }
    
    // Function to stop the automatic slide show
    function stopSlideShow() {
        clearInterval(slideInterval);
    }
    
    // Add click event to dots
    dots.forEach((dot, index) => {
        dot.addEventListener('click', () => {
            showSlide(index);
            stopSlideShow();
            startSlideShow();
        });
    });
    
    // Add click event to prev/next buttons
    prevBtn.addEventListener('click', () => {
        prevSlide();
        stopSlideShow();
        startSlideShow();
    });
    
    nextBtn.addEventListener('click', () => {
        nextSlide();
        stopSlideShow();
        startSlideShow();
    });
    
    // Pause the slider when hovering over the hero section
    const heroSection = document.querySelector('.hero-section');
    heroSection.addEventListener('mouseenter', stopSlideShow);
    heroSection.addEventListener('mouseleave', startSlideShow);
    
    // Start the automatic slide show
    startSlideShow();
    
    // Panel Tabs Functionality
    const panelTabs = document.querySelectorAll('.panel-tab');
    
    panelTabs.forEach(tab => {
        tab.addEventListener('click', () => {
            // Remove active class from all tabs
            panelTabs.forEach(t => t.classList.remove('active'));
            
            // Add active class to the clicked tab
            tab.classList.add('active');
        });
    });
});
