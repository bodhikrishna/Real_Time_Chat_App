const socket=io('http://127.0.0.1:8000')


//get DOM elements in a respecitve JS variables
const form=document.getElementById('send-container');
const messageinput=  document.getElementById('messageinput');
const imageinput= document.getElementById('myFile');
const messageContainer=document.querySelector(".container");
//audio played on recieving messages
var audio=new Audio('ting.mp3');


//function to append event info to the container
const append=(message,position)=>{
    const messageElement= document.createElement('div');
    messageElement.innerText= message;
    messageElement.classList.add('message');
    messageElement.classList.add(position);
    messageContainer.append(messageElement);
    if(position=='left'){
        audio.play();
    }

}
//asking new user for name and let the server know
const names=prompt("Enter your name to join");
socket.emit('new-user-joined',names);

//if new user joined, recieve event from the server
socket.on('user-joined',name=>{
    append(`${name} joined the chat`,'right');

})
//if server sends a message ,recieve it
socket.on('recieve',data=>{
    append(`${data.name}: ${data.message}`,'left');

})


//if user leavs chat, append info to the container
socket.on('left',names=>{
    append(`${names} left the chat`,'right');
})

//if form submitted, send to the server
form.addEventListener('submit',(e)=>{
    e.preventDefault();
    const message=messageinput.value;
    append(`You:${message}`,'right');
    socket.emit('send',message);
    messageinput.value=''
})
