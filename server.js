var express = require('express');
var morgan = require('morgan');
var path = require('path');
var bodyParser=require('body-parser');
var crypto=require('crypto');
var session=require('express-session');
var Pool=require('pg').Pool;
var config={
    user:'utkarsh1521168',
    database:'utkarsh1521168',
    host:'db.imad.hasura-app.io',
   post:'5432',
   password:process.env.DB_PASSWORD
};
var app = express();
app.use(morgan('combined'));
app.use(bodyParser.json());
app.use(session({
    secret:'someRandomSecretValue',
    cookie:{maxAge:1000*60*60*30}
}));
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

function hash(input,salt)
{
    var hashed=crypto.pbkdf2Sync(input,salt,10000,512,'sha512');
    return ["pbkdf2","10000",salt,hashed.toString('hex')].join('$');
}
app.get('/hash/:input',function(req,res)
{
   var hashedString=hash(req.params.input,'this-is-some-random-string');
   res.send(hashedString);
});

app.post('/create-user',function(req,res){
    var username=req.body.username;
    var password=req.body.password;
   var salt=crypto.randomBytes(128).toString('hex');
   var dbString=hash(password,salt);
   pool.query('INSERT INTO "download" (username,password) values($1,$2)',[username,dbString],function(err,result){
        if(err)
       {
           res.status(500).send(err.toString());
       }
       else
       {
           res.send('user successfully created:'+username);
       }
   });
});
app.post('/login',function(req,res){
     var username=req.body.username;
    var password=req.body.password;
   pool.query('SELECT * FROM "download" WHERE username=$1',[username],function(err,result){
        if(err)
       {
           res.status(500).send(err.toString());
       }
       else
       {
           if(result.rows.length===0)
           {
               res.send(403).send('username/password incorrect');
           }
           else
           {
               var dbString=result.rows[0].password;
               var salt=dbString.split('$')[2];
               var hashedPassword=hash(password,salt);
               if(hashedPassword===dbString)
               {
                   req.session.auth={userId:result.rows[0].id};
                   res.send('credentials correct!');
               }
               else
               {
                   res.send(403).send('username/password incorrect');
               }
           }
       }
   });
});
app.get('/check-login',function(req,res){
   if(req.session&&req.session.auth&&req.session.auth.userId)
   {
       res.send('You are logged in: '+req.session.auth.userId.toString());
   }
   else
   {
       res.send('You are not logged in');
   }
});
app.get('/logout',function(req,res){
   delete req.session.auth;
   res.send('logged out');
});
var pool=new Pool(config);
app.get('/test-db',function(req,res){
    pool.query('SELECT * FROM test',function(err,result){
       if(err)
       {
           res.status(500).send(err.toString());
       }
       else
       {
           res.send(JSON.stringify(result.rows));
       }
    });
});
var counter=0;
app.get('/counter' ,function(req,res){
    counter=counter+1;
    res.send(counter.toString());
});

var names=[];
app.get('/submit-name',function(req,res){
   
  
  var name=req.query.name;
   names.push(name);
   
   res.send(JSON.stringify(names));
});

app.get('/articles/:articleName', function(req,res) {
  pool.query("SELECT * FROM article-one WHERE title= '" +req.params.articleName+ "'",function(err,result)
  {
     if(err)
     {
         res.status(500).send(err.toString());
     }
     else
     {
         if(result.rows.length===0)
         {
             res.status(404).send("Article Not Found");
         }
         else
         {
             var articleData=result.rows[0];
             res.send(createTemplate(articleData));
         }
     }
  });  
  
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



// Do not change port, otherwise your app won't run on IMAD servers
// Use 8080 only for local development if you already have apache running on 80

var port = 80;
app.listen(port, function () {
  console.log(`IMAD course app listening on port ${port}!`);
});
