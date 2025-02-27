// week02/MasterDetail/model.js
import { Observable, ObservableList } from '../observable/observable.js';

export class TeamMember {
    constructor(firstName, lastName, functionName, available, isContractor, workload) {
        this.firstName = Observable(firstName);
        this.lastName = Observable(lastName);
        this.functionName = Observable(functionName);
        this.available = Observable(available);
        this.isContractor = Observable(isContractor);
        this.workload = Observable(workload);
    }
}

export class TeamMemberList {
    constructor() {
        this.teamMembers = ObservableList([]);
    }

    addTeamMember(member) {
        this.teamMembers.add(member);
    }

    deleteTeamMember(member) {
        this.teamMembers.del(member);
    }
}