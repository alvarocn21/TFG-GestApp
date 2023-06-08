import { FC, useState } from "react";
import { gql, useQuery } from "@apollo/client";
import { PDFDocument, rgb } from "pdf-lib";

const GETTRABAJOREGMES = gql`
query Query($mes: String, $anio: String) {
    getTrabajoRegMens(mes: $mes, anio: $anio) {
      Fdesde
      _id
      comentario
      fecha
      tiempo
      trabajoRealizado
    }
  }
`

type TrabajoReg = {
    _id: string;
    tiempo: number;
    fecha: string;
    trabajoRealizado: string;
    Fdesde: string;
    comentario: string;
}

const RegHorasMensual: FC<{
    setGenerador: React.Dispatch<React.SetStateAction<string>>;
}> = ({ setGenerador }) => {
    const [mostrar, setMostrar] = useState<boolean>(false);

    const [mes, setMes] = useState<string>("1");
    const [anio, setAnio] = useState<string>("2023");

    const { data, error } = useQuery<{ getTrabajoRegMens: TrabajoReg[] }>(
        GETTRABAJOREGMES,
        {
            variables: {
                mes: mes,
                anio: anio
            },
            context: {
                headers: {
                    authorization: localStorage.getItem("token")
                }
            },
        }
    );

    const descargarPDF = async () => {
        try {
            const pdfDoc = await PDFDocument.create();
            const page = pdfDoc.addPage();

            const datos = data?.getTrabajoRegMens;

            let x = 50;
            let y = page.getHeight() - 50;

            const headers = ['Tarea realizada', 'Fecha', 'Tiempo dedicado', 'Hora Inicio'];

            page.drawText('Tabla de datos:', { x, y, size: 16, color: rgb(0, 0, 0) });
            y -= 30;

            for (const header of headers) {
                page.drawText(header, { x, y, size: 12, color: rgb(0, 0, 0) });
                x += 130;
            }
            y -= 20;
            x = 50;

            if (datos) {
                for (const item of datos) {
                    page.drawText(item.trabajoRealizado, { x, y, size: 10, color: rgb(0, 0, 0) });
                    x += 130;
                    page.drawText(new Date(item.fecha).toLocaleDateString(), { x, y, size: 10, color: rgb(0, 0, 0) });
                    x += 130;
                    page.drawText(`${item.tiempo} h`, { x, y, size: 10, color: rgb(0, 0, 0) });
                    x += 130;
                    page.drawText(item.Fdesde, { x, y, size: 10, color: rgb(0, 0, 0) });
                    x += 130;
                    y -= 20;
                    x = 50;
                }

                const pdfBytes = await pdfDoc.save();

                const blob = new Blob([pdfBytes], { type: 'application/pdf' });

                const url = URL.createObjectURL(blob);

                const link = document.createElement('a');
                link.href = url;
                link.download = 'mi-archivo.pdf';
                link.click();

                URL.revokeObjectURL(url);
            }
        } catch (error) {
            console.error('Error al generar el PDF:', error);
        }
    };

    if (error) return <div>Error...</div>

    return (
        <div className="mx-10 mt-10">
            <button className="border-black-300 border-2 m-2 bg-slate-400 hover:bg-slate-300 text-black font-bold py-2 px-4 rounded transition-colors duration-300" onClick={() => {
                setGenerador("")
            }}>atras</button>
            <div className=" my-5 underline underline-offset-1 mx-5">Registro de horas mensual</div>
            <div className="flex items-center mb-4">
                <select className="mr-2" onChange={(e) => setMes(e.target.value)}>
                    <option value="1">Enero</option>
                    <option value="2">Febrero</option>
                    <option value="3">Marzo</option>
                    <option value="4">Abril</option>
                    <option value="5">Mayo</option>
                    <option value="6">Junio</option>
                    <option value="7">Julio</option>
                    <option value="8">Agosto</option>
                    <option value="9">Septiembre</option>
                    <option value="10">Octubre</option>
                    <option value="11">Noviembre</option>
                    <option value="12">Diciembre</option>
                </select>
                <select onChange={(e) => setAnio(e.target.value)}>
                    <option value="2023">2023</option>
                    <option value="2024">2024</option>
                </select>
            </div><br />
            <button className="mr-2" onClick={() =>
                setMostrar(true)
            }>Mostrar</button><br /><br />
            <button className="mb-10" onClick={descargarPDF}>Descargar PDF</button>
            {mostrar === true &&
                <div className="flex flex-row">
                    <table className="w-full text-left">
                        <thead>
                            <tr>
                                <th>Tarea realizada</th>
                                <th>Fecha</th>
                                <th>Tiempo dedicado</th>
                                <th>Hora Inicio</th>
                                <th>Comentario</th>
                            </tr>
                        </thead>
                        <tbody>
                            {data?.getTrabajoRegMens.map((e) => (
                                <tr key={e._id}>
                                    <td>{e.trabajoRealizado}</td>
                                    <td>{new Date(e.fecha).toLocaleDateString()}</td>
                                    <td>{e.tiempo} h</td>
                                    <td>{e.Fdesde}</td>
                                    <td>{e.comentario}</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            }
        </div>
    )
}

export default RegHorasMensual;
