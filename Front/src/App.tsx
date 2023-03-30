import { ApolloClient, ApolloProvider, InMemoryCache } from '@apollo/client';
import React, { FC, useState } from 'react';
import './App.css';
import Contenedor from './components/Contenedor';


const App: FC = () => {
  const [reload, setReload] = useState<boolean>(true);

  const reloadHandler = () => {
    setReload(!reload);
  }

  const client = new ApolloClient({
    uri: "http://localhost:4000",
    cache: new InMemoryCache(),
  });

  return (
    <ApolloProvider client={client}>
      <div className=' h-max'>
        {/* <div className=" invisible">Learn React</div> */}
        <Contenedor reloadHandler={reloadHandler}/>
      </div>
    </ApolloProvider>
  );
}

// const App :FC= () => {
//   return (
//     <div className='fondo'>
//       <Div>Learn React</Div>
//       <Contenedor/>
//     </div>
//   );
// }

export default App;
