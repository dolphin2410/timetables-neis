import React, { useEffect, useState } from "react";
import SchoolData from "../data/SchoolData.ts";
import { formatDate, getNextWeekOf, getThisWeek } from "../api/TimeUtil.ts";
import '../styles/Timetables.css'

function edit_grade() {

}

function edit_class() {

}

function getGrade() {
    let gradeData = localStorage.getItem("pretty-timetables-grade")

    if (gradeData == null || parseInt(gradeData) == null) return 1

    return parseInt(gradeData)
}

function getClass() {
    let classData = localStorage.getItem("pretty-timetables-class")

    if (classData == null || parseInt(classData) == null) return 1

    return parseInt(classData)
}

async function getTimetableInfo(date, grade, classNum, atpt_code, school_code): Promise<[string, string]> {
    let baseUri = process.env.REACT_APP_NEIS_CLASS_TIMETABLE_URI
    let key = process.env.REACT_APP_NEIS_API_KEY

    let uri = `${baseUri}?KEY=${key}&SD_SCHUL_CODE=${school_code}&ATPT_OFCDC_SC_CODE=${atpt_code}&Type=json&pIndex=1&pSize=100&ALL_TI_YMD=${date}&GRADE=${grade}&CLASS_NM=${classNum}`

    let data = await (await fetch(uri)).json()
    return data['hisTimetable'][1]['row'].map(x => {
        return [x['PERIO'], x['ITRT_CNTNT']]
    })
}

function setSchoolData(data) {
    localStorage.setItem("pretty-timetables-schooldata", data)
}

export default function Timetables({ school, edit_school }: { school: SchoolData, edit_school: () => void }) {
    let [timetables, setTimetables] = useState<string[][]>([])

    let [grade_num, setGrade_num] = useState(getGrade())
    let [class_num, setClass_num] = useState(getClass())
    let [_school, set_School] = useState(school)

    //! todo save current grade and class

    useEffect(() => {
        setSchoolData(JSON.stringify(_school))
    
        let dateString = getThisWeek().map(x => {
            return formatDate(x)
        });
    
        (async () => {
            return await Promise.all(dateString.map(async x => {
                return await getTimetableInfo(x, grade_num, class_num, _school.atpt_code, _school.school_code)
            }))
        })().then(x => {
            let arr: string[][] = []

            for (let i = 0; i < 7; i++) {
                let temp: string[] = []
                for (let j = 0; j < 5; j++) {
                    if (i in x[j]) {
                        temp.push(x[j][i])
                    } else {
                        temp.push("")
                    }
                }
                arr.push(temp)
            }
            setTimetables(arr)
        })
      }, []);

    return (
        <div className="timetable">
            <div className="timetable-title">
                <h3>{ school.school_name } <span className="no-outline" contentEditable="true" onKeyDown={edit_grade}>{ grade_num }</span> 학년 <span className="no-outline" contentEditable="true" onKeyDown={edit_class}>{ class_num }</span>반</h3>
            </div>
            <table className="timetable-body">
                <tr>
                    <th>월</th>
                    <th>화</th>
                    <th>수</th>
                    <th>목</th>
                    <th>금</th>
                </tr>
                {timetables!!.map(x => {
                    return <tr>
                        {x.map(y => {
                            return <td className="subjects">{y[1]}</td>
                        })}
                    </tr>
                })}
                <tr>
                    <td align="center" colSpan={5}>
                        <button id="change-school" onClick={edit_school}>학교 변경하기</button>
                    </td>
                </tr>
            </table>
        </div>
    )
}