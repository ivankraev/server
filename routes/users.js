const router = require('express').Router()
const User = require('../models/User')
const CryptoJS = require('crypto-js')
const verifyToken = require('../verifyToken')
const nodemailer = require('nodemailer')
/* const multer = require('multer')
const MIME_TYPE_MAP = {
  'image/png': 'png',
  'image/jpeg': 'jpg',
  'image/jpg': 'jpg',
}
let picture
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    const isValid = MIME_TYPE_MAP[file.mimetype]
    let error = new Error('Invalid mime type')
    if (isValid) {
      error = null
    }
    cb(error, '../client/public/img')
  },
  filename: (req, file, cb) => {
    const name = file.originalname.toLowerCase().split(' ').join('-')

    const ext = MIME_TYPE_MAP[file.mimetype]
    cb(null, name + '-' + Date.now() + '.' + ext)
    picture = name + '-' + Date.now() + '.' + ext
  },
})

const upload = multer({ storage: storage })

//UPLOAD IMAGE
router.post('/upload', upload.single('image'), (req, res, next) => {
  res.send(picture)
}) */

//Update User
router.put('/:id', verifyToken, async (req, res) => {
  if (req.user.id === req.params.id || req.user.isAdmin) {
    if (req.body.password) {
      req.body.password = CryptoJS.AES.encrypt(
        req.body.password,
        process.env.SECRET_KEY,
      ).toString()
    }
    try {
      const updatedUser = await User.findByIdAndUpdate(
        req.params.id,
        { $set: { name: req.body.name } },
        { new: true },
      )
      res.status(200).json(updatedUser)
    } catch (err) {
      res.status(500).json(err)
    }
  } else {
    res.status(400).json('You can update only your account!')
  }
})
//Delete User
router.delete('/:id', verifyToken, async (req, res) => {
  if (req.user.id === req.params.id || req.user.isAdmin) {
    try {
      const updatedUser = await User.findByIdAndDelete(req.params.id)
      res.status(200).json('User has been deleted')
    } catch (err) {
      res.status(500).json(err)
    }
  } else {
    res.status(400).json('You can delete only your account!')
  }
})

//Get user
router.get('/find/:id', async (req, res) => {
  try {
    const user = await User.findById(req.params.id)
    const { password, ...info } = user._doc
    res.status(200).json(info)
  } catch (err) {
    res.status(500).json(err)
  }
})

router.post('/updatePic/:id', async (req, res) => {
  console.log(req.body.profilePic)
  const profilePic = req.body.profilePic;
  const accessToken = req.body.accessToken;
  try {
    const user = await User.findByIdAndUpdate(req.params.id, { profilePic: profilePic },
      { new: true }

    )
    res.status(200).json({ ...user._doc, accessToken })
  } catch (err) {
    res.status(500).json(err)
  }
})



//SEND EMAIL
router.post('/sendemail', async (req, res) => {
  const message = req.body.message
  const email = req.body.email
  const transport = nodemailer.createTransport({
    host: process.env.MAIL_HOST,
    port: process.env.MAIL_PORT,
    auth: {
      user: process.env.MAIL_USER,
      pass: process.env.MAIL_PASS,
    },
  })
  try {
    const sendinformation = await transport.sendMail({
      from: process.env.MAIL_FROM,
      to: 'operator3230@abv.bg',
      html: `
            <div className="email" 
            style="border: 1px solid black;
            padding:20px;
            font-family:sans-serif;
            line-height:2;
            font-size:20px">
            <h2>Here is your email!</h2>
            <p>${message} from ${email}</p>
            </div>
            `,
    })
    res.status(200).json(sendinformation)
  } catch (err) {
    res.status(500).json(err)
  }
})

//Get all users
router.get('/', async (req, res) => {
  const query = req.query.new
  try {
    const users = query
      ? await User.find()
      : await User.find().sort({ _id: -1 }).limit(10)
    res.status(200).json(users)
  } catch (err) {
    res.status(500).json('Cannot fetch users!')
  }
})

//Get user stats
router.get('/stats', async (req, res) => {
  const today = new Date()
  // A year before
  const lastYear = today.setFullYear(today.setFullYear() - 1)
  const monthsArray = [
    'January',
    'February',
    'March',
    'April',
    'May',
    'June',
    'July',
    'August',
    'September',
    'October',
    'November',
    'December',
  ]
  try {
    const data = await User.aggregate([
      {
        $project: {
          month: { $month: '$createdAt' },
        },
      },
      {
        $group: {
          _id: '$month',
          total: { $sum: 1 },
        },
      },
    ])
    res.status(200).json(data)
  } catch (err) {
    res.status(500).json(err)
  }
})

module.exports = router
