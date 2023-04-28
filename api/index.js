const router = require('express').Router();
const fs = require('fs');
const path = require('path');

router.use("/classes", require("./classes"));
router.use("/tours", require("./tours"));
router.use("/schools", require("./schools"));

router.get("/toursByStartTime", (req, res) => {
    res.json(fs.readdirSync(path.join(__dirname, '../data/tours'))
        .map(file => JSON.parse(fs.readFileSync(path.join(__dirname, `../data/tours/${file}`))))
        .map(tour => {
            const [h, m] = tour.startTime.split(':');
            const floorM = Math.floor(parseInt(m) / 15) * 15;
            const floorMText = floorM < 10 ? `0${floorM}` : floorM;
            tour.startTime = `${h}:${floorMText}`;
            return tour;
        })
        .sort((a, b) => {
            const [ah, am] = a.startTime.split(':');
            const [bh, bm] = b.startTime.split(':');
            if (ah < bh)
                return -1;
            if (ah > bh)
                return 1;
        
            if (am < bm)
                return -1;
            if (am > bm)
                return 1;
        
            return 0;
        }
        )
        .reduce((acc, tour) => {
            if (!acc[tour.startTime]) {
                acc[tour.startTime] = 0;
            }
            acc[tour.startTime]++;
            return acc;
        }, {}));
});

module.exports = router;
