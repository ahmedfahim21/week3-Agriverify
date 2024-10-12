"use client";
import { useState, useEffect } from 'react';
import { ethers } from 'ethers';
import AgriverifyABI from "../abi/agriverify.json";
import { QRCodeSVG } from "qrcode.react";
import Link from 'next/link';

const CONTRACT_ADDRESS = "0x5FbDB2315678afecb367f032d93F642f64180aa3";

export default function App() {
  const [provider, setProvider] = useState(null);
  const [signer, setSigner] = useState(null);
  const [contract, setContract] = useState(null);
  const [currentAccount, setCurrentAccount] = useState(null);
  const [isRegistered, setIsRegistered] = useState(false);
  const [name, setName] = useState("");
  const [cropName, setCropName] = useState("");    // For crop submission
  const [cropType, setCropType] = useState("");    // For crop submission
  const [crops, setCrops] = useState([]);          // List of crops for the farmer
  const [qrCodeValue, setQRCodeValue] = useState('');  // QR code value

  // Onboarding code untouched here

  useEffect(() => {
    const connectWallet = async () => {
      if (typeof window.ethereum !== 'undefined') {
        const web3Provider = new ethers.providers.Web3Provider(window.ethereum);
        setProvider(web3Provider);

        window.ethereum.on('accountsChanged', async (accounts) => {
          setCurrentAccount(accounts[0]);

          let initcrops = await contract.getCrops(currentAccount);
          setCrops(initcrops);
        });

        window.ethereum.on('chainChanged', () => {
          window.location.reload();
        });


      } else {
        alert("MetaMask not found. Please install MetaMask!");
        console.error("MetaMask not found");
      }
    };

    connectWallet();
  }, []);

  const connectAccount = async () => {
    if (!provider) {
      alert("MetaMask is not connected");
      return;
    }

    try {
      const accounts = await provider.send("eth_requestAccounts", []);
      setCurrentAccount(accounts[0]);

      const signer = provider.getSigner();
      setSigner(signer);

      const onboardingContract = new ethers.Contract(CONTRACT_ADDRESS, AgriverifyABI, signer);
      setContract(onboardingContract);

      const isFarmer = await onboardingContract.isFarmerRegistered(accounts[0]);
      setIsRegistered(isFarmer);
    } catch (error) {
      console.error("MetaMask connection failed:", error);
    }
  };

  const registerFarmer = async () => {
    if (!contract || !name) {
      alert("Contract or name not found");
      return;
    }

    try {
      const tx = await contract.registerFarmer(name);
      await tx.wait();
      alert("Farmer registered successfully!");

      const isFarmer = await contract.isFarmerRegistered(currentAccount);
      setIsRegistered(isFarmer);
    } catch (error) {
      console.error("Registration failed:", error);
    }
  };

  const submitCrop = async () => {
    if (!contract || !cropName || !cropType) {
      alert("Please provide crop details.");
      return;
    }

    try {
      const tx = await contract.submitCrop(cropName, cropType);
      const receipt = await tx.wait();

      alert("Crop submitted successfully for certification!");

      const updatedCrops = await contract.getCrops(currentAccount);

      setCrops(updatedCrops);
    } catch (error) {
      console.error("Crop submission failed:", error);
    }
  };


  // --- QR Code Generation after Certification ---
  const generateQRCode = (crop) => {
    const cropId = crop.id._hex;
    const qrData = `http://localhost:3000/crop-details/${cropId}`;
    setQRCodeValue(qrData);
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-r from-green-400 to-blue-500 p-4 text-black">
      <div className="bg-white shadow-lg rounded-lg p-8 max-w-lg w-full">
        <h1 className="text-2xl font-bold mb-4 text-center">Agriverify Farmer Onboarding</h1>

        {!currentAccount ? (
          <button
            onClick={connectAccount}
            className="w-full py-2 px-4 bg-indigo-600 text-white font-semibold rounded-md hover:bg-indigo-700 transition duration-300"
          >
            Connect MetaMask
          </button>
        ) : (
          <div className="text-center">
            <p className="text-lg font-semibold mb-4">Connected Account:</p>
            <p className="bg-gray-100 p-2 rounded-md mb-4">{currentAccount}</p>
            {isRegistered ? (
              <div>
                {/* Crop Submission */}
                <h2 className="text-lg font-bold mb-2">Submit Your Crop for Certification</h2>
                <input
                  type="text"
                  value={cropName}
                  placeholder="Crop Name"
                  onChange={(e) => setCropName(e.target.value)}
                  className="w-full p-2 border rounded-md mb-2"
                />
                <select
                  value={cropType}
                  onChange={(e) => setCropType(e.target.value)}
                  className="w-full p-2 border rounded-md mb-4 bg-white text-gray-700"
                >
                  <option value="" disabled>Select Crop Type</option>
                  <option value="Vegetable">Vegetable</option>
                  <option value="Fruit">Fruit</option>
                  <option value="Grain">Grain</option>
                  <option value="Herb">Herb</option>
                  <option value="Spice">Spice</option>
                  <option value="Legume">Legume</option>
                  <option value="Cereal">Cereal</option>
                  <option value="Tuber">Tuber</option>
                </select>

                <button
                  onClick={submitCrop}
                  className="w-full py-2 px-4 bg-green-500 text-white font-semibold rounded-md hover:bg-green-600 transition duration-300"
                >
                  Submit Crop
                </button>

                {/* Crop List */}
                <h3 className="text-lg font-bold mt-6">Your Crops:</h3>
                {crops.length > 0 ? (
                  <ul className="list-disc pl-5 mt-2">
                    {crops.map((crop, index) => (
                      <li key={index}>
                        {crop.cropName} ({crop.cropType}) - {crop.isCertified ? 'Certified' : 'Pending'}
                        <button
                          onClick={() => generateQRCode(crop)}
                          className="ml-2 px-2 py-1 bg-blue-500 text-white rounded-md text-sm"
                        >
                          Generate QR Code
                        </button>
                      </li>
                    ))}
                  </ul>
                ) : (
                  <p>No crops submitted yet.</p>
                )}

                {/* QR Code Display */}
                {qrCodeValue && (
                  <div className="mt-4">
                    <h4 className="text-lg font-bold mb-2">QR Code:</h4>
                    <QRCodeSVG value={qrCodeValue} />
                    <Link href={qrCodeValue} className='text-blue-500 hover:underline'>
                      QR Link
                    </Link>
                  </div>
                )}
              </div>
            ) : (
              <div>
                <input
                  type="text"
                  value={name}
                  placeholder="Enter your name"
                  onChange={(e) => setName(e.target.value)}
                  className="w-full p-2 border rounded-md"
                />
                <button
                  onClick={registerFarmer}
                  className="w-full py-2 px-4 bg-green-500 text-white font-semibold rounded-md hover:bg-green-600 transition duration-300 mt-4"
                >
                  Register as Farmer
                </button>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
