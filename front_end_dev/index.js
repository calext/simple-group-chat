const m = require('mithril');
const soc = require('socket.io-client');
import './master.css';


var name='';
var io
var chats=[]


var preOps={
  checkChat: function() {
      m.redraw()
      document.querySelector('aside:last-child').scrollIntoView({behaviour: 'auto', block: 'end', inline: 'center'})
  },
  logChat: function() {

      m.redraw()
      document.querySelector('aside:last-child').scrollIntoView({behaviour: 'auto', block: 'end', inline: 'center'})

  },
  sendChat: function() {
    var d

    if(document.querySelector('.type')){
    if(d=document.querySelector('.type').value){
      document.querySelector('.type').value=""
      document.querySelector('.type').focus()
      var s=io.emit('newMessage', {name: name, msg: d})

        chats.push({name: 'mine',msg: d})
        preOps.logChat()
    }
    }
  },
  clearChat: function() {
    if(chats){
      chats= []
      m.redraw()
    }
  }
}

var login= {
  view: function() {
    return [
      m('.base', [
        m('h3.h', 'To join the group chat enter a name'),
        m("label[for='name'].l", "Username"),
          m("input[type='text'][name='name'].t"),
          m("button.s",{ onclick: function() {
            name= document.querySelector('.t').value
            m.route.set('/gchat')
          }}, "Start")

      ])
    ]
  }
}
var gchat= {
  oncreate: function() {
     if(!name){
       if(io){
         if(io.connected){
           io.disconnect()
         }
       }
       m.route.set('/Login')
     }else{
      io= soc('localhost:899',{
        path: '/sock'
      })
      io.on('connect', function() {
        console.log('Connected!');
      })
      io.on('newMessage', function(d) {
        chats.push(d)
        preOps.logChat()
      })
      document.querySelector('.clear').onclick= function() {
        preOps.clearChat()
      }
    }
  },
  view: function() {

    return [
      m('.base', [
        m('.revealer',[

          chats.map(function(item) {
            if(item){
              if(item.name=='mine'){
                return[
                  m('aside.out',[
                    m('h5.m', item.msg)
                  ])
                ]
              }else if (item.name) {
                return[
                  m('aside.in', [
                  m('h4.u', item.name),
                  m('h5.m', item.msg)
                ])
                ]
              }
            }
          })
        ]),
        m('.chat', [
          m.trust("<button class='clear' title='Clear Chat'>&#x2718;</button>"),
          m('input[type=text].type', {onkeypress: function(e){
            if(e.keyCode==13){
              e.preventDefault()
              preOps.sendChat()
            }
          }}),
          m('button.send', {
            onclick: preOps.sendChat

          }, 'Send')
        ])

      ])
    ]
  }
}
m.route(document.body, '/Login',{
  '/Login': login,
  '/gchat': gchat
})
