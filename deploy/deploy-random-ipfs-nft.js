const { network } = require("hardhat")
const { networkConfig, developmentChains } = require("../helper-hardhat-config")
const { verify } = require("../utils/verify")
const { storeImages, storeTokeUriMetadata } = require("../utils/uploadToPinata")
const fs = require('fs');

const FUND_AMOUNT = "1000000000000000000000"
const imagesLocation = "./nftimages/"
let tokenUris = [
    'ipfs://QmQtFYMnhrXUEDuEtrCvokKiZp4MDhEPemxXFiizAjcTrX',
    'ipfs://QmUeN2NQ8Bt2JBMXHRRtAJUfXdJGdL4yjC2xtmo4snYBvg',
    'ipfs://QmRfhZo1s7aPx5t1yqGwwsTkJsxWmbQKAQymmgZXhrmmMR',
    'ipfs://QmZDW7AB799qp2rVPJVqyHUb5BSc6pszM7qucwgHd1UTvS',
    'ipfs://QmW5pVFqc7MfPjTJdd9ZQSYmEkFwNG1ToYwBNSgjFjkSVm',
    'ipfs://QmP8ERGdevD3qxZe5tiS8cQEyKVSWS6YgX6JVieeo1xdA3',
    'ipfs://QmaSyoJaWBJcPg2t1vHSXkoYfXpDuXC2KC12mApAj8Vj9c',
    'ipfs://QmPGNVqRNMimBeDbV9GBpJKwGp1hdJzAtmWEnScxudFDAZ',
    'ipfs://QmRymfJwzWdB9z4fQpZsTfFT162h4ifKwWrMTSXvcLyBhe',
    'ipfs://QmbHUBGoo7w5DR8wTKBuPokGz5TByhUkq8SnQBJyUmuYAo',
    'ipfs://QmZFQbaekwqoejEzJWwtBdjKdZ4vrDaBjr3jxt4Xkf3nhV',
    'ipfs://QmSURg8uYwVz8eigQwweBn2yoW7GDhSR2EtBCE9mcWSmp7',
    'ipfs://QmWZ3mxNBBiKuRR5ekzu8wGPvdeogU128E2M3QsS5ZzgNw',
    'ipfs://QmbxmwstTVM35e82iNNtpf3eDYLCCH2yXanhEw3CaMXHhX',
    'ipfs://QmcwxJP8B6UD3p1q93upHp3LFJYLqm7LHcokh74XSbKkas',
    'ipfs://QmenNppoy1GD8YTkNNeDVygbrdHQdGx5d714emPdcZ4n2a',
    'ipfs://QmVEJTA3HgiaLcofuZE96tc7WrfAC7bm4voZ9o7JRPJ9hA',
    'ipfs://QmbJQbggdRUqPrRAqnSTWNZDC7y4YKThbPz8qJybk5mAKr',
    'ipfs://Qme8pEKSRR3iSCZGWubsxcmEWx1me3S7ynN3vfrBYSWrRx',
    'ipfs://QmNdfMQtqrDN3c68GVNvFrnaQppq7SNPcbFTXL1icqX3V4',
    'ipfs://QmQWHGczknav6LzUEDto68r51vVJN6YXdy2TbNRY3qfdJv',
    'ipfs://QmNMWbXFvHt67EGbpALEsztmqU25fMHVEBC1vg88jBhVS7',
    'ipfs://QmRw1Gbb6UPxY4ApEiyxNutcgtNimJumkTLA8F2zcyVesw',
    'ipfs://QmR3WF8xvrTTcayQagP1Y2wB15V61taZsZArMdBMnaPbmn',
    'ipfs://QmWtyg4WsWCgsB5X1yHrF77BhuKgQv1xDL19ZECJPrrnUR',
    'ipfs://Qmb1Z6oKoFvPNhQU5EMGzDudN9eHtDwRGmjBzYV6E57JMF',
    'ipfs://QmVZUZTjrWjtLMzRXoCQpUxCuRbcHRUBZ7FDwUXivZQH2f',
    'ipfs://QmZwo8TVDfyMMifbF4CuhGsEVj7ow7p3NGADM7XePUqeoD',
    'ipfs://QmaxY4cuMk7J7jjmNStByx25prgiSWBvmzXbE4C3m1xF4M',
    'ipfs://QmSW1TQGddQ8qxfWMsBChuDDN4Cb2zFJjrSytfGKdP7eHe',
    'ipfs://QmQSUMSNmMH8iYgas6uTVFqtsX8N6StqRGLe1ftHtCcf1Y',
    'ipfs://QmR8A3EG5PeEjRoxKcysWSvDGN1vuoXPKw548V6dgwyygV',
    'ipfs://QmbfT2zWYm1h3PUk9Xjc3G5pNN1vDhQH4QUfojhyqViYpp',
    'ipfs://QmdH7pYAvTTC1pCTCGJpJMkhViSYjXEdnNje1bLJynk7MP',
    'ipfs://QmR8kGvcZBNa3teHe43HnddCnVuXDUjSSkoAV59ohLMnXX',
    'ipfs://QmPsjAfkD4JygwXRkGBHouNVLBLWEpjQGPixJkuW1ozc9U',
    'ipfs://QmSzG7GVBeQkLhSH5fvpdpcJcFzznMvqL9VytczGNf6dFY',
    'ipfs://QmSaiP9Y6ahbLXxsgvwT1FBs76YeMhHfPZShvpwjcLvu6G',
    'ipfs://Qmf7MYk8w2pvT7UMAPN9bS2iDSNyxCVfZ1dKbMXYMEvN2K',
    'ipfs://QmboL3YKKMsyLiv4BC95Re6MyjQiN1ccjjYuuGL4784tUi',
    'ipfs://QmY4vy5NM8pBVvi156FLefSx3UkPfqjhdCUwmq8VPFtnnK',
    'ipfs://QmcvKySoCghesqwR3BqqJ3g5fzgAvoMTJj6XhrEehdQ1Vf',
    'ipfs://QmXhVchCoAWKtMkaKfgrE1J39ucnyJmcKzAGPmF8u9Aqsg',
    'ipfs://QmXBpaHdzaEX8NMNVy3VkJgWoXgbWmCYoJryDhyXqCMcCg',
    'ipfs://QmX2FvimvhdgfpxBfeo9jHPvySQXYd3K7jm3MuUJsssQ67',
    'ipfs://QmSreS5WXn3GKqapwdWLkDvuHgMd5RGuoxpa3ca6rANRTJ',
    'ipfs://Qma6d7c8bUcGjeZaiuBKH1sdAzvszDVpcBcpx9tDu2tZNu',
    'ipfs://QmQh55x4C2FFootmkMPoW9sQLUUqnp4Xbhr17vB8A2aSUm',
    'ipfs://QmWzeEPDUrHz4YQrz2u5m9WKbkRD428EFgPeLYZhWFbo17',
    'ipfs://QmRt1WXGzS2Y6m8zyHQcQjcKf5tAewCHUoaJTVmdLKvnCG',
    'ipfs://QmSek3XEivJkZ4vjNED5dvKHkusvBKfcVrquGX6N6hDbFD',
    'ipfs://QmTzR71hR5C97XFLZUZy7175QDehu1vbXdsBfYg41G4a8u',
    'ipfs://QmSnjvv4ZcPXybiYTuMFxHJFZEh123tMhuihsdLszkCkcV',
    'ipfs://QmNncwfAL8xhJbsbnJ1tiBW4MwtDSjgtr6vmSueCTc5Xuc',
    'ipfs://QmUdjEKxxbai2ASnZ2NCei96AAqpvwCvQGiqpbmSBc3Cw5',
    'ipfs://QmQDZdg6bRgraZv6f3feGJ5tHPQePpkxEQ9u8gsUcQNTaN'
];

//pulling out hardhat runtime variables inside function parameters (javascript is wild)
module.exports = async ({ getNamedAccounts, deployments }) => {
    const { deploy, log } = deployments;
    const { deployer } = await getNamedAccounts();
    const chainId = network.config.chainId;
    let vrfCoordinatorV2Address, subscriptionId;

    console.log("ALL THE VARS YOU WERE CURIOUS ABOUT");
    console.log(deploy);
    console.log(log);
    console.log(deployer);
    console.log(chainId);

    if (process.env.UPLOAD_TO_PINATA == "true") {
        console.log("upload to pinata");
        tokenUris = await handleTokenUris()
    }

    if (chainId == 31337) {
        // create VRFV2 Subscription
        const vrfCoordinatorV2Mock = await ethers.getContract("VRFCoordinatorV2Mock")
        vrfCoordinatorV2Address = vrfCoordinatorV2Mock.address
        const transactionResponse = await vrfCoordinatorV2Mock.createSubscription()
        const transactionReceipt = await transactionResponse.wait(1)
        subscriptionId = transactionReceipt.events[0].args.subId
        // Fund the subscription
        // Our mock makes it so we don't actually have to worry about sending fund
        await vrfCoordinatorV2Mock.fundSubscription(subscriptionId, FUND_AMOUNT)
    } else {
        vrfCoordinatorV2Address = networkConfig[chainId].vrfCoordinatorV2
        subscriptionId = networkConfig[chainId].subscriptionId
    }

    log("----------------------------------------------------")
    arguments = [
        vrfCoordinatorV2Address,
        subscriptionId,
        networkConfig[chainId]["gasLane"],
        networkConfig[chainId]["mintFee"],
        networkConfig[chainId]["callbackGasLimit"],
        tokenUris,
    ]
    const randomIpfsNft = await deploy("RandomIpfsNft", {
        from: deployer,
        args: arguments,
        log: true,
        waitConfirmations: network.config.blockConfirmations || 1,
    })
    console.log(randomIpfsNft.address);
    // Verify the deployment
    if (!developmentChains.includes(network.name) && process.env.ETHERSCAN_API_KEY) {
        log("Verifying...")
        await verify(randomIpfsNft.address, arguments)
    }
}

async function handleTokenUris() {
    // Check out https://github.com/PatrickAlphaC/nft-mix for a pythonic version of uploading
    // to the raw IPFS-daemon from https://docs.ipfs.io/how-to/command-line-quick-start/
    // You could also look at pinata https://www.pinata.cloud/
    tokenUris = [];

    let rawmetadata = fs.readFileSync('assets/0.json');
    let metadata = JSON.parse(rawmetadata);
    
    const { responses: imageUploadResponses, files } = await storeImages(imagesLocation)
    for (imageUploadResponseIndex in imageUploadResponses) {
        let imageNumber = files[imageUploadResponseIndex].replace(".png", "");
        let tokenUriMetadata = { ...metadata[imageNumber] };
        // tokenUriMetadata.description = `An adorable ${tokenUriMetadata.name} pup!`
        tokenUriMetadata.image = `ipfs://${imageUploadResponses[imageUploadResponseIndex].IpfsHash}`;
        console.log(`Uploading ${tokenUriMetadata.name} Image Number: ${imageNumber} Image Upload Response Index: ${imageUploadResponseIndex}...`);
        const metadataUploadResponse = await storeTokeUriMetadata(tokenUriMetadata);
        tokenUris.push(`ipfs://${metadataUploadResponse.IpfsHash}`);
    }
    console.log("Token URIs uploaded! They are:")
    console.log(tokenUris)
    return tokenUris
}

module.exports.tags = ["all", "randomipfs", "main"]