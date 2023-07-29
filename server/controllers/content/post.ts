import { meowMomentsBucket } from "../../utils/bucketUtils";
import formatImage from "../../utils/formatImage";
import generateUUID from "../../utils/generateUUID";
import pool from "../../db";
import {
  postContent,
  addTag,
  addPostHashtags,
} from "../../queries/contentQueries";
import { getEntryByUsername } from "../../queries/generalQueries";
import formatHashtags from "../../utils/formatHashtags";
import { format } from "path";

const post = async (req: any, res: any) => {
  try {
    if (req.files.length > 0) {
      const fileArray: Array<Express.Multer.File> = req.files;
      const { user } = req.cookies;

      // generating a post ID for the user's post. this will be used create a folder
      // containing all image/video files the user uploaded for the post. this will
      // also be saved in the db to reference the post when needed.
      const postID = generateUUID();

      const userID = (await pool.query(getEntryByUsername, [user])).rows[0].id;
      const postDescription = req.body.description;
      const postType = req.params.postType;
      await pool.query(postContent, [
        postID,
        userID,
        postType,
        `${user}/${postType}/post-${postID}/`,
        postDescription,
      ]);

      // adding the posts hashtags to db.
      const hashtags = formatHashtags(req.body.hashtags);
      hashtags.forEach((hashtag) => {
        try {
          pool.query(addTag, [generateUUID(), hashtag]);
        } catch (err) {
          console.log(err);
        }
      });

      // uploading all files given by the uer to the bucket one at a time
      for (const file in fileArray) {
        // creating the path the file will be stored in in the bucket (with the file included)

        const filePath = `${user}/${postType}/post-${postID}/${req.files[file].originalname}.webp`;

        // formatting the image to webp and changing aspect ratio
        // for consistency, slower file sizes, and faster loading on the client
        const webpBuffer = await formatImage(fileArray[file]);

        const blob = meowMomentsBucket.file(filePath);
        const blobStream = blob.createWriteStream();
        blobStream
          .on("finish", () => {
            console.log("file uploaded successfully");
          })
          .on("error", (error) => {
            console.log(error);
          })
          .end(webpBuffer);
      }
      res.status(200).json("file uploading complete");
    } else {
      res.status(400).json("file not provided");
    }
  } catch (error) {
    res.status(500).json(error);
  }
};

export { post };