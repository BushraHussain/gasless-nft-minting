const { Contract, Wallet } = require('ethers')
const { getZeroDevSigner } = require('@zerodevapp/sdk')
const { id, key } = require('./config');

const projectId = id;
const wallet = new Wallet(key);

const contractAddress = '0x34bE7f35132E97915633BC1fc020364EA5134863'
const contractABI = [
  'function mint(address _to) public',
  'function balanceOf(address owner) external view returns (uint256 balance)'
]

const main = async () => {
  const signer = await getZeroDevSigner({
    projectId,
    owner: wallet,
  })

  const address = await signer.getAddress()
  console.log('My address:', address)

  const nftContract = new Contract(contractAddress, contractABI, signer)

  const receipt = await signer.execBatch([
    {
      to: nftContract.address,
      data: nftContract.interface.encodeFunctionData("mint", [address]),
    },
    {
      to: nftContract.address,
      data: nftContract.interface.encodeFunctionData("mint", [address]),
    },
  ])
  await receipt.wait()
  console.log(`NFT balance: ${await nftContract.balanceOf(address)}`)
}

main().then(() => process.exit(0))