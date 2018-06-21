import { Component, OnInit } from '@angular/core';
import {Location} from '@angular/common';
import {ActivatedRoute, Router} from '@angular/router';
import {PostService} from '../../auth/post.service';
@Component({
  selector: 'app-edit',
  templateUrl: './edit.component.html',
  styleUrls: ['./edit.component.css']
})
export class EditComponent implements OnInit {
  currentUrl; 
  constructor(private location:Location, private activatedRoute:ActivatedRoute, private postService:PostService, private router:Router) { }
  post = {
    title: String,
    description: String
  }

updatePost(){
this.postService.editPost(this.post).subscribe(data=>{
 
})
}
goBack(){
  this.location.back();
}
  ngOnInit() {
    this.currentUrl = this.activatedRoute.snapshot.params;
    console.log(this.currentUrl);
    this.postService.getsinglePost(this.currentUrl.id).subscribe(data=>{
      this.post = data.post;
    })
  }

}
