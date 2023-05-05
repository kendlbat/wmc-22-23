const path = require('path');
const fs = require('fs');
const crypto = require('crypto');

const router = require('express').Router();

function getDataDir() {
    return path.join(process.env.TEST_DATA_DIR ||
        path.join(__dirname, '..', 'data'), 'tours');
}

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
    return bTime - aTime;
}

router.get(`/`, (req, res) => {
    let tours = fs.readdirSync(getDataDir())
        .filter(file => file.endsWith(".json"))
        .map(file => JSON.parse(fs.readFileSync(`${getDataDir()}/${file}`)))
        .sort((a, b) => tourTimeCompare(a, b, "startTime"));

    // get _page and _limit from query params
    const { _page, _limit, maxNumPersons, minNumPersons } = req.query;

    let parsedMax;

    if (maxNumPersons !== undefined) {
        parsedMax = parseInt(maxNumPersons);
        if (isNaN(parsedMax) || parsedMax < 1) {
            res.status(400).json({ message: "Invalid maxNumPersons" });
            return;
        }
        tours = tours.filter(tour => parseInt(tour["numPersons"]) <= parsedMax);
    }

    if (minNumPersons !== undefined) {
        const min = parseInt(minNumPersons);
        if (isNaN(min) || min < 0) {
            res.status(400).json({ message: "Invalid minNumPersons" });
            return;
        }
        if (parsedMax !== undefined && min > parsedMax) {
            res.status(400).json({ message: "minNumPersons must be less than maxNumPersons" });
            return;
        }
        tours = tours.filter(tour => parseInt(tour["numPersons"]) >= min);
    }

    if (_page !== undefined && _limit !== undefined) {
        const page = parseInt(_page);
        const limit = parseInt(_limit);

        if (page < 1 || limit < 1) {
            res.status(400).json({ message: "Invalid page or limit" });
            return;
        }

        if (isNaN(page) || isNaN(limit)) {
            res.status(400).json({ message: "Invalid page or limit" });
            return;
        }

        const startIndex = (page - 1) * limit;
        const endIndex = page * limit;
        res.json(tours.slice(startIndex, endIndex));
    } else if (_limit !== undefined) {
        // const limit = parseInt(_limit);
        // if (limit < 1 || isNaN(limit)) {
        //     res.status(400).json({ message: "Invalid limit" });
        //     return;
        // }
        // res.json(tours.slice(0, limit));
        res.status(400).json({ message: "Limit without page" });
    } else if (_page !== undefined) {
        res.status(400).json({ message: "Page without limit" });
    } else {
        res.json(tours);
    }
    return;
});

router.post("/", (req, res) => {
    const tour = req.body;
    console.log(tour);
    tour._id = crypto.randomUUID();
    fs.writeFileSync(`${getDataDir()}/${tour._id}.json`, JSON.stringify(tour));
    res.status(201).json(tour);
});

router.get("/:id", (req, res) => {
    let tour;
    try {
        tour = JSON.parse(fs.readFileSync(`${getDataDir()}/${req.params.id}.json`));
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

router.delete("/:id", (req, res) => {
    if (fs.existsSync(`${getDataDir()}/${req.params.id}.json`)) {
        fs.unlinkSync(`${getDataDir()}/${req.params.id}.json`);
        res.status(204).end();
    } else {
        res.status(404).json({ message: "Tour not found" });
    }
});

module.exports = router;