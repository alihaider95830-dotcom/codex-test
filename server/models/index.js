const sequelize = require('../config/database');
const User = require('./User');
const Note = require('./Note');
const Tag = require('./Tag');
const Share = require('./Share');
const Comment = require('./Comment');
const Notification = require('./Notification');

// Define associations
User.hasMany(Note, { foreignKey: 'userId', onDelete: 'CASCADE' });
Note.belongsTo(User, { foreignKey: 'userId' });

Note.belongsToMany(Tag, { through: 'NoteTags', timestamps: false });
Tag.belongsToMany(Note, { through: 'NoteTags', timestamps: false });

Note.hasMany(Share, { foreignKey: 'noteId', onDelete: 'CASCADE' });
Share.belongsTo(Note, { foreignKey: 'noteId' });

User.hasMany(Share, { as: 'SentShares', foreignKey: 'senderId', onDelete: 'CASCADE' });
User.hasMany(Share, { as: 'ReceivedShares', foreignKey: 'receiverId', onDelete: 'CASCADE' });
Share.belongsTo(User, { as: 'Sender', foreignKey: 'senderId' });
Share.belongsTo(User, { as: 'Receiver', foreignKey: 'receiverId' });

Note.hasMany(Comment, { foreignKey: 'noteId', onDelete: 'CASCADE' });
Comment.belongsTo(Note, { foreignKey: 'noteId' });

User.hasMany(Comment, { foreignKey: 'userId', onDelete: 'CASCADE' });
Comment.belongsTo(User, { foreignKey: 'userId' });

User.hasMany(Notification, { foreignKey: 'userId', onDelete: 'CASCADE' });
Notification.belongsTo(User, { foreignKey: 'userId' });

const syncDatabase = async () => {
  try {
    await sequelize.sync({ alter: true });
    console.log('Database synced successfully');
  } catch (error) {
    console.error('Error syncing database:', error);
  }
};

module.exports = {
  sequelize,
  User,
  Note,
  Tag,
  Share,
  Comment,
  Notification,
  syncDatabase,
};
