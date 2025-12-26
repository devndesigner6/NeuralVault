$(document).ready(function () {
    $(".table").fadeIn();
    function getUrlParameter(name) {
      name = name.replace(/[\[]/, "\\[").replace(/[\]]/, "\\]");
      var regex = new RegExp("[\\?&]" + name + "=([^&#]*)");
      var results = regex.exec(location.search);
      return results === null
        ? ""
        : decodeURIComponent(results[1].replace(/\+/g, " "));
    }
    var codeValue = getUrlParameter("code");
    console.log("code param:", codeValue);
    if (!codeValue) {
      $('h2').text('Error fetching details');
      $('table').hide();
      console.error('Missing ?code= param in URL');
      return;
    }
    $(".title").text(codeValue);
    // Prefer explicit relative path
    // Build absolute URL so trailing-slash redirects don't break relative resolution
    var infoBase = window.location.origin + "/public/";
    var filePath = new URL("info/" + codeValue + ".json", infoBase).href;
    console.log("Attempting to load:", filePath);
    $.getJSON(filePath, function (data) {
      var fileName = casing(data[0].name);

      function casing(string) {
        return string.toLowerCase().replace(/(?:^|\s)\S/g, function (a) {
          return a.toUpperCase();
        });
      }
      console.log(data);
      console.log(data);
      console.log(fileName);
      $(".title").text(data[0].code + ": " + fileName);

      var unitTableBody = $("#unitTableBody");
      $.each(data[0].units, function (index, unit) {
        var row = $("<tr></tr>");
        row.append("<td>" + casing(unit.name) + "</td>");
        if (data[0].syllabus == true) {
          $('th:contains("Syllabus")').remove();
        }
        !data[0].syllabus &&
          row.append(
            '<td><a class="unitLink" data-index="' +
              index +
              '">' +
              "View Syllabus</a></td>"
          );
        unitTableBody.append(row);
      });
      $(".unitLink").click(function () {
        var index = $(this).data("index");
        var unit = data[0].units[index];
        var unitInfo = $("#unitInfo");
        unitInfo.empty();
        unitInfo.append("<h3>" + unit.name + "</h3>");
        var topicsList = $("<ul></ul>");
        $.each(unit.topics, function (index, topic) {
          var topicItem = $("<li>" + topic.topic + "</li>");
          var subTopicsList = $("<ul></ul>");
          $.each(topic.subTopics, function (index, subTopic) {
            subTopicsList.append("<li>" + subTopic + "</li>");
          });
          topicItem.append(subTopicsList);
          topicsList.append(topicItem);
        });
        unitInfo.append(topicsList);
        $(".info").fadeIn();
        var infoElement = $(".info");
        $("html, body").animate(
          {
            scrollTop: infoElement.offset().top,
          },
          200
        );
      });

      if (data[0].links) {
        $.each(data[0].links, function (index, linkObj) {
          $(".resources").slideDown();

          // Resolve resource links relative to the current page (handles /public/ correctly)
          (function () {
            var rawLink = String(linkObj.link || "");
            // Keep relative paths and let the browser resolve; ensure proper encoding
            var normalized = rawLink.replace(/^\.\//, "./");
            var resolvedHref;
            try {
              resolvedHref = new URL(normalized, window.location.href).href;
            } catch (e) {
              resolvedHref = encodeURI(normalized);
            }

            var link = $(
              "<p>" +
                linkObj["name"] +
                ': <a href="' +
                resolvedHref +
                '" target="_blank" rel="noopener noreferrer">view</a></p>'
            );
            $(".resources").append(link);
          })();
        });
      } else {
      }
    }).fail(function(jqXHR, textStatus, errorThrown) {
            console.error('Primary info load failed:', textStatus, errorThrown, jqXHR && jqXHR.status);
            console.log('Falling back to alt path under /public/info/...');
            var altPath = new URL("info/" + codeValue + ".json", window.location.origin + "/public/").href;
            $.getJSON(altPath, function (data) {
              // Re-run the same rendering logic by simulating success
              var fileName = (function casing(string) {
                return string.toLowerCase().replace(/(?:^|\s)\S/g, function (a) {
                  return a.toUpperCase();
                });
              })(data[0].name);
              $(".title").text(data[0].code + ": " + fileName);
              var unitTableBody = $("#unitTableBody");
              $.each(data[0].units, function (index, unit) {
                var row = $("<tr></tr>");
                row.append("<td>" + (function (string){return string.toLowerCase().replace(/(?:^|\s)\S/g,function(a){return a.toUpperCase();});})(unit.name) + "</td>");
                if (data[0].syllabus == true) {
                  $('th:contains("Syllabus")').remove();
                }
                !data[0].syllabus &&
                  row.append(
                    '<td><a class="unitLink" data-index="' +
                      index +
                      '">' +
                      "View Syllabus</a></td>"
                  );
                unitTableBody.append(row);
              });
              $(".unitLink").click(function () {
                var index = $(this).data("index");
                var unit = data[0].units[index];
                var unitInfo = $("#unitInfo");
                unitInfo.empty();
                unitInfo.append("<h3>" + unit.name + "</h3>");
                var topicsList = $("<ul></ul>");
                $.each(unit.topics, function (index, topic) {
                  var topicItem = $("<li>" + topic.topic + "</li>");
                  var subTopicsList = $("<ul></ul>");
                  $.each(topic.subTopics, function (index, subTopic) {
                    subTopicsList.append("<li>" + subTopic + "</li>");
                  });
                  topicItem.append(subTopicsList);
                  topicsList.append(topicItem);
                });
                unitInfo.append(topicsList);
                $(".info").fadeIn();
                var infoElement = $(".info");
                $("html, body").animate(
                  {
                    scrollTop: infoElement.offset().top,
                  },
                  200
                );
              });

              if (data[0].links) {
                $.each(data[0].links, function (index, linkObj) {
                  $(".resources").slideDown();
                  (function () {
                    var rawLink = String(linkObj.link || "");
                    var normalized = rawLink.replace(/^\.\//, "./");
                    var resolvedHref;
                    try {
                      resolvedHref = new URL(normalized, window.location.href).href;
                    } catch (e) {
                      resolvedHref = encodeURI(normalized);
                    }
                    var link = $(
                      "<p>" +
                        linkObj["name"] +
                        ': <a href="' +
                        resolvedHref +
                        '" target="_blank" rel="noopener noreferrer">view</a></p>'
                    );
                    $(".resources").append(link);
                  })();
                });
              }
            }).fail(function(jqXHR2, textStatus2, errorThrown2) {
              $('h2').text('Error fetching details');
              $('table').hide();
              console.error('Alt info load failed:', textStatus2, errorThrown2, jqXHR2 && jqXHR2.status);
            });
        });
  });