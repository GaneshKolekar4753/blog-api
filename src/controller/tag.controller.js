const { Op } = require("sequelize");

const db = require("../models/index");

class Tagcontroller {
  async addTag(req, res) {
    try {
      const { postId, tagName } = req.params;
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
      // Create tag if not exists
      let tag = await db.Tag.findOne({ where: { name: tagName } });
      if (!tag) {
        tag = await db.Tag.create({ name: tagName });
      }

      // Associate tag with post
      await post.addTag(tag);
      res.status(201).json(tag);
    } catch (error) {
      res.status(500).json({ error: "Internal server error", error });
    }
  }

  async updateTag(req, res) {
    try {
      const { postId, tagId } = req.params;
      const { newTagName } = req.body;
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
      // Find the tag by id
      const tag = await db.Tag.findByPk(tagId);

      // If tag not found, return 404 Not Found
      if (!tag) {
        return res.status(404).json({ error: "Tag not found" });
      }
      //if newtagName is already present then replace id to newId
      let isnewTag = await db.Tag.findOne({ where: { name: newTagName } });
      if (isnewTag) {
        return res.status(404).json({
          message: "tagname is already exist please use some unique value",
        });
      }

      // Update tag name
      await tag.update({ name: newTagName });
      res.status(200).json(tag);
    } catch (error) {
      res.status(500).json({ error: "Internal server error" });
    }
  }

  async deleteTag(req, res) {
    try {
      const { postId, tagId } = req.params;
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

      // Find the tag by id
      const tag = await db.Tag.findByPk(tagId);

      // If tag not found, return 404 Not Found
      if (!tag) {
        return res.status(404).json({ error: "Tag not found" });
      }

      // Remove tag association from post
      await post.removeTag(tag);

      res.status(200).json({ message: "tag deleted successfully" });
    } catch (error) {
      res.status(500).json({ error: "Internal server error" });
    }
  }

  async getTags(req, res) {
    try {
      const { postId } = req.params;
      const currentUser=req.user;
      // Find the post by ID with its associated tags
      const post = await db.Post.findByPk(postId, {
        include: [
          {
            model: db.Tag,
            attributes: ["id", "name"],
            through: {
              attributes: [],
            },
          },
        ],
      });

      // If post not found, return 404 Not Found
      if (!post) {
        return res.status(404).json({ error: "Post not found" });
      }
      //authorization
      if (currentUser.role === "user") {
        if (post.userId !== currentUser.id) {
          return res
            .status(403)
            .json({
              meaasge: "access denied.only admin and author has access",
            });
        }
      }

      // Extract tags from the post object
      const tags = post.Tags;

      res.status(200).json(tags);
    } catch (error) {
      res.status(500).json({ error: "Internal server error" });
    }
  }
}

module.exports = Tagcontroller;
