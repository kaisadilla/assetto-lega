import NavBar from 'elements/NavBar';
import React, { useState } from 'react';
import EditorTabTeams from './EditorTabTeams';
import { LeagueEditorTab } from 'context/useNavigation';
import EditorTab from './EditorTab';

export interface LeagueEditorProps {
    mode: "create" | "edit";
    filename?: string;
}

export interface LeagueTeam {
    "name": string | null,
    "car": string | null,
    "country": string | null,
    "icon": string | null,
    "color": string | null,
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