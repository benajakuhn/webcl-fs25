// week02/MasterDetail/controller.js
import { TeamMember, TeamMemberList } from './model.js';
import { TeamMemberView } from './view.js';

export class TeamMemberController {
    constructor() {
        this.model = new TeamMemberList();
        this.view = new TeamMemberView();
    }

    addTeamMember() {
        this.model.addTeamMember(new TeamMember('John', 'Doe', 'Developer', 'Yes', false, 100));
        this.view.renderTable(this.model.teamMembers.list);
    }

    saveTeamMember() {
        const member = new TeamMember(
            this.view.firstName.value,
            this.view.lastName.value,
            this.view.functionName.value,
            this.view.availableYes.checked ? 'Yes' : 'No',
            this.view.isContractor.checked,
            this.view.workload.value
        );

        this.model.addTeamMember(member);
        this.view.resetForm();
        this.view.teamMemberForm.classList.add('unselected');
    }

    deleteTeamMember(index) {
        const member = this.model.teamMembers.list[index];
        this.model.deleteTeamMember(member);
    }

    resetForm() {
        this.view.resetForm();
    }

    updateView() {
        this.view.renderTable(this.model.teamMembers.list);
    }
}