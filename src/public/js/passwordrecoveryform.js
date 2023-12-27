const form = document.getElementById('formPasswordRecovery');
form.addEventListener('submit', e => {
    e.preventDefault();
    const data = new FormData(form);
    const email = data.get('email').trim();
    if (!email) {
        alert("No has especificado un correo electrónico");
    } else {
        const result = fetch("/recovery/password/" + email, {
            method: "get",
            headers: { 'Content-Type': 'application/json' }
        }
        ).then(result => {
            if (result.status === 200) {
                alert("Se ha enviado un link de recupero de Contraseña\nRecuerda que tienes una hora para cambiarla");
                window.location.replace('/products');
            } else if (result.status === 403) {
                alert("El correo electrónico especificado no es válido");
            } else {
                alert("No encontramos un usuario con el correo electrónico especificado");
            }
        });

    }
});