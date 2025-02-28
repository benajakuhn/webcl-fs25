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
    let selectedEntry = null;

    const addTeamMember = () => {
        const newEntry = Entry();
        masterModel.add(newEntry);
        return newEntry;
    };

    const selectEntry = (entry) => {
        selectedEntry = entry;
        onEntrySelectListeners.forEach(listener => listener(entry));
    };

    const onEntrySelectListeners = [];
    const onEntrySelect = (listener) => onEntrySelectListeners.push(listener);

    return {
        numberOfTodos: masterModel.count,
        numberOfopenTasks: () => masterModel.countIf(todo => !todo.getDone()),
        addTeamMember: addTeamMember,
        onEntryAdd: masterModel.onAdd,
        selectEntry: selectEntry,
        onEntrySelect: onEntrySelect,
    };
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

        row.onclick = () => {
            masterDetailController.selectEntry(entry);
        };

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

const DetailView = (masterDetailController, formElement) => {

    const firstNameInput = formElement.querySelector('#firstName');
    const lastNameInput = formElement.querySelector('#lastName');
    const functionSelect = formElement.querySelector('#function');
    const availableYesRadio = formElement.querySelector('#availableYes');
    const availableNoRadio = formElement.querySelector('#availableNo');
    const contractorCheckbox = formElement.querySelector('#contractor');
    const workloadRange = formElement.querySelector('#workLoad');

    const render = entry => {
        firstNameInput.value = entry.getFirstName();
        lastNameInput.value = entry.getLastName();
        functionSelect.value = entry.getFunction();
        availableYesRadio.checked = entry.getAvailable();
        availableNoRadio.checked = !entry.getAvailable();
        contractorCheckbox.checked = entry.getContractor();
        workloadRange.value = entry.getWorkload();

        firstNameInput.oninput = () => entry.setFirstName(firstNameInput.value);
        lastNameInput.oninput = () => entry.setLastName(lastNameInput.value);
        functionSelect.onchange = () => entry.setFunction(functionSelect.value);
        availableYesRadio.onchange = () => entry.setAvailable(true);
        availableNoRadio.onchange = () => entry.setAvailable(false);
        contractorCheckbox.onchange = () => entry.setContractor(contractorCheckbox.checked);
        workloadRange.oninput = () => entry.setWorkload(workloadRange.value);
    };

    masterDetailController.onEntrySelect(render);
};

