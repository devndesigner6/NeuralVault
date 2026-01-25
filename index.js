$(document).ready(function () {
  let subjectsData = [];
  let currentYear = null;
  let currentSem = null;

  // Load subjects data
  function loadSubjects() {
    $.getJSON('subjects.json', function (data) {
      subjectsData = data.filter(s => s.year > 0 && s.sem > 0); // Filter out special entries
      console.log('Subjects loaded:', subjectsData.length);
      renderSubjects(subjectsData);
      updateCount();
    }).fail(function(error) {
      console.error('Error loading subjects:', error);
      $('#subjectsGrid').html('<div class="empty-state">Error loading subjects. Please refresh the page.</div>');
    });
  }

  // Filter subjects
  function filterSubjects() {
    let filtered = subjectsData;
    
    if (currentYear) {
      filtered = filtered.filter(s => s.year === currentYear);
    }
    
    if (currentSem) {
      filtered = filtered.filter(s => s.sem === currentSem);
    }
    
    return filtered;
  }

  // Render subjects grid
  function renderSubjects(subjects) {
    const $grid = $('#subjectsGrid');
    $grid.empty();

    if (!subjects || subjects.length === 0) {
      $grid.html('<div class="empty-state">No subjects found. Try different filters.</div>');
      return;
    }

    subjects.forEach(function(subject) {
      const card = createSubjectCard(subject);
      $grid.append(card);
    });
  }

  // Create subject card with all actions
  function createSubjectCard(subject) {
    const $card = $('<div class="subject-card"></div>');
    
    // Header
    const $header = $('<div class="card-header"></div>');
    $header.append(`<div class="card-code">${subject.code || ''}</div>`);
    $header.append(`<h3 class="card-title">${subject.name || 'Untitled Subject'}</h3>`);
    $card.append($header);

    // Meta
    const meta = `Year ${subject.year} • Sem ${subject.sem}${subject.credits ? ' • ' + subject.credits + ' cr' : ''}`;
    $card.append(`<div class="card-meta">${meta}</div>`);

    // Info
    if (subject.info && Array.isArray(subject.info) && subject.info.length > 0) {
      const infoText = subject.info.slice(0, 2).join(' • ');
      $card.append(`<div class="card-info">${infoText}</div>`);
    }

    // Actions
    const $actions = $('<div class="card-actions"></div>');
    
    // Open button
    const $openBtn = $('<button class="btn btn-primary">Open</button>');
    $openBtn.on('click', function(e) {
      e.stopPropagation();
      window.location.href = `public/subject.html?code=${subject.code}`;
    });
    $actions.append($openBtn);

    // View Syllabus button
    const $syllabusBtn = $('<button class="btn">Syllabus</button>');
    $syllabusBtn.on('click', function(e) {
      e.stopPropagation();
      showSyllabus(subject);
    });
    $actions.append($syllabusBtn);

    // Download button (if resources available)
    if (subject.code) {
      const $downloadBtn = $('<button class="btn">Download</button>');
      $downloadBtn.on('click', function(e) {
        e.stopPropagation();
        window.location.href = `public/subject.html?code=${subject.code}`;
      });
      $actions.append($downloadBtn);
    }

    // Copy code button
    const $copyBtn = $('<button class="btn">Copy</button>');
    $copyBtn.on('click', function(e) {
      e.stopPropagation();
      copyToClipboard(subject.code || subject.name);
      $copyBtn.text('Copied!');
      setTimeout(() => $copyBtn.text('Copy'), 2000);
    });
    $actions.append($copyBtn);

    $card.append($actions);
    return $card;
  }

  // Show syllabus in modal
  function showSyllabus(subject) {
    // Load subject details
    $.getJSON(`public/info/${subject.code}.json`, function(subjectInfo) {
      const $modal = $('#syllabusModal');
      const $title = $('#modalTitle');
      const $body = $('#modalBody');
      
      $title.text(`${subject.name} - Syllabus`);
      $body.empty();

      if (subjectInfo.units && subjectInfo.units.length > 0) {
        subjectInfo.units.forEach(function(unit, idx) {
          const $unitSection = $('<div></div>');
          $unitSection.append(`<h3>Unit ${idx + 1}: ${unit.name}</h3>`);
          
          if (unit.topics && unit.topics.length > 0) {
            const $topicsList = $('<ul></ul>');
            unit.topics.forEach(function(topic) {
              const $topicItem = $('<li></li>');
              $topicItem.append(`<strong>${topic.topic}</strong>`);
              
              if (topic.subTopics && topic.subTopics.length > 0) {
                const $subTopicsList = $('<ul></ul>');
                topic.subTopics.forEach(function(subTopic) {
                  $subTopicsList.append(`<li>${subTopic}</li>`);
                });
                $topicItem.append($subTopicsList);
              }
              
              $topicsList.append($topicItem);
            });
            $unitSection.append($topicsList);
          }
          
          $body.append($unitSection);
        });
      } else {
        $body.append('<p>No syllabus information available.</p>');
      }

      $modal.addClass('active');
    }).fail(function() {
      const $modal = $('#syllabusModal');
      const $title = $('#modalTitle');
      const $body = $('#modalBody');
      
      $title.text(`${subject.name} - Syllabus`);
      $body.html('<p>Unable to load syllabus information.</p>');
      $modal.addClass('active');
    });
  }

  // Copy to clipboard
  function copyToClipboard(text) {
    if (navigator.clipboard) {
      navigator.clipboard.writeText(text);
    } else {
      // Fallback
      const textarea = document.createElement('textarea');
      textarea.value = text;
      document.body.appendChild(textarea);
      textarea.select();
      document.execCommand('copy');
      document.body.removeChild(textarea);
    }
  }

  // Update count
  function updateCount() {
    const filtered = filterSubjects();
    $('#subjectsCount').text(`${filtered.length} subject${filtered.length !== 1 ? 's' : ''} available`);
  }

  // Filter chip handlers
  $('.chip[data-year]').on('click', function() {
    const year = parseInt($(this).data('year'));
    
    if (currentYear === year) {
      currentYear = null;
      $(this).removeClass('active');
    } else {
      currentYear = year;
      $('.chip[data-year]').removeClass('active');
      $(this).addClass('active');
    }
    
    renderSubjects(filterSubjects());
    updateCount();
  });

  $('.chip[data-sem]').on('click', function() {
    const sem = parseInt($(this).data('sem'));
    
    if (currentSem === sem) {
      currentSem = null;
      $(this).removeClass('active');
    } else {
      currentSem = sem;
      $('.chip[data-sem]').removeClass('active');
      $(this).addClass('active');
    }
    
    renderSubjects(filterSubjects());
    updateCount();
  });

  // Modal close
  $('#modalClose, #syllabusModal').on('click', function(e) {
    if (e.target === this) {
      $('#syllabusModal').removeClass('active');
    }
  });

  // Initialize
  loadSubjects();
});
