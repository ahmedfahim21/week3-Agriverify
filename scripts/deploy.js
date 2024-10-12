async function main() {
  const [deployer] = await ethers.getSigners();
  console.log("Deploying contracts with the account:", deployer.address);

  const Agriverify = await ethers.getContractFactory("Agriverify");
  const agriverify = await Agriverify.deploy();
  console.log("Agriverify contract deployed to:", agriverify.address);
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
