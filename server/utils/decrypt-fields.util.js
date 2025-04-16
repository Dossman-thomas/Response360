import { decryptSensitiveData } from "./index.js";

export const decryptOrgFields = (fields, pubkey) =>
    fields.map((field) => decryptSensitiveData(field, pubkey));

export const decryptUserFields = (fields, pubkey) =>
    fields.map((field) =>
      decryptSensitiveData(`users.${field}`, pubkey)
    );