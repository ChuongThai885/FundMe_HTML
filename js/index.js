import { ethers } from "./ethers.min.js"
import { abi, contractAddress } from "./constants.js"

const connect_button = document.getElementById("connect")
const fund_button = document.getElementById("fund")
const welcome = document.getElementById("welcome")
welcome.innerHTML = ""

connect_button.onclick = connect
fund_button.onclick = fund

async function connect() {
    if (typeof window.ethereum != "undefined") {
        try {
            await window.ethereum.request({ method: "eth_requestAccounts" })
            connect_button.innerHTML = "CONNECTED"
            const account = await window.ethereum.request({
                method: "eth_accounts",
            })
            welcome.innerHTML = `Halo ${account}`
        } catch (error) {
            console.log(error)
        }
    } else {
        console.log("No Metamask found!")
        connect_button.innerHTML = "Install Metamask to use"
    }
}

async function fund() {
    const ethAmount = "77"
    console.log(`Funding with ${ethAmount}...`)
    if (typeof window.ethereum != "undefined") {
        try {
            const provider = new ethers.providers.Web3Provider(window.ethereum)
            const signer = provider.getSigner()
            const contract = new ethers.Contract(contractAddress, abi, signer)
            const transactionResponse = await contract.fund({
                value: ethers.utils.parseEther(ethAmount),
            })
            await transactionResponse.wait(1)
            console.log(
                (await contract.provider.getBalance(contract.address))
                    .div(1e9)
                    .toString()
            )
        } catch (error) {
            console.log(error)
        }
    }
}
