var express = require('express');
var router = express.Router();

const countriesAbbr = require('../data/countries/country-by-abbreviation.json')
const countrybar = require('../data/countries/country-by-barcode-prefix.json')
const countryContinent = require('../data/countries/country-by-continent.json')
const countryFlag = require('../data/countries/country-by-flag.json')
const countryLang = require('../data/countries/country-by-languages.json')
const countryPop = require('../data/countries/country-by-population.json')
const countryCurrency = require('../data/countries/country-by-currency-name.json')
const domain = require('../data/countries/country-by-domain-tld.json')


/* GET home page. */
router.get('/', function (req, res, next) {
  res.render('index', { title: 'myapi' });
});

router.get('/first', function (req, res, next) {
  res.json({
    message: "hello"
  });
});

router.get('/second', function (req, res, next) {
  res.json({
    message: "bye"
  });
});

const data = [
  {
    key: "value1"
  },
  {
    key: "value2"
  }
]


const countries = []

const countryMapping = {}


countriesAbbr.forEach(function (item) {
  // const country = {
  //   ...item
  // };

  const country = { //renaming keys
    country_name: item.country,
    country_abbr: item.abbreviation
  }

  countrybar.forEach(function (cb) {
    if (cb.country === item.country) {
      country.barcode = cb.barcode
    }
  });

  domain.forEach(function(cb){
    if (cb.country === item.country) {
      country.tld = cb.tld
    }

  });

  countryCurrency.forEach(function(cb){
    if (cb.country === item.country) {
      country.languages = cb.languages
    }
  });

  countryLang.forEach(function (cb) {
    if (cb.country === item.country) {
      country.currency = cb.currency
    }
  });

  countryContinent.forEach(function (cb) {
    if (cb.country === item.country) {
      country.continent = cb.continent
    }
  });

  countryPop.forEach(function (cb) {
    if (cb.country === item.country) {
      country.population = cb.population
    }
  });


  countries.push(country)

  //to avaoid breaking of code when multiple countries have same currency, country codes, abbr
  if(country.tld){
    if(!countryMapping[country.tld]) {
      countryMapping[country.tld] = [country];
    }
    else{ 
      countryMapping[country.tld].push(country);
    }
  } 
    
  if(country.continent){
    if( !countryMapping[country.continent]) {
      countryMapping[country.continent] = [country];
      }
      else{
        countryMapping[country.continent].push(country);
      }
  }

  if(country.currency){
    if( !countryMapping[country.currency]) {
      countryMapping[country.currency] = [country];
      }
      else{
        countryMapping[country.currency].push(country);
      }
  }
  

})



router.get('/data', function (req, res) {
  res.json({
    message: "bye",
    res: data
  });
});

router.get('/countriesAbbr', function (req, res) {
  res.json({
    message: "API currency",
    res: countriesAbbr
  });
});




router.get('/countryCurrency', function (req, res) {
  res.json({
    message: "API called",
    res: countryCurrency
  });
});

router.get('/countriesDetails', function (req, res) {
  res.json({
    message: "Countries details API called - country repetitive in all data",
    res: {
      countries,
      abbr: countriesAbbr,
      barcode: countrybar,
      currency: countryCurrency,
      flag: countryFlag,
    }
  });
});

router.get('/countries', function (req, res) {
  res.json({
    message: "Countries details API called - country non - repetitive in all data",
    res: countries

  });
});


router.get('/countries/search', function (req, res) {

  const query = req.query; //query params
  console.log(query);

  const search = countries.filter(function (item) {
    return item.country_name === query.country_name

  })


  res.json({
    message: "API called",
    res: search
  });
});


router.get('/countries/search2', function (req, res) {

  const query = req.query; //query params
  console.log(query);

  let search = []

  if(query.name === 'country_name'){
    search = countries.filter(function (item) {
      return item.country_name === (query.value)
  
    })
  }

  
  if(query.name === 'country_abbr'){
    search = countries.filter(function (item) {
      return item.country_abbr === (query.value)
  
    })
  }

  if(query.name === 'continent'){
    search = countries.filter(function (item) {
      return item.continent === (query.value)
  
    })
  }
 
  res.json({
    message: "API called",
    res: search
  });
});

router.get('/countries/:name/:value', function (req, res) {

  const params = req.params; //URL params
  console.log(params);

  let search = []

  if(params.name === 'country_name'){
    search = countries.filter(function (item) {
      return item.country_name === (params.value)
  
    })
  }

  if(params.name === 'country_abbr'){
    search = countries.filter(function (item) {
      return item.country_abbr === (params.value)
  
    })
  }

  if(params.name === 'continent'){
    search = countries.filter(function (item) {
      return item.continent === (params.value)
  
    })
  }
 
  res.json({
    message: "API called",
    res: search
  });
});

router.get('/countries/search3', function (req, res) {

  const query = req.query; //query params
  const name = query.name;

  if(typeof +query.value === 'number' && !!(+query.value)){
    query.value = +query.value;
  }

  let search = []
    search = countries.filter(function (item) {
      return item[name] === query.value
  
    });
  res.json({
    message: "Search country",
    res: search
  });
});


//o(1)
router.get('/country/lookup', function (req, res) {
  const lookupKey = req.query.lookupKey;
  console.log(lookupKey);
  const country = countryMapping[lookupKey];
  res.json({
    message: "Country Lookup",
    total : country && country.length,
    res: country && country || {}
  });
});




module.exports = router;
