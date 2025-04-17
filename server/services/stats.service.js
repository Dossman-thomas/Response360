import { OrganizationModel, UserModel } from '../database/models/index.js';

export const getDashboardStatsService = async () => {
  const orgCount = await OrganizationModel.count();
  const userCount = await UserModel.count();

  return { orgCount, userCount };
};
