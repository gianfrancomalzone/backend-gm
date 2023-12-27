export class UserDTO {
    constructor(user) {
        this.first_name = user.first_name;
        this.last_name = user.last_name;
        this.fullname = user.first_name + " " + user.last_name;
        this.email = user.email;
        this.age = user.age;
        this.password = user.password;
        this.registerMethod = user.registerMethod;
        this.cartId = user.cartId;
        this.role = user.role;
    }
}

export class UserViewDTO {
    constructor (user) {
        this._id = user._id;
        this.fullname = user.first_name + " " + user.last_name;
        this.email = user.email;
        this.role = user.role;
    }
}