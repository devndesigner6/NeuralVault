$(document).ready(function () {
  let subjectsData = [];
  let currentTrack = 'R22';
  let currentSelection = null;

  // Theme is always dark (black/white) - no toggle needed
  // Keeping the button for future light mode implementation
  function initTheme() {
    // Always use dark theme
    $('#themeIcon').text('◐');
    $('#themeText').text('B/W');
  }

  $('#themeToggle').on('click', function () {
    // Theme toggle disabled - always B/W theme
    // Could be implemented for light mode in future
  });

  function renderSubjects(list) {
    const $grid = $('#subjectsGrid');
    $grid.empty();

    if (!list || list.length === 0) {
      $grid.append('<div class="empty-state">Nothing here. Try another semester.</div>');
      return;
    }

    list.forEach(function (subject) {
      const info = Array.isArray(subject.info) ? subject.info.slice(0, 2).join('; ') : '';
      const meta = `Year ${subject.year} • Sem ${subject.sem}${subject.credits ? ' • ' + subject.credits + ' cr' : ''}`;

      const card = $('<div class="subject-card"></div>');
      card.append(`<p class="code">${subject.code}</p>`);
      card.append(`<h3>${subject.name}</h3>`);
      card.append(`<p class="meta">${meta}</p>`);
      if (info) card.append(`<p class="info">${info}</p>`);

      const actions = $('<div class="card-actions"></div>');
      const openBtn = $('<button class="ghost-btn">Open</button>');
      openBtn.on('click', function () {
        window.location.href = `/subject.html?code=${subject.code}`;
      });
      actions.append(openBtn);
      card.append(actions);
      $grid.append(card);
    });
  }

  function handleSemesterPick($pill) {
    $('#semChips .pill').removeClass('active');
    $pill.addClass('active');

    const year = parseInt($pill.data('year'), 10);
    const sem = parseInt($pill.data('sem'), 10);
    currentSelection = { year, sem };

    const filtered = subjectsData.filter(function (subject) {
      return subject.year === year && subject.sem === sem;
    });

    $('#subjectsTitle').text(`Year ${year} • Sem ${sem}`);
    $('#subjectsSubtitle').text(`${filtered.length} subjects available`);
    renderSubjects(filtered);
  }

  function bindInteractions() {
    $('.track-card').on('click', function () {
      const track = $(this).data('track');
      currentTrack = track;
      $('.track-card').removeClass('active');
      $(this).addClass('active');
      $('#filtersPanel').show();
      $('#subjectsTitle').text('Subjects');
      $('#subjectsSubtitle').text('Pick a semester to surface subjects.');
      $('#subjectsGrid').html('<div class="empty-state">Waiting for a semester tap.</div>');
      $('#semChips .pill').removeClass('active');
    });

    $('#semChips .pill').on('click', function () {
      if (currentTrack !== 'R22') {
        $('.track-card[data-track="R22"]').trigger('click');
      }
      handleSemesterPick($(this));
    });
  }

  $.getJSON('subjects.json', function (data) {
    subjectsData = data;
    initTheme();
    $('#filtersPanel').show();
    bindInteractions();
  }).fail(function () {
    $('#subjectsGrid').html('<div class="empty-state">Could not load subjects.</div>');
  });
});
