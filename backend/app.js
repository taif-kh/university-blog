require('dotenv').config();
const express = require('express');
const bodyParser = require('body-parser');
const PORT = process.env.PORT || 3000;
const postsRouter = require('./routes/postsRouter');
const commentsRouter = require('./routes/commentsRouter');
const likesRouter = require('./routes/likesRouter');
const bcrypt = require('bcryptjs');
const session = require('express-session');
const passport = require('passport');
const LocalStrategy = require('passport-local').Strategy;
const path = require('path');
const { PrismaSessionStore } = require('@quixo3/prisma-session-store');
const { PrismaClient } = require('@prisma/client');
const jwt = require('jsonwebtoken');
const JwtStrategy = require('passport-jwt').Strategy;
const ExtractJwt = require('passport-jwt').ExtractJwt;
const cors = require('cors');

const app = express();
app.use(cors());
const prisma = new PrismaClient();

app.use(bodyParser.json({ limit: '10mb' }));
app.use(bodyParser.urlencoded({ limit: '10mb', extended: true }));

app.use(session({
    secret: "cats",
    resave: false,
    saveUninitialized: false,
    store: new PrismaSessionStore(
      prisma,
      {
        checkPeriod: 2 * 60 * 1000,
        dbRecordIdIsSessionId: true,
      }
    )
}));
app.use(passport.initialize());
app.use(passport.session());

const jwtSecret = process.env.JWT_SECRET || 'your_jwt_secret_key';

passport.use(new LocalStrategy(
    { usernameField: 'email' },
    async (email, password, done) => {
      console.log('Authenticating user:', email);
      try {
        const user = await prisma.users.findUnique({
          where: { email }
        });

        if (!user) {
          console.log('User not found');
          return done(null, false, { message: 'Incorrect username or password.' });
        }

        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
          console.log('Password mismatch');
          return done(null, false, { message: 'Incorrect username or password.' });
        }

        console.log('Authentication successful');
        return done(null, user);
      } catch (err) {
        console.log('Error during authentication:', err);
        return done(err);
      }
    }
));

passport.use(new JwtStrategy({
  jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
  secretOrKey: jwtSecret,
},
async (jwt_payload, done) => {
  console.log('JWT Payload:', jwt_payload); // Log payload for debugging
  try {
    const user = await prisma.users.findUnique({
      where: { id: jwt_payload.id },
    });

    if (user) {
      return done(null, user);
    } else {
      return done(null, false, { message: 'User not found' });
    }
  } catch (err) {
    console.error('Error during JWT validation:', err); // Log errors for debugging
    return done(err, false);
  }
}
));


passport.serializeUser((user, done) => {
  done(null, user.id);
});

passport.deserializeUser(async (id, done) => {
  try {
    const user = await prisma.users.findUnique({ where: { id } });
    done(null, user);
  } catch (err) {
    done(err);
  }
});

app.set("views", path.join(__dirname, "views"));
app.set("view engine", "ejs");

app.post("/sign-up", async (req, res) => {
  const { username, userEmail, imgUrl, password } = req.body;

  try {
    const hashedPassword = await bcrypt.hash(password, 10);

    await prisma.users.create({
      data: {
        username,
        email: userEmail,
        imgUrl,
        password: hashedPassword
      }
    });

    res.json({message: "success"});
  } catch (error) {
    console.error(error);
    res.status(500).send("An error occurred during sign-up.");
  }
});

app.get('/login', (req, res) => {
  res.render('login');
});



app.post("/log-in", async (req, res, next) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).json({ error: "Email and password are required" });
  }

  passport.authenticate("local", (err, user, info) => {
    if (err) {
      return next(err);
    }
    if (!user) {
      return res.status(401).json({ error: "Invalid email or password" });
    }
    req.logIn(user, (err) => {
      if (err) {
        return next(err);
      }
      const payload = { id: user.id, email: user.email, username: user.username };
      const token = jwt.sign(payload, jwtSecret, { expiresIn: '1h' });

      res.json({ token, id: user.id, email: user.email, username: user.username });
    });
  })(req, res, next);
});




app.get("/log-out", (req, res, next) => {
  req.logout((err) => {
    if (err) {
      return next(err);
    }
    res.redirect("/");
  });
});

app.get("/success", (req, res) => {
  res.send("success");
});

app.get("/error", (req, res) => {
  res.send("error");
});


// --------GET BACK TO " / ""
app.get('/', async (req, res) => {
  const posts = await prisma.posts.findMany({
    orderBy: {
      id: 'desc',
    },
    include: {
      user: true,
    },
  });

  const result = posts.map(post => ({
    ...post,
    addedAt: new Date(post.addedAt).toLocaleString(), 
  }));

  res.json(result);
});

// ________________________________
app.get('/news', async (req, res) => {
  const posts = await prisma.posts.findMany({
    orderBy: {
      id: 'desc',
    },
    where: {
      isPublished: true,
    },
    include: {
      user: true,
    },
  });

  const result = posts.map(post => ({
    ...post,
    addedAt: new Date(post.addedAt).toLocaleString(), 
  }));

  res.json(result);
});

//________________________
app.get('/articles', async (req, res) => {
  const posts = await prisma.posts.findMany({
    orderBy: {
      id: 'desc',
    },
    where: {
      isPublished: false,
    },
    include: {
      user: true,
    },
  });

  const result = posts.map(post => ({
    ...post,
    addedAt: new Date(post.addedAt).toLocaleString(), 
  }));

  res.json(result);
});


// _________________________________________________
app.get("/test_users", async (req, res) => {
  const response = await prisma.users.findMany({
  });
  res.json(response);
});


app.get("/allComments", async (req, res) => {
  const response = await prisma.comments.findMany({
    orderBy: {
      id: "desc",
    },
    include: {
      user: true,
      post: true,
    },
  });

  const result = response.map(post => ({
    ...post,
    addedAt: new Date(post.addedAt).toLocaleString(), 
  }));

  res.json(result);
});


app.get("/allUsers", async (req, res) => {
  const response = await prisma.users.findMany({
    orderBy: {
      id: "desc",
    }
  });
  res.json(response);
});


app.get("/userArticles", async (req, res) => {
  const response = await prisma.posts.findMany({
    orderBy: {
      id: "desc",
    },
    include: {
      user: true,
    },
  });

  
  const result = response.map(post => ({
    ...post,
    addedAt: new Date(post.addedAt).toLocaleString(), 
  }));

  res.json(result);
});


app.delete('/removeItem/:postId', async (req, res) => {
  let postId = Number(req.params.postId);

  try {
    await prisma.comments.deleteMany({
      where: { postId: postId }
    });

    let response = await prisma.posts.delete({
      where: { id: postId }
    });

    res.status(200).json({ message: 'Post deleted successfully', response });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});


//******************** 
app.delete('/com/:comId', async (req, res) => {
  let comId = Number(req.params.comId);
    let response = await prisma.comments.delete({
      where: { 
        id: comId,
       },
    });

res.json(response);
  });

// ----------------------------
app.delete('/remove/:userId', async (req, res) => {
  let userId = Number(req.params.userId);
    let response = await prisma.users.delete({
      where: { 
        id: userId,
       },
    });

res.json(response);
  });
// _________________________________________________
app.use('/comments', commentsRouter);
app.use('/posts', postsRouter);
app.use('/likes', likesRouter);
// app.use('/comments', passport.authenticate('jwt', { session: false }), commentsRouter);
// _________________________________________________
app.post("/users", async (req, res) => {
    const {username, userEmail, userPassword, imgUrl} = req.body;
    let result = await prisma.users.create({
        data: {
            username,
            email: userEmail,
            password: userPassword,
            imgUrl
        }
    });
    res.json(result);
});




app.listen(PORT, () => {
    console.log(`Listening on ${PORT}`);
});


// localStorage.removeItem('token');      CLEAR TOKEN AND LOG OUT

// Authorization     
// Bearer ***val***