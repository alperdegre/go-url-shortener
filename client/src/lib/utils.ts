import { type ClassValue, clsx } from "clsx"
import { twMerge } from "tailwind-merge"
import { Language } from "./types"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export const GO_BASE_URL = "http://localhost:3000"
export const PYTHON_BASE_URL = "http://localhost:123123"
export const LANG_MAP: Record<Language, string> = {
  [Language.GO]: GO_BASE_URL,
  [Language.PYTHON]: PYTHON_BASE_URL
}
export const PROTECTED_ROUTES = [
  "/dashboard",
]
