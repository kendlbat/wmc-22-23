const router = require('express').Router();

const classConstraints = {
    "HIF": {
        lower: 2,
        upper: 5,
        chars: ["A", "B"]
    },
    "FIT": {
        lower: 2,
        upper: 4,
        chars: ["A"]
    }
}

const classes = Object.keys(classConstraints)
    .map(dept => classConstraints[dept].chars.map(char => {
        let classes = [];
        for (let i = classConstraints[dept].lower; i <= classConstraints[dept].upper; i++) {
            classes.push(`${i}${char}${dept}`);
        }
        return classes;
    }))
    .flat(2)
    .sort((a, b) => a.localeCompare(b));

router.get(`/`, (req, res) => {
    res.status(200).json(classes);
});

module.exports = router;