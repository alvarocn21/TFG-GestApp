import { FC } from "react";
import { gql, useMutation, useQuery } from "@apollo/client";

type vacas = {
    _id: string;
    correoPersona: string;
    idAusencia: string;
    diasVacas: string[];
    estado: string
}

const GETVACAS = gql`
query Query {
    getVacacionesAdmin {
      _id
      correoPersona
      idAusencia
      diasVacas
      estado
    }
  }
`
const GESTIONAVACAS = gql`
mutation GestionaVacaciones($id: String, $estado: String) {
    gestionaVacaciones(_id: $id, estado: $estado) {
        estado
    }
  }
`



const VacasAdmin: FC<{
    reloadHandler: () => void;
}> = ({ reloadHandler }) => {
    const [gestionaVacas] = useMutation(GESTIONAVACAS);

    const { data, loading, error } = useQuery<{ getVacacionesAdmin: vacas[] }>(
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
        <div>
            <div className="underline underline-offset-1 mx-5">Todas las vacaciones</div>
            <div className="grid grid-cols-3">
                {data?.getVacacionesAdmin.map((e) => (
                    <div key={e._id} className="m-5 border-colapse h-max w-max border-2 border-black text bg-amber-100 border-double p-2">
                        <div className="font-bold">Usuario</div>
                        <div className="p-2">{e.correoPersona}</div>
                        <div className="font-bold">Identificador Ausencia</div>
                        <div className="p-2"> {e.idAusencia} </div>
                        <div className="font-bold">Dias</div>
                        {new Date(e.diasVacas[0]).toLocaleDateString()} - {new Date(e.diasVacas[e.diasVacas.length - 1]).toLocaleDateString()}
                        <div className="font-bold">Estado</div>
                        <div className="p-2">{e.estado}</div>
                        <button className="glass p-2 m-2 bg-amber-700 btn-group mx-4 my-4" onClick={() => {
                            if (e.estado === "Solicitada") {
                                gestionaVacas({
                                    variables: {
                                        id: e._id,
                                        estado: "Aceptada"
                                    },
                                    context: {
                                        headers: {
                                            authorization: localStorage.getItem("token")
                                        }
                                    }
                                }).then(() => {
                                    reloadHandler();
                                });
                            } else window.alert("Solo se pueden Aceptar ausencias Solicitada.")
                        }}>Aceptar</button>
                        <button className="glass p-2 m-2 bg-amber-700 btn-group mx-4 my-4" onClick={() => {
                            if (e.estado === "Solicitada") {
                                gestionaVacas({
                                    variables: {
                                        id: e._id,
                                        estado: "Denegada"
                                    },
                                    context: {
                                        headers: {
                                            authorization: localStorage.getItem("token")
                                        }
                                    }
                                }).then(() => {
                                    reloadHandler();
                                });
                            } else window.alert("Solo se pueden Aceptar ausencias Solicitada.")
                        }}>Denegar</button>
                    </div>

                ))}
            </div>
        </div>
    )
}

export default VacasAdmin;
