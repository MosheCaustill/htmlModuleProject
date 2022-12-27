export class Posts {
  postsList = [];
  constructor() {
    this.getPostsList();
  }
  getPostsList() {
    if (!localStorage.getItem("posts")) {
      this.updatePostsList();
    } else {
      this.postsList = JSON.parse(localStorage.getItem("posts"));
    }
  }
  updatePostsList() {
    localStorage.setItem("posts", JSON.stringify(this.postsList));
    this.getPostsList();
  }
}
