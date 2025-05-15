document.addEventListener('DOMContentLoaded', function() {
    const decreaseBtn = document.getElementById('decrease-btn');
    const increaseBtn = document.getElementById('increase-btn');
    const slotCount = document.getElementById('slot-count');
    const selectedSlots = document.getElementById('selected-slots');
    const totalPrice = document.getElementById('total-price');
    
    // Price per slot
    const pricePerSlot = 100;
    
    // Update total price based on slot count
    function updatePrice() {
        const count = parseInt(slotCount.textContent);
        totalPrice.textContent = count * pricePerSlot;
    }
    
    // Decrease slot count
    decreaseBtn.addEventListener('click', function() {
        let count = parseInt(slotCount.textContent);
        if (count > 1) {
            count--;
            slotCount.textContent = count;
            selectedSlots.textContent = count;
            updatePrice();
        }
    });
    
    // Increase slot count
    increaseBtn.addEventListener('click', function() {
        let count = parseInt(slotCount.textContent);
        if (count < 10) { // Setting a max limit of 10 slots
            count++;
            slotCount.textContent = count;
            selectedSlots.textContent = count;
            updatePrice();
        }
    });
    
    // Confirm payment button
    const confirmBtn = document.querySelector('.confirm-btn');
    confirmBtn.addEventListener('click', function() {
        const slots = parseInt(slotCount.textContent);
        const total = parseInt(totalPrice.textContent);
        
        alert(`Booking confirmed!\nSlots: ${slots}\nTotal: NPR ${total}`);
        // In a real app, this would submit the booking to a server
    });
});