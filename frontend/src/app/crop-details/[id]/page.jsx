"use client";
import { useParams } from 'next/navigation'
import { useState, useEffect } from 'react';
import { ethers } from 'ethers';
import AgriverifyABI from "../../../abi/agriverify.json"

export default function CropDetails() {
    const params = useParams();
    const [cropDetails, setCropDetails] = useState(null);

    const CONTRACT_ADDRESS = "0x5FbDB2315678afecb367f032d93F642f64180aa3";

    useEffect(() => {
        const fetchCropDetails = async () => {
            const web3Provider = new ethers.providers.Web3Provider(window.ethereum);

            const contract = new ethers.Contract(CONTRACT_ADDRESS, AgriverifyABI, web3Provider);

            try {
                const crop = await contract.getCropById(params.id);
                setCropDetails({
                    cropName: crop[0],
                    cropType: crop[1],
                    isCertified: crop[2]
                });
            } catch (error) {
                console.error("Error fetching crop details:", error);
            }
        };

        fetchCropDetails();
    }, [params]);


    return (
        <div className="min-h-screen flex items-center justify-center bg-gradient-to-r from-green-400 to-blue-500 p-4 text-black">
            <div className="bg-white shadow-lg rounded-lg p-8 max-w-lg w-full">
            {cropDetails ? (
                <div>
                    <h1 className="text-3xl font-extrabold text-green-800 mb-4">🌾 Crop Details 🌾</h1>
                    <div className="space-y-2 text-black">
                        <p className="text-lg"><strong className="font-semibold">Name:</strong> <span className="text-green-900">{cropDetails.cropName}</span></p>
                        <p className="text-lg"><strong className="font-semibold">Type:</strong> <span className="text-green-900">{cropDetails.cropType}</span></p>
                        <p className="text-lg"><strong className="font-semibold">Certified:</strong> <span className={cropDetails.isCertified ? 'text-green-700 font-bold' : 'text-red-600 font-bold'}>{cropDetails.isCertified ? 'Yes' : 'No'}</span></p>
                    </div>
                </div>
            ) : (
                <div className="flex items-center justify-center">
                    <p className="animate-pulse text-green-600 text-lg">🌱 Loading crop details...</p>
                </div>
            )}
            </div>
        </div>

    );
};
