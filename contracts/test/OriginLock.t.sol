// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

import {Test} from "forge-std/Test.sol";
import {OriginLock} from "../src/OriginLock.sol";
import {ERC20} from "@openzeppelin/token/ERC20/ERC20.sol";

contract MockUSDC is ERC20 {
    constructor() ERC20("Mock USDC", "mUSDC") {
        _mint(msg.sender, 1_000_000e6);
    }

    function decimals() public pure override returns (uint8) {
        return 6;
    }

    function mint(address to, uint256 amount) external {
        _mint(to, amount);
    }
}

contract OriginLockTest is Test {
    OriginLock lock;
    MockUSDC usdc;

    address admin = address(0xA11CE);
    address creator = address(0xC0FFEE);
    address licensee = address(0xBEEF);

    bytes32 constant HASH_A = keccak256("fingerprint-a");

    function setUp() public {
        vm.prank(admin);
        lock = new OriginLock(admin);

        usdc = new MockUSDC();
        usdc.mint(licensee, 1_000e6);
    }

    function test_register_setsCreatorAndTerms() public {
        vm.prank(creator);
        lock.register(HASH_A, address(usdc), 1e6); // 1 USDC per use

        (address recCreator, address token, uint256 price, , bool active) = lock.records(HASH_A);
        assertEq(recCreator, creator);
        assertEq(token, address(usdc));
        assertEq(price, 1e6);
        assertTrue(active);
    }

    function test_register_revertsOnDuplicate() public {
        vm.prank(creator);
        lock.register(HASH_A, address(usdc), 1e6);

        vm.prank(creator);
        vm.expectRevert(OriginLock.AlreadyRegistered.selector);
        lock.register(HASH_A, address(usdc), 1e6);
    }

    function test_recordUsage_paysCreatorAndIncrementsCount() public {
        vm.prank(creator);
        lock.register(HASH_A, address(usdc), 1e6);

        vm.prank(licensee);
        usdc.approve(address(lock), type(uint256).max);

        uint256 creatorBalBefore = usdc.balanceOf(creator);

        vm.prank(admin); // admin is the default verifier
        uint256 idx = lock.recordUsage(HASH_A, licensee);

        assertEq(idx, 1);
        assertEq(lock.useCount(HASH_A), 1);
        assertEq(usdc.balanceOf(creator), creatorBalBefore + 1e6);
    }

    function test_recordUsage_revertsForNonVerifier() public {
        vm.prank(creator);
        lock.register(HASH_A, address(usdc), 1e6);

        vm.prank(licensee);
        vm.expectRevert(OriginLock.NotVerifier.selector);
        lock.recordUsage(HASH_A, licensee);
    }

    function test_updateTerms_pausesLicensing() public {
        vm.prank(creator);
        lock.register(HASH_A, address(usdc), 1e6);

        vm.prank(creator);
        lock.updateTerms(HASH_A, 2e6, false);

        vm.prank(licensee);
        usdc.approve(address(lock), type(uint256).max);

        vm.prank(admin);
        vm.expectRevert(OriginLock.ContentInactive.selector);
        lock.recordUsage(HASH_A, licensee);
    }

    function test_setVerifier_allowsNewVerifierToRecordUsage() public {
        vm.prank(creator);
        lock.register(HASH_A, address(usdc), 1e6);

        address matcher = address(0xD00D);
        vm.prank(admin);
        lock.setVerifier(matcher, true);

        vm.prank(licensee);
        usdc.approve(address(lock), type(uint256).max);

        vm.prank(matcher);
        lock.recordUsage(HASH_A, licensee);

        assertEq(lock.useCount(HASH_A), 1);
    }
}