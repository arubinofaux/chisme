const models = require('./models');
const express = require('express')
const bodyParser = require('body-parser')
const morgan = require('morgan')
const app = express()

const Plate = models.Plate
const Seen = models.Seen

app.use(morgan('combined'))
app.use(bodyParser.json())

app.post('/push', function (req, res) {
  if (req.body.data_type == "alpr_results") {
    let data = req.body
    let results = data.results[0]

    Plate.findOne({ where: { number: results.plate } }).then(plate => {
      if (plate) {
        Seen.create({
          uuid: data.uuid,
          confidence: results.confidence,
          processing_time_ms: results.processing_time_ms,
          PlateId: plate.get('id')
        })
      } else {
        
        Plate.create({
          number: results.plate,
          seens: [
            {
              uuid: data.uuid,
              confidence: results.confidence,
              processing_time_ms: results.processing_time_ms
            }
          ]
        }, {
          include: [{model: Seen, as: 'seens'}]
        });

      }
    })
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