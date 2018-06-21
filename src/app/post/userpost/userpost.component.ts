import { Component, OnInit } from '@angular/core';
import {ActivatedRoute, Router} from '@angular/router';
import {PostService} from '../../auth/post.service';
@Component({
  selector: 'app-userpost',
  templateUrl: './userpost.component.html',
  styleUrls: ['./userpost.component.css']
})
export class UserpostComponent implements OnInit {
currentUrl;
createdBy;
title;
description;
likes;
dislikes;
  constructor(private activatedRoute:ActivatedRoute, private postService:PostService, private router:Router) { }

  ngOnInit() {
    this.currentUrl = this.activatedRoute.snapshot.params;
    console.log(this.currentUrl);
    this.postService.getUserpost(this.currentUrl.id).subscribe(data=>{
      console.log(data);
     
      this.title = data.title;
      this.likes = data.likes;
      this.dislikes = data.dislikes;
    this.description = data.description;
  })
  }
}
