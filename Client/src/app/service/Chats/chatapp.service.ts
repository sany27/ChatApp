import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { io, Socket } from 'socket.io-client';

@Injectable({
  providedIn: 'root',
})
export class ChatappService {
  sockets: Socket;
  constructor() {
    this.sockets = io('http://localhost:8080');
  }


  joinRoom(data: any) {
    console.log(data);
    this.sockets.emit('joinRoom', data);
  }

  sendMessage(data: any) {
    console.log(data);
    this.sockets.emit('message', data);
  }

  reciverfunc(data: any, id: any) {
    const reciever_id = data.IDs;
    const sender_id = id;
    console.log("Reciever's Id: ", reciever_id, 'and Sender_id : ', sender_id);
    this.sockets.emit('userConnection', { reciever: reciever_id, sender: sender_id });
  }
 onMessage(): Observable<any> {
    return new Observable((observer) => {
      this.sockets.on('NewMessage', (message: any) => {
        observer.next(message);
      });
    });
  }
}
