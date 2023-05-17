import NavBar from 'elements/NavBar';
import React, { useState } from 'react';
import EditorTabTeams from './EditorTabTeams';
import { LeagueEditorTab } from 'components/useNavigation';
import EditorTab from './EditorTab';

export interface LeagueEditorProps {
    mode: "create" | "edit";
    filename?: string;
}

export interface LeagueTeam {
    "name": string,
    "car": string,
    "country": string,
    "icon": string,
    "color": string,
    "ballast": number,
    "restrictor": number,
    "mainDriver": number,
    "drivers": LeagueDriver[],
}

export interface LeagueDriver {
    "number": string,
    "name": string,
    "initials": string,
    "country": string,
    "skins": string[],
    "strength": number,
    "aggression": number,
}

function LeagueEditor (props: LeagueEditorProps) {
    return (
        <div>
            <EditorTab />
        </div>
    )
}

export default LeagueEditor;