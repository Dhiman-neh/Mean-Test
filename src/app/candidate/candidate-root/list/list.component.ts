import { AfterViewInit, Component, OnInit, ViewChild } from '@angular/core';
import { SelectionModel } from '@angular/cdk/collections';
import { MatTableDataSource } from '@angular/material/table';
import { MatDialog } from '@angular/material/dialog';
import { CandidateModalComponent } from '../candidate-modal/candidate-modal.component';
import { MatSort, Sort } from '@angular/material/sort';
import { Apollo, gql } from 'apollo-angular';
import { countries } from 'src/shared/countries';
import { MatPaginator, PageEvent } from '@angular/material/paginator';

export interface PeriodicElement {
  name: string;
  idNumber: string;
  location: string;
  emailAddress: string;
  mobileNumber: string;
  daysActive: string;
  country: string;
}

const ELEMENT_DATA: PeriodicElement[] = [
  { name: 'User 1', idNumber: '7589114587987', location: 'Centurion, South Africa', emailAddress: 'greg1@hellocrowd.net', mobileNumber: '+27 82 801 4085', daysActive: '< 30 days', country: 'India', },
  { name: 'User 2', idNumber: '7589256987452', location: 'Centurion, South Africa', emailAddress: 'greg3@hellocrowd.net', mobileNumber: '+27 82 801 4085', daysActive: '< 30 days', country: 'Zimbabwe', },
  { name: 'User 3', idNumber: '7589396365874', location: 'Centurion, South Africa', emailAddress: 'greg5@hellocrowd.net', mobileNumber: '+27 82 801 4085', daysActive: '< 30 days', country: 'Singapore', },
  { name: 'User 4', idNumber: '7589512454787', location: 'Centurion, South Africa', emailAddress: 'greg7@hellocrowd.net', mobileNumber: '+27 82 801 4085', daysActive: '< 30 days', country: 'Australia', },
  { name: 'User 5', idNumber: '7589552558747', location: 'Centurion, South Africa', emailAddress: 'greg9@hellocrowd.net', mobileNumber: '+27 82 801 4085', daysActive: '< 30 days', country: 'South Africa', },
  { name: 'User 6', idNumber: '7589623144777', location: 'Centurion, South Africa', emailAddress: 'greg2@hellocrowd.net', mobileNumber: '+27 82 801 4085', daysActive: '< 30 days', country: 'United States', },
  { name: 'User 7', idNumber: '7589396414784', location: 'Centurion, South Africa', emailAddress: 'greg4@hellocrowd.net', mobileNumber: '+27 82 801 4085', daysActive: '< 30 days', country: 'India', },
  { name: 'User 8', idNumber: '7583419744578', location: 'Centurion, South Africa', emailAddress: 'greg6@hellocrowd.net', mobileNumber: '+27 82 801 4085', daysActive: '< 30 days', country: 'Zimbabwe', },
  { name: 'User 9', idNumber: '7587623165457', location: 'Centurion, South Africa', emailAddress: 'greg8@hellocrowd.net', mobileNumber: '+27 82 801 4085', daysActive: '< 30 days', country: 'Singapore', },
  { name: 'User 10', idNumber: '7582323641653', location: 'Centurion, South Africa', emailAddress: 'greg10@hellocrowd.net', mobileNumber: '+27 82 801 4085', daysActive: '< 30 days', country: 'Australia', },
];
const REMOVE_CANDIDATE = gql`
mutation removeCandidate($id:String!) {
  removeCandidate(id:$id)
}`

const REMOVE_ALL_CANDIDATE = gql`
  mutation removeMultipleCandidate($id: [String!]!) {
    removeMultipleCandidate(id: $id) 
  }`

// const REMOVE_ALL_CANDIDATE = gql`
//     mutation removeMultipleCandidate($id: String!){
//       removeMultipleCandidate([id: $id]){
//        message,
//        success
//       }
//     }
//     `;

@Component({
  selector: 'app-list',
  templateUrl: './list.component.html',
  styleUrls: ['./list.component.scss']
})
export class ListComponent implements OnInit, AfterViewInit {
  selectedAllIds: any = [];
  commonMatchId: any = []
  constructor(public dialog: MatDialog, private apollo: Apollo) { }
  @ViewChild(MatSort) sort: MatSort;
  @ViewChild(MatPaginator) paginator: MatPaginator;
  displayedColumns: string[] = ['select', 'name', 'idNumber', 'location', 'emailAddress', 'mobileNumber', 'daysActive', 'action'];
  allCandidateData = new MatTableDataSource<any>(ELEMENT_DATA);
  selection = new SelectionModel<any>(true, []);

  ngOnInit(): void {
    this.candidateList();
  }

  onChangePage(pe: PageEvent) {
    console.log(pe.pageIndex);
    console.log(pe.pageSize);
  }

  ngAfterViewInit() {
    this.allCandidateData.sort = this.sort;
  }

  candidateList() {
    this.apollo
      .watchQuery({
        query:
          gql`
        {
          findAllCandidate(
            filter :{limit:10, page:1}) {
            candidate{
              _id
              address{
                addressLine1
                addressLine2
                city
                country
                postalCode
                province
              }
              email
              firstName
              identityNumber
              isActive
              lastName
              mobileNumber
              socialMediaLinks{
                facebook
                linkedIn
                twitter
              } 
            }
            totalCount
          }
        }
      `,
      })
      .valueChanges.subscribe((result: any) => {
        this.allCandidateData.data = result?.data?.findAllCandidate.candidate;
        console.log(this.allCandidateData);
        this.countryFlagForListHandler(this.allCandidateData.data);
      });
  }

  countryFlagForListHandler(list) {
    list.forEach(val => {
      // list.data.forEach(val => {
      // val.flag = findFlagUrlByCountryName(val.country);
      // val.flag = "../../../../assets/flags/AD.svg";
      // val.flag = this.countryFlagHandler(val);
      val.flag = this.countryFlagHandler(val);
    })
    console.log('list : ', list.data)
    // this.dataSource = new MatTableDataSource<PeriodicElement>(list);
    this.idNumberHandler(list);
  }

  countryFlagHandler(list) {
    let foundLink = '';
    countries.forEach(country => {
      if (list.country === country.name) {
        foundLink = `../../../../assets/flags/${country.code}.svg`;
      }
    })
    return foundLink;
  }
  getFlag(countryName) {
    let foundLink = '';
    countries.forEach(country => {
      if (countryName === country.name) {
        foundLink = `./../../../../assets/flags/${country.code}.svg`;
      }
    })
    return foundLink;
  }

  /** Whether the number of selected elements matches the total number of rows. */
  isAllSelected() {
    const numSelected = this.selection.selected.length;
    const numRows = this.allCandidateData.data.length;
    this.selectedAllIds = this.allCandidateData.data.map(item => {
      return item._id
    })
    console.log(this.selectedAllIds)
    console.log(numRows)
    return numSelected === numRows;
  }

  /** Selects all rows if they are not all selected; otherwise clear selection. */
  masterToggle() {
    if (this.isAllSelected()) {
      this.selection.clear();
      return;
    }
    this.selection.select(...this.allCandidateData.data);
    console.log("Selected", this.selection.select(...this.allCandidateData.data))
  }

  /** The label for the checkbox on the passed row */
  checkboxLabel(row?: any): any {
    if (!row) {
      return `${this.isAllSelected() ? 'deselect' : 'select'} all`;
    }
    return `${this.selection.isSelected(row) ? 'deselect' : 'select'} row`;
  }

  idNumberHandler(tempData) {
    console.log(tempData)
    tempData.data.map((src: any) => {
      let totalLength = src.idNumber.length;
      console.log(src.idNumber + ' - ' + src.idNumber.substring(0, 6) + ' - ' + totalLength);
      let firstSixCharacters = src.idNumber.substring(0, 6) + 'X'.repeat(totalLength - 6);
      src.idNumber = firstSixCharacters;
    })
    this.allCandidateData = new MatTableDataSource<any>(tempData.data);
  }

  deleteCandidate(element) {
    if (confirm("Are you sure you want to delete this candidate?")) {
      this.apollo
        .mutate({
          mutation: REMOVE_CANDIDATE,
          variables: {
            id: element._id,
          }
        }).subscribe((data) => {
          console.log(data)
          
          this.candidateList()
          //  this.candidateList();
          // if (data.data['removeCandidate'] == "Candidate deleted successfully") {
            var index = this.allCandidateData.data.map(x => {
              return x._id;
            }).indexOf(element._id);
            this.allCandidateData.data.splice(index, 1);
          // }
        }, (error) => {
          console.log('there was an error sending the query', error);
        });
    }
  }

  deleteAllCandidates() {
    this.apollo
      .mutate({
        mutation: REMOVE_ALL_CANDIDATE,
        variables: {
          id: this.selectedAllIds,
        }
      }).subscribe((data) => {
        console.log(data)
      }, (error) => {
        console.log('there was an error sending the query', error);
      });
  }

  // openDialog() {
  //   debugger
  //   const dialogRef = this.dialog.open(CandidateModalComponent, {
  //     height: '754px',
  //     width: '800px',
  //     // data: {
  //     //   candidateData: { name: 'candidate' }
  //     // }
  //   });

  //   // dialogRef.afterClosed().subscribe(result => {
  //     // console.log(`Dialog result: ${result}`);
  //   // });
  // }

  openDialog(element?) {
    const dialogRef = this.dialog.open(CandidateModalComponent, {
      height: '754px',
      width: '800px',
      data: {
        candidateData: { element }
      }
    });
    console.log(element)
  }

}
