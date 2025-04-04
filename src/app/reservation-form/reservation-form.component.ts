import { Component } from '@angular/core';
import { AbstractControl, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ReservationService } from '../reservation/reservation.service';
import { Reservation } from '../models/reservation';

@Component({
  selector: 'app-reservation-form',
  templateUrl: './reservation-form.component.html',
  styleUrls: ['./reservation-form.component.css']
})
export class ReservationFormComponent {
  reservationForm: FormGroup = new FormGroup({});

  constructor(private formBuilder: FormBuilder, private reservationService: ReservationService) {

  }

  ngOnInit(): void {
    this.reservationForm = this.formBuilder.group({
      checkInDate: ['', Validators.required],
      checkOutDate: ['', [Validators.required]],
      guestName: ['', Validators.required],
      guestEmail: ['', [Validators.required, Validators.email]],
      roomNumber: ['', Validators.required],
    }, { validators: this.dateValidator});
  }

  dateValidator(group: AbstractControl): { [key: string]: boolean } | null {
    const checkInDate = group.get('checkInDate')?.value;
    const checkOutDate = group.get('checkOutDate')?.value;

    if (checkInDate && checkOutDate && new Date(checkOutDate) <= new Date(checkInDate)) {
      return { invalidDateRange: true };
    }
    return { invalidDateRange: false };
  }

  onSubmit(): void {
    if (!this.reservationForm.valid) {
      return;
    } 

    let reservation: Reservation = this.reservationForm.value;
    reservation.id = Math.random().toString(36).substring(2, 15); // Generate a random ID
    this.reservationService.addReservation(reservation);
  }
}
