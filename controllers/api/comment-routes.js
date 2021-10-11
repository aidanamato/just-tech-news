const router = require('express').Router();
const {Comment} = require('../../models');

router.get('/', (req, res) => {
  Comment.findAll()
    .then(dbCommentData => res.json(dbCommentData))
    .catch(err => res.status(500).json(err));
});

router.post('/', ({session, body}, res) => {
  if (session) {
    Comment.create({
      comment_text: body.comment_text,
      post_id: body.post_id,
      user_id: session.user_id
    })
      .then(dbCommentData => res.json(dbCommentData))
      .catch(err => {
        console.log(err);
        res.status(400).json(err);
      });
  }
});

router.delete('/:id', ({params}, res) => {
  Comment.destroy({
    where: {
      id: params.id
    }
  })
    .then(dbCommentData => {
      if (!dbCommentData) {
        res.status(404).json({message: 'No comment found with this id'});
        return;
      }
      res.json(dbCommentData);
    })
    .catch(err => res.status(500).json(err));
});

module.exports = router;