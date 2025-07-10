// Define types based on the API response structure
export interface ParkingSpotDTO {
  spotNumber: string;
  status: "AVAILABLE" | "OCCUPIED";
  currentVehicle: string | null;
  location: string | null;
}

// Convert API DTO to our internal model
export interface ParkingSpot {
  spotId: number;
  spotNumber: string;
  level: number;
  section: string;
  occupied: boolean;
  vehicleData?: {
    licensePlate: string;
    entryTime: string;
  };
}

class ParkingApiClient {
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
  
  // Get all parking spots
  async getAllParkingSpots(): Promise<ParkingSpot[]> {
    const response = await this.fetchWithAuth('/parking/spots');
    const data: ParkingSpotDTO[] = await response.json();
    
    // Transform DTO to our internal model
    return data.map((dto, index) => this.mapDtoToSpot(dto, index));
  }
  
  // Get count of available spots
  async getAvailableSpotsCount(): Promise<number> {
    const response = await this.fetchWithAuth('/parking/spots/available');
    return await response.json();
  }
  
  // Create a new parking spot
  async createParkingSpot(spot: Omit<ParkingSpotDTO, "id">): Promise<ParkingSpotDTO> {
    const response = await this.fetchWithAuth('/parking/spots', {
      method: 'POST',
      body: JSON.stringify(spot)
    });
    
    return await response.json();
  }
  
  // Park a vehicle in a spot
  async parkVehicle(spotNumber: string, licensePlate: string): Promise<void> {
    await this.fetchWithAuth(`/parking/park`, {
      method: 'POST',
      body: JSON.stringify({ licensePlate,spotNumber })
    });
  }
  
  // Release a vehicle from a spot
  async releaseVehicle(spotNumber: string): Promise<void> {
    await this.fetchWithAuth(`/parking/release/${spotNumber}`, {
      method: 'POST'
    });
  }
  
  // Helper method to map DTO to internal model - now handles null location safely
  private mapDtoToSpot(dto: ParkingSpotDTO, index: number): ParkingSpot {
    // Extract level and section from location (handling null values safely)
    const locationMatch = dto.location?.match(/Level (\d+) - Section ([A-Z])/i);
    const level = locationMatch ? parseInt(locationMatch[1]) : 1;
    const section = locationMatch ? locationMatch[2] : "A";
    
    return {
      spotId: index + 1, // Generate ID if not provided
      spotNumber: dto.spotNumber,
      level: level,
      section: section,
      occupied: dto.status === "OCCUPIED",
      vehicleData: dto.currentVehicle ? {
        licensePlate: dto.currentVehicle,
        entryTime: new Date().toISOString() // Assuming backend doesn't provide entry time
      } : undefined
    };
  }
}

// Create and export a singleton instance
export const parkingApi = new ParkingApiClient();
export default parkingApi;