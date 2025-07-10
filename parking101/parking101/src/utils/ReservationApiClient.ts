// ReservationsApiClient.ts
// API client for reservations management

// Define types based on the API response structure
export interface ReservationDTO {
    id: number;
    startTime: string;
    endTime: string;
    status: "PENDING" | "ACTIVE" | "SCHEDULED" | "COMPLETED" | "CANCELLED";
    spot: {
      spotId: number;
      spotNumber: string;
      status: string;
      currentVehicle: string;
      location: string;
      reservations: string[];
    };
    driverId: string;
    createdAt: string;
    updatedAt: string;
    totalPrice: number;
    durationInHours: number;
  }
  
  // Define the request payload for creating a reservation
  export interface CreateReservationDTO {
    startTime: string;
    endTime: string;
    status: "PENDING" | "ACTIVE" | "SCHEDULED" | "COMPLETED" | "CANCELLED";
    spotId: number;
    driverId: number;
  }
  
  // Define search parameters interface
  export interface SearchReservationsParams {
    driverName?: string;
    licensePlate?: string;
    spotNumber?: string;
    startDate?: string;
    endDate?: string;
    status?: string;
  }
  
  // Convert API DTO to our internal model
  export interface Reservation {
    id: number;
    spotNumber: string;
    spotId: number;
    driverName: string;
    driverId: string;
    licensePlate: string;
    startTime: string;
    endTime: string;
    status: "PENDING" | "ACTIVE" | "SCHEDULED" | "COMPLETED" | "CANCELLED";
    createdAt: string;
    updatedAt: string;
    totalPrice: number;
    durationInHours: number;
  }
  
  class ReservationsApiClient {
    private baseUrl: string;
    
    constructor(baseUrl: string = 'http://localhost:8080/api') {
      this.baseUrl = baseUrl;
    }
    
    // Helper method to get auth headers
    private getAuthHeaders(): HeadersInit {
      const token = localStorage.getItem('token') || '';
      return {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json',
        'Accept': '*/*'
      };
    }
    
    // Helper method to handle common fetch tasks
    private async fetchWithAuth(endpoint: string, options: RequestInit = {}): Promise<Response> {
      const url = `${this.baseUrl}${endpoint}`;
      const headers = this.getAuthHeaders();
      
      const response = await fetch(url, {
        ...options,
        headers: {
          ...options.headers,
          ...headers
        }
      });
      
      // Handle authentication errors
      if (response.status === 401 || response.status === 403) {
        localStorage.removeItem('token');
        throw new Error('Authentication failed. Please login again.');
      }
      
      if (!response.ok) {
        throw new Error(`API error: ${response.status} ${response.statusText}`);
      }
      
      return response;
    }
    
    // Get all reservations
    async getAllReservations(): Promise<Reservation[]> {
      const response = await this.fetchWithAuth('/reservations');
      const data: ReservationDTO[] = await response.json();
      
      // Transform DTO to our internal model
      return data.map((dto) => this.mapDtoToReservation(dto));
    }
    
    // Get a specific reservation by ID
    async getReservation(id: number): Promise<Reservation> {
      const response = await this.fetchWithAuth(`/reservations/${id}`);
      const data: ReservationDTO = await response.json();
      
      return this.mapDtoToReservation(data);
    }
    
    // Create a new reservation
    async createReservation(reservation: CreateReservationDTO): Promise<Reservation> {
      const response = await this.fetchWithAuth('/reservations', {
        method: 'POST',
        body: JSON.stringify(reservation)
      });
      
      const data: ReservationDTO = await response.json();
      return this.mapDtoToReservation(data);
    }
    
    // Update a reservation status
    async updateReservationStatus(id: number, status: string): Promise<Reservation> {
      const response = await this.fetchWithAuth(`/reservations/${id}/status`, {
        method: 'PATCH',
        body: JSON.stringify({ status })
      });
      
      const data: ReservationDTO = await response.json();
      return this.mapDtoToReservation(data);
    }
    
    // Cancel a reservation
    async cancelReservation(id: number): Promise<void> {
      await this.fetchWithAuth(`/reservations/${id}/cancel`, {
        method: 'POST'
      });
    }
    
    // Get reservations for a specific driver
    async getDriverReservations(driverId: string): Promise<Reservation[]> {
      const response = await this.fetchWithAuth(`/reservations/driver/${driverId}`);
      const data: ReservationDTO[] = await response.json();
      
      return data.map((dto) => this.mapDtoToReservation(dto));
    }
    
    // Get reservations for a specific spot
    async getSpotReservations(spotId: number): Promise<Reservation[]> {
      const response = await this.fetchWithAuth(`/reservations/spot/${spotId}`);
      const data: ReservationDTO[] = await response.json();
      
      return data.map((dto) => this.mapDtoToReservation(dto));
    }
    
    // Search for reservations with multiple criteria
    async searchReservations(params: SearchReservationsParams): Promise<Reservation[]> {
      // Build query string from search parameters
      const queryParams = new URLSearchParams();
      
      if (params.driverName) {
        queryParams.append('driverName', params.driverName);
      }
      
      if (params.licensePlate) {
        queryParams.append('licensePlate', params.licensePlate);
      }
      
      if (params.spotNumber) {
        queryParams.append('spotNumber', params.spotNumber);
      }
      
      if (params.startDate) {
        queryParams.append('startDate', params.startDate);
      }
      
      if (params.endDate) {
        queryParams.append('endDate', params.endDate);
      }
      
      if (params.status) {
        queryParams.append('status', params.status);
      }
      
      const queryString = queryParams.toString();
      const endpoint = queryString ? `/reservations/search?${queryString}` : '/reservations/search';
      
      const response = await this.fetchWithAuth(endpoint);
      const data: ReservationDTO[] = await response.json();
      
      return data.map((dto) => this.mapDtoToReservation(dto));
    }
    
    // Helper method to map DTO to internal model
    private mapDtoToReservation(dto: ReservationDTO): Reservation {
      // This is a simplification - in a real app, we'd need to fetch driver details
      // from another endpoint or include it in the reservation response
      const driverName = `Driver ${dto.driverId.substring(0, 5)}`;
      const licensePlate = dto.spot.currentVehicle || 'N/A';
      
      return {
        id: dto.id,
        spotNumber: dto.spot.spotNumber,
        spotId: dto.spot.spotId,
        driverName,
        driverId: dto.driverId,
        licensePlate,
        startTime: dto.startTime,
        endTime: dto.endTime,
        status: dto.status,
        createdAt: dto.createdAt,
        updatedAt: dto.updatedAt,
        totalPrice: dto.totalPrice,
        durationInHours: dto.durationInHours
      };
    }
  }
  
  // Create and export a singleton instance
  export const reservationsApi = new ReservationsApiClient();
  export default reservationsApi;