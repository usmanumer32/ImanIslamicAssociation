import { Component, OnInit, OnDestroy } from '@angular/core';
import { MessageService } from 'src/app/providers/message.service';
import { Subscription } from 'rxjs';
import { BroadcastMessage } from 'src/app/model/broadcast-message.model';
import { DialogMessage } from 'src/app/model/dialog-message.model';
import { HelperServiceService } from 'src/app/providers/helper-service.service';

@Component({
  selector: 'app-dialog-confirm',
  templateUrl: './dialog-confirm.component.html',
  styleUrls: ['./dialog-confirm.component.scss']
})
export class DialogConfirmComponent implements OnInit, OnDestroy {
  subscription: Subscription;
  dialogMessage: DialogMessage;
  message: string;
  messageAction: string;

  constructor(
    private helperService: HelperServiceService,
    private messageService: MessageService,
  ) {
    this.subscription = this.helperService.subscribeTask()
      .subscribe((message: BroadcastMessage) => {
        if (message.sender === this.messageService.dialogDataSender) {
          this.dialogMessage = message.data;
          this.message = this.dialogMessage.message;
        }
      });
  }

  ngOnDestroy() {
    if (this.subscription) {
      this.subscription.unsubscribe();
    }
  }

  ngOnInit() {
  }

  confirm(response: boolean) {
    console.log('here');
    this.helperService.broadcastTask(new BroadcastMessage(this.dialogMessage.responseType, response));
  }

}
