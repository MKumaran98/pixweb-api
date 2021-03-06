const { Video, User, Like, Note } = require("../models");

const sendAllVideos = async (req, res) => {
  try {
    const data = await Video.find();
    return res.status(200).json({
      ok: true,
      data: data,
      message: "Full videolist sent successfully",
    });
  } catch (error) {
    console.log(error);
    return res.status(503).json({
      ok: false,
      message: "Unable to load videos please try again later",
    });
  }
};

const sendSelectedVideo = async (req, res) => {
  const video = req.video;
  try {
    const data = await (
      await video.execPopulate("likes")
    ).execPopulate({ path: "notes", populate: { path: "by" } });
    return res.status(200).json({
      ok: true,
      data: data,
      message: "Video sent successfully",
    });
  } catch (error) {
    console.log(error);
    return res.status(503).json({
      ok: false,
      message: "Unable to load selected video please try again later",
    });
  }
};

const addToHistory = async (req, res) => {
  const { videoid } = req.params;
  const user = req.user;
  try {
    if (!user.histories.includes(videoid)) {
      user.histories.push(videoid);
      await user.save();
    }
    const newUser = await User.findById(user._id);
    const { histories } = await newUser.execPopulate("histories");
    return res.status(201).json({
      ok: true,
      data: histories,
      message: "Video added to history",
    });
  } catch (error) {
    console.log(error);
    return res.status(503).json({
      ok: false,
      message: "Unable to add video to history please try again later",
    });
  }
};

const getUserHistory = async (req, res) => {
  const user = req.user;
  try {
    const { histories } = await user.execPopulate("histories");
    return res.status(200).json({
      ok: true,
      data: histories,
      message: "History sent successfully",
    });
  } catch (error) {
    console.log(error);
    return res.status(503).json({
      ok: false,
      message: "Unable to load histories please try again later",
    });
  }
};

const addLikes = async (req, res) => {
  const video = req.video;
  const user = req.user;
  try {
    const like = await Like.create({
      by: user._id,
      video: video._id,
    });
    video.likes.push(like.id);
    await video.save();
     user.likes.push(like.id);
    await user.save();
    return res.status(201).json({
      ok: true,
      data: like,
      message: "Like added successfully",
    });
  } catch (error) {
    console.log(error);
    return res.status(503).json({
      ok: false,
      message: "Unable to add likes please try again later",
    });
  }
};

const removeLike = async (req, res) => {
  const like = req.like;
  try {
    await Video.findByIdAndUpdate(like.video, { $pull: { likes: like._id } });
    await User.findByIdAndUpdate(like.by, { $pull: { likes: like._id } });
    await like.delete();
    return res.status(200).json({
      ok: true,
      message: "Like deleted successfully",
    });
  } catch (error) {
    console.log(error);
    return res.status(503).json({
      ok: false,
      message: "Unable to remove like please try again later",
    });
  }
};

const addNotes = async (req, res) => {
  const video = req.video;
  const user = req.user;
  const { note: content } = req.body;
  try {
    const note = await Note.create({
      content: content,
      by: user._id,
      video: video._id,
    });
     video.notes.push(note.id);
    await video.save();
     user.notes.push(note.id);
    await user.save();
    return res.status(200).json({
      ok: true,
      data: note,
      message: "Note added successfully",
    });
  } catch (error) {
    console.log(error);
    return res.status(503).json({
      ok: false,
      message: "Unable to add notes please try again later",
    });
  }
};

const removeNote = async (req, res) => {
  const note = req.note;
  try {
    await Video.findByIdAndUpdate(note.video, { $pull: { notes: note._id } });
    await User.findByIdAndUpdate(note.by, { $pull: { notes: note._id } });
    await note.delete();
    return res.status(200).json({
      ok: true,
      message: "Note deleted successfully",
    });
  } catch (error) {
    console.log(error);
    return res.status(503).json({
      ok: false,
      message: "Unable to remove notes please try again later",
    });
  }
};

module.exports = {
  sendAllVideos,
  sendSelectedVideo,
  addToHistory,
  getUserHistory,
  addLikes,
  removeLike,
  addNotes,
  removeNote,
};
