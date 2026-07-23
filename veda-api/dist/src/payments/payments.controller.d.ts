import { RazorpayService } from './razorpay.service';
import { HospitalsService } from '../hospitals/hospitals.service';
import { UsersService } from '../users/users.service';
import { MailService } from '../mail/mail.service';
export declare class PaymentsController {
    private readonly razorpayService;
    private readonly hospitalsService;
    private readonly usersService;
    private readonly mailService;
    constructor(razorpayService: RazorpayService, hospitalsService: HospitalsService, usersService: UsersService, mailService: MailService);
    startSubscription(body: {
        plan: string;
        billingCycle?: 'monthly' | 'annually';
    }, req: any): Promise<{
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
    handleWebhook(body: any, signature: string, req: any): Promise<{
        status: string;
    }>;
}
