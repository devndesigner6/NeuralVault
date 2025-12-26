console.log("Homepage loaded!");

$(document).ready(function () {
  
  let subjectsData = [];
  let filteredSubjects = [];
  
  // Toast notification function
  function showToast(message, icon = '✓') {
    $('#toastIcon').text(icon);
    $('#toastMessage').text(message);
    $('#toast').addClass('show');
    setTimeout(function() {
      $('#toast').removeClass('show');
    }, 3000);
  }
  
  // Dark mode toggle
  function initDarkMode() {
    const darkMode = localStorage.getItem('darkMode') === 'true';
    if (darkMode) {
      $('body').addClass('dark-mode');
      $('#themeIcon').text('☀️');
      $('#themeText').text('Light');
    }
  }
  
  $('#themeToggle').on('click', function() {
    $('body').toggleClass('dark-mode');
    const isDark = $('body').hasClass('dark-mode');
    localStorage.setItem('darkMode', isDark);
    
    if (isDark) {
      $('#themeIcon').text('☀️');
      $('#themeText').text('Light');
      showToast('Dark mode enabled', '🌙');
    } else {
      $('#themeIcon').text('🌙');
      $('#themeText').text('Dark');
      showToast('Light mode enabled', '☀️');
    }
  });
  
  // Bookmarking functions
  function toggleBookmark(code) {
    var bookmarks = JSON.parse(localStorage.getItem('bookmarks')) || [];
    var index = bookmarks.indexOf(code);
    
    if (index > -1) {
      bookmarks.splice(index, 1);
      showToast('Removed from bookmarks', '🗑️');
    } else {
      bookmarks.push(code);
      showToast('Added to bookmarks', '⭐');
    }
    
    localStorage.setItem('bookmarks', JSON.stringify(bookmarks));
    loadBookmarks(subjectsData);
    
    // Update button state
    var $btn = $('.bookmark-btn[data-code="' + code + '"]');
    if (index > -1) {
      $btn.removeClass('bookmarked').html('☆ Bookmark');
    } else {
      $btn.addClass('bookmarked').html('★ Bookmarked');
    }
  }
  
  function isBookmarked(code) {
    var bookmarks = JSON.parse(localStorage.getItem('bookmarks')) || [];
    return bookmarks.indexOf(code) > -1;
  }
  
  function loadBookmarks(subjectsData) {
    var bookmarks = JSON.parse(localStorage.getItem('bookmarks')) || [];
    if (bookmarks.length === 0) {
      $('#favoritesSection').hide();
      return;
    }
    
    $('#favoritesSection').show();
    $('#favoritesList').empty();
    
    bookmarks.forEach(function(code) {
      var subject = subjectsData.find(function(s) { return s.code === code; });
      if (subject) {
        var $item = $('<div class="favorite-item" data-code="' + code + '">' + 
                      subject.name + 
                      '<span class="remove-fav">×</span></div>');
        
        $item.on('click', function(e) {
          if (!$(e.target).hasClass('remove-fav')) {
            saveLastViewed(code);
            window.location.href = "/subject.html?code=" + code;
          }
        });
        
        $item.find('.remove-fav').on('click', function(e) {
          e.stopPropagation();
          toggleBookmark(code);
        });
        
        $('#favoritesList').append($item);
      }
    });
  }
  
  // Share function
  function shareSubject(code, name) {
    var url = window.location.origin + '/subject.html?code=' + code;
    
    if (navigator.clipboard && window.isSecureContext) {
      navigator.clipboard.writeText(url).then(function() {
        showToast('Link copied to clipboard!', '🔗');
      }).catch(function() {
        showToast('Could not copy link', '❌');
      });
    } else {
      // Fallback for older browsers
      var textArea = document.createElement("textarea");
      textArea.value = url;
      textArea.style.position = "fixed";
      textArea.style.left = "-999999px";
      document.body.appendChild(textArea);
      textArea.select();
      try {
        document.execCommand('copy');
        showToast('Link copied to clipboard!', '🔗');
      } catch (err) {
        showToast('Could not copy link', '❌');
      }
      document.body.removeChild(textArea);
    }
  }
  
  function displaySubjects(subjects) {
    $(".subjects").empty();
    
    if (!subjects || subjects.length === 0) {
      $(".subjects").html('<div class="subject"><p>No subjects found</p></div>');
      return;
    }
    
    // Show skeleton loading
    for (var i = 0; i < Math.min(subjects.length, 6); i++) {
      $(".subjects").append('<div class="subject skeleton loading"></div>');
    }
    
    // Simulate loading delay for smooth animation
    setTimeout(function() {
      $(".subjects").empty();
      
      $.each(subjects, function (index, subject) {
        var $newSubject = $(
          '<div class="click ' + subject.code + ' subject fade-in" style="animation-delay: ' + (index * 0.05) + 's"></div>'
        );
        $newSubject.append("<h1>" + subject.name + "</h1>");
        var $tagsDiv = $('<div class="tags"></div>');

        if (subject.year && subject.sem) {
          $newSubject.append(
            "<p>Year " + subject.year + " Sem " + subject.sem + "</p>"
          );
        }
        if (subject.credits) {
          $newSubject.append("<p>Credits: " + subject.credits + "</p>");
        }

        $.each(subject.tags, function (i, tag) {
          $tagsDiv.append("<p>#" + tag + "</p>");
        });
        $newSubject.append($tagsDiv);
        
        var array = "";
        $.each(subject.info, function (i, tag) {
          array += i == 0 ? tag : "; " + tag;
        });
        $newSubject.append("<p class='info'>" + array + ".</p>");
        
        // Action buttons
        var $actionsDiv = $('<div class="subject-actions"></div>');
        var bookmarked = isBookmarked(subject.code);
        var bookmarkText = bookmarked ? '★ Bookmarked' : '☆ Bookmark';
        var bookmarkClass = bookmarked ? 'bookmarked' : '';
        
        $actionsDiv.append(
          '<button class="btn-icon bookmark-btn ' + bookmarkClass + '" data-code="' + subject.code + '">' + 
          bookmarkText + '</button>'
        );
        $actionsDiv.append(
          '<button class="btn-icon share-btn" data-code="' + subject.code + '" data-name="' + subject.name + '">🔗 Share</button>'
        );
        $newSubject.append($actionsDiv);
        
        var $buttonDiv = $('<div class="button"></div>');
        $buttonDiv.append(
          '<button class="click ' + subject.code + '"><svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><path fill-rule="evenodd" clip-rule="evenodd" d="M5.93934 5.93934C6.52513 5.35355 7.47487 5.35355 8.06066 5.93934L13.0607 10.9393C13.342 11.2206 13.5 11.6022 13.5 12C13.5 12.3978 13.342 12.7794 13.0607 13.0607L8.06066 18.0607C7.47487 18.6464 6.52513 18.6464 5.93934 18.0607C5.35355 17.4749 5.35355 16.5251 5.93934 15.9393L9.87868 12L5.93934 8.06066C5.35355 7.47487 5.35355 6.52513 5.93934 5.93934ZM11.9393 5.93934C12.5251 5.35355 13.4749 5.35355 14.0607 5.93934L19.0607 10.9393C19.342 11.2206 19.5 11.6022 19.5 12C19.5 12.3978 19.342 12.7794 19.0607 13.0607L14.0607 18.0607C13.4749 18.6464 12.5251 18.6464 11.9393 18.0607C11.3536 17.4749 11.3536 16.5251 11.9393 15.9393L15.8787 12L11.9393 8.06066C11.3536 7.47487 11.3536 6.52513 11.9393 5.93934Z" fill="#09244B"/></svg></button>'
        );
        $newSubject.append($buttonDiv);
        $(".subjects").append($newSubject);
      });
      
      // Attach event handlers
      $(".click").off("click").on("click", function (event) {
        event.preventDefault();
        var classNames = $(this).attr("class").split(" ");
        var code = classNames[1];
        
        saveLastViewed(code);
        window.location.href = "/subject.html?code=" + code;
      });
      
      $('.bookmark-btn').off('click').on('click', function(e) {
        e.stopPropagation();
        var code = $(this).data('code');
        toggleBookmark(code);
      });
      
      $('.share-btn').off('click').on('click', function(e) {
        e.stopPropagation();
        var code = $(this).data('code');
        var name = $(this).data('name');
        shareSubject(code, name);
      });
      
    }, 300);
  }
  
  function saveLastViewed(code) {
    var viewed = JSON.parse(localStorage.getItem('lastViewed')) || [];
    viewed = viewed.filter(function(item) { return item !== code; });
    viewed.unshift(code);
    viewed = viewed.slice(0, 5);
    localStorage.setItem('lastViewed', JSON.stringify(viewed));
  }
  
  function loadLastViewed(subjectsData) {
    var viewed = JSON.parse(localStorage.getItem('lastViewed')) || [];
    if (viewed.length === 0) {
      $("#lastViewedSection").hide();
      return;
    }
    
    $("#lastViewedSection").show();
    $("#lastViewedList").empty();
    
    viewed.forEach(function(code) {
      var subject = subjectsData.find(function(s) { return s.code === code; });
      if (subject) {
        var $item = $('<div class="last-viewed-item" data-code="' + code + '">' + subject.name + '</div>');
        $item.on('click', function() {
          saveLastViewed(code);
          window.location.href = "/subject.html?code=" + code;
        });
        $("#lastViewedList").append($item);
      }
    });
  }
  
  function performSearch(query) {
    var searchTerm = query.toLowerCase().trim();
    
    if (searchTerm === "") {
      // Reset to show all or filtered by year
      var activeYear = $(".click-year.active");
      if (activeYear.length > 0) {
        var yearSem = activeYear.text();
        var year = parseInt(yearSem.split('.')[0]);
        var sem = parseInt(yearSem.split('.')[1]);
        filteredSubjects = subjectsData.filter(function (subject) {
          return subject.year === year && subject.sem === sem;
        });
      } else {
        filteredSubjects = subjectsData;
      }
    } else {
      // Filter by search term and current year filter if active
      var activeYear = $(".click-year.active");
      filteredSubjects = subjectsData.filter(function (subject) {
        var matchesSearch = subject.name.toLowerCase().includes(searchTerm) || 
                           subject.code.toLowerCase().includes(searchTerm);
        if (activeYear.length > 0) {
          var yearSem = activeYear.text();
          var year = parseInt(yearSem.split('.')[0]);
          var sem = parseInt(yearSem.split('.')[1]);
          return matchesSearch && subject.year === year && subject.sem === sem;
        }
        return matchesSearch;
      });
    }
    
    displaySubjects(filteredSubjects);
  }
  
  // Back to top button functionality
  $(window).on('scroll', function() {
    if ($(this).scrollTop() > 300) {
      $('#backToTop').addClass('show');
    } else {
      $('#backToTop').removeClass('show');
    }
  });
  
  $('#backToTop').on('click', function() {
    $('html, body').animate({scrollTop: 0}, 500);
  });
  
  // Search functionality
  $('#searchInput').on('keyup', function() {
    var query = $(this).val();
    performSearch(query);
  });
  
  $.getJSON("subjects.json", function (subjectsDataJSON) {
    subjectsData = subjectsDataJSON;
    filteredSubjects = subjectsData;
    
    initDarkMode();
    loadLastViewed(subjectsData);
    loadBookmarks(subjectsData);
    displaySubjects(subjectsData);

    $(".click-year").click(function () {
      $(".click-year").removeClass("active").addClass("inActive");
      $(this).removeClass("inActive").addClass("active");

      var yearSem = $(this).text();
      var year = parseInt(yearSem.split('.')[0]);
      var sem = parseInt(yearSem.split('.')[1]);
  
      var subjects = subjectsData.filter(function (subject) {
        return subject.year === year && subject.sem === sem;
      });

      // Clear search when filtering by year
      $('#searchInput').val('');
      displaySubjects(subjects);
    });

  }).fail(function(jqXHR, textStatus, errorThrown) {
    console.error("Error loading subjects:", textStatus);
    $(".subjects").html('<div class="subject" style="text-align: center;"><h3>Unable to load subjects</h3><p>Error: ' + textStatus + '</p></div>');
  });
});
