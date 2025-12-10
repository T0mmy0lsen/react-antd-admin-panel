import {Main} from "react-antd-admin-panel";

const faculty = (faculty: string) => {
    let text = {
        tek: 'Det Tekniske Fakultet',
        hum: 'Det Humanistiske Fakultet',
        sam: 'Det Samfundsfaglige Fakultet',
        sun: 'Det Sundhedsvidenskabenlige Fakultet',
        nat: 'Det Naturvidenskabenlige Fakultet',
    }
    return text[faculty.toLowerCase()];
}

const facultyEnums = (faculty: string, main: Main) => {
    return main.Store.faculty.find(r => r.facultyCode.toLowerCase() === faculty)?.facultyId;
}

const facultyById = (id, faculties: any[]) => {
    let faculty = '';
    faculties.forEach(r => {
        if (r.facultyId === id) faculty = r.hierarchyName;
    });
    return faculty;
}

const facultyIdByCode = (code, faculties: any[]) => {
    let faculty = '';
    faculties.forEach(r => {
        if (r.facultyCode.toLowerCase() === code.toLowerCase()) faculty = r.facultyId;
    });
    return faculty;
}

const facultyHeader = (main: Main) => {
    return ({ 'Faculty': facultyEnums(main.$params('faculty'), main) });
}

const instroleFromId = (v: any, main: Main) => {
    return main.Store.instrole.find((c: any) => c.id == v)?.type ?? 'Ukendt'
}

const cityFromId = (v: any, main: Main) => {
    return main.Store.cities.find((c: any) => c.id == v)?.name ?? 'Alle'
}

export default {
    faculty,
    facultyById,
    facultyEnums,
    facultyIdByCode,
    facultyHeader,
    cityFromId,
    instroleFromId,
}