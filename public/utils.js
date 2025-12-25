// Enhanced data loading functionality
async function loadSubjectsData() {
  try {
    const response = await fetch('./subjects.json');
    if (!response.ok) throw new Error('Failed to load subjects');
    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Error loading subjects:', error);
    return null;
  }
}

// Improved filtering system
function filterByYear(year) {
  const elements = document.querySelectorAll('.subject');
  elements.forEach(el => {
    if (el.dataset.year === year || year === 'all') {
      el.style.display = 'block';
    } else {
      el.style.display = 'none';
    }
  });
}

// Search functionality
function searchSubjects(query) {
  const elements = document.querySelectorAll('.subject');
  elements.forEach(el => {
    const title = el.textContent.toLowerCase();
    if (title.includes(query.toLowerCase())) {
      el.style.display = 'block';
    } else {
      el.style.display = 'none';
    }
  });
}

// Initialize on page load
document.addEventListener('DOMContentLoaded', () => {
  loadSubjectsData();
});
