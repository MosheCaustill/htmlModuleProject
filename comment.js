export class Comment {
  content;
  constructor(content, user, post, comments) {
    this.content = content;
    this.userId = user.id;
    this.postId = post.id;
    this.id = comments.commentsList.length + 1;
  }
}