const router = require('express').Router()
const Movie = require('../models/Movie')
const verifyToken = require('../verifyToken')
const Poster = require('../models/Poster')
const paginatedResults = require('../PaginetedResults')
const uniqid = require('uniqid')


//Get Paginated Movies
router.get('/allmovies', paginatedResults(Movie), (req, res) => {
  res.json(res.paginatedResults)
})

module.exports = router
//Get Random Movie
router.get('/random', async (req, res) => {
  try {
    const movie = await Movie.aggregate([
      { $match: {} },
      { $sample: { size: 1 } },
    ])
    res.status(200).json(movie)
  } catch (err) {
    res.status(500).json(err)
  }
})

//get random poster
router.get('/randomposter', async (req, res) => {
  try {
    const movie = await Poster.aggregate([
      { $match: {} },
      { $sample: { size: 1 } },
    ])
    res.status(200).json(movie)
  } catch (err) {
    res.status(500).json(err)
  }
})
//GET ONE MOVIE

router.get('/:id', async (req, res) => {
  const id = req.params.id

  try {
    const movie = await Movie.findById(id)
    res.status(200).json(movie)
  } catch (err) {
    res.status(500).json(err)
  }
})

//Create
router.post('/', async (req, res) => {
  const newMovie = new Movie(req.body)
  try {
    const savedMovie = await newMovie.save()
    res.status(200).json(savedMovie)
  } catch (err) {
    res.status(500).json(err)
  }
})
//Edit
router.put('/:id/edit', verifyToken, async (req, res) => {
  try {
    const updateMovie = await Movie.findByIdAndUpdate(
      req.params.id,
      { $set: req.body },
      { new: true },
    )
    res.status(200).json(updateMovie)
  } catch (err) {
    res.status(500).json(err)
  }
})
//DElete
router.delete('/:id/delete', verifyToken, async (req, res) => {
  try {
    await Movie.findByIdAndDelete(req.params.id)
    res.status(200).json('The movie has been deleted.')
  } catch (err) {
    res.status(500).json(res)
  }
})

//Get My movies
router.get('/:id/ownmovies', verifyToken, async (req, res) => {
  try {
    const movie = await Movie.find({ ownerId: req.params.id })
    res.status(200).json(movie)
  } catch (err) {
    res.status(500).json(err)
  }
})

//Get One
router.get('/:id', verifyToken, async (req, res) => {
  try {
    const movie = await Movie.findById(req.params.id)
    res.status(200).json(movie)
  } catch (err) {
    res.status(500).json(err)
  }
})
//GET LAST MOVIES
router.get('/all/movies/latest', async (req, res) => {
  try {
    const movies = await Movie.find().sort({ createdAt: -1 }).limit(8)
    res.status(200).json(movies)
  } catch (err) {
    res.status(500).json(err)
  }
})
//GET ALL MOVIES
router.get('/all/movies/movies', async (req, res) => {
  try {
    const movies = await Movie.find({ isSeries: 'Movie' })
      .sort({ createdAt: -1 })
      .limit(8)
    res.status(200).json(movies)
  } catch (err) {
    res.status(500).json(err)
  }
})
//get movies not sliced
router.get('/all/movies/pure', async (req, res) => {
  try {
    const movies = await Movie.find({ isSeries: 'Movie' })
      .sort({ createdAt: -1 })
    res.status(200).json(movies)
  } catch (err) {
    res.status(500).json(err)
  }
})


//GET ALL SERIES
router.get('/all/movies/series', async (req, res) => {
  try {
    const movies = await Movie.find({ isSeries: 'Series' })
      .sort({ createdAt: -1 })
      .limit(8)
    res.status(200).json(movies)
  } catch (err) {
    res.status(500).json(err)
  }
})

//SEARCH FOR A MOVIE

router.post('/search', async (req, res) => {
  const search = req.body.search
  var regexstring = search
  var regexp = new RegExp(regexstring, 'gi')
  try {
    const movies = await Movie.find({ title: regexp })
    res.status(200).json(movies)
  } catch (err) {
    res.status(500).json(err)
  }
})

//Add new comment

router.post('/addcomment', async (req, res) => {
  const comment = req.body.comment
  const id = req.body.id
  const author = req.body.author
  const ownerId = req.body.userId
  const commentId = uniqid()
  const date = new Date();
  try {
    const updatedMovie = await Movie.findByIdAndUpdate(
      id,
      {
        $push: {
          comments: {
            comment: comment,
            author: author,
            id: commentId,
            ownerId: ownerId,
            likes: [],
            timestamp: date
          },
        },
      },
      { new: true },
    )
    res.status(200).json(updatedMovie)
  } catch (err) {
    res.status(500).json(err)
  }
})

//DELETE COMMENT
router.delete('/:movieId/removecomment/:commentId', async (req, res) => {
  const commentId = req.params.commentId
  const movieId = req.params.movieId
  try {
    const updatedMovie = await Movie.findByIdAndUpdate(
      movieId,
      {
        $pull: {
          comments: {
            id: commentId,
          },
        },
      },
      { new: true },
    )
    res.status(200).json(updatedMovie)
  } catch (err) {
    res.status(500).json(err)
  }
})

//LIKE MOVIE
router.post('/:id/like/:username', async (req, res) => {
  const username = req.params.username
  const id = req.params.id
  try {
    const updatedMovie = await Movie.findByIdAndUpdate(
      id,
      {
        $addToSet: {
          likes: username,
        },
      },
      { new: true },
    )
    res.status(200).json(updatedMovie)
  } catch (err) {
    res.status(500).json(err)
  }
})

//DISLIKE MOVIE
router.post('/:id/dislike/:username', async (req, res) => {
  const username = req.params.username
  const id = req.params.id
  try {
    const updatedMovie = await Movie.findByIdAndUpdate(
      id,
      {
        $pull: {
          likes: username,
        },
      },
      { new: true },
    )
    res.status(200).json(updatedMovie)
  } catch (err) {
    res.status(500).json(err)
  }
})



//LIKE COMMENT
router.post('/:id/like/:username/:commentId', async (req, res) => {
  const username = req.params.username
  const id = req.params.id
  const commentId = req.params.commentId
  try {
    await Movie.findByIdAndUpdate(
      id,
      { $addToSet: { 'comments.$[id].likes': username } },
      { "arrayFilters": [{ "id.id": commentId }] },

    )
    const newMovie = await Movie.findById(id)
    res.status(200).json(newMovie)
  } catch (err) {
    console.log(err)
    res.status(500).json(err)
  }
})

//UNLIKE COMMENT
router.post('/:id/unlike/:username/:commentId', async (req, res) => {
  const username = req.params.username
  const id = req.params.id
  const commentId = req.params.commentId
  console.log(username, id, commentId)
  try {
    await Movie.findByIdAndUpdate(
      id,
      { $pull: { 'comments.$[id].likes': username } },
      { "arrayFilters": [{ "id.id": commentId }] },

    )
    const newMovie = await Movie.findById(id)
    res.status(200).json(newMovie)
  } catch (err) {
    console.log(err)
    res.status(500).json(err)
  }
})

router.get('/trends', async (req, res) => {
  try {
    const sortedMovies = await Movie.find().sort({ likes: 1 })
    res.status(200).json(sortedMovies)
  } catch (err) {
    console.log(err)
    res.status(500).json(err)
  }
})
