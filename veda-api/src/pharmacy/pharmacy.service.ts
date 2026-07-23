import { 
  Injectable, 
  BadRequestException, 
  InternalServerErrorException 
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { PharmacySale, PharmacySaleDocument } from './schemas/pharmacy-sale.schema';
import { Inventory } from '../inventory/schemas/inventory.schema';

@Injectable()
export class PharmacyService {
  constructor(
    @InjectModel(PharmacySale.name) private pharmacySaleModel: Model<PharmacySaleDocument>,
    @InjectModel(Inventory.name) private inventoryModel: Model<any>,
  ) {}

  // 1. PROCESS A NEW SALE & DEDUCT INVENTORY
  async createSale(saleData: any, user: any) {
    try {
      const hospitalId = user?.hospitalId || saleData.hospitalId;
      if (!hospitalId) throw new BadRequestException('Hospital ID is required.');

      // Step A: Pre-Check all stock first (prevents partial deductions)
      for (const item of saleData.items) {
        const product = await this.inventoryModel.findById(item.inventoryId);
        
        if (!product) {
          throw new BadRequestException(`Product ${item.name} not found in inventory.`);
        }
        if (product.quantity < item.quantity) {
          throw new BadRequestException(`Not enough stock for ${item.name}. Only ${product.quantity} left.`);
        }
      }

      // Step B: Safely deduct the stock now that we know we have enough
      for (const item of saleData.items) {
        await this.inventoryModel.findByIdAndUpdate(
          item.inventoryId, 
          { $inc: { quantity: -item.quantity } } 
        );
      }

      // Step C: Save the official Pharmacy Bill
      const newSale = new this.pharmacySaleModel({
        ...saleData,
        hospitalId,
        soldBy: user?.userId || new Types.ObjectId(),
        paymentStatus: 'PAID' 
      });

      return await newSale.save();

    } catch (error: any) {
      throw new InternalServerErrorException(error.message);
    }
  }

  // 2. GET DAILY PHARMACY SETTLEMENT
  async getDailySettlement(hospitalId: string, date: string) {
    const start = new Date(date);
    start.setHours(0, 0, 0, 0);
    const end = new Date(date);
    end.setHours(23, 59, 59, 999);

    const todaysSales = await this.pharmacySaleModel.find({
      hospitalId,
      createdAt: { $gte: start, $lte: end }
    }).exec();

    const settlement = { UPI: 0, CASH: 0, CARD: 0, TOTAL: 0, TOTAL_BILLS: todaysSales.length };

    todaysSales.forEach(sale => {
      settlement.TOTAL += sale.grandTotal;
      const mode = sale.paymentMode?.toUpperCase() || 'CASH';
      
      if (mode === 'UPI') settlement.UPI += sale.grandTotal;
      else if (mode === 'CASH') settlement.CASH += sale.grandTotal;
      else if (mode === 'CARD') settlement.CARD += sale.grandTotal;
    });

    return settlement;
  }

  // 3. GET ALL SALES HISTORY
  async getAllSales(hospitalId: string) {
    return this.pharmacySaleModel.find({ hospitalId })
      .populate('soldBy', 'name') // Gets the Pharmacist's name
      .populate('patientId', 'name mobile')
      // 🚀 NEW: Fetch the actual Hospital details!
      .populate('hospitalId', 'name address phone') 
      .sort({ createdAt: -1 }) 
      .exec();
  }
}