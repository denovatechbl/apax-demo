// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

import "@openzeppelin/contracts/token/ERC20/ERC20.sol";
import "@openzeppelin/contracts/access/Ownable.sol";

/// @title APAX Token
/// @author Rohit Koli
/// @notice ERC20 token with holder whitelist management.
/// @dev Extends OpenZeppelin's ERC20 and Ownable contracts.
contract APAXToken is ERC20, Ownable {
    /// @notice 1 Million Fixed Supply with 18 decimals
    uint256 public constant INITIAL_SUPPLY = 1_000_000 * 10 ** 18;

    mapping(address => bool) private approvedHolders;

    error InvalidHolderAddress();
    error HolderAlreadyApproved(address holder);
    error HolderNotApproved(address holder);
    error HolderNotAllowed(address holder);

    event HolderApproved(address indexed holder);
    event HolderRevoked(address indexed holder);

    /// @notice Initializes the contract, auto-approves the owner, and mints initial supply.
    /// @param initialOwner The address that will own the contract and receive the initial supply.
    constructor(
        address initialOwner
    ) ERC20("APAX Token", "APAX") Ownable(initialOwner) {
        // Chronology Fix: First approve the owner to prevent deployment revert in _update
        approvedHolders[initialOwner] = true;
        emit HolderApproved(initialOwner);

        // Then mint the supply
        _mint(initialOwner, INITIAL_SUPPLY);
    }

    /// @notice Approves a holder to receive and hold APAX tokens.
    /// @param holder Address to approve as a holder.
    function approveHolder(address holder) external onlyOwner {
        if (holder == address(0)) {
            revert InvalidHolderAddress();
        }
        if (approvedHolders[holder]) {
            revert HolderAlreadyApproved(holder);
        }
        approvedHolders[holder] = true;
        emit HolderApproved(holder);
    }

    /// @notice Revokes a holder's approval, preventing them from sending/receiving tokens.
    /// @param holder Address to revoke approval from.
    function revokeHolder(address holder) external onlyOwner {
        if (holder == address(0)) {
            revert InvalidHolderAddress();
        }
        if (!approvedHolders[holder]) {
            revert HolderNotApproved(holder);
        }
        approvedHolders[holder] = false;
        emit HolderRevoked(holder);
    }

    /// @notice Checks if a specific holder address is approved.
    /// @param holder The address to verify.
    /// @return True if the holder is approved, false otherwise.
    function isApproved(address holder) external view returns (bool) {
        return approvedHolders[holder];
    }

    /// @notice Internal hook that is called before any transfer of tokens (including minting and burning).
    /// @dev Enforces the whitelist restrictions for both sender and recipient.
    /// @param from The address tokens are transferred from.
    /// @param to The address tokens are transferred to.
    /// @param value The amount of tokens transferred.
    function _update(
        address from,
        address to,
        uint256 value
    ) internal override {
        // Skip check for minting (from address(0))
        if (from != address(0) && !approvedHolders[from]) {
            revert HolderNotAllowed(from);
        }

        // Skip check for burning (to address(0))
        if (to != address(0) && !approvedHolders[to]) {
            revert HolderNotAllowed(to);
        }

        // Call parent ERC20 logic
        super._update(from, to, value);
    }
}
