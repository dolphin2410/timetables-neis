import React, { useState } from "react"
import Search from "./Search.tsx"
import Timetables from "./Timetables.tsx"

export default function App() {
    let [webState, setWebState] = useState("search")
    let [schoolData, setSchoolData] = useState(null)

    return webState === "search" ? <Search click_callback={() => {}} select_school={s => {setSchoolData(s); setWebState("timetables")}} /> : <Timetables school={schoolData!!} edit_school={() => {setWebState("search")}} />
}