export class Users {
    usersList = [];
    constructor() {
      this.getUsersList();
    }
    getUsersList() {
      if (!localStorage.getItem("users")) {
        this.updateUsersList();
      } else {
        this.usersList = JSON.parse(localStorage.getItem("users"));
      }
    }
    updateUsersList() {
      localStorage.setItem("users", JSON.stringify(this.usersList));
      this.getUsersList();
    }
  }