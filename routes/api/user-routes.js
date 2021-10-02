const router = require('express').Router();
const {User, Post, Vote} = require('../../models');

// GET /api/users
router.get('/', (req, res) => {
  //access our User model and run .findAll method
  User.findAll({
    include: [
      {
        model: Post,
        attributes: ['id', 'title', 'post_url', 'created_at']
      }
    ]
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
    where: {id: req.params.id},
    include: [
      {
        model: Post,
        attributes: ['id', 'title', 'post_url', 'created_at']
      },
      {
        model: Post,
        attributes: ['title'],
        through: Vote,
        as: 'voted_posts'
      }
    ]
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

//POST /api/users/login
router.post('/login', ({body}, res) => {
  User.findOne({
    where: {
      email: body.email
    }
  }).then(dbUserData => {
    if (!dbUserData) {
      res.status(400).json({message: 'No user with that email address.'});
      return;
    }
    
    const validPassword = dbUserData.checkPassword(body.password);
    if (!validPassword) {
      res.status(400).json({message: 'Incorrect password'});
      return;
    }

    res.json({user: dbUserData, message: 'You are now logged in!'});
  });
});

// PUT /api/users/:id
router.put('/:id', ({body, params}, res) => {
  User.update(body, {
    individualHooks: true,
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