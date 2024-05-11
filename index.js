import express from "express";
import bodyParser from "body-parser";
import path from "path";
import multer from "multer";

const app = express();
const PORT = 3000;

app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static("public"));
app.set("view engine", "ejs");


const storage = multer.diskStorage({
  destination: "./public/images",
  filename: function (req, file, cb) {
    cb(null, Date.now() + path.extname(file.originalname));
  },
});


const upload = multer({
  storage: storage,
  limits: { fileSize: 1000000 }, 
}).single("imageUrl");


const data = [
  {
    id: 1,
    title: "Band Amir",
    description:
      "Amidst the rugged terrains of Afghanistan lies a gem that sparkles with nature’s splendor: Band-e Amir National Park.",
    imageUrl: "images/Band.PNG",
  },
  {
    id: 2,
    title: "Balkh",
    description:
      "Once known as the ‘Mother of Cities’, Balkh is one of the most beautiful places in Afghanistan.",
    imageUrl: "images/balkh.PNG",
  },
  {
    id: 3,
    title: "Bamian",
    description:
      "In the heart of Afghanistan, Bamiyan stands as a testament to the country’s rich cultural and historical heritage.",
    imageUrl: "images/bamian.PNG",
  },
 

];

let posts = [...data];

app.get("/", (req, res) => {
  res.render("index", { posts });
});

app.get("/newpost", (req, res) => {
  res.render("newpost");
});

app.post("/newpost", (req, res) => {
  upload(req, res, (err) => {
    if (err) {
      console.error(err);
      // Handle error
    } else {
      const { title, description } = req.body;
      const imageUrl = req.file ? `/images/${req.file.filename}` : null;
      const id = Date.now(); // Generate a unique ID for the post

      const newPost = { id, title, description, imageUrl };
      posts.push(newPost);

      res.redirect("/");
    }
  });
});

app.get("/edit/:id", (req, res) => {
  const postId = parseInt(req.params.id);
  const post = posts.find((post) => post.id === postId);
  res.render("edit", { post });
});

app.post("/edit/:id", (req, res) => {
  upload(req, res, (err) => {
    if (err) {
      console.error(err);
      
      
     const postId = parseInt(req.params.id);
      const { title, description } = req.body;
      const imageUrl = req.file ? `/images/${req.file.filename}` : null;
      const id = Date.now(); 
       const index = posts.findIndex((post) => post.id === postId);
  if (index !== -1) {
    posts[index].title = title;
    posts[index].description = description;
    if (imageUrl) {
      posts[index].imageUrl = imageUrl;
    }
  }
      res.redirect("/");
    }
  });
});


app.post("/delete/:id", (req, res) => {
  const postId = parseInt(req.params.id);
  posts = posts.filter((post) => post.id !== postId);

  res.redirect("/");
});

app.listen(PORT, () => {
  console.log(`Server is running  on port ${PORT}`);
});
