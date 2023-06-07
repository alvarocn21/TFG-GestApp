import { FC, useState } from "react";
import { gql, useMutation, useQuery } from "@apollo/client";

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
    reloadHandler: () => void;
}> = ({ reloadHandler }) => {
    const [anio, setAnio] = useState<string>("");
    const [mes, setMes] = useState<string>("");

    const [mostrar, setMostrar] = useState<boolean>(false);

    const { data, loading, error } = useQuery<{ getFichajeMens: Fichaje[] }>(
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

    console.log(data?.getFichajeMens);
    const datos = data?.getFichajeMens.map((e: Fichaje) => {
        if (data.getFichajeMens.indexOf(e) % 2 === 0) return { Regitros: "Entrada", fichaje: { _id: e._id, fecha: e.fecha, hora: e.hora, motivo: e.motivo } }
        else return { Regitros: "Salida", fichaje: { _id: e._id, fecha: e.fecha, hora: e.hora, motivo: e.motivo } }
    })



    const descargarTxt = () => {
        const contenido = data ? JSON.stringify(datos) : "No hay registros para ese mes y año";

        console.log(contenido)

        const blob = new Blob([contenido], { type: "text/plain" });

        const url = URL.createObjectURL(blob);

        const link = document.createElement("a");
        link.href = url;
        link.download = "mi-archivo.txt";
        link.click();

        URL.revokeObjectURL(url);
    };

    return (
        <div className="mx-10 mt-10">Fichaje Mensual
            <div className="flex items-center mb-4">
                <select className="mr-2" onChange={(e) => setMes(e.target.value)}>
                    <option value=""></option>
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
                <select onChange={(e) => setAnio(e.target.value)}>
                    <option value=""></option>
                    <option value="2023">2023</option>
                    <option value="2024">2024</option>
                </select>
            </div><br />
            <button className="mr-2" onClick={() =>
                setMostrar(true)
            }>Mostrar</button><br /><br />
            <button className="mb-10" onClick={descargarTxt}>Descargar txt</button>
            {mostrar === true &&
                <div className="my-4 flex flex-row">
                    <table className="w-full text-left">
                        <thead>
                            <tr>
                                <th className={"flex-1"}>Registro</th>
                                <th className={"flex-1"}>Fecha</th>
                                <th className={"flex-1"}>Hora</th>
                                <th className={"flex-1"}>Motivo</th>
                            </tr><br/>
                        </thead>
                        {datos?.map((e) => (
                            <tbody>
                                <tr>
                                    <td>{e.Regitros}</td>
                                    <td>{(new Date(e.fichaje.fecha).toLocaleDateString())}</td>
                                    <td>{e.fichaje.hora}</td>
                                    <td>{e.fichaje.motivo}</td>
                                </tr><br/>
                            </tbody>
                        ))}
                    </table>
                </div>
            }
        </div>
    )
}

export default FichajeMensual;
