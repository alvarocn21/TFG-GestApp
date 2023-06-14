import { FC, useState } from "react";
import { gql, useMutation } from "@apollo/client";

const RECUPERARPWD = gql`
mutation Mutation($correo: String) {
    recuperarContrasena(correo: $correo) {
      _id
    }
  }
  `

const RecuperarPWD: FC<{
    setPantallaRecuperarPWS: React.Dispatch<React.SetStateAction<boolean>>;
}> = ({ setPantallaRecuperarPWS }) => {

    const [correo, setCorreo] = useState<string>("");

    const [recuperarContrasena, { error }] = useMutation(RECUPERARPWD, {
        onCompleted: (data) => {
            window.confirm("Revise su correo electronico")
        },
        onError: (error) => {
            console.log(error);
        }
    });

    return (
        <div>
            
                <div className="hero-content flex-col">
                    <div className="text-center lg:text-left">
                        <button className="m-2 text-black font-bold py-2 px-4 rounded transition-colors duration-300" onClick={() => {
                            setPantallaRecuperarPWS(false);
                        }}>Atras</button>
                        <h1 className="text-5xl font-bold">Cambio de contraseña</h1>
                        <p className="py-6">Introduce tu Email</p>
                        <div className="card flex-shrink-0 w-full max-w-sm shadow-2xl bg-base-100">
                            <div className="card-body">
                                {error &&
                                    <div className=" text-red-500">Correo no encontrado</div>
                                }
                                <div className="form-control">
                                    <label className="label">
                                        <span className="label-text">Email:</span>
                                    </label>
                                    <input type="text" placeholder="email" className="input input-bordered" onChange={(e) => setCorreo(e.target.value)} />
                                </div>
                            </div>
                            <label htmlFor="log" className="btn btn-primary" onClick={() => {
                                recuperarContrasena({
                                    variables: {
                                        correo
                                    },
                                });
                            }}>Enviar correo</label>
                        </div>
                </div>
            </div>
        </div>
    )
}

export default RecuperarPWD;