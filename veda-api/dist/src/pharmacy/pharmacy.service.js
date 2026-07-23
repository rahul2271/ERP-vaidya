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
exports.PharmacyService = void 0;
const common_1 = require("@nestjs/common");
const mongoose_1 = require("@nestjs/mongoose");
const mongoose_2 = require("mongoose");
const pharmacy_sale_schema_1 = require("./schemas/pharmacy-sale.schema");
const inventory_schema_1 = require("../inventory/schemas/inventory.schema");
let PharmacyService = class PharmacyService {
    pharmacySaleModel;
    inventoryModel;
    constructor(pharmacySaleModel, inventoryModel) {
        this.pharmacySaleModel = pharmacySaleModel;
        this.inventoryModel = inventoryModel;
    }
    async createSale(saleData, user) {
        try {
            const hospitalId = user?.hospitalId || saleData.hospitalId;
            if (!hospitalId)
                throw new common_1.BadRequestException('Hospital ID is required.');
            for (const item of saleData.items) {
                const product = await this.inventoryModel.findById(item.inventoryId);
                if (!product) {
                    throw new common_1.BadRequestException(`Product ${item.name} not found in inventory.`);
                }
                if (product.quantity < item.quantity) {
                    throw new common_1.BadRequestException(`Not enough stock for ${item.name}. Only ${product.quantity} left.`);
                }
            }
            for (const item of saleData.items) {
                await this.inventoryModel.findByIdAndUpdate(item.inventoryId, { $inc: { quantity: -item.quantity } });
            }
            const newSale = new this.pharmacySaleModel({
                ...saleData,
                hospitalId,
                soldBy: user?.userId || new mongoose_2.Types.ObjectId(),
                paymentStatus: 'PAID'
            });
            return await newSale.save();
        }
        catch (error) {
            throw new common_1.InternalServerErrorException(error.message);
        }
    }
    async getDailySettlement(hospitalId, date) {
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
            if (mode === 'UPI')
                settlement.UPI += sale.grandTotal;
            else if (mode === 'CASH')
                settlement.CASH += sale.grandTotal;
            else if (mode === 'CARD')
                settlement.CARD += sale.grandTotal;
        });
        return settlement;
    }
    async getAllSales(hospitalId) {
        return this.pharmacySaleModel.find({ hospitalId })
            .populate('soldBy', 'name')
            .populate('patientId', 'name mobile')
            .populate('hospitalId', 'name address phone')
            .sort({ createdAt: -1 })
            .exec();
    }
};
exports.PharmacyService = PharmacyService;
exports.PharmacyService = PharmacyService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, mongoose_1.InjectModel)(pharmacy_sale_schema_1.PharmacySale.name)),
    __param(1, (0, mongoose_1.InjectModel)(inventory_schema_1.Inventory.name)),
    __metadata("design:paramtypes", [mongoose_2.Model,
        mongoose_2.Model])
], PharmacyService);
//# sourceMappingURL=pharmacy.service.js.map