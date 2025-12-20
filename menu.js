// // Select the menu icon and the menu list
const menuIcon = document.querySelector('.showmenu');
const menu = document.querySelector('.menu');

// // Add a click event to the icon
menuIcon.addEventListener('click', () => {
//     // Toggle the 'active' class on the menu
    menu.classList.toggle('active');
});
