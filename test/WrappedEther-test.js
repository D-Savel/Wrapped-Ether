/* eslint-disable no-unused-vars */
/* eslint-disable quotes */
/* eslint-disable no-undef */

const { expect } = require('chai');

describe('WrappedEther', function () {
  let WrappedEther, wrappedEther, deployer, owner, alice, bob, charlie, dan, eve;

  const TOKEN_AMOUNT_DEPOSIT = 1000;
  const TOKEN_AMOUNT_WITHDRAW = 500;
  beforeEach(async function () {
    [deployer, owner, alice] = await ethers.getSigners();
    WrappedEther = await ethers.getContractFactory('WrappedEther');
    wrappedEther = await WrappedEther.connect(deployer).deploy();
    await wrappedEther.deployed();
  });
  describe('receive', async function () {
    it('Ether receive from metamask change contract Ether balance', async function () {
      expect(
        await alice.sendTransaction({ to: wrappedEther.address, value: TOKEN_AMOUNT_DEPOSIT, gasPrice: 0 }),
      ).to.changeEtherBalance(wrappedEther, TOKEN_AMOUNT_DEPOSIT);
    });
  });
  describe('WrappedEther deposit', function () {
    it("Should WrappedEther Ether balance increase WETH tokens amount", async function () {
      expect(await wrappedEther.connect(alice).deposit({ value: TOKEN_AMOUNT_DEPOSIT }))
        .to.changeEtherBalance(wrappedEther, TOKEN_AMOUNT_DEPOSIT);
    });
    it("Should buyer Ether balance decrease WETH tokens amount", async function () {
      expect(await wrappedEther.connect(alice).deposit({ value: TOKEN_AMOUNT_DEPOSIT }))
        .to.changeEtherBalance(alice, -TOKEN_AMOUNT_DEPOSIT);
    });
    it("Should buyer WETH Token balance increase WETH tokens amount", async function () {
      const beforeAliceBalance = await wrappedEther.balanceOf(alice.address);
      await wrappedEther.connect(alice).deposit({ value: TOKEN_AMOUNT_DEPOSIT });
      expect(await wrappedEther.balanceOf(alice.address)).to.equal(beforeAliceBalance.add(TOKEN_AMOUNT_DEPOSIT));
    });
    beforeEach(async function () {
      [deployer, owner, alice] = await ethers.getSigners();
      await wrappedEther.connect(alice).deposit({ value: TOKEN_AMOUNT_DEPOSIT });
    });
    describe('WrappedEther withdraw', function () {
      it("Should Ether balance change WETH tokens amount for contract and buyer", async function () {
        const tx = await wrappedEther.connect(alice).withdraw(TOKEN_AMOUNT_WITHDRAW);
        expect(tx).to.changeEtherBalance(wrappedEther, -TOKEN_AMOUNT_WITHDRAW);
        expect(tx).to.changeEtherBalance(alice, TOKEN_AMOUNT_WITHDRAW);
      });
      it("Should buyer WETH Token balance decrease WETH tokens amount", async function () {
        const beforeAliceBalance = await wrappedEther.balanceOf(alice.address);
        await wrappedEther.connect(alice).withdraw(TOKEN_AMOUNT_WITHDRAW);
        expect(await wrappedEther.balanceOf(alice.address)).to.equal(beforeAliceBalance.sub(TOKEN_AMOUNT_WITHDRAW));
      });
    });
  });
});
