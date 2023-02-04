import { ethers } from "./ethers.min.js"
import { abi, contractAddress } from "./constants.js"

const connect_button = document.getElementById("connect")
const fund_button = document.getElementById("fund")
const balance_button = document.getElementById("getbalance")
const withdraw_button = document.getElementById("withdraw")
const welcome = document.getElementById("welcome")
welcome.innerHTML = ""

connect_button.onclick = connect
fund_button.onclick = fund
balance_button.onclick = getBalance
withdraw_button.onclick = withdraw

let provider, signer, contract

async function connect() {
    if (typeof window.ethereum != "undefined") {
        try {
            await window.ethereum.request({ method: "eth_requestAccounts" })
            connect_button.innerHTML = "CONNECTED"
            const account = await window.ethereum.request({
                method: "eth_accounts",
            })
            welcome.innerHTML = `Halo ${account}`
            provider = new ethers.providers.Web3Provider(window.ethereum)
            signer = provider.getSigner()
            contract = new ethers.Contract(contractAddress, abi, signer)
            const owner = await contract.getOwner()
            if (account[0] != owner) {
                withdraw_button.style.visibility = "hidden"
            }
        } catch (error) {
            console.log(error)
        }
    }
}

async function fund() {
    const ethAmount = document.getElementById("ethAmount").value
    console.log(`Funding with ${ethAmount}...`)
    if (typeof window.ethereum != "undefined") {
        try {
            const transactionResponse = await contract.fund({
                value: ethers.utils.parseEther(ethAmount),
            })
            await transactionResponse.wait(1)
            await getBalance()
        } catch (error) {
            console.log(error)
        }
    }
}

async function getBalance() {
    if (typeof window.ethereum != "undefined") {
        try {
            const balance = await provider.getBalance(contractAddress)
            console.log(ethers.utils.formatEther(balance))
        } catch (error) {
            console.log(error)
        }
    }
}

async function withdraw() {
    if (typeof window.ethereum != "undefined") {
        try {
            const transactionResponse = await contract.Withdraw()
            await transactionResponse.wait(1)
            await getBalance()
        } catch (error) {
            console.log(error)
        }
    }
}
