const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const app = express();
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static('public')); 

// connect to our Mongo instance - obviously this only works locally so change if we have a shared instance running 
mongoose.connect('mongodb://localhost:27017/blogposts', {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

// define our post model and the schema of the model 
const postSchema = new mongoose.Schema({
  title: String,
  content: String
});
const Post = mongoose.model('Post', postSchema);

// designate ejs as the view engine for template rendering 
app.set('view engine', 'ejs');

// we need this to parse the form for user input 
app.use(bodyParser.urlencoded({ extended: true }));

// home page 
app.get('/', async (req, res) => {
    // find all posts in our database 
    const foundPosts = await Post.find({});
    // pass the dictionary of found posts to the page and render
    res.render('index', { posts: foundPosts });
});

// route that renders the new page 
// note: doesn't actually implement form functionality, just displays the page that contains the form
app.get('/new', (req, res) => {
    res.render('new');
});

// route that triggers when user hits submit on the "new post" page
app.post('/submit', (req, res) => {
    // get the user inputted data from our form
    // postTitle and postContent are the fields associated with those names 
    const { postTitle, postContent } = req.body;

    // create a new post "instance"
    const newPost = new Post({
        title: postTitle,
        content: postContent
    });

    // save to our database and redirect back to the homepage
    newPost.save();
    res.redirect('/');
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});