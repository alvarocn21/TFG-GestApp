import { FC, useState } from "react";
import { gql, useMutation, useQuery } from "@apollo/client";

const GETTRABAJOREGMES = gql`
query Query($mes: String, $anio: String) {
    getTrabajoRegMens(mes: $mes, anio: $anio) {
      Fdesde
      _id
      comentario
      fecha
      persona
      tiempo
      trabajoRealizado
    }
  }
`

type TrabajoReg = {
    tiempo: number;
    trabajoRealizado: string;
    Fdesde: string;
    comentario: string;
}

const RegHorasMensual: FC<{
    reloadHandler: () => void;
}> = ({ reloadHandler }) => {
    const [mostrar, setMostrar] = useState<boolean>(false);

    const [mes, setMes] = useState<string>("");
    const [anio, setAnio] = useState<string>("");

    const { data, loading, error } = useQuery<{ getTrabajoRegMens: TrabajoReg[] }>(
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

    const descargarTxt = () => {
        const contenido = JSON.stringify(data?.getTrabajoRegMens);

        const blob = new Blob([contenido], { type: "text/plain" });

        const url = URL.createObjectURL(blob);

        const link = document.createElement("a");
        link.href = url;
        link.download = "mi-archivo.txt";
        link.click();

        URL.revokeObjectURL(url);
    };

    if (loading) return <div>Cargando...</div>
    if (data && error) return <div>Error...</div>

    return (
        <div className="mx-10 mt-10">Registro de horas mensual
            <div className="flex items-center mb-4">
                <select className="mr-2">
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
                <select>
                    <option value="2023">2023</option>
                    <option value="2024">2024</option>
                </select>
            </div><br />
            <button className="mr-2" onClick={() =>
                setMostrar(true)
            }>Mostrar</button><br /><br />
            <button className="mb-10" onClick={descargarTxt}>Descargar txt</button>
            {mostrar === true &&
                <div>
                    {data?.getTrabajoRegMens.map((e) => (
                        <div>
                            F_desde: {e.Fdesde}<br />
                            Tiempo: {e.tiempo}<br />
                            Trabajo realizado: {e.trabajoRealizado}<br />
                            Comentario: {e.comentario}<br /><br />
                        </div>
                    ))}
                </div>
            }
        </div>
    )
}

export default RegHorasMensual;
