export declare class PdfService {
    generateDischargePdf(data: any): Promise<Buffer>;
    generateVisitTicketPdf(data: {
        hospital: {
            name: string;
            location?: string;
            contact?: string;
        };
        patient: {
            name: string;
            age?: number;
            gender?: string;
            uhid?: string;
        };
        visitType: string;
        visitNumber: string;
        doctorName?: string;
        treatmentName?: string;
        roomName?: string;
        dateTime: Date;
    }): Promise<Buffer>;
}
