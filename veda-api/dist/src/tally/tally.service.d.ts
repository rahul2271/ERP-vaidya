import { Model } from 'mongoose';
import { Inventory } from '../inventory/schemas/inventory.schema';
import { Appointment } from '../appointments/schemas/appointment.schema';
import { HospitalsService } from '../hospitals/hospitals.service';
export declare class TallyService {
    private inventoryModel;
    private appointmentModel;
    private readonly hospitalsService;
    constructor(inventoryModel: Model<Inventory>, appointmentModel: Model<Appointment>, hospitalsService: HospitalsService);
    private assertPremium;
    private getTallyConfig;
    private postToTally;
    testConnection(hospitalId: string): Promise<{
        connected: boolean;
        message: string;
    }>;
    pullStockItemsFromTally(hospitalId: string): Promise<{
        count: number;
        items: {
            name: any;
            parent: any;
            closingBalance: any;
            closingRate: any;
            closingValue: any;
            unit: any;
        }[];
    }>;
    private escapeXml;
    private tallyDate;
    exportStockItems(hospitalId: string): Promise<string>;
    exportSalesVouchers(hospitalId: string, startDate: string, endDate: string): Promise<string>;
    pushSalesVouchersLive(hospitalId: string, startDate: string, endDate: string): Promise<{
        created: number;
        errors: number;
        rawResponse: string;
    }>;
    private wrapEnvelope;
}
