import { FC, useState } from "react";
import { gql, useMutation, useQuery } from "@apollo/client";
import DiasMes from "./DiasMes";
import VacasAdmin from "./VacasAdmin";

type vacas = {
    _id: string;
    diasVacas: string[];
    estado: string
}

const SET_VACAS = gql`
mutation Mutation($idAusencia: String!, $fhasta: String, $fdesde: String) {
    setVacaciones(idAusencia: $idAusencia, Fhasta: $fhasta, Fdesde: $fdesde) {
      diasVacas
    }
  }
`

const GETVACAS = gql`
query Query {
    getVacacionesUsu {
      _id
      idAusencia
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

const Vacas: FC<{
    reloadHandler: () => void;
    diasHabiles: number | undefined;
    cargo: string | undefined;
}> = ({ reloadHandler, diasHabiles, cargo }) => {
    const [pantalla, setPantalla] = useState<number>(0)

    const [desde, setDesde] = useState<string>("");
    const [hasta, setHasta] = useState<string>("");
    const [ausencia, setAusencia] = useState<string>("");

    const [setVacas] = useMutation(SET_VACAS);
    const [deleteVacas] = useMutation(DELETEVACAS);

    const { data, loading, error } = useQuery<{ getVacacionesUsu: vacas[] }>(
        GETVACAS,
        {
            context: {
                headers: {
                    authorization: localStorage.getItem("token")
                }
            }
        }
    );

    const vacasAceptadas: string[] | undefined = [];
    if(data){
        console.log(data)
        data.getVacacionesUsu.map((e: any) => {
            if(e.estado === "Aceptada"){
                vacasAceptadas.push(e.diasVacas);
            }
        });
    }

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
                    <DiasMes key={""} vacaciones={vacasAceptadas}></DiasMes>
                    <div className=" my-5 underline underline-offset-1 mx-5">Tus Vacaciones</div>
                    <div className="grid grid-cols-3">
                        {data?.getVacacionesUsu.map((e) => (
                            <div key={e._id} className="m-5 border-colapse h-max w-max border-2 border-black text bg-amber-100 border-double p-2">
                                <div className="font-bold">Dias</div>
                                {new Date(e.diasVacas[0]).toLocaleDateString()} - {new Date(e.diasVacas[e.diasVacas.length - 1]).toLocaleDateString()}
                                <div className="font-bold">Estado</div>
                                <div className="p-2">{e.estado}</div>
                                <button className="glass p-2 m-2 bg-amber-700 btn-group mx-4 my-4" onClick={() => {
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
                                    } else window.alert("Solo se pueden borrar Vacaciones en estado Solicitadas");
                                }}>Eliminar</button>
                            </div>
                        ))}
                    </div>
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
                    <div className="block mx-4">
                        <span className="after:content-['*'] after:ml-0.5 after:text-red-500 block text-sm font-medium text-slate-700 mt-5">
                            Identificador de la Ausencia
                        </span>
                        <select onChange={(e) => setAusencia(e.target.value)} className="m-2 mt-1 px-3 py-2 bg-white border shadow-sm border-slate-300 placeholder-slate-400 focus:outline-none focus:border-sky-500 focus:ring-sky-500 rounded-md sm:text-sm focus:ring-1">
                            <option></option>
                            <option value="PE">PE - Permiso Enfermedad</option>
                            <option value="PP">PP - Permiso Personal</option>
                            <option value="V">V - Vacaciones</option>
                        </select>
                    </div>
                    <button className="glass p-2 m-2 bg-amber-700 btn-group mx-4 my-4" onClick={() => {
                        if (hasta === "" && desde === "") window.alert("CUIDADO, no estas añadiendo ninguna fecha en algun parametro.")
                        else if (new Date(hasta) < new Date(desde)) window.alert("CUIDADO, estas poniendo una fecha de fin inferior a la fecha de inicio.")
                        else if (diasHabiles === 0) window.alert("No te quedan dias de Vacaciones.")
                        else if (ausencia === "") window.alert("La ausencia debe tener un id")
                        else if (new Date(hasta) < new Date() || new Date(desde) < new Date()) window.alert("Las fechas tienen que ser posteriores al dia de hoy.")
                        else {
                            let entra = false;
                            data?.getVacacionesUsu.forEach((e) => {
                                e.diasVacas.forEach((a) => {
                                    if (new Date(a) <= new Date(hasta) && new Date(a) >= new Date(desde)) entra = true;
                                })
                            })
                            if (entra === false) {
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
                    {cargo === "Administrador" &&
                        <VacasAdmin reloadHandler={reloadHandler}></VacasAdmin>
                    }
                </div>
            }
        </div>
    )
}

export default Vacas;
