module.exports = (req, res, next) => {
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Methods", "GET, POST, PATCH, PUT, DELETE, OPTIONS");
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept, X-Total-Count");
    res.header("Access-Control-Expose-Headers", "X-Total-Count");
    res.header("Cache-Control", "no-cache")
    next();
}