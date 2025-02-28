
import { MasterDetailController, MasterItemsView, DetailView} from './masterDetail.js';

const masterDetailController = MasterDetailController();

// binding of the main view

document.getElementById('add-teammember').onclick    = _ => masterDetailController.addTeamMember();

MasterItemsView(masterDetailController, document.getElementById('list'));
DetailView(masterDetailController, document.getElementById('teammember-form'));

// init the model
masterDetailController.addTeamMember();
