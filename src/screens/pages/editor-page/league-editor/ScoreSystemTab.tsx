import { League, LeagueScoreSystem } from 'data/schemas';
import Checkbox from 'elements/Checkbox';
import LabeledControl from 'elements/LabeledControl';
import NumericBox from 'elements/NumericBox';
import Form from 'elements/form/Form';
import React, { useEffect, useState } from 'react';
import { getClassString } from 'utils';

export interface ScoreSystemTabProps {
    league: League;
    onChange: (field: keyof League, value: any) => void;
}

function ScoreSystemTab ({
    league,
    onChange,
}: ScoreSystemTabProps) {

    return (
        <div className="editor-tab score-system-tab">
            <Form className="info-form">
                <Form.Section className="by-position-section">
                    <Form.Title title="Positions" />
                    <div className="session-list">
                        <ScoreArray
                            title="Qualifying"
                            value={league.scoreSystem.qualifying}
                            onChange={arr => handleChange('qualifying', arr)}
                        />
                        <ScoreArray
                            title="Race"
                            value={league.scoreSystem.position}
                            onChange={arr => handleChange('position', arr)}
                        />
                    </div>
                </Form.Section>
                <Form.Section className="other-fields-section">
                    <Form.Title title="Extra points" />
                    <LabeledControl label="Default points per race" required>
                        <NumericBox
                            value={league.scoreSystem.defaultPointsPerRace}
                            onChange={n => handleChange('defaultPointsPerRace', n)}
                        />
                    </LabeledControl>
                    <LabeledControl label="Fastest lap" required>
                        <NumericBox
                            value={league.scoreSystem.fastestLap}
                            onChange={n => handleChange('fastestLap', n)}
                        />
                    </LabeledControl>
                    <LabeledControl label="Fastest lap threshold" required>
                        <NumericBox
                            value={league.scoreSystem.fastestLapThreshold}
                            onChange={n => handleChange('fastestLapThreshold', n)}
                        />
                    </LabeledControl>
                </Form.Section>
            </Form>
        </div>
    );

    function handleChange (field: keyof LeagueScoreSystem, value: any) {
        const update: LeagueScoreSystem = {
            ...league.scoreSystem,
            [field]: value,
        };

        onChange('scoreSystem', update);
    }
}

interface ScoreArrayProps {
    title: string;
    value: number[] | null;
    onChange: (value: number[] | null) => void;
}

function ScoreArray ({
    title,
    value,
    onChange,
}: ScoreArrayProps) {
    // contains the values that have been at each position of the array, even
    // if currently the array is shorter. 
    const [valueHistory, setValueHistory] = useState(value ? [...value] : Array(10).fill(0));
    const [amount, setAmount] = useState(value?.length ?? 10);

    return (
        <div className="score-array-field">
            <div className="header">
                <Checkbox
                    value={value !== null}
                    onChange={handleToggle}
                />
                <div className="name">{title}</div>
            </div>
            {value !== null && <div className="amount">
                <LabeledControl
                    label="First"
                    afterLabel="positions"
                >
                    <NumericBox
                        className="point-pos-amount"
                        value={amount}
                        min={1}
                        max={999}
                        onBlur={handleSetAmount}
                    />
                </LabeledControl>
            </div>}
            {value !== null && <div className="entries">
                <div className="entry entry-header">
                    <div className="position">pos</div>
                    <div className="points-awarded">pts</div>
                    <div className="gap">Δ prev</div>
                    <div className="gap">Δ first</div>
                </div>
                {value.map((v, i) => {
                    let prevDelta = 0;
                    let firstDelta = 0;
                    let prevDeltaStr = "";
                    let firstDeltaStr = "";

                    if (i > 0) {
                        prevDelta = v - value[i - 1];
                        firstDelta = v - value[0];
                        if (prevDelta > 0) {
                            prevDeltaStr = "+" + prevDelta;
                        }
                        else {
                            prevDeltaStr = prevDelta.toString();
                        }

                        if (firstDelta > 0) {
                            firstDeltaStr = "+" + firstDelta;
                        }
                        else {
                            firstDeltaStr = firstDelta.toString();
                        }
                    }

                    const gapFromLastClass = getClassString(
                        "gap",
                        prevDelta > 0 && "positive",
                        prevDelta < 0 && "negative"
                    );

                    const gapFromFirstClass = getClassString(
                        "gap",
                        firstDelta > 0 && "positive",
                        firstDelta < 0 && "negative"
                    );

                    return (
                        <div key={i} className="entry">
                            <div className="position">#{i + 1}</div>
                            <NumericBox
                                className="points-awarded"
                                value={v}
                                onBlur={n => handleArrayChange(i, n)}
                            />
                            <div className={gapFromLastClass}>
                                {i > 0 && <span>({prevDeltaStr})</span>}
                            </div>
                            <div className={gapFromFirstClass}>
                                {i > 0 && <span>({firstDeltaStr})</span>}
                            </div>
                        </div>
                    )
                })}
            </div>}
        </div>
    );

    function handleToggle (isToggled: boolean) {
        if (isToggled) {
            onChange(valueHistory);
        }
        else {
            onChange(null);
        }
    }

    function handleSetAmount (newLength: number) {
        if (value === null) return;

        setAmount(newLength);

        let newHistory;
        if (valueHistory.length < newLength) {
            newHistory = [
                ...valueHistory,
                ...Array(newLength - valueHistory.length).fill(0)
            ];

            setValueHistory(newHistory);
        }
        else {
            newHistory = valueHistory;
        }

        const oldLength = value?.length;

        if (oldLength < newLength) {
            const update = [...value];
            for (let i = update.length; i < newLength; i++) {
                update[i] = newHistory[i];
            }
            onChange(update);
        }
        else if (oldLength > newLength) {
            onChange(value.slice(0, newLength));
        }
    }

    function handleArrayChange (index: number, pts: number) {
        if (value === null) return;

        const historyUpd = [...valueHistory];
        historyUpd[index] = pts;
        setValueHistory(historyUpd);

        const valueUpd = [...value];
        valueUpd[index] = pts;
        onChange(valueUpd);
    }
}


export default ScoreSystemTab;
