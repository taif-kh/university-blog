const { Router } = require('express');
const likesRouter = Router();
const { PrismaClient } = require('@prisma/client');
const passport = require('passport');
const prisma = new PrismaClient();

likesRouter.get('/user/:userId/post/:postId', async (req,res) => {
    const postId = Number(req.params.postId);
    const userId = Number(req.params.userId);

     let result = await prisma.likes.findUnique({
        where: {
            userId_postId: {
                userId, 
                postId,
              },
        }
    });
    res.json(result);
});

likesRouter.post('/:postId', async (req,res) =>{
    const userId = Number(req.body.userId);
    const postId = Number(req.params.postId);
    await prisma.likes.create({
        data: {
            userId,
            postId,
        },
    });
});

likesRouter.delete('/user/:userId/post/:postId', async (req,res) =>{
    const userId = Number(req.params.userId);
    const postId = Number(req.params.postId);

    await prisma.likes.delete({
        where: {
            userId_postId: {
            userId,
            postId,
            },
        },
    });
});


module.exports = likesRouter;