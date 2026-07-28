// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

import {IERC20} from "@openzeppelin/token/ERC20/IERC20.sol";
import {SafeERC20} from "@openzeppelin/token/ERC20/utils/SafeERC20.sol";
import {ReentrancyGuard} from "@openzeppelin/utils/ReentrancyGuard.sol";

/// @title OriginLock
/// @notice A tamper-evident registry that ties a content fingerprint hash to
///         a creator and a set of license terms, and records + pays out
///         every verified use of that content against those terms.
/// @dev    This contract intentionally does NOT do content fingerprinting —
///         that happens off-chain (see the AI matching service). This
///         contract is the ledger and the escrow/payout mechanism only.
contract OriginLock is ReentrancyGuard {
    using SafeERC20 for IERC20;

    struct ContentRecord {
        address creator;
        address paymentToken;   // ERC20 used for royalty payments (e.g. USDC)
        uint256 pricePerUse;    // amount paid to the creator per verified use
        uint64 registeredAt;
        bool active;            // creator can pause licensing without deleting history
    }

    /// contentHash => record. contentHash is produced off-chain by the
    /// fingerprinting service (e.g. keccak256 of a perceptual hash / embedding).
    mapping(bytes32 => ContentRecord) public records;

    /// contentHash => total number of verified, paid uses.
    mapping(bytes32 => uint256) public useCount;

    /// Addresses allowed to call recordUsage() on behalf of the matching
    /// service. Kept as a small allowlist rather than a single owner so the
    /// matching/oracle role can be rotated or run by more than one party.
    mapping(address => bool) public verifiers;

    address public admin;

    event ContentRegistered(
        bytes32 indexed contentHash,
        address indexed creator,
        address paymentToken,
        uint256 pricePerUse
    );
    event LicenseTermsUpdated(bytes32 indexed contentHash, uint256 newPricePerUse, bool active);
    event UsageRecorded(
        bytes32 indexed contentHash,
        address indexed licensee,
        uint256 amountPaid,
        uint256 useIndex
    );
    event VerifierUpdated(address indexed verifier, bool allowed);

    error NotCreator();
    error NotVerifier();
    error AlreadyRegistered();
    error UnknownContent();
    error ContentInactive();

    modifier onlyAdmin() {
        require(msg.sender == admin, "not admin");
        _;
    }

    modifier onlyCreator(bytes32 contentHash) {
        if (records[contentHash].creator != msg.sender) revert NotCreator();
        _;
    }

    modifier onlyVerifier() {
        if (!verifiers[msg.sender]) revert NotVerifier();
        _;
    }

    constructor(address _admin) {
        admin = _admin;
        verifiers[_admin] = true;
    }

    /// @notice Register a new piece of content and its license terms.
    /// @param contentHash Fingerprint hash produced off-chain by the matching service.
    /// @param paymentToken ERC20 token the creator wants to be paid in.
    /// @param pricePerUse Amount of `paymentToken` owed per verified use.
    function register(
        bytes32 contentHash,
        address paymentToken,
        uint256 pricePerUse
    ) external {
        if (records[contentHash].creator != address(0)) revert AlreadyRegistered();

        records[contentHash] = ContentRecord({
            creator: msg.sender,
            paymentToken: paymentToken,
            pricePerUse: pricePerUse,
            registeredAt: uint64(block.timestamp),
            active: true
        });

        emit ContentRegistered(contentHash, msg.sender, paymentToken, pricePerUse);
    }

    /// @notice Update price or pause/resume licensing for a piece of content.
    function updateTerms(
        bytes32 contentHash,
        uint256 newPricePerUse,
        bool active
    ) external onlyCreator(contentHash) {
        ContentRecord storage rec = records[contentHash];
        rec.pricePerUse = newPricePerUse;
        rec.active = active;
        emit LicenseTermsUpdated(contentHash, newPricePerUse, active);
    }

    /// @notice Called by an approved verifier once the off-chain matching
    ///         service confirms `licensee` used the content behind
    ///         `contentHash`. Pulls `pricePerUse` from `licensee` (who must
    ///         have approved this contract to spend `paymentToken`) and
    ///         forwards it to the creator in the same transaction.
    function recordUsage(bytes32 contentHash, address licensee)
        external
        onlyVerifier
        nonReentrant
        returns (uint256 useIndex)
    {
        ContentRecord memory rec = records[contentHash];
        if (rec.creator == address(0)) revert UnknownContent();
        if (!rec.active) revert ContentInactive();

        useIndex = ++useCount[contentHash];

        if (rec.pricePerUse > 0) {
            IERC20(rec.paymentToken).safeTransferFrom(licensee, rec.creator, rec.pricePerUse);
        }

        emit UsageRecorded(contentHash, licensee, rec.pricePerUse, useIndex);
    }

    /// @notice Add or remove an address allowed to call recordUsage().
    function setVerifier(address verifier, bool allowed) external onlyAdmin {
        verifiers[verifier] = allowed;
        emit VerifierUpdated(verifier, allowed);
    }

    function transferAdmin(address newAdmin) external onlyAdmin {
        admin = newAdmin;
    }
}