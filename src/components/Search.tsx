import React, { useState } from "react";
import "../styles/Search.css"
import SchoolData from "../data/SchoolData";

function updateSchoolRecommendations(keyboardEvent: React.KeyboardEvent<HTMLInputElement>, setSchoolList: (a: string[]) => void) {
    let target = keyboardEvent.target as HTMLInputElement

    let baseUri = process.env.REACT_APP_NEIS_SCHOOL_INFO_URI
    let key = process.env.REACT_APP_NEIS_API_KEY
    let uri = `${baseUri}?KEY=${key}&SCHUL_NM=${target.value}&Type=json&pIndex=1&pSize=20`

    fetch(uri).then(r => r.json()).then(j => {
        if ('schoolInfo' in j) {
            setSchoolList(j['schoolInfo'][1]['row'].map(x => x['SCHUL_NM']))
        } else {
            setSchoolList([])
        }
    })
}

function validateAndContinue(schoolList: string[], formEvent: React.FormEvent<HTMLFormElement>, select_school: (schoolName: SchoolData) => void) {
    formEvent.preventDefault()

    let currentInput = (document.querySelector("#school-search-input") as HTMLInputElement).value

    if (schoolList.includes(currentInput)) {
        let baseUri = process.env.REACT_APP_NEIS_SCHOOL_INFO_URI
        let key = process.env.REACT_APP_NEIS_API_KEY
        let uri = `${baseUri}?KEY=${key}&SCHUL_NM=${currentInput}&Type=json&pIndex=1&pSize=20`
    
        fetch(uri).then(r => r.json()).then(j => {
            if ('schoolInfo' in j) {
                let targetSchool = j['schoolInfo'][1]['row'][0]
                select_school({ school_name: targetSchool['SCHUL_NM'], school_code: targetSchool['SD_SCHUL_CODE'], atpt_code: targetSchool['ATPT_OFCDC_SC_CODE'] })
            }
        })

    }
}

export default function Search({ select_school }) {
    let [schoolList, setSchoolList] = useState<string[]>([])

    return (
        <div className="container">
            <div className="container-title">
                <h1>Pretty Timetables</h1>
            </div>
            <div className="container-body">
                <div className="search-title">
                    <h5>학교검색</h5>
                </div>
                <div className="search-body">
                    <form className="search-input-container" action="" onSubmit={e => validateAndContinue(schoolList, e, select_school)}>
                        <input id="school-search-input" className="search-input" list="school-list" type="text" placeholder="search school" onKeyUp={e => updateSchoolRecommendations(e, setSchoolList)} />
                        <datalist id="school-list">
                            {
                                schoolList.map((e, i) => {
                                    return <option key={i} value={e} />
                                })
                            }
                        </datalist>
                    </form>
                </div>
            </div>
            <div className="container-footer">Made by @dolphin2410</div>
        </div>
    )
}