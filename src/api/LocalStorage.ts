import SchoolData from "../data/SchoolData"

export function setSchoolDataLocalStorage(data: SchoolData) {
    localStorage.setItem("pretty-timetables-schooldata", JSON.stringify(data))
}

export function getSchoolDataLocalStorage(): SchoolData | null {
    let schoolDataString = localStorage.getItem("pretty-timetables-schooldata") || ""
    try {
        return JSON.parse(schoolDataString) as SchoolData
    } catch {
        return null
    }
}