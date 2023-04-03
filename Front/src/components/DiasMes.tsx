import React, { FC, useState } from "react";
import { gql, useQuery } from "@apollo/client";

type vacas = {
    _id: string;
    diasVacas: string[];
    estado: string
}

type mes = {
    dias: string[];
    meses: string;
}

const GETMES = gql`
query Query($mes: String!) {
    getMes(mes: $mes) {
      dias
      meses
    }
  }
`

const DiasMes: FC<{
    vacaciones: vacas[] | undefined;
}> = (vacaciones) => {
    const meses = ['Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio', 'Julio', 'Agosto', 'Septiembre', 'Octubre', 'Noviembre', 'Diciembre'];

    const fecha: Date = new Date();
    let [numeroMes, setNumeroMes] = useState<number>(fecha.getMonth());
    let [año, setAño] = useState<number>(fecha.getFullYear());
    let mes = meses[numeroMes] + "," + año;

    const { data, loading, error } = useQuery<{ getMes: mes }>(
        GETMES,
        {
            variables: {
                mes: mes
            },
            context: {
                headers: {
                    authorization: localStorage.getItem("token")
                }
            }
        }
    );

    if (loading) return <div>Loading...</div>;
    if (data && error) return <div>Error :(</div>;

    return (
        <div>
            <div className="flex justify-center p-4 underline underline-offset-1 font-serif">{data?.getMes.meses}</div>
            <div className="grid grid-cols-7 mx-5">
                {data?.getMes.dias.map((diaMes: string) => (
                    <div key={diaMes} className="border-colapse h-20 border-2 border-black text bg-amber-100 border-double">
                        <div className="text-center">{new Date(diaMes).toLocaleDateString()}</div>
                        {vacaciones.vacaciones?.map((a: vacas) => (
                            <div key={a._id}>
                                {a.estado !== "Denegada" && a.diasVacas.map((dia: string) => (
                                    <div key={dia}>
                                        {(new Date(diaMes).toLocaleDateString() === new Date(dia.substring(0,10)).toLocaleDateString()?
                                            <div className=" text-rose-500 text-center">VACAS</div>
                                            :
                                            <div className=""></div>
                                        )}
                                    </div>
                                ))}
                            </div>
                        ))}
                    </div>
                ))}
            </div>
            <div className="flex btn-group p-5 justify-center">
                <button className="glass p-2 m-2 bg-amber-700" onClick={() => {
                    if (numeroMes < 1) {
                        setNumeroMes(11);
                        setAño(año - 1);
                    } else {
                        setNumeroMes(numeroMes - 1);
                    }
                }}>Anterior</button>
                <button className="glass p-2 m-2 bg-amber-700" onClick={() => {
                    if (numeroMes > 10) {
                        setNumeroMes(0);
                        setAño(año + 1);
                    } else {
                        setNumeroMes(numeroMes + 1);
                    }
                }}>Siguiente</button>
            </div>
        </div>
    )
}

export default DiasMes;