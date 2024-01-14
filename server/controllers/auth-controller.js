// *-------------------
// Home Logic
// *-------------------
const home = async (req, res) => {
    try {
        res.status(200).json({ msg: "Welcome to our home page" });
    } catch (error) {
        console.log(error);
    }
};

// *-------------------
// Registration Logic
// *-------------------
const register = async (req, res) => {
    try {
        const d = req.body;
        console.log(req.body)
        res.status(200).json({ message: d });
        // res.status(201).send({ message: "fdgohko" });

    } catch (error) {
        res.status(500).json({ message: "Internal server error" });
    }
};

module.exports = { home, register };