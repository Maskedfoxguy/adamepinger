const isAdmin = (req, res, next) => {
    if (req.payload && req.payload.status === 'admin') {
        next();
    } else {
        res.status(403).json ({message: 'Admin only'});
    };
}; 

module.export = {
    isAdmin,
};