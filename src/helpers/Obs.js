import {createFormNamespace} from "./formNamespace";

export class Obs{
    constructor(formUuid, metadata,extras){
        this._formUuid = formUuid;
        this._metadata = metadata;
        this.concept = metadata.concept;
        this.formNamespace = createFormNamespace(formUuid, metadata.id);
        if(extras){
            this.value = extras.value;
            this.observationDateTime = extras.observationDateTime;
        }
    }

    get(){
        return this.value;
    }

    set(value){
        const clone = new Obs(this._formUuid,this._metadata,this);
        clone.observationDateTime = null;
        clone.value = value;
        return clone;
    }

    void(){
        const clone = new Obs(this._formUuid,this._metadata,this);
        clone.voided = true;
        return clone;
    }

    equals(o){
        return this.value === o.value;
    }
}
