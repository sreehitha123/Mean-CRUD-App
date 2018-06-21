import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, FormControl } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from '../auth/auth.service';
import { PostService } from '../auth/post.service';
@Component({
  selector: 'app-post',
  templateUrl: './post.component.html',
  styleUrls: ['./post.component.css']
})
export class PostComponent implements OnInit {
  form;
 email;
  pPosts: any = [];

  
  constructor(private postService: PostService, private formBuilder: FormBuilder, private authService: AuthService) {
    this.createNewPost();
  }

  
  createNewPost() {
    this.form = this.formBuilder.group({
      title: '',
      description: ''
    })
  }
  postSubmit() {
    var post = {
      title: this.form.get('title').value,
      description: this.form.get('description').value,
      createdBy:this.email
    }
    console.log(post);
    this.postService.addPost(post).subscribe((data => {

      setTimeout(() => {
       
        this.form.reset();
        console.log(data);
      }, 2000);
    }));
    console.log('post submitted');
  }
  
  ngOnInit() {
    this.authService.getHome().subscribe(data=>{
      console.log(data);
      //this.email = data.email;
    
    })
  }


}
