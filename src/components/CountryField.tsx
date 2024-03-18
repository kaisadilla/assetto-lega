import { Countries } from 'data/countries';
import CoverPanel from 'elements/CoverPanel';
import React, { useState } from 'react';
import CountryPicker from './CountryPicker';
import { getClassString } from 'utils';
import Img from 'elements/Img';

export interface CountryFieldProps {
    /**
     * The internal name of the selected country.
     */
    value: string;
    allowRegions?: boolean;
    readonly?: boolean;
    required?: boolean; // TODO: Implement optional 'null' value.
    onChange?: (country: string | null) => void;
    tabIndex?: number;
}

function CountryField ({
    value,
    allowRegions,
    readonly,
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
                    <Img className="small-flag" src={country.flag} />
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

    const classStr = getClassString(
        "default-control default-country-field",
        readonly && "readonly",
    )

    return (
        <div className={classStr} tabIndex={tabIndex}>
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
        if (readonly) return;
        
        setPickerOpen(true);
    }

    function handlePickerSelect (country: string | null) {
        setPickerOpen(false);
        
        if (readonly) return;
        onChange?.(country);
    }
}

export default CountryField;