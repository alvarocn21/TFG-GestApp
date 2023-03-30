import React, { FC, useState } from "react";
//import { gql, useMutation, useQuery } from "@apollo/client";
import { gql, useMutation, useQuery } from "@apollo/client";
import DiasMes from "./DiasMes";

type vacas = {
    _id: string;
    diasVacas: string[];
    estado: string
}

const SET_VACAS = gql`
mutation Mutation($fdesde: String, $fhasta: String) {
    setVacaciones(Fdesde: $fdesde, Fhasta: $fhasta) {
      diasVacas
    }
  }
`

const GETVACAS = gql`
query Query {
    getVacaciones {
      _id
      diasVacas
      estado
    }
  }
`

const DELETEVACAS = gql`
mutation Mutation($id: String) {
    deleteVacaciones(_id: $id) {
      _id
    }
  }
`

const VacasAusenHoras: FC<{
    reloadHandler: () => void;
    diasHabiles: number | undefined;
}> = ({ reloadHandler, diasHabiles }) => {
    const [pantalla, setPantalla] = useState<number>(0)

    const [desde, setDesde] = useState<string>("");
    const [hasta, setHasta] = useState<string>("");

    const [setVacas] = useMutation(SET_VACAS);
    const [deleteVacas] = useMutation(DELETEVACAS);

    const { data, loading, error } = useQuery<{ getVacaciones: vacas[] }>(
        GETVACAS,
        {
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
        <div className="flex h-full flex-1 flex-col md:pl-[190px]">
            {pantalla === 0 &&
                <div>
                    <div className="p-3 font-serif">Dias disponibles: {diasHabiles}<br></br></div>
                    <button className="glass p-2 mx-20 mt-5 bg-amber-700 my-5" onClick={() => {
                        setPantalla(1);
                    }}>Añadir vacaciones</button>
                    <button className="glass p-2 bg-amber-700 " onClick={() => {
                        setPantalla(2);
                    }}>Gestionar Vacaciones</button>
                    <DiasMes vacaciones={data?.getVacaciones}></DiasMes>
                </div>
            }
            {pantalla === 1 &&
                <div>
                    <button className="glass p-2 m-2 bg-amber-700 btn-group mx-4 my-4" onClick={() =>
                        setPantalla(0)
                    }>atras</button>
                    <div className="flex justify-start p-4 underline underline-offset-1 font-serif">Selecciona la fecha de inicio y de fin de tus vacaciones</div>
                    <div className="block mx-4">
                        <span className="after:content-['*'] after:ml-0.5 after:text-red-500 block text-sm font-medium text-slate-700 mt-5">
                            Fecha Inicio
                        </span>
                        <input className="mt-1 px-3 py-2 bg-white border shadow-sm border-slate-300 placeholder-slate-400 focus:outline-none focus:border-sky-500 focus:ring-sky-500 block rounded-md sm:text-sm focus:ring-1"
                            type="date"
                            value={desde}
                            onChange={(e) => setDesde(e.target.value)}
                            placeholder="mm/dd/yyyy"
                        />
                    </div>
                    <div className="block mx-4">
                        <span className="after:content-['*'] after:ml-0.5 after:text-red-500 block text-sm font-medium text-slate-700 mt-5">
                            Fecha Fin
                        </span>
                        <input className="mt-1 px-3 py-2 bg-white border shadow-sm border-slate-300 placeholder-slate-400 focus:outline-none focus:border-sky-500 focus:ring-sky-500 block rounded-md sm:text-sm focus:ring-1"
                            type="date"
                            value={hasta}
                            onChange={(e) => setHasta(e.target.value)}
                            placeholder="dd/mm/yyyy"
                        />
                    </div>
                    <button className="glass p-2 m-2 bg-amber-700 btn-group mx-4 my-4" onClick={() => {
                        if (hasta === "" && desde === "") window.alert("CUIDADO, no estas añadiendo ninguna fecha en algun parametro.")
                        else if (new Date(hasta) < new Date(desde)) window.alert("CUIDADO, estas poniendo una fecha de fin inferior a la fecha de inicio.")
                        else if (diasHabiles === 0) window.alert("No te quedan dias de Vacaciones.")
                        else {
                            let entra = false;
                            data?.getVacaciones.map((e) => {
                                e.diasVacas.map((a) => {
                                    if (new Date(a) <= new Date(hasta) && new Date(a) >= new Date(desde)) entra = true;
                                })
                            })
                            if (entra === false) {
                                setVacas({
                                    variables: {
                                        fhasta: hasta,
                                        fdesde: desde
                                    },
                                    context: {
                                        headers: {
                                            authorization: localStorage.getItem("token")
                                        }
                                    }
                                }).then(() => {
                                    setDesde("")
                                    setHasta("");
                                    reloadHandler();
                                    setPantalla(0)
                                })
                            } else window.alert("Ya tienes vacaciones seleccionadas con esa fecha.")
                        }
                    }
                    }>Aceptar</button>
                </div>
            }
            {pantalla === 2 &&
                <div>
                    <button className="glass p-2 m-2 bg-amber-700 btn-group mx-4 my-4" onClick={() =>
                        setPantalla(0)
                    }>atras</button>
                    <div className="grid grid-cols-5">
                        {data?.getVacaciones.map((e) => (
                            <div className="m-5 border-colapse h-max w-max border-2 border-black text bg-amber-100 border-double p-2">
                                <div className="font-bold">Dias</div>
                                {e.diasVacas.map((a) => (
                                    <div>{new Date(a).toLocaleDateString()}</div>
                                ))}
                                <div className="font-bold">Estado</div>
                                <div className="p-2">{e.estado}</div>
                                <button className="glass p-2 m-2 bg-amber-700 btn-group mx-4 my-4" onClick={() => {
                                    deleteVacas({
                                        variables: {
                                            id: e._id,
                                        },
                                        context: {
                                            headers: {
                                                authorization: localStorage.getItem("token")
                                            }
                                        }
                                    }).then(() => {
                                        reloadHandler();
                                    });
                                }}>Eliminar</button>
                            </div>
                        ))}
                    </div>
                </div>
            }
        </div >
    )
}

export default VacasAusenHoras;
