import {
  Component,
  OnInit,
} from '@angular/core';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-error-page',
  templateUrl: './error-page.component.html',
  styleUrls: ['./error-page.component.scss']
})
export class ErrorPageComponent implements OnInit {

  public errorMessage: string;

  constructor(private activeRoute: ActivatedRoute) { }

  ngOnInit(): void {
    this.errorMessage = this.activeRoute.snapshot.queryParams.message;
  }

}
