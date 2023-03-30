import { FC, useEffect, useState } from "react";
import { gql, useMutation, useQuery } from "@apollo/client";

type TrabajoReg = {
    _id: string,
    tiempo: number;
    trabajoRealizado: string;
    Fdesde: string;
    comentario: string;
}

const REGHORAS = gql`
mutation Mutation($tiempo: Float, $trabajoRealizado: String, $fdesde: String, $comentario: String) {
    setTrabajoReg(tiempo: $tiempo, trabajoRealizado: $trabajoRealizado, Fdesde: $fdesde, comentario: $comentario) {
      _id
    }
  }
`

const EDIT_REGHORAS = gql`
mutation Mutation($editTrabajoRegId: String, $tiempo: Float, $trabajoRealizado: String, $fdesde: String, $comentario: String) {
    editTrabajoReg(id: $editTrabajoRegId, tiempo: $tiempo, trabajoRealizado: $trabajoRealizado, Fdesde: $fdesde, comentario: $comentario) {
      _id
    }
  }   
`

const DELETE_REGHORAS = gql`
mutation Mutation($deleteTrabajoRegId: String) {
    deleteTrabajoReg(id: $deleteTrabajoRegId) {
      _id
    }
  }
`

const GETREGHORAS = gql`
query Query {
    getTrabajoReg {
      tiempo
      trabajoRealizado
      Fdesde
      comentario
      _id
    }
  }
`

const RegHoras: FC<{
    reloadHandler: () => void;
    horasSemanales: number | undefined;
}> = ({ reloadHandler, horasSemanales }) => {

    const [tiempo, setTiempo] = useState<number>(0);
    const [orden, setOrden] = useState<number>(1);
    const [trabajoRealizado, setTrabajoRealizado] = useState<string>("");
    const [fdesde, setFdesde] = useState<string>("");
    const [comentario, setComentario] = useState<string>("");
    const [id, setId] = useState<string>("");

    const [pantalla, setPantalla] = useState<number>(0);

    const [regHoras] = useMutation(REGHORAS);
    const [editRegHoras] = useMutation(EDIT_REGHORAS);
    const [delteRegHoras] = useMutation(DELETE_REGHORAS);

    const { data, loading, error } = useQuery<{ getTrabajoReg: TrabajoReg[] }>(
        GETREGHORAS,
        {
            context: {
                headers: {
                    authorization: localStorage.getItem("token")
                }
            }
        }
    );

    let a = 0;
    let registros = data?.getTrabajoReg.map((e) => {
        a = a + e.tiempo;
        return {
            _id: e._id,
            comentario: e.comentario,
            Fdesde: e.Fdesde,
            tiempo: e.tiempo,
            trabajoRealizado: e.trabajoRealizado,
        }
    })

    if (loading) return <div>Loading...</div>;
    if (error) return <div>Error :(</div>;

    console.log(orden);


    return (
        <div className="flex h-full flex-1 flex-col md:pl-[190px]">
            {pantalla === 0 &&
                <div>
                    <button className="glass p-1 m-4 bg-amber-700" onClick={() => setPantalla(1)}>Registrar trabajo</button>
                    {horasSemanales && <div className="p-4 font-serif">HORAS RESTANTES: {horasSemanales / 5 - a}</div>}
                    <div>
                        <button className="glass p-1 mx-5 mt-2 bg-slate-600" onClick={() => {
                            setOrden(1);
                        }}>Menor hora Inicio</button>
                        <button className="glass p-1 bg-slate-600" onClick={() => {
                            setOrden(2);
                        }}>Mayor hora Inicio</button>
                    </div>
                    {orden == 1 &&
                        <div>
                            {registros?.sort((o1, o2) => {
                                if (parseInt(o1.Fdesde[0] + o1.Fdesde[1]) + (parseInt(o1.Fdesde[3] + o1.Fdesde[4]) / 60) < parseInt(o2.Fdesde[0] + o2.Fdesde[1]) + (parseInt(o2.Fdesde[3] + o2.Fdesde[4]) / 60)) return -1;
                                else if (parseInt(o1.Fdesde[0] + o1.Fdesde[1]) + (parseInt(o1.Fdesde[3] + o1.Fdesde[4]) / 60) > parseInt(o2.Fdesde[0] + o2.Fdesde[1]) + (parseInt(o2.Fdesde[3] + o2.Fdesde[4]) / 60)) return 1;
                                else return 0;
                            }).map((e) => (
                                <div className="m-5 border-colapse h-max w-max border-2 border-black text bg-amber-100 border-double p-2">
                                    <div className="font-bold">Tiempo</div> {e.tiempo} h
                                    <div className="font-bold">Trabajo Realizado</div> {e.trabajoRealizado}
                                    <div className="font-bold">Hora de comienzo</div> {e.Fdesde} h
                                    <div className="font-bold">Comentario</div>
                                    <div className="p-2">{e.comentario}</div>
                                    <button className="glass p-2 m-2 bg-amber-700 btn-group mx-4 my-4" onClick={() => {
                                        setTiempo(e.tiempo);
                                        setTrabajoRealizado(e.trabajoRealizado);
                                        setFdesde(e.Fdesde);
                                        setComentario(e.comentario);
                                        setId(e._id);
                                        setPantalla(2);
                                    }}>Editar</button>
                                    <button className="glass p-2 m-2 bg-amber-700 btn-group mx-4 my-4" onClick={() => {
                                        delteRegHoras({
                                            variables: {
                                                deleteTrabajoRegId: e._id,
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
                    }
                     {orden == 2 &&
                        <div>
                            {registros?.sort((o1, o2) => {
                                if (parseInt(o1.Fdesde[0] + o1.Fdesde[1]) + (parseInt(o1.Fdesde[3] + o1.Fdesde[4]) / 60) < parseInt(o2.Fdesde[0] + o2.Fdesde[1]) + (parseInt(o2.Fdesde[3] + o2.Fdesde[4]) / 60)) return -1;
                                else if (parseInt(o1.Fdesde[0] + o1.Fdesde[1]) + (parseInt(o1.Fdesde[3] + o1.Fdesde[4]) / 60) > parseInt(o2.Fdesde[0] + o2.Fdesde[1]) + (parseInt(o2.Fdesde[3] + o2.Fdesde[4]) / 60)) return 1;
                                else return 0;
                            }).reverse().map((e) => (
                                <div className="m-5 border-colapse h-max w-max border-2 border-black text bg-amber-100 border-double p-2">
                                    <div className="font-bold">Tiempo</div> {e.tiempo} h
                                    <div className="font-bold">Trabajo Realizado</div> {e.trabajoRealizado}
                                    <div className="font-bold">Hora de comienzo</div> {e.Fdesde} h
                                    <div className="font-bold">Comentario</div>
                                    <div className="p-2">{e.comentario}</div>
                                    <button className="glass p-2 m-2 bg-amber-700 btn-group mx-4 my-4" onClick={() => {
                                        setTiempo(e.tiempo);
                                        setTrabajoRealizado(e.trabajoRealizado);
                                        setFdesde(e.Fdesde);
                                        setComentario(e.comentario);
                                        setId(e._id);
                                        setPantalla(2);
                                    }}>Editar</button>
                                    <button className="glass p-2 m-2 bg-amber-700 btn-group mx-4 my-4" onClick={() => {
                                        delteRegHoras({
                                            variables: {
                                                deleteTrabajoRegId: e._id,
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
                    }
                </div>
            }
            {pantalla === 1 &&
                <div>
                    <button className="glass p-2 m-2 bg-amber-700 btn-group mx-4 my-4" onClick={() =>
                        setPantalla(0)
                    }>atras</button>
                    <div className="flex justify-start p-4 underline underline-offset-1 font-serif">Añade el trabajo realizado</div>
                    <div className="block mx-4">
                        <span className="after:content-['*'] after:ml-0.5 after:text-red-500 block text-sm font-medium text-slate-700 mt-5">
                            Tiempo dedicado (en horas)
                        </span>
                        <input className="m-2 mt-1 px-3 py-2 bg-white border shadow-sm border-slate-300 placeholder-slate-400 focus:outline-none focus:border-sky-500 focus:ring-sky-500 block rounded-md sm:text-sm focus:ring-1"
                            step="0.1"
                            type="number"
                            value={tiempo}
                            onChange={(e) => setTiempo(e.target.valueAsNumber)}
                            min="0"
                        ></input>
                    </div>
                    <div className="block mx-4">
                        <span className="after:content-['*'] after:ml-0.5 after:text-red-500 block text-sm font-medium text-slate-700 mt-5">
                            Tarea realizada
                        </span>
                        <input className="m-2 mt-1 px-3 py-2 bg-white border shadow-sm border-slate-300 placeholder-slate-400 focus:outline-none focus:border-sky-500 focus:ring-sky-500 block rounded-md sm:text-sm focus:ring-1"
                            type="text"
                            value={trabajoRealizado}
                            onChange={(e) => setTrabajoRealizado(e.target.value)}
                        ></input>
                    </div>
                    <div className="block mx-4">
                        <span className="after:content-['*'] after:ml-0.5 after:text-red-500 block text-sm font-medium text-slate-700 mt-5">
                            Hora de inicio
                        </span>
                        <input className="m-2 mt-1 px-3 py-2 bg-white border shadow-sm border-slate-300 placeholder-slate-400 focus:outline-none focus:border-sky-500 focus:ring-sky-500 block rounded-md sm:text-sm focus:ring-1"
                            type="time"
                            value={fdesde}
                            onChange={(e) => setFdesde(e.target.value)}
                        ></input>
                    </div>
                    <div className="block mx-4">
                        <span className="after:ml-0.5 block text-sm font-medium text-slate-700 mt-5">
                            Comentario
                        </span>
                        <input className="m-2 mt-1 px-3 py-2 bg-white border shadow-sm border-slate-300 placeholder-slate-400 focus:outline-none focus:border-sky-500 focus:ring-sky-500 block rounded-md sm:text-sm focus:ring-1"
                            type="text"
                            value={comentario}
                            onChange={(e) => setComentario(e.target.value)}
                        ></input>
                    </div>
                    <button className="glass p-2 m-2 bg-amber-700 btn-group mx-4 my-4"
                        onClick={() => {
                            if (tiempo === 0) window.alert("Es obligatorio poner el tiempo dedicado a tus tareas.")
                            if (trabajoRealizado === "") window.alert("Es obligatorio poner la tarea realizada.")
                            if (fdesde === "") window.alert("Es obligatorio poner la hora de comienzo.")
                            else {
                                regHoras({
                                    variables: {
                                        tiempo,
                                        trabajoRealizado,
                                        fdesde,
                                        comentario
                                    },
                                    context: {
                                        headers: {
                                            authorization: localStorage.getItem("token")
                                        }
                                    }
                                }).then(() => {
                                    setTiempo(0);
                                    setTrabajoRealizado("");
                                    setFdesde("");
                                    setComentario("");
                                    setPantalla(0);
                                    reloadHandler();
                                });
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
                    <div className="block mx-4">
                        <span className="after:content-['*'] after:ml-0.5 after:text-red-500 block text-sm font-medium text-slate-700 mt-5">
                            Tiempo dedicado
                        </span>
                        <input className="m-2 mt-1 px-3 py-2 bg-white border shadow-sm border-slate-300 placeholder-slate-400 focus:outline-none focus:border-sky-500 focus:ring-sky-500 block rounded-md sm:text-sm focus:ring-1"
                            step="0.1"
                            type="number"
                            value={tiempo}
                            onChange={(e) => setTiempo(e.target.valueAsNumber)}
                            min="0"
                        ></input>
                    </div>
                    <div className="block mx-4">
                        <span className="after:content-['*'] after:ml-0.5 after:text-red-500 block text-sm font-medium text-slate-700 mt-5">
                            Tarea realizada
                        </span>
                        <input className="m-2 mt-1 px-3 py-2 bg-white border shadow-sm border-slate-300 placeholder-slate-400 focus:outline-none focus:border-sky-500 focus:ring-sky-500 block rounded-md sm:text-sm focus:ring-1"
                            type="text"
                            value={trabajoRealizado}
                            onChange={(e) => setTrabajoRealizado(e.target.value)}
                        ></input>
                    </div>
                    <div className="block mx-4">
                        <span className="after:content-['*'] after:ml-0.5 after:text-red-500 block text-sm font-medium text-slate-700 mt-5">
                            Hora de inicio
                        </span>
                        <input className="m-2 mt-1 px-3 py-2 bg-white border shadow-sm border-slate-300 placeholder-slate-400 focus:outline-none focus:border-sky-500 focus:ring-sky-500 block rounded-md sm:text-sm focus:ring-1"
                            type="time"
                            value={fdesde}
                            onChange={(e) => setFdesde(e.target.value)}
                        ></input>
                    </div>
                    <div className="block mx-4">
                        <span className="after:content-['*'] after:ml-0.5 after:text-red-500 block text-sm font-medium text-slate-700 mt-5">
                            Comentario
                        </span>
                        <input className="m-2 mt-1 px-3 py-2 bg-white border shadow-sm border-slate-300 placeholder-slate-400 focus:outline-none focus:border-sky-500 focus:ring-sky-500 block rounded-md sm:text-sm focus:ring-1"
                            type="text"
                            value={comentario}
                            onChange={(e) => setComentario(e.target.value)}
                        ></input>
                    </div>
                    <button className="glass p-2 m-2 bg-amber-700 btn-group mx-4 my-4" onClick={() => {
                        editRegHoras({
                            variables: {
                                editTrabajoRegId: id,
                                trabajoRealizado,
                                fdesde,
                                comentario,
                                tiempo
                            },
                            context: {
                                headers: {
                                    authorization: localStorage.getItem("token")
                                }
                            }
                        }).then(() => {
                            setTiempo(0);
                            setTrabajoRealizado("");
                            setFdesde("");
                            setComentario("");
                            setPantalla(0);
                            reloadHandler();
                        });
                    }}>Aceptar</button>
                </div>
            }
        </div>
    )
}

export default RegHoras;
