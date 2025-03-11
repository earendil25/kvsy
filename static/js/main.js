document.addEventListener('DOMContentLoaded', function() {
    // Show ad popup when the page loads
    const adPopup = document.getElementById('ad-popup');
    
    // Show the ad popup
    adPopup.style.display = 'flex';
    
    // Close the ad popup when the close button is clicked
    const closeBtn = document.querySelector('.close-btn');
    closeBtn.addEventListener('click', function() {
        adPopup.style.display = 'none';
    });
    
    // Close the ad popup when clicking outside the ad content
    adPopup.addEventListener('click', function(event) {
        if (event.target === adPopup) {
            adPopup.style.display = 'none';
        }
    });
}); 