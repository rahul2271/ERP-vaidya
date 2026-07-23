import { SettingsService } from '../settings/settings.service';
export declare const PLAN_PRICING: Record<string, Record<string, number>>;
export declare class RazorpayService {
    private readonly settingsService;
    private readonly logger;
    constructor(settingsService: SettingsService);
    createOrder(hospitalId: string, plan: string, billingCycle?: 'monthly' | 'annually'): Promise<{
        razorpayKeyId: string;
        plan: string;
        billingCycle: "monthly" | "annually";
        amount: number;
        id: string;
        entity: string;
        amount_paid: number;
        amount_due: number;
        status: "created" | "attempted" | "paid";
        attempts: number;
        created_at: number;
        description: string;
        token: import("razorpay/dist/types/tokens").Tokens.RazorpayAuthorizationToken;
        payments?: {
            [key: string]: string;
        };
        offers?: {
            [key: string]: string;
        };
        transfers?: {
            entity: string;
            count: string;
            items: import("razorpay/dist/types/transfers").Transfers.RazorpayTransfer[];
        } | import("razorpay/dist/types/transfers").Transfers.RazorpayTransfer[];
        method?: "netbanking" | "upi" | "card" | "emandate" | "nach" | undefined;
        notes?: import("razorpay/dist/types/api").IMap<string | number> | undefined;
        currency: string;
        offer_id?: string | null | undefined;
        bank_account?: import("razorpay/dist/types/orders").Orders.RazorpayOrderBankDetailsCreateRequestBody | undefined;
        partial_payment?: boolean | undefined;
        first_payment_min_amount?: number | undefined;
        receipt?: string | undefined;
        rto_review?: boolean | undefined;
        line_items?: import("razorpay/dist/types/orders").Orders.LineItems[] | undefined;
        line_items_total?: number | string | undefined;
        shipping_fee?: number | undefined;
        cod_fee?: number | undefined;
        customer_details?: import("razorpay/dist/types/orders").Orders.CustomerDetails | undefined;
        promotions?: import("razorpay/dist/types/orders").Orders.Promotion[] | undefined;
        device_details?: import("razorpay/dist/types/orders").Orders.DeviceDetails | undefined;
        phonepe_switch_context?: string | undefined;
    }>;
}
