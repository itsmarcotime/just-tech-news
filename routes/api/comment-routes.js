const router = require('express').Router();
const {Comment} = require('../../models');

//this will get all comments 
router.get('/', (req, res) => {

    Comment.findAll()
     .then(dbCommentData => res.json(dbCommentData))
     .catch(err => {
        console.log(err);
        res.status(500).json(err);
     });

});

//this will create a comment
router.post('/', (req, res) => {
    Comment.create({
        comment_text: req.body.comment_text,
        user_id: req.body.user_id,
        post_id: req.body.post_id
    })
    .then(dbCommentData => res.json(dbCommentData))
    .catch(err => {
        console.log(err);
        res.status(400).json(err);
    });
});

//this will delete a specific comment based on id
router.delete('/:id', (req, res) => {

    Comment.destroy({
        where: {
            id: req.params.id
        }
    })
    .then(dbCommentData => {
        if (!dbCommentData) {
            res.status(404).json({message: 'No posts were found with this id!'});
            return;
        }
        res.json(dbCommentData);
    })
    .catch(err => {
        console.log(err);
        res.status(500).json(err);
    });

});

module.exports = router;