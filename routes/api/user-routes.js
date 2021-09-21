const router = require('express').Router();
const {User} = require('../../models');

// GET /api/users
router.get('/', (req, res) => {
  //access our User model and run .findAll method
  User.findAll({
    attributes: {exclude: ['password']}
  })
    .then(dbUserData => res.json(dbUserData))
    .catch(err => {
      console.log(err);
      res.status(500).json(err);
    });
});

// GET /api/users/:id
router.get('/:id', (req, res) => {
  User.findOne({
    attributes: {exclude: ['password']},
    where: {id: req.params.id}
  })
    .then(dbUserData => {
      if (!dbUserData) {
        res.status(404).json({message: 'No user found with this id'});
        return;
      }
      
      res.json(dbUserData);
    })
    .catch(err => {
      console.log(err);
      res.status(500).json(err);
    });
});

// POST /api/users
router.post('/', ({body}, res) => {
  User.create({
    username: body.username,
    email: body.email,
    password: body.password
  })
    .then(dbUserData => res.json(dbUserData))
    .catch(err => {
      console.log(err);
      res.status(500).json(err);
    });
});

// PUT /api/users/:id
router.put('/:id', ({body, params}, res) => {
  User.update(body, {
    where: {
      id: params.id
    }
  })
    .then(dbUserData => res.json(dbUserData))
    .catch(err => {
      console.log(err);
      res.status(500).json(err);
    });
});

// DELETE /api/users/:id
router.delete('/:id', ({params}, res) => {
  User.destroy({
    where: {
      id: params.id
    }
  })
    .then(dbUserData => {
      if (!dbUserData) {
        res.status(404).json({message: 'No user found with this id'});
        return;
      }
      res.json(dbUserData);
    })
    .catch(err => {
      console.log(err);
      res.status(500).json(err);
    });
});

module.exports = router;