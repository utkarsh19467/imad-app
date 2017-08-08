var express = require('express');
var morgan = require('morgan');
var path = require('path');

var app = express();
app.use(morgan('combined'));
var articles={
 'article-one':{
  title:'article-one |utkarsh shukla',
  heading:'article-one',
  date:'7th august,2017',
  content:` <p>
                                    Desogning the first webapp is just awesome experience i like it!! Desogning the first webapp is just awesome experience i like it!!
                                    Desogning the first webapp is just awesome experience i like it!! Desogning the first webapp is just awesome experience i like it!!
                                    Desogning the first webapp is just awesome experience i like it!! Desogning the first webapp is just awesome experience i like it!!
                                    </p `
  
},
'article-two':{
    title:'article-two |utkarsh shukla',
  heading:'article-two',
  date:'7th august,2017',
  content:` <p>
                                    Desogning the first webapp is just awesome experience i like it!! Desogning the first webapp is just awesome experience i like it!!
                                    Desogning the first webapp is just awesome experience i like it!! Desogning the first webapp is just awesome experience i like it!!
                                    Desogning the first webapp is just awesome experience i like it!! Desogning the first webapp is just awesome experience i like it!!
                                    </p `
  

},
'article-three':{
    title:'article-three |utkarsh shukla',
  heading:'article-three',
  date:'7th august,2017',
  content:` <p>
                                    Desogning the first webapp is just awesome experience i like it!! Desogning the first webapp is just awesome experience i like it!!
                                    Desogning the first webapp is just awesome experience i like it!! Desogning the first webapp is just awesome experience i like it!!
                                    Desogning the first webapp is just awesome experience i like it!! Desogning the first webapp is just awesome experience i like it!!
                                    </p `
  

}

}
function createTemplate(data){
    var title=data.title;
    var date=data.date;
    var content=data.content;
    var heading=data.heading;
var htmlTemplate=`<html>
    <head>
        <title>${title}</title>
        <link href="/ui/style.css" rel="stylesheet" />
        </head>
        <body>
          <div class="container">
                <div>
                <a href="/">Home</a>
                </div>
                    <hr/>
                    <div>
                        <h3>${heading}</h3>
                        </div>
                        <div>
                            ${date}
                            </div>
                            <div>
                               ${content}
                                </div>
                                </div>
            </body>
</html>
`;
return htmlTemplate;
}


app.get('/', function (req, res) {
  res.sendFile(path.join(__dirname, 'ui', 'index.html'));
});

var counter=0;
app.get('/counter' ,function(req,res){
    counter=counter+1;
    res.send(counter.toString());
});

app.get('/:articleName', function(req,res) {
    var articleName=req.params.articleName;
  res.send(createTemplate(articles[articleName]));
});
app.get('/ui/style.css', function (req, res) {
  res.sendFile(path.join(__dirname, 'ui', 'style.css'));
});

app.get('/ui/main.js', function (req, res) {
  res.sendFile(path.join(__dirname, 'ui', 'main.js'));
});

app.get('/ui/madi.png', function (req, res) {
  res.sendFile(path.join(__dirname, 'ui', 'madi.png'));
});

var names=[];
app.get('/submit-name/:name',function(req,res){
   
  
  var name=req.params.name;
   names.push(name);
   
   res.send(JSON.stringify(names));
});

// Do not change port, otherwise your app won't run on IMAD servers
// Use 8080 only for local development if you already have apache running on 80

var port = 80;
app.listen(port, function () {
  console.log(`IMAD course app listening on port ${port}!`);
});
