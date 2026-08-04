// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

import "@openzeppelin/contracts/token/ERC20/ERC20.sol";
import "@openzeppelin/contracts/token/ERC20/extensions/ERC20Pausable.sol";
import "@openzeppelin/contracts/access/AccessControl.sol";

/// @title APX-Gold — compliance-aware, vault-backed gold token
/// @notice ERC-20 representation of physical gold held in APAX vaults.
/// @dev Design notes (see smart-contracts/README.md "APX-Gold design" and
/// report.md "Blockchain Task A" for the full write-up, tradeoffs and
/// security checklist):
///
///  - ERC-20 + custom compliance gates, NOT plain ERC-20 and NOT full
///    ERC-3643. A permissioned `_update` hook enforces a KYC/whitelist
///    check on every transfer, mint and burn (sender AND receiver), which
///    covers the "governed transfer" requirement without taking on the
///    complexity of a full ERC-3643 identity/claims registry. See report
///    for when we WOULD reach for ERC-3643 instead.
///  - Roles (OpenZeppelin AccessControl, not single-owner Ownable):
///      DEFAULT_ADMIN_ROLE  - governance: grants/revokes all other roles.
///      COMPLIANCE_ROLE     - manages the holder whitelist (KYC gate).
///      MINTER_ROLE         - mints ONLY against an attested vault deposit.
///      REDEMPTION_ROLE     - burns ONLY against an approved redemption.
///      PAUSER_ROLE         - emergency stop for all transfers/mint/burn.
///    Splitting these lets APAX give a custody/oracle service MINTER_ROLE
///    and a separate redemption service REDEMPTION_ROLE, without either
///    holding full admin power — least privilege.
///  - Mint is tied to a vault deposit reference (`depositId`) and burn is
///    tied to a redemption reference (`redemptionId`) so every supply
///    change has an auditable off-chain -> on-chain link (see events).
///  - Pausable: COMPLIANCE/PAUSER can freeze all transfers instantly if a
///    reserve audit fails or a vulnerability is found, without needing to
///    revoke every holder individually.
contract APXGoldToken is ERC20, ERC20Pausable, AccessControl {
    bytes32 public constant COMPLIANCE_ROLE = keccak256("COMPLIANCE_ROLE");
    bytes32 public constant MINTER_ROLE = keccak256("MINTER_ROLE");
    bytes32 public constant REDEMPTION_ROLE = keccak256("REDEMPTION_ROLE");
    bytes32 public constant PAUSER_ROLE = keccak256("PAUSER_ROLE");

    /// @notice grams of gold represented per whole token (18 decimals), for UI/off-chain reference only.
    uint256 public constant GRAMS_PER_TOKEN = 1;

    mapping(address => bool) private _whitelisted;

    error InvalidHolderAddress();
    error HolderAlreadyWhitelisted(address holder);
    error HolderNotWhitelisted(address holder);
    error TransferNotAllowed(address account);
    error InsufficientRedeemableBalance(address holder, uint256 requested, uint256 available);

    event HolderWhitelisted(address indexed holder, address indexed by);
    event HolderDelisted(address indexed holder, address indexed by);

    /// @dev depositId / redemptionId are off-chain reference hashes (e.g.
    /// keccak256 of a vault deposit ticket or redemption request id) so a
    /// backend/indexer can reconcile on-chain supply changes against
    /// MongoDB records without trusting on-chain data alone for provenance.
    event MintedFromDeposit(address indexed to, uint256 amount, bytes32 indexed depositId);
    event BurnedForRedemption(address indexed holder, uint256 amount, bytes32 indexed redemptionId);

    constructor(address admin) ERC20("APAX Gold", "APX-G") {
        if (admin == address(0)) revert InvalidHolderAddress();

        _grantRole(DEFAULT_ADMIN_ROLE, admin);
        _grantRole(COMPLIANCE_ROLE, admin);
        _grantRole(PAUSER_ROLE, admin);

        // Admin is whitelisted so initial mints / treasury ops are possible.
        _whitelisted[admin] = true;
        emit HolderWhitelisted(admin, admin);
    }

    // ============================================================
    // Compliance / whitelist management
    // ============================================================

    function whitelistHolder(address holder) external onlyRole(COMPLIANCE_ROLE) {
        if (holder == address(0)) revert InvalidHolderAddress();
        if (_whitelisted[holder]) revert HolderAlreadyWhitelisted(holder);
        _whitelisted[holder] = true;
        emit HolderWhitelisted(holder, msg.sender);
    }

    function delistHolder(address holder) external onlyRole(COMPLIANCE_ROLE) {
        if (!_whitelisted[holder]) revert HolderNotWhitelisted(holder);
        _whitelisted[holder] = false;
        emit HolderDelisted(holder, msg.sender);
    }

    function isWhitelisted(address holder) external view returns (bool) {
        return _whitelisted[holder];
    }

    // ============================================================
    // Pause (emergency stop)
    // ============================================================

    function pause() external onlyRole(PAUSER_ROLE) {
        _pause();
    }

    function unpause() external onlyRole(PAUSER_ROLE) {
        _unpause();
    }

    // ============================================================
    // Mint — tied to a vault deposit, never free-standing
    // ============================================================

    /// @param to Whitelisted recipient (typically the depositor).
    /// @param amount Token amount, 18 decimals, 1 token == 1 gram of gold.
    /// @param depositId Reference to the off-chain/oracle-attested vault
    /// deposit record that justifies this mint (audit trail).
    function mintFromDeposit(
        address to,
        uint256 amount,
        bytes32 depositId
    ) external onlyRole(MINTER_ROLE) {
        if (!_whitelisted[to]) revert HolderNotWhitelisted(to);
        _mint(to, amount);
        emit MintedFromDeposit(to, amount, depositId);
    }

    // ============================================================
    // Burn — tied to an approved redemption, never a free self-burn
    // ============================================================

    /// @dev Intentionally NOT exposing a public `burn()` / `burnFrom()` a
    /// holder can call at will (unlike ERC20Burnable). Physical redemption
    /// has real-world steps (KYC re-check, shipping/settlement, reserve
    /// accounting) that must be confirmed off-chain / by REDEMPTION_ROLE
    /// BEFORE the token is destroyed — see report.md "what should happen
    /// on redemption before burn is allowed".
    /// @param holder Address whose tokens are being redeemed.
    /// @param amount Amount to burn.
    /// @param redemptionId Reference to the approved off-chain redemption request.
    function burnForRedemption(
        address holder,
        uint256 amount,
        bytes32 redemptionId
    ) external onlyRole(REDEMPTION_ROLE) {
        uint256 balance = balanceOf(holder);
        if (balance < amount) revert InsufficientRedeemableBalance(holder, amount, balance);
        _burn(holder, amount);
        emit BurnedForRedemption(holder, amount, redemptionId);
    }

    // ============================================================
    // Transfer restriction hook
    // ============================================================

    /// @dev Single choke point for mint/burn/transfer. Whitelist check is
    /// skipped for address(0) (mint source / burn destination). Pause
    /// enforcement comes from ERC20Pausable's override of `_update`.
    function _update(
        address from,
        address to,
        uint256 value
    ) internal override(ERC20, ERC20Pausable) {
        if (from != address(0) && !_whitelisted[from]) revert TransferNotAllowed(from);
        if (to != address(0) && !_whitelisted[to]) revert TransferNotAllowed(to);

        super._update(from, to, value);
    }
}
