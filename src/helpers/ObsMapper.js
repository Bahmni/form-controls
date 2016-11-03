import {createFormNamespace} from "src/helpers/formNamespace";

export class ObsMapper{
    getValue(obs){
        return obs.get();
    }

    setValue(obs, value){
        if(value && value.trim() === ""){
            return obs.set(value);
        }
        return obs.void();
    }

    equals(initialObs,finalObs){
        return initialObs.equals(finalObs);
    }
}
