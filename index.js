const models = require('./models');
const express = require('express')
const bodyParser = require('body-parser')
const morgan = require('morgan')
const app = express()
const http = require('http').createServer(app)
const io = require('socket.io')(http);

const Plate = models.Plate
const Seen = models.Seen

app.use(morgan('combined'))
app.use(bodyParser.json())

app.get('/', function(req, res){
  res.sendFile(__dirname + '/index.html');
});

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
        if (results.confidence > 85) {
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

          io.emit('new plate', { 
            plate: results.plate, 
            uuid: data.uuid,
            confidence: results.confidence,
            image: "http://chismiando.local/"+data.uuid+".jpg"
          });
        }
      }
    })
  }
  
  res.json({ status: 'chill' })
})

io.on('connection', function(socket){
  console.log('a user connected');
  
  socket.on('new plate', function(msg){
    console.log(msg);
  });
});

models.sequelize.sync().then(function() {
  /**
   * Listen on provided port, on all network interfaces.
   */
  http.listen(3000, function() {
    console.log('Express en el chisme');
  });
});