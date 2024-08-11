import { Component, OnInit } from '@angular/core';
import { AuthenticationService } from 'src/app/shared/services/api/authentication.service';
import { UserDetails } from 'src/app/shared/types/authentication.type';
import { KeyChartData } from 'src/app/shared/types/chart.type';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss']
})
export class DashboardComponent implements OnInit {
  public isAccountActive: boolean = true;
  public get currentUser(): UserDetails {
    return this.authentication.userDetails as UserDetails;
  }

  public productPersonChartData: KeyChartData[] = [
    {
      data: [13, 15, 5, 10, 5, 10, 15, 5, 14, 5, 10, 6],
      label: 'کالا و خدمات فروخته شده'
    }
  ]

  public factorChartData: KeyChartData[] = [
    {
      data: [23, 21, 5],
      label: 'فاکتور فروش'
    },
  ]

  constructor(private authentication: AuthenticationService) {}

  ngOnInit(): void {
    
  }
}
