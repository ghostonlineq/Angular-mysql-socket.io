import { Component, OnInit, NgZone } from '@angular/core';
import { Router } from '@angular/router';
import { CRUDService } from './../../service/crud.service';
import {
  FormGroup,
  FormBuilder,
  NgForm,
  FormArray,
  FormControl,
} from '@angular/forms';
import { AuthUserService } from './../../service/auth-user.service';
import { ChatService } from './../../service/chat.service';
import { Observable } from 'rxjs';
// import { get } from 'http';

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
  userNamelist:  Array<any> = [];

  // rows: FormArray;
  // itemForm: FormGroup;

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
      email: new FormArray([
        // this.formBuilder.group({email: [""]})
      ]),
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

  get email() {
    return this.groupForm.get('email') as FormArray;
  }

  ngOnInit(): void {
    this.ConnectionSocket();
    this.GetgroupsType();
    this.GetAnotherUser();
    // this.rows.setValue([this.groupForm.value.rows])
    // this.rows.setValue(this.groupForm.value.rows[0])
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
  onGetUserId(): any {
    this.chatService.SelectUser(this.groupForm.value.email).subscribe((data) => {
      console.log(this.groupForm.value.rows);
      console.log('UserID:', data);
    });
  }
  onAddRow() {
    this.email.push(this.formBuilder.group({email: []}));
    console.log(this.email.value);

  }
  onRemoveRow(rowIndex: number) {
    this.email.removeAt(rowIndex);
  }
}
