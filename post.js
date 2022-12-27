export class Post {
  constructor(title, content, user, posts) {
    this.title = title;
    this.content = content;
    this.userId = user.id;
    this.id = posts.postsList.length + 1;
  }
}
