import { ObservableList } from "../observable/observable.js";
import { Attribute } from "../presentationModel/presentationModel.js";

export { MasterDetailController, MasterItemsView, DetailView };

const MasterDetailController = () => {

    const Entry = () => {
        const firstNameAttr   = Attribute("John");
        const lastNameAttr    = Attribute("Doe");
        const functionAttr    = Attribute("Engineer");
        const availableAttr   = Attribute(false);
        const contractorAttr  = Attribute(false);
        const workloadAttr    = Attribute(0);

        // Helper to check if any field is dirty
        const isDirty = () =>
            firstNameAttr.dirtyObs.getValue() ||
            lastNameAttr.dirtyObs.getValue()  ||
            functionAttr.dirtyObs.getValue()  ||
            availableAttr.dirtyObs.getValue() ||
            contractorAttr.dirtyObs.getValue()||
            workloadAttr.dirtyObs.getValue();

        return {
            // First Name
            getFirstName: () => firstNameAttr.valueObs.getValue(),
            setFirstName: value => firstNameAttr.setValue(value),
            onFirstNameChanged: firstNameAttr.valueObs.onChange,
            onFirstNameDirty: firstNameAttr.dirtyObs.onChange,

            // Last Name
            getLastName: () => lastNameAttr.valueObs.getValue(),
            setLastName: value => lastNameAttr.setValue(value),
            onLastNameChanged: lastNameAttr.valueObs.onChange,
            onLastNameDirty: lastNameAttr.dirtyObs.onChange,

            // Function
            getFunction: () => functionAttr.valueObs.getValue(),
            setFunction: value => functionAttr.setValue(value),
            onFunctionChanged: functionAttr.valueObs.onChange,
            onFunctionDirty: functionAttr.dirtyObs.onChange,

            // Available
            getAvailable: () => availableAttr.valueObs.getValue(),
            setAvailable: value => availableAttr.setValue(value),
            onAvailableChanged: availableAttr.valueObs.onChange,
            onAvailableDirty: availableAttr.dirtyObs.onChange,

            // Contractor
            getContractor: () => contractorAttr.valueObs.getValue(),
            setContractor: value => contractorAttr.setValue(value),
            onContractorChanged: contractorAttr.valueObs.onChange,
            onContractorDirty: contractorAttr.dirtyObs.onChange,

            // Workload
            getWorkload: () => workloadAttr.valueObs.getValue(),
            setWorkload: value => workloadAttr.setValue(value),
            onWorkloadChanged: workloadAttr.valueObs.onChange,
            onWorkloadDirty: workloadAttr.dirtyObs.onChange,

            isDirty,
            reset: () => {
                firstNameAttr.reset();
                lastNameAttr.reset();
                functionAttr.reset();
                availableAttr.reset();
                contractorAttr.reset();
                workloadAttr.reset();
            },
            save: () => {
                firstNameAttr.save();
                lastNameAttr.save();
                functionAttr.save();
                availableAttr.save();
                contractorAttr.save();
                workloadAttr.save();
            }
        };
    };

    const masterModel = ObservableList([]);
    let selectedEntry = null;

    const addTeamMember = () => {
        const newEntry = Entry();
        masterModel.add(newEntry);
        return newEntry;
    };

    const deleteTeamMember = (entry) => {
        if (selectedEntry === entry) {
            selectedEntry = null;
            onEntrySelectListeners.forEach(listener => listener(null));
        }
        masterModel.del(entry);
    };

    const selectEntry = entry => {
        selectedEntry = entry;
        onEntrySelectListeners.forEach(listener => listener(entry));
    };

    const onEntrySelectListeners = [];
    const onEntrySelect = listener => onEntrySelectListeners.push(listener);

    return {
        addTeamMember,
        onEntryAdd: masterModel.onAdd,
        selectEntry,
        onEntrySelect,
        deleteTeamMember   // expose the delete function
    };
};


// --- Master View ---
const MasterItemsView = (masterDetailController, tableElement) => {
    let selectedRow = null;

    const render = entry => {
        const row = document.createElement('tr');

        // Helper to create a table cell that listens to dirty changes
        const createCell = (value, onDirty) => {
            const cell = document.createElement('td');
            cell.textContent = value;
            onDirty(dirty => {
                if (dirty) {
                    cell.classList.add('dirty');
                } else {
                    cell.classList.remove('dirty');
                }
            });
            return cell;
        };

        const firstNameCell = createCell(entry.getFirstName(), entry.onFirstNameDirty);
        const lastNameCell  = createCell(entry.getLastName(), entry.onLastNameDirty);
        const functionCell  = createCell(entry.getFunction(), entry.onFunctionDirty);
        const availableCell = createCell(entry.getAvailable() ? 'Yes' : 'No', entry.onAvailableDirty);
        const contractorCell = createCell(entry.getContractor() ? 'Yes' : 'No', entry.onContractorDirty);
        const workloadCell  = createCell(entry.getWorkload() + '%', entry.onWorkloadDirty);

        row.appendChild(firstNameCell);
        row.appendChild(lastNameCell);
        row.appendChild(functionCell);
        row.appendChild(availableCell);
        row.appendChild(contractorCell);
        row.appendChild(workloadCell);

        const deleteCell = document.createElement('td');
        const deleteButton = document.createElement('button');
        deleteButton.textContent = "Delete";
        deleteButton.onclick = (e) => {
            e.stopPropagation(); // Prevent row selection when clicking delete
            masterDetailController.deleteTeamMember(entry);
            row.remove();
        };
        deleteCell.appendChild(deleteButton);
        row.appendChild(deleteCell);

        row.onclick = () => {
            if (selectedRow) {
                selectedRow.classList.remove('selected-row');
            }
            row.classList.add('selected-row');
            selectedRow = row;
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

// --- Detail View ---
const DetailView = (masterDetailController, formElement) => {
    const firstNameInput  = formElement.querySelector('#firstName');
    const lastNameInput   = formElement.querySelector('#lastName');
    const functionSelect  = formElement.querySelector('#function');
    const availableYesRadio = formElement.querySelector('#availableYes');
    const availableNoRadio  = formElement.querySelector('#availableNo');
    const contractorCheckbox = formElement.querySelector('#contractor');
    const workloadRange   = formElement.querySelector('#workLoad');
    const saveButton      = formElement.querySelector('#save-button');
    const resetButton     = formElement.querySelector('#reset-button');

    let currentEntry = null;

    const updateDirtyState = () => {
        if (!currentEntry) return;
        saveButton.disabled = !currentEntry.isDirty();
        resetButton.disabled = !currentEntry.isDirty();
    };

    // Utility: attach a listener to update an input’s dirty style
    const markFieldDirty = (inputElement, onDirty) => {
        onDirty(dirty => {
            if (dirty) {
                inputElement.classList.add('dirty');
            } else {
                inputElement.classList.remove('dirty');
            }
            updateDirtyState();
        });
    };

    // Function to deactivate the form when no entry is selected
    const deactivateForm = () => {
        formElement.classList.add('unselected');
        // Clear values
        firstNameInput.value = '';
        lastNameInput.value = '';
        functionSelect.value = '';
        availableYesRadio.checked = false;
        availableNoRadio.checked = false;
        contractorCheckbox.checked = false;
        workloadRange.value = 0;

        // Disable inputs so they cannot be changed
        firstNameInput.disabled = true;
        lastNameInput.disabled = true;
        functionSelect.disabled = true;
        availableYesRadio.disabled = true;
        availableNoRadio.disabled = true;
        contractorCheckbox.disabled = true;
        workloadRange.disabled = true;
        saveButton.disabled = true;
        resetButton.disabled = true;
    };

    // Function to activate the form when an entry is selected
    const activateForm = () => {
        formElement.classList.remove('unselected');
        firstNameInput.disabled = false;
        lastNameInput.disabled = false;
        functionSelect.disabled = false;
        availableYesRadio.disabled = false;
        availableNoRadio.disabled = false;
        contractorCheckbox.disabled = false;
        workloadRange.disabled = false;
    };

    const render = entry => {
        if (!entry) {
            currentEntry = null;
            deactivateForm();
            return;
        }
        currentEntry = entry;
        activateForm();

        // Populate form fields from the entry
        firstNameInput.value = entry.getFirstName();
        lastNameInput.value  = entry.getLastName();
        functionSelect.value = entry.getFunction();
        availableYesRadio.checked = entry.getAvailable();
        availableNoRadio.checked  = !entry.getAvailable();
        contractorCheckbox.checked = entry.getContractor();
        workloadRange.value  = entry.getWorkload();

        // Wire up changes to update the model
        firstNameInput.oninput = () => entry.setFirstName(firstNameInput.value);
        lastNameInput.oninput  = () => entry.setLastName(lastNameInput.value);
        functionSelect.onchange = () => entry.setFunction(functionSelect.value);
        availableYesRadio.onchange = () => entry.setAvailable(true);
        availableNoRadio.onchange  = () => entry.setAvailable(false);
        contractorCheckbox.onchange = () => entry.setContractor(contractorCheckbox.checked);
        workloadRange.oninput  = () => entry.setWorkload(workloadRange.value);

        // Attach dirty listeners to mark inputs as dirty
        markFieldDirty(firstNameInput, entry.onFirstNameDirty);
        markFieldDirty(lastNameInput, entry.onLastNameDirty);
        markFieldDirty(functionSelect, entry.onFunctionDirty);
        markFieldDirty(availableYesRadio, entry.onAvailableDirty);
        markFieldDirty(contractorCheckbox, entry.onContractorDirty);
        markFieldDirty(workloadRange, entry.onWorkloadDirty);

        updateDirtyState();

        // Save and Reset handlers
        saveButton.onclick = () => {
            entry.save();
            // Refresh the form display after saving
            firstNameInput.value = entry.getFirstName();
            lastNameInput.value  = entry.getLastName();
            functionSelect.value = entry.getFunction();
            availableYesRadio.checked = entry.getAvailable();
            availableNoRadio.checked  = !entry.getAvailable();
            contractorCheckbox.checked = entry.getContractor();
            workloadRange.value  = entry.getWorkload();
            updateDirtyState();
        };

        resetButton.onclick = () => {
            entry.reset();
            firstNameInput.value = entry.getFirstName();
            lastNameInput.value  = entry.getLastName();
            functionSelect.value = entry.getFunction();
            availableYesRadio.checked = entry.getAvailable();
            availableNoRadio.checked  = !entry.getAvailable();
            contractorCheckbox.checked = entry.getContractor();
            workloadRange.value  = entry.getWorkload();
            updateDirtyState();
        };
    };

    // Initially deactivate the form (since no entry is selected)
    deactivateForm();

    masterDetailController.onEntrySelect(render);
};
