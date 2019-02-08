const path = require('path');
const express = require('express');
const hbs = require('hbs');
const app = express();
const PORT = process.env.PORT || 3001;

hbs.registerPartials(path.join(__dirname, 'views', 'partials'));
app.set('view engine', hbs);

hbs.registerHelper('getCurrentYear', function() {
  return new Date().getFullYear();
});

const staticFiles = path.join(__dirname, 'public');
// console.log(__dirname);
app.use(express.static(staticFiles));

app.get('/', (req, res) => {
  res.render('home.hbs', {
    pageTitle: 'Home Page',
    message: 'Welcome to the Homepage'
  });
});

app.get('/about', (req, res) => {
  res.render('about.hbs', {
    pageTitle: 'About Page'
  });
});

app.listen(PORT, () => {
  console.info(`App is listening on PORT: ${PORT}`);
});
