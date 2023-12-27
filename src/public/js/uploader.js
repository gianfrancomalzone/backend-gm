const form = document.getElementById('uploader');
form.addEventListener('submit', e => {
    e.preventDefault();
    let data = new FormData();
    let someFileUploaded = false; 
    let input_list = document.querySelectorAll('input[type="file"]');
    let input_array = [...input_list];
    input_array.forEach(file => {
        if (file.files[0]) {
            data.append(file.id, file.files[0], file.files[0].name);
            someFileUploaded = true;
        }
    });

    const uid = document.getElementById("uid").value;
    if (someFileUploaded) {
        fetch('/api/users/' + uid + '/documents', {
            method: 'POST',
            body: data,
        }).then(result => {
            console.log(result);
            if (result.status === 200) {
                alert('Documentos subidos correctamente');
                location.href = "/";
            } else {
                alert("Hubo un error al subir los documentos");
            }
        });
    } else {
        alert('No se ha seleccionado ningún archivo');
    }
});