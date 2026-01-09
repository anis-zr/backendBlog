
// routes/statsRoutes.js
const express = require('express')
const { getWilayasStats, getWilayaDetail } = require('../controllers/statsController')
const router = express.Router()

router.get('/wilayas', getWilayasStats)
router.get('/wilaya/:wilaya', getWilayaDetail)

module.exports = router 