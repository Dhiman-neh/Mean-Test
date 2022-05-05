import { GoogleAddressService } from './../../../../services/google-address.service';
import { Component, Inject, Input, OnInit, ViewChild } from '@angular/core';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { NgForm } from "@angular/forms";
import { GooglePlaceDirective } from 'ngx-google-places-autocomplete';
import { Address } from 'ngx-google-places-autocomplete/objects/address';
import { countries } from 'src/shared/countries';
import { Country, State, City } from 'country-state-city';
import { getStatesOfCountry } from 'country-state-city/dist/lib/state';
import { SearchCountryField, CountryISO, PhoneNumberFormat } from 'ngx-intl-tel-input';
import { countryISOFindHandler } from './countryISOFind';
import { Apollo, gql } from 'apollo-angular';

declare var google: any;
const CREATE_CANDIDATE = gql`
mutation (
  $addressLine1:String!,
  $addressLine2: String!,
  $city: String!,
  $country:String!,
  $postalCode: Int!,
  $province:String!,
  $email: String!,
  $firstName: String!,
  $identityNumber: String!,
  $lastName: String!,
  $mobileNumber: String!,
  $facebook: String!
  $linkedIn: String!
  $twitter: String!
){
  createCandidate(createCandidateInput:{
    firstName: $firstName,
    lastName: $lastName,
    identityNumber: $identityNumber,
		email: $email,
    mobileNumber: $mobileNumber,
    address: {
      addressLine1: $addressLine1,
      addressLine2: $addressLine2,
      city: $city,
      province: $province,
      country: $country,
      postalCode: $postalCode
    }
		socialMediaLinks:{
			facebook: $facebook,
      linkedIn: $linkedIn,
      twitter: $twitter 
		}
  })
  {
    firstName
    lastName
    email
    identityNumber
    mobileNumber
    address{
    addressLine1
    addressLine2
    city
    province
    country
    postalCode},
    socialMediaLinks{
			facebook
		}
  }
      }`;

const UPDATE_CANDIDATE = gql`
mutation updateCandidate(
  $id:String!,
  $addressLine1:String!,
  $addressLine2: String!,
  $city: String!,
  $country:String!,
  $postalCode: Int!,
  $province:String!,
  $email: String!,
  $firstName: String!,
  $identityNumber: String!,
  $lastName: String!,
  $mobileNumber: String!,
  $facebook: String!
  $linkedIn: String!
  $twitter: String!
){
  updateCandidate(updateCandidateInput:{
    id:$id,
    firstName: $firstName,
    lastName: $lastName,
    identityNumber: $identityNumber,
		email: $email,
    mobileNumber: $mobileNumber,
    address: {
      addressLine1: $addressLine1,
      addressLine2: $addressLine2,
      city: $city,
      province: $province,
      country: $country,
      postalCode: $postalCode
    }
		socialMediaLinks:{
			facebook: $facebook,
      linkedIn: $linkedIn,
      twitter: $twitter 
		}
  })
  {
     _id
    firstName
    lastName
    email
    identityNumber
    mobileNumber
    address{
    addressLine1
    addressLine2
    city
    province
    country
    postalCode},
    socialMediaLinks{
			facebook
      linkedIn
      twitter
		}
  }
      }`;
@Component({
  selector: 'app-candidate-modal',
  templateUrl: './candidate-modal.component.html',
  styleUrls: ['./candidate-modal.component.scss']
})
export class CandidateModalComponent implements OnInit {
  patchFirstName: any;
  firstName = '';
  lastName = ''
  emailAddress = '';
  phoneNumber = null;
  identityNumber = null;
  identityNumberCheck = false;
  address1 = null;
  country = 'country';
  address2 = null;
  city = 'city';
  province = 'province';
  postalCode = null;
  linkedInProfile = null;
  facebookProfile = null;
  twitterProfile = null;
  submitted = false;
  countriesList = [];
  cityList = [];
  provinceLilst = [];
  separateDialCode = false;
  SearchCountryField = SearchCountryField;
  CountryISO = CountryISO;
  PhoneNumberFormat = PhoneNumberFormat;
  selectedPhoneCountry = '';
  editCandidateData: any;
  @ViewChild('placesRef') placesRef: GooglePlaceDirective;

  constructor(@Inject(MAT_DIALOG_DATA) public data: any, private matDialog: MatDialog, private apollo: Apollo, private googleAddressService: GoogleAddressService) {
    console.log('DATA : ', data.candidateData.element)
    this.editCandidateData = data.candidateData.element
  }

  ngOnInit(): void {
    let tempCountries = Country.getAllCountries().filter(country => country.name !== 'Aland Islands' && country.name !== 'Antarctica' && country.name !== "Bouvet Island" && country.name !== "East Timor" && country.name !== "French Southern Territories" && country.name !== "Heard Island and McDonald Islands" && country.name !== "Korea North" && country.name !== "Korea South" && country.name !== "Man (Isle of)" && country.name !== "Bonaire, Sint Eustatius and Saba" && country.name !== "Palestinian Territory Occupied" && country.name !== "Pitcairn Island" && country.name !== "Reunion" && country.name !== "Saint-Barthelemy" && country.name !== "Saint-Martin" && country.name !== "Sao Tome and Principe" && country.name !== "Virgin Islands (British)" && country.name !== "Virgin Islands (US)")
    this.countriesList = tempCountries;
    this.selectedPhoneCountry = CountryISO.SouthAfrica;
    this.getLocation();
    if (this.data) {
      this.firstName = this.editCandidateData.firstName,
        this.lastName = this.editCandidateData.lastName,
        this.identityNumber = this.editCandidateData.identityNumber,
        this.emailAddress = this.editCandidateData.email,
        this.phoneNumber = this.editCandidateData.mobileNumber,
        this.country = this.editCandidateData.address.country,
        this.address2 = this.editCandidateData.address.addressLine2,
        this.province = this.editCandidateData.address.province,
        this.city = this.editCandidateData.address.city,
        this.postalCode = this.editCandidateData.address.postalCode,
        this.city = this.editCandidateData.address.city,
        this.address1 = this.editCandidateData.address.addressLine1,
        this.facebookProfile = this.editCandidateData.socialMediaLinks.facebook,
        this.linkedInProfile = this.editCandidateData.socialMediaLinks.linkedIn,
        this.twitterProfile = this.editCandidateData.socialMediaLinks.twitter
    }
  }

  reverseGeocodingWithGoogle(latitude, longitude) {
    var geocoder;
    geocoder = new google.maps.Geocoder();
    var latlng = new google.maps.LatLng(latitude, longitude);
    geocoder.geocode(
      { 'latLng': latlng },
      function (results, status) {
        if (status == google.maps.GeocoderStatus.OK) {
          if (results[0]) {
            var add = results[0].formatted_address;
            var value = add.split(",");
            let count = value.length;
            let country = value[count - 1];
            let state = value[count - 2];
            let city = value[count - 3];
          }
          else {
            console.log('not found');
          }
        }
        else {
          console.log("Geocoder failed due to: " + status);
        }
      }
    );
  }

  countryChangeHandler(e) {
    console.log('COUNTRY CHANGE:  ', e);
    let replaced = e.split(' ').join('').toLowerCase();
    console.log('REPLACED : : : ', replaced);
    let countryISOFind = countryISOFindHandler(replaced);
    this.selectedPhoneCountry = countryISOFind;
    console.log('COUNTRY LIST : ', this.countriesList)
    let selectedCountry = this.countriesList.filter(val => val.name === e);
    console.log('Selected Country : ', selectedCountry)
    this.cityList = getStatesOfCountry(selectedCountry[0].isoCode);
  }

  getLocation() {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(position => {
        if (position) {
          fetch('https://jsonip.com')
            .then(res => res.json())
            .then(ip => {
              fetch(`https://ipapi.co/${ip.ip}/json/`)
                .then(ipRes => ipRes.json())
                .then(ipData => {
                  let code = ipData.country_name.replace(' ', '').toLowerCase();
                  this.selectedPhoneCountry = CountryISO.SouthAfrica;
                  let countryISOFind = countryISOFindHandler(code);
                  this.selectedPhoneCountry = countryISOFind;
                })
                .catch(err => this.selectedPhoneCountry = CountryISO.SouthAfrica);
            })
            .catch(err => this.selectedPhoneCountry = CountryISO.SouthAfrica);
        }
      },
        (error) => console.log(error));
      this.selectedPhoneCountry = CountryISO.SouthAfrica;
    } else {
      this.selectedPhoneCountry = CountryISO.SouthAfrica;
    }
  }

  changePhoneHandler() {
    this.selectedPhoneCountry = CountryISO.Australia;
  }

  luhnCheck(num) {
    let arr = (num + '')
      .split('')
      .reverse()
      .map(x => parseInt(x));
    let lastDigit = arr.splice(0, 1)[0];
    let sum = arr.reduce((acc, val, i) => (i % 2 !== 0 ? acc + val : acc + ((val * 2) % 9) || 9), 0);
    sum += lastDigit;
    return sum % 10 === 0;
  };

  identityNumberHandler() {
    this.identityNumberCheck = this.luhnCheck(this.identityNumber);
  }

  async getPlacesPostCodeById(placeId) {
    new Promise((resolve, reject) => {
      if (!placeId) reject("placeId not provided")
      try {
        new google.maps.places.PlacesService(
          document.createElement("div")
        ).getDetails(
          {
            placeId,
            fields: ["address_components"],
          },
          details => {
            let postcode = null
            details?.address_components?.forEach(entry => {
              if (entry.types?.[0] === "postal_code") {
                postcode = entry.long_name
              }
            })
            return resolve(postcode)
          }
        )
      } catch (e) {
        reject(e)
      }
    })
  }

  async handleAddressChange(address: Address) {
    this.postalCode = this.googleAddressService.getPostCode(address);
    this.country = this.googleAddressService.getCountry(address);
    this.city = this.googleAddressService.getState(address);
    this.province = this.googleAddressService.getDistrict(address);
    this.cityList = getStatesOfCountry(this.googleAddressService.getCountryShort(address));
    let cityCode = this.cityList.filter(val => this.city === val.name).map(val => val.isoCode);
    this.provinceLilst = City.getCitiesOfState(this.googleAddressService.getCountryShort(address), cityCode[0]);
  }

  onSubmit(form: NgForm) {
    this.submitted = true;
    if (form.invalid) {
      return;
    }
  }

  getNumber($event) {
    console.log($event)
  }

  hasError(e) {
    console.log(e)
  }

  onCountryChange(e) {
    console.log(e)
  }

  telInputObject($event) {
    console.log($event)
    $event.setCountry('in');
  }

  cityChangeHandler(city) {
    console.log('CITY : ', city)
    console.log('City List : ', this.cityList)
    let filteredCity = this.cityList.filter(val => val.name === city);
    let selectedCountry = this.countriesList.filter(val => val.name === this.country);
    this.provinceLilst = City.getCitiesOfState(selectedCountry[0].isoCode, filteredCity[0].isoCode);
  }

  saveCandidate() {
    if (this.identityNumber.length < 13) {
      alert("Please enter 13 digit valid identity Number")
    }
    else {
      this.apollo
        .mutate({
          mutation: CREATE_CANDIDATE,
          variables: {
            email: this.emailAddress,
            firstName: this.firstName,
            lastName: this.lastName,
            identityNumber: this.identityNumber,
            mobileNumber: this.phoneNumber.e164Number,
            country: this.country,
            addressLine2: this.address2,
            city: this.city,
            province: this.province,
            postalCode: parseInt(this.postalCode),
            addressLine1: this.address1,
            facebook: this.facebookProfile,
            linkedIn: this.linkedInProfile,
            twitter: this.twitterProfile
          }
          // variables:userData
        }).subscribe((data) => {
          // console.log(data)
          this.matDialog.closeAll();
          location.reload()
        }, (error) => {
          console.log('there was an error sending the query', error);
        });
    }
  }

  closeDialog() {
    this.matDialog.closeAll();
  }

  updateCandidate() {
    if (this.identityNumber.length < 13) {
      alert("Please enter 13 digit valid identity Number")
    }
    else {
      this.apollo
        .mutate({
          mutation: UPDATE_CANDIDATE,
          variables: {
            id: this.editCandidateData._id,
            email: this.emailAddress,
            firstName: this.firstName,
            lastName: this.lastName,
            identityNumber: this.identityNumber,
            mobileNumber: this.phoneNumber.e164Number,
            country: this.country,
            addressLine2: this.address2,
            city: this.city,
            province: this.province,
            postalCode: parseInt(this.postalCode),
            addressLine1: this.address1,
            facebook: this.facebookProfile,
            linkedIn: this.linkedInProfile,
            twitter: this.twitterProfile
          }
        }).subscribe((data) => {
          this.matDialog.closeAll();
          location.reload()
        }, (error) => {
          console.log('there was an error sending the query', error);
        });
    }
  }

}
