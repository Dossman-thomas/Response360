import { DataTypes } from "sequelize";
import { sequelize } from "../../config/index.js";

export const OrganizationModel = sequelize.define(
  "organizations",
  {
    org_id: {
      type: DataTypes.UUID,
      primaryKey: true,
      allowNull: false,
      defaultValue: DataTypes.UUIDV4,
    },
    org_name: {
      type: DataTypes.TEXT, // Encrypted
      allowNull: false,
    },
    org_email: {
      type: DataTypes.TEXT, // Encrypted
    },
    org_phone_number: {
      type: DataTypes.TEXT, // Encrypted
    },
    org_status: {
      type: DataTypes.BOOLEAN,
      defaultValue: true,
    },
    org_created_by: {
      type: DataTypes.UUID,
    },
    org_updated_by: {
      type: DataTypes.UUID,
    },
    org_deleted_by: {
      type: DataTypes.UUID,
    },
    org_type: {
      type: DataTypes.TEXT,
    },
    jurisdiction: {
      type: DataTypes.TEXT,
      validate: {
        isIn: [['Global', 'National', 'State', 'District']], // ENUM constraint
      },
    },
    org_address: {
      type: DataTypes.TEXT, // Encrypted
    },
    website: {
      type: DataTypes.TEXT, 
    },
    logo: {
      type: DataTypes.STRING(5000), // URL stored as string
    },
  },
  {
    freezeTableName: true,
    timestamps: true,
    createdAt: "org_created_at",
    updatedAt: "org_updated_at",
    deletedAt: "org_deleted_at",
    paranoid: true, // Soft deletes
  }
);
