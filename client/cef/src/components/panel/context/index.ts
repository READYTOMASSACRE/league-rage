import { createContext, useContext } from "react"

type currentPage = {
  currentPage: string
  setCurrentPage:(value:string) => void
}

type shrinkNavbar = {
  shrink: boolean
  setShrink:(value: boolean) => void
}

export const CurrentPage = createContext<Partial<currentPage>>({})
export const ShrinkNavbar = createContext<Partial<shrinkNavbar>>({})