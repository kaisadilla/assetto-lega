import { Countries } from 'data/countries';
import CoverPanel from 'elements/CoverPanel';
import React, { useState } from 'react';
import CountryPicker from './CountryPicker';
import { getClassString } from 'utils';

export interface CountryFieldProps {
    /**
     * The internal name of the selected country.
     */
    value: string;
    allowRegions?: boolean;
    required?: boolean; // TODO: Implement optional 'null' value.
    onChange?: (country: string | null) => void;
    tabIndex?: number;
}

function CountryField ({
    value,
    allowRegions,
    required,
    onChange,
    tabIndex = 1,
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
    
        const nameClassStr = getClassString(
            "country-name",
            country.isPseudo && "country-name-pseudo"
        )
        
        return (
            <>
                <div className="country-flag">
                    <img className="small-flag" src={country.flag} />
                </div>
                <div className={nameClassStr}>
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
        <div className="default-control default-country-field" tabIndex={tabIndex}>
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