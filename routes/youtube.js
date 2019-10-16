const express = require("express");
const router = express.Router();
const Service = require("../services/youtubeService");
const URL = require("url");

/* POST
 * fetch youtube comment
 */
router.post("/", async function(req, res, next) {
  // Validate requeest
  console.log(req.headers);
  console.log(req.body);
  if (req.body.url === undefined || req.body.url === "") {
    return res.send({ error: "Please enter a valid youtube URL" });
  }

  try {
    const url = URL.parse(req.body.url, true);
    const videoId = url.query.v;

    // Call youtube API
    const service = new Service();
    const comments = await service.getComments(videoId);
    console.log(comments);

    return res.json({ comments: comments });
    // res.sendFile("comments.csv", { root: "./" });
  } catch (error) {
    console.log(error);
  }
});

module.exports = router;
