const axios = require("axios");
const api = require("../config/keys").youtube;
const { parse } = require("json2csv");
var fs = require("fs");

var data = "New File Contents";

class YoutubeService {
  constructor() {
    this.comments = [];
    this.csv = "Username, Date, Comment \n";
    this.generateFileName = "";
  }

  async getComments(videoId, nextPageToken = null) {
    let url = `${api.url}/commentThreads?part=snippet&videoId=${videoId}&key=${api.key}&maxResults=100`;
    url += nextPageToken ? `&pageToken=${nextPageToken}` : "";

    const result = await axios.get(url);
    const items = result.data.items;

    await items.map(item => {
      const commentData = {};
      const resposneData = item.snippet.topLevelComment.snippet;

      // username, date, rating, comment
      commentData.username = resposneData.authorDisplayName;
      commentData.date = new Date(resposneData.publishedAt).toDateString();
      commentData.comment = resposneData.textDisplay;

      this.csv += `${commentData.username}, ${commentData.date}, ${commentData.comment} \n`;

      this.comments.push(commentData);
    });

    const fields = ["Username", "Date", "Comment"];
    const opts = { fields };

    console.log("NEXT PAGE TOKEN: ", result.data.nextPageToken);

    if (result.data.nextPageToken !== undefined) {
      // console.log("COMMENT COUNT", this.comments.length);
      return this.getComments(videoId, result.data.nextPageToken);
    }

    try {
      this.generateFileName = "YT-comment-" + Date.now() + "-" + Math.floor(Math.random() * 1000);
      fs.writeFile(`./public/${this.generateFileName}.csv`, this.csv, err => {
        if (err) console.log(err);
        console.log("Successfully Written to File.");
      });
    } catch (err) {
      console.error(err);
    }

    return this.generateFileName;
  }
}

module.exports = YoutubeService;
