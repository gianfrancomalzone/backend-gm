const deleteUser = (userId) => {
    if (confirm("¿Deseas eliminar este usuario?\nEsta acción no puede revertirse")) {
        fetch("/api/users/removeuser/" + userId, {
            method: "DELETE",
            headers: {
                "Content-Type": "application/json"
            },
        }).then(response => response.json())
            .then(data => {
                if (data.status === 'ok') {
                    alert(data.message);
                    location.reload();
                }
            })
            .catch(error => {
                console.log(error); 
            });
    }
}

const changeUserRole = (userId, userRole) => {
    let puedeProceder = false;
    let nuevoRol;
    if (userRole === 'Usuario') {
        nuevoRol = "Premium";
        puedeProceder = true;
    } else if (userRole === 'Premium') {
        nuevoRol = "Usuario";
        puedeProceder = true;
    } else {
        puedeProceder = false;
    }
    if (!puedeProceder) {
        alert("No se puede aplicar el cambio de rol en este usuario");
    } else {
        if (confirm("¿Deseas cambiar el rol de este usuario a " + nuevoRol + "?")) {
            fetch("/api/users/premium/" + userId, {
                method: "GET",
                headers: {
                    "Content-Type": "application/json"
                },
            }).then(response => response.json())
                .then(data => {
                    alert(data.message);
                    if (data.status === 'ok') {
                        location.reload();
                    }
                })
                .catch(error => {
                    console.log(error);
                });
        }
    }

}