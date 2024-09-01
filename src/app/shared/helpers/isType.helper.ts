import { Currency } from "src/app/software/types/definitions/currency.type";
import { Invoice } from "src/app/software/types/definitions/invoice.type";
import { Person } from "src/app/software/types/definitions/person.type";
import { Product } from "src/app/software/types/definitions/product.type";
import { Unit } from "src/app/software/types/definitions/unit.type";

export abstract class IsType {

    public static person(value: unknown): value is Person {
        const whatIf = value as Person;
        return (
            ( typeof whatIf === 'object' && whatIf !== null )
            &&
            ( typeof whatIf.personType === 'number' )
        );
    }
    
    public static product(value: unknown): value is Product {
        const whatIf = value as Product;
        return (
            ( typeof whatIf === 'object' && whatIf !== null )
            &&
            ( typeof whatIf.productType === 'number' )
        );
    }

    public static invoice(value: unknown): value is Invoice {
        const whatIf = value as Invoice;
        return (
            ( typeof whatIf === 'object' && whatIf !== null )
            &&
            ( typeof whatIf.invoiceType === 'number' )
        );
    }

    public static currency(value: unknown): value is Currency {
        const whatIf = value as Currency;
        return (
            ( typeof whatIf === 'object' && whatIf !== null )
            &&
            ( typeof whatIf.currencyName === 'string' )
        );
    }

    public static dateISO(value: string): boolean {
        if (
            value[4] === '-' 
            && value[7] === '-' 
            && value[10] === 'T'
            && value[13] === ':'
            && value[16] === ':'
        ) {
            return true;
        }
    
        return false;
    }

    public static void(value: unknown): boolean {
        if (
            value === undefined
            || value === null
            || value === ''
            || value === 'null'
            || Number.isNaN(value)
        ) {
            return true;
        }
    
        return false;
    }

}