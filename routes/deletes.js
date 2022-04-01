const express = require("express");
const Post = require("../models/posts");
const router = express.Router();

router.delete('/', (req, res, next) => {
    let id =req.body.id;
    
    Post.findOneAndDelete({
        _id: id, 
        })
        .exec((err, post) => {
          if(err)
            return res.status(500).json({code: 500, message: 'There was an error deleting the post', error: err})
          res.status(200).json({code: 200, message: 'Post deleted', deletedPost: post})
        });
});

module.exports = router ;