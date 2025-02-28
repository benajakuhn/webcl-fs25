import { ObservableList } from "../observable/observable.js";
import { Attribute }      from "../presentationModel/presentationModel.js";

export { MasterDetailController, MasterItemsView, DetailView }

const MasterDetailController = () => {

    const Entry = () => {
        const firstNameAttr = Attribute("John");
        const lastNameAttr  = Attribute("Doe");
        const functionAttr  = Attribute("Engineer");
        const availableAttr = Attribute(false);
        const contractorAttr = Attribute(false);
        const workloadAttr  = Attribute(0);

        const originalValues = {
            firstName: firstNameAttr.valueObs.getValue(),
            lastName:  lastNameAttr.valueObs.getValue(),
            function:  functionAttr.valueObs.getValue(),
            available: availableAttr.valueObs.getValue(),
            contractor: contractorAttr.valueObs.getValue(),
            workload:  workloadAttr.valueObs.getValue()
        };

        const dirtyAttrs = {
            firstName: Attribute(false),
            lastName:  Attribute(false),
            function:  Attribute(false),
            available: Attribute(false),
            contractor: Attribute(false),
            workload:  Attribute(false)
        };

        // Update dirty flags when values change
        firstNameAttr.valueObs.onChange(newVal => {
            dirtyAttrs.firstName.valueObs.setValue(newVal !== originalValues.firstName);
        });
        lastNameAttr.valueObs.onChange(newVal => {
            dirtyAttrs.lastName.valueObs.setValue(newVal !== originalValues.lastName);
        });
        functionAttr.valueObs.onChange(newVal => {
            dirtyAttrs.function.valueObs.setValue(newVal !== originalValues.function);
        });
        availableAttr.valueObs.onChange(newVal => {
            dirtyAttrs.available.valueObs.setValue(newVal !== originalValues.available);
        });
        contractorAttr.valueObs.onChange(newVal => {
            dirtyAttrs.contractor.valueObs.setValue(newVal !== originalValues.contractor);
        });
        workloadAttr.valueObs.onChange(newVal => {
            dirtyAttrs.workload.valueObs.setValue(Number(newVal) !== originalValues.workload);
        });

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

            isDirty: (attr) => dirtyAttrs[attr].valueObs.getValue(),
            setDirty: (attr, value) => dirtyAttrs[attr].valueObs.setValue(value),
            onDirtyChanged: (attr, callback) => dirtyAttrs[attr].valueObs.onChange(callback),

            reset: () => {
                firstNameAttr.valueObs.setValue(originalValues.firstName);
                lastNameAttr.valueObs.setValue(originalValues.lastName);
                functionAttr.valueObs.setValue(originalValues.function);
                availableAttr.valueObs.setValue(originalValues.available);
                contractorAttr.valueObs.setValue(originalValues.contractor);
                workloadAttr.valueObs.setValue(originalValues.workload);
                Object.keys(dirtyAttrs).forEach(attr => dirtyAttrs[attr].valueObs.setValue(false));
            },

            save: () => {
                // Commit current values as new originals
                originalValues.firstName = firstNameAttr.valueObs.getValue();
                originalValues.lastName  = lastNameAttr.valueObs.getValue();
                originalValues.function  = functionAttr.valueObs.getValue();
                originalValues.available = availableAttr.valueObs.getValue();
                originalValues.contractor = contractorAttr.valueObs.getValue();
                originalValues.workload  = workloadAttr.valueObs.getValue();
                Object.keys(dirtyAttrs).forEach(attr => dirtyAttrs[attr].valueObs.setValue(false));
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

// --- Master View ---
const MasterItemsView = (masterDetailController, tableElement) => {
    let selectedRow = null;

    const render = entry => {
        const row = document.createElement('tr');

        const createCell = (value, attrName) => {
            const cell = document.createElement('td');
            cell.textContent = value;
            // Update cell style when the underlying value is dirty
            entry.onDirtyChanged(attrName, () => {
                if (entry.isDirty(attrName)) {
                    cell.classList.add('dirty');
                } else {
                    cell.classList.remove('dirty');
                }
            });
            return cell;
        };

        const firstNameCell = createCell(entry.getFirstName(), "firstName");
        const lastNameCell  = createCell(entry.getLastName(), "lastName");
        const functionCell  = createCell(entry.getFunction(), "function");
        const availableCell = createCell(entry.getAvailable() ? 'Yes' : 'No', "available");
        const contractorCell = createCell(entry.getContractor() ? 'Yes' : 'No', "contractor");
        const workloadCell  = createCell(entry.getWorkload() + '%', "workload");

        row.appendChild(firstNameCell);
        row.appendChild(lastNameCell);
        row.appendChild(functionCell);
        row.appendChild(availableCell);
        row.appendChild(contractorCell);
        row.appendChild(workloadCell);

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
        const isDirty = currentEntry.isDirty("firstName") ||
            currentEntry.isDirty("lastName") ||
            currentEntry.isDirty("function") ||
            currentEntry.isDirty("available") ||
            currentEntry.isDirty("contractor") ||
            currentEntry.isDirty("workload");
        saveButton.disabled = !isDirty;
        resetButton.disabled = !isDirty;
    };

    const markFieldDirty = (inputElement, attrName) => {
        currentEntry.onDirtyChanged(attrName, () => {
            if (currentEntry.isDirty(attrName)) {
                inputElement.classList.add('dirty');
            } else {
                inputElement.classList.remove('dirty');
            }
            updateDirtyState();
        });
    };

    const render = entry => {
        currentEntry = entry;
        formElement.classList.remove('unselected');

        // Populate form fields from the selected entry
        firstNameInput.value  = entry.getFirstName();
        lastNameInput.value   = entry.getLastName();
        functionSelect.value  = entry.getFunction();
        availableYesRadio.checked = entry.getAvailable();
        availableNoRadio.checked  = !entry.getAvailable();
        contractorCheckbox.checked = entry.getContractor();
        workloadRange.value   = entry.getWorkload();

        // Wire up changes to update the model
        firstNameInput.oninput = () => entry.setFirstName(firstNameInput.value);
        lastNameInput.oninput  = () => entry.setLastName(lastNameInput.value);
        functionSelect.onchange = () => entry.setFunction(functionSelect.value);
        availableYesRadio.onchange = () => entry.setAvailable(true);
        availableNoRadio.onchange  = () => entry.setAvailable(false);
        contractorCheckbox.onchange = () => entry.setContractor(contractorCheckbox.checked);
        workloadRange.oninput  = () => entry.setWorkload(workloadRange.value);

        // Mark each field when dirty
        markFieldDirty(firstNameInput, "firstName");
        markFieldDirty(lastNameInput, "lastName");
        markFieldDirty(functionSelect, "function");
        markFieldDirty(availableYesRadio, "available"); // use one of the radio buttons
        markFieldDirty(contractorCheckbox, "contractor");
        markFieldDirty(workloadRange, "workload");

        updateDirtyState();

        // Save and Reset handlers
        saveButton.onclick = () => {
            entry.save();
            firstNameInput.value  = entry.getFirstName();
            lastNameInput.value   = entry.getLastName();
            functionSelect.value  = entry.getFunction();
            availableYesRadio.checked = entry.getAvailable();
            availableNoRadio.checked  = !entry.getAvailable();
            contractorCheckbox.checked = entry.getContractor();
            workloadRange.value   = entry.getWorkload();
            updateDirtyState();
        };

        resetButton.onclick = () => {
            entry.reset();
            firstNameInput.value  = entry.getFirstName();
            lastNameInput.value   = entry.getLastName();
            functionSelect.value  = entry.getFunction();
            availableYesRadio.checked = entry.getAvailable();
            availableNoRadio.checked  = !entry.getAvailable();
            contractorCheckbox.checked = entry.getContractor();
            workloadRange.value   = entry.getWorkload();
            updateDirtyState();
        };
    };

    masterDetailController.onEntrySelect(render);
};
