"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.PharmacyModule = void 0;
const common_1 = require("@nestjs/common");
const mongoose_1 = require("@nestjs/mongoose");
const pharmacy_controller_1 = require("./pharmacy.controller");
const pharmacy_service_1 = require("./pharmacy.service");
const pharmacy_sale_schema_1 = require("./schemas/pharmacy-sale.schema");
const inventory_schema_1 = require("../inventory/schemas/inventory.schema");
let PharmacyModule = class PharmacyModule {
};
exports.PharmacyModule = PharmacyModule;
exports.PharmacyModule = PharmacyModule = __decorate([
    (0, common_1.Module)({
        imports: [
            mongoose_1.MongooseModule.forFeature([
                { name: pharmacy_sale_schema_1.PharmacySale.name, schema: pharmacy_sale_schema_1.PharmacySaleSchema },
                { name: inventory_schema_1.Inventory.name, schema: inventory_schema_1.InventorySchema }
            ])
        ],
        controllers: [pharmacy_controller_1.PharmacyController],
        providers: [pharmacy_service_1.PharmacyService],
    })
], PharmacyModule);
//# sourceMappingURL=pharmacy.module.js.map