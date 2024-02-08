import { Countries } from 'data/countries';
import CoverPanel from 'elements/CoverPanel';
import React, { useState } from 'react';
import CountryPicker from './CountryPicker';

export interface CountryFieldProps {
    /**
     * The internal name of the selected country.
     */
    value: string;
    allowRegions?: boolean;
    onChange?: (country: string | null) => void;
}

function CountryField ({
    value,
    allowRegions,
    onChange,
}: CountryFieldProps) {
    const [isPickerOpen, setPickerOpen] = useState(false);

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
                    {
                        country.displayName === ""
                            ? "<unnamed country>"
                            : country.displayName
                    }
                </div>
            </>
        )
    })();

    return (
        <div className="default-control default-country-field" tabIndex={1}>
            <div className="country-content" onClick={handleClick}>
                {$country}
            </div>
            {isPickerOpen && (
            <CoverPanel>
                <CountryPicker
                    preSelectedCountry={value}
                    allowRegions={allowRegions}
                    onSelect={handlePickerSelect}
                    onCancel={() => setPickerOpen(false)}
                />
            </CoverPanel>
            )}
        </div>
    );

    function handleClick () {
        setPickerOpen(true);
    }

    function handlePickerSelect (country: string | null) {
        setPickerOpen(false);
        onChange?.(country);
    }
}

export default CountryField;