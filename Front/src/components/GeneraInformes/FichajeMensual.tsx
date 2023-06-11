import { FC, useState } from "react";
import { gql, useQuery } from "@apollo/client";
import { PDFDocument, rgb } from "pdf-lib";

const GETFICHAJEMES = gql`
query Query($mes: String, $anio: String) {
    getFichajeMens(mes: $mes, anio: $anio) {
      _id
      hora
      motivo
      fecha
    }
  }
`

type Fichaje = {
    _id: string;
    motivo: string;
    hora: string;
    fecha: string;
}

const FichajeMensual: FC<{
    setGenerador: React.Dispatch<React.SetStateAction<string>>;
}> = ({ setGenerador }) => {
    const [anio, setAnio] = useState<string>("2023");
    const [mes, setMes] = useState<string>("1");

    const [mostrar, setMostrar] = useState<boolean>(false);

    const { data, error } = useQuery<{ getFichajeMens: Fichaje[] }>(
        GETFICHAJEMES,
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

    if (error) return (<div>Error :(</div>)

    const datos = data?.getFichajeMens.map((e: Fichaje) => {
        if (data.getFichajeMens.indexOf(e) % 2 === 0) return { Regitros: "Entrada", fichaje: { _id: e._id, fecha: e.fecha, hora: e.hora, motivo: e.motivo } }
        else return { Regitros: "Salida", fichaje: { _id: e._id, fecha: e.fecha, hora: e.hora, motivo: e.motivo } }
    })

    const descargarPDF = async () => {
        try {
            const pdfDoc = await PDFDocument.create();
            const page = pdfDoc.addPage();

            let x = 50;
            let y = page.getHeight() - 50;

            const headers = ['Registro', 'Fecha', 'Hora', 'Motivo'];

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
                    page.drawText(item.Regitros, { x, y, size: 10, color: rgb(0, 0, 0) });
                    x += 130;
                    page.drawText(new Date(item.fichaje.fecha).toLocaleDateString(), { x, y, size: 10, color: rgb(0, 0, 0) });
                    x += 130;
                    page.drawText(item.fichaje.hora, { x, y, size: 10, color: rgb(0, 0, 0) });
                    x += 130;
                    page.drawText(item.fichaje.motivo, { x, y, size: 10, color: rgb(0, 0, 0) });
                    x += 130;
                    y -= 20;
                    x = 50;
                }

                const pdfBytes = await pdfDoc.save();

                const blob = new Blob([pdfBytes], { type: 'application/pdf' });

                const url = URL.createObjectURL(blob);

                const link = document.createElement('a');
                link.href = url;
                link.download = 'FichajeMensual.pdf';
                link.click();

                URL.revokeObjectURL(url);
            }
        } catch (error) {
            console.error('Error al generar el PDF:', error);
        }
    };

    return (
        <div className="mx-10 mt-10">
            <button className="border-black-300 border-2 m-2 bg-slate-400 hover:bg-slate-300 text-black font-bold py-2 px-4 rounded transition-colors duration-300" onClick={() => {
                setGenerador("")
            }}>&lt;</button><div className=" my-5 underline underline-offset-1 mx-5">Fichaje Mensual</div>
            <div className="flex items-center mb-4">
                <select className="mr-2 bg-white p-2 m-2" onChange={(e) => setMes(e.target.value)}>
                    <option value="1">Enero</option>
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
                <select className="mr-2 bg-white p-2" onChange={(e) => setAnio(e.target.value)}>
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
                                <th>Registro</th>
                                <th>Fecha</th>
                                <th>Hora</th>
                                <th>Motivo</th>
                            </tr>
                        </thead>
                        <tbody>
                            {datos?.map((e) => (
                                <tr key={e.fichaje._id}>
                                    <td>{e.Regitros}</td>
                                    <td>{new Date(e.fichaje.fecha).toLocaleDateString()}</td>
                                    <td>{e.fichaje.hora}</td>
                                    <td>{e.fichaje.motivo}</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            }
        </div>
    )
}

export default FichajeMensual;
