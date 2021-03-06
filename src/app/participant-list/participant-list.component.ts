import { Component, OnInit } from '@angular/core';
import { Participant } from '../models/participants';
import { Subscription } from 'rxjs';
import { ParticipantService } from '../services/participant.service';
import { Router } from '@angular/router';
import { MessageService } from '../services/message.service';
import { Operation } from '../models/operations';
import { OperationsService } from '../services/operations.service';

@Component({
  selector: 'app-participant-list',
  templateUrl: './participant-list.component.html',
  styleUrls: ['./participant-list.component.css']
})
export class ParticipantListComponent implements OnInit {

  participants: Participant[];
  participantsSubscription: Subscription;
  isAdmin: boolean;

  constructor(private participantsService: ParticipantService, private router: Router,
              private messageService: MessageService,
              private operationService: OperationsService) {}

  ngOnInit() {
    this.participantsSubscription = this.participantsService.participantsSubject.subscribe(
      (participants: Participant[]) => {
        this.participants = participants;
      }
    );
    this.participantsService.emitParticipants();
    this.messageService.isAdmin.subscribe(data => this.isAdmin = data);
    console.log('value' + this.isAdmin);
  }

  onNewParticipant() {
    this.router.navigate(['/participants', 'new']);
  }

  onDeleteParticipant(participant: Participant) {
    this.participantsService.removeParticipant(participant);
    const newOperation = new Operation('Destruction', participant.name, new Date().toLocaleString());
    this.operationService.createNewOperation(newOperation);
  }

  onViewParticipant(id: number) {
    this.router.navigate(['/participants', 'view', id]);
  }
  
  ngOnDestroy() {
    this.participantsSubscription.unsubscribe();
  }

}
