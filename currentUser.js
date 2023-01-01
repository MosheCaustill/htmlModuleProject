export class CurrentUser {
  user
  constructor() {
    this.user;
    this.getCurrentUser();
  }
  getCurrentUser() {
    if (!localStorage.getItem("currentUser")) {
      this.updateCurrentUser();
    } else {
      this.user = JSON.parse(localStorage.getItem("currentUser"));
    }
  }
  updateCurrentUser() {
    localStorage.setItem("currentUser", JSON.stringify(this.user));
    this.getCurrentUser();
  }
}