import React, { useState } from "react"
import Search from "./Search.tsx"
import Timetables from "./Timetables.tsx"
import { getSchoolDataLocalStorage, setSchoolDataLocalStorage } from "../api/LocalStorage.ts"

export default function App() {
    let [webState, setWebState] = useState("")

    let localStorageSchoolData = getSchoolDataLocalStorage()
    // todo: validate SchoolData

    if (localStorageSchoolData == null || webState === "search") {
        return <Search select_school={s => {setSchoolDataLocalStorage(s); setWebState("timetables")}} />
    } else {
        return <Timetables school={localStorageSchoolData!!} edit_school={() => setWebState("search")} />
    }
}