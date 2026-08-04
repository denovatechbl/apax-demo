import { expect } from "chai";
import { network } from "hardhat";

describe("APXGoldToken", function () {
    async function deployFixture() {
        const { ethers } = await network.connect();

        const [admin, minter, redeemer, holder1, holder2, outsider] =
            await ethers.getSigners();

        const APXGoldToken = await ethers.getContractFactory("APXGoldToken");
        const token = await APXGoldToken.deploy(admin.address);
        await token.waitForDeployment();

        // Wire up roles the way APAX would in production: admin grants a
        // dedicated custody/oracle service MINTER_ROLE and a dedicated
        // redemption service REDEMPTION_ROLE (least privilege).
        const MINTER_ROLE = await token.MINTER_ROLE();
        const REDEMPTION_ROLE = await token.REDEMPTION_ROLE();
        const COMPLIANCE_ROLE = await token.COMPLIANCE_ROLE();
        const PAUSER_ROLE = await token.PAUSER_ROLE();

        await token.connect(admin).grantRole(MINTER_ROLE, minter.address);
        await token.connect(admin).grantRole(REDEMPTION_ROLE, redeemer.address);

        return {
            token,
            admin,
            minter,
            redeemer,
            holder1,
            holder2,
            outsider,
            ethers,
            MINTER_ROLE,
            REDEMPTION_ROLE,
            COMPLIANCE_ROLE,
            PAUSER_ROLE,
        };
    }

    const DEPOSIT_ID = "0x" + "11".repeat(32);
    const REDEMPTION_ID = "0x" + "22".repeat(32);

    // =====================================================
    // DEPLOYMENT / ROLES
    // =====================================================
    describe("Deployment", function () {
        it("Should whitelist and grant admin roles to the deployer-specified admin", async function () {
            const { token, admin, COMPLIANCE_ROLE, PAUSER_ROLE } = await deployFixture();
            expect(await token.isWhitelisted(admin.address)).to.equal(true);
            expect(await token.hasRole(await token.DEFAULT_ADMIN_ROLE(), admin.address)).to.equal(true);
            expect(await token.hasRole(COMPLIANCE_ROLE, admin.address)).to.equal(true);
            expect(await token.hasRole(PAUSER_ROLE, admin.address)).to.equal(true);
        });

        it("Should start with zero supply (mint is always tied to a deposit)", async function () {
            const { token } = await deployFixture();
            expect(await token.totalSupply()).to.equal(0);
        });
    });

    // =====================================================
    // MINT (tied to vault deposit)
    // =====================================================
    describe("mintFromDeposit", function () {
        it("Should allow MINTER_ROLE to mint to a whitelisted holder", async function () {
            const { token, admin, minter, holder1, ethers } = await deployFixture();
            await token.connect(admin).whitelistHolder(holder1.address);

            const amount = ethers.parseEther("100");
            await expect(token.connect(minter).mintFromDeposit(holder1.address, amount, DEPOSIT_ID))
                .to.emit(token, "MintedFromDeposit")
                .withArgs(holder1.address, amount, DEPOSIT_ID);

            expect(await token.balanceOf(holder1.address)).to.equal(amount);
        });

        it("Should reject mint to a non-whitelisted holder", async function () {
            const { token, minter, holder1, ethers } = await deployFixture();
            await expect(
                token.connect(minter).mintFromDeposit(holder1.address, ethers.parseEther("10"), DEPOSIT_ID)
            ).to.be.revertedWithCustomError(token, "HolderNotWhitelisted").withArgs(holder1.address);
        });

        it("Should reject mint from an account without MINTER_ROLE", async function () {
            const { token, admin, holder1, ethers } = await deployFixture();
            await token.connect(admin).whitelistHolder(holder1.address);

            await expect(
                token.connect(admin).mintFromDeposit(holder1.address, ethers.parseEther("10"), DEPOSIT_ID)
            ).to.be.revertedWithCustomError(token, "AccessControlUnauthorizedAccount");
        });
    });

    // =====================================================
    // BURN (tied to redemption)
    // =====================================================
    describe("burnForRedemption", function () {
        async function withFundedHolder() {
            const fx = await deployFixture();
            await fx.token.connect(fx.admin).whitelistHolder(fx.holder1.address);
            await fx.token.connect(fx.minter).mintFromDeposit(fx.holder1.address, fx.ethers.parseEther("100"), DEPOSIT_ID);
            return fx;
        }

        it("Should allow REDEMPTION_ROLE to burn a holder's tokens", async function () {
            const { token, redeemer, holder1, ethers } = await withFundedHolder();
            const amount = ethers.parseEther("40");

            await expect(token.connect(redeemer).burnForRedemption(holder1.address, amount, REDEMPTION_ID))
                .to.emit(token, "BurnedForRedemption")
                .withArgs(holder1.address, amount, REDEMPTION_ID);

            expect(await token.balanceOf(holder1.address)).to.equal(ethers.parseEther("60"));
        });

        it("Should reject burn from an account without REDEMPTION_ROLE", async function () {
            const { token, admin, holder1, ethers } = await withFundedHolder();
            await expect(
                token.connect(admin).burnForRedemption(holder1.address, ethers.parseEther("10"), REDEMPTION_ID)
            ).to.be.revertedWithCustomError(token, "AccessControlUnauthorizedAccount");
        });

        it("Should reject burning more than the holder's balance", async function () {
            const { token, redeemer, holder1, ethers } = await withFundedHolder();
            await expect(
                token.connect(redeemer).burnForRedemption(holder1.address, ethers.parseEther("1000"), REDEMPTION_ID)
            ).to.be.revertedWithCustomError(token, "InsufficientRedeemableBalance");
        });

        it("Should not let a holder self-burn (no public burn/burnFrom exposed)", async function () {
            const { token, holder1 } = await withFundedHolder();
            expect((token as any).burn).to.equal(undefined);
            expect((token as any).burnFrom).to.equal(undefined);
        });
    });

    // =====================================================
    // BLOCKED / GOVERNED TRANSFERS
    // =====================================================
    describe("Governed transfers", function () {
        async function withTwoFundedHolders() {
            const fx = await deployFixture();
            await fx.token.connect(fx.admin).whitelistHolder(fx.holder1.address);
            await fx.token.connect(fx.minter).mintFromDeposit(fx.holder1.address, fx.ethers.parseEther("100"), DEPOSIT_ID);
            return fx;
        }

        it("Should block transfer to a non-whitelisted recipient", async function () {
            const { token, holder1, holder2, ethers } = await withTwoFundedHolders();
            await expect(
                token.connect(holder1).transfer(holder2.address, ethers.parseEther("10"))
            ).to.be.revertedWithCustomError(token, "TransferNotAllowed").withArgs(holder2.address);
        });

        it("Should allow transfer once recipient is whitelisted", async function () {
            const { token, admin, holder1, holder2, ethers } = await withTwoFundedHolders();
            await token.connect(admin).whitelistHolder(holder2.address);

            await token.connect(holder1).transfer(holder2.address, ethers.parseEther("10"));
            expect(await token.balanceOf(holder2.address)).to.equal(ethers.parseEther("10"));
        });

        it("Should block transfers from a delisted sender", async function () {
            const { token, admin, holder1, holder2, ethers } = await withTwoFundedHolders();
            await token.connect(admin).whitelistHolder(holder2.address);
            await token.connect(admin).delistHolder(holder1.address);

            await expect(
                token.connect(holder1).transfer(holder2.address, ethers.parseEther("10"))
            ).to.be.revertedWithCustomError(token, "TransferNotAllowed").withArgs(holder1.address);
        });

        it("Should block ALL transfers while paused, even between whitelisted holders", async function () {
            const { token, admin, holder1, holder2, ethers } = await withTwoFundedHolders();
            await token.connect(admin).whitelistHolder(holder2.address);
            await token.connect(admin).pause();

            await expect(
                token.connect(holder1).transfer(holder2.address, ethers.parseEther("10"))
            ).to.be.revertedWithCustomError(token, "EnforcedPause");
        });

        it("Should resume transfers after unpause", async function () {
            const { token, admin, holder1, holder2, ethers } = await withTwoFundedHolders();
            await token.connect(admin).whitelistHolder(holder2.address);
            await token.connect(admin).pause();
            await token.connect(admin).unpause();

            await token.connect(holder1).transfer(holder2.address, ethers.parseEther("5"));
            expect(await token.balanceOf(holder2.address)).to.equal(ethers.parseEther("5"));
        });

        it("Should reject pause from an account without PAUSER_ROLE", async function () {
            const { token, outsider } = await deployFixture();
            await expect(
                token.connect(outsider).pause()
            ).to.be.revertedWithCustomError(token, "AccessControlUnauthorizedAccount");
        });
    });
});
