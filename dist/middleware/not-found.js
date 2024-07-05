export default function notFoundMiffleware(req, res) {
    res.status(404).json({ message: "you seem lost" });
}
