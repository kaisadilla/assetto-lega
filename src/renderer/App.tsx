import { MemoryRouter as Router, Routes, Route } from 'react-router-dom';
import icon from '../../assets/icon.svg';
//import './App.css';
import 'styles/main.scss';
import MainScreen from 'components/MainScreen';

export default function App () {
    return (
        <div>
            <MainScreen />
        </div>
    );
}