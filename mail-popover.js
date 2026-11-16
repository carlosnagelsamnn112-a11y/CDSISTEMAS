// Popover del botón de correo (compartido entre páginas)
(function() {
  const mailBtn = document.getElementById('mailFloatBtn');
  const mailPopover = document.getElementById('mailPopover');
  const mailCopyBtn = document.getElementById('mailCopyBtn');
  if (!mailBtn || !mailPopover || !mailCopyBtn) return;

  const mailAddress = document.getElementById('mailPopoverAddress').textContent.trim();

  function openMailPopover() {
    mailPopover.hidden = false;
    mailBtn.setAttribute('aria-expanded', 'true');
  }

  function closeMailPopover() {
    mailPopover.hidden = true;
    mailBtn.setAttribute('aria-expanded', 'false');
  }

  mailBtn.addEventListener('click', (e) => {
    e.stopPropagation();
    if (mailPopover.hidden) {
      openMailPopover();
    } else {
      closeMailPopover();
    }
  });

  mailCopyBtn.addEventListener('click', async () => {
    try {
      if (navigator.clipboard && window.isSecureContext) {
        await navigator.clipboard.writeText(mailAddress);
      } else {
        const tempInput = document.createElement('textarea');
        tempInput.value = mailAddress;
        tempInput.style.position = 'fixed';
        tempInput.style.opacity = '0';
        document.body.appendChild(tempInput);
        tempInput.select();
        document.execCommand('copy');
        document.body.removeChild(tempInput);
      }
      const original = mailCopyBtn.textContent;
      mailCopyBtn.textContent = '¡Copiado!';
      mailCopyBtn.classList.add('copied');
      setTimeout(() => {
        mailCopyBtn.textContent = original;
        mailCopyBtn.classList.remove('copied');
      }, 1800);
    } catch (err) {
      mailCopyBtn.textContent = 'Error';
    }
  });

  document.addEventListener('click', (e) => {
    if (!mailPopover.hidden && !mailPopover.contains(e.target) && e.target !== mailBtn) {
      closeMailPopover();
    }
  });

  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && !mailPopover.hidden) {
      closeMailPopover();
      mailBtn.focus();
    }
  });
})();
