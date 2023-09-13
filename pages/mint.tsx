import type { NextPage } from "next";
import Link from 'next/link';
import { SignInButton, ethos } from "ethos-connect";
import { useCallback, useState } from "react";

const Mint: NextPage = () => {
  const contractAddress = "0x0000000000000000000000000000000000000002";
  const { wallet } = ethos.useWallet();
  const [nftObjectId, setNftObjectId] = useState(null);
  const [nftName, setNftName] = useState('My NFT');
  const [nftDescription, setNftDescription] = useState('My NFT Description');
  const [nftImgUrl, setNftImgUrl] = useState('https://ethoswallet.xyz/assets/images/ethos-email-logo.png');

  const mint = useCallback(async () => {
    if (!wallet) return;

    try {
      const signableTransaction = {
        kind: "moveCall" as const,
        data: {
          packageObjectId: contractAddress,
          module: "devnet_nft",
          function: "mint",
          typeArguments: [],
          arguments: [
            nftName,
            nftDescription,
            nftImgUrl,
          ],
          gasBudget: 10000,
        },
      };

      const response = await wallet.signAndExecuteTransaction(signableTransaction);
      if (response?.effects?.events) {
        const { moveEvent } = response.effects.events.find((e) => e.moveEvent);
        setNftObjectId(moveEvent.fields.object_id)
      }  
    } catch (error) {
      console.log(error);
    }
  }, [nftName, nftDescription, nftImgUrl, wallet]);

  const reset = useCallback(() => {
    setNftObjectId(null);
  }, []);

  const disconnect = useCallback(() => {
    reset();
    wallet?.disconnect();
  }, [reset, wallet])

  function handleNftNameChange(e: React.ChangeEvent<HTMLInputElement>) {
    setNftName(e.target.value);
  }

  function handleNftDescriptionChange(e: React.ChangeEvent<HTMLInputElement>) {
    setNftDescription(e.target.value);
  }
  function handleNftImgUrlChange(e: React.ChangeEvent<HTMLInputElement>) {
    setNftImgUrl(e.target.value);
  }

  console.log(nftName)
  return (
    <div className="flex justify-between items-start">
      <div className="p-12 flex-1"><Link href="/">Return Home</Link></div>

      <div className="max-w-7xl mx-auto text-center py-12 px-4 sm:px-6 lg:py-16 lg:px-8 flex-6">
        {!wallet ? (
          <SignInButton className="inline-flex items-center justify-center px-5 py-3 border border-transparent text-base font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700">
            Connect
          </SignInButton>
        ) : (
          <div className="flex flex-col gap-6">
            <div className="flex flex-col gap-2">
              <h2 className="text-3xl font-extrabold tracking-tight sm:text-4xl">
                Sui NFT Mint
              </h2>
              <p>Welcome!</p>
              {nftObjectId && (
                <div className='p-3 bg-green-200 text-sm text-center relative'>
                    <div 
                        className='cursor-pointer rounded-full flex justify-center items-center bg-white w-6 h-6 text-sm absolute top-3 right-3'
                        onClick={reset}
                    >
                        ✕
                    </div>
                    <b>Success!</b>
                    &nbsp; &nbsp;
                    <a 
                        href={`https://explorer.devnet.sui.io/objects/${nftObjectId}`}
                        target="_blank" 
                        rel="noreferrer"
                        className='underline font-blue-600' 
                    >
                        View Your NFT on the DevNet Explorer 
                    </a>
                </div>
              )}

                <input
                    className="block w-full p-2 text-gray-900 border border-gray-300 rounded-lg bg-gray-50 sm:text-xs focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                    value={nftName}
                    onChange={handleNftNameChange}              
                />
                <input
                    className="block w-full p-2 text-gray-900 border border-gray-300 rounded-lg bg-gray-50 sm:text-xs focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                    value={nftDescription}
                    onChange={handleNftDescriptionChange}              
                />
                <input
                    className="block w-full p-2 text-gray-900 border border-gray-300 rounded-lg bg-gray-50 sm:text-xs focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                    value={nftImgUrl}
                    onChange={handleNftImgUrlChange}              
                />

                <button
                  className="mx-auto px-5 py-3 border border-transparent text-base font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700"
                  onClick={mint}
                >
                  Mint Your NFT
                </button>
              or
              <button
                className="mx-auto px-5 py-3 border border-transparent text-base font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700"
                onClick={disconnect}
              >
                Sign Out
              </button>
            </div>
          </div>
        )}
      </div>

      <div className="p-12 flex-1 flex justify-end">
        <ethos.components.AddressWidget />
      </div>
    </div>
  );
};

export default Mint;