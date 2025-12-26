console.log("Script loaded!");

$(document).ready(function () {
  console.log("jQuery ready!");
  
  function displaySubjects(subjects) {
    console.log("Displaying subjects:", subjects.length);
    $(".subjects").empty();
    
    if (!subjects || subjects.length === 0) {
      $(".subjects").html('<div class="subject"><p>No subjects found</p></div>');
      return;
    }
    
    $.each(subjects, function (index, subject) {
      var $newSubject = $(
        '<div class="click ' + subject.code + ' subject"></div>'
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
      
      var $buttonDiv = $('<div class="button"></div>');
      $buttonDiv.append(
        '<button class="click ' + subject.code + '"><svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><path fill-rule="evenodd" clip-rule="evenodd" d="M5.93934 5.93934C6.52513 5.35355 7.47487 5.35355 8.06066 5.93934L13.0607 10.9393C13.342 11.2206 13.5 11.6022 13.5 12C13.5 12.3978 13.342 12.7794 13.0607 13.0607L8.06066 18.0607C7.47487 18.6464 6.52513 18.6464 5.93934 18.0607C5.35355 17.4749 5.35355 16.5251 5.93934 15.9393L9.87868 12L5.93934 8.06066C5.35355 7.47487 5.35355 6.52513 5.93934 5.93934ZM11.9393 5.93934C12.5251 5.35355 13.4749 5.35355 14.0607 5.93934L19.0607 10.9393C19.342 11.2206 19.5 11.6022 19.5 12C19.5 12.3978 19.342 12.7794 19.0607 13.0607L14.0607 18.0607C13.4749 18.6464 12.5251 18.6464 11.9393 18.0607C11.3536 17.4749 11.3536 16.5251 11.9393 15.9393L15.8787 12L11.9393 8.06066C11.3536 7.47487 11.3536 6.52513 11.9393 5.93934Z" fill="#09244B"/></svg></button>'
      );
      $newSubject.append($buttonDiv);
      $(".subjects").append($newSubject);
    });
    
    // Add click handlers after all subjects are added
    $(".click").off("click").on("click", function (event) {
      event.preventDefault();
      var classNames = $(this).attr("class").split(" ");
      var code = classNames[1];
      console.log("Loading subject:", code);
      loadSubjectDetail(code);
    });
  }
  
  const filePath = "subjects.json";
  let subjectsData = [];
  
  // Show loading message
  $(".subjects").html('<div class="subject"><p style="text-align: center; padding: 2rem;">Loading subjects...</p></div>');
  console.log("Fetching subjects from:", filePath);
  
  $.getJSON(filePath, function (subjectsDataJSON) {
    console.log("Subjects loaded successfully:", subjectsDataJSON.length);
    subjectsData = subjectsDataJSON;

    // Handle click event on year/semester filters
    $(".click-year").click(function () {
      $(".click-year").removeClass("active").addClass("inActive");
      $(this).removeClass("inActive").addClass("active");

      var yearSem = $(this).text();
      var year = parseInt(yearSem.split('.')[0]);
      var sem = parseInt(yearSem.split('.')[1]);
      
      console.log("Filtering by year:", year, "sem:", sem);
  
      var filteredSubjects = subjectsData.filter(function (subject) {
        return subject.year === year && subject.sem === sem;
      });

      console.log("Filtered subjects:", filteredSubjects.length);
      displaySubjects(filteredSubjects);
    });
    
    // Display all subjects by default when the page loads
    console.log("Displaying all subjects");
    displaySubjects(subjectsData);

  }).fail(function(jqXHR, textStatus, errorThrown) {
    console.error("Error loading subjects:", textStatus, errorThrown);
    console.error("XHR:", jqXHR);
    $(".subjects").html('<div class="subject" style="text-align: center; padding: 2rem;"><h3 style="color: var(--dark-green);">Unable to load subjects</h3><p style="color: var(--forest-green); margin-top: 1rem;">Error: ' + textStatus + '</p><p>Please refresh the page or check your connection.</p></div>');
  });
});

function casing(string) {
  return string.toLowerCase().replace(/(?:^|\s)\S/g, function (a) {
    return a.toUpperCase();
  });
}

function loadSubjectDetail(code) {
  var filePath = "/info/" + code + ".json";
  console.log("Loading subject JSON from:", filePath);
  
  $.ajax({
    url: filePath,
    dataType: 'json',
    success: function(data) {
      var fileName = casing(data[0].name);
      $(".subject-detail .subject-title").text(data[0].code + ": " + fileName);
      
      // Clear previous content
      $("#unitTableBody").empty();
      $(".resources-list").empty();
      $("#unitInfo").empty();
      
      // Load units
      $.each(data[0].units, function (index, unit) {
        var row = $("<tr></tr>");
        row.append("<td style='padding: 0.5rem; border-bottom: 1px solid var(--dark-green);'>" + casing(unit.name) + "</td>");
        if (data[0].syllabus != true) {
          row.append(
            '<td style="padding: 0.5rem; border-bottom: 1px solid var(--dark-green);"><a class="unitLink" data-index="' +
              index +
              '" style="color: var(--dark-green); cursor: pointer; text-decoration: underline;">View Syllabus</a></td>'
          );
        }
        $("#unitTableBody").append(row);
      });
      
      // Load resources
      if (data[0].links && data[0].links.length > 0) {
        $(".resources").slideDown();
        $.each(data[0].links, function (index, linkObj) {
          var rawLink = String(linkObj.link || "");
          var resolvedHref = rawLink.replace(/^\.\//, "/");
          resolvedHref = encodeURI(resolvedHref);
          
          var link = $(
            '<div style="margin: 0.5rem 0;"><a href="' +
              resolvedHref +
              '" target="_blank" rel="noopener noreferrer" style="color: var(--dark-green); text-decoration: underline;">' +
              linkObj["name"] +
              '</a></div>'
          );
          $(".resources-list").append(link);
        });
      }
      
      // Click handler for syllabus - load in place, don't scroll
      $(".unitLink").off("click").on("click", function() {
        var index = $(this).data("index");
        var unit = data[0].units[index];
        var unitInfo = $("#unitInfo");
        unitInfo.empty();
        unitInfo.append("<h4>" + unit.name + "</h4>");
        var topicsList = $("<ul></ul>");
        $.each(unit.topics, function (index, topic) {
          var topicItem = $("<li style='margin: 0.5rem 0;'>" + topic.topic + "</li>");
          var subTopicsList = $("<ul style='margin-left: 1rem;'></ul>");
          $.each(topic.subTopics, function (index, subTopic) {
            subTopicsList.append("<li>" + subTopic + "</li>");
          });
          topicItem.append(subTopicsList);
          topicsList.append(topicItem);
        });
        unitInfo.append(topicsList);
        $(".info").fadeIn();
        // NO scrolling to top - just show content in place
      });
      
      // Show subject detail section in place
      $("#subjectDetail").fadeIn();
      // NO scrolling - content loads where it is on the page
    },
    error: function(jqXHR, textStatus, errorThrown) {
      console.error('Failed to load subject JSON:', textStatus, errorThrown);
      alert('Error loading subject: ' + errorThrown);
    }
  });
}

// Back button handler
$(".back-btn").off("click").on("click", function() {
  $("#subjectDetail").fadeOut();
  $("#unitTableBody").empty();
  $(".resources-list").empty();
  $("#unitInfo").empty();
  $(".info").hide();
  $(".resources").hide();
});
