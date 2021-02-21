import { Injectable } from "@angular/core";


@Injectable()
export class ConstantsService {

  constructor(
  ) {
  }

  public lodgingTypes = [
    {text: 'Flat', value: '0'},
    {text: 'House/Apartment', value: '1'},
    {text: 'Paying guest', value: '2'},
    {text: 'Room(s)', value: '3'},
    {text: 'Other', value: '4'},
  ];

  public tags = [
    {text: 'Bedroom', value: '0'},
    {text: 'Hall', value: '1'},
    {text: 'Balcony', value: '2'},
    {text: 'Living Room', value: '3'},
    {text: 'Entrance', value: '4'},
    {text: 'Kitchen', value: '5'},
    {text: 'Bathroom', value: '6'},
    {text: 'Building', value: '7'},
    {text: 'Floor', value: '8'},
    {text: 'Outside View', value: '9'},
    {text: 'Dining Room', value: '10'},
    {text: 'Other', value: '11'}
  ];

  public furnishingTypes = [
    {text: 'Furnished', value: '0'},
    {text: 'Semi-furnished', value: '1'},
    {text: 'Un-furnished', value: '2'}
  ];

  public facilities = [
    {'text': 'Kitchen', value: '0'},
    {'text': 'Parking', value: '1'},
    {'text': 'Air conditioner', value: '2'}
  ]
  
}
