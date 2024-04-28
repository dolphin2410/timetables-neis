export function getThisWeek(): Date[] {
    let d = getMonday()
    let dates = [d]
    let current = new Date(d)
    for (let i = 0; i < 4; i++) {
        current = getADayAfter(current)
        dates.push(current)
    }

    return dates
}

export function getNextWeekOf(prior: Date[]): Date[] {
    return prior.map(x => {
        x.setDate(x.getDate() + 7)
        return x
    })
}

function getMonday() {
    let d = new Date()
    let day = d.getDay()
    let newDate;
    if (day >= 1 && day <= 5) {
        newDate = d.getDate() - day + 1
    } else {
        newDate = d.getDate() + (7 - (day === 0 ? 7 : day)) + 1
    }
    return new Date(d.setDate(newDate))
}

function getADayAfter(d): Date {
    let dPrime = new Date(d)

    dPrime.setDate(dPrime.getDate() + 1)

    return dPrime
}

export function formatDate(d: Date): string {
    let month = d.getMonth() >= 9 ? `${d.getMonth() + 1}` : `0${d.getMonth() + 1}`
    let date = d.getDate() >= 10 ? `${d.getDate()}` : `0${d.getDate()}`

    return `${d.getFullYear()}${month}${date}`
}