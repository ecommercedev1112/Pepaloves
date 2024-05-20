const PADDING = 10;
// Handle product popup adjusts the product's position
// based on if it goes out of bounds or not.
const handleProductPopup = event => {

// Get event target.
let target = event.target;

// Bail if there is no event target.
if (!target) {
    return false;
}

// Bail if document element
if (target.nodeName === '#document') {
    return false;
}

// Bail if target is not a hotspot
if (!target.matches('.hotspot')) {
    return false;
}

// Get child product.
let product = target.querySelector('.product-hotspot');
// Use helper method to determine if it is out of bounds
// or not.
let isOut = WAU.Helpers.isOutOfBounds(product);

if (isOut.left) {
    product.style.transform = `translateX(${Math.round(Math.abs(isOut.leftAmount)) + PADDING}px)`;
}
if (isOut.right) {
    product.style.transform = `translateX(${(Math.round(isOut.rightAmount) + (PADDING * 2)) * -1}px)`;
}
};

// Get all the hotspots in the section container.
let hotspots = document.querySelectorAll('.hotspot');

// Check if there are hotspots
if (hotspots.length > 0) {
// Apply event listeners to all of them
hotspots.forEach(hotspot => {
    hotspot.addEventListener('click', handleProductPopup);
    hotspot.addEventListener('mouseenter', handleProductPopup);
});
};

