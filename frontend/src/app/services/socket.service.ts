import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { io, Socket } from 'socket.io-client';


@Injectable({
  providedIn: 'root'
})
export class SocketService {

  private socket: Socket;
  private readonly url: string = 'http://localhost:3000';

  constructor() { 
    this.socket = io(this.url);
  }

  // Emit a message to the server 
  sendMessage(message: { sender: string; content: string }): void {
    this.socket.emit('chat message', message);
  }

  // Listen for messages from the server
  onMessage(): Observable<string> {
    return new Observable((observer) => {
      this.socket.on('chat message', (data: any) => {
        observer.next(data);
      });
    });
  }

  // Optional: Handle disconnects/cleanup
  disconnect(): void {
    if (this.socket) {
      this.socket.disconnect();
    }
  }
}
