const router = require('express').Router();
const sequelize = require('../config/connection');
const {Post, User, Comment} = require('../models');

router.get('/', (req, res) => {
  Post.findAll({
    attributes: {
      include: [
        [sequelize.literal('(SELECT COUNT(*) FROM vote WHERE post.id = vote.post_id)'), 'vote_count']
      ],
      exclude: ['updated_at']
    },
    include: [
      {
        model: Comment,
        attributes: {
          exclude: ['updated_at']
        },
        include: {
          model: User,
          attributes: ['username']
        }
      },
      {
        model: User,
        attributes: ['username']
      }
    ]
  })
    .then(dbPostData => {
      // render the first post
      const posts = dbPostData.map(post => post.get({plain: true}));
      res.render('homepage', {posts});
    })
    .catch(err => {
      console.log(err);
      res.status(500).json(err);
    });
});

module.exports = router;