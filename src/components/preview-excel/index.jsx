import * as XLSX from 'xlsx';
import { useEffect, useState } from 'react';

const ExcelPreview = ({ fileUrl }) => {
    const [data, setData] = useState([]);

    useEffect(() => {
        fetch(fileUrl)
            .then((res) => res.arrayBuffer())
            .then((buffer) => {
                const workbook = XLSX.read(buffer, { type: 'array' });
                const worksheet = workbook.Sheets[workbook.SheetNames[0]];
                const jsonData = XLSX.utils.sheet_to_json(worksheet, { header: 1 });
                setData(jsonData);
            });
    }, [fileUrl]);

    return (
        <div style={{ overflowX: 'auto' }}>
            <table className="table table-bordered">
                <tbody>
                    {data.map((row, rowIndex) => (
                        <tr key={rowIndex}>
                            {row.map((cell, i) => (
                                <td key={i}>{cell}</td>
                            ))}
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
};

export default ExcelPreview;