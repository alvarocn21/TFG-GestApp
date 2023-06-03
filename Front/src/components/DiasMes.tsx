import React, { FC, useState } from "react";
import 'dayjs/locale/es';
import dayjs from 'dayjs';
dayjs.locale('es');

const DiasMes: FC<{
    vacaciones: string[] | undefined;
}> = (vacaciones) => {
    const [fecha, setFecha] = useState(dayjs());

    const prevMonth = () => {
        setFecha(fecha.subtract(1, 'month'));
    };

    const nextMonth = () => {
        setFecha(fecha.add(1, 'month'));
    };

    const dias = vacaciones.vacaciones;

    const renderCalendarDays = () => {
        const daysInMonth = fecha.daysInMonth();
        const firstDayOfMonth = fecha.startOf('month').day()-1;

        const days = [];

        for (let i = 0; i < firstDayOfMonth; i++) {
            days.push(<div className="text-center text-gray-500" key={`empty-${i}`} />);
        }

        for (let day = 1; day <= daysInMonth; day++) {
            const isToday = dayjs().isSame(fecha, 'month') && day === dayjs().date();
            let dateKey = fecha.add(day-fecha.startOf('month').day()+1, 'day').format('MM/DD/YYYY');

            let mes = dateKey[0] + dateKey[1];
            if (dateKey[0] === "0") mes = dateKey[1];
            let dia = dateKey[3] + dateKey[4];
            if (dateKey[3] === "0") dia = dateKey[4];

            dateKey = mes + "/" + dia + "/" + dateKey[6] + dateKey[7] + dateKey[8] + dateKey[9];

            let isHighlighted = false;
            if (dias) {
                for (const dates of dias) {
                    console.log("dates" + dates)
                    console.log("datekey" + dateKey)
                    if (dates.includes(dateKey)) {
                        isHighlighted = true;
                        break;
                    }
                }
            };

            days.push(
                <div
                    className={` m-2 text-center ${isToday ? 'bg-blue-500 text-white' : ''} ${isHighlighted ? 'bg-red-500' : ''}`}
                    key={day}
                >
                    {day}
                </div>
            );
        }

        return days;
    };

    return (
        <div className="m-2 calendar bg-white border border-gray-300 rounded shadow p-4">
            <div className="m-2 flex justify-between items-center mb-4">
                <button
                    className="bg-blue-500 hover:bg-blue-600 text-white px-2 py-1 rounded"
                    onClick={prevMonth}
                >
                    &lt;
                </button>
                <h2 className="m-2 text-xl font-semibold">{fecha.format('MMMM YY')}</h2>
                <button
                    className="bg-blue-500 hover:bg-blue-600 text-white px-2 py-1 rounded"
                    onClick={nextMonth}
                >
                    &gt;
                </button>
            </div>
            <div className="grid grid-cols-7 gap-2">
                <div className="text-center font-semibold">Lunes</div>
                <div className="text-center font-semibold">Martes</div>
                <div className="text-center font-semibold">Miercoles</div>
                <div className="text-center font-semibold">Jueves</div>
                <div className="text-center font-semibold">Viernes</div>
                <div className="text-center font-semibold">Sabado</div>
                <div className="text-center font-semibold">Domingo</div>
            </div>
            <div className="grid grid-cols-7 gap-2">
                {renderCalendarDays()}
            </div>
        </div>
    );
}

export default DiasMes;