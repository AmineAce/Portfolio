var form = document.getElementById('contact-form');
var submitBtn = document.getElementById('submit-btn');
var formError = document.getElementById('form-error');
var formSuccess = document.getElementById('form-success');

if (form && submitBtn && formError && formSuccess) {
  form.addEventListener('submit', async function (e) {
    e.preventDefault();

    formError.classList.add('hidden');
    formSuccess.classList.add('hidden');
    submitBtn.disabled = true;
    submitBtn.textContent = 'Sending\u2026';

    var formData = new FormData(form);

    try {
      var res = await fetch('/api/contact', {
        method: 'POST',
        body: formData,
      });

      var data = await res.json();

      if (res.ok && data.success) {
        form.reset();
        form.classList.add('hidden');
        formSuccess.classList.remove('hidden');
      } else {
        formError.textContent = data.error || 'Something went wrong.';
        formError.classList.remove('hidden');
        submitBtn.disabled = false;
        submitBtn.textContent = 'Send Message';
      }
    } catch (_) {
      formError.textContent = 'Network error. Please try again.';
      formError.classList.remove('hidden');
      submitBtn.disabled = false;
      submitBtn.textContent = 'Send Message';
    }
  });
}
