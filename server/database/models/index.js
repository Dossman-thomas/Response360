import UserModel from './user.model.js';
import OrganizationModel from './organization.model.js';

// Define relationships
OrganizationModel.hasMany(UserModel, {
  foreignKey: 'org_id',
  as: 'users',
  onDelete: 'CASCADE',
});

UserModel.belongsTo(OrganizationModel, {
  foreignKey: 'org_id'
});

export { UserModel, OrganizationModel };
