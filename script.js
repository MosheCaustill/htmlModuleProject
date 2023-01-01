import { User } from "./user.js";
import { Post } from "./post.js";
import { Comment } from "./comment.js";
import { Users } from "./users.js";
import { Posts } from "./posts.js";
import { Comments } from "./comments.js";
import { CurrentUser } from "./currentUser.js";

let users = new Users();

//מעדכן את משתמשי ברירת המחדל רק בפעם הראשונה של הפעלת האתר במחשב ספציפי//
if (users.usersList.length == 0) {
  let guest = new User("guest", "guest", users);
  guest.userType = "guest";
  users.usersList.push(guest); //usersList[0]//
  let admin = new User("Admin", "Admin", users);
  admin.userType = "admin";
  users.usersList.push(admin); //usersList[1]//
  users.updateUsersList();
  let currentUser = new CurrentUser();
  currentUser.user=guest;
};

//יוצר אובייקטים המשתמשים בלוקל סטורג//
let posts = new Posts();
let comments = new Comments();
let currentUser = new CurrentUser();
//שומר על משתמש מחובר//
changeLogStatus(currentUser.user);

//restart info////יש להתעלם יצרתי זאת כדי לבחון מה יקרה כאשר האתר נטען הבמחשב חדש//
function restart() {
  users.usersList=[];
  users.updateUsersList();
  posts.postsList=[];
  posts.updatePostsList();
  comments.commentsList=[];
  comments.updateCommentsList();
  currentUser.user=users.usersList[0];
  currentUser.updateCurrentUser();
}
// restart();  //רק לאיתחול של האתר והנתונים למקרה הצורך//

/////////////////////log in/out////////////////////////
let logBtn = document.getElementById("logBtn");
logBtn.addEventListener("click", () => {
  let name = document.getElementById("name").value;
  let password = document.getElementById("password").value;
  users.usersList.forEach((user, index, arr) => {
    if (user.name == name) {
      if (user.password == password) {
        if (user.name == "Admin") {
          changeLogStatus(user);
          arr.length = index + 1;
        } else {
          changeLogStatus(user);
          arr.length = index + 1;
        }
      } else {
        alert("wrong password");
        arr.length = index + 1;
      }
    } else if (
      users.usersList.length == Number(index + 1) &&
      user.name != name
    ) {
      alert("new user created successfully");
      let user = new User(name, password, users);
      users.usersList.push(user);
      users.updateUsersList();
      changeLogStatus(user);
    }
  });
});

let logOutBtn = document.getElementById("logOutBtn");
logOutBtn.addEventListener("click", () => {
  changeLogStatus(users.usersList[0]);
});

function changeLogStatus(user) {
  currentUser.user = user;
  currentUser.updateCurrentUser();
  let logStatusText = document.getElementById("logStatus");
  logStatusText.innerHTML = "you are logged in as " + currentUser.user.name;
  console.log("current user is: "+currentUser.user.name)
}

//////////html post render///////////מעלה את כל הפוסטים מהזיכרון
function createPosts(posts) {
  //main posts div//
  let postsDiv = document.getElementById("posts");

  posts.forEach((post) => {
    let postDiv = document.createElement("div");
    postDiv.setAttribute("id", post.id);
    postDiv.setAttribute("class", "post");

    //post title//
    let title = document.createElement("h1");
    let titleText = document.createTextNode(post.title);
    title.appendChild(titleText);

    //post content//
    let postContent = document.createElement("h3");
    let postText = document.createTextNode(post.content);

    //post comments div//
    let commentsDiv = document.createElement("div");
    commentsDiv.setAttribute("class", "comments");
    let commentContent = document.createElement("h2");
    let commentContentText = document.createTextNode("Comments:");
    commentContent.appendChild(commentContentText);
    commentsDiv.appendChild(commentContent);

    //create add comment input//
    let addCommentForm = document.createElement("div");
    let commentInput = document.createElement("input");
    commentInput.setAttribute("id", "commentContent" + post.id);
    commentInput.setAttribute("onfocus", "this.value=''");

    //create add comment BTN//
    let commentBtn = document.createElement("button");
    let btnId = "btn" + post.id;
    commentBtn.setAttribute("id", btnId);
    let commentBtnText = document.createTextNode("add comment");
    commentBtn.appendChild(commentBtnText);

    //create comment form//
    addCommentForm.appendChild(commentInput);
    addCommentForm.appendChild(commentBtn);
    let commentList = document.createElement("ul");
    commentList.setAttribute("id", "ul" + post.id);
    commentsDiv.appendChild(addCommentForm);
    commentsDiv.appendChild(commentList);
    postContent.appendChild(postText);

    //append to html//
    postDiv.appendChild(title);
    postDiv.appendChild(postContent);
    postDiv.appendChild(commentsDiv);
    postsDiv.appendChild(postDiv);
    commentBtn.addEventListener("click", () => {
      addComment(post);
    });
  });
}

//////מוסיף תגובות מהזיכרון//////////
function addComments(comments) {
  comments.forEach((comment) => {
    let commentList = document.getElementById("ul" + comment.postId);
    let eraseCommentBtn = document.createElement("button");
    eraseCommentBtn.setAttribute("id", "commentBtnId" + comment.id);
    eraseCommentBtn.setAttribute("class", "eraseBtn");
    let eraseCommentBtnText = document.createTextNode("Erase");
    eraseCommentBtn.appendChild(eraseCommentBtnText);
    eraseCommentBtn.addEventListener("click", () => {
      removeComment(comment);
    });
    let commentContent = document.createElement("li");
    let commentContentText = document.createTextNode(comment.content + "   ");
    commentContent.appendChild(commentContentText);
    commentContent.appendChild(eraseCommentBtn);
    commentList.appendChild(commentContent);
  });
}

///////////adding comment from Html////////////
function addComment(post) {
  if (currentUser.user.userType == ("user" || "admin")) {
    let commentContent = document.getElementById(
      "commentContent" + post.id
    ).value;
    let comment = new Comment(
      commentContent,
      currentUser.user,
      posts.postsList[post.id - 1],
      comments
    );
    comments.commentsList.push(comment);
    comments.updateCommentsList();
    addComments([comments.commentsList[comments.commentsList.length - 1]]);
    console.log(comments);
  } else {
    alert("you must log-in to comment");
  }
}
////////////////admin only functions//////////////
////Admin , Admin////////////

function removeComment(comment) {
  if (currentUser.user.userType == "admin") {
    comments.commentsList.splice(comment.id - 1, 1);
    console.log(comments.commentsList);
    comments.commentsList.forEach((comment, index) => {
      comment.id = index + 1;
    });
    let postsDiv = document.getElementById("posts");
    comments.updateCommentsList();
    postsDiv.innerHTML = "";
    createPosts(posts.postsList);
    addComments(comments.commentsList);
  } else {
    alert("only admin can erase comments");
  }
}

///////adding new post by admin////////////////
let postBtn = document.getElementById("postBtn");
postBtn.addEventListener("click", () => {
  if (currentUser.user.userType == "admin") {
    let postTitle = document.getElementById("title").value;
    let postContent = document.getElementById("postContent").value;
    let post = new Post(postTitle, postContent, currentUser.user, posts);
    posts.postsList.push(post);
    posts.updatePostsList();
    createPosts([posts.postsList[posts.postsList.length - 1]]);
  } else {
    alert("only admin can add post");
  }
});

////////////////////////initial data for page///////////////////////
if (posts.postsList.length == 0) {
  let post1 = new Post(
    "Tommy Emmanuel",
    "William Thomas Emmanuel (born 31 May 1955) is an Australian guitarist. Regarded as one of the greatest acoustic guitarists of all time, he is known for his complex fingerstyle technique, energetic performances and use of percussive effects on the instrument.",
    users.usersList[1],
    posts
  );
  posts.postsList.push(post1);

  let post2 = new Post(
    "Andy McKee",
    "McKee played his first guitar, an Aria nylon string bought by his father, at age 13. Initially underwhelmed by his guitar lessons, McKee began teaching himself how to play guitar. He began learning shred guitar music, including songs by Metallica, Eric Johnson, and Joe Satriani. McKee's electric guitar-playing cousin inspired him to continue learning, taking him out for his 16th birthday to see a guitarist named Preston Reed perform live at a clinic. McKee later bought an instructional videotape from Reed and began to learn many of his acoustic guitar techniques from it. Later that year, with his mother's permission, he obtained his GED in order to quit attending high school and play more guitar. He began to be influenced by primarily acoustic guitarists such as Michael Hedges, Billy McLaughlin, Pat Kirtley, and from Passion Session by Don Ross, as he continued studying the instrument on his own.",
    users.usersList[1],
    posts
  );
  posts.postsList.push(post2);

  let post3 = new Post(
    "Chet Atkins",
    "Atkins was born on June 20, 1924, in Luttrell, Tennessee, near Clinch Mountain. His parents divorced when he was six years old, after which he was raised by his mother. He was the youngest of three boys and a girl. He started out on the ukulele, later moving on to the fiddle, but he made a swap with his brother Lowell when he was nine: an old pistol and some chores for a guitar. He stated in his 1974 autobiography, We were so poor and everybody around us was so poor that it was the forties before anyone even knew there had been a depression. Forced to relocate to Fortson, Georgia, outside of Columbus to live with his father because of a critical asthma condition, Atkins was a sensitive youth who became obsessed with music. Because of his illness, he was forced to sleep in a straight-back chair to breathe comfortably.",
    users.usersList[1],
    posts
  );
  posts.postsList.push(post3);
  posts.updatePostsList();
}

if (comments.commentsList.length == 0) {
  let comment1 = new Comment(
    "the best player in the world",
    users.usersList[1],
    posts.postsList[0],
    comments
  );
  comments.commentsList.push(comment1);

  let comment2 = new Comment(
    "best song ever half way home",
    users.usersList[1],
    posts.postsList[0],
    comments
  );
  comments.commentsList.push(comment2);

  let comment3 = new Comment(
    "gotta love drifting",
    users.usersList[1],
    posts.postsList[1],
    comments
  );
  comments.commentsList.push(comment3);
  comments.updateCommentsList();
}

createPosts(posts.postsList);
setTimeout(addComments(comments.commentsList), 1);