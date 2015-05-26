/**
 * This file provided by Facebook is for non-commercial testing and evaluation purposes only.
 * Facebook reserves all rights not expressly granted.
 *
 * THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
 * IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
 * FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL
 * FACEBOOK BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN
 * ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION
 * WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.
 */

var fs = require('fs');
var bodyParser = require('body-parser');


var express = require('express'),
    http = require('http'),
    path = require('path'),
    app = express();

var React = require('react');
var Router = require('react-router');
    
var wynk_api = 'http://hooq-staging-env.elasticbeanstalk.com/v0.11';
var feed_path = '/feeds/SONYLIV/programs?pageSize=15';
var detail_path = '/feeds/SONYLIV/program/';

app.set('port', (process.env.PORT || 3000));

app.use('/', express.static(path.join(__dirname, 'public')));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: true}));


app.get('/list', function(req, res){
    console.log('listing page');
    http.get(wynk_api+feed_path, function(response) {
        var body;
        console.log("Got response: " + response.statusCode);
        res.setHeader('Content-Type', 'application/json');
        res.writeHead(response.statusCode);
        response.on('data', function (data) {
            if(typeof body === 'undefined'){
                body = data;
            }
            else{
                body += data;
            }
        });
        response.on('end', function() {
            res.write(body);
            res.end();
        });

    }).on('error', function(e) {
        console.log("Got error: " + e.message);
    });
});

app.get('/details/:id', function(req, res) {
    console.log('details page');
    http.get(wynk_api+detail_path+req.params.id, function(response) {
        var body;
        console.log("Got response: " + response.statusCode);
        res.setHeader('Content-Type', 'application/json');
        res.writeHead(response.statusCode);
        response.on('data', function (data) {
            if(typeof body === 'undefined'){
                body = data;
            }
            else{
                body += data;
            }
        });
        response.on('end', function() {
            res.write(body);
            res.end();
        });

    }).on('error', function(e) {
        console.log("Got error: " + e.message);
    });
});

app.get('/itemdetails/:id', function(req, res) {
    console.log(req.params.id);
    
});


app.post('/comments.json', function(req, res) {
  fs.readFile('comments.json', function(err, data) {
    var comments = JSON.parse(data);
    comments.push(req.body);
    fs.writeFile('comments.json', JSON.stringify(comments, null, 4), function(err) {
      res.setHeader('Content-Type', 'application/json');
      res.setHeader('Cache-Control', 'no-cache');
      res.send(JSON.stringify(comments));
    });
  });
});


app.listen(app.get('port'), function() {
  console.log('Server started: http://localhost:' + app.get('port') + '/');
});