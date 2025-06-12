// appointment-period.model.ts

export interface AppointmentPeriod {
  appointmentDTO: Appointment;
  periodDTO: Period;
}

export interface Appointment {
  appointmentDate?: Date;
  examType?: string;
  passFail?: string;
}

export interface Period {
  startingTime?: string;
  endTime?: string;
  amharic?: string;
}
