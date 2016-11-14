import { expect } from 'chai';
import { Validator } from 'src/helpers/Validator';
import { Obs } from "src/helpers/Obs";
import { ControlState } from "src/ControlState";

describe.only('Control State', () => {

    it('should set a new obs in the control state', () => {
        const controlState = new ControlState();
        const updatedState = controlState.setFields(new Obs({formNamespace: "form1/1"}));

        console.log(updatedState.getData());

        expect(controlState.getData()).to.be.not.equal(updatedState.getData());

    });

});
