// 404 Not Found middleware
const notFound = (req, res) => {
    res.status(404).json({
        success: false,
        message: `Route ${req.originalUrl} not found`,
        method: req.method,
        path: req.path
    });
};

module.exports = { notFound };
