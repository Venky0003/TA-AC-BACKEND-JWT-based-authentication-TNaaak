var express = require('express');
var router = express.Router();
var auth = require('../middlewares/auth');
var User = require('../models/user');

router.get('/:username', auth.verifyToken, async (req, res, next) => {
  // let userId = req.user.userId;
  let username = req.params.username;
  try {
    var user = await User.findOne({ username });
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }
    res.status(201).json(user);
  } catch (error) {
    // console.log(error);
    res.status(400).json(error);
  }
});

router.post('/:username/follow', auth.verifyToken, async (req, res, next) => {
  try {
    var followingId = req.user.userId;
    var followedUsername = req.params.username;

    var followedUser = await User.findOne({ username: followedUsername });

    // checking if user is there or not
    if (!followedUser) {
      return res.status(404).json({ message: 'User not found' });
    }
    // checking if the userr is trying follow  himself
    if (followedUser._id.toString() === followingId) {
      return res.status(400).json({ message: 'You cannot follow yourself' });
    }
    // checking if the user is already following the same user
    if (followedUser.followers.includes(followingId)) {
      return res
        .status(400)
        .json({ message: 'You are already following this user' });
    }

    // users followed by me update with the followedUser
    await User.findByIdAndUpdate(followingId, {
      $push: { following: followedUser._id },
    });

    // users who follows me update with followingId
    await User.findByIdAndUpdate(followedUser._id, {
      $push: { followers: followingId },
    });

    res.status(200).json({ message: 'Successfully followed' });
  } catch (error) {
    res.status(500).json(error);
  }
});

router.post('/:username/unfollow', auth.verifyToken, async (req, res, next) => {
  try {
    var unFollowingId = req.user.userId;
    var unFollowedUsername = req.params.username;
    var unFollowedUser = await User.findOne({ username: unFollowedUsername });

    if (!unFollowedUser) {
      return res
        .status(400)
        .json({ message: 'You are already unfollowing this user' });
    }

    if (unFollowedUser._id.toString() === unFollowingId) {
      return res
        .status(400)
        .json({ message: 'You cannot follow/unfollow yourself' });
    }
    if (!unFollowedUser.followers.includes(unFollowingId)) {
      return res
        .status(400)
        .json({ message: 'You are already unfollowing this user' });
    }

     // users followed by me update with the unfollowedUser
     await User.findByIdAndUpdate(unFollowingId, {
        $pull: { following: unFollowedUser._id },
      });
  
      // users who follows me update with ufollowingId
      await User.findByIdAndUpdate(unFollowedUser._id, {
        $pull: { followers: unFollowingId },
      });
    res.status(201).json({ message: 'Unfollowed this user Successfully' });
  } catch (error) {
    res.status(500).json(error);
  }
});

module.exports = router;
