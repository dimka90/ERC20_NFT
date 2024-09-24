
// SPDX-License-Identifier: MIT
pragma solidity ^0.8.4;

import {Base64} from "./Base64.sol"; // Assuming Base64 library is in the same directory

contract OnChainNFT {
    event Minted(
        address indexed to,
        uint256 indexed id,
        uint256 amount,
        string tokenURI
    );
    event TransferSingle(
        address indexed operator,
        address indexed from,
        address indexed to,
        uint256 id,
        uint256 amount
    );
    event URI(string value, uint256 indexed id);

    struct Token {
        uint256 id;
        string tokenURI;
        uint256 supply;
    }

    mapping(uint256 => Token) public tokens;
    mapping(address => mapping(uint256 => uint256)) private _balances;

    uint256 private _currentTokenId;

    // Minting an NFT
    function mint(address to, string memory svg, uint256 amount) public {
        require(amount > 0, "Amount must be greater than zero");

        // Increment token ID
        _currentTokenId++;
        uint256 newTokenId = _currentTokenId;

        // Create token URI
        string memory imageURI = svgToImageURI(svg);
        string memory tokenURI = uri(imageURI);

        // Mint the token
        _balances[to][newTokenId] += amount;
        tokens[newTokenId] = Token(newTokenId, tokenURI, amount);

        emit Minted(to, newTokenId, amount, tokenURI);
        emit TransferSingle(msg.sender, address(0), to, newTokenId, amount);
        emit URI(tokenURI, newTokenId);
    }

    // Convert SVG to Base64 image URI
    function svgToImageURI(
        string memory svg
    ) public pure returns (string memory) {
        string memory baseURL = "data:image/svg+xml;base64,";
        string memory svgBase64Encoded = Base64.encode(bytes(svg));
        return string(abi.encodePacked(baseURL, svgBase64Encoded));
    }

    // Generate token URI using Base64
    function uri(
        string memory imageURI
    ) public pure returns (string memory) {
        return
            string(
                abi.encodePacked(
                    "data:application/json;base64,",
                    Base64.encode(
                        bytes(
                            abi.encodePacked(
                                '{"name": "LCM ON-CHAINED", "description": "A simple SVG based on-chain NFT", "image": "',
                                imageURI, // Use imageURI directly
                                '"}'
                            )
                        )
                    )
                )
            );
    }

    // View balance of an address for a specific token ID
    function balanceOf(
        address owner,
        uint256 id
    ) public view returns (uint256) {
        return _balances[owner][id];
    }

    // View multiple balances
    function balanceOfBatch(
        address[] memory owners,
        uint256[] memory ids
    ) public view returns (uint256[] memory) {
        uint256[] memory batchBalances = new uint256[](owners.length);
        for (uint256 i = 0; i < owners.length; i++) {
            batchBalances[i] = _balances[owners[i]][ids[i]];
        }
        return batchBalances;
    }
}
