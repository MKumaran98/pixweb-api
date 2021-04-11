const express=require('express')
const router=express.Router();

const videosController=require('../Controllers/Videos.controller');
const userController=require('../Controllers/Users.controller');
const playlistController=require('../Controllers/Playlist.controller');

// Video routes

router.get("/videos",videosController.sendAllVideos)
router.get('/videos/:id',videosController.sendSelectedVideo)

//User routes

router.post('/users',userController.addUser)
router.post('/users/:id/update-password',userController.changePassword)

//Playlist routes

router.get('/playlists/:id',playlistController.sendAllPlaylists)
router.post('/playlists/:id',playlistController.addNewPlaylist)
router.put('/playlists/:playlistid/video/:videoid',playlistController.addVideoToPlaylist)
router.delete('/playlists/:playlistid/video/:videoid',playlistController.removeVideoFromPlaylist)
router.delete('/playlists/:playlistid',playlistController.deletePlaylist)

//History routes

router.put('/histories/:videoid/users/:id',videosController.addToHistory)

module.exports=router;