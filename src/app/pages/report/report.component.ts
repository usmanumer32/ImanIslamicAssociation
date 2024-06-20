import { Component, OnInit } from '@angular/core';
import { CountService } from 'src/app/providers/count.service';

@Component({
  selector: 'app-report',
  templateUrl: './report.component.html',
  styleUrls: ['./report.component.scss']
})
export class ReportComponent implements OnInit {
  count: number;

  constructor(
    private countService: CountService
  ) { }

  ngOnInit() {
    this.getCount();
  }

  getCount() {
    this.countService.getCount()
    .subscribe(res => {
      this.count = res[0].count;
    });
  }
}
