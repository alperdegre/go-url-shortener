import { type ClassValue, clsx } from "clsx"
import { twMerge } from "tailwind-merge"
import { PageState } from "./types"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export const BASE_URL = "http://localhost:3000"
export const PROTECTED_ROUTES = [
  "/dashboard",
]