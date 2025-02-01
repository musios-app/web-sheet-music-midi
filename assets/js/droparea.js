
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

        // console.log(event.dataTransfer.files);

        [...event.dataTransfer.files]
            .filter(file => file)
            .forEach(file => {
                // console.log("file:", file);
                if (!file) return;

                const validTypes = ['image/jpeg', 'image/png', 'application/pdf', 'text/plain'];
                if (!validTypes.includes(file.type)) {
                    alert('PDF, images and text files are supported. Images as JPEG or PNG.');
                    return
                }

                const reader = new FileReader();
                reader.onload = function (e) {
                    const dataURI = e.target.result;
                    callback(file.name, file.type, dataURI);
                };

                reader.readAsDataURL(file);
            });
    });
}
