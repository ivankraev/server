function paginatedResults(model) {
  return async (req, res, next) => {
    const page = parseInt(req.query.page)
    const limit = parseInt(req.query.limit)
    const isSeries = req.query.isSeries;
    const startIndex = (page - 1) * limit
    const results = {}
    try {
      console.log(isSeries)
      results.totalMovies = await model.countDocuments({ isSeries: isSeries }).exec()
      results.results = await model
        .find({ isSeries: isSeries })
        .limit(limit)
        .skip(startIndex)
        .exec()
      res.paginatedResults = results
      next()
    } catch (e) {
      res.status(500).json({ message: e.message })
    }
  }
}
module.exports = paginatedResults
