import { Address, toNano } from '@ton/core';
import { SampleJetton } from '../wrappers/SampleJetton';
import { NetworkProvider } from '@ton/blueprint';
import { buildOnchainMetadata } from '../utils/jetton-helpers';

export async function run(provider: NetworkProvider, recipientAddressStr: string, amountStr: string) {
    const jettonParams = {
        name: 'The Eagle',
        description: 'Hi! Welcome to new World of Ants',
        symbol: 'GAJNI',
        image: 'https://blush-wrong-lemur-55.mypinata.cloud/ipfs/Qmd1z4bcgrkK2M9bgjdcx61ki3b5sMFm2rqwUpVUjd4fvg',
    };

    // Create content Cell
    let content = buildOnchainMetadata(jettonParams);

    // Open the SampleJetton contract
    const sampleJetton = provider.open(
        await SampleJetton.fromInit(provider.sender().address as Address, content, 1000000000000000000n),
    );

    // Get the recipient address and amount from parameters
    const recipientAddress = Address.parse(recipientAddressStr);
    const amount = BigInt(amountStr); // Convert amount from string to BigInt

    // Send tokens to the recipient address
    await sampleJetton.send(
        provider.sender(), // Fee is deducted from the sender's wallet (your wallet)
        {
            value: toNano('0.05'), // Gas fee (0.05 TON)
        },
        {
            $$type: 'Mint',
            amount: amount, // Amount to send
            receiver: recipientAddress, // Recipient
        },
    );

    // Wait for confirmation of the mint transaction
    await provider.waitForDeploy(sampleJetton.address);

    // Log the deployed contract address
    console.log(`Contract deployed at address: ${sampleJetton.address.toString()}`);
}
