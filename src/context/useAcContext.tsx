import { AcCar, AcCarBrand, AcCarCollection, AcTrack, AcTrackCollection } from "data/schemas";
import Ipc from "main/ipc/ipcRenderer";
import { createContext, useContext, useMemo, useState } from "react";

const AcContext = createContext({} as AcContextState);
export const useAcContext = () => useContext(AcContext);

interface AcContextState {
    acContentReady: boolean;
    cars: AcCarCollection;
    tracks: AcTrackCollection;
    loadAcContent: () => Promise<boolean>;
    getCarById: (id: string | null | undefined) => AcCar | null;
    getTrackById: (id: string | null | undefined) => AcTrack | null;
};

export const AcContextProvider = ({ children }: any) => {
    const [state, setState] = useState<AcContextState>({
        acContentReady: false,
        cars: {
            carList: [] as AcCar[],
            carsById: {} as {[folderName: string]: AcCar},
            brands: [] as AcCarBrand[],
            brandsById: {} as {[brandName: string]: AcCarBrand},
            tags: [] as string[],
        },
        tracks: {
            trackList: [] as AcTrack[],
            tracksById: {} as {[folderName: string]: AcTrack},
            tags: [] as string[],
            presentCountries: [] as string[],
        },
    } as AcContextState);

    const value = useMemo(() => {
        async function loadAcContent () {
            const pCars = Ipc.getCarData();
            const pTracks = Ipc.getTrackData();

            const cars = await pCars;
            const tracks = await pTracks;

            setState(prevState => ({
                ...prevState,
                cars: cars,
                tracks: tracks,
                acContentReady: true,
            }))

            return true;
        }

        function getCarById (id: string | null | undefined) {
            if (id === null || id === undefined) {
                return null;
            }
            else {
                return state.cars.carsById[id] ?? null;
            }
        }

        function getTrackById (id: string | null | undefined) {
            if (id === null || id === undefined) {
                return null;
            }
            else {
                return state.tracks.tracksById[id] ?? null;
            }
        }

        return {
            ...state,
            loadAcContent,
            getCarById,
            getTrackById,
        }
    }, [state]);

    return (
        <AcContext.Provider value={value}>
            {children}
        </AcContext.Provider>
    );
}