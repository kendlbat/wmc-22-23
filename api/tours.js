const path = require('path');
const fs = require('fs');
const crypto = require('crypto');

const router = require('express').Router();

function tourTimeCompare(a, b, attrib = "time") {
    const [ah, am] = a[attrib].split(':');
    const [bh, bm] = b[attrib].split(':');
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

function getTourTimeDifference(a, b) {
    const [ah, am] = a.split(':');
    const [bh, bm] = b.split(':');
    const aTime = parseInt(ah) * 60 + parseInt(am);
    const bTime = parseInt(bh) * 60 + parseInt(bm);
    return aTime - bTime;
}

router.get(`/`, (req, res) => {
    const tours = fs.readdirSync(path.join(__dirname, '../data/tours'))
        .map(file => JSON.parse(fs.readFileSync(path.join(__dirname, `../data/tours/${file}`))))
        .sort((a, b) => tourTimeCompare(a, b, "startTime"));

    // get _page and _limit from query params
    const { _page, _limit } = req.query;
    if (_page && _limit) {
        const page = parseInt(_page);
        const limit = parseInt(_limit);
        const startIndex = (page - 1) * limit;
        const endIndex = page * limit;
        res.json(tours.slice(startIndex, endIndex));
    } else if (_limit) {
        const limit = parseInt(_limit);
        res.json(tours.slice(0, limit));
    } else {
        res.json(tours);
    }
});

router.post("/", (req, res) => {
    const tour = req.body;
    console.log(tour);
    tour._id = crypto.randomUUID();
    fs.writeFileSync(path.join(__dirname, `../data/tours/${tour._id}.json`), JSON.stringify(tour));
    res.status(201).json(tour);
});

router.get("/:id", (req, res) => {
    let tour;
    try {
        tour = JSON.parse(fs.readFileSync(path.join(__dirname, `../data/tours/${req.params.id}.json`)));
    } catch (e) {
        res.status(404).json({ message: "Tour not found" });
        return;
    }
    if (tour) {
        tour["durationInMin"] = getTourTimeDifference(tour["startTime"], tour["endTime"]);
        res.json(tour);
    } else {
        res.status(404).json({ message: "Tour not found" });
    }
});

module.exports = router;