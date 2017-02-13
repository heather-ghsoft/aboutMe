import { FormControl } from "@angular/forms";

interface ValidationResult {
    [key: string]: boolean;
}

export class CustomValidators {
    public static email(control: FormControl): ValidationResult {
        // See http://rosskendall.com/blog/web/javascript-function-to-check-an-email-address-conforms-to-rfc822
        var valid = /^([^\x00-\x20\x22\x28\x29\x2c\x2e\x3a-\x3c\x3e\x40\x5b-\x5d\x7f-\xff]+|\x22([^\x0d\x22\x5c\x80-\xff]|\x5c[\x00-\x7f])*\x22)(\x2e([^\x00-\x20\x22\x28\x29\x2c\x2e\x3a-\x3c\x3e\x40\x5b-\x5d\x7f-\xff]+|\x22([^\x0d\x22\x5c\x80-\xff]|\x5c[\x00-\x7f])*\x22))*\x40([^\x00-\x20\x22\x28\x29\x2c\x2e\x3a-\x3c\x3e\x40\x5b-\x5d\x7f-\xff]+|\x5b([^\x0d\x5b-\x5d\x80-\xff]|\x5c[\x00-\x7f])*\x5d)(\x2e([^\x00-\x20\x22\x28\x29\x2c\x2e\x3a-\x3c\x3e\x40\x5b-\x5d\x7f-\xff]+|\x5b([^\x0d\x5b-\x5d\x80-\xff]|\x5c[\x00-\x7f])*\x5d))*$/.test(control.value);

        return !valid && { email: true };
    }

    public static mobilePhoneNumber(control: FormControl): ValidationResult {
        const phoneNumber = control.value.replace(/[^0-9\+\-]/g, '');

        const valid = /^(\+82)?[0]?1([0156789]{1})-?([0-9]{3,4})-?([0-9]{4})$/.test(phoneNumber);

        return !valid && { mobilePhoneNumber: true };
    }

    public static sameAs(baseControl: FormControl) {
        return control => {
            const valid = baseControl.value === control.value;
            return !valid && { same: true };
        }
    }
}