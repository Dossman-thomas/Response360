import { OrganizationModel, UserModel } from '../database/models/index.js';
// import { sequelize } from '../config/index.js';
import { Sequelize } from 'sequelize';

// Check for duplicate emails on CREATE
export const checkDupEmailsOnCreateOrg = async (orgEmail, adminEmail) => {
  const orgMatch = await OrganizationModel.findOne({
    where: { org_email: orgEmail },
  });

  const adminMatch = await UserModel.findOne({
    where: { user_email: adminEmail },
  });

  const errors = {
    orgEmail: orgMatch ? 'Organization email is already in use.' : null,
    adminEmail: adminMatch ? 'Admin email is already in use.' : null,
  };

  return errors;
};

// Check for duplicate org email on UPDATE
export const checkDupEmailsOnUpdateOrg = async (orgId, orgEmail) => {
  const orgMatch = await OrganizationModel.findOne({
    where: {
      org_email: orgEmail,
      org_id: { [Sequelize.Op.ne]: orgId },
    },
  });

  const errors = {
    orgEmail: orgMatch ? 'Organization email is already in use.' : null,
  };

  return errors;
};
