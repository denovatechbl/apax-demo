import { expect } from "chai";
import { network } from "hardhat";

describe("APAXToken", function () {

    async function deployAPAXTokenFixture() {
        const { ethers } = await network.connect();

        const [
            owner,
            holder1,
            holder2,
            nonOwner
        ] = await ethers.getSigners();

        const APAXToken = await ethers.getContractFactory("APAXToken");
        const token = await APAXToken.deploy(owner.address);
        await token.waitForDeployment();

        return {
            token,
            owner,
            holder1,
            holder2,
            nonOwner,
            ethers
        };
    }

    // =====================================================
    // DEPLOYMENT TESTS
    // =====================================================
    describe("Deployment", function () {
        it("Should assign initial supply to owner", async function () {
            const { token, owner } = await deployAPAXTokenFixture();
            const balance = await token.balanceOf(owner.address);
            const supply = await token.INITIAL_SUPPLY();
            expect(balance).to.equal(supply);
        });

        it("Should approve owner as initial holder", async function () {
            const { token, owner } = await deployAPAXTokenFixture();
            expect(await token.isApproved(owner.address)).to.equal(true);
        });
    });

    // =====================================================
    // HOLDER MANAGEMENT TESTS
    // =====================================================
    describe("Holder Management", function () {
        it("Should allow owner to approve holder", async function () {
            const { token, holder1 } = await deployAPAXTokenFixture();
            await token.approveHolder(holder1.address);
            expect(await token.isApproved(holder1.address)).to.equal(true);
        });

        it("Should emit HolderApproved event", async function () {
            const { token, holder1 } = await deployAPAXTokenFixture();
            await expect(token.approveHolder(holder1.address))
                .to.emit(token, "HolderApproved")
                .withArgs(holder1.address);
        });

        it("Should reject approval from non-owner", async function () {
            const { token, holder1, nonOwner } = await deployAPAXTokenFixture();
            await expect(
                token.connect(nonOwner).approveHolder(holder1.address)
            ).to.be.revertedWithCustomError(token, "OwnableUnauthorizedAccount");
        });

        it("Should reject duplicate approval", async function () {
            const { token, holder1 } = await deployAPAXTokenFixture();
            await token.approveHolder(holder1.address);
            await expect(
                token.approveHolder(holder1.address)
            ).to.be.revertedWithCustomError(token, "HolderAlreadyApproved")
                .withArgs(holder1.address);
        });

        it("Should reject zero address approval", async function () {
            const { token, ethers } = await deployAPAXTokenFixture();
            await expect(
                token.approveHolder(ethers.ZeroAddress)
            ).to.be.revertedWithCustomError(token, "InvalidHolderAddress");
        });

        it("Should allow owner to revoke holder", async function () {
            const { token, holder1 } = await deployAPAXTokenFixture();
            await token.approveHolder(holder1.address);
            await token.revokeHolder(holder1.address);
            expect(await token.isApproved(holder1.address)).to.equal(false);
        });

        it("Should emit HolderRevoked event", async function () {
            const { token, holder1 } = await deployAPAXTokenFixture();
            await token.approveHolder(holder1.address);
            await expect(token.revokeHolder(holder1.address))
                .to.emit(token, "HolderRevoked")
                .withArgs(holder1.address);
        });

        it("Should reject revoking non-approved holder", async function () {
            const { token, holder1 } = await deployAPAXTokenFixture();
            await expect(
                token.revokeHolder(holder1.address)
            ).to.be.revertedWithCustomError(token, "HolderNotApproved")
                .withArgs(holder1.address);
        });

        it("Should reject zero address revoke", async function () {
            const { token, ethers } = await deployAPAXTokenFixture();
            await expect(
                token.revokeHolder(ethers.ZeroAddress)
            ).to.be.revertedWithCustomError(token, "InvalidHolderAddress");
        });

        it("Should approve multiple holders", async function () {
            const { token, holder1, holder2 } = await deployAPAXTokenFixture();
            await token.approveHolder(holder1.address);
            await token.approveHolder(holder2.address);
            expect(await token.isApproved(holder1.address)).to.equal(true);
            expect(await token.isApproved(holder2.address)).to.equal(true);
        });
    });

    // =====================================================
    // OWNERSHIP TESTS
    // =====================================================
    describe("Ownership", function () {
        it("Should transfer ownership successfully", async function () {
            const { token, holder1 } = await deployAPAXTokenFixture();
            await token.transferOwnership(holder1.address);
            expect(await token.owner()).to.equal(holder1.address);
        });

        it("Old owner should not approve holder after ownership transfer", async function () {
            const { token, holder1, holder2 } = await deployAPAXTokenFixture();
            await token.transferOwnership(holder1.address);
            await expect(
                token.approveHolder(holder2.address)
            ).to.be.revertedWithCustomError(token, "OwnableUnauthorizedAccount");
        });

        it("New owner should approve holder", async function () {
            const { token, holder1, holder2 } = await deployAPAXTokenFixture();
            await token.transferOwnership(holder1.address);
            await token.connect(holder1).approveHolder(holder2.address);
            expect(await token.isApproved(holder2.address)).to.equal(true);
        });
    });

    // =====================================================
    // TOKEN TRANSFER RULE TESTS
    // =====================================================
    describe("Token Transfer Rules", function () {
        it("Should allow transfer to approved holder", async function () {
            const { token, holder1, ethers } = await deployAPAXTokenFixture();
            await token.approveHolder(holder1.address);
            const amount = ethers.parseEther("100");
            await token.transfer(holder1.address, amount);
            expect(await token.balanceOf(holder1.address)).to.equal(amount);
        });

        it("Should reject transfer to unapproved holder", async function () {
            const { token, holder1, ethers } = await deployAPAXTokenFixture();
            await expect(
                token.transfer(holder1.address, ethers.parseEther("100"))
            ).to.be.revertedWithCustomError(token, "HolderNotAllowed")
                .withArgs(holder1.address);
        });

        it("Should reject transfer to revoked holder", async function () {
            const { token, holder1, ethers } = await deployAPAXTokenFixture();
            await token.approveHolder(holder1.address);
            await token.revokeHolder(holder1.address);
            await expect(
                token.transfer(holder1.address, ethers.parseEther("100"))
            ).to.be.revertedWithCustomError(token, "HolderNotAllowed")
                .withArgs(holder1.address);
        });

        it("Should allow transferFrom to approved holder", async function () {
            const { token, owner, holder1, holder2, ethers } = await deployAPAXTokenFixture();
            await token.approveHolder(holder1.address);
            await token.approveHolder(holder2.address);

            const amount = ethers.parseEther("100");
            await token.transfer(holder1.address, amount);
            await token.connect(holder1).approve(owner.address, amount);
            await token.transferFrom(holder1.address, holder2.address, amount);

            expect(await token.balanceOf(holder2.address)).to.equal(amount);
        });

        it("Should reject transferFrom to unapproved holder", async function () {
            const { token, owner, holder1, holder2, ethers } = await deployAPAXTokenFixture();
            await token.approveHolder(holder1.address);

            const amount = ethers.parseEther("100");
            await token.transfer(holder1.address, amount);
            await token.connect(holder1).approve(owner.address, amount);

            await expect(
                token.transferFrom(holder1.address, holder2.address, amount)
            ).to.be.revertedWithCustomError(token, "HolderNotAllowed")
                .withArgs(holder2.address);
        });

        it("Should allow transfer after receiver gets approved", async function () {
            const { token, holder1, ethers } = await deployAPAXTokenFixture();
            const amount = ethers.parseEther("100");

            await expect(
                token.transfer(holder1.address, amount)
            ).to.be.revertedWithCustomError(token, "HolderNotAllowed");

            await token.approveHolder(holder1.address);
            await token.transfer(holder1.address, amount);

            expect(await token.balanceOf(holder1.address)).to.equal(amount);
        });

        it("Should transfer tokens to multiple approved holders", async function () {
            const { token, holder1, holder2, ethers } = await deployAPAXTokenFixture();
            await token.approveHolder(holder1.address);
            await token.approveHolder(holder2.address);

            const amount = ethers.parseEther("100");
            await token.transfer(holder1.address, amount);
            await token.transfer(holder2.address, amount);

            expect(await token.balanceOf(holder1.address)).to.equal(amount);
            expect(await token.balanceOf(holder2.address)).to.equal(amount);
        });

        it("Should reject transferFrom after holder is revoked", async function () {
            const { token, owner, holder1, holder2, ethers } = await deployAPAXTokenFixture();
            await token.approveHolder(holder1.address);
            await token.approveHolder(holder2.address);

            const amount = ethers.parseEther("100");
            await token.transfer(holder1.address, amount);
            await token.connect(holder1).approve(owner.address, amount);
            await token.revokeHolder(holder2.address);

            await expect(
                token.transferFrom(holder1.address, holder2.address, amount)
            ).to.be.revertedWithCustomError(token, "HolderNotAllowed")
                .withArgs(holder2.address);
        });
    });
});