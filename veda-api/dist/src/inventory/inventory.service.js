"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.InventoryService = void 0;
const common_1 = require("@nestjs/common");
const mongoose_1 = require("@nestjs/mongoose");
const mongoose_2 = require("mongoose");
const inventory_schema_1 = require("./schemas/inventory.schema");
const inventory_history_schema_1 = require("./schemas/inventory-history.schema");
let InventoryService = class InventoryService {
    inventoryModel;
    historyModel;
    constructor(inventoryModel, historyModel) {
        this.inventoryModel = inventoryModel;
        this.historyModel = historyModel;
    }
    async create(createDto, user) {
        try {
            const parsedQuantity = Number(createDto.quantity) || 0;
            const parsedPrice = Number(createDto.price) || 0;
            const parsedMinLevel = Number(createDto.minLevel) || 5;
            const hospitalId = user?.hospitalId || createDto.hospitalId;
            const userId = user?.userId || user?._id || new mongoose_2.Types.ObjectId();
            const newItem = new this.inventoryModel({
                ...createDto,
                quantity: parsedQuantity,
                price: parsedPrice,
                minLevel: parsedMinLevel,
                hospitalId: hospitalId,
            });
            const savedItem = await newItem.save();
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
            }
            catch (historyError) {
                console.warn("⚠️ History Log Failed, but item saved:", historyError.message);
            }
            return savedItem;
        }
        catch (error) {
            console.error("Inventory Save Error:", error);
            throw new common_1.InternalServerErrorException('Failed to add inventory item to database');
        }
    }
    async findAll(hospitalId) {
        return this.inventoryModel.find({ hospitalId }).sort({ createdAt: -1 }).exec();
    }
    async findOne(id) {
        const item = await this.inventoryModel.findById(id).exec();
        if (!item)
            throw new common_1.NotFoundException('Item not found');
        return item;
    }
    async remove(id) {
        return this.inventoryModel.findByIdAndDelete(id).exec();
    }
    async getLowStockAlerts(hospitalId) {
        const items = await this.inventoryModel.find({ hospitalId }).exec();
        return items.filter(item => (item.quantity || 0) <= (item.minLevel || 5));
    }
    async getHistory(hospitalId) {
        return this.historyModel.find({ hospitalId })
            .populate('inventoryId', 'name')
            .sort({ createdAt: -1 })
            .limit(20)
            .exec();
    }
    async deductStock(inventoryId, quantity, hospitalId, userId, notes) {
        const item = await this.inventoryModel.findOne({ _id: inventoryId, hospitalId });
        if (!item) {
            throw new common_1.NotFoundException('Medicine not found in your pharmacy.');
        }
        const deductQty = Number(quantity);
        if (item.quantity < deductQty) {
            throw new common_1.BadRequestException(`Insufficient stock for ${item.name}.`);
        }
        item.quantity -= deductQty;
        await item.save();
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
    async reduceStock(id, quantity) {
        const item = await this.inventoryModel.findById(id);
        if (!item)
            throw new common_1.NotFoundException('Item not found');
        const reduceQty = Number(quantity);
        if (item.quantity < reduceQty) {
            throw new common_1.BadRequestException(`Insufficient stock for ${item.name}`);
        }
        item.quantity -= reduceQty;
        return item.save();
    }
};
exports.InventoryService = InventoryService;
exports.InventoryService = InventoryService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, mongoose_1.InjectModel)(inventory_schema_1.Inventory.name)),
    __param(1, (0, mongoose_1.InjectModel)(inventory_history_schema_1.InventoryHistory.name)),
    __metadata("design:paramtypes", [mongoose_2.Model,
        mongoose_2.Model])
], InventoryService);
//# sourceMappingURL=inventory.service.js.map