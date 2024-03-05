import React from 'react';
import CustomizableContextMenu, { CustomizableContextMenuControl } from './CustomizableContextMenu';
import { getClassString } from 'utils';
import Icon from './Icon';
import { Tier } from 'data/schemas';

export interface TierContextMenuProps {
    target: React.RefObject<HTMLElement>;
    selectedTier?: Tier;
    className?: string;
    onSelect: (selectedTier: Tier) => void;
}

function TierContextMenu ({
    target,
    selectedTier,
    className,
    onSelect,
}: TierContextMenuProps) {
    const classStr = getClassString(
        "tier-context-menu",
        className,
    )

    const menuControl = {} as CustomizableContextMenuControl;

    return (
        <CustomizableContextMenu
            className={classStr}
            target={target}
            control={menuControl}
        >
            <div className="tier-container">
                <div
                    className={
                        getClassString("tier", selectedTier === Tier.Legendary && "selected")
                    }
                    onClick={() => handleSelect(Tier.Legendary)}
                    >
                    <Icon
                        className={"tier-icon tier-" + Tier.Legendary}
                        name="fa-star"
                    />
                    <div className="tier-name">Legendary</div>
                </div>
                <div
                    className={
                        getClassString("tier", selectedTier === Tier.Epic && "selected")
                    }
                    onClick={() => handleSelect(Tier.Epic)}
                    >
                    <Icon
                        className={"tier-icon tier-" + Tier.Epic}
                        name="fa-star"
                    />
                    <div className="tier-name">Epic</div>
                </div>
                <div
                    className={
                        getClassString("tier", selectedTier === Tier.Distinguished && "selected")
                    }
                    onClick={() => handleSelect(Tier.Distinguished)}
                    >
                    <Icon
                        className={"tier-icon tier-" + Tier.Distinguished}
                        name="fa-star"
                    />
                    <div className="tier-name">Distinguished</div>
                </div>
                <div
                    className={
                        getClassString("tier", selectedTier === Tier.Regular && "selected")
                    }
                    onClick={() => handleSelect(Tier.Regular)}
                    >
                    <div className="tier-name">Regular</div>
                </div>
            </div>
        </CustomizableContextMenu>
    );

    function handleSelect (tier: Tier) {
        onSelect(tier);
        menuControl.forceClose?.();
    }
}

export default TierContextMenu;
