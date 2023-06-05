import { FC, useState } from "react";
import { gql, useMutation, useQuery } from "@apollo/client";

const EDITUSER = gql`
mutation Mutation($contrasena: String) {
    editUser(contrasena: $contrasena) {
      _id
    }
  }
`

const FichajeMensual: FC<{
    reloadHandler: () => void;
}> = ({ reloadHandler }) => {

    // const { data, loading, error } = useQuery<{ getFichaje: Fichajes[] }>(
    //     GET_FICHAJE,
    //     {
    //         context: {
    //             headers: {
    //                 authorization: localStorage.getItem("token")
    //             }
    //         },
    //     }
    // );

    return (
        <div className="mx-10 mt-10">
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
                    <option value="2021">2021</option>
                    <option value="2022">2022</option>
                    <option value="2023">2023</option>
                    <option value="2024">2024</option>
                </select>
            </div><br />
            <button className="mr-2">Mostrar</button><br /><br />
            <button>Descargar txt</button>
        </div>
    )
}

export default FichajeMensual;
