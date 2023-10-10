class Office {
    constructor(id, surface, capacity, employees, sensorOffices) {
      this.id = id || new Id();
      this.surface = surface;
      this.capacity = capacity;
      this.employees = employees || []; 
      this.sensorOffices = sensorOffices || [];
    }
}

class Id {
  constructor(buildingId, officeId) {
    this.buildingId = buildingId;
    this.officeId = officeId;
  }
}