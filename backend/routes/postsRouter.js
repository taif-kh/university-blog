const { Router } = require('express');
const postsRouter = Router();
const { PrismaClient } = require('@prisma/client');
const passport = require('passport');
const prisma = new PrismaClient();





//FOR ADMIN
postsRouter.get('/', async (req, res) => {
    const posts = await prisma.posts.findMany({
        orderBy: {
            "id": "desc",
        },
        include: {
          user: true,
        }
    }
    );
    const result = posts.map(post => ({
      ...post,
      addedAt: new Date(post.addedAt).toLocaleString(), 
    }));
        res.json(result);
});


//----------------------------------------------------------------
postsRouter.get('/:postId', async (req, res) => {
  const postId = Number(req.params.postId);
  try {
    const post = await prisma.posts.findUnique({
      where: {
        id: postId,
      },
      include: {
        user: true, 
      },
    });

    if (!post) {
      return res.status(404).json({ message: 'Post not found' });
    }

    const result = {
      ...post,
      addedAt: new Date(post.addedAt).toLocaleString(),
    };

    res.json(result);
  } catch (error) {
    res.status(500).json({ error: 'Something went wrong' });
  }
});


// ----------------------------------------------------------------


postsRouter.post('/',async (req, res) => {
    const { title, description, isPublished } = req.body;
    let id = Number(req.body.id);
    let result = await prisma.posts.update({
      where: { id},
        data: {
            title,
            postDescription: description,
            isPublished
        }
    });
    res.json(result);
});

// ----------------------------------------------------------------
postsRouter.post('/newNews',async (req, res) => {
  const { title, postDescription, imgUrl } = req.body;
  let userId = Number(req.body.userId);
  let result = await prisma.posts.create({
      data: {
        imgUrl,
          title,
          postDescription,
          isPublished: true,
          postedBy: userId,

      }
  });
  res.json(result);
});
//*********************************************************************** */
postsRouter.post('/newArticles',async (req, res) => {
  const { title, postDescription, imgUrl } = req.body;
  let userId = Number(req.body.userId);
  let result = await prisma.posts.create({
      data: {
        imgUrl,
          title,
          postDescription,
          isPublished: false,
          postedBy: userId,

      }
  });
  res.json(result);
});
//*********************************************************************** */
postsRouter.get('/edit/:postId',async (req, res) => {
  let postId = Number(req.params.postId);
  let response = await prisma.posts.findUnique({
    where: {
      id: postId,
    }
  });
  res.json(response);
});
//******* ***************************************************************** */
postsRouter.put('/edit/:postId',async (req, res) => {
  const postId = Number(req.params.postId);
  const { title, postDescription, imgUrl } = req.body;
  let result = await prisma.posts.update({
    where: {
      id: postId,
    },
      data: {
        imgUrl,
          title,
          postDescription,

      }
  });
  res.json(result);
});
// ------------------------------------------------------------------

postsRouter.put('/:id', passport.authenticate('jwt', { session: false }), async (req, res) => {
    const { id } = req.params;
    const { isPublished } = req.body;
  
    try {
      const post = await prisma.posts.findFirst({
        where: { id: Number(id) }, // Ensure id is a number
      });
  
      if (!post) {
        return res.status(404).json({ error: 'Post not found' });
      }
  
      const updatedPost = await prisma.posts.update({
        where: { id: Number(id) }, // Ensure id is a number
        data: { isPublished },
      });
  
      res.json(updatedPost);
    } catch (error) {
      res.status(500).json({ error: 'An error occurred while updating the post' });
    }
  });
  


postsRouter.delete('/:id', async (req, res) => {
    const id = req.params.id;
    await prisma.posts.delete({
        where: {
            id
        }
    });
    res.json({ message: "Deleted"});
});


//--------------------------------------------
postsRouter.post('/img',async (req, res) => {
  const { title, postDescription, imgUrl } = req.body;
  let userId = Number(req.body.userId);
  let result = await prisma.posts.create({
      data: {
        postedBy: userId,
        title,
        postDescription,
        imgUrl
      }
  });
  res.json(result);
});

module.exports = postsRouter;