const csrf = require('csurf');

exports.getCsrfToken = (req, res) => {
    const token = req.csrfToken();
    res.json({ csrfToken: token });
};