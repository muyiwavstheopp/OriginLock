// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

import {Script, console} from "forge-std/Script.sol";
import {OriginLock} from "../src/OriginLock.sol";

/// Usage (Base Sepolia example):
///   forge script script/Deploy.s.sol:Deploy \
///     --rpc-url base_sepolia \
///     --private-key $PRIVATE_KEY \
///     --broadcast --verify
contract Deploy is Script {
    function run() external {
        uint256 deployerKey = vm.envUint("PRIVATE_KEY");
        address deployer = vm.addr(deployerKey);

        vm.startBroadcast(deployerKey);
        OriginLock lock = new OriginLock(deployer);
        vm.stopBroadcast();

        console.log("OriginLock deployed at:", address(lock));
        console.log("Admin / initial verifier:", deployer);
    }
}