import { Countries } from 'data/countries';
import React from 'react';

export interface CountryFieldProps {
    /**
     * The internal name of the selected country.
     */
    value: string;
}

function CountryField ({
    value
}: CountryFieldProps) {

    const $country = (() => {
        if (Object.keys(Countries).includes(value) === false) {
            return (
                <div className="country-name country-error">
                    (invalid country)
                </div>
            )
        }

        const country = Countries[value];
        
        return (
            <>
                <div className="country-flag">
                    <img className="small-flag" src={country.flag} />
                </div>
                <div className="country-name">
                    {country.displayName.length > 1
                        ? country.displayName
                        : "<country>"
                    }
                </div>
            </>
        )
    })();

    return (
        <div className="default-control default-country-field" tabIndex={1}>
            <div className="country-content">
                {$country}
            </div>
        </div>
    );
}

export default CountryField;