import { Component } from '@angular/core';
import { AuthenticationService } from 'src/app/shared/services/api/authentication.service';
import { UserDetails } from 'src/app/shared/types/authentication.type';
import { KeyChartData } from 'src/app/shared/types/chart.type';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss']
})
export class DashboardComponent {
  public isAccountActive: boolean = true;
  public get currentUser(): UserDetails {
    return this.authentication.userDetails as UserDetails;
  }

  public productPersonChartData: KeyChartData[] = [
    {
      data: [23, 21, 5, 14, 6, 12, 20, 12, 15, 6, 10, 14],
      label: 'طرف حساب'
    },
    {
      data: [13, 15, 5, 10, 5, 10, 15, 5, 14, 5, 10, 6],
      label: 'کالا و خدمات'
    },
    {
      data: [12, 15, 10, 6, 20, 17, 12, 15, 19, 10, 11, 15 ],
      label: 'واحد'
    },
  ]

  public factorChartData: KeyChartData[] = [
    {
      data: [23, 21, 5],
      label: 'فاکتور فروش'
    },
  ]

  constructor(private authentication: AuthenticationService) {}
}
