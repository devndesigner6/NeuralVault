$(document).ready(function () {
  function initDarkMode() {
    const darkMode = localStorage.getItem('darkMode') === 'true';
    if (darkMode) {
      $('body').addClass('dark-mode');
      $('#themeIcon').text('☀️');
      $('#themeText').text('Light');
    }
  }

  function setTheme(isDark) {
    localStorage.setItem('darkMode', isDark);
    $('#themeIcon').text(isDark ? '☀️' : '🌙');
    $('#themeText').text(isDark ? 'Light' : 'Dark');
  }

  $('#themeToggle').on('click', function () {
    $('body').toggleClass('dark-mode');
    setTheme($('body').hasClass('dark-mode'));
  });

  initDarkMode();

  function getUrlParameter(name) {
    name = name.replace(/[\[]/, '\\[').replace(/[\]]/, '\\]');
    var regex = new RegExp('[\\?&]' + name + '=([^&#]*)');
    var results = regex.exec(location.search);
    return results === null ? '' : decodeURIComponent(results[1].replace(/\+/g, ' '));
  }

  function openPdfPreview(pdfPath, pdfName) {
    $('#pdfTitle').text(pdfName || 'PDF Preview');
    var iframeUrl = encodeURI(pdfPath) + '#toolbar=0';
    $('#pdfViewer').html('<iframe src="' + iframeUrl + '" title="' + pdfName + '"></iframe>');
    $('#pdfPreviewModal').addClass('show');
  }

  $('#pdfCloseBtn').on('click', function () {
    $('#pdfPreviewModal').removeClass('show');
    $('#pdfViewer').html('');
  });

  $(document).on('keydown', function (event) {
    if (event.keyCode === 27) {
      $('#pdfPreviewModal').removeClass('show');
      $('#pdfViewer').html('');
    }
  });

  var codeValue = getUrlParameter('code');
  if (!codeValue) {
    $('#subjectName').text('No subject selected');
    $('#subjectMeta').text('Missing ?code parameter');
    $('#overviewSection').hide();
    return;
  }

  var filePath = '/info/' + codeValue + '.json';

  $.ajax({
    url: filePath,
    dataType: 'json',
    success: function (data) {
      var subject = data && data[0] ? data[0] : null;
      if (!subject) {
        $('#subjectName').text('Subject not found');
        $('#subjectMeta').text('Check the code and try again');
        return;
      }

      var displayName = subject.name || codeValue;
      var pageTitle = (subject.code || codeValue) + ': ' + displayName + ' · AIML-sheet';
      $('.title').text(pageTitle);
      $('title').text(pageTitle);
      $('#subjectName').text(displayName);
      $('#subjectMeta').text((subject.code || '').toUpperCase() + ' • notes and syllabus');

      var $unitTableBody = $('#unitTableBody');
      $unitTableBody.empty();

      if (subject.units && subject.units.length) {
        $.each(subject.units, function (index, unit) {
          var row = $('<tr></tr>');
          row.append('<td>' + unit.name + '</td>');
          if (subject.syllabus) {
            $('.syllabus-col').hide();
          } else {
            row.append('<td><a class="unitLink" data-index="' + index + '">View</a></td>');
          }
          $unitTableBody.append(row);
        });
      } else {
        $unitTableBody.append('<tr><td colspan="2">No units listed.</td></tr>');
      }

      $('.unitLink').on('click', function () {
        var idx = $(this).data('index');
        var unit = subject.units[idx];
        var $unitInfo = $('#unitInfo');
        $unitInfo.empty();
        $unitInfo.append('<h3>' + unit.name + '</h3>');

        var topicsList = $('<ul></ul>');
        $.each(unit.topics || [], function (_, topic) {
          var topicItem = $('<li>' + topic.topic + '</li>');
          var subTopicsList = $('<ul></ul>');
          $.each(topic.subTopics || [], function (_, subTopic) {
            subTopicsList.append('<li>' + subTopic + '</li>');
          });
          topicItem.append(subTopicsList);
          topicsList.append(topicItem);
        });
        $unitInfo.append(topicsList);
        $('#infoSection').show();
        $('html, body').animate({ scrollTop: $('#infoSection').offset().top - 16 }, 200);
      });

      if (subject.links && subject.links.length) {
        var $resourcesList = $('#resourcesList');
        $resourcesList.empty();
        $.each(subject.links, function (_, linkObj) {
          var rawLink = String(linkObj.link || '');
          var resolvedHref = encodeURI(rawLink.replace(/^\.\//, '/'));
          var item = $('<p></p>');
          var viewLink = $('<a class="resource-link" href="javascript:void(0);" data-pdf="' + resolvedHref + '" data-name="' + linkObj.name + '">view</a>');
          var downloadLink = $('<a href="' + resolvedHref + '" download target="_blank" style="font-size: 0.9rem;">download</a>');
          item.append(linkObj.name + ': ');
          item.append(viewLink);
          item.append(' (');
          item.append(downloadLink);
          item.append(')');
          $resourcesList.append(item);
        });

        $('.resource-link').on('click', function (e) {
          e.preventDefault();
          openPdfPreview($(this).data('pdf'), $(this).data('name'));
        });

        $('#resourcesSection').show();
      }
    },
    error: function () {
      $('#subjectName').text('Error loading subject');
      $('#subjectMeta').text('Unable to fetch resources');
      $('#overviewSection').hide();
    },
  });
});


