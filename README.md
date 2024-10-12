# AgriVerify

AgriVerify is a decentralized platform that leverages blockchain technology to ensure trust and transparency in organic farming. Farmers can register on the platform, submit crops for certification, and customers can verify the authenticity of these certified crops via a simple and secure process.

## Table of Contents
- [Introduction](#introduction)
- [Features](#features)
- [Getting Started](#getting-started)
  - [Prerequisites](#prerequisites)
  - [Installation](#installation)
  - [Running Locally](#running-locally)
- [Smart Contract](#smart-contract)
  - [Farmer Registration](#farmer-registration)
  - [Crop Submission](#crop-submission)
  - [Certification](#certification)
- [Frontend](#frontend)

## Introduction
AgriVerify offers an immutable way to verify the authenticity of organically farmed crops using blockchain technology. The platform allows farmers to submit their crops for certification and provides a mechanism for verifying their authenticity using QR code verification and blockchain records.

## Features
- **Farmer Registration:** Farmers can easily register on the platform.
- **Crop Submission:** Registered farmers can submit their crops for certification.
- **Blockchain Transparency:** All crop certification information is stored on the blockchain, providing a transparent, immutable record.
- **Verification:** Users can verify the certification of crops via QR codes linked to blockchain entries.

## Getting Started

### Prerequisites
Ensure you have the following installed:
- [Node.js](https://nodejs.org/) (v14 or above)
- [MetaMask](https://metamask.io/) (for wallet interaction)
- [Hardhat](https://hardhat.org/) (for local Ethereum network and contract deployment)

### Installation
Clone the repository and install the dependencies:

```bash
git clone https://github.com/yourusername/agriverify.git
cd agriverify
npm install
```

### Running Locally
1. **Start Local Blockchain (Hardhat or Ganache):**
   ```bash
   npx hardhat node
   ```

2. **Deploy Smart Contract:**
   In a new terminal window, run:
   ```bash
   npx hardhat run scripts/deploy.js --network localhost
   ```

3. **Start the Frontend Application:**
   ```bash
   cd /frontend
   npm run dev
   ```

4. Open [http://localhost:3000](http://localhost:3000) to view the application in the browser.

## Smart Contract

### Farmer Registration
Farmers need to register on the platform to submit their crops for certification. Only registered farmers can submit crop details.

```solidity
function registerFarmer(string memory _name) public;
```

### Crop Submission
Registered farmers can submit details of their crops, which will be stored on the blockchain for certification.

```solidity
function submitCrop(string memory _cropName, string memory _cropType) public;
```

### Certification
Crops are automatically certified for demonstration purposes, but this can be extended to include a manual approval process by admins.

## Frontend
The frontend is built using NEXT.js. It allows users to interact with the smart contract using MetaMask, enabling them to register farmers and submit crops directly from the browser.

### Main Features:
- **Farmer Registration Form**: A form to allow farmers to register by entering their name.
![image](https://github.com/user-attachments/assets/047cb8d9-6abb-457d-ada3-a8105e9595ab)
- **Crop Submission Form**: A form that enables registered farmers to submit crops for certification, with a dropdown to select crop types.
![Screenshot from 2024-10-12 23-51-42](https://github.com/user-attachments/assets/232b8b6b-8d94-452c-9c3b-549116660e48)
- **QR Code Verification**: Verification through scanning QR codes linked to blockchain transactions.
![Screenshot from 2024-10-12 23-51-54](https://github.com/user-attachments/assets/19b486b8-b089-4d53-b487-806e4ab38b34)
- **Access Crop details**: View the details
![Screenshot from 2024-10-12 23-52-00](https://github.com/user-attachments/assets/40be49a4-8c66-41d9-a7ea-37779e482a2e)

