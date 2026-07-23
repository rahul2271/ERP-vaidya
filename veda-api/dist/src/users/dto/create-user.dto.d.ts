declare class UserPermissionsDto {
    canViewFinancials: boolean;
    canEditInventory: boolean;
    canExportData: boolean;
}
export declare class CreateUserDto {
    name: string;
    email: string;
    mobile: string;
    age?: number;
    gender?: string;
    password?: string;
    role?: string;
    specialization?: string;
    hospitalId?: string;
    permissions?: UserPermissionsDto;
}
export {};
