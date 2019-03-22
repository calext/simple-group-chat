const http= require('http');
const soc = require('socket.io');
const express = require('express')
const app= express();
const path = require('path');

let serv=app.listen(899, ()=>{
	console.log('server listening on port: '+ serv.address().port)
})
const io= soc(serv, {
	path: '/sock'
})

io.on('connect', (s) => {

	s.join('globalRoom')

	s.on('newMessage', (f) => {
		s.to('globalRoom').emit('newMessage',f);
	})
})
app.use(express.static('front_end_bundle'))
