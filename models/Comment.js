export const comments = [];

let commentIdCounter = 1;

export const createComment = (articleId, userId, username, content) => {
  const newComment = {
    id: commentIdCounter++,
    articleId,
    userId,
    username,
    content,
    createdAt: new Date(),
  };
  comments.push(newComment);
  return newComment;
};

export const getCommentsByArticleId = (articleId) => {
  return comments
    .filter((c) => c.articleId === articleId)
    .sort((a, b) => b.createdAt - a.createdAt);
};

export const deleteComment = (id) => {
  const index = comments.findIndex((c) => c.id === id);
  if (index !== -1) {
    comments.splice(index, 1);
    return true;
  }
  return false;
};

export default {
  comments,
  createComment,
  getCommentsByArticleId,
  deleteComment,
};
