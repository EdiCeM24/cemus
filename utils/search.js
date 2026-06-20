import { Op } from "sequelize";

export const searchQuery = (Keyword, fields) => {
  if (!Keyword) return {};

  return {
    [Op.or]: fields.map((field) => ({
      [field]: {
        [Op.iLike]: `%${Keyword}%`,
      },
    })),
  };
};
