import { Component } from '@angular/core';
import { AbstractControl, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ReservationService } from '../reservation/reservation.service';
import { Reservation } from '../models/reservation';
import { ActivatedRoute, Router } from '@angular/router';

@Component({
  selector: 'app-reservation-form',
  templateUrl: './reservation-form.component.html',
  styleUrls: ['./reservation-form.component.css']
})
export class ReservationFormComponent {
  reservationForm: FormGroup = new FormGroup({});

  constructor(private formBuilder: FormBuilder, private reservationService: ReservationService, private router: Router, private activatedRoute: ActivatedRoute) {


  }

  ngOnInit(): void {
    this.reservationForm = this.formBuilder.group({
      checkInDate: ['', Validators.required],
      checkOutDate: ['', [Validators.required]],
      guestName: ['', Validators.required],
      guestEmail: ['', [Validators.required, Validators.email]],
      roomNumber: ['', Validators.required],
    }, { validators: this.dateValidator });

    const id = this.activatedRoute.snapshot.paramMap.get('id');
    if (id) {
      const reservation = this.reservationService.getReservation(id);
      if (reservation) {
        this.reservationForm.patchValue({ ...reservation });
      }
    }
  }

  dateValidator(group: AbstractControl): { [key: string]: boolean } | null {
    const checkInDate = group.get('checkInDate')?.value;
    const checkOutDate = group.get('checkOutDate')?.value;

    if (checkInDate && checkOutDate && new Date(checkOutDate) <= new Date(checkInDate)) {
      console.log('Invalid date range:', checkInDate, checkOutDate);
      return { invalidDateRange: true };
    }
    console.log('Valid date range:', checkInDate, checkOutDate);
    return null;
  }

  onSubmit(): void {
    if (!this.reservationForm.valid) {
      return;
    }

    let reservation: Reservation = this.reservationForm.value;
    let id = this.activatedRoute.snapshot.paramMap.get('id');
    if (id) {
      reservation.id = id;
      this.reservationService.updateReservation(id, reservation);
      alert('Reservation updated successfully!');
    } else {
      this.reservationService.addReservation(reservation);
      alert('Reservation added successfully!');
      this.reservationForm.reset();
    }


    this.router.navigate(['/list']); // Navigate to the reservation list page
  }
}
