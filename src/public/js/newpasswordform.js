
const form = document.getElementById('formNewPassword');
form.addEventListener('submit', e => {
    e.preventDefault();
    const data = new FormData(form);
    const password = data.get('password');
    const userId = data.get('userId');
    if (!password || !userId) {
        alert("No has especificado una contraseña o hay un problema con el formulario");
    } else {
        const resetPwd = fetch("/recovery/password", {
            method: "post",
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ userId: userId, password: password })

        }).then(response => {
            if (response.status === 200) {
                alert("La contraseña se cambió correctamente\nUtilizala para iniciar sesión");
                window.location.replace('/');
            } else if (response.status === 403) {
                alert("No puedes repetir la misma contraseña");
            } else {
                alert("Hubo un error al restablecer la contraseña");
            }
        });
    }
});