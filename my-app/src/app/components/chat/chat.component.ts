import { Component, OnInit, NgZone } from '@angular/core';
import { Router } from '@angular/router';
import { CRUDService } from './../../service/crud.service';
import { FormGroup, FormBuilder, NgForm } from '@angular/forms';
import { AuthUserService } from './../../service/auth-user.service';
import { ChatService } from './../../service/chat.service';
import { Observable } from 'rxjs';

@Component({
  selector: 'app-chat',
  templateUrl: './chat.component.html',
  styleUrls: ['./chat.component.css'],
})
export class ChatComponent implements OnInit {
  tokenKey: any;
  groupForm: FormGroup;
  anotherUserForm: FormGroup;
  groupType: Array<any> = [];
  listName: Array<any> = [];

  constructor(
    public formBuilder: FormBuilder,
    private router: Router,
    private ngZone: NgZone,
    private authService: AuthUserService,
    private chatService: ChatService
  ) {
    this.groupForm = this.formBuilder.group({
      name: [''],
      group_type: [],
    });
    this.anotherUserForm = this.formBuilder.group({
      nameUser: [''],
      Email: [''],
    });

    this.authService.isLogin().subscribe((data) => {
      this.tokenKey = data;
      console.log('data:', this.tokenKey);
    });
  }

  ngOnInit(): void {
    this.ConnectionSocket();
    this.GetgroupsType();
    this.GetAnotherUser();
  }
  ConnectionSocket() {
    this.chatService.listen('test Connect').subscribe((res) => {
      console.log(res);
    });
  }

  GetgroupsType(): any {
    this.chatService.Get_GroupType().subscribe((data) => {
      console.log(data);
      this.groupType = data;
      console.log(this.groupType);
    });
  }

  onCreateChat(): any {
    this.chatService.Add_GroupChat(this.groupForm.value).subscribe((data) => {
      console.log(data);
      console.log('Group Added');
      this.groupForm.reset();
    });
  }
  GetAnotherUser(): any {
    this.chatService.Get_Another_User().subscribe((data) => {
      console.log(data);
      this.listName = data;
    });
  }
}
