import type { NextPage } from "next";
import Head from "next/head";
import { useState, useEffect, JSXElementConstructor, Key, ReactElement, ReactFragment, ReactPortal } from "react";
import toast, { Toaster } from 'react-hot-toast';
import useSWR from 'swr';

type TechnologyCardProps = {
  name: string;
  description: string;
  documentation: string;
};

const Home: NextPage = () => {
  const [loggedIn, setLoggedIn] = useState(false);
  const [sessionId, setSessionId] = useState("");
  const [loading, setLoading] = useState(true);
  const [userId, setUserId] = useState("");
  const [password, setPassword] = useState("");
  const [openModal, setOpenModal] = useState(false);
  const [modalTitle, setModalTitle] = useState("");
  const [modalContent, setModalContent] = useState("");
  const [modalAction, setModalAction] = useState("");
  const [modalError, setModalError] = useState(false);
  const [relayerAddress, setRelayerAddress] = useState("");
  const fetcher = (url: RequestInfo | URL) => fetch(url).then(res => res.json())
  const { data, error } = useSWR('/api/list', fetcher)


  const incorrectCred = () => toast.error('Incorrect Credentials. Please try again.');
  const signInLogin = () => toast.loading('Logging in...', {duration: 800});
  


  function signup() {
    signInLogin();
    fetch("/api/auth", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        email: userId,
        password: password,
      }),
    })
      .then(async (res) => await res.json())
      .then((res) => {
        const { sessionId: session, success, publicKey } = res;
        if (success) {
          setLoggedIn(true);
          setSessionId(session);
          setRelayerAddress(publicKey);
          toast('Welcome!', {
            icon: '👋',
          });
          
        } else {
          incorrectCred();
        }
      });
  }

  function generateAuthToken() {
    const password = prompt("Enter your password");
    fetch("/api/gen", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        sessionId,
        password,
      }),
    })
      .then(async (res) => await res.json())
      .then((res) => {
        console.log(res);
        showModal(
          "Generated new API Keys!",
          <>
            <p>Here is your credentials to access the relayer SDK: </p>
            <br />
            <br />
            <code>{JSON.stringify(res, null, 2)}</code>
            <br />
            <br />
            <p>
              The secret will never be shown again, make sure to save it in a
              safe place.
            </p>
          </>,
          "Thanks"
        );
      });
  }

  function showModal(title: string, body: any, button: string) {
    setOpenModal(true);
    setModalTitle(title);
    setModalContent(body);
    setModalAction(button);
  }

  function displayAddress(address: string) {
    return (
      address.substring(0, 6) + "..." + address.substring(address.length - 4)
    );
  }

  return (
    <>
      <Head>
        <title>Create T3 App</title>
        <meta name="description" content="Generated by create-t3-app" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <div className="min-h-screen bg-black">
        <Toaster />
        {openModal ? (
          <div
            className="relative z-10"
            aria-labelledby="modal-title"
            role="dialog"
            aria-modal="true"
          >
            <div className="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity"></div>
            <div className="fixed z-10 inset-0 overflow-y-auto">
              <div className="flex items-end sm:items-center justify-center min-h-full p-4 text-center sm:p-0">
                <div className="relative bg-white rounded-lg text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:max-w-lg sm:w-full">
                  <div className="bg-white px-4 pt-5 pb-4 sm:p-6 sm:pb-4">
                    <div className="sm:flex sm:items-start">
                      {/* <!-- Heroicon name: outline/exclamation --> */}
                      {modalError ? (
                        <div className="mx-auto flex-shrink-0 flex items-center justify-center h-12 w-12 rounded-full bg-red-100 sm:mx-0 sm:h-10 sm:w-10">
                          <svg
                            className="h-6 w-6 text-red-600"
                            xmlns="http://www.w3.org/2000/svg"
                            fill="none"
                            viewBox="0 0 24 24"
                            strokeWidth="2"
                            stroke="currentColor"
                            aria-hidden="true"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
                            />
                          </svg>
                        </div>
                      ) : (
                        <div className="mx-auto flex-shrink-0 flex items-center justify-center h-12 w-12 rounded-full bg-green-100 sm:mx-0 sm:h-10 sm:w-10">
                          <svg
                            xmlns="http://www.w3.org/2000/svg"
                            className="h-6 w-6"
                            fill="none"
                            viewBox="0 0 24 24"
                            stroke="currentColor"
                            strokeWidth="2"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              d="M9 12l2 2 4-4M7.835 4.697a3.42 3.42 0 001.946-.806 3.42 3.42 0 014.438 0 3.42 3.42 0 001.946.806 3.42 3.42 0 013.138 3.138 3.42 3.42 0 00.806 1.946 3.42 3.42 0 010 4.438 3.42 3.42 0 00-.806 1.946 3.42 3.42 0 01-3.138 3.138 3.42 3.42 0 00-1.946.806 3.42 3.42 0 01-4.438 0 3.42 3.42 0 00-1.946-.806 3.42 3.42 0 01-3.138-3.138 3.42 3.42 0 00-.806-1.946 3.42 3.42 0 010-4.438 3.42 3.42 0 00.806-1.946 3.42 3.42 0 013.138-3.138z"
                            />
                          </svg>
                        </div>
                      )}
                      <div className="mt-3 text-center sm:mt-0 sm:ml-4 sm:text-left">
                        <h3
                          className="text-lg leading-6 font-medium text-gray-900"
                          id="modal-title"
                        >
                          {modalTitle}
                        </h3>
                        <div className="mt-2">
                          <p className="text-sm text-gray-500">{modalContent}</p>
                        </div>
                      </div>
                    </div>
                  </div>
                  <div className="bg-gray-50 px-4 py-3 sm:px-6 sm:flex sm:flex-row-reverse">
                    <button
                      type="button"
                      className="w-full inline-flex justify-center rounded-md border border-transparent shadow-sm px-4 py-2 bg-red-600 text-base font-medium text-white hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 sm:ml-3 sm:w-auto sm:text-sm"
                      onClick={() => setOpenModal(false)}
                    >
                      {modalAction}
                    </button>
                    <button
                      type="button"
                      className="mt-3 w-full inline-flex justify-center rounded-md border border-gray-300 shadow-sm px-4 py-2 bg-white text-base font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 sm:mt-0 sm:ml-3 sm:w-auto sm:text-sm"
                      onClick={() => setOpenModal(false)}
                    >
                      Cancel
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        ) : null}

        <main className="container flex flex-col items-center justify-center p-4">
          {loggedIn ? (
            <>
              <div>
            <nav>
              <nav>
                <div className="max-w-7xl mx-auto border-b-4 px-2 py-1 sm:px-6 lg:px-8">
                  <div className="relative flex items-center justify-between h-16">
                    <div className="absolute inset-y-0 left-0 flex items-center sm:hidden">
                      <button type="button" className="inline-flex items-center justify-center p-2 rounded-md text-gray-400 hover:text-white hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-white" aria-controls="mobile-menu" aria-expanded="false">
                        <span className="sr-only">Open main menu</span>
                        <svg className="block h-6 w-6" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="2" stroke="currentColor" aria-hidden="true">
                          <path strokeLinecap="round" strokeLinejoin="round" d="M4 6h16M4 12h16M4 18h16" />
                        </svg>
                        <svg className="hidden h-6 w-6" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="2" stroke="currentColor" aria-hidden="true">
                          <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                        </svg>
                      </button>
                    </div>
                    <div className="flex-1 flex items-center justify-center sm:items-stretch sm:justify-start">
                      <div className="flex-shrink-0 flex items-center">
                        <h1 className=" text-4xl font-semibold text-white">
                          Solana Relayer
                        </h1>
                      </div>
                    </div>
                    <div className="absolute inset-y-0 right-0 flex items-center pr-2 sm:static sm:inset-auto sm:ml-6 sm:pr-0">
                      <div className="flex gap-2">
                        <a href="https://docs.raid.farm/docs/utilities/solana-relayer" target="_blank" rel="noreferrer" className=" bg-gray-600 hover:bg-white text-white hover:text-black px-3 py-2 rounded-md text-sm focus:outline-none focus:ring-1 focus:ring-offset-1 focus:ring-white" aria-current="page">
                          Documentation
                        </a>
                        <a onClick={() => alert("Your address is " + relayerAddress)} className=" bg-gray-600 hover:bg-gray-400 text-white px-3 py-2 rounded-md text-sm font-medium focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500" aria-current="page">
                          {displayAddress(relayerAddress)}
                        </a>
                      </div>
                    </div>
                  </div>
                </div>
              </nav>
            </nav>
            <body>
              <header>
                <div className="max-w-6xl mx-auto py-6 px-4 sm:px-6 lg:px-8">
                  <div className="flex flex-row justify-between">
                    <h1 className="text-4xl font-mono font-black text-white">API Keys</h1>
                    <button onClick={generateAuthToken} type="button" className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-lime-600 hover:bg-lime-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-lime-500">
                      Generate New API Key
                    </button>
                  </div>
                  <div className="max-w-4xl mx-auto py-6">
                    <div className="px-4 py-6 sm:px-0">
                      <div className="overflow-x-auto relative border-2 shadow-md">
                        <table className="w-full text-left text-gray-500">
                          <thead className="text-white  font-lg tracking-wide uppercase border-b-4">
                            <tr>
                                <th scope="col" className="py-3 px-6">
                                    API Keys
                                </th>
                                <th scope="col" className="py-3 px-6">
                                    Date Created
                                </th>
                                <th scope="col" className="py-3 px-6">  
                                    Last Used
                                </th>
                                <th scope="col" className=" py-3 px-6">
                                    Action
                                </th>
                            </tr>
                          </thead>
                          <tbody>
                            {data.keys.map((keys: string | number | boolean | ReactElement<any, string | JSXElementConstructor<any>> | ReactFragment | ReactPortal | null | undefined, index: Key | null | undefined) => (
                              <tr key={index} className=" border-b">
                                <th scope="row" className="py-4 px-6 font-medium text-gray-100 whitespace-nowrap">
                                  {keys}
                                </th>
                                <td className="py-4 px-6 font-medium text-gray-100 whitespace-nowrap">
                                  DD/MM/YYYY
                                </td>
                                <td className="py-4 px-6 font-medium text-gray-100 whitespace-nowrap">
                                  DD/MM/YYYY
                                </td>
                                <td className="py-4 px-6">
                                  <button type="button" className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-red-600 hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500">
                                    Delete
                                  </button>
                                </td>
                              </tr>
                            ))}
                            
                          </tbody>
                        </table>
                      </div>
                    </div>
                  </div>
                </div>
              </header>
            </body>
        </div>
            </>
          ) : (
            <div className="flex justify-center">
        <div>
          <header className="mt-20">
            <h1 className="text-8xl text-white font-bold">
              Solana Relayer
            </h1>
          </header>
          <body className="flex flex-col justify-center">
            <div className="flex justify-center">
              <h2 className="text-4xl mt-5 font-semibold text-gray-200">
                Sign in to your account
              </h2>
            </div>
            
            <div className="mx-14">
              <div className="mt-8 space-y-6 justify-center">
                <div>
                  <div className="flex flex-col gap-4 mx-10">
                    <div className="flex justify-center">
                      <label htmlFor="email-address" className="sr-only">Email address</label>
                      <input 
                        id="username"
                        name="email" 
                        type="email" 
                        autoComplete="email" 
                        required 
                        onChange={(e) => setUserId(e.target.value)}
                        className="relative block w-5/6 px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 -t-md focus:outline focus:ring-indigo-500 focus:border-indigo-500 focus:z-10 sm:text-sm" 
                        placeholder="Email address"></input>
                    </div>
                    <div className="flex justify-center">
                      <label htmlFor="password" className="sr-only">Password</label>
                      <input id="password" name="password" type="password" onChange={(e) => setPassword(e.target.value)} autoComplete="current-password" required className="appearance  relative block w-5/6 px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 -b-md focus:outline focus:ring-indigo-500 focus:border-indigo-500 focus:z-10 sm:text-sm" placeholder="Password"></input>
                    </div>
                  </div>
                </div>

                <div className="flex justify-center">
                  <button type="button" onClick={signup} className="group relative w-3/5 flex justify-center py-2 px-4 text-sm font-medium border-2 rounded-lg hover:border-slate-900 text-white hover:text-black bg-black hover:bg-white border-white">
                    <span className="absolute left-0 inset-y-0 flex items-center pl-3">
                      <svg className="h-5 w-5  group-hover:text-black" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
                        <path fillRule="evenodd" d="M5 9V7a5 5 0 0110 0v2a2 2 0 012 2v5a2 2 0 01-2 2H5a2 2 0 01-2-2v-5a2 2 0 012-2zm8-2v2H7V7a3 3 0 016 0z" clipRule="evenodd" />
                      </svg>
                    </span>
                    Sign in
                  </button>
                </div>
              </div>
            </div>
          </body>
        </div>
      </div>
          )}
        </main>
      </div>

      
    </>
  );
};

export default Home;
