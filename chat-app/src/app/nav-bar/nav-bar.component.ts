import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'nav-bar',
  templateUrl: './nav-bar.component.html',
  styleUrls: ['./nav-bar.component.css']
})
export class NavBarComponent implements OnInit {
  unreadMessagesCount: number;

  constructor(private messagesService: MessagesService,
              private threadsService: ThreadsService) { }

  ngOnInit(): void {
    this.messagesService.messages.combineLast(
      this.threadsService.currentThread,
      (messages: Message[], currentThread: Thread) => [currentThread, messages])
        .subscribe(([currentThread, messages]: [Thread, Message[]]) => {
          this.unreadMessagesCount =
            _.reduce(
              messages,
              (sum: number, m: Message) => {
                let messageIsInCurrentThread: boolean = m.thread &&
                  currentThread &&
                  (currentThread.id === m.thread.id);
                if (m && !m.isRead && !messageIsInCurrentThread) {
                  sum = sum + 1;
                }
                return sum;
              },
              0);
        });
  }
}
