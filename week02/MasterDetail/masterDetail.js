import { ObservableList } from "../observable/observable.js";
import { Attribute }      from "../presentationModel/presentationModel.js";

export { MasterDetailController, MasterItemsView, DetailView}

const MasterDetailController = () => {

    const Entry = () => {
        const firstNameAttr = Attribute("firstName");
        const lastNameAttr = Attribute("lastName");
        const functionAttr = Attribute("function");
        const availableAttr = Attribute(false);
        const contractorAttr = Attribute(false);
        const workloadAttr = Attribute(0);

        return {
            getFirstName: firstNameAttr.valueObs.getValue,
            setFirstName: firstNameAttr.valueObs.setValue,
            onFirstNameChanged: firstNameAttr.valueObs.onChange,

            getLastName: lastNameAttr.valueObs.getValue,
            setLastName: lastNameAttr.valueObs.setValue,
            onLastNameChanged: lastNameAttr.valueObs.onChange,

            getFunction: functionAttr.valueObs.getValue,
            setFunction: functionAttr.valueObs.setValue,
            onFunctionChanged: functionAttr.valueObs.onChange,

            getAvailable: availableAttr.valueObs.getValue,
            setAvailable: availableAttr.valueObs.setValue,
            onAvailableChanged: availableAttr.valueObs.onChange,

            getContractor: contractorAttr.valueObs.getValue,
            setContractor: contractorAttr.valueObs.setValue,
            onContractorChanged: contractorAttr.valueObs.onChange,

            getWorkload: workloadAttr.valueObs.getValue,
            setWorkload: workloadAttr.valueObs.setValue,
            onWorkloadChanged: workloadAttr.valueObs.onChange,
        };
    };

    const masterModel = ObservableList([]);


    const addTeamMember = () => {
        const newEntry = Entry();
        masterModel.add(newEntry);
        console.log("new Entry called");
        return newEntry;
    };


    return {
        numberOfTodos:      masterModel.count,
        numberOfopenTasks:  () => masterModel.countIf( todo => ! todo.getDone() ),
        addTeamMember:      addTeamMember,
        onEntryAdd:          masterModel.onAdd,
    }
};


// View-specific parts

const MasterItemsView = (masterDetailController, tableElement) => {

    const render = entry => {
        const row = document.createElement('tr');

        const createCell = (value) => {
            const cell = document.createElement('td');
            cell.textContent = value;
            return cell;
        };

        const firstNameCell = createCell(entry.getFirstName());
        const lastNameCell = createCell(entry.getLastName());
        const functionCell = createCell(entry.getFunction());
        const availableCell = createCell(entry.getAvailable() ? 'Yes' : 'No');
        const contractorCell = createCell(entry.getContractor() ? 'Yes' : 'No');
        const workloadCell = createCell(entry.getWorkload() + '%');

        row.appendChild(firstNameCell);
        row.appendChild(lastNameCell);
        row.appendChild(functionCell);
        row.appendChild(availableCell);
        row.appendChild(contractorCell);
        row.appendChild(workloadCell);

        tableElement.querySelector('tbody').appendChild(row);

        entry.onFirstNameChanged(() => firstNameCell.textContent = entry.getFirstName());
        entry.onLastNameChanged(() => lastNameCell.textContent = entry.getLastName());
        entry.onFunctionChanged(() => functionCell.textContent = entry.getFunction());
        entry.onAvailableChanged(() => availableCell.textContent = entry.getAvailable() ? 'Yes' : 'No');
        entry.onContractorChanged(() => contractorCell.textContent = entry.getContractor() ? 'Yes' : 'No');
        entry.onWorkloadChanged(() => workloadCell.textContent = entry.getWorkload() + '%');
    };

    masterDetailController.onEntryAdd(render);
};

const DetailView = (todoController, numberOfTasksElement) => {


};

