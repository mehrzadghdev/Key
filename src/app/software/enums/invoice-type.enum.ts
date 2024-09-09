export enum InvoicePatternType {
    Sale = 1, // فروش
    CurrencySale = 2, // فروش ارز
    GoldAndPlatinum = 3, // طلا و جواهر و پلاتینیوم 
    Contract = 4, // قرارداد پیمان کاری 
    UtilityBills = 5, // قبوض خدماتی 
    Export = 6, // صادرات
    Ticket = 7 // بلیط
}

export enum InvoiceType {
    TypeOne = 1, // نوع اول
    TypeTwo = 2 // نوع دوم
}

export enum InvoicePaymentMethod {
    Cash = 1, // نقدی
    Credit = 2, // نسیه
    CashAndCredit = 3, // نقدی و نسیه
}

export enum FlightType {
    Domestic = 1, // پرواز های داخلی
    Foreign = 2, // پرواز های خارجی
}