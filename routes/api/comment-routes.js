const router = require('express').Router();
const {Comment} = require('../../models');

router.get('/', (req, res) => {
  Comment.findAll()
    .then(dbCommentData => res.json(dbCommentData))
    .catch(err => res.status(500).json(err));
});

router.post('/', ({body}, res) => {
  Comment.create({
    comment_text: body.comment_text,
    user_id: body.user_id,
    post_id: body.post_id
  })
    .then(dbCommentData => res.json(dbCommentData))
    .catch(err => res.status(400).json(err));
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