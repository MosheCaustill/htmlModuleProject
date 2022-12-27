  export class Comments {
    commentsList = [];
    constructor() {
      this.getCommentsList();
    }
    getCommentsList() {
      if (!localStorage.getItem("comments")) {
        this.updateCommentsList();
      } else {
        this.commentsList = JSON.parse(localStorage.getItem("comments"));
      }
    }
    updateCommentsList() {
      localStorage.setItem("comments", JSON.stringify(this.commentsList));
      this.getCommentsList();
    }
  }