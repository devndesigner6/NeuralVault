// Clean, minimal NeuralVault script
$(document).ready(function () {
  // Join button click - redirect to curriculum selection
  $('#joinBtn').on('click', function () {
    window.location.href = 'public/index.html';
  });
  
  // Search bar click - also redirect
  $('.search-bar').on('click', function () {
    window.location.href = 'public/index.html';
  });
});
