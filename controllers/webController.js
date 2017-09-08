const renderHome = (req, res) => {
    return res.render('home', {
        title: 'timeline'
    });
}

module.exports = {
    renderHome
}