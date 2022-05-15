import { useEffect, useState } from "react";

interface Student {
    id: number;
    name: string;
    class: string;
    origin: string;
}

function App() {
    let [students, setStudents] = useState<Student[]>([]);
    let [addStudent, setAddStudent] = useState<Partial<Student> | undefined>();
    let [studentToChange, setStudentToChange] = useState<Student | undefined>();
    let [loading, setLoading] = useState(true);

    let load = () => fetch('https://demo1.vominhduc.me/api/students')
        .then(res => res.json())
        .then(s => setStudents(s));

    useEffect(() => {
        load().then(() => setLoading(false));
    })

    if (loading) return (
        <div>
            Loading. Please wait...
        </div>
    )

    if (studentToChange) return (
        <div>
            <div>
                ID : <b>{studentToChange.id}</b>
            </div>
            <div>
                <input
                    type='text'
                    value={studentToChange.name} onChange={e => setStudentToChange({
                        ...studentToChange!, name: e.target.value
                    })} />
            </div>
            <div>
                <input
                    type='text'
                    value={studentToChange.class} onChange={e => setStudentToChange({
                        ...studentToChange!, class: e.target.value
                    })} />
            </div>
            <div>
                <input
                    type='text'
                    value={studentToChange.origin} onChange={e => setStudentToChange({
                        ...studentToChange!, origin: e.target.value
                    })} />
            </div>
            <button onClick={() => setStudentToChange(undefined)}>
                Hủy
            </button>
            <button onClick={() => {
                setLoading(true);
                fetch('https://demo1.vominhduc.me/api/students/' + studentToChange!.id, {
                    method: 'PUT',
                    body: JSON.stringify(studentToChange),
                    headers: {
                        'content-type': 'application/json'
                    }
                })
                    .then(load)
                    .then(() => {
                        setStudentToChange(undefined);
                        setLoading(false);
                    })
            }}>
                Lưu
            </button>
        </div>
    )

    let conflict = students.some(s => s.id === addStudent?.id);

    return (
        <div>
            <table>
                <thead>
                    <tr>
                        <th>ID</th>
                        <th>Tên</th>
                        <th>Lớp</th>
                        <th>Quê quán</th>
                        <th>Hành động</th>
                    </tr>
                </thead>
                <tbody>
                    {students.map(s => (
                        <tr key={s.id}>
                            <td>{s.id}</td>
                            <td>{s.name}</td>
                            <td>{s.class}</td>
                            <td>{s.origin}</td>
                            <td>
                                <button
                                    onClick={() => {
                                        setLoading(true);
                                        fetch('https://demo1.vominhduc.me/api/students/' + s.id, {
                                            method: 'DELETE',
                                        }).then(load)
                                            .then(() => setLoading(false))
                                    }}>
                                    Xóa
                                </button>
                                <button onClick={() => setStudentToChange(s)}>
                                    Sửa
                                </button>
                            </td>
                        </tr>
                    ))}
                    <tr>
                        <td>
                            <input
                                type='number'
                                value={addStudent?.id || 0} onChange={e => setAddStudent({
                                    ...(addStudent ?? {}), id: e.target.valueAsNumber || undefined
                                })} />
                        </td>
                        <td>
                            <input
                                type='text'
                                value={addStudent?.name || ''} onChange={e => setAddStudent({
                                    ...(addStudent ?? {}), name: e.target.value
                                })} />
                        </td>
                        <td>
                            <input
                                type='text'
                                value={addStudent?.class || ''} onChange={e => setAddStudent({
                                    ...(addStudent ?? {}), class: e.target.value
                                })} />
                        </td>
                        <td>
                            <input
                                type='text'
                                value={addStudent?.origin || ''} onChange={e => setAddStudent({
                                    ...(addStudent ?? {}), origin: e.target.value
                                })} />
                        </td>
                        <td>
                            <button
                                disabled={!addStudent?.id || !addStudent?.name || !addStudent?.class || !addStudent?.origin || conflict}
                                onClick={() => {
                                    setLoading(true);
                                    fetch('https://demo1.vominhduc.me/api/students/' + addStudent?.id, {
                                        method: 'POST',
                                        body: JSON.stringify(addStudent),
                                        headers: {
                                            'content-type': 'application/json'
                                        }
                                    })
                                        .then(load)
                                        .then(() => {
                                            setAddStudent(undefined);
                                            setLoading(false);
                                        })
                                }}>
                                {conflict ? 'ID bị trùng!' : 'Thêm'}
                            </button>
                        </td>
                    </tr>
                </tbody>
            </table>
        </div>
    )
}

export default App;