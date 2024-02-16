import Button from 'elements/Button';
import Dialog from 'elements/Dialog';
import LabeledControl from 'elements/LabeledControl';
import NumericBox from 'elements/NumericBox';
import Textbox from 'elements/Textbox';
import ToolboxRow from 'elements/ToolboxRow';
import FormTitle from 'elements/form/FormTitle';
import React, { useState } from 'react';
import { ColorChangeHandler, ColorResult, HSLColor, SliderPicker, PhotoshopPicker, SketchPicker } from 'react-color';
import { Alpha, EditableInput, Hue, Saturation } from "react-color/lib/components/common";
// @ts-ignore
import SliderSwatches from "react-color/lib/components/slider/SliderSwatches";
import tinycolor2 from 'tinycolor2';
import { truncateNumber } from 'utils';

interface HSVColor {
    h: number;
    s: number;
    v: number;
    a: number;
    source: string;
}

export enum ColorPickerMode {
    Sketch,
    Photoshop,
}

export interface ColorPickerProps {
    mode: ColorPickerMode;
    defaultColor: string;
    onSelect: (selectedColor: string) => void;
    onCancel?: (selectedColor: string) => void;
}

function ColorPicker ({
    mode,
    defaultColor,
    onSelect,
    onCancel,
}: ColorPickerProps) {
    const colorObj = tinycolor2(defaultColor);
    const [hex, setHex] = useState("#" + colorObj.toHex());
    const [rgb, setRgb] = useState(colorObj.toRgb());
    const [hsl, setHsl] = useState(colorObj.toHsl());
    const [hsv, setHsv] = useState(colorObj.toHsv());

    const CustomPointer = () => <div className="color-picker-pointer" />
    const CustomSlider = () => <div className="color-picker-slider" />

    return (
        <Dialog className="default-color-picker">
            <div className="color-controls">
                <div className="color-gadgets">
                    <div className="saturation-container">
                        <Saturation
                            //@ts-ignore
                            hsl={hsl}
                            hsv={hsv}
                            pointer={CustomPointer}
                            //@ts-ignore
                            onChange={handleSaturationChange}
                        />
                    </div>
                    <div className="hue-container">
                        <Hue
                            //@ts-ignore
                            hsl={hsl}
                            pointer={CustomSlider}
                            direction='vertical'
                            //@ts-ignore
                            onChange={handleHueChange}
                        />
                    </div>
                    <div className="swatches-container">
                        <SliderSwatches
                            hsl={hsl}
                            onClick={handleSwatchesClick}
                        />
                    </div>
                </div>
                <div className="manual-input-container">
                    <div className="color-comparison">
                        <div
                            className="color-old"
                            style={{backgroundColor: defaultColor}}
                        />
                        <div
                            className="color-new"
                            style={{backgroundColor: hex}}
                        />
                    </div>
                    <div className="color-parameters">
                        <FormTitle title="Color" />
                        <LabeledControl className="hex-control" label="Hex">
                            <Textbox
                                value={hex}
                                pattern={/^\#[0-9a-fA-F]*$/}
                                onChange={() => {}}
                            />
                        </LabeledControl>
                        <FormTitle title="RGB" />
                        <LabeledControl className="rgb-control" label="R">
                            <NumericBox
                                value={rgb.r}
                                minValue={0}
                                maxValue={255}
                                onChange={n => handleRgbInput('r', n!)}
                            />
                        </LabeledControl>
                        <LabeledControl className="rgb-control" label="G">
                            <NumericBox
                                value={rgb.g}
                                minValue={0}
                                maxValue={255}
                                onChange={n => handleRgbInput('g', n!)}
                            />
                        </LabeledControl>
                        <LabeledControl className="rgb-control" label="B">
                            <NumericBox
                                value={rgb.b}
                                minValue={0}
                                maxValue={255}
                                onChange={n => handleRgbInput('b', n!)}
                            />
                        </LabeledControl>
                        <FormTitle title="HSL" />
                        <LabeledControl className="hsl-control" label="H" afterLabel="°">
                            <NumericBox
                                value={truncateNumber(hsl.h, 1)}
                                minValue={0}
                                maxValue={256}
                                allowDecimals
                                onChange={n => handleHslInput('h', n!)}
                            />
                        </LabeledControl>
                        <LabeledControl className="hsl-control" label="S" afterLabel="%">
                            <NumericBox
                                value={truncateNumber(hsl.s, 2)}
                                minValue={0}
                                maxValue={1}
                                allowDecimals
                                onChange={n => handleHslInput('s', n!)}
                            />
                        </LabeledControl>
                        <LabeledControl className="hsl-control" label="L" afterLabel="%">
                            <NumericBox
                                value={truncateNumber(hsl.l, 2)}
                                minValue={0}
                                maxValue={1}
                                allowDecimals
                                onChange={n => handleHslInput('l', n!)}
                            />
                        </LabeledControl>
                    </div>
                </div>
            </div>
            
            <ToolboxRow className="image-picker-toolbox">
                <Button onClick={handleCancel}>Cancel</Button>
                <Button
                    highlighted
                    onClick={handleSelect}
                >
                    Select
                </Button>
            </ToolboxRow>
        </Dialog>
    );

    function handleSelect () {
        onSelect(hex);
    }

    function handleCancel () {
        onCancel?.(hex);
    }

    function handleHueChange (hue: HSLColor) {
        const colorObj = tinycolor2(hue);

        setHsl(hue as tinycolor2.ColorFormats.HSLA);
        //setHsv(colorObj.toHsv());
        setRgb(colorObj.toRgb());
        setHex("#" + colorObj.toHex());
    }

    function handleSaturationChange (res: HSVColor) {
        const colorObj = tinycolor2(res);

        setHsv(res);
        setRgb(colorObj.toRgb());
        setHex("#" + colorObj.toHex());

        // prevent saturation from changing the hue.
        const newHsl = colorObj.toHsl();
        newHsl.h = hsl.h;
        setHsl(newHsl);
    }

    function handleSwatchesClick (hue: HSLColor) {
        const colorObj = tinycolor2(hue);
        setHsl(colorObj.toHsl());
        setHsv(colorObj.toHsv());
        setRgb(colorObj.toRgb());
        setHex("#" + colorObj.toHex());
    }

    function handleRgbInput (field: 'r' | 'g' | 'b', value: number) {
        const newRgb = {...rgb};
        newRgb[field] = value;

        const colorObj = tinycolor2(newRgb);
        setHsl(colorObj.toHsl());
        setHsv(colorObj.toHsv());
        setRgb(newRgb);
        setHex("#" + colorObj.toHex());
    }

    function handleHslInput (field: 'h' | 's' | 'l', value: number) {
        const newHsl = {...hsl};
        newHsl[field] = value;

        const colorObj = tinycolor2(newHsl);
        setHsl(newHsl);
        setHsv(colorObj.toHsv());
        setRgb(colorObj.toRgb());
        setHex("#" + colorObj.toHex());
    }
}

export default ColorPicker;