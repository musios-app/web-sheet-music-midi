
function setDropArea(el, callback) {
    el.addEventListener('dragover', (event) => {
        event.preventDefault();
        el.classList.add('hover');
    });

    el.addEventListener('dragleave', () => {
        el.classList.remove('hover');
    });

    el.addEventListener('drop', (event) => {
        event.preventDefault();
        el.classList.remove('hover');

        const file = event.dataTransfer.files[0];

        if (file) {
            const validTypes = ['image/jpeg', 'image/png', 'application/pdf', 'text/plain'];
            if (!validTypes.includes(file.type)) {
                alert('PDF, images and text files are supported. Images as JPEG or PNG.');
                return false;
            }

            const reader = new FileReader();
            reader.onload = function (e) {
            //   console.log('onload()');
              const dataURI = e.target.result;
              callback(file.name, file.type, dataURI);
            };
            reader.readAsDataURL(file);
        }
    });
}
