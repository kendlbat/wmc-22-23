const fs = require('fs');
const path = require('path');

const router = require('express').Router();

const VALID_TYPES = ["AHS", "BHS", "Mittelschule", "Andere"].map(t => t.toLowerCase());

/**
 * 
 * @param {{id: number, title: string, address: {"zip-code": number, city: string, street: string}, type: string}} school 
 * @returns {boolean}
 */
function validateSchool(school) {
    if (school.id === undefined || !school.title || !school.type)
        return false;
    
    if (!/[0-9]{6}/g.test(school.id))
        return false;

    if (!school.title.length >= 3)
        return false;


    if (!VALID_TYPES.includes(school.type.toLowerCase()))
        return false;

    if (school.address !== undefined) {
        if (!school.address["zip-code"] || !school.address.city)
            return false;
    }

    return true;
}

router.put("/:id", (req, res) => {
    const { id } = req.params;

    if (!/[0-9]{6}/g.test(id))
        return res.status(400).json({ error: "Invalid ID" });

    const school = req.body;

    if (!validateSchool(school))
        return res.status(400).json({ error: "Invalid school" });

    if (parseInt(school.id) !== parseInt(id))
        return res.status(400).json({ error: "ID mismatch" });

    fs.writeFileSync(path.join(__dirname, `../data/schools/${id}.json`), JSON.stringify(school));

    res.status(200).json(school);
});

router.get("/", (req, res) => {
    let schools = fs.readdirSync(path.join(__dirname, '../data/schools'));

    schools = schools.map(school => JSON.parse(fs.readFileSync(path.join(__dirname, `../data/schools/${school}`))));

    res.status(200).json(schools);
});

router.get("/:id", (req, res) => {
    const { id } = req.params;

    if (!/[0-9]{6}/g.test(id)) {
        res.status(400).json({ error: "Invalid ID" });
        return;
    }

    if (!fs.existsSync(path.join(__dirname, `../data/schools/${id}.json`))) {
        res.status(404).json({ error: "School not found" });
        return;
    }

    res.status(200).json(JSON.parse(fs.readFileSync(path.join(__dirname, `../data/schools/${id}.json`))));
});

router.delete("/:id", (req, res) => {
    const { id } = req.params;

    if (!/[0-9]{6}/g.test(id)) {
        res.status(400).json({ error: "Invalid ID" });
        return;
    }

    if (!fs.existsSync(path.join(__dirname, `../data/schools/${id}.json`))) {
        res.status(404).json({ error: "School not found" });
        return;
    }

    fs.unlinkSync(path.join(__dirname, `../data/schools/${id}.json`));

    res.status(204).send();
});


module.exports = router;