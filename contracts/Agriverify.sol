// SPDX-License-Identifier: MIT
pragma solidity ^0.8.27;

import "@openzeppelin/contracts/access/AccessControl.sol";

contract Agriverify is AccessControl {

    bytes32 public constant ADMIN_ROLE = keccak256("ADMIN_ROLE");

    struct Farmer {
        address farmerAddress;
        string name;
        bool isRegistered;
    }

    struct Crop {
        uint256 id;  
        string cropName;
        string cropType;
        bool isCertified;
    }

    mapping(address => Farmer) public farmers;

    mapping(uint256 => Crop) public crops;
    
    mapping(address => Crop[]) public farmerCrops;

    uint256 private cropCounter;

    event FarmerRegistered(address indexed farmerAddress, string name);

    event CropSubmitted(address indexed farmerAddress, uint256 cropId, string cropName, string cropType, bool isCertified);

    modifier onlyRegisteredFarmer() {
        require(farmers[msg.sender].isRegistered, "Not a registered farmer");
        _;
    }

    constructor() {
        _grantRole(DEFAULT_ADMIN_ROLE, msg.sender);
        cropCounter = 0;
    }

    function registerFarmer(string memory _name) public {
        require(!farmers[msg.sender].isRegistered, "Farmer already registered");

        farmers[msg.sender] = Farmer({
            farmerAddress: msg.sender,
            name: _name,
            isRegistered: true
        });

        emit FarmerRegistered(msg.sender, _name);
    }

    function submitCrop(string memory _cropName, string memory _cropType) public onlyRegisteredFarmer {
        uint256 cropId = cropCounter++;
        Crop memory newCrop = Crop({
            id: cropId,
            cropName: _cropName,
            cropType: _cropType,
            isCertified: true  // Auto-certify
        });

        crops[cropId] = newCrop;
        farmerCrops[msg.sender].push(newCrop);
        emit CropSubmitted(msg.sender, cropId, _cropName, _cropType, newCrop.isCertified);
    }

    function getCropById(uint256 _cropId) public view returns (string memory, string memory, bool) {
        Crop memory crop = crops[_cropId];
        return (crop.cropName, crop.cropType, crop.isCertified);
    }

    function getCrops(address _farmerAddress) public view returns (Crop[] memory) {
        return farmerCrops[_farmerAddress];
    }

    function getFarmerDetails(address _farmerAddress) public view returns (string memory, bool) {
        return (farmers[_farmerAddress].name, farmers[_farmerAddress].isRegistered);
    }

    function isFarmerRegistered(address _farmerAddress) public view returns (bool) {
        return farmers[_farmerAddress].isRegistered;
    }
}
