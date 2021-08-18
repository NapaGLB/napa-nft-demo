// SPDX-License-Identifier: UNLICENSED

pragma solidity 0.8.4;

import "./SpaceToken.sol";
import "./common/Ownable.sol";
import "hardhat/console.sol";

contract NapaCryptoSpaceMarket is Ownable {
    string public name;
    string public symbol;

    address public spaceTokenContract;
    struct Offer {
        bool isForSale;
        uint256 spaceIndex;
        address seller;
        uint256 minValue;       // In ether
        address onlySellTo;     // specify to sell only to a specific person
    }

    struct Bid {
        bool hasBid;
        uint256 spaceIndex;
        address bidder;
        uint256 value;
    }

    // This creates an array with all balances
    mapping (address => uint256) public balanceOf;

    // A record of spaces that are offered for sale at a specific minimum value, and perhaps to a specific person
    mapping (uint256 => Offer) public spacesOfferedForSale;
    // A record of the highest space bid
    mapping (uint256 => Bid) public  spaceBids;

    mapping (address => uint256) public pendingWithdrawals;

    event Assign(address indexed to, uint256 spaceId);
    event SpaceTransfer(address indexed from, address indexed to, uint256 spaceId);
    event SpaceOffered(uint256 indexed spaceId, uint256 minValue, address indexed toAddress);
    event SpaceBidEntered(uint256 indexed spaceId, uint256 value);
    event SpaceBidWithdrawn(uint256 indexed spaceId, uint256 value);
    event SpaceBought(uint256 indexed spaceId, uint256 value, address indexed fromAddress, address indexed toAddress);
    event SpaceNoLongerForSale(uint256 indexed spaceId);
    event ETHTransfer(address indexed from, address indexed to, uint256 value);

    /* Initializes contract with initial supply tokens to the creator of the contract */
    constructor(address _stAddress) {
        spaceTokenContract = _stAddress;        
    }

    //owner of this token should not use owner address for owning any space
    function getSpace(uint256 spaceId) external {
        address _ownerOfSpace = SpaceToken(spaceTokenContract).ownerOf(spaceId);
        require(_ownerOfSpace == owner(), "Not free space");

        console.log("getSpace: %s to %s",address(_ownerOfSpace),  _msgSender());
        SpaceToken(spaceTokenContract).safeTransferFrom(address(_ownerOfSpace), _msgSender(), spaceId);
        emit Assign(_msgSender(), spaceId);
    }

    // Transfer ownership of a space to another user without requiring payment
    function transferSpace(address to, uint256 spaceId) external {
        if (spacesOfferedForSale[spaceId].isForSale) {
            _spaceNoLongerForSale(spaceId);
        }
        console.log("transferSpace : %s to %s",_msgSender(), to);
        SpaceToken(spaceTokenContract).safeTransferFrom(_msgSender(), to, spaceId);
        emit SpaceTransfer(_msgSender(), to, spaceId);
        // Check for the case where there is a bid from the new owner and refund it.
        // Any other bid can stay in place.
        Bid memory bid = spaceBids[spaceId];
        if (bid.bidder == to) {
            // Kill bid and refund value
            pendingWithdrawals[to] += bid.value;
            spaceBids[spaceId] = Bid(false, spaceId, address(0), 0);
        }
    }

    function _spaceNoLongerForSale(uint256 spaceId) private {
        spacesOfferedForSale[spaceId] = Offer(false, spaceId, _msgSender(), 0, address(0));
        emit SpaceNoLongerForSale(spaceId);
    }

    function offerSpaceForSale(uint256 spaceId, uint256 minSalePriceInWei) external {
        spacesOfferedForSale[spaceId] = Offer(true, spaceId, _msgSender(), minSalePriceInWei, address(0));
        emit SpaceOffered(spaceId, minSalePriceInWei, address(0));
    }

    function offerSpaceForSaleToAddress(uint256 spaceId, uint256 minSalePriceInWei, address toAddress) external {
        spacesOfferedForSale[spaceId] = Offer(true, spaceId, _msgSender(), minSalePriceInWei, toAddress);
        emit SpaceOffered(spaceId, minSalePriceInWei, toAddress);
    }

    function buySpace(uint256 spaceId) payable external {
        Offer memory offer = spacesOfferedForSale[spaceId];
        require(offer.isForSale, 'Space is not for sale');
        require(offer.onlySellTo == address(0) || offer.onlySellTo == _msgSender(), 'This space can not be sold to you');
        require(msg.value >= offer.minValue, 'You must buy more than min value');
        address _ownerOfSpace = SpaceToken(spaceTokenContract).ownerOf(spaceId);
        require(offer.seller == _ownerOfSpace, 'Seller no longer owner of space');

        SpaceToken(spaceTokenContract).safeTransferFrom(_ownerOfSpace, _msgSender(), spaceId);
        _spaceNoLongerForSale(spaceId);

        pendingWithdrawals[_ownerOfSpace] += msg.value;
        emit SpaceBought(spaceId, msg.value, _ownerOfSpace, _msgSender());

        // Check for the case where there is a bid from the new owner and refund it.
        // Any other bid can stay in place.
        Bid memory bid = spaceBids[spaceId];
        if (bid.bidder == _msgSender()) {
            // Kill bid and refund value
            pendingWithdrawals[_msgSender()] += bid.value;
            spaceBids[spaceId] = Bid(false, spaceId, address(0), 0);
        }
    }

    function withdraw() external {
        uint256 amount = pendingWithdrawals[_msgSender()];
        // Remember to zero the pending refund before
        // sending to prevent re-entrancy attacks
        pendingWithdrawals[_msgSender()] = 0;
        payable(_msgSender()).transfer(amount);
        emit ETHTransfer(address(this), _msgSender(), amount);
    }

    function enterBidForSpace(uint256 spaceId) payable external {
        require(msg.value > 0, 'Value can not be 0');
        address _ownerOfSpace = SpaceToken(spaceTokenContract).ownerOf(spaceId);
        require(_msgSender() != _ownerOfSpace, 'Owner can not bid');

        Bid memory existing = spaceBids[spaceId];
        require(msg.value > existing.value, 'Value must be greater than the highest bid');
        if (existing.value > 0) {
            // Refund the failing bid
            pendingWithdrawals[existing.bidder] += existing.value;
        }
        spaceBids[spaceId] = Bid(true, spaceId, _msgSender(), msg.value);
        emit SpaceBidEntered(spaceId, msg.value);
    }

    function acceptBidForSpace(uint256 spaceId, uint256 minPrice) external {
        Bid memory bid = spaceBids[spaceId];
        require(bid.value > 0, 'Bid value must not be 0');
        require(bid.value >= minPrice, 'Bid value must be greater or equal min price');

        SpaceToken(spaceTokenContract).safeTransferFrom(_msgSender(), bid.bidder, spaceId);
        spacesOfferedForSale[spaceId] = Offer(false, spaceId, bid.bidder, 0, address(0));
        uint256 amount = bid.value;
        spaceBids[spaceId] = Bid(false, spaceId, address(0), 0);
        pendingWithdrawals[_msgSender()] += amount;
        emit SpaceBought(spaceId, bid.value, _msgSender(), bid.bidder);
    }

    function withdrawBidForSpace(uint256 spaceId) external {
        Bid memory bid = spaceBids[spaceId];
        require(bid.bidder == _msgSender(), 'You are not the bidder');

        address _ownerOfSpace = SpaceToken(spaceTokenContract).ownerOf(spaceId);
        require(_msgSender() != _ownerOfSpace, 'Owner can not bid');

        uint256 amount = bid.value;
        spaceBids[spaceId] = Bid(false, spaceId, address(0), 0);
        // Refund the bid money
        payable(_msgSender()).transfer(amount);
        emit SpaceBidWithdrawn(spaceId, bid.value);
        emit ETHTransfer(address(this), _msgSender(), amount);
    }

    function returnSpacesOfferedForSaleArray() public view returns(Offer[] memory) {
        uint256 _total = SpaceToken(spaceTokenContract).totalSupply();
        Offer[] memory offerArr = new Offer[](_total);
        for(uint256 i=0; i < _total; i++) {
            offerArr[i] = spacesOfferedForSale[i];
        }
        return offerArr;
    }

    function returnSpacesBidsArray() public view returns(Bid[] memory) {
        uint256 _total = SpaceToken(spaceTokenContract).totalSupply();
        Bid[] memory bidArr = new Bid[](_total);
        for(uint256 i=0; i < _total; i++) {
            bidArr[i] = spaceBids[i];
        }
        return bidArr;
    }

    function returnSpaceIndexToAddressArray() public view returns(address[] memory) {
        uint256 _total = SpaceToken(spaceTokenContract).totalSupply();
        address[] memory ownerArr = new address[](_total);
        for(uint256 i=0; i < _total; i++) {
            ownerArr[i] = SpaceToken(spaceTokenContract).ownerOf(i);
        }
        return ownerArr;
    }
}
