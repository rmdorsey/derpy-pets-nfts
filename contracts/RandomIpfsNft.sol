// SPDX-License-Identifier: MIT
pragma solidity ^0.8.7;

import "@openzeppelin/contracts/token/ERC721/extensions/ERC721URIStorage.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "@chainlink/contracts/src/v0.8/VRFConsumerBaseV2.sol";
import "@chainlink/contracts/src/v0.8/interfaces/VRFCoordinatorV2Interface.sol";
import "hardhat/console.sol";

error AlreadyInitialized();
error NeedMoreETHSent();
error RangeOutOfBounds();

contract RandomIpfsNft is ERC721URIStorage, VRFConsumerBaseV2, Ownable {
    // Chainlink VRF Variables
    VRFCoordinatorV2Interface private immutable i_vrfCoordinator;
    uint64 private immutable i_subscriptionId;
    bytes32 private immutable i_gasLane;
    uint32 private immutable i_callbackGasLimit;
    uint16 private constant REQUEST_CONFIRMATIONS = 3;
    uint32 private constant NUM_WORDS = 1;

    // NFT Variables
    uint256 private i_mintFee;
    uint256 public s_tokenCounter;
    uint256 internal constant UNIQUE_GRAPHICS_IN_COLLECTION = 56;
    string[] internal s_derpeyPetTokenUris;
    bool private s_initialized;

    // VRF Helpers
    mapping(uint256 => address) public s_requestIdToSender;

    // Events
    event NftRequested(uint256 indexed requestId, address requester);
    event NftMinted(uint256 derpeyPetToken, address minter);

    constructor(
        address vrfCoordinatorV2,
        uint64 subscriptionId,
        bytes32 gasLane, // keyHash
        uint256 mintFee,
        uint32 callbackGasLimit,
        string[56] memory dogTokenUris
    ) VRFConsumerBaseV2(vrfCoordinatorV2) ERC721("Random IPFS NFT", "RIN") {
        i_vrfCoordinator = VRFCoordinatorV2Interface(vrfCoordinatorV2);
        i_gasLane = gasLane;
        i_subscriptionId = subscriptionId;
        i_mintFee = mintFee;
        i_callbackGasLimit = callbackGasLimit;
        _initializeContract(dogTokenUris);
    }

    function _initializeContract(string[56] memory dogTokenUris) private {
        if (s_initialized) {
            revert AlreadyInitialized();
        }
        s_derpeyPetTokenUris = dogTokenUris;
        s_initialized = true;
    }

    function requestNft() public payable returns (uint256 requestId) {
        if (msg.value < i_mintFee) {
            revert NeedMoreETHSent();
        }
        requestId = i_vrfCoordinator.requestRandomWords(
            i_gasLane,
            i_subscriptionId,
            REQUEST_CONFIRMATIONS,
            i_callbackGasLimit,
            NUM_WORDS
        );

        s_requestIdToSender[requestId] = msg.sender;
        emit NftRequested(requestId, msg.sender);
    }

    function fulfillRandomWords(uint256 requestId, uint256[] memory randomWords)
        internal
        override
    {
        address derpeyPetTokenOwner = s_requestIdToSender[requestId];
        uint256 newItemId = s_tokenCounter;
        s_tokenCounter = s_tokenCounter + 1;
        uint256 rando = randomWords[0] % UNIQUE_GRAPHICS_IN_COLLECTION;
        _safeMint(derpeyPetTokenOwner, newItemId);
        _setTokenURI(newItemId, s_derpeyPetTokenUris[rando]);
        emit NftMinted(rando, derpeyPetTokenOwner);
    }

    function withdraw() public onlyOwner {
        uint256 amount = address(this).balance;
        (bool success, ) = payable(msg.sender).call{value: amount}("");
        require(success, "Transfer failed");
    }

    function getMintFee() public view returns (uint256) {
        return i_mintFee;
    }

    function getDogTokenUris(uint256 index)
        public
        view
        returns (string memory)
    {
        return s_derpeyPetTokenUris[index];
    }

    function getInitialized() public view returns (bool) {
        return s_initialized;
    }

    function getTokenCounter() public view returns (uint256) {
        return s_tokenCounter;
    }
}
