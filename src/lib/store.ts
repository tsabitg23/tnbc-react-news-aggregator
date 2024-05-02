import type { Action, ThunkAction } from "@reduxjs/toolkit";
import { combineSlices, configureStore } from '@reduxjs/toolkit'
import { newsApiSlice } from './features/newsApi/newsApiSlice';
import { guardianApiSlice } from "./features/theGuardian/guardianApiSlice";
import { combinedNewsData } from "./features/combinedNews/combinedNewsSlice";
import { newYorkTimesApiSlice } from "./features/newYorkTimes/newYorkTimesSlice";

const rootReducer = combineSlices(combinedNewsData, newsApiSlice, guardianApiSlice, newYorkTimesApiSlice);

export const makeStore = () => {
    return configureStore({
        reducer: rootReducer,
        middleware: (getDefaultMiddleware) => {
            return getDefaultMiddleware().concat([
                newsApiSlice.middleware,
                guardianApiSlice.middleware,
                newYorkTimesApiSlice.middleware
            ]);
        },
    })
}

// Infer the type of makeStore
export type AppStore = ReturnType<typeof makeStore>
// Infer the `RootState` and `AppDispatch` types from the store itself
// export type RootState = ReturnType<AppStore['getState']>
export type RootState = ReturnType<typeof rootReducer>;
export type AppDispatch = AppStore['dispatch']
export type AppThunk<ThunkReturnType = void> = ThunkAction<
  ThunkReturnType,
  RootState,
  unknown,
  Action
>;