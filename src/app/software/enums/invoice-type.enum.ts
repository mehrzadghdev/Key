export enum InvoicePatternType {
    Sale = 1, // فروش
    CurrencySale = 2, // فروش ارز
    GoldAndPlatinum = 3, // طلا و جواهر و پلاتینیوم 
    Contract = 4, // قرارداد پیمان کاری 
    UtilityBills = 5, // قبوض خدماتی 
    Export = 6, // صادرات  
}

export enum InvoiceType {
    Main = 1, // اصلی
    Cancellation = 2, // ابطالی
    Corrective = 3 // اصلاحی
}

export enum InvoicePaymentMethod {
    Cash = 1, // نقدی
    Credit = 2, // نسیه
    CashAndCredit = 3, // نقدی و نسیه
}