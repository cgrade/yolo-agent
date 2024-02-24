let Fastify   =require('fastify')



function one(req, res, next) {
    req.one = true;
    next();
}

function two(req, res, next) {
    req.two = true;
    next();
}

async function build () {
    const fastify = Fastify()
    await fastify.register(require('middie'))
    
    return fastify.use(one).use(two).get('/test/', (req, res) => {
        res.send(`hello world`);
    })
}

build()
    .then(fastify => fastify.listen(3000,()=>{
        console.log("running fastify")
        
    }))
    .catch(console.log)


