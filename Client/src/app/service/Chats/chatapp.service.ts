import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { io, Socket } from "socket.io-client";

@Injectable({
  providedIn: 'root'
})
export class ChatappService {
 sockets : Socket;

  constructor() {

    this.sockets = io("http://localhost:8080");
  }
  
 sendMessage(message: string){
  this.sockets.emit("message",message);
 }

reciverfunc(data : any, id: any){
  const reciever_id = data.IDs
  const sender_id = id;
  console.log("Reciever's Id: ",reciever_id, "and Sender_id : ",sender_id);
  this.sockets.emit("id",{reciever : reciever_id, sender : sender_id});
  

}
  onMessage() {
  return new Observable(observer => {
    this.sockets.on('NewMessage', (message:any) => {
      observer.next(message);
    });
  });
}
}