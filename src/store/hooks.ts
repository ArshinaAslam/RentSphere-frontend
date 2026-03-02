// store/hooks.ts


import { useDispatch, useSelector } from "react-redux";

// import { AppDispatch, RootState } from "./index";
import type { AppDispatch, RootState } from ".";
import type { TypedUseSelectorHook} from "react-redux";



export const useAppDispatch = ()=> useDispatch<AppDispatch>()
export const useAppSelector: TypedUseSelectorHook<RootState> = useSelector;