// week02/MasterDetail/view.js
export class TeamMemberView {
    constructor() {
        this.firstName = document.getElementById("firstName");
        this.lastName = document.getElementById("lastName");
        this.functionName = document.getElementById("function");
        this.availableYes = document.getElementById("availableYes");
        this.availableNo = document.getElementById("availableNo");
        this.isContractor = document.getElementById("contractor");
        this.workload = document.getElementById("workLoad");
        this.resetButton = document.getElementById("reset-button");
        this.saveTeamMemberBtn = document.getElementById("save-button");
        this.addTeamMemberBtn = document.getElementById("add-teammember");
        this.teamMemberForm = document.getElementById("teammember-form");
        this.table = document.getElementById("team-records");
    }

    bindAddTeamMember(handler) {
        this.addTeamMemberBtn.addEventListener('click', handler);
    }

    bindSaveTeamMember(handler) {
        this.saveTeamMemberBtn.addEventListener('click', handler);
    }

    bindResetForm(handler) {
        this.resetButton.addEventListener('click', handler);
    }

    renderTable(teamMembers) {
        this.table.innerHTML = '';
        teamMembers.forEach((member, index) => {
            const row = this.table.insertRow();
            row.insertCell(0).innerText = member.firstName.getValue();
            row.insertCell(1).innerText = member.lastName.getValue();
            row.insertCell(2).innerText = member.functionName.getValue();
            row.insertCell(3).innerText = member.available.getValue();
            row.insertCell(4).innerText = member.isContractor.getValue() ? 'Yes' : 'No';
            row.insertCell(5).innerText = member.workload.getValue();
            const deleteCell = row.insertCell(6);
            const deleteButton = document.createElement('button');
            deleteButton.innerText = 'Delete';
            deleteButton.addEventListener('click', () => handler(index));
            deleteCell.appendChild(deleteButton);
        });
    }

    resetForm() {
        this.firstName.value = '';
        this.lastName.value = '';
        this.functionName.value = '';
        this.availableYes.checked = false;
        this.availableNo.checked = false;
        this.isContractor.checked = false;
        this.workload.value = 0;
        this.saveTeamMemberBtn.disabled = true;
        this.resetButton.disabled = true;
    }
}