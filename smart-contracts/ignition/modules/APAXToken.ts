import { buildModule } from "@nomicfoundation/hardhat-ignition/modules";


const APAXTokenModule = buildModule(
  "APAXTokenModule",
  (m) => {


    const owner =
      m.getAccount(0);



    const token =
      m.contract(
        "APAXToken",
        [
          owner
        ]
      );



    return {
      token
    };

  }
);


export default APAXTokenModule;