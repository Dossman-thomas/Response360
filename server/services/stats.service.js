import { OrganizationModel, UserModel } from '../database/models/index.js';
import { encryptService } from './index.js';

export const getDashboardStatsService = async () => {
  const orgCount = await OrganizationModel.count();
  const userCount = await UserModel.count();
  
  const payload = {
    orgCount,
    userCount,
  };

  const encryptedPayload = encryptService(payload);

  return encryptedPayload;
};
