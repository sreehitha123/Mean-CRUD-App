var express = require('express'),
    app = express(),
    cors = require('cors');
var bodyParser = require('body-parser'),
    jwt = require('jsonwebtoken');
var mongoose = require('mongoose');
mongoose.connect('mongodb://localhost/testpost');
var db = "mongodb://localhost/testpost";
var postSchema = require("./models/postschema");
var userSchema  = require("./models/userschema");

app.use(cors({
    origin: 'http://localhost:4200',
    optionsSuccessStatus: 200
}));
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
mongoose.connect(db, function (err) {
    if (err) {
        return err;
    }
    else {
        console.log('connected to' + db);
    }
});
app.use(express.static(__dirname + '/client/dist'));
app.post('/authenticate', function (req, res) {

    console.log('data in auth: ', req.body);
    if (!req.body.email) {
        console.log("no email");
        res.send({
            isLoggedIn: false,
            message: 'enter email'
        });
    }
    else {
        if (!req.body.password) {
            console.log("no password");
            res.send({
                isLoggedIn: false,
                message: 'enter password'
            });
        }
        else {
            console.log("Else condition ");
            userSchema.findOne({
                'email': req.body.email,
                'password': req.body.password,
              
            }).then((doc) => {
                console.log(doc);
                if (doc.length == 0) {

                    res.send({
                        isLoggedIn: false,
                        email: null
                    });
                }
                else {

                    if (doc.password == req.body.password) {
                        var token = jwt.sign({ email: req.body.email }, 'marlabs-secret-key', { expiresIn: '2h' });
                        res.send({
                            isLoggedIn: true,
                            msg: 'Login success',
                            token: token,
                           email:doc.email
                            
                        });
                    } else {
                        res.send({
                            isLoggedIn: false,
                            msg: 'Login failed'
                        });
                    }

                }
            });
        }
    }
})

app.post('/register', (req, res) => {
    console.log(req.body);
    var user = new userSchema(req.body);

    user.save((err) => {

        if (err) {
            console.log("sree");
            res.send({
                success: false,
                message: 'Could not save user. Error: ', err
            });
        }

        else {
            res.send({
                success: true,
                message: 'Acount registered!'
            });
        }

    });
})




app.use(function (req, res, next) {
    console.log(req.headers.token);
    var token = req.body.token || req.query.token || req.headers.token;

    if (token) {
        jwt.verify(token, 'marlabs-secret-key', function (err, decoded) {
            if (!err) {
                req.decoded = decoded;
                console.log(decoded);
                next();
            }
            else {
                res.send({
                    msg: 'invalid request',
                    isLoggedIn: false
                });
            }
        });
    }
    else {
        res.send({
            msg: 'invalid request',
            isLoggedIn: false
        });
    }
});


  app.post('/post', (req, res) => {

    if (!req.body.title) {
        res.send({ success: false, message: 'title is required.' }); 
    } else {

        if (!req.body.description) {
            res.send({ success: false, message: ' desc is required.' }); 
        } else {
            
            const post = new postSchema({
                title: req.body.title, 
                description: req.body.description, 
                createdBy:req.body.createdBy
                
            });
          
            post.save((err) => {
                
                if (err) {
                  
                    if (err.errors) {
                       
                        if (err.errors.title) {
                            res.send({ success: false, message: err.errors.title.message });
                        } else {
                            
                            if (err.errors.description) {
                                res.send({ success: false, message: err.errors.description.message }); 
                            } else {
                                res.send({ success: false, message: err }); 
                            }
                        }
                    } else {
                        res.send({ success: false, message: err }); 
                    }
                } else {
                    res.send({ success: true, message: 'Post saved!' }); 
                }
            });
        }
    }

});

app.get('/allposts', (req, res) => {
    
    postSchema.find({}, (err, posts) => {
        
        if (err) {
            res.json({ success: false, message: err }); 
        } else {
            
            if (!posts) {
                res.json({ success: false, message: 'No posts found.' }); 
            } else {
                res.json(posts); 
            }
        }
    }).sort({ '_id': -1 }); 
});


app.get('/homename', (req,res)=>{
userSchema.findOne({email: req.decoded.email}).select('email').exec((err, email)=>{
    if (err) {
        res.json({ success: false, message: err }); 
      } else {
        
        if (!email) {
          res.json({ success: false, message: 'User not found' }); 
        } else {
          res.json({ email: email.email }); 
          
        }
      }
})
});

app.get('/singlePost/:id', (req, res) => {
  console.log('find post id', req.params.id);
    if (!req.params.id) {
      res.json({ success: false, message: 'No post ID was provided.' }); 
    } else {
      
      postSchema.findOne({ _id: req.params.id }, (err, post) => {
       
        if (err) {
          res.json({ success: false, message: 'Not a valid post id' }); 
        } else {
          
          if (!post) {
            res.json({ success: false, message: 'post not found.' }); 
          } else {
            
            userSchema.findOne({ email: req.decoded.email }, (err, user) => {
             
              if (err) {
                res.json({ success: false, message: err }); 
              } else {
                
                if (!user) {
                  res.json({ success: false, message: 'Unable to authenticate user' }); 
                } else {
                  
                  
                    res.json({ success: true, post: post }); 
                  
                }
              }
            });
          }
        }
      });
    }
  });
app.put('/editPost',(req,res)=>{
    console.log('sree');
    if(!req.body._id){
        res.json({success:false, message:'No post id provided'});
    }
    else{
postSchema.findOne({_id:req.body._id},(err,post)=>{
    if(err){
        res.json({success: false, message: 'Not a valid post id'})
    }
    else{
        if(!post){
            res.json({ success: false, message: 'post id was not found.' });
        }
        else{
            userSchema.findOne({email:req.decoded.email},(err,user)=>{
                if(err){
                    res.json({ success: false, message: err });
                }
                else{
                    if (!user) {
                        res.json({ success: false, message: 'Unable to authenticate user.' }); 
                      } 
                      else{
                        post.title = req.body.title; 
                        post.description = req.body.description; 
                        post.save((err)=>{
                            if(err){
                                res.json({ success: false, message: err });
                            }
                            else{
                                res.json({ success: true, message: 'Post Updated!' }); 
                            }
                        })
                      }
                }
            })
        }
    }

});
    }
})
app.delete('/deletepost/:id',function(req,res){
    console.log("delete api",req.params.id);
    postSchema.find({ '_id': req.params.id}, function(err) {
        if(err) {
          req.status(504);
          req.end();
          console.log(err);
        }
      }).remove(function (err) {
        console.log(err);
        if (err) {
          res.end(err);            
        } else {
          res.end();
        }
      });
});

app.put('/likePost', (req, res) => {
   console.log('like', req.body.id);
    if (!req.body.id) {
      res.json({ success: false, message: 'No id was provided.' }); 
    } else {
      
      postSchema.findOne({ _id: req.body.id }, (err, post) => {
      
        if (err) {
          res.json({ success: false, message: 'Invalid post id' }); 
        } else {
        
          if (!post) {
            res.json({ success: false, message: 'post was not found.' }); 
          } else {
          
            userSchema.findOne({ email: req.decoded.email}, (err, user) => {
              
              if (err) {
                res.json({ success: false, message: 'Something went wrong.' }); 
              } else {
                
                if (!user) {
                  res.json({ success: false, message: 'Could not authenticate user.' }); 
                } else {
               
                    if (post.likedBy.includes(user.email)) {
                      res.json({ success: false, message: 'You already liked this post.' }); 
                    } else {
                      
                      if (post.dislikedBy.includes(user.email)) {
                        post.dislikes--; 
                        const arrayIndex = post.dislikedBy.indexOf(user.email); 
                        post.dislikedBy.splice(arrayIndex, 1); 
                        post.likes++;
                        post.likedBy.push(user.email); 
                      
                        post.save((err) => {
                          
                          if (err) {
                            res.json({ success: false, message: 'Something went wrong.' }); 
                          } else {
                            res.json({ success: true, message: 'Post liked!' }); 
                          }
                        });
                      } else {
                        post.likes++; 
                        post.likedBy.push(user.email);
                      
                        post.save((err) => {
                          if (err) {
                            res.json({ success: false, message: 'Something went wrong.' }); 
                          } else {
                            res.json({ success: true, message: 'Blog liked!' }); 
                          }
                        });
                      }
                    }
                  
                }
              }
            });
          }
        }
      });
    }
  });

  app.put('/dislikePost', (req, res) => {
   console.log("dislike post", req.body);
    if (!req.body.id) {
    res.json({ success: false, message: 'No id was provided.' }); 
    console.log('email not there');
     } else{
    postSchema.findOne({ _id: req.body.id }, (err, post) => {
    
     if (err) {
        res.json({ success: false, message: 'Invalid post id' }); 
        console.log('invalid');
     } else {
          
      if (!post) {
           res.json({ success: false, message: 'post was not found.' }); 
       } else {
            
        userSchema.findOne({ email: req.decoded.email }, (err, user) => {  
          if (err) {
             res.json({ success: false, message: 'Something went wrong.' }); 
           } else {
        
               if (!user) {
                 res.json({ success: false, message: 'Could not authenticate user.' }); 
               } else {
                 if (post.dislikedBy.includes(user.email)) {
                    res.json({ success: false, message: 'You already disliked this post.' }); 
                  } else {
                     
                     if (post.likedBy.includes(user.email)) {
                        post.likes--; 
                        const arrayIndex = post.likedBy.indexOf(user.email); 
                       post.likedBy.splice(arrayIndex, 1); 
                      post.dislikes++; 
                        post.dislikedBy.push(user.email);
                        
                       post.save((err) => {
                          
                         if (err) {
                            res.json({ success: false, message: 'Something went wrong.' }); 
                         } else {
                           res.json({ success: true, message: 'post disliked!' }); 
                         }
                       });
                     } else {
                       post.dislikes++; 
                     post.dislikedBy.push(user.email); 
                     
                       post.save((err) => {
                      if (err) {
                          res.json({ success: false, message: 'Something went wrong.' });
                        } else {
                          res.json({ success: true, message: 'post disliked!' }); 
                          }
                        });
                      }
                    }
                  }
                }
              
            });
          }
        }
      });
    }
  });
  app.get('/userPost/:post',(req,res)=>{
    console.log('sree', req.params.post);
    if(!req.params.post){
        res.json({success:false, message:'No post id provided'});
    }
    else{
postSchema.findOne({_id:req.params.post},(err,post)=>{
    if(err){
        res.json({success: false, message: 'Not a valid post id'})
    }
    else{
        if(!post){
            res.json({ success: false, message: 'post id was not found.' });
        }
        else{
            userSchema.findOne({email:req.decoded.email},(err,user)=>{
                if(err){
                    res.json({ success: false, message: err });
                }
                else{
                    if (!user) {
                        res.json({ success: false, message: 'Unable to authenticate user.' }); 
                      } 
                      else{
                        res.send(post);
                       console.log(req.params.post)
                        
                      }
                }
            })
        }
    }

});
    }
})


app.post('/postcomment', (req, res) => {
    console.log("inserver");
 
    if (!req.body.comment) {
      res.json({ success: false, message: 'No comment provided' }); 
    } else {
     
      if (!req.body.id) {
        res.json({ success: false, message: 'No id was provided' }); 
      } else {
       
        postSchema.findOne({ _id: req.body.id }, (err, post) => {
        
          if (err) {
            res.json({ success: false, message: 'Invalid post id' }); 
          } else {
           
            if (!post) {
              res.json({ success: false, message: 'Blog not found.' }); 
            } else {
              
              userSchema.findOne({ email: req.decoded.email }, (err, user) => {
              
                if (err) {
                  res.json({ success: false, message: 'Something went wrong' }); 
                } else {
              
                  if (!user) {
                    res.json({ success: false, message: 'User not found.' }); 
                  } else {
                   
                    post.comments.push({
                      comment: req.body.comment,
                
                    });
                    
                    post.save((err) => {
                   
                      if (err) {
                        res.json({ success: false, message: 'Something went wrong.' }); 
                      } else {
                        res.json({ success: true, message: 'Comment saved' }); 
                      }
                    });
                  }
                }
              });
            }
          }
        });
      }
    }
  });

app.listen(3000, function () {
    console.log("server running on port 3000");
});