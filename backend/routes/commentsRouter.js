const { Router } = require("express");
const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();
const passport = require('passport');


const commentsRouter = Router();



commentsRouter.get('/', async (req, res) => {
    const comments = await prisma.comments.findMany({
        orderBy: {
            "id": "desc"
        },
        include: {
          user: true,
        },
      });
          let result = [...comments];
    res.json(result);
  });

// ---------------------------------------
commentsRouter.get('/:postId', async (req, res) => {
    const postId = Number(req.params.postId);
    const comments = await prisma.comments.findMany({
        // orderBy: {
        //     "id": "desc"
        // },
        // include: {
        //   user: true,
        // },
        where: {
            postId,
        },
        include: {
            user: true,
        },
      });
          let result = [...comments];
    res.json(result);
  });  
// ---------------------------------------

commentsRouter.post("/", passport.authenticate('jwt', { session: false }), async (req, res) => {
    const { userId, postId, description } = req.body;

    try {
        let result = await prisma.comments.create({
            data: {
                description,
                user: {
                    connect: { id: parseInt(userId, 10) }
                },
                post: {
                    connect: { id: parseInt(postId, 10) }
                }
            }
        });
        res.json(result);
    } catch (err) {
        console.error(err);
        res.status(500).send('Server error');
    }
});

//------------------------------------------------
commentsRouter.post("/new", async (req, res) => {
    const { description } = req.body;
    const userId = Number(req.body.userId);
    const postId = Number(req.body.postId);

    try {
        let result = await prisma.comments.create({
            data: {
                description,
                userId,
                postId
            }
        });
        res.json(result);
    } catch (err) {
        console.error(err);
        res.status(500).send('Server error');
    }
});
//----------------------------------------------------------------

commentsRouter.put("/:id", passport.authenticate('jwt', { session: false }), async (req, res) => {
    const { id } = req.params;  // Now this will correctly extract the id
    const { description } = req.body;

    try {
        const updatedComment = await prisma.comments.update({
            where: { id: Number(id) },
            data: { description },
        });

        res.json(updatedComment);
    } catch (error) {
        res.status(500).json({ error: 'Failed to update comment.' });
    }
});


commentsRouter.delete('/:id', passport.authenticate('jwt', { session: false }), async (req, res) => {
    const id = req.params.id;
    await prisma.comments.delete({
        where: {
            id: parseInt(id, 10),
        }
    });
    res.json({ message: "Deleted"});
});



module.exports = commentsRouter;