import { PageState } from "@/lib/types";
import { createContext, useState } from "react";

interface PageContextType {
    page: PageState;
    changePage: (page: PageState) => void;
}

const PageContext = createContext<PageContextType>({
    page: PageState.HOME,
    changePage: () => {},
})

interface PageProviderProps {
     children: React.ReactNode 
}

const PageProvider = ({ children }: PageProviderProps) => {
    const [page, setPage] = useState(PageState.HOME);

    const changePage = (page: PageState) => {
        setPage(page);
    }

    return (
        <PageContext.Provider value={{ page, changePage }}>
            {children}
        </PageContext.Provider>
    )
}

export { PageContext, PageProvider };