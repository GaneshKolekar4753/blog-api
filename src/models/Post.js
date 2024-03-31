module.exports = (sequelize, DataTypes) => {
  const Post = sequelize.define("Post", {
    uuid: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      allowNull:false
    },
    title: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    content: {
      type: DataTypes.TEXT,
      allowNull: false,
    },
    createdAt: {
      type: DataTypes.DATE,
      defaultValue: DataTypes.NOW,
      allowNull: false,
    },
    updatedAt: {
      type: DataTypes.DATE,
      defaultValue: DataTypes.NOW,
      allowNull: false,
    },
  });
  Post.associate=(models)=>{
    Post.belongsTo(models.User, { as:'users',foreignKey: 'userId' });
    Post.belongsToMany(models.Tag, { through: 'PostTags' });
  };

  return Post;
};
