import { 
  Injectable, 
  NotFoundException, 
  BadRequestException, 
  InternalServerErrorException 
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { Inventory } from './schemas/inventory.schema';
import { InventoryHistory } from './schemas/inventory-history.schema';

@Injectable()
export class InventoryService {
  constructor(
    @InjectModel(Inventory.name) private inventoryModel: Model<Inventory>,
    @InjectModel(InventoryHistory.name) private historyModel: Model<InventoryHistory> 
  ) {}

  /**
   * ✅ CREATE: Add new medicine and log initial stock
   */
  async create(createDto: any, user: any) {
    try {
      const parsedQuantity = Number(createDto.quantity) || 0;
      const parsedPrice = Number(createDto.price) || 0;
      const parsedMinLevel = Number(createDto.minLevel) || 5;

      const hospitalId = user?.hospitalId || createDto.hospitalId;
      // Safe fallback for userId to prevent History Schema validation crashes
      const userId = user?.userId || user?._id || new Types.ObjectId(); 

      const newItem = new this.inventoryModel({
        ...createDto,
        quantity: parsedQuantity,
        price: parsedPrice,
        minLevel: parsedMinLevel,
        hospitalId: hospitalId, 
      });
      
      const savedItem = await newItem.save();

      // ✅ Wrap History in its own try/catch so it never crashes the main save!
      try {
        const history = new this.historyModel({
          inventoryId: savedItem._id,
          changeType: 'ADDITION',
          quantity: parsedQuantity,
          performedBy: userId,
          notes: 'Initial stock addition',
          hospitalId: hospitalId
        });
        await history.save();
      } catch (historyError) {
        console.warn("⚠️ History Log Failed, but item saved:", historyError.message);
      }

      return savedItem;
    } catch (error: any) {
      console.error("Inventory Save Error:", error);
      throw new InternalServerErrorException('Failed to add inventory item to database');
    }
  }

  /**
   * ✅ FIND ALL: Get all medicines for Yukti Herbs
   */
  async findAll(hospitalId: string) {
    return this.inventoryModel.find({ hospitalId }).sort({ createdAt: -1 }).exec();
  }

  /**
   * ✅ FIND ONE
   */
  async findOne(id: string) {
    const item = await this.inventoryModel.findById(id).exec();
    if (!item) throw new NotFoundException('Item not found');
    return item;
  }

  /**
   * ✅ REMOVE
   */
  async remove(id: string) {
    return this.inventoryModel.findByIdAndDelete(id).exec();
  }

  /**
   * ✅ LOW STOCK: For the Dashboard Widget
   */
  async getLowStockAlerts(hospitalId: string) {
    // ✅ FIX: Fetch and filter dynamically against the minLevel (defaults to 5 if not set)
    const items = await this.inventoryModel.find({ hospitalId }).exec();
    return items.filter(item => (item.quantity || 0) <= (item.minLevel || 5));
  }

  /**
   * ✅ HISTORY: For the Dashboard Activity Feed
   */
  async getHistory(hospitalId: string) {
    return this.historyModel.find({ hospitalId })
      .populate('inventoryId', 'name')
      .sort({ createdAt: -1 })
      .limit(20)
      .exec();
  }

  /**
   * ✅ DEDUCT STOCK: Automated deduction logic (Extended Version)
   */
  async deductStock(inventoryId: string, quantity: number, hospitalId: string, userId: string, notes: string) {
    const item = await this.inventoryModel.findOne({ _id: inventoryId, hospitalId });
    
    if (!item) {
      throw new NotFoundException('Medicine not found in your pharmacy.');
    }

    const deductQty = Number(quantity); // Ensure number

    if (item.quantity < deductQty) {
      throw new BadRequestException(`Insufficient stock for ${item.name}.`);
    }

    // 1. Perform Deduction
    item.quantity -= deductQty;
    await item.save();

    // 2. AUTOMATION: Create History Log
    const history = new this.historyModel({
      inventoryId,
      changeType: 'DEDUCTION',
      quantity: deductQty,
      performedBy: userId,
      notes: notes || 'Used in therapy session',
      hospitalId
    });
    
    return history.save();
  }

  /**
   * ✅ REDUCE STOCK: Simple version for API calls
   */
  async reduceStock(id: string, quantity: number) {
    const item = await this.inventoryModel.findById(id);
    if (!item) throw new NotFoundException('Item not found');

    const reduceQty = Number(quantity); // Ensure number

    if (item.quantity < reduceQty) {
      throw new BadRequestException(`Insufficient stock for ${item.name}`);
    }

    item.quantity -= reduceQty;
    return item.save();
  }
}