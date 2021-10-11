const router = require('express').Router();
const {Post, User, Vote, Comment} = require('../../models');
const sequelize = require('../../config/connection');

router.get('/', (req, res) => {
  Post.findAll({
    attributes: [
      'id', 'post_url', 'title', 'created_at',
      [
        sequelize.literal('(SELECT COUNT(*) FROM vote WHERE post.id = vote.post_id)'),
        'vote_count'
      ]
    ],
    order: [['created_at', 'DESC']],
    include: [
      {
      model: User,
      attributes: ['username']
      },
      {
        model: Comment,
        include: {
          model: User,
          attributes: ['username']
        }
      }
    ]
  })
    .then(dbPostData => res.json(dbPostData))
    .catch(err => {
      console.log(err);
      res.status(500).json(err);
    });
});

router.get('/:id', ({params}, res) => {
  Post.findOne({
    where: {
      id: params.id
    },
    attributes: [
      'id', 'post_url', 'title', 'created_at',
      [
        sequelize.literal('(SELECT COUNT(*) FROM vote WHERE post.id = vote.post_id)'),
        'vote_count'
      ]
    ],
    include: [
      {
        model: User,
        attributes: ['username']
      },
      {
        model: Comment,
        include: {
          model: User,
          attributes: ['username']
        }
      }
    ]
  })
    .then(dbPostData => {
      if (!dbPostData) {
        res.status(404).json({message: 'No post found with this id'});
        return
      }
      res.json(dbPostData);
    })
    .catch(err => {
      console.log(err);
      res.status(500).json(err)
    });
});

router.post('/', ({body}, res) => {
  Post.create(body)
    .then(dbPostData => res.json(dbPostData))
    .catch(err => {
      console.log(err);
      res.status(500).json(err)
    });
});

router.put('/upvote', ({session, body}, res) => {
  if (session) {
    Post.upvote({...body, user_id: session.user_id}, {Vote})
    .then(dbPostData => res.json(dbPostData))
    .catch(err => {
      console.log(err);
      res.status(500).json(err);
    });
  }
});

router.put('/:id', (req, res) => {
  Post.update(req.body, {
      where: {
        id: req.params.id
      }
    }
  )
    .then(dbPostData => {
      if (!dbPostData) {
        res.status(404).json({message: 'No post found with this id'});
        return;
      }
      res.json(dbPostData);
    })
    .catch(err => {
      console.log(err);
      res.status(500).json(err);
    });
});

router.delete('/:id', ({params}, res) => {
  Post.destroy({
    where: {
      id: params.id
    }
  })
    .then(dbPostData => {
      if (!dbPostData) {
        res.status(404).json({message: 'No post found with this id'});
        return;
      }
      res.json(dbPostData);
    })
    .catch(err => {
      console.log(err);
      res.status(500).json(err);
    });
});

module.exports = router;