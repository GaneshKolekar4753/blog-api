const jwt = require("jsonwebtoken");
const { Op } = require("sequelize");
const db = require("../models/index");
// const { query } = require("express");

class PostController {
  //function to create new post
  async createPost(req, res) {
    const user = req.user;
    const { title, content, tagsArray } = req.body;
    try {
      //create post
      const post = await db.Post.create({
        title,
        content,
        userId: user.id,
      });
      // Create tags if they don't exist
      const tags = [];
      for (const tagName of tagsArray) {
        let tag = await db.Tag.findOne({ where: { name: tagName } });
        if (!tag) {
          tag = await db.Tag.create({ name: tagName });
        }
        tags.push(tag);
      }
      // Associate post with tags
      await post.addTag(tags);
      return res
        .status(200)
        .json({ status: "ok", message: "Created Blog Post", data: post });
    } catch (error) {
      return res.status(500).json({ status: "server error", message: error });
    }
  }

  //function to get all posts with tags matching the provided tag names
  async getPostbyTag(req, res) {
    try {
      const { tags } = req.query;
      const tagNames = tags.split(",");
      const currentUser = req.user;
      //check role ad create query according to role
      let query;
      if (currentUser.role === "user") {
        query = { userId: currentUser.id };
      } else {
        query = {};
      }
      // Find posts with tags matching the provided tag names

      const posts = await db.Post.findAll({
        where: query,
        include: [
          {
            model: db.Tag,
            // as:'tags',
            attributes: ["id", "name"],
            through: {
              attributes: [],
            },
            where: { name: { [Op.in]: tagNames } },
          },
        ],
      });

      if (!posts) {
        res
          .status(200)
          .json({ message: "Posts are not present.please create some post" });
      }
      res.status(200).json(posts);
    } catch (error) {
      res.status(500).json({ errorMsg: "Internal server error", error });
    }
  }

  //get all posts
  async getAllPosts(req, res) {
    try {
      const currentUser = req.user;
      //check role ad create query according to role
      let query;
      if (currentUser.role === "user") {
        query = { userId: currentUser.id };
      } else {
        query = {};
      }
      const result = await db.Post.findAll({
        where: query,
        include: {
          model: db.Tag,
          attributes: ["id", "name"],
          through: {
            attributes: [],
          },
        },
      });
      if (!result) {
        return res.status(200).send({ message: "no posts are present" });
      }
      return res.status(200).send({ data: result });
    } catch (error) {
      return res.status(500).json({ error: "Internal server error" });
    }
  }

  //search post by tags, dates range, author
  async getPostbyVlaue(req, res) {
    try {
      const { tags, startDate, endDate, authorId } = req.query;

      // Convert comma-separated tag names to an array
      const tagNames = tags ? tags.split(",") : [];

      // Build filter conditions
      const filter = {};
      if (tagNames.length > 0) {
        filter.include = [
          {
            model: db.Tag,
            where: { name: { [Op.in]: tagNames } },
          },
        ];
      }
      if (startDate && endDate) {
        // Merge date range condition with existing conditions
        filter.where = {
          ...filter.where,
          createdAt: { [Op.between]: [new Date(startDate),new Date(endDate)] },
        };
      }
      if (authorId) {
        // Merge author ID condition with existing conditions
        filter.where = { ...filter.where, userId: authorId };
      }

      // Find posts based on filters
      const { count, rows:posts } = await db.Post.findAndCountAll({
        ...filter,
      });

    //   const out=await db.Post.findAll({
    //     where:{createdAt:{[Op.between]: [new Date(startDate), new Date(endDate)]}}
    //   })

      res.status(200).json( {count,posts} );
    } catch (error) {
      res.status(500).json({ error: "Internal server error", error });
    }
  }

  //update post
  async updatePost(req, res) {
    try {
      const { postId } = req.params;
      const { title, content } = req.body;
      const currentUser = req.user;
      // Find the post by id
      const post = await db.Post.findByPk(postId);

      // If post not found, return 404 Not Found
      if (!post) {
        return res.status(404).json({ error: "Post not found" });
      }
      //authorization
      if (currentUser.role === "user") {
        if (post.userId !== currentUser.id) {
          return res.status(403).json({
            meaasge: "access denied.only admin and author has access",
          });
        }
      }

      // Update the post
      await post.update({ title, content });

      res.status(200).json(post);
    } catch (error) {
      res.status(500).json({ error: "Internal server error" });
    }
  }

  //remove post
  async removePost(req, res) {
    try {
      const { id } = req.params;
      const currentUser = req.user;
      // Find the post by ID
      const post = await db.Post.findByPk(id);

      // If post not found, return 404 Not Found
      if (!post) {
        return res.status(404).json({ error: "Post not found" });
      }
      //find tags related to post
      const tags = await db.Tag.findAll({
        include: [
          {
            model: db.Post,
            // as:'tags',
            attributes: [],
            where: { id: post.id },
          },
        ],
      });

      //authorization
      if (currentUser.role === "user") {
        if (post.userId !== currentUser.id) {
          return res.status(403).json({
            meaasge: "access denied.only admin and author has access",
          });
        }
      }

      //   //delete tags if not in use
      //   for (const tag of tags) {
      //     const p = await db.Post.findAll({
      //       include: [
      //         {
      //           model: db.Tag,
      //           // as:'tags',
      //           attributes: [],
      //           where: { id: tag.id },
      //         },
      //       ],
      //     });
      //     console.log(">>>>",p)
      //     if (!p) {
      //       //delet post from Tag table
      //       const count = await db.Tag.destroy({ where: { id: tag.id } });
      //     }
      //   }

      // Remove associations between post and tags
      await post.removeTag(post.Tag);
      // Delete the post
      await post.destroy();
      res.status(200).json({ message: "deleted successfully" });
    } catch (error) {
      res.status(500).json({ error: "Internal server error", error });
    }
  }
}
module.exports = PostController;
