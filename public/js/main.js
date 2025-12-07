// Main JavaScript file for client-side functionality

// Auto-dismiss alerts after 5 seconds
document.addEventListener('DOMContentLoaded', function() {
  const alerts = document.querySelectorAll('.alert');
  alerts.forEach(alert => {
    setTimeout(() => {
      const bsAlert = new bootstrap.Alert(alert);
      bsAlert.close();
    }, 5000);
  });
});

// Form validation helpers
function validateForm(formId) {
  const form = document.getElementById(formId);
  if (!form) return false;
  
  if (!form.checkValidity()) {
    form.classList.add('was-validated');
    return false;
  }
  return true;
}

// Confirm delete actions
document.addEventListener('DOMContentLoaded', function() {
  const deleteForms = document.querySelectorAll('form[onsubmit*="confirm"]');
  deleteForms.forEach(form => {
    form.addEventListener('submit', function(e) {
      if (!confirm('Are you sure you want to delete this item?')) {
        e.preventDefault();
      }
    });
  });
});