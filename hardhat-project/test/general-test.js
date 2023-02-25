const { expect } = require("chai");
const { BigNumber } = require("ethers");
const { time } = require("@openzeppelin/test-helpers");

const DAY = 86400;

const displayTime = unixTime => {
  var date = new Date(unixTime * 1000).toLocaleString("it-IT");
  return date;
};

describe("Salaries - TEST", () => {
  let Salaries, salaries, DAIToken, daiToken, owner;
  let daiTokenAddress, salariesAddress;
  const provider = ethers.getDefaultProvider();

  let initialTotalSupply;
  let currentBlock;

  beforeEach(async () => {
    DAIToken = await ethers.getContractFactory("ERC20");
    Salaries = await ethers.getContractFactory("Salaries");
    [
      owner, // 50 ether
      addr1, // 0
      addr2, // 0
      addr3, // 0
      addr4, // 0
      addr5, // 0
      addr5, // 0
      addr6, // 0
      addr7, // 0
      addr8, // 0
      addr9, // 0
      addr10, // 0
      addr11, // 0
      addr12, // 0
      addr13, // 0
      addr14, // 0
      addr15, // 0
      addr16, // 0
      addr17, // 0
      addr18, // 1000 ether
    ] = await ethers.getSigners();
  });

  describe("Current Block", () => {
    it("Should be 0", async () => {
      currentBlock = await time.latest();
      const currentBlockNumber = await time.latestBlock();

      console.debug("\t\t\tCurrent Block Number", currentBlockNumber.toString());
      console.debug("\t\t\tCurrent Block Timestamp", currentBlock.toString());
      console.debug("\t\t\tCurrent Block Time", displayTime(Number(currentBlock.toString())));
    });
  });

  describe("DAI Token Contract", () => {
    it("Should deploy", async () => {
      daiToken = await DAIToken.deploy();
      await daiToken.deployed();

      daiTokenAddress = daiToken.address;
      console.debug("\t\t\tDAI Token Contract Address:", daiTokenAddress);

      const balance = await provider.getBalance(owner.address);
      console.debug("\n\t\t\tOWNER", owner.address);
      console.debug("\t\t\tOWNER ETH Balance:", balance.toString());
    });

    it("Owner should own Total Supply", async () => {
      const ownerDAIBalance = await daiToken.balanceOf(owner.address);
      console.debug("\t\t\tOWNER DAI Balance:", `${ownerDAIBalance.toString()}`);

      initialTotalSupply = await daiToken.totalSupply();
      console.debug("\t\t\tInitial Total Supply:", `${initialTotalSupply.toString()}`);

      expect(ownerDAIBalance.toString()).to.equal(initialTotalSupply);
    });
  });

  describe("Salaries Contract", () => {
    it("Should deploy", async () => {
      salaries = await Salaries.deploy();
      await salaries.deployed();
      salariesAddress = salaries.address;
      console.debug("\t\t\tContract Address: ", salariesAddress);
    });
  });

  describe("DAI Token Approve", () => {
    it("Should test 'approve' and 'allowance' from the owner to first Comer", async () => {
      const amountForApproval = "1000000000000000000000";
      await daiToken.approve(salariesAddress, amountForApproval);
      const allowance = await daiToken.allowance(owner.address, salariesAddress);
      expect(allowance.toString()).to.equal(amountForApproval.toString());
    });
  });

  describe("Salaries Contract Fist Check", () => {
    it("Should initialize", async () => {
      await salaries.connect(owner).initialize(daiTokenAddress, addr18.address);
      const liquidityProviderAddressParam = await salaries.liquidityProviderAddressParam();
      const liquidityProviderBalance = await daiToken.balanceOf(liquidityProviderAddressParam.newValue);
      console.debug("\n\tLiquidity provider Address:", liquidityProviderAddressParam.newValue);
      console.debug(
        "\tLiquidity provider Balance:",
        ethers.utils.formatEther(liquidityProviderBalance.toString()) + " DAI",
      );
      expect(liquidityProviderAddressParam.newValue).to.equal(addr18.address);
    });

    it("Set Liquidity Provider Allowance (addr18) ", async () => {
      await daiToken.connect(addr18).approve(salariesAddress, "100000000000000000000000");
      const allowance = await daiToken.connect(addr18).allowance(addr18.address, salariesAddress);
      expect(allowance.toString()).to.equal("100000000000000000000000");
    });

    it("Owner should be the Deployer", async () => {
      const ownerAddress = await salaries.owner();
      expect(ownerAddress).to.equal(owner.address);
    });
  });

  describe("Giving DAI to Liquidity Provider", () => {
    it("Liquidity Provider Address should own 100000 DAI", async () => {
      await daiToken.connect(owner).transfer(addr18.address, "100000000000000000000000");
      const addrOVRBalance = await daiToken.balanceOf(addr18.address);
      expect(addrOVRBalance.toString()).to.equal("100000000000000000000000");
    });
  });

  describe("Adding new employees", () => {
    it("500 DAI per month for Addr1", async () => {
      const salary = "500000000000000000000";
      await salaries.connect(owner).addEmployee(addr1.address, salary);

      const employeeSalary = await salaries.connect(addr1).salaries(addr1.address);

      const date = await salaries.connect(addr1).dates(addr1.address);
      console.debug("\t\t\tDate:", displayTime(Number(date.toString())));

      expect(employeeSalary.toString()).to.equal(salary);
    });

    it("300 DAI per month for Addr2", async () => {
      const salary = "300000000000000000000";
      await salaries.connect(owner).addEmployee(addr2.address, salary);

      const employeeSalary = await salaries.connect(addr2).salaries(addr2.address);

      const date = await salaries.connect(addr2).dates(addr2.address);
      console.debug("\t\t\tDate:", displayTime(Number(date.toString())));

      expect(employeeSalary.toString()).to.equal(salary);
    });

    it("700 DAI per month for Addr3", async () => {
      const salary = "700000000000000000000";
      await salaries.connect(owner).addEmployee(addr3.address, salary);

      const employeeSalary = await salaries.connect(addr3).salaries(addr3.address);

      const date = await salaries.connect(addr3).dates(addr3.address);
      console.debug("\t\t\tDate:", displayTime(Number(date.toString())));

      expect(employeeSalary.toString()).to.equal(salary);
    });

    it("200 DAI per month for Addr4", async () => {
      const salary = "200000000000000000000";
      await salaries.connect(owner).addEmployee(addr4.address, salary);

      const employeeSalary = await salaries.connect(addr4).salaries(addr4.address);

      const date = await salaries.connect(addr4).dates(addr4.address);
      console.debug("\t\t\tDate:", displayTime(Number(date.toString())));

      expect(employeeSalary.toString()).to.equal(salary);
    });

    it("700 DAI per month for Addr5", async () => {
      const salary = "700000000000000000000";
      await salaries.connect(owner).addEmployee(addr5.address, salary);

      const employeeSalary = await salaries.connect(addr5).salaries(addr5.address);

      const date = await salaries.connect(addr5).dates(addr5.address);
      console.debug("\t\t\tDate:", displayTime(Number(date.toString())));

      expect(employeeSalary.toString()).to.equal(salary);
    });

    it("900 DAI per month for Addr6", async () => {
      const salary = "900000000000000000000";
      await salaries.connect(owner).addEmployee(addr6.address, salary);

      const employeeSalary = await salaries.connect(addr6).salaries(addr6.address);

      const date = await salaries.connect(addr6).dates(addr6.address);
      console.debug("\t\t\tDate:", displayTime(Number(date.toString())));

      expect(employeeSalary.toString()).to.equal(salary);
    });

    it("Should FAIL the addEmployee function called by the Addr7, ONLY OWNER", async () => {
      const salary = "1000000000000000000000";
      await expect(salaries.connect(addr7).addEmployee(addr7.address, salary)).to.be.revertedWith(
        "Ownable: caller is not the owner",
      );
    });

    it("Should FAIL the addEmployee function called by the owner to add Addr1 salary, Addr1 already receives a salary", async () => {
      const salary = "1000000000000000000000";
      await expect(salaries.connect(owner).addEmployee(addr1.address, salary)).to.be.revertedWith(
        "Already has a salary",
      );
    });

    it("Should FAIL the removeEmployee function called by the owner for user that han not a salary", async () => {
      const salary = "1000000000000000000000";
      await expect(salaries.connect(owner).removeEmployee(addr17.address)).to.be.revertedWith("Not an employee");
    });

    it("500 DAI per month for Addr8", async () => {
      const salary = "500000000000000000000";
      await salaries.connect(owner).addEmployee(addr8.address, salary);

      const employeeSalary = await salaries.connect(addr8).salaries(addr8.address);

      const date = await salaries.connect(addr8).dates(addr8.address);
      console.debug("\t\t\tDate:", displayTime(Number(date.toString())));

      expect(employeeSalary.toString()).to.equal(salary);
    });
  });

  describe("Passing time........ 20 Days", () => {
    it("It should be 20 days since the start", async () => {
      currentBlock = await time.latest();

      await time.increase(DAY * 20);

      currentBlock = await time.latest();
      const currentBlockNumber = await time.latestBlock();

      console.debug("\t\t\tCurrent Block Number", currentBlockNumber.toString());
      console.debug("\t\t\tCurrent Block Timestamp", currentBlock.toString());
      console.debug("\t\t\tCurrent Block Time", displayTime(Number(currentBlock.toString())));
    });
  });

  describe("Withdrawals", () => {
    it("Should FAIL withdraw Addr1", async () => {
      await expect(salaries.connect(addr1).withdraw()).to.be.revertedWith("Too early");
    });
  });

  describe("Passing time........ 10 Days", () => {
    it("It should be 30 days since the start", async () => {
      currentBlock = await time.latest();

      await time.increase(DAY * 10);

      currentBlock = await time.latest();
      const currentBlockNumber = await time.latestBlock();

      console.debug("\t\t\tCurrent Block Number", currentBlockNumber.toString());
      console.debug("\t\t\tCurrent Block Timestamp", currentBlock.toString());
      console.debug("\t\t\tCurrent Block Time", displayTime(Number(currentBlock.toString())));
    });
  });

  describe("Withdrawals", () => {
    it("Should PASS withdraw Addr1, should own 500 DAI, date should update", async () => {
      await salaries.connect(addr1).withdraw();

      const date = await salaries.connect(addr1).dates(addr1.address);

      console.debug("\t\t\tWithdrawal Date  :", displayTime(Number(date.toString())));

      const salary = "500000000000000000000";

      const ownerDAIBalance = await daiToken.balanceOf(addr1.address);
      console.debug("\t\t\tAddr1 DAI Balance:", `${ethers.utils.formatEther(ownerDAIBalance).toString()}`);

      expect(ownerDAIBalance.toString()).to.equal(salary);
    });
  });

  describe("Passing time........ 40 Days", () => {
    it("It should be 70 days since the start", async () => {
      currentBlock = await time.latest();

      await time.increase(DAY * 40);

      currentBlock = await time.latest();
      const currentBlockNumber = await time.latestBlock();

      console.debug("\t\t\tCurrent Block Number", currentBlockNumber.toString());
      console.debug("\t\t\tCurrent Block Timestamp", currentBlock.toString());
      console.debug("\t\t\tCurrent Block Time", displayTime(Number(currentBlock.toString())));
    });
  });

  describe("Withdrawals", () => {
    it("Should PASS withdraw Addr2, should widthdraw 2 months, date should update", async () => {
      await salaries.connect(addr2).withdraw();

      const date = await salaries.connect(addr2).dates(addr2.address);

      console.debug("\t\t\tWithdrawal Date  :", displayTime(Number(date.toString())));

      const final = "600000000000000000000";

      const ownerDAIBalance = await daiToken.balanceOf(addr2.address);
      console.debug("\t\t\tAddr2 DAI Balance:", `${ethers.utils.formatEther(ownerDAIBalance).toString()}`);

      expect(ownerDAIBalance.toString()).to.equal(final);
    });
  });

  describe("Passing time........ 20 Days", () => {
    it("It should be 90 days since the start", async () => {
      currentBlock = await time.latest();

      await time.increase(DAY * 20);

      currentBlock = await time.latest();
      const currentBlockNumber = await time.latestBlock();

      console.debug("\t\t\tCurrent Block Number", currentBlockNumber.toString());
      console.debug("\t\t\tCurrent Block Timestamp", currentBlock.toString());
      console.debug("\t\t\tCurrent Block Time", displayTime(Number(currentBlock.toString())));
    });
  });

  describe("Withdrawals", () => {
    it("Should PASS withdraw Addr3, should widthdraw 3 months, date should update", async () => {
      await salaries.connect(addr3).withdraw();

      const date = await salaries.connect(addr3).dates(addr3.address);

      console.debug("\t\t\tWithdrawal Date  :", displayTime(Number(date.toString())));

      const final = "2100000000000000000000";

      const ownerDAIBalance = await daiToken.balanceOf(addr3.address);
      console.debug("\t\t\tAddr3 DAI Balance:", `${ethers.utils.formatEther(ownerDAIBalance).toString()}`);

      expect(ownerDAIBalance.toString()).to.equal(final);
    });
  });

  describe("Passing time........ 10 Days", () => {
    it("It should be 100 days since the start", async () => {
      currentBlock = await time.latest();

      await time.increase(DAY * 10);

      currentBlock = await time.latest();
      const currentBlockNumber = await time.latestBlock();

      console.debug("\t\t\tCurrent Block Number", currentBlockNumber.toString());
      console.debug("\t\t\tCurrent Block Timestamp", currentBlock.toString());
      console.debug("\t\t\tCurrent Block Time", displayTime(Number(currentBlock.toString())));
    });
  });

  describe("Remove Employee", () => {
    it("Should PASS remove of Addr8,  date should update", async () => {
      await salaries.connect(owner).removeEmployee(addr8.address);

      const removalDates = await salaries.connect(addr8).removalDates(addr8.address);

      console.debug("\t\t\tRemoval Date  :", displayTime(Number(removalDates.toString())));
    });
  });

  describe("Withdrawals", () => {
    it("Should PASS withdraw Addr4, should widthdraw 3 months, date should update", async () => {
      await salaries.connect(addr4).withdraw();

      const date = await salaries.connect(addr4).dates(addr4.address);

      console.debug("\t\t\tWithdrawal Date  :", displayTime(Number(date.toString())));

      const final = "600000000000000000000";

      const ownerDAIBalance = await daiToken.balanceOf(addr4.address);
      console.debug("\t\t\tAddr4 DAI Balance:", `${ethers.utils.formatEther(ownerDAIBalance).toString()}`);

      expect(ownerDAIBalance.toString()).to.equal(final);
    });
  });

  describe("Passing time........ 80 Days", () => {
    it("It should be 180 days since the start", async () => {
      currentBlock = await time.latest();

      await time.increase(DAY * 80);

      currentBlock = await time.latest();
      const currentBlockNumber = await time.latestBlock();

      console.debug("\t\t\tCurrent Block Number", currentBlockNumber.toString());
      console.debug("\t\t\tCurrent Block Timestamp", currentBlock.toString());
      console.debug("\t\t\tCurrent Block Time", displayTime(Number(currentBlock.toString())));
    });
  });

  describe("Withdrawals", () => {
    it("Should PASS withdraw fired Addr8, should widthdraw only 3 months", async () => {
      await salaries.connect(addr8).withdraw();

      const date = await salaries.connect(addr8).dates(addr8.address);

      console.debug("\t\t\tWithdrawal Date  :", displayTime(Number(date.toString())));

      const final = "1500000000000000000000";

      const ownerDAIBalance = await daiToken.balanceOf(addr8.address);
      console.debug("\t\t\tAddr8 DAI Balance:", `${ethers.utils.formatEther(ownerDAIBalance).toString()}`);

      expect(ownerDAIBalance.toString()).to.equal(final);
    });

    it("dates[addr8] should be 0", async () => {
      const date = await salaries.connect(addr8).dates(addr8.address);
      expect(date.toString()).to.equal("0");
    });

    it("removalDates[addr8] should be 0", async () => {
      const date = await salaries.connect(addr8).removalDates(addr8.address);
      expect(date.toString()).to.equal("0");
    });

    it("salaries[addr8] should be 0", async () => {
      const salary = await salaries.connect(addr8).salaries(addr8.address);
      console.debug("\t\t\tAddr8 can be hired again");
      expect(salary.toString()).to.equal("0");
    });
  });

  describe("Withdrawals", () => {
    it("Should PASS withdraw Addr4, should widthdraw 3 months, date should update", async () => {
      await salaries.connect(addr4).withdraw();

      const date = await salaries.connect(addr4).dates(addr4.address);

      console.debug("\t\t\tWithdrawal Date  :", displayTime(Number(date.toString())));

      const final = "1200000000000000000000";

      const ownerDAIBalance = await daiToken.balanceOf(addr4.address);
      console.debug("\t\t\tAddr4 DAI Balance:", `${ethers.utils.formatEther(ownerDAIBalance).toString()}`);

      expect(ownerDAIBalance.toString()).to.equal(final);
    });
  });

  describe("Passing time........ 70 Days", () => {
    it("It should be 250 days since the start", async () => {
      currentBlock = await time.latest();

      await time.increase(DAY * 70);

      currentBlock = await time.latest();
      const currentBlockNumber = await time.latestBlock();

      console.debug("\t\t\tCurrent Block Number", currentBlockNumber.toString());
      console.debug("\t\t\tCurrent Block Timestamp", currentBlock.toString());
      console.debug("\t\t\tCurrent Block Time", displayTime(Number(currentBlock.toString())));
    });
  });

  describe("Withdrawals", () => {
    it("Should PASS withdraw Addr4, should widthdraw 2 months, date should update", async () => {
      await salaries.connect(addr4).withdraw();

      const date = await salaries.connect(addr4).dates(addr4.address);

      console.debug("\t\t\tWithdrawal Date  :", displayTime(Number(date.toString())));

      const final = "1600000000000000000000";

      const ownerDAIBalance = await daiToken.balanceOf(addr4.address);
      console.debug("\t\t\tAddr4 DAI Balance:", `${ethers.utils.formatEther(ownerDAIBalance).toString()}`);

      expect(ownerDAIBalance.toString()).to.equal(final);
    });
  });
});
