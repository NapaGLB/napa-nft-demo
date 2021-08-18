const NapaCryptoSpaceMarket = artifacts.require("NapaCryptoSpaceMarket");
const SpaceToken = artifacts.require("SpaceToken");


function sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}

describe("NapaCryptoSpaceMarket contract", function () {
    let accounts;
    before(async function () {
        accounts = await web3.eth.getAccounts();
        sp = await SpaceToken.new("http://hihihaha.com/", { from: accounts[0] });
        np = await NapaCryptoSpaceMarket.new(sp.address, { from: accounts[0] });
        await sp.mintBatch721Token(6, { from: accounts[0] });
        // isApprovedForAll(accounts[0], np.address)
        await sp.setApprovalForAll(np.address, true, { from: accounts[0] });
        await sp.setApprovalForAll(np.address, true, { from: accounts[1] });
        await sp.setApprovalForAll(np.address, true, { from: accounts[2] });
        await sp.setApprovalForAll(np.address, true, { from: accounts[3] });

    });

    describe("Deployment", function () {
        it("Should ok when get space and transfer space", async function () {

            await np.getSpace(0, {
                from: accounts[1]
            });
            await np.getSpace(1, {
                from: accounts[2]
            });
            await np.getSpace(2, {
                from: accounts[3]
            });
            await sp.mint721Token(accounts[10], "", { from: accounts[0] });
            let data = await sp.ownerOf(6);
            assert.equal(data, accounts[10]);

            await np.transferSpace(accounts[10], 0, {
                from: accounts[1]
            });

            data = await sp.balanceOf(accounts[10]);
            assert.equal(data, 2);

        });

        it("Should ok when offer space to all address", async function () {

            await np.offerSpaceForSale(1, 10, {
                from: accounts[2]
            });

            await np.buySpace(1, {
                from: accounts[3],
                value: 12
            })

            let blcOf = await sp.balanceOf(accounts[3]);
            console.log(web3.utils.toBN(blcOf).toString())

        });

        it("Should ok when offer space to one address", async function () {

            await np.offerSpaceForSaleToAddress(1, 10, accounts[9], {
                from: accounts[3]
            });

            await np.buySpace(1, {
                from: accounts[9],
                value: 12
            })

            let blcOf = await sp.balanceOf(accounts[3]);
            console.log(web3.utils.toBN(blcOf).toString())

        });

        it("Should ok when offer bid", async function () {

            await np.enterBidForSpace(2, {
                from: accounts[4],
                value: 31
            });

            let pendingAmount = await np.pendingWithdrawals(accounts[4])
            assert.equal(pendingAmount, 0);

            await np.enterBidForSpace(2, {
                from: accounts[5],
                value: 34
            });

            pendingAmount = await np.pendingWithdrawals(accounts[4])
            assert.equal(pendingAmount, 31);
        });

        it("Should ok when get some data", async function () {

            // await np.offerSpaceForSale(1, 10, {
            //     from: accounts[9]
            // });

            // await np.offerSpaceForSale(6, 24, {
            //     from: accounts[10]
            // });

            let data = await np.returnSpacesOfferedForSaleArray();
            console.log(data);
            console.log("offer size : ",data.length);

            console.log("==============================");
            // data = await np.returnSpacesBidsArray();
            // console.log(data);
            // console.log("bid size : ",data.length);
            console.log("==============================");
            // data = await np.returnSpaceIndexToAddressArray();
            // console.log(data);
            

        });
    });

});

// await truffleAssert.reverts(hk1.withdraw({
//     from: accounts[1]
//   }),
//     "You are not the bidder"
//   )
