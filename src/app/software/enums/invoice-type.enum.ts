export enum InvoicePatternType {
    Sale = 0, // فروش
    CurrencySale = 1, // فروش ارز
    GoldAndPlatinum = 2, // طلا و جواهر و پلاتینیوم 
    Contract = 3, // قرارداد پیمان کاری 
    UtilityBills = 4, // قبوض خدماتی 
    Export = 5, // صادرات  
}

export enum InvoiceType {
    Main = 0, // اصلی
    Cancellation = 1, // ابطالی
    Corrective = 2 // اصلاحی
}

export enum InvoicePaymentMethod {
    Cash = 0, // نقدی
    Credit = 1, // نسیه
    CashAndCredit = 3, // نقدی و نسیه
}