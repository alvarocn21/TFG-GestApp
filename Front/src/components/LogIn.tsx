import { FC, useState } from "react";
import { gql, useMutation } from "@apollo/client";

const LOGIN = gql`
mutation LogIn($correo: String!, $contrasena: String!) {
    logIn(correo: $correo, contrasena: $contrasena) {
      token
    }
  }
`

// const RECUPERAR_CONTRASEÑA = gql`
// mutation Mutation($hora: String!, $comentario: String!) {
//     setFichaje(hora: $hora, comentario: $comentario) {
//       fecha
//     }
//   }
// `

const LogIn: FC<{
    reloadHandler: () => void;
}> = ({ reloadHandler }) => {
    
    //       // Generate test SMTP service account from ethereal.email
    //       // Only needed if you don't have a real mail account for testing
    //       let testAccount = await nodemailer.createTestAccount();

    //       // create reusable transporter object using the default SMTP transport
    //       let transporter = nodemailer.createTransport({
    //         host: "smtp.ethereal.email",
    //         port: 587,
    //         secure: false, // true for 465, false for other ports
    //         auth: {
    //           user: testAccount.user, // generated ethereal user
    //           pass: testAccount.pass, // generated ethereal password
    //         },
    //       });

    //       // send mail with defined transport object
    //       let info = await transporter.sendMail({
    //         from: '"Fred Foo 👻" <foo@example.com>', // sender address
    //         to: "alvaroocn21@gmail.com, baz@example.com", // list of receivers
    //         subject: "Hello ✔", // Subject line
    //         text: "Hello world?", // plain text body
    //         html: "<b>Hello world?</b>", // html body
    //       });

    //       console.log("Message sent: %s", info.messageId);
    //       // Message sent: <b658f8ca-6296-ccf4-8306-87d57a0b4321@example.com>

    //       // Preview only available when sending through an Ethereal account
    //       console.log("Preview URL: %s", nodemailer.getTestMessageUrl(info));
    //       // Preview URL: https://ethereal.email/message/WaQKMgKddxQDoou...
    //     }

    //     main().catch(console.error);




    const [correo, setCorreo] = useState<string>("");
    const [contrasena, setContrasena] = useState<string>("");

    //const [ RecCont ] = useMutation(RECUPERAR_CONTRASEÑA);

    const [login, { loading, error }] = useMutation(LOGIN, {
        onCompleted: (data) => {
            console.log(`guardo cookie con token ${data.logIn.token}`)
            localStorage.setItem("token", data.logIn.token);
            reloadHandler();
        },
        onError: (error) => {
            console.log(error);
            localStorage.removeItem("token");
        }
    });

    return (
        <div>
            <div className="hero min-h-screen bg-base-200">
                <div className="hero-content flex-col lg:flex-row-reverse">
                    <div className="text-center lg:text-left">
                        <h1 className="text-5xl font-bold">Login now!</h1>
                        <p className="py-6">Bienvenido a GestApp tu gestor de confianza. Disfruta de nuestros servicios.</p>
                    </div>
                    <div className="card flex-shrink-0 w-full max-w-sm shadow-2xl bg-base-100">
                        <div className="card-body">
                            {error &&
                                <div className=" text-red-500">Usuario no registrado</div>
                            }
                            {loading &&
                                <div className=" text-red-500">Cargando...</div>
                            }
                            <div className="form-control">
                                <label className="label">
                                    <span className="label-text">Email</span>
                                </label>
                                <input type="text" placeholder="email" className="input input-bordered" onChange={(e) => setCorreo(e.target.value)} />
                            </div>
                            <div className="form-control">
                                <label className="label">
                                    <span className="label-text">Password</span>
                                </label>
                                <input type="password" placeholder="contrasena" className="input input-bordered" onChange={(e) => setContrasena(e.target.value)} />
                                <label className="label">
                                    <a className="label-text-alt link link-hover">Has olvidado la contraseña?</a>
                                </label>
                            </div>
                            <div className="form-control mt-6">
                                <label htmlFor="log" className="btn btn-primary" onClick={() => {
                                    login({
                                        variables: {
                                            correo,
                                            contrasena
                                        },
                                    });
                                }}>Login</label>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default LogIn;