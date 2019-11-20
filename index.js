const express = require('express')
const bodyParser = require('body-parser')
const morgan = require('morgan')
const app = express()

const models = require('./models');

app.use(morgan('combined'))
app.use(bodyParser.json())

app.post('/push', function (req, res) {
  if (req.body.data_type == "alpr_results") {
    let data = req.body
    let results = data.results[0]

    console.log(data.uuid);
    
    console.log(results.plate);
    console.log(results.confidence);
    console.log(results.processing_time_ms);
  }
  
  res.json({ status: 'chill' })
})

models.sequelize.sync().then(function() {
  /**
   * Listen on provided port, on all network interfaces.
   */
  app.listen(3000, function() {
    console.log('Express en el chisme');
  });
});