async function getPagination(page = 1, limit = 10, full = false, modal) {
  try {
    // Convert page and limit to integers
    const pageNumber = parseInt(page, 10);
    const limitNumber = parseInt(limit, 10);

    // Calculate the number of documents to skip
    const skip = (pageNumber - 1) * limitNumber;

    // Retrieve the paginated results
    const response = full
      ? await modal.find().sort({ createdAt: -1 })
      : await modal
          .find()
          .skip(skip)
          .limit(limitNumber)
          .sort({ createdAt: -1 });

    // Count total documents for total pages
    const totalCount = response?.length;

    // Calculate total pages
    const totalPages = Math.ceil(totalCount / limitNumber);
    return {
      response,
      totalPages,
      currentPage: pageNumber,
      totalCount,
    };
  } catch (error) {
    throw error;
  }
}

module.exports = {
  getPagination,
};
