var Bacon = require('baconjs')
var pg = require('pg');
//var pgUrl = "postgres://qlhornyfuuuwqb:1qGtjs7HYWKCwPIYcFzf9xm8Kv@ec2-54-243-42-236.compute-1.amazonaws.com:5432/d6hshjr0tkvfds"
var pgUrl = "postgres://localhost/koodikirja"

feedbackE = new Bacon.Bus()
connE = Bacon.fromNodeCallback(pg, "connect", pgUrl)
connE.onValue(function(client) {
  console.log("connected to PostgreSQL ", pgUrl)
})
connE.toProperty()
  .sampledBy(feedbackE, function(client, feedback) { return {client:client, feedback:feedback}})
  .flatMap(function(data) {
    var feedback = data.feedback
    var client = data.client
    return Bacon.fromNodeCallback(client, 
      "query", 
      "insert into feedback(date,email,text) values (current_timestamp, $1, $2)",
      [feedback.email, feedback.text]
    ).map(feedback.text + " from " + feedback.email)
  })
  .log("feedback")

var express = require('express');
var port = process.env.PORT || 3000;
var app = express();

var basicAuth = express.basicAuth('koodikoulu', 'rehtori')

app.get('/', basicAuth, function(request, response) {
    response.sendfile(__dirname + '/output/index.html');
})
app.post('/feedback', express.bodyParser(), function(request, response) {
  feedbackE.push(request.body)
  response.send("ok")
})
app.use(express.json())
app.use('/', express.static(__dirname + '/output'));
app.use('/', express.static(__dirname + '/static'));

app.listen(port);
