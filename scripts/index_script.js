document.addEventListener('wheel', function (e) {
    const scrollable = document.getElementById("cards");
    const race = 30;
    
    if (e.deltaY > 0) { // Scroll right
        scrollable.scrollLeft += race;
    } else { // Scroll left
        scrollable.scrollLeft -= race;
    }
});