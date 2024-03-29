import { FC, useState } from "react";
import { gql, useMutation, useQuery } from "@apollo/client";
import Calendario from "./Calendario/Calendario";
import VacasAdmin from "./GestionAdmin/AusenciasAdmin";

type ausen = {
    _id: string;
    idAusencia: string;
    diasVacas: string[];
    estado: string
}

const SET_VACAS = gql`
mutation Mutation($idAusencia: String!, $fhasta: String, $fdesde: String) {
    setAusencia(idAusencia: $idAusencia, Fhasta: $fhasta, Fdesde: $fdesde) {
      diasVacas
    }
  }
`

const GETVACAS = gql`
query Query {
    getAusenciaUsu {
      _id
      idAusencia
      diasVacas
      estado
    }
  }
`

const DELETEVACAS = gql`
mutation Mutation($id: String) {
    deleteAusencia(_id: $id) {
      _id
    }
  }
`

const Ausencias: FC<{
    reloadHandler: () => void;
    diasHabiles: number;
    permisos: string;
}> = ({ reloadHandler, diasHabiles, permisos }) => {
    const [pantalla, setPantalla] = useState<number>(0)

    const [desde, setDesde] = useState<string>("");
    const [hasta, setHasta] = useState<string>("");
    const [ausencia, setAusencia] = useState<string>("");

    const [setVacas] = useMutation(SET_VACAS);
    const [deleteVacas] = useMutation(DELETEVACAS);

    const { data, loading, error } = useQuery<{ getAusenciaUsu: ausen[] }>(
        GETVACAS,
        {
            context: {
                headers: {
                    authorization: localStorage.getItem("token")
                }
            }
        }
    );

    const ausenAceptadas: string[][] | undefined = [];
    if (data) {
        for (const e of data.getAusenciaUsu) {
            if (e.estado === "Aceptada") {
                ausenAceptadas.push(e.diasVacas);
            }
        };
    }

    if (loading) return <div>Loading...</div>;
    if (data && error) return <div>Error :(</div>;

    return (
        <div className="flex h-screen flex-col md:pl-[190px]">
            {pantalla === 0 &&
                <div>
                    <button className="border-black-300 border-2 m-2 bg-slate-400 hover:bg-slate-300 text-black border- font-bold py-2 px-4 rounded transition-colors duration-300" onClick={() => {
                        setPantalla(1);
                    }}>Añadir ausencias</button>
                    {permisos === "Administrador" &&
                        <button className="border-black-300 border-2 m-2 bg-slate-400 hover:bg-slate-300 text-black font-bold py-2 px-4 rounded transition-colors duration-300" onClick={() => {
                            setPantalla(2);
                        }}>Gestionar Ausencia</button>
                    }
                    <Calendario key={""} ausencias={ausenAceptadas}></Calendario>
                    <div className=" my-5 underline underline-offset-1 mx-5">Tus Ausencia</div>
                    <div className="grid grid-cols-3">
                        {data?.getAusenciaUsu.map((e) => (
                            <div key={e._id} className="m-5 border-colapse h-max w-max border-2 border-black text bg-amber-100 border-double p-2">
                                <div className="font-bold">Dias</div>
                                {new Date(e.diasVacas[0]).toLocaleDateString()} - {new Date(e.diasVacas[e.diasVacas.length - 1]).toLocaleDateString()}
                                <div className="font-bold">Identificador Ausencia</div>
                                <div className="p-2"> {e.idAusencia} </div>
                                <div className="font-bold">Estado</div>
                                <div className="p-2">{e.estado}</div>
                                <button className="m-2 hover:bg-slate-300 text-black font-bold py-2 px-2 rounded transition-colors duration-300" onClick={() => {
                                    if (e.estado === "Solicitada") {
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
                                    } else window.alert("Solo se pueden borrar Ausencia en estado Solicitadas");
                                }}><svg style={{ fill: 'black' }} xmlns="http://www.w3.org/2000/svg" height="1em" viewBox="0 0 448 512">
                                        <path d="M135.2 17.7L128 32H32C14.3 32 0 46.3 0 64S14.3 96 32 96H416c17.7 0 32-14.3 32-32s-14.3-32-32-32H320l-7.2-14.3C307.4 6.8 296.3 0 284.2 0H163.8c-12.1 0-23.2 6.8-28.6 17.7zM416 128H32L53.2 467c1.6 25.3 22.6 45 47.9 45H346.9c25.3 0 46.3-19.7 47.9-45L416 128z" />
                                    </svg></button>
                            </div>
                        ))}
                    </div>
                </div>
            }
            {pantalla === 1 &&
                <div>
                    <button className="border-black-300 border-2 m-2 bg-slate-400 hover:bg-slate-300 text-black font-bold py-2 px-4 rounded transition-colors duration-300" onClick={() => {
                        setPantalla(0)
                    }}>&lt;</button>
                    <div className="p-3 font-serif">Dias disponibles: {diasHabiles}<br></br></div>
                    <div className="flex justify-start p-4 underline underline-offset-1 font-serif">Selecciona la fecha de inicio y de fin de tus ausencias</div>
                    <div className="block mx-4">
                        <span className="after:content-['*'] after:ml-0.5 after:text-red-500 block text-lg m-2  font-medium text-slate-700 mt-5">
                            Fecha Inicio
                        </span>
                        <input className="mt-1 px-3 py-2 bg-white border shadow-sm border-slate-300 placeholder-slate-400 focus:outline-none focus:border-sky-500 focus:ring-sky-500 block rounded-md sm:text-lg m-2  focus:ring-1"
                            type="date"
                            value={desde}
                            onChange={(e) => setDesde(e.target.value)}
                            placeholder="mm/dd/yyyy"
                        />
                    </div>
                    <div className="block mx-4">
                        <span className="after:content-['*'] after:ml-0.5 after:text-red-500 block text-lg m-2  font-medium text-slate-700 mt-5">
                            Fecha Fin
                        </span>
                        <input className="mt-1 px-3 py-2 bg-white border shadow-sm border-slate-300 placeholder-slate-400 focus:outline-none focus:border-sky-500 focus:ring-sky-500 block rounded-md sm:text-lg m-2  focus:ring-1"
                            type="date"
                            value={hasta}
                            onChange={(e) => setHasta(e.target.value)}
                            placeholder="dd/mm/yyyy"
                        />
                    </div>
                    <div className="block mx-4">
                        <span className="after:content-['*'] after:ml-0.5 after:text-red-500 block text-lg m-2  font-medium text-slate-700 mt-5">
                            Identificador de la Ausencia
                        </span>
                        <select onChange={(e) => setAusencia(e.target.value)} className="mt-1 px-3 py-2 bg-white border shadow-sm border-slate-300 placeholder-slate-400 focus:outline-none focus:border-sky-500 focus:ring-sky-500 rounded-md sm:text-lg m-2  focus:ring-1">
                            <option></option>
                            <option value="PE">PE - Permiso Enfermedad</option>
                            <option value="PP">PP - Permiso Personal</option>
                            <option value="V">V - Vacaciones</option>
                        </select>
                    </div>
                    <button className="border-black-300 border-2 m-2 bg-slate-400 hover:bg-slate-300 text-black font-bold py-2 px-4 rounded transition-colors duration-300" onClick={() => {
                        if (hasta === "" && desde === "") window.alert("CUIDADO, no estas añadiendo ninguna fecha en algun parametro.")
                        else if (new Date(hasta) < new Date(desde)) window.alert("CUIDADO, estas poniendo una fecha de fin inferior a la fecha de inicio.")
                        else if (diasHabiles === 0) window.alert("No te quedan dias de Ausencia.")
                        else if (ausencia === "") window.alert("La ausencia debe tener un id")
                        else if (new Date(hasta) < new Date() || new Date(desde) < new Date()) window.alert("Las fechas tienen que ser posteriores al dia de hoy.")
                        else {
                            let incluye: boolean = true;

                            if (data) {
                                for (const e of data.getAusenciaUsu) {
                                    if (e.estado !== "Denegada") {
                                        for (const a of e.diasVacas) {
                                            if (new Date(a).toLocaleDateString() === new Date(desde).toLocaleDateString() || new Date(a).toLocaleDateString() === new Date(hasta).toLocaleDateString()) {
                                                incluye = false;
                                                break;
                                            }
                                        }
                                    }
                                }
                            }
                            if (incluye === true) {
                                setVacas({
                                    variables: {
                                        fhasta: hasta,
                                        fdesde: desde,
                                        idAusencia: ausencia
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
                            } else window.alert("Ya tienes ausencias seleccionadas con esa fecha.")
                        }
                    }
                    }>Aceptar</button>
                </div>
            }
            {
                pantalla === 2 &&
                <div>
                    <button className="border-black-300 border-2 m-2 bg-slate-400 hover:bg-slate-300 text-black font-bold py-2 px-4 rounded transition-colors duration-300" onClick={() => {
                        setPantalla(0)
                    }}>&lt;</button>
                    {permisos === "Administrador" &&
                        <VacasAdmin reloadHandler={reloadHandler}></VacasAdmin>
                    }
                </div>
            }
        </div >
    )
}

export default Ausencias;
