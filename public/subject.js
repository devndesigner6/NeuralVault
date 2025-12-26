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
    
    function casing(string) {
      return string.toLowerCase().replace(/(?:^|\s)\S/g, function (a) {
        return a.toUpperCase();
      });
    }
    
    function openPdfPreview(pdfPath, pdfName) {
      $('#pdfTitle').text(pdfName || 'PDF Preview');
      var iframeUrl = encodeURI(pdfPath) + '#toolbar=0';
      $('#pdfViewer').html('<iframe src="' + iframeUrl + '" title="' + pdfName + '"></iframe>');
      $('#pdfPreviewModal').addClass('show');
    }
    
    $('#pdfCloseBtn').on('click', function() {
      $('#pdfPreviewModal').removeClass('show');
      $('#pdfViewer').html('');
    });
    
    $(document).on('keydown', function(event) {
      if (event.keyCode === 27) { // Escape key
        $('#pdfPreviewModal').removeClass('show');
        $('#pdfViewer').html('');
      }
    });
    
    var codeValue = getUrlParameter("code");
    console.log("code param:", codeValue);
    if (!codeValue) {
      $('h2').text('Error: No subject selected');
      $('table').hide();
      console.error('Missing ?code= param in URL');
      return;
    }
    
    $(".title").text(codeValue);
    var filePath = "/info/" + codeValue + ".json";
    console.log("Loading subject JSON from:", filePath);
    
    $.ajax({
      url: filePath,
      dataType: 'json',
      success: function(data) {
        var fileName = casing(data[0].name);
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
            var rawLink = String(linkObj.link || "");
            // Convert ./resources/... to /resources/...
            var resolvedHref = rawLink.replace(/^\.\//, "/");
            resolvedHref = encodeURI(resolvedHref);

            var link = $(
              "<p>" +
                linkObj["name"] +
                ': <a class="resource-link" href="javascript:void(0);" data-pdf="' +
                resolvedHref +
                '" data-name="' +
                linkObj["name"] +
                '">view</a> (<a href="' +
                resolvedHref +
                '" download target="_blank" style="font-size: 0.85rem;">download</a>)</p>'
            );
            $(".resources").append(link);
          });
          
          // Attach click handler for PDF preview
          $('.resource-link').on('click', function(e) {
            e.preventDefault();
            var pdfPath = $(this).data('pdf');
            var pdfName = $(this).data('name');
            openPdfPreview(pdfPath, pdfName);
          });
        }
      },
      error: function(jqXHR, textStatus, errorThrown) {
        console.error('Failed to load subject JSON:', textStatus, errorThrown);
        console.error('Status code:', jqXHR.status);
        console.error('Tried URL:', filePath);
        $('h2').text('Error loading subject: ' + errorThrown);
        $('table').hide();
      }
    });
});
