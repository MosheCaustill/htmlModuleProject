export class User {
  constructor(name, password, users) {
    this.userType = "user";
    this.name = name;
    this.password = password;
    this.id= users.usersList.length+1;
  }
}
