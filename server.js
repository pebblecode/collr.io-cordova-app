const express = require('express'),
    path = require('path'),
    PORT = process.env.PORT || 8000;

let app = express();

app.use( '/css', express.static(path.join(__dirname, 'build','www','css')) );
app.use( '/images', express.static(path.join(__dirname, 'build','www','images')) );
app.use( '/fonts', express.static(path.join(__dirname, 'build','www','fonts')) );
app.use( '/js', express.static(path.join(__dirname, 'build','www','js')) );

app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'build', 'www', 'index.html'));
});

app.use((req, res) => {
    res.status(404).send('Page not found');
});

export default {
    start: function() {
        app.listen(PORT);
        return PORT;
    }
};
