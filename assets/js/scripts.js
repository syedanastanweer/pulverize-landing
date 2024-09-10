AOS.init({
  duration: 1000, // Adjust the duration to your preference
  once: true,     // Make sure the animation happens only once
});


//////////////////// text animations ///////////////////////////////

$(document).ready(function () {
  // Automatically trigger the gravity animation when the page loads
  $("span.scatter-text").addClass("test");

  // Initialize throwable plugin for the text animation with synced gravity
  $(".test").throwable({
      drag: true,
      gravity: { x: 0, y: 1 }, // Default gravity settings
      impulse: {
          f: 150, // Adjust impulse force
          p: { x: 0, y: 1.5 } // Ensure consistent direction for both words
      },
      shape: "circle",
      autostart: true, // Set autostart to true
      bounce: 20,
      damping: 13,
  });

  // Trigger the animation on page load
  setTimeout(function () {
      $(".test").trigger('mousedown').trigger('mouseup');
  }, 0); // No delay, trigger immediately

  // Ensure falling text stays within the gravity section
  $(window).scroll(function () {
      var sectionOffset = $('.gravity-section').offset().top;
      var sectionHeight = $('.gravity-section').outerHeight();
      var scrollPosition = $(window).scrollTop() + $(window).height();

      if (scrollPosition > sectionOffset + sectionHeight) {
          $(".scatter-text").css('display', 'none'); // Hide text after section
      } else {
          $(".scatter-text").css('display', 'inline-block'); // Show text within section
      }
  });
});


/////////////////////////////////// navigation ///////////////////////////////////////


function openNav() {
  document.getElementById("mySidenav").style.width = "96%";
}
function closeNav() {
  document.getElementById("mySidenav").style.width = "0";
}