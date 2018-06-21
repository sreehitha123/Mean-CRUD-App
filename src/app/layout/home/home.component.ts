import { Component, OnInit } from '@angular/core';
import {AuthService} from '../../auth/auth.service';
@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit {
email;

  constructor(private authService:AuthService) { }

  ngOnInit() {
    this.authService.getHome().subscribe(data=>{
      console.log(data);
      this.email = data.email;
      //  console.log(this.emailid);
    })
    
  }

}
