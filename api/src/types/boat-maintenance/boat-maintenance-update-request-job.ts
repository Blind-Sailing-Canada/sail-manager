import { BoatMaintenance } from "./boat-maintenance";

export interface BoatMaintenanceUpdateJob {
  maintenance_id: string,
  updated_by_username: string,
  current_maintenance: BoatMaintenance,
  updated_maintenance: Partial<BoatMaintenance>,
  updated_at: string,
}
