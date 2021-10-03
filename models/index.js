const User = require('./User');
const Post = require('./Post');
const Vote = require('./Vote');
const Comment = require('./Comment');

// User-Post one to many
User.hasMany(Post, {
  foreignKey: 'user_id'
});

Post.belongsTo(User, {
  foreignKey: 'user_id'
});

// User-Vote-Post many to many
User.belongsToMany(Post, {
  through: Vote,
  as: 'voted_posts',
  foreignKey: 'user_id'
});

Post.belongsToMany(User, {
  through: Vote,
  as: 'voted_posts',
  foreignKey: 'post_id'
});

// Vote-User one to many
Vote.belongsTo(User, {
  foreignKey: 'user_id'
});

User.hasMany(Vote, {
  foreignKey: 'user_id'
});

// Vote-Post one to many
Vote.belongsTo(Post, {
  foreignKey: 'post_id'
});

Post.hasMany(Vote, {
  foreignKey: 'post_id'
});

// Comment-User one to many
Comment.belongsTo(User, {
  foreignKey: 'user_id'
});

User.hasMany(Comment, {
  foreignKey: 'user_id'
});

// Comment-Post one to many
Comment.belongsTo(Post, {
  foreignKey: 'post_id'
});

Post.hasMany(Comment, {
  foreignKey: 'post_id'
});

module.exports = {User, Post, Vote, Comment};