import { MasterDetailController, MasterItemsView, DetailView } from './masterDetail.js';

const masterDetailController = MasterDetailController();

// Bind the add button
document.getElementById('add-teammember').onclick = () => masterDetailController.addTeamMember();

// Initialize views
MasterItemsView(masterDetailController, document.getElementById('list'));
DetailView(masterDetailController, document.getElementById('teammember-form'));

// Start with one entry
masterDetailController.addTeamMember();
