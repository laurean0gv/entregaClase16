const express = require("express");
const {Server: HttpServer} = require("http");
const {Server: SocketServer} = require("socket.io");

const Contenedor = require("./classContenedor.js");

let messages = [];
const products = [];

const app = express();
const port = 8080;

const {engine} = require("express-handlebars");


const options = {
  host: '127.0.0.1',
  user: 'root',
  password: '',
  database: 'ecommerce'
};

let productos = new Contenedor(options);

app.engine(
  "hbs",
  engine({
    extname: ".hbs",
    defaultLayout: "index.hbs",
  })
);

app.use(express.json());
app.use(express.urlencoded({extended: true}));
app.use("/", express.static("public"));
app.set("view engine", "hbs");
app.set("views", "./hbs_views");

const httpServer = new HttpServer(app);
const socketServer = new SocketServer(httpServer);

socketServer.on("connection", (socket) => {
  socket.emit("messages", messages)
  socket.emit("products", products);

  socket.on("new_product", (producto) => {
    console.log(producto);
    products.push(producto);
    productos.save(products);
    socketServer.sockets.emit("products", products);
  });

  socket.on("new_message", (mensaje) => {
    messages.push(mensaje);
    productos.saveMsj(messages);
    socketServer.sockets.emit("messages", messages);
  });
});

httpServer.listen(port, () => {
  console.log("Estoy escuchando en el puerto 8080");
});

httpServer.on("error", (error) => console.log(`Error en el servidor ${error}`));


app.get('/',  async (req, res) => {
  let arrayPrdocutos = await productos.getAll();
  let arrayMensajes = await productos.getAllMsj();
  res.render('main', { productos: arrayPrdocutos,  mensajes: arrayMensajes });
});

app.post('/', async (req, res) => {
  let producto = JSON.stringify(req.body);
  await productos.save(producto);
  let arrayPrdocutos = await productos.getAll();
  let arrayMensajes = await productos.getAllMsj();
  res.render('main', { productos: arrayPrdocutos,  mensajes: arrayMensajes });
});


/*
app.get("/", (req, res) => {
  const contenedor = new Contenedor(options);
  contenedor.getAll()
    .then((mensajes) => {
      messages = mensajes;
    })
    .catch((error) => {
      console.log(error);
    });
  res.render("main");
});



/*
const express = require('express');
const { Server: HttpServer } = require('http');
const { Server: SocketServer } = require('socket.io');
const { engine } = require('express-handlebars');
//const productRouter = require("./index.js");

const productRouter = express.Router();

const Contenedor = require('./classContenedor.js');
const path = require('path')

module.exports = productRouter;

const messages = [];

const app = express();
app.use(express.static('public'));

const options = {
  host: '127.0.0.1',
  user: 'root',
  password: '',
  database: 'ecommerce'
};
let productos = new Contenedor(options);

const httpServer = new HttpServer(app);
const socketServer = new SocketServer(httpServer);

app.engine(
  'hbs',
  engine({
    extname: '.hbs',
    defaultLayout: 'index.hbs',
  })
);

app.use(express.json());
app.use(express.urlencoded({extended: true}));

app.set('views', './hbs_views');
app.set('view engine', 'hbs');

app.use("/api/productos", productRouter);

productRouter.get('/mostrarHbs',  async (req, res) => {
  let arrayPrdocutos = await productos.getAll();
  res.render('mostrar', { productos: arrayPrdocutos });
});

productRouter.post('/', async (req, res) => {
  console.log(req.body);
  let producto = JSON.stringify(req.body);
  let productoSave=await productos.save(producto);
});

socketServer.on('connection', (socket) => {
  socket.emit('messages', messages);

  socket.on('new_message', (mensaje) => {
    messages.push(mensaje);
    socketServer.sockets.emit('messages', messages);
  });
  
});

httpServer.listen(8080, () => {
  console.log('Estoy escuchando en el puerto 8080');
});*/