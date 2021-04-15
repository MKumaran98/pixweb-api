const express=require('express')
const router=express.Router();
const passport=require('passport')

//middlewares

const playlistCheck=require('../Middleware/playlistCheck');
const videoCheck=require('../Middleware/videoCheck');
const userCheck=require('../Middleware/userCheck');
const likeCheck=require('../Middleware/likeCheck');
const noteCheck=require('../Middleware/noteCheck')

//controllers

const videosController=require('../Controllers/Videos.controller');
const userController=require('../Controllers/Users.controller');
const playlistController=require('../Controllers/Playlist.controller');

// Video routes

router.get("/videos",videosController.sendAllVideos)
router.get('/videos/:videoid',videoCheck,videosController.sendSelectedVideo)

//User routes

router.post('/users/signin',userController.signinUser)
router.post('/users/signup',userController.signupUser)
router.post('/users/password',userController.changePassword)

//Playlist routes

router.get('/playlists/:id',passport.authenticate('jwt',{session:false}),userCheck,playlistController.sendAllPlaylists)
router.post('/playlists/:id',passport.authenticate('jwt',{session:false}),userCheck,playlistController.addNewPlaylist)
router.put('/playlists/:playlistid/video/:videoid',passport.authenticate('jwt',{session:false}),playlistCheck,videoCheck,playlistController.addVideoToPlaylist)
router.delete('/playlists/:playlistid/video/:videoid',passport.authenticate('jwt',{session:false}),playlistCheck,videoCheck,playlistController.removeVideoFromPlaylist)
router.delete('/playlists/:playlistid',passport.authenticate('jwt',{session:false}),playlistCheck,playlistController.deletePlaylist)

//History routes

router.get('/histories/:id',passport.authenticate('jwt',{session:false}),userCheck,videosController.getUserHistory)
router.put('/histories/:videoid/users/:id',passport.authenticate('jwt',{session:false}),userCheck,videoCheck,videosController.addToHistory)

//likes and notes routes

router.put('/likes/:videoid/users/:id',passport.authenticate('jwt',{session:false}),userCheck,videoCheck,videosController.addLikes)
router.delete('/likes/:likeid',passport.authenticate('jwt',{session:false}),likeCheck,videosController.removeLike)
router.post('/notes/:videoid/users/:id',passport.authenticate('jwt',{session:false}),userCheck,videoCheck,videosController.addNotes)
router.delete('/notes/:noteid',passport.authenticate('jwt',{session:false}),noteCheck,videosController.removeNote)

module.exports=router;