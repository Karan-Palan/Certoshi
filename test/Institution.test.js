const web3 = require("web3");
var Institution = artifacts.require("./Institution.sol");

require("chai").use(require("chai-as-promised")).should();

contract("Institution", (accounts) => {
    let institution;
    let mockOwnerAcc = accounts[0];
    let mockInstituteAcc = accounts[1];
    let mockRandomInvalidAcc = accounts[2];
    let mockInstitute = {
        instituteName: "Singapore University of Technology and Design",
        instituteAcronym: "SUTD",
        instituteLink: "https://sutd.edu.sg/",
    };
    let mockInstituteCourses = [{
            course_name: "Computer Science and Design",
        },
        {
            course_name: "Engineering Product and Development",
        },
        {
            course_name: "Engineering Systems and Design",
        },
        {
            course_name: "Architecture and Sustainable Design",
        },
    ];

    before(async() => {
        // Load Contracts
        institution = await Institution.new({ from: mockOwnerAcc });
        // institution = await Institution.deployed() // if you want to plug the the deployed contract
    });

    describe("Deployment of Institution Contract", async() => {
        it("has an owner", async() => {
            const contractOwner = await institution.owner();
            assert.equal(contractOwner, mockOwnerAcc);
        });
    });

    describe("Adding of an Institution", async() => {
        it("adds an institution with valid id", async() => {
            const receipt = await institution.addInstitute(
                mockInstituteAcc,
                mockInstitute.instituteName,
                mockInstitute.instituteAcronym,
                mockInstitute.instituteLink,
                mockInstituteCourses, { from: mockOwnerAcc }
            );
            assert.equal(receipt.logs.length, 1, "an event was not triggered");
            assert.equal(
                receipt.logs[0].event,
                "instituteAdded",
                "the event type is incorrect"
            );
            assert.equal(
                receipt.logs[0].args._instituteName,
                mockInstitute.instituteName,
                "the institution name is incorrect"
            );
        });
        it("fails if transaction is from an invalid owner (address)", async() => {
            try {
                const receipt = await institution.addInstitute(
                    mockInstituteAcc,
                    mockInstitute.instituteName,
                    mockInstitute.instituteAcronym,
                    mockInstitute.instituteLink,
                    mockInstituteCourses, { from: mockRandomInvalidAcc }
                );
                const failure = assert.fail(receipt);
            } catch (err) {
                assert(
                    err.message.indexOf("revert") >= 0,
                    "error message must contain revert"
                );
            }
        });
        it("fails if institute address already exists", async() => {
            const institution2 = await Institution.new({ from: mockOwnerAcc });
            const receipt = await institution2.addInstitute(
                mockInstituteAcc,
                mockInstitute.instituteName,
                mockInstitute.instituteAcronym,
                mockInstitute.instituteLink,
                mockInstituteCourses, { from: mockOwnerAcc }
            );
            try {
                // add institute with same institute address - should fail
                const receipt = await institution2.addInstitute(
                    mockInstituteAcc,
                    mockInstitute.instituteName,
                    mockInstitute.instituteAcronym,
                    mockInstitute.instituteLink,
                    mockInstituteCourses, { from: mockOwnerAcc }
                );
                const failure = assert.fail(receipt);
            } catch (err) {
                assert(
                    err.message.indexOf("revert") >= 0,
                    "error message must contain revert"
                );
            }
        });
    });

    describe("Data Retrieval for Institute data", async() => {
        it("retrieves correct institute data from valid institute address", async() => {
            const instituteData = await institution.getInstituteData(mockInstituteAcc);
            assert.equal(
                instituteData[0],
                mockInstitute.instituteName,
                "the name of the institute is incorrect"
            );
            assert.equal(
                instituteData[1],
                mockInstitute.instituteAcronym,
                "the acronym of the institute is incorrect"
            );
            assert.equal(
                instituteData[2],
                mockInstitute.instituteLink,
                "the link of the institute is incorrect"
            );
            const formattedInstituteCoursesData = instituteData[3].map((x) => {
                return { course_name: x.course_name };
            });
            assert.equal(
                JSON.stringify(formattedInstituteCoursesData),
                JSON.stringify(mockInstituteCourses),
                "the courses of the institute is incorrect"
            );
        });

        it("fails for invalid institute address", async() => {
            const invalidAddress = "0x772394da93d6EbF5d4985E49ae3404a3DEE8243a";
            // Check error message - note: need to handle error in client side
            try {
                const instituteData = await institution.getInstituteData(invalidAddress);
                const failure = assert.fail(instituteData);
            } catch (err) {
                assert(
                    err.message.indexOf("revert") >= 0,
                    "error message must contain revert"
                );
            }
        });
    });

    describe("Checking of Institute Permission in Institute Contract", async() => {
        it("returns true with valid institute address", async() => {
            const result = await institution.checkInstitutePermission(mockInstituteAcc);
            console.log(result);
            assert.equal(result, true);
        });

        it("returns false with invalid institute address", async() => {
            const invalidAddress = "0x772394da93d6EbF5d4985E49ae3404a3DEE8243a";
            const result = await institution.checkInstitutePermission(invalidAddress);
            console.log(result);
            assert.equal(result, false);
        });
    });
});