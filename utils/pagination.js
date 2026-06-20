export const paginate = async (model, page = 1, limit = 10, where = {}) => {
  const offset = (page - 1) * limit;

  const { count, rows } = await model.findAndCountAll({
    where,
    limit,
    offset,
    order: [['createdAt', 'DESC']],
  });

  return {
    data: rows,
    totalPages: Math.ceil(count / limit),
    currentPage: page,
  };
};