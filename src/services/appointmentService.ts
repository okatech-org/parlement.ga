// Mock appointment service using localStorage (tables don't exist in Supabase yet)

export interface Appointment {
    id: string;
    organization_id?: string;
    citizen_id?: string;
    service_id?: string;
    appointment_date: string;
    status: 'pending' | 'confirmed' | 'cancelled' | 'completed';
    notes?: string;
    created_at: string;
    updated_at: string;
}

export type AppointmentStatus = Appointment["status"];

const STORAGE_KEY = 'mock_appointments';

function getStoredAppointments(): Appointment[] {
    const stored = localStorage.getItem(STORAGE_KEY);
    return stored ? JSON.parse(stored) : [];
}

function saveAppointments(appointments: Appointment[]): void {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(appointments));
}

export const appointmentService = {
    async getAll(filters?: { organizationId?: string; citizenId?: string; date?: string }): Promise<Appointment[]> {
        let appointments = getStoredAppointments();
        
        if (filters?.organizationId) {
            appointments = appointments.filter(a => a.organization_id === filters.organizationId);
        }
        if (filters?.citizenId) {
            appointments = appointments.filter(a => a.citizen_id === filters.citizenId);
        }
        if (filters?.date) {
            appointments = appointments.filter(a => a.appointment_date.startsWith(filters.date));
        }
        
        return appointments.sort((a, b) => 
            new Date(a.appointment_date).getTime() - new Date(b.appointment_date).getTime()
        );
    },

    async getById(id: string): Promise<Appointment | null> {
        const appointments = getStoredAppointments();
        return appointments.find(a => a.id === id) || null;
    },

    async create(appointment: Omit<Appointment, 'id' | 'created_at' | 'updated_at'>): Promise<Appointment> {
        const appointments = getStoredAppointments();
        const now = new Date().toISOString();
        const newAppointment: Appointment = {
            ...appointment,
            id: crypto.randomUUID(),
            created_at: now,
            updated_at: now
        };
        appointments.push(newAppointment);
        saveAppointments(appointments);
        return newAppointment;
    },

    async updateStatus(id: string, status: AppointmentStatus): Promise<Appointment> {
        const appointments = getStoredAppointments();
        const index = appointments.findIndex(a => a.id === id);
        if (index === -1) throw new Error('Appointment not found');
        
        appointments[index] = {
            ...appointments[index],
            status,
            updated_at: new Date().toISOString()
        };
        saveAppointments(appointments);
        return appointments[index];
    },

    async update(id: string, updates: Partial<Appointment>): Promise<Appointment> {
        const appointments = getStoredAppointments();
        const index = appointments.findIndex(a => a.id === id);
        if (index === -1) throw new Error('Appointment not found');
        
        appointments[index] = {
            ...appointments[index],
            ...updates,
            updated_at: new Date().toISOString()
        };
        saveAppointments(appointments);
        return appointments[index];
    },

    async delete(id: string): Promise<void> {
        const appointments = getStoredAppointments();
        const filtered = appointments.filter(a => a.id !== id);
        saveAppointments(filtered);
    }
};
