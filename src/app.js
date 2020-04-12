const path = require('path');

// gets express library and all its exports
const express = require('express');

const hbs = require('hbs' );

const forecast = require('./utils/forecast');
const geocode = require('./utils/geocode');

// stores the express app created by requiring it in the file
const app = express(); 

// define paths for Express config
const publicDirectoryPath = path.join(__dirname, '../public');
const viewsPath = path.join(__dirname, '../templates/views');
const partialsPath = path.join(__dirname, '../templates/partials');

// Setup for handlebars engine and views locations
app.set('view engine', 'hbs');
app.set('views', viewsPath);
hbs.registerPartials(partialsPath);

// setup static directory to serve
app.use(express.static(publicDirectoryPath));

// for hbs template root
app.get('', (req,res) => {
   res.render('index', {
      title: 'Weather',
      name: 'Julie Zimmer'
   });
});

// 'about' template in hbs
app.get('/about', (req, res) => {
   res.render('about', {
      title: 'About Me',
      name: 'Julie Zimmer'
   })
});

// 'help' template in hbs
app.get('/help', (req, res) => {
   res.render('help', {
      helpText: 'This is the help page',
      title:'Help',
      name:'Julie Zimmer'
   })
});

// call to weather page
app.get('/weather', (req, res) => {
   // this only runs if no address is provided to search
   if(!req.query.address) {
      return res.send({ // if this code runs, return stops the rest of the code from running, thus avoiding the double HTTP request error in the terminal/browser
         error: 'Please provide an address'
      })
   }
// use geocode function to get the location for the forecast, passing in req.query.address. 
// latitude, longitude, and location were destructured from the data object that is an argument in the callback function.
   geocode(req.query.address, (error, {latitude, longitude, location} = {}) => {
      // error checking
      if (error) {
         return res.send({ error: error }); // code stops running here
      }

      // geocoding didn't have any errors, so the forecast function is called. 
      forecast (latitude, longitude, (error, forecastData) => {
         if (error) {
            return res.send({ error })
         }
      
         // this runs only if everything worked as it should
         res.send({
            forecast: forecastData,
            location,
            address: req.query.address
         })

      })
      
      

   })

   // res.send({
   //    forecast:"50 degrees",
   //    location: "Minnneapolis",
   //    address: req.query.address
//   });
});

app.get('/products', (req, res) => {
   // if no search item is available, this code will run
   if(!req.query.search) {
      // sends back some JSON
      // by adding 'return' it stops the code from running a second time (down below console.log(req.query.search)), which generates an error in the terminal, if it does run. If no search term is provided, return stops the code from running.
      return res.send({
         error: 'Please provide a search term'
      })
   }
   console.log(req.query.search);  
   res.send({
      proucts: []
   })
});



// matches any page that hasn't been matched that starts with '/help/'
// help specific 404 response
app.get('/help/*', (req, res) => {
   res.render('404', {
      title:"404-help",
      name:"Julie Zimmer",
      errorMessage:"Help article not found"
   });
});

// route to pages that don't exist
// * is wildcard character and covers anything that doesn't have a route listed above.
app.get('*', (req, res) => {
   res.render("404", {
      title:"404",
      name:"Julie Zimmer",
      errorMessage:"Page not found"
   });
});

app.listen(3001, () => {
   console.log("The server is running on port 3001");
});  