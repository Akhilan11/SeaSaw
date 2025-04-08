import { Component, OnDestroy } from '@angular/core';
import { SocketService } from '../../services/socket.service';
import { MessageService } from '../../services/message.service';

@Component({
  selector: 'app-chat',
  templateUrl: './chat.component.html',
  styleUrls: ['./chat.component.css']
})
export class ChatComponent implements OnDestroy {
  message: string = '';
  messages: { sender: string; content: string, timestamp: string }[] = [];

  username = '';
  joined = false;

  constructor(
    private socketService: SocketService,
    private messageService: MessageService
  ) {}

  joinChat(): void {
    if (this.username.trim()) {
      this.joined = true;

      // Load message history
      this.messageService.getMessages().subscribe((history: any[]) => {
        this.messages = history.map((msg) => ({
          sender: msg.sender,
          content: msg.content,
          timestamp: msg.timestamp
        }));
      });

      // Listen for new messages
      this.socketService.onMessage().subscribe((message: any) => {
        this.messages.push(message);
      });
    }
  }

  sendMessage(): void {
    if (this.message.trim()) {
      const messageData = {
        sender: this.username,
        content: this.message
      };

      this.socketService.sendMessage(messageData);
      this.message = '';
    }
  }

  ngOnDestroy(): void {
    this.socketService.disconnect();
  }
}
