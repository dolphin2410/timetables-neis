import React, { useEffect, useState } from "react";
import SchoolData from "../data/SchoolData.ts";
import { formatDate, getThisWeek } from "../api/TimeUtil.ts";
import '../styles/Timetables.css'
import { setSchoolDataLocalStorage } from "../api/LocalStorage.ts";

function edit_grade(setGradeNum: (arg0: number)=>void, x: React.KeyboardEvent<HTMLSpanElement>) {
    if(x.key === 'Enter') {
        x.preventDefault()

        let newGrade = parseInt((x.target as HTMLSpanElement).innerText)
        if (newGrade != null) {
            setGradeNum(newGrade)
        } else {
            setGradeNum(getGrade())
        }
    }
}

function edit_class(setClassNum: (arg0: number)=>void, x: React.KeyboardEvent<HTMLSpanElement>) {
    if(x.key === 'Enter') {
        x.preventDefault()

        let newGrade = parseInt((x.target as HTMLSpanElement).innerText)
        if (newGrade != null) {
            setClassNum(newGrade)
        } else {
            setClassNum(getClass())
        }
    }
}

function getGrade() {
    let gradeData = localStorage.getItem("pretty-timetables-grade")

    if (gradeData === null || parseInt(gradeData) === null) return 1

    return parseInt(gradeData)
}

function getClass() {
    let classData = localStorage.getItem("pretty-timetables-class")

    if (classData === null || parseInt(classData) === null) return 1

    return parseInt(classData)
}

function setGradeLocalStorage(gradeNum) {
    localStorage.setItem("pretty-timetables-grade", gradeNum)
}

function setClassLocalStorage(classNum) {
    localStorage.setItem("pretty-timetables-class", classNum)
}

async function getTimetableInfo(date, grade, classNum, atpt_code, school_code): Promise<[string, string][]> {
    let baseUri = process.env.REACT_APP_NEIS_CLASS_TIMETABLE_URI
    let key = process.env.REACT_APP_NEIS_API_KEY

    let uri = `${baseUri}?KEY=${key}&SD_SCHUL_CODE=${school_code}&ATPT_OFCDC_SC_CODE=${atpt_code}&Type=json&pIndex=1&pSize=100&ALL_TI_YMD=${date}&GRADE=${grade}&CLASS_NM=${classNum}`

    let data = await (await fetch(uri)).json()
    if ('hisTimetable' in data) {
        return data['hisTimetable'][1]['row'].map(x => {
            return [x['PERIO'], x['ITRT_CNTNT']]
        })
    } else {
        return [['null', 'null']]
    }
}

export default function Timetables({ school, edit_school }: { school: SchoolData, edit_school: () => void }) {
    let [timetables, setTimetables] = useState<[string, string][][]>([])

    let [gradeNum, setGradeNum] = useState(getGrade())
    let [classNum, setClassNum] = useState(getClass())

    //! todo save current grade and class

    useEffect(() => {
        setSchoolDataLocalStorage(school)
    
        let dateString = getThisWeek().map(x => {
            return formatDate(x)
        });
    
        (async () => {
            return await Promise.all(dateString.map(async x => {
                return await getTimetableInfo(x, gradeNum, classNum, school.atpt_code, school.school_code)
            }))
        })().then(x => {
            let arr: [string, string][][] = []

            for (let i = 0; i < 7; i++) {
                let temp: [string, string][] = []
                for (let j = 0; j < 5; j++) {
                    if (i in x[j]) {
                        temp.push(x[j][i])
                    } else {
                        temp.push(["", ""])
                    }
                }
                arr.push(temp)
            }

            if (arr[0][0][1] === "null") {
                alert("invalid data")
                setGradeNum(getGrade())
                setClassNum(getClass())
                window.location.reload()
            }

            setTimetables(arr)
            setGradeLocalStorage(gradeNum)
            setClassLocalStorage(classNum)
        })
      }, [school, gradeNum, classNum]);

    return (
        <div className="timetable">
            <div className="timetable-title">
                <h3>{ school.school_name } <span className="no-outline" contentEditable="true" onKeyDown={e => edit_grade(setGradeNum, e)}>{ gradeNum }</span> 학년 <span className="no-outline" contentEditable="true" onKeyDown={e => edit_class(setClassNum, e)}>{ classNum }</span>반</h3>
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